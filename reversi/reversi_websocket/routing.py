from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path('ws/game/<int:room_id>/', consumers.GameConsumer.as_asgi()),
    path('ws/room_selection/', consumers.RoomSelectionConsumer.as_asgi())
]
