# Generated by Django 2.2.2 on 2020-02-15 07:11

from django.db import migrations, models
import reversiapp.models


class Migration(migrations.Migration):

    dependencies = [
        ('reversiapp', '0004_auto_20191208_0017'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='roombelongings',
            name='is_black_stone_user',
        ),
        migrations.RemoveField(
            model_name='roombelongings',
            name='is_spectator',
        ),
        migrations.RemoveField(
            model_name='roombelongings',
            name='is_white_stone_user',
        ),
        migrations.AddField(
            model_name='roombelongings',
            name='user_attr',
            field=models.CharField(choices=[('wh', 'White Player'), ('bl', 'Black Player'), ('un', 'Unassigned Player'), ('sp', 'Spectator')], default=reversiapp.models.UserAttr(('sp', 'Spectator')), max_length=2),
        ),
    ]
