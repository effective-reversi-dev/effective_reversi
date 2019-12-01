import json

from django.test import TestCase
from django.urls import reverse, resolve

from userconfig.models import User


class UserInfoTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            'test1',
            email='testtesttesttest@usr.name',
            password='testpass',
            display_name='test_display'
        )
        self.client.force_login(self.user)

    def test_get_user_info(self):
        url = reverse('get_user')
        response = self.client.get(url)
        self.assertEquals(json.loads(response.content), {
            'username': 'test1',
            'display_name': 'test_display',
            'email': 'testtesttesttest@usr.name'
        })

    def test_change_user_info_success(self):
        url = reverse('change_user')
        data = {
            'displayName': 'hoge',
            'emailAddress': 'test@usr.name'
        }
        response = self.client.post(url, data)
        self.assertEquals(json.loads(response.content), {
            'err': False, 'err_msg': ''
        })

    def test_change_user_info_invalid_display_name(self):
        # only letters, numbers and @/./+/-/_
        url = reverse('change_user')
        data = {
            'displayName': 'hoge?',
            'emailAddress': 'test@user.name'
        }
        response = self.client.post(url, data)
        self.assertEquals(json.loads(response.content), {
            'err': True, 'err_msg': '表示名が不正です。: hoge?。'
        })

    def test_change_user_info_invalid_email(self):
        url = reverse('change_user')
        data = {
            'displayName': 'hoge',
            'emailAddress': 'bademail'
        }
        response = self.client.post(url, data)
        self.assertEquals(json.loads(response.content), {
            'err': True, 'err_msg': 'メールアドレスが不正です。: bademail。'
        })

    def test_change_user_info_no_input(self):
        url = reverse('change_user')
        data = {
            'displayName': '',
            'emailAddress': ''
        }
        response = self.client.post(url, data)
        self.assertEquals(json.loads(response.content), {
            'err': False, 'err_msg': ''
        })
