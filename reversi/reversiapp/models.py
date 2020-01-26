from __future__ import unicode_literals

from typing import Dict, List

from django.db import models

from userconfig.models import User


class Room(models.Model):
    id = models.AutoField(primary_key=True)
    room_name = models.CharField(max_length=40)
    # non-nullable. パスワード無しはnullではなく空文字で表現される。
    password = models.CharField(max_length=40, blank=True)
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
                'max_participant': room.max_participant,
                'has_password': len(room.password) > 0}

    rooms = Room.objects.all()
    return [_create_room_info(room) for room in rooms]


def delete_belongings(user: User):
    RoomBelongings.objects.filter(user_id=user).delete()


def find_rooms_by_id(room_id: int) -> List[Room]:
    return list(Room.objects.filter(id=room_id))


def find_room_belongings_by_room(room: Room) -> List[RoomBelongings]:
    return list(RoomBelongings.objects.filter(room_id=room))


def find_belonging_rooms_by_user(user: User) -> List[Room]:
    belongings = RoomBelongings.objects.filter(user_id=user)
    return [belonging.room_id for belonging in belongings]


def check_existence_of_belonging(user: User) -> bool:
    return len(RoomBelongings.objects.filter(user_id=user)) > 0


def create_room(room_name, password, max_spectator, max_participant) -> Room:
    return Room.objects.create(room_name=room_name, password=password,
                               max_spectator=max_spectator, max_participant=max_participant)


def create_room_belonging(user, room, is_spectator) -> RoomBelongings:
    return RoomBelongings.objects.create(user_id=user, room_id=room, is_spectator=is_spectator)


def room_is_empty(room: Room) -> bool:
    return len(RoomBelongings.objects.filter(room_id=room)) == 0


def delete_empty_room(rooms: List[Room]):
    for room in filter(room_is_empty, rooms):
        room.delete()
