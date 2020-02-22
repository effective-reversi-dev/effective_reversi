from django.urls import path

from reversiapp.view.reversiapp import reversiapp
from reversiapp.view.room.create import create_room
from reversiapp.view.room.exit import exit_room
from reversiapp.view.room.select import fetch_room_data, enter_room
from reversiapp.view.game.start import start_game

urlpatterns = [
    path('', reversiapp, name='home'),
    path('game', reversiapp, name='game'),
    path('room_selection', reversiapp, name='room_selection'),
    path('room_creation', reversiapp, name='room_creation'),
    path('config', reversiapp, name='config'),

    # SPAの中からajax的に呼ばれる奴ら
    path('fetch_room_data', fetch_room_data, name='fetch_room_data'),
    path('create_room', create_room, name='create_room'),
    path('enter_room', enter_room, name='enter_room'),
    path('exit_room', exit_room, name='exit_room'),
    path('start_game', start_game, name='start_game')]
