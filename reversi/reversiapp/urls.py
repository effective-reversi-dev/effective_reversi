from django.urls import path

from reversiapp.view.reversiapp import reversiapp, fetch_room_data, enter_room, exit_room

urlpatterns = [
    path('', reversiapp, name='home'),
    path('game', reversiapp, name='game'),
    path('room_selection', reversiapp, name='room_selection'),
    path('config', reversiapp, name='config'),

    # SPAの中からajax的に呼ばれる奴ら
    path('fetch_room_data', fetch_room_data, name='fetch_room_data'),
    path('enter_room', enter_room, name='enter_room'),
    path('exit_room', exit_room, name='exit_room')]
