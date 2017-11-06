# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.

class User(models.Model):
    name = models.CharField(max_length = 20)
    password = models.CharField(max_length = 20)
    email = models.CharField(max_length = 50)
    identifyingCode = models.CharField(max_length = 20, default = "")
    solution_dict = models.TextField() #jsonStr(stored dict{level_id : solution_id})
    authority = models.IntegerField(default = 1) #user = 1, VIP = 2, admin = 3 super_admin = 4
    vip_due_time = models.DateTimeField()

class Level(models.Model):
    default_level_id = models.IntegerField()
    level_id = models.AutoField(primary_key = True)
    info = models.TextField()
    user_name = models.CharField(max_length = 20, default = "")
    shared = models.BooleanField(default = False)

class Solution(models.Model):
    user_name = models.CharField(max_length = 20)
    solution_id = models.AutoField(primary_key = True)
    level_id = models.IntegerField()
    info = models.TextField() #jsonStr
    score = models.IntegerField() #score range is [0,4], 0 means not pass, 4 means not need to score
    shared = models.BooleanField(default = False)
