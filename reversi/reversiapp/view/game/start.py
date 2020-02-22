import random
import json

from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import JsonResponse, HttpResponseServerError

from reversiapp.models import find_room_by_id, find_not_started_player_room_belongings_by_room, assign_stone_users
from reversiapp.channel.start_game import send_game_start_data_to_channel_layer


@login_required
@require_POST
def start_game(request):
    received_data = request.POST

    # search a room to start game
    room = find_room_by_id(received_data['roomId'])

    # search player room belongings
    player_room_belongings = find_not_started_player_room_belongings_by_room(room)
    if len(player_room_belongings) > 2:
        return _find_mismatched_data()  # found more than two players
    elif len(player_room_belongings) < 2:
        return _num_of_players_not_enough(len(player_room_belongings))

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


def _num_of_players_not_enough(player_num):
    return JsonResponse({'succeeded': False, 'err_msg': f'プレイヤーの人数が不足しています。(現在プレイヤー人数： {player_num})'})
