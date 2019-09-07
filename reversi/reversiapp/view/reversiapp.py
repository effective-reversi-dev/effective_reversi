import json

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST

from common.add_user_info import add_user_info
from reversi_websocket.consumers import RoomSelectionConsumer
from reversiapp.models import Room, RoomBelongings, get_room_data, delete_belongings, check_existence_of_belonging
from userconfig.models import User


@login_required
@add_user_info
def reversiapp(request):
    return render(request, 'reversiapp/index.html')


@login_required
@require_POST
def fetch_room_data(request):
    # initial data の構造
    # {
    #  'room_data': [
    #       {
    #          'room_id': 'Roomモデルのid'
    #          'room_name': 'Roomモデルのroom_name',
    #          'count_spectator': '観戦者人数'
    #          'max_spectator': '許容される観戦者人数',
    #          'count_participant': '対戦者人数'
    #          'max_participant': '許容される対戦者人数',
    #       }
    #   ]
    # }
    room_info_dicts = get_room_data()
    return JsonResponse({'room_data': room_info_dicts})


@login_required
@require_POST
def exit_room(request):
    user: User = request.user
    delete_belongings(user)
    _send_room_data_to_channel_layer()
    return JsonResponse({'succeeded': True, 'err_msg': ''})


@login_required
@require_POST
def enter_room(request):
    # POST経由で受け取るデータ
    # received_data = {
    #   'roomId': '入りたい部屋ID',
    #   'isSpectator': '観戦者として入場するか'
    # }
    # ※ ユーザ情報はセッション情報から取れる
    #

    # TODO modelの取り扱いが生っぽい感じになっているのでどこかに切り出したい。
    received_data = request.POST
    is_spectator = json.loads(received_data['isSpectator'])
    room_id = json.loads(received_data['roomId'])
    rooms = Room.objects.filter(id=room_id)
    if len(rooms) == 0:
        return _room_not_found()

    room = rooms[0]
    if check_existence_of_belonging(request.user):
        response = _already_entered()
    else:
        belonging_users = RoomBelongings.objects.filter(room_id=room_id)
        if is_spectator:
            response = _enter_as_spectator(request, room, belonging_users)
        else:
            response = _enter_as_participant(request, room, belonging_users)

    _send_room_data_to_channel_layer()
    return response


def _enter_as_spectator(request, room, belonging_users):
    user: User = request.user
    count_spectator = len([col for col in belonging_users if col.is_spectator])
    max_spectator = room.max_spectator
    if count_spectator + 1 > max_spectator:
        return _room_overflow()
    RoomBelongings.objects.create(user_id=user, room_id=room, is_spectator=True)
    return JsonResponse({'succeeded': True, 'err_msg': ''})


def _enter_as_participant(request, room, belonging_users):
    user: User = request.user
    count_participant = len([col for col in belonging_users if not col.is_spectator])
    max_participant = room.max_participant
    if count_participant + 1 > max_participant:
        return _room_overflow()
    RoomBelongings.objects.create(user_id=user, room_id=room, is_spectator=False)
    return JsonResponse({'succeeded': True, 'err_msg': ''})


def _room_not_found():
    return JsonResponse({'succeeded': False, 'err_msg': '指定された部屋が存在しません。'})


def _room_overflow():
    return JsonResponse({'succeeded': False, 'err_msg': '部屋がすでに満室です。'})


def _already_entered():
    return JsonResponse({'succeeded': False, 'err_msg': '既に入室済みです。入室状況をリセットしてください。'})


@async_to_sync
async def _send_room_data_to_channel_layer():
    await get_channel_layer().group_send(RoomSelectionConsumer.ROOM_SELECTION_GROUP,
                                         {'type': RoomSelectionConsumer.SEND_ROOM_DATA})
