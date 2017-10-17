# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.

class User(models.Model):
    name = models.CharField(max_length = 20)
    password = models.CharField(max_length = 20)
    email = models.CharField(max_length = 50)
    identifyingCode = models.CharField(max_length = 20, default = "")

class Level(models.Model):
    level_id = models.IntegerField()
    info = models.CharField(max_length = 500)