from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from reversi_websocket.consumers import RoomSelectionConsumer


@async_to_sync
async def send_room_data_to_channel_layer():
    await get_channel_layer().group_send(RoomSelectionConsumer.ROOM_SELECTION_GROUP,
                                         {'type': RoomSelectionConsumer.SEND_ROOM_DATA})
