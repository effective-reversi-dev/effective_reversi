from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST

from reversiapp.channel.room_modification import send_room_data_to_channel_layer
from reversiapp.models import delete_belongings, find_belonging_rooms_by_user, delete_empty_room
from userconfig.models import User


@login_required
@require_POST
def exit_room(request):
    user: User = request.user
    rooms = find_belonging_rooms_by_user(user)
    delete_belongings(user)
    delete_empty_room(rooms)
    send_room_data_to_channel_layer()
    return JsonResponse({'succeeded': True, 'err_msg': ''})
