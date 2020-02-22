from django.test import TestCase, Client
from django.urls import reverse

from reversiapp.models import get_room_data, find_belonging_rooms_by_user
from userconfig.models import User


class StartGameTest(TestCase):
    def setUp(self):
        user1 = User.objects.create_user('tester1')
        user2 = User.objects.create_user('tester2')
        self.users = {'user1': user1, 'user2': user2}
        self.user2_client = Client()

        create_room_url = reverse('create_room')
        enter_url = reverse('enter_room')

        room_data = {
            'roomName': 'test',
            'password': 'pass',
            'maxSpectator': '2',
            'isSpectator': 'false'
        }
        enter_success_data = {
            'roomId': '1',
            'password': 'pass',
            'isSpectator': 'false'
        }

        # user1 部屋作成 (& 入室)
        self.client.force_login(user1)
        self.client.post(create_room_url, room_data)

        # user2 入室成功
        self.user2_client.force_login(user2)
        self.user2_client.post(enter_url, enter_success_data)

    def tearDown(self):
        self.client.logout()
        self.user2_client.logout()

    def test_start_game_success(self):
        start_game_url = reverse('start_game')
        exit_url = reverse('exit_room')
        start_game_data = {
            'roomId': '1'
        }
        # user1 ゲーム開始
        self.client.post(start_game_url, start_game_data)

        user1 = self.users['user1']
        user2 = self.users['user2']
        # user2 退室
        self.user2_client.post(exit_url, {})
        self.assertEquals(len(get_room_data()), 1)
        self.assertEquals(len(find_belonging_rooms_by_user(user1)), 1)
        self.assertEquals(len(find_belonging_rooms_by_user(user2)), 0)

        # user1 退室
        self.client.post(exit_url, {})
        # 空部屋は削除
        self.assertEquals(len(get_room_data()), 0)
        self.assertEquals(len(find_belonging_rooms_by_user(user1)), 0)
        self.assertEquals(len(find_belonging_rooms_by_user(user2)), 0)

    def test_reject_enter_started_room(self):
        start_game_url = reverse('start_game')
        start_game_data = {
            'roomId': '1'
        }
        enter_spectator_data = {
            'roomId': '1',
            'password': 'pass',
            'isSpectator': 'true'
        }
        # user1 ゲーム開始
        self.client.post(start_game_url, start_game_data)

        user1 = self.users['user1']
        user2 = self.users['user2']

        # user3 ゲーム開始後に入室
        user3 = User.objects.create_user('tester3')
        self.user3_client = Client()
        self.user3_client.force_login(user3)
        enter_url = reverse('enter_room')
        self.user3_client.post(enter_url, enter_spectator_data)

        # ゲームは始まったため、user1, user2は入室しているが、user3は入室できていない
        self.assertEquals(len(find_belonging_rooms_by_user(user1)), 1)
        self.assertEquals(len(find_belonging_rooms_by_user(user2)), 1)
        self.assertEquals(len(find_belonging_rooms_by_user(user3)), 0)

        # user3ログアウト
        self.user3_client.logout()
