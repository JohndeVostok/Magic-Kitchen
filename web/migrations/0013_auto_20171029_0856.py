# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-29 08:56
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0012_auto_20171028_1503'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='authority',
            field=models.IntegerField(default=1),
        ),
        migrations.AddField(
            model_name='user',
            name='vip_due_time',
            field=models.DateTimeField(default=None),
            preserve_default=False,
        ),
    ]
