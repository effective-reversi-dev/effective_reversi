import json

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST

from reversiapp.channel.room_modification import send_room_data_to_channel_layer
from reversiapp.models import create_room as create_room_model, create_room_belonging
from userconfig.models import User


@login_required
@require_POST
def create_room(request):
    # request.POST の構造
    # {
    #    'roomName': <Roomモデルのroom_name>,
    #    'password': <パスワード> (nullはこない。設定無しの場合空文字。),
    #    'maxSpectator': <許容される観戦者人数>,
    #    'isSpectator': <観戦者モードで入室するか否か>
    # }
    user: User = request.user
    post_data = request.POST
    room_name = post_data['roomName']
    password = post_data['password']
    # 画面で入力制御してるため、型の心配はない。
    max_spectator = json.loads(post_data['maxSpectator'])
    is_spectator = json.loads(post_data['isSpectator'])
    room = create_room_model(room_name=room_name, password=password, max_spectator=max_spectator, max_participant=2)
    create_room_belonging(room=room, user=user, is_spectator=is_spectator)
    send_room_data_to_channel_layer()
    # 一旦パスワード・部屋名に対するバリデーションはしていない。
    return JsonResponse({'succeeded': True, 'room_id': room.id, 'err_msg': ''})
