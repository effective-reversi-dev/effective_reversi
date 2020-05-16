import json
from typing import List, Dict, Any, Awaitable

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from reversiapp.models import get_room_data, delete_belongings, find_belonging_rooms_by_user, delete_empty_room, \
    find_room_belongings_by_room, find_room_by_id


class GameConsumer(AsyncWebsocketConsumer):
    SEND_GAME_START_DATA = 'send_game_start_data'
    START_GAME_CLIENT_ACTION_TYPE = 'start_game'
    SEND_ENTERING_MEMBER_DATA = 'send_entering_member_data'
    SEND_ENTERING_MEMBER_DATA_CLIENT_ACTION_TYPE = 'entering_member_data'
    SEND_EXITING_MEMBER_DATA = 'send_exiting_member_data'
    SEND_EXITING_MEMBER_DATA_CLIENT_ACTION_TYPE = 'exiting_member_data'
    SEND_PLAYER_STONE_CLIENT_ACTION_TYPE = 'player_stone'

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = create_game_consumer_group_name(self.room_name)

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name)

        await self.accept()
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': GameConsumer.SEND_ENTERING_MEMBER_DATA,
                'additional': self.scope['user'].display_name
            })

    async def disconnect(self, close_code):
        # Leave from group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name)

        # 適切な退室処理が行われず突如クライアントとの接続が切れた場合を想定した念のための処理
        await self.delete_belonging()
        # TODO 部屋の所属状況が変わったら下のsendが自動で呼ばれるようにしたい。
        await self.channel_layer.group_send(RoomSelectionConsumer.ROOM_SELECTION_GROUP,
                                            {'type': RoomSelectionConsumer.SEND_ROOM_DATA})
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': GameConsumer.SEND_EXITING_MEMBER_DATA,
                'left_user': {
                    'display_name': self.scope['user'].display_name,
                    'user_name': self.scope['user'].username
                }
            })

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
            })

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        message['displayName'] = event['display_name']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def send_game_start_data(self, event):
        message = {
            'type': GameConsumer.START_GAME_CLIENT_ACTION_TYPE,
            'data': {
                'blackUserName': event['blackUserName'],
                'blackDisplayName': event['blackDisplayName'],
                'whiteUserName': event['whiteUserName'],
                'whiteDisplayName': event['whiteDisplayName'],
            }
        }
        await self.send(text_data=json.dumps({
            'message': message
        }))
        await self.send(text_data=json.dumps({
            'message': {
                'type': GameConsumer.SEND_PLAYER_STONE_CLIENT_ACTION_TYPE,
                'blackDisplayName': event['blackDisplayName'],
                'whiteDisplayName': event['whiteDisplayName']
            }
        }))

    async def send_entering_member_data(self, event):
        # {
        #  'type': 'entering_member_data,
        #  'members': [{
        #          'displayName': 'ユーザ表示名'
        #          'attribute': '属性', {wh, bl, un, sp} のいずれか
        #       }],
        #  'additional': '今回入室したユーザの表示名'
        # }
        belongings = await self.get_belongings()
        await self.send(text_data=json.dumps(
            {'message': {'type': GameConsumer.SEND_ENTERING_MEMBER_DATA_CLIENT_ACTION_TYPE,
                         'members': belongings,
                         'additional': event['additional']}}))

    async def send_exiting_member_data(self, event):
        # {
        #  'type': 'exiting_member_data,
        #  'members': [{
        #          'displayName': 'ユーザ表示名'
        #          'attribute': '属性', {wh, bl, un, sp} のいずれか
        #       }],
        #  'leftUser': {
        #       'userName': '今回退出したユーザのユーザ名',
        #       'displayName': '今回退出したユーザの表示名'
        #   }
        # }
        belongings = await self.get_belongings()
        await self.send(text_data=json.dumps(
            {'message': {'type': GameConsumer.SEND_EXITING_MEMBER_DATA_CLIENT_ACTION_TYPE,
                         'members': belongings,
                         'leftUser': {
                             'displayName': event['left_user']['display_name'],
                             'userName': event['left_user']['user_name']
                         }}}))

    @database_sync_to_async
    def delete_belonging(self) -> Awaitable[None]:
        # TODO 所属情報が消えたら自動で空部屋が消えるようにしたい。
        rooms = find_belonging_rooms_by_user(self.scope['user'])
        delete_belongings(self.scope['user'])
        delete_empty_room(rooms)

    @database_sync_to_async
    def get_belongings(self) -> Awaitable[List[Dict[str, Any]]]:
        room = find_room_by_id(self.scope['url_route']['kwargs']['room_id'])
        belongings = find_room_belongings_by_room(room)
        return [{'displayName': b.user_id.display_name, 'attribute': b.user_attr}
                for b in belongings]


def create_game_consumer_group_name(room_id: int) -> str:
    return f'game_{room_id}'


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
    def get_room_data_async(self) -> Awaitable[List[Dict[str, Any]]]:
        return get_room_data()
