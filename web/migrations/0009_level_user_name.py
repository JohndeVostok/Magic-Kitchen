# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-26 04:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0008_auto_20171023_1456'),
    ]

    operations = [
        migrations.AddField(
            model_name='level',
            name='user_name',
            field=models.CharField(default='', max_length=20),
        ),
    ]
