# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-11-05 12:51
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0014_level_shared'),
    ]

    operations = [
        migrations.AddField(
            model_name='solution',
            name='shared',
            field=models.BooleanField(default=False),
        ),
    ]
