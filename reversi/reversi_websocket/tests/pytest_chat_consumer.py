import json

import pytest
from channels.routing import URLRouter, ProtocolTypeRouter
from channels.testing import WebsocketCommunicator
from django.urls import path

from reversi_websocket.consumers import GameConsumer
from reversi_websocket.tests.utils import AuthMiddlewareMock


@pytest.fixture(scope='function')
async def setup_communicator():
    dummy_user = 'dummy'
    dummy_display = 'dummy_display'
    app = ProtocolTypeRouter({
        'websocket': AuthMiddlewareMock(dummy_user, dummy_display,
                                        URLRouter([path('ws/game/<str:room_name>/', GameConsumer)]))})
    communicator = WebsocketCommunicator(app, 'ws/game/test/')
    connected, subprotocol = await communicator.connect()
    assert connected
    yield {'communicator': communicator, 'user': dummy_user, 'display_name': dummy_display}
    # Close
    await communicator.disconnect()


@pytest.mark.django_db(transaction=True)
@pytest.mark.asyncio
async def test_game_consumer_send_msg(setup_communicator):
    test_message = 'hello'
    test_type = 'chat'
    communicator = setup_communicator['communicator']
    dummy_display = setup_communicator['display_name']

    text_json = json.dumps({'data': {'message': test_message}, 'type': test_type})
    # Test sending text
    await communicator.send_to(text_data=text_json)
    response = await communicator.receive_from()
    assert response == json.dumps({'message': {
        'data': {'message': test_message},
        'type': test_type,
        'displayName': dummy_display}
    })
