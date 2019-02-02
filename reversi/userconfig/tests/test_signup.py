from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse, resolve

from userconfig.view.signup import signup, SignUpForm


class SignUpTests(TestCase):
    def setUp(self):
        url = reverse('signup')
        self.response = self.client.get(url)

    def test_signup_status_code(self):
        self.assertEquals(self.response.status_code, 200)

    def test_signup_url_resolves_signup_view(self):
        view = resolve('/users/signup/')
        self.assertEquals(view.func, signup)

    def test_contains_form(self):
        form = self.response.context.get('form')
        self.assertIsInstance(form, SignUpForm)

    # cross site request forgery対策のためテスト。
    def test_csrf(self):
        self.assertContains(self.response, 'csrfmiddlewaretoken')


class SuccessfulSignUpTests(TestCase):
    def setUp(self):
        url = reverse('signup')
        data = {
            'username': 'testtesttesttest',
            'email': 'testtesttesttest@usr.name',
            'password1': '1234567890abcdefg',
            'password2': '1234567890abcdefg',
        }
        self.response = self.client.post(url, data)
        self.redirect_to = reverse('home')

    # 登録完了時のリダイレクト先が適切かテスト
    def test_redirection(self):
        self.assertRedirects(self.response, self.redirect_to)

    # ユーザ作成に成功しているかテスト
    def test_user_creation(self):
        self.assertTrue(User.objects.exists())

    # 現在の接続状態について、ログイン済みになっているかどうかのテスト
    def test_user_authentication(self):
        response = self.client.get(self.redirect_to)
        user = response.context.get('user')
        self.assertTrue(user.is_authenticated)


class InvalidSignUpTests(TestCase):
    # invalid なsubmitに対する反応を見るテスト。
    # Djangoのフォームを信頼しているため、いろいろなケースを作ったりはしない。
    def setUp(self):
        url = reverse('signup')
        self.response = self.client.post(url, {})  # submit an empty dictionary

    def test_signup_status_code(self):
        self.assertEquals(self.response.status_code, 200)

    def test_form_errors(self):
        form = self.response.context.get('form')
        self.assertTrue(form.errors)

    def test_dont_create_user(self):
        self.assertFalse(User.objects.exists())
