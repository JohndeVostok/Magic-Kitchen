# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-28 14:39
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0010_auto_20171026_1530'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='solution_list',
            field=models.TextField(default='{}'),
            preserve_default=False,
        ),
    ]