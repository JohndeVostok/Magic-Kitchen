# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-26 15:30
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0009_level_user_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='level',
            name='id',
        ),
        migrations.AddField(
            model_name='level',
            name='default_level_id',
            field=models.IntegerField(default=-1),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='level',
            name='level_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
