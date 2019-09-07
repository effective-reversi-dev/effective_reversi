from __future__ import unicode_literals

from typing import Dict

from django.db import models

from userconfig.models import User


class Room(models.Model):
    id = models.AutoField(primary_key=True)
    room_name = models.CharField(max_length=40)
    password = models.CharField(max_length=40)
    max_spectator = models.IntegerField()
    max_participant = models.IntegerField()


class RoomBelongings(models.Model):
    room_id = models.ForeignKey(Room, models.CASCADE)
    user_id = models.ForeignKey(User, models.CASCADE)
    is_spectator = models.BooleanField()


def get_room_data():
    def _create_room_info(room: Room) -> Dict[str, object]:
        belonging_users = RoomBelongings.objects.filter(room_id=room.id)
        count_spectator = len([col for col in belonging_users if col.is_spectator])
        count_participant = len([col for col in belonging_users if not col.is_spectator])
        return {'room_id': room.id,
                'room_name': room.room_name,
                'count_spectator': count_spectator,
                'max_spectator': room.max_spectator,
                'count_participant': count_participant,
                'max_participant': room.max_participant}

    rooms = Room.objects.all()
    return [_create_room_info(room) for room in rooms]


def delete_belongings(user: User):
    RoomBelongings.objects.filter(user_id=user).delete()


def check_existence_of_belonging(user: User):
    return len(RoomBelongings.objects.filter(user_id=user)) > 0
