import json

from channels.generic.websocket import AsyncWebsocketConsumer


class GameConsumer(AsyncWebsocketConsumer):
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
