import json
import random

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseServerError
from django.views.decorators.http import require_POST

from reversiapp.channel.game import send_game_start_data_to_channel_layer, send_log_message
from reversiapp.models import find_room_by_id, find_not_started_player_room_belongings_by_room, assign_stone_users


@login_required
@require_POST
def start_game(request):
    received_data = request.POST

    # search a room to start game
    room = find_room_by_id(received_data['roomId'])

    # search player room belongings
    player_room_belongings = find_not_started_player_room_belongings_by_room(room)
    if len(player_room_belongings) > 2:
        return _find_mismatched_data(room.id)  # found more than two players
    elif len(player_room_belongings) < 2:
        return _num_of_players_not_enough(len(player_room_belongings), room.id)

    # assign stone
    if random.random() >= 0.5:
        black_stone_room_belongings, white_stone_room_belongings = (
            player_room_belongings[0], player_room_belongings[1])
    else:
        black_stone_room_belongings, white_stone_room_belongings = (
            player_room_belongings[1], player_room_belongings[0])
    assign_stone_users(black_stone_room_belongings, white_stone_room_belongings)

    # send user id of white/black stone player
    send_game_start_data_to_channel_layer(room.id, black_stone_room_belongings.user_id,
                                          white_stone_room_belongings.user_id)
    return JsonResponse({'succeeded': True, 'err_msg': ''})


def _num_of_players_not_enough(player_num: int, room_id: int):
    return JsonResponse({'succeeded': False,
                         'err_msg': f'プレイヤーの人数が不足しているため、ゲームを開始できませんでした。'
                         f' (現在プレイヤー人数： {player_num}, 必要プレイヤー人数: 2)'})


def _find_mismatched_data(room_id: int):
    error_message = 'データに不整合が検出されました。恐れ入りますが、もう一度部屋に入りなおしてください。'
    send_log_message(room_id, error_message)
    return HttpResponseServerError(json.dumps({'err_msg': error_message}))
