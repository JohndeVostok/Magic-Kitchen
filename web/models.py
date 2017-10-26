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
    info = models.TextField()
    user_name = models.CharField(max_length = 20)

class Solution(models.Model):
    user_name = models.CharField(max_length = 20)
    solution_id = models.AutoField(primary_key = True)
    level_id = models.IntegerField()
    info = models.TextField() #jsonStr
    score = models.IntegerField() #score range is [0,4], 0 means not pass, 4 means not need to score
