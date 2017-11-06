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
    std_solution_id = models.IntegerField(default = -1) #-1 means this level is not default level, or admin haven't created std solution for this default level yet

class Solution(models.Model):
    user_name = models.CharField(max_length = 20)
    solution_id = models.AutoField(primary_key = True)
    level_id = models.IntegerField()
    info = models.TextField() #jsonStr
    score = models.IntegerField() #score range is [1,4], 4 means pass, [1,3] means score
    shared = models.BooleanField(default = False)
