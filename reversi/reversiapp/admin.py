from django.contrib import admin  # noqa

# Register your models here.
from .models import Room, RoomBelongings

admin.site.register(Room)
admin.site.register(RoomBelongings)
