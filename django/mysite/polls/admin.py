""" A module for admin window (i.e. xxx/admin)

To create an admin account, type 'python manage.py createsuperuser' at shell.
"""

# Register your models here.
from django.contrib import admin

from .models import Question

admin.site.register(Question)
