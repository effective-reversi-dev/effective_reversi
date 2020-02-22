import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from reversiapp.models import get_room_data, delete_belongings, find_belonging_rooms_by_user, delete_empty_room


class GameConsumer(AsyncWebsocketConsumer):
    SEND_GAME_START_DATA = 'send_game_start_data'
    START_GAME_CLIENT_ACTION_TYPE = 'start_game'

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'game_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave from group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        # 適切な退室処理が行われず突如クライアントとの接続が切れた場合を想定した念のための処理
        await self.delete_belonging()
        # TODO 部屋の所属状況が変わったら下のsendが自動で呼ばれるようにしたい。
        await self.channel_layer.group_send(RoomSelectionConsumer.ROOM_SELECTION_GROUP,
                                            {'type': RoomSelectionConsumer.SEND_ROOM_DATA})

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        data = text_data_json['data']
        action_type = text_data_json['type']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': {'data': data, 'type': action_type},
                'user_name': self.scope['user'].username,
                'display_name': self.scope['user'].display_name
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        message['displayName'] = event['display_name']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def send_game_start_data(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))

    @database_sync_to_async
    def delete_belonging(self):
        # TODO 所属情報が消えたら自動で空部屋が消えるようにしたい。
        rooms = find_belonging_rooms_by_user(self.scope['user'])
        delete_belongings(self.scope['user'])
        delete_empty_room(rooms)


class RoomSelectionConsumer(AsyncWebsocketConsumer):
    ROOM_SELECTION_GROUP = 'room_selection'
    SEND_ROOM_DATA = 'send_room_data'
    ROOM_DATA_CLIENT_ACTION_TYPE = 'room_data'

    async def connect(self):
        # 全てのchannelを同じgroupに!
        self.group_name = RoomSelectionConsumer.ROOM_SELECTION_GROUP

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name)

    # 一応口を作っておくけど多分よばれない。
    # TODO 本当に不要なら消すこと
    async def receive(self, text_data):
        await self.channel_layer.group_send(
            self.group_name,
            {'type': RoomSelectionConsumer.SEND_ROOM_DATA})

    # Receive message from room group
    async def send_room_data(self, event):
        room_info_dicts = await self.get_room_data_async()
        await self.send(text_data=json.dumps(
            {'message':
                {'type': RoomSelectionConsumer.ROOM_DATA_CLIENT_ACTION_TYPE,
                 'roomData': room_info_dicts}}))

    @database_sync_to_async
    def get_room_data_async(self):
        return get_room_data()
