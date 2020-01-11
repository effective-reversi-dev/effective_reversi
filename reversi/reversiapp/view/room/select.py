import json

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET

from reversiapp.channel.room_modification import send_room_data_to_channel_layer
from reversiapp.models import get_room_data, check_existence_of_belonging, create_room_belonging, \
    find_rooms_by_id, find_room_belongings_by_room
from userconfig.models import User


@login_required
@require_GET
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
def enter_room(request):
    # POST経由で受け取るデータ
    # received_data = {
    #   'roomId': '入りたい部屋ID',
    #   'isSpectator': '観戦者として入場するか'
    #   'password' : 'パスワード' (nullはありえない。設定無しのばあいは空文字が入る。)
    # }
    # ※ ユーザ情報はセッション情報から取れる
    #

    # TODO modelの取り扱いが生っぽい感じになっているのでどこかに切り出したい。
    received_data = request.POST
    is_spectator = json.loads(received_data['isSpectator'])
    room_id = json.loads(received_data['roomId'])
    rooms = find_rooms_by_id(room_id)
    if len(rooms) == 0:
        return _room_not_found()
    room = rooms[0]

    # requestのpassword は nullable. django model側は空文字で表現
    if room.password != received_data['password']:
        return _password_mismatched()

    if check_existence_of_belonging(request.user):
        response = _already_entered()
    else:
        belonging_users = find_room_belongings_by_room(room)
        if is_spectator:
            response = _enter_as_spectator(request, room, belonging_users)
        else:
            response = _enter_as_participant(request, room, belonging_users)

    send_room_data_to_channel_layer()
    return response


def _enter_as_spectator(request, room, belonging_users):
    user: User = request.user
    count_spectator = len([col for col in belonging_users if col.is_spectator])
    max_spectator = room.max_spectator
    if count_spectator + 1 > max_spectator:
        return _spectator_overflow()
    create_room_belonging(user=user, room=room, is_spectator=True)
    return JsonResponse({'succeeded': True, 'err_msg': ''})


def _enter_as_participant(request, room, belonging_users):
    user: User = request.user
    count_participant = len([col for col in belonging_users if not col.is_spectator])
    max_participant = room.max_participant
    if count_participant + 1 > max_participant:
        return _participant_overflow()
    create_room_belonging(user=user, room=room, is_spectator=False)
    return JsonResponse({'succeeded': True, 'err_msg': ''})


def _room_not_found():
    return JsonResponse({'succeeded': False, 'err_msg': '指定された部屋が存在しません。'})


def _spectator_overflow():
    return JsonResponse({'succeeded': False, 'err_msg': '観戦者がすでに満員です。'})


def _participant_overflow():
    return JsonResponse({'succeeded': False, 'err_msg': '対戦者がすでに満員です。'})


def _already_entered():
    return JsonResponse({'succeeded': False, 'err_msg': '既に入室済みです。入室状況をリセットしてください。'})


def _password_mismatched():
    return JsonResponse({'succeeded': False, 'err_msg': 'パスワードが正しくありません。'})
