import json
from typing import Tuple

import pytest
from channels.routing import URLRouter, ProtocolTypeRouter
from channels.testing import WebsocketCommunicator
from django.urls import path

from reversi_websocket.consumers import GameConsumer
from reversi_websocket.tests.utils import AuthMiddlewareMock
from reversiapp.models import Room, UserAttr, RoomBelongings
from userconfig.models import User


@pytest.mark.django_db(transaction=True)
@pytest.mark.asyncio
async def test_game_consumer_send_msg():
    dummy_user, dummy_room, communicator = _prepare_communicator()
    connected, subprotocol = await communicator.connect()
    assert connected

    response = await communicator.receive_from()
    assert response == json.dumps({"message": {"type": "member_data",
                                               "members": [{"displayName": dummy_user.display_name,
                                                            "attribute": "un"}],
                                               "additional": dummy_user.display_name}})

    test_message = 'hello'
    test_type = 'chat'
    text_json = json.dumps({'data': {'message': test_message}, 'type': test_type})
    # Test sending text
    await communicator.send_to(text_data=text_json)
    response = await communicator.receive_from()
    assert response == json.dumps({'message': {
        'data': {'message': test_message},
        'type': test_type,
        'displayName': dummy_user.display_name}
    })
    # Close
    await communicator.disconnect()


def _prepare_communicator() -> Tuple[User, Room, WebsocketCommunicator]:
    dummy_user = 'dummy'
    dummy_display = 'dummy_display'
    dummy_password = 'aaaaaa'
    dummy_email = 'aaa@aaa.aaa.aa'
    dummy_user = _prepare_test_user_data(dummy_user, dummy_display, dummy_password, dummy_email)
    dummy_room = _prepare_test_room(1, 'test', '', 4, 2)
    _prepare_test_belongings(dummy_room, dummy_user, False)

    app = ProtocolTypeRouter({
        'websocket': AuthMiddlewareMock(dummy_user,
                                        URLRouter([path('ws/game/<int:room_id>/', GameConsumer)]))})
    return dummy_user, dummy_room, WebsocketCommunicator(app, 'ws/game/1/')


def _prepare_test_user_data(username: str, display: str, password: str, email: str) -> User:
    user = User.objects.create_user(username=username, password=password,
                                    email=email, display_name=display)
    return user


def _prepare_test_room(room_id: int, room_name: str, password: str, max_spectator: int,
                       max_participant: int) -> Room:
    return Room.objects.create(id=room_id, room_name=room_name, password=password,
                               max_spectator=max_spectator, max_participant=max_participant)


def _prepare_test_belongings(room: Room, user: User, is_spectator: bool) -> RoomBelongings:
    user_attr = UserAttr.SPECTATOR if is_spectator else UserAttr.UNASSIGNED_PLAYER
    return RoomBelongings.objects.create(room_id=room, user_id=user, user_attr=user_attr)
