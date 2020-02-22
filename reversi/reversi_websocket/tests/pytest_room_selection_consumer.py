import json

import pytest
from channels.layers import get_channel_layer
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.testing import WebsocketCommunicator
from django.urls import path

from reversi_websocket.consumers import RoomSelectionConsumer
from reversiapp.models import Room, RoomBelongings, UserAttr
from userconfig.models import User


@pytest.mark.django_db(transaction=True)
@pytest.mark.asyncio
async def test_room_selection_consumer():
    # prepare test data
    user1 = _prepare_test_user_data('dummy1', 'dummy1_display', 'aaaaaaaaaa', email='aaa1@aaa.aaa.aa')
    user2 = _prepare_test_user_data('dummy2', 'dummy2_display', 'aaaaaaaaaa', email='aaa2@aaa.aaa.aa')
    user3 = _prepare_test_user_data('dummy3', 'dummy3_display', 'aaaaaaaaaa', email='aaa3@aaa.aaa.aa')
    user4 = _prepare_test_user_data('dummy4', 'dummy4_display', 'aaaaaaaaaa', email='aaa4@aaa.aaa.aa')
    user5 = _prepare_test_user_data('dummy5', 'dummy5_display', 'aaaaaaaaaa', email='aaa5@aaa.aaa.aa')

    room1 = _prepare_test_room('room1', 'aaaaaaaaaa', 4, 2)
    room2 = _prepare_test_room('room2', 'aaaaaaaaaa', 4, 2)
    room3 = _prepare_test_room('room3', 'aaaaaaaaaa', 4, 2)

    _prepare_test_belongings(room1, user1, True)
    _prepare_test_belongings(room1, user2, True)
    _prepare_test_belongings(room1, user3, False)
    _prepare_test_belongings(room2, user4, True)
    _prepare_test_belongings(room3, user5, False)

    # prepare test communicator
    app = ProtocolTypeRouter({'websocket':
                                  URLRouter([path('ws/room_selection/', RoomSelectionConsumer)])})
    communicator = WebsocketCommunicator(app, 'ws/room_selection/')

    # test connection
    connected, subprotocol = await communicator.connect()
    assert connected
    await communicator.send_to(text_data=RoomSelectionConsumer.SEND_ROOM_DATA)
    response = await communicator.receive_from()
    response_data = json.loads(response)
    response_data['message']['roomData'] = sorted(response_data['message']['roomData'], key=lambda x: x['room_id'])
    expected_room_data = {
        'message': {
            'type': RoomSelectionConsumer.ROOM_DATA_CLIENT_ACTION_TYPE,
            'roomData': [{
                'room_id': room1.id,
                'room_name': room1.room_name,
                'count_spectator': 2,
                'max_spectator': 4,
                'count_participant': 1,
                'max_participant': 2,
                'has_password': True},
                {
                    'room_id': room2.id,
                    'room_name': room2.room_name,
                    'count_spectator': 1,
                    'max_spectator': 4,
                    'count_participant': 0,
                    'max_participant': 2,
                    'has_password': True},
                {
                    'room_id': room3.id,
                    'room_name': room3.room_name,
                    'count_spectator': 0,
                    'max_spectator': 4,
                    'count_participant': 1,
                    'max_participant': 2,
                    'has_password': True},
            ]
        }
    }
    assert response_data == expected_room_data

    # test channel_layer
    await get_channel_layer().group_send(RoomSelectionConsumer.ROOM_SELECTION_GROUP,
                                         {'type': RoomSelectionConsumer.SEND_ROOM_DATA})
    response = await communicator.receive_from()
    response_data = json.loads(response)
    response_data['message']['roomData'] = sorted(response_data['message']['roomData'], key=lambda x: x['room_id'])
    assert response_data == expected_room_data

    # Close
    await communicator.disconnect()


def _prepare_test_user_data(username='dummy', display='dummy_display',
                            password='aaaaaaaaaa', email='aaa@aaa.aaa.aa'):
    user = User.objects.create_user(username=username, password=password,
                                    email=email, display_name=display)
    return user


def _prepare_test_room(room_name, password, max_spectator=4, max_participant=2) -> Room:
    return Room.objects.create(room_name=room_name, password=password,
                               max_spectator=max_spectator, max_participant=max_participant)


def _prepare_test_belongings(room: Room, user: User, is_spectator: bool) -> RoomBelongings:
    user_attr = UserAttr.SPECTATOR if is_spectator else UserAttr.UNASSIGNED_PLAYER
    return RoomBelongings.objects.create(room_id=room, user_id=user, user_attr=user_attr)
