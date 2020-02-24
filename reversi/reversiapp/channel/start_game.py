from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from reversi_websocket.consumers import GameConsumer, create_game_consumer_group_name
from userconfig.models import User


@async_to_sync
async def send_game_start_data_to_channel_layer(room_name: int, black_stone_user: User, white_stone_user: User):
    await get_channel_layer().group_send(create_game_consumer_group_name(room_name), {
        'type': GameConsumer.SEND_GAME_START_DATA,
        'blackUserName': black_stone_user.username,
        'blackDisplayName': black_stone_user.display_name,
        'whiteUserName': white_stone_user.username,
        'whiteDisplayName': white_stone_user.display_name,
    })
