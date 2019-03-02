from django import forms
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect  # noqa

from userconfig.models import User


class SignUpForm(UserCreationForm):
    email = forms.CharField(max_length=254, required=True, widget=forms.EmailInput())
    display_name = forms.CharField(max_length=150, required=True, label='表示名')

    class Meta:
        model = User
        fields = ('username', 'display_name', 'email', 'password1', 'password2')


def signup(request):
    if request.method == 'POST':
        sign_up_form = SignUpForm(request.POST)
        if sign_up_form.is_valid():
            user = sign_up_form.save()
            login(request, user)
            return redirect('/')
    else:
        sign_up_form = SignUpForm()
    return render(request, 'userconfig/signup.html', {'form': sign_up_form})
