# Generated by Django 2.2.2 on 2019-10-27 18:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reversiapp', '0002_auto_20191014_2138'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='password',
            field=models.CharField(blank=True, default='', max_length=40),
            preserve_default=False,
        ),
    ]
