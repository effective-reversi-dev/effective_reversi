from django.urls import path

from reversiapp.view.reversiapp import reversiapp

urlpatterns = [
    path('', reversiapp, name='home')
]
