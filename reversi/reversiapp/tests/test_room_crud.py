import json

from django.test import TestCase
from django.urls import reverse, resolve

from reversiapp.models import find_belonging_rooms_by_user, get_room_data
from reversiapp.view.room.create import create_room
from userconfig.models import User


class RoomCreationUrl(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('tester1')
        self.client.force_login(self.user)
        url = reverse('create_room')
        data = {
            'roomName': 'test',
            'password': '',
            'maxSpectator': '2',
            'isSpectator': 'false'
        }
        self.response = self.client.post(url, data)

    def test_status_code(self):
        self.assertEquals(self.response.status_code, 200)

    def test_create_room_url(self):
        view = resolve('/create_room')
        self.assertEquals(view.func, create_room)

    def test_fetch_room_data(self):
        url = reverse('fetch_room_data')
        response = self.client.get(url)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(json.loads(response.content).get('room_data')[0], {
            'room_id': 1,
            'room_name': 'test',
            'count_spectator': 0,
            'max_spectator': 2,
            'count_participant': 1,
            'max_participant': 2,
            'has_password': False,
        })


class RoomCreationWithoutPassword(TestCase):
    def test_without_password(self):
        user1 = User.objects.create_user('tester1')
        user2 = User.objects.create_user('tester2')
        create_room_url = reverse('create_room')
        enter_url = reverse('enter_room')
        exit_url = reverse('exit_room')
        room_data = {
            'roomName': 'test',
            'password': '',
            'maxSpectator': '2',
            'isSpectator': 'false'

        }
        enter_data = {
            'roomId': '1',
            'password': '',
            'isSpectator': 'false'
        }

        # user1 部屋作成 (& 入室)
        self.client.force_login(user1)
        self.response = self.client.post(create_room_url, room_data)

        self.assertEquals(len(get_room_data()), 1)
        self.assertEquals(len(find_belonging_rooms_by_user(user1)), 1)
        self.assertEquals(len(find_belonging_rooms_by_user(user2)), 0)
        self.client.logout()

        # user2 入室
        self.client.force_login(user2)
        self.client.post(enter_url, enter_data)
        self.assertEquals(len(get_room_data()), 1)
        self.assertEquals(len(find_belonging_rooms_by_user(user1)), 1)
        self.assertEquals(len(find_belonging_rooms_by_user(user2)), 1)

        # user2 退室
        self.client.post(exit_url, {})
        self.assertEquals(len(get_room_data()), 1)
        self.assertEquals(len(find_belonging_rooms_by_user(user1)), 1)
        self.assertEquals(len(find_belonging_rooms_by_user(user2)), 0)

        self.client.logout()
        # user1 退室
        self.client.force_login(user1)
        self.client.post(exit_url, {})
        # 空部屋は削除
        self.assertEquals(len(get_room_data()), 0)
        self.assertEquals(len(find_belonging_rooms_by_user(user1)), 0)
        self.assertEquals(len(find_belonging_rooms_by_user(user2)), 0)


class RoomCreationWithPassword(TestCase):
    def test(self):
        user1 = User.objects.create_user('tester1')
        user2 = User.objects.create_user('tester2')
        create_room_url = reverse('create_room')
        enter_url = reverse('enter_room')
        exit_url = reverse('exit_room')
        room_data = {
            'roomName': 'test',
            'password': 'pass',
            'maxSpectator': '2',
            'isSpectator': 'false'
        }
        enter_failure_data = {
            'roomId': '1',
            'password': 'mismatched',
            'isSpectator': 'false'
        }
        enter_success_data = {
            'roomId': '1',
            'password': 'pass',
            'isSpectator': 'false'
        }

        # user1 部屋作成 (& 入室)
        self.client.force_login(user1)
        self.response = self.client.post(create_room_url, room_data)

        self.assertEquals(len(get_room_data()), 1)
        self.assertEquals(len(find_belonging_rooms_by_user(user1)), 1)
        self.assertEquals(len(find_belonging_rooms_by_user(user2)), 0)
        self.client.logout()

        # user2 入室失敗
        self.client.force_login(user2)

        self.client.post(enter_url, enter_failure_data)
        self.assertEquals(len(get_room_data()), 1)
        self.assertEquals(len(find_belonging_rooms_by_user(user1)), 1)
        self.assertEquals(len(find_belonging_rooms_by_user(user2)), 0)

        # user2 入室成功
        self.client.post(enter_url, enter_success_data)
        self.assertEquals(len(get_room_data()), 1)
        self.assertEquals(len(find_belonging_rooms_by_user(user1)), 1)
        self.assertEquals(len(find_belonging_rooms_by_user(user2)), 1)

        # user2 退室
        self.client.post(exit_url, {})
        self.assertEquals(len(get_room_data()), 1)
        self.assertEquals(len(find_belonging_rooms_by_user(user1)), 1)
        self.assertEquals(len(find_belonging_rooms_by_user(user2)), 0)

        self.client.logout()
        # user1 退室
        self.client.force_login(user1)
        self.client.post(exit_url, {})
        # 空部屋は削除
        self.assertEquals(len(get_room_data()), 0)
        self.assertEquals(len(find_belonging_rooms_by_user(user1)), 0)
        self.assertEquals(len(find_belonging_rooms_by_user(user2)), 0)
