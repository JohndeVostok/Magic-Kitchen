# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase
from django.test import Client
import json
from models import User
from models import Level
from models import Solution
import datetime
from django.utils import timezone

def set_vip(user):
    user.authority = 2
    user.vip_due_time = timezone.now() + datetime.timedelta(days = 1)
    user.save()

# Create your tests here.

class IndexTestCase(TestCase):
    def test_index_page(self):
        c = Client()
        response = c.get("/")
        self.assertRedirects(response, "/codechef.html")

class CustomSystemTestCase(TestCase):
    def test_register(self):
        c = Client()

        #test empty name
        response = c.post('/api/register', {'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1002) #'user name can't be empty'

        #test empty password
        response = c.post('/api/register', {'name': 'sth', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1003) #'password can't be empty'

        #test empty email
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1004) #'email can't be empty'

        #test succeeded
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test this name already exists
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '123@456.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1005) #'this name already exists'

        #test 'this email already exists'
        response = c.post('/api/register', {'name': 'sth2', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1006) #'this email address already exists'

        #test 'this name is too long'
        response = c.post('/api/register', {'name': 'abcdefghijklmnopqrstvwxyz', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1007) #'this name is too long'

        #test 'this password is too long'
        response = c.post('/api/register', {'name': 'sth2', 'password': 'abcdefghijklmnopqrstvwxyz', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1008) #'this password is too long'

        #test 'this email is too long'
        response = c.post('/api/register', {'name': 'sth2', 'password': 'abc', 'email': 'abcdefghijklmnopqrstvwxyzabcdefghijklmnopqrstvwxyz@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1009) #'this email address is too long'

        #login and test register after login
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        response = c.post('/api/register', {'name': 'sth2', 'password': 'abc', 'email': '123@233.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1010) #'you have already logged in'

    def test_login(self):
        c = Client()

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        
        #test empty name
        response = c.post('/api/login', {'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1002) #'user name can't be empty'

        #test empty password
        response = c.post('/api/login', {'name': 'sth'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1003) #'password can't be empty'

        #test 'this name doesn\'t exist'
        response = c.post('/api/login', {'name': 'sth2', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1011) #'this name doesn't exist'

        #test 'wrong password'
        response = c.post('/api/login', {'name': 'sth', 'password': 'abcd'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1012) #'wrong password'

        #test login succeeded
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test login twice
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1010) #'you have already logged in'

    def test_logout(self):

        c = Client()

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test logout before login
        response = c.post('/api/logout')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #login succeeded
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test logout after login
        response = c.post('/api/logout')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test login after 'login and logout'
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

    def test_change_password_after_login(self):
        c = Client()

        #test change password before  login
        response = c.post('/api/change_password_after_login', {'new_password' : 'newpw'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1001) #'please log in first'

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #name_filter = User.objects.filter(name = 'abc')
        name_filter = User.objects.all()
        self.assertEqual(len(name_filter), 1)

        #login succeeded
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test change password
        response = c.post('/api/change_password_after_login', {'new_password' : 'newpw'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        name_filter = User.objects.filter(email = '123@111.com')
        self.assertEqual(len(name_filter), 1)
        user = name_filter[0]
        self.assertEqual(user.password, 'newpw')

        #test empty new password
        response = c.post('/api/change_password_after_login', {})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1013) #'new password can't be empty'

        #test new password is too long
        response = c.post('/api/change_password_after_login', {'new_password' : 'abcdefghijklmnopqrstuvwxyz'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1008) #'this password is too long'

    def test_change_password_by_email(self):
        c = Client()

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '765215342@qq.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test empty name
        response = c.post('/api/change_password_by_email')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1002) #'name can't be empty'

        #test name not exist
        response = c.post('/api/change_password_by_email', {'name': 'sthsth'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1011) #'this name doesn't exist'
        
        #test send eamil
        response = c.post('/api/change_password_by_email', {'name': 'sth'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

    def test_change_password_by_identifyingCode(self):
        c = Client()

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '765215342@qq.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #send eamil
        response = c.post('/api/change_password_by_email', {'name': 'sth'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        identifyingCode = ret['identifyingCode']

        #test empty name
        response = c.post('/api/change_password_by_identifyingCode', {'identifyingCode': identifyingCode, 'new_password': 'newpw'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1002) #'name can't be empty'

        #test empty identifyingCode
        response = c.post('/api/change_password_by_identifyingCode', {'name': 'sth', 'new_password': 'newpw'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1014) #'identifying code can't be empty'

        #test empty new_password
        response = c.post('/api/change_password_by_identifyingCode', {'name': 'sth', 'identifyingCode': identifyingCode})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1013) #'new password can't be empty'

        #test name not exist
        response = c.post('/api/change_password_by_identifyingCode', {'name': 'sthsth', 'identifyingCode': identifyingCode, 'new_password': 'newpw'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1011) #'this name doesn't exist'

        #test new password is too long
        response = c.post('/api/change_password_by_identifyingCode', {'name': 'sth', 'identifyingCode': identifyingCode, 'new_password': 'newpw' + 'abcdefghijklmnopqrstvwxyz'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1008) #'this password is too long'

        #test wrong identifyingCode
        response = c.post('/api/change_password_by_identifyingCode', {'name': 'sth', 'identifyingCode': identifyingCode + '1', 'new_password': 'newpw'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1015) #'wrong identifying code'

        #test change password by identifyingCode
        response = c.post('/api/change_password_by_identifyingCode', {'name': 'sth', 'identifyingCode': identifyingCode, 'new_password': 'newpw'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test wrong identifyingCode
        response = c.post('/api/change_password_by_identifyingCode', {'name': 'sth', 'identifyingCode': '', 'new_password': 'newpw'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1015) #'wrong identifying code'

        #test login after changing password
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1012) #'wrong password'
        response = c.post('/api/login', {'name': 'sth', 'password': 'newpw'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test change password by old identifying code
        response = c.post('/api/change_password_by_identifyingCode', {'name': 'sth', 'identifyingCode': identifyingCode, 'new_password': 'newpw2'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1015) #'wrong identifying code'

    def test_get_current_user_info(self):
        c = Client()

        #test get info before login
        response = c.post('/api/get_current_user_info')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1001) #'please log in first'

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #login
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        user = User.objects.filter(name = 'sth')[0]
        user.authority = 3
        user.save()
        #new default level
        response = c.post('/api/new_default_level', {'default_level_id': 233, 'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        level1 = Level.objects.filter(default_level_id = 233)[0]
        response = c.post('/api/new_default_level', {'default_level_id': 123, 'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        level2 = Level.objects.filter(default_level_id = 123)[0]

        solution1 = Solution.objects.create(user_name = 'abc', level_id = level1.level_id, info = json.dumps({'block_num': 6}), score = 3)
        solution2 = Solution.objects.create(user_name = 'abc', level_id = level2.level_id, info = json.dumps({'block_num': 6}), score = 3)
        level1.std_solution_id = solution1.solution_id
        level1.save()
        level2.std_solution_id = solution2.solution_id
        level2.save()

        #test new solution
        response = c.post('/api/new_solution', {'level_id': 1, 'solution_info': json.dumps({'block_num': 5}), 'score': 0})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test get current user info
        response = c.post('/api/get_current_user_info')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(ret['user_name'], 'sth')
        self.assertEqual(ret['email'], '123@111.com')
        self.assertEqual(json.loads(ret['solution_dict']), {'1' : 3})
        self.assertEqual(json.loads(ret['created_level']), [1, 2])

        #test new solution
        response = c.post('/api/new_solution', {'level_id': 1, 'solution_info': json.dumps({'block_num': 6})})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        response = c.post('/api/new_solution', {'level_id': 2, 'solution_info': json.dumps({'block_num': 7})})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        Level.objects.create(default_level_id = -1, user_name = 'xxx', info = 'info')
        #new usermade level
        response = c.post('/api/new_usermade_level', {'level_info': 'jsonStr2'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        #test get current user info
        response = c.post('/api/get_current_user_info')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(json.loads(ret['solution_dict']), {'1' : 3, '2' : 4})
        self.assertEqual(json.loads(ret['created_level']), [1, 2, 4])

    def test_vip_charge(self):
        c = Client()

        #test charge before login
        response = c.post('/api/vip_charge')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1001) #'please log in first'

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #login
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test empty days
        response = c.post('/api/vip_charge')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1028) #'level info can't be empty'

        #test days is not Integer
        response = c.post('/api/vip_charge', {'days': 'a'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1029) #'the input days needs to be an Integer'

        #test days is not in range[1,99999]
        response = c.post('/api/vip_charge', {'days': '0'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1030) #'the input days needs to be in range[1, 99999]'

        #test vip charge
        response = c.post('/api/vip_charge', {'days': '30'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        user = User.objects.filter(name = 'sth')[0]
        now = datetime.datetime.now()
        delta = datetime.timedelta(days = 30)
        self.assertEqual(user.authority, 2)
        self.assertEqual(user.vip_due_time.day, (now + delta).day)
        self.assertEqual(user.vip_due_time.month, (now + delta).month)
        self.assertEqual(user.vip_due_time.year, (now + delta).year)

    def test_set_admin(self):
        c = Client()

        super_admin = User.objects.create(name = 'super_admin', password = 'pw', email = 'email', solution_dict = json.dumps({}), authority = 1, vip_due_time = timezone.now())

        #test set admin before login
        response = c.post('/api/set_admin')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1001) #'please log in first'

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #super admin login
        response = c.post('/api/login', {'name': 'super_admin', 'password': 'pw'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test no authority
        response = c.post('/api/set_admin')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1031) #'you don't have operation authority'

        super_admin.authority = 4
        super_admin.save()
        #test empty user name
        response = c.post('/api/set_admin')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1002) #'user name can't be empty'

        #test user name doesn't exist
        response = c.post('/api/set_admin', {'name': 'sth2'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1011) #'this name doesn't exist'

        #test set admin
        response = c.post('/api/set_admin', {'name': 'sth'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'this name doesn't exist'
        admin = User.objects.filter(name = 'sth')[0]
        self.assertEqual(admin.authority, 3)

    def test_refresh_vip_authority(self):
        c = Client()

        #create level
        vip_level = Level.objects.create(default_level_id = 6, info = 'vip level', user_name = 'sth')

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '765215342@qq.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #login
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        user = User.objects.filter(name = 'sth')[0]
        set_vip(user)
        #test get level info
        response = c.post('/api/get_level_info', {'default_level_id': 6})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(ret['level_info'], 'vip level')
        self.assertEqual(ret['shared'], False)

        user.vip_due_time = timezone.now()
        user.save()
        #test get level info
        response = c.post('/api/get_level_info', {'default_level_id': 6})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1031) #'you don't have operation authority'


class LevelSystemTestCase(TestCase):
    def test_get_level_info(self):
        c = Client()

        #create level
        Level.objects.create(default_level_id = 1, info = json.dumps([1,3,5]), user_name = "sth")
        Level.objects.create(default_level_id = -1, info = "123", user_name = "sth2")
        vip_level = Level.objects.create(default_level_id = 6, info = 'vip level', user_name = 'sth')
        Level.objects.create(default_level_id = 2, info = json.dumps([1,3,5]), user_name = "sth2")

        #test level id and default level id empty in the same time
        response = c.post('/api/get_level_info')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1016) #'level id and default level id can't be empty in the same time'

        #test default level id not exists
        response = c.post('/api/get_level_info', {'default_level_id': 2147483647})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1017) #'this level doesn't exist'

        #test default level id is not Integer
        response = c.post('/api/get_level_info', {'default_level_id': 'a'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1018) #'the input default level id needs to be an Integer'

        #test default level id is too large
        response = c.post('/api/get_level_info', {'default_level_id': '-2147483649'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1018) #'the input default level id needs to be an Integer'

        #test default level id is too large
        response = c.post('/api/get_level_info', {'default_level_id': 2147483648})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1018) #'the input default level id needs to be an Integer'

        '''#test get level info
        response = c.post('/api/get_level_info', {'default_level_id': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(json.loads(ret['level_info']), [1,3,5])'''

        #test get vip level info before login
        response = c.post('/api/get_level_info', {'default_level_id': 6})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1001) #'please log in first'

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '765215342@qq.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #login
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test get unshared level info
        response = c.post('/api/get_level_info', {'default_level_id': 2})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1031) #'you don't have operation authority'
        
        level = Level.objects.filter(default_level_id = 2)[0]
        level.shared = True
        level.save()
        #test get shared level info
        response = c.post('/api/get_level_info', {'default_level_id': 2})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        level = Level.objects.filter(default_level_id = 2)[0]
        level.shared = False
        level.save()

        #test get unshared level info, the user is the auther
        response = c.post('/api/get_level_info', {'default_level_id': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'


        #test get vip level info without vip authority
        response = c.post('/api/get_level_info', {'default_level_id': 6})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1031) #'you don't have operation authority'

        user = User.objects.filter(name = 'sth')[0]
        set_vip(user)
        #test get level info
        response = c.post('/api/get_level_info', {'default_level_id': 6})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(ret['level_info'], 'vip level')
        self.assertEqual(ret['shared'], False)

        user.authority = 1
        user.save()
        #logout
        response = c.post('/api/logout')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test level id not exists
        response = c.post('/api/get_level_info', {'level_id': 2147483647})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1017) #'this level doesn't exist'

        #test level id is not Integer
        response = c.post('/api/get_level_info', {'level_id': 'a'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1019) #'the input level id needs to be an Integer'

        #test level id is too large
        response = c.post('/api/get_level_info', {'level_id': '-2147483649'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1019) #'the input level id needs to be an Integer'

        #test level id is too large
        response = c.post('/api/get_level_info', {'level_id': 2147483648})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1019) #'the input level id needs to be an Integer'

        '''#test get level info
        response = c.post('/api/get_level_info', {'level_id': 2})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(ret['level_info'], "123")'''

        #test get vip level info before login
        response = c.post('/api/get_level_info', {'level_id': vip_level.level_id})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1001) #'please log in first'

        #login
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test get unshared level info
        response = c.post('/api/get_level_info', {'level_id': 4})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1031) #'you don't have operation authority'
        
        level = Level.objects.filter(default_level_id = 2)[0]
        level.shared = True
        level.save()
        #test get shared level info
        response = c.post('/api/get_level_info', {'level_id': 4})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        level = Level.objects.filter(default_level_id = 2)[0]
        level.shared = False
        level.save()

        #test get unshared level info, the user is the auther
        response = c.post('/api/get_level_info', {'default_level_id': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test get vip level info without vip authority
        response = c.post('/api/get_level_info', {'level_id': vip_level.level_id})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1031) #'you don't have operation authority'

        user = User.objects.filter(name = 'sth')[0]
        set_vip(user)
        #test get level info
        response = c.post('/api/get_level_info', {'level_id': vip_level.level_id})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(ret['level_info'], 'vip level')
        self.assertEqual(ret['shared'], False)


    def test_new_default_level(self):
        c = Client()

        #test before login
        response = c.post('/api/new_default_level', {'default_level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1001) #'please log in first'

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '765215342@qq.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #login
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test no operation authority
        response = c.post('/api/new_default_level', {'default_level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1031) #'you don't have operation authority'

        user = User.objects.filter(name = 'sth')[0]
        user.authority = 3
        user.save()

        #test empty default level id
        response = c.post('/api/new_default_level', {'default_level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1020) #'default level id can't be empty'

        #test empty level info
        response = c.post('/api/new_default_level', {'default_level_id': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1021) #'level info can't be empty'

        #test default level id is not Integer
        response = c.post('/api/new_default_level', {'default_level_id': 'a', 'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1018) #'the input default level id needs to be an Integer'

        #test default level id is too large
        response = c.post('/api/new_default_level', {'default_level_id': 2147483648666, 'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1018) #'the input default level id needs to be an Integer'

        #test edit is not 0 or 1
        response = c.post('/api/new_default_level', {'default_level_id': 1, 'level_info': 'jsonStr', 'edit': 'a'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1038) #'the input edit needs to be 0 or 1'

        #test edit is not 0 or 1
        response = c.post('/api/new_default_level', {'default_level_id': 1, 'level_info': 'jsonStr', 'edit': 2})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1038) #'the input edit needs to be 0 or 1'

        #test new default level
        response = c.post('/api/new_default_level', {'default_level_id': 1, 'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(ret['level_id'], 1)
        _filter = Level.objects.filter(default_level_id = 1)
        self.assertEqual(len(_filter), 1)
        self.assertEqual(_filter[0].info, 'jsonStr')
        self.assertEqual(_filter[0].level_id, 1)

        #test level id already exists
        response = c.post('/api/new_default_level', {'default_level_id': 1, 'level_info': 'jsonStr2'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1022) #'this default level id already exists'

        #test edit default level
        response = c.post('/api/new_default_level', {'default_level_id': 1, 'level_info': 'jsonStr2', 'edit': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        _filter = Level.objects.filter(default_level_id = 1)
        self.assertEqual(len(_filter), 1)
        self.assertEqual(_filter[0].info, 'jsonStr2')
        self.assertEqual(_filter[0].level_id, 1)

        #new user-made level
        response = c.post('/api/new_usermade_level', {'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(ret['level_id'], 2)

        #test new default level
        response = c.post('/api/new_default_level', {'default_level_id': 3, 'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(ret['level_id'], 3)

        #test edit non-existent default level
        response = c.post('/api/new_default_level', {'default_level_id': 2, 'level_info': 'jsonStr2', 'edit': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1017) #'this level doesn't exist'

    def test_new_usermade_level(self):
        c = Client()

        #test new usermade level before login
        response = c.post('/api/new_usermade_level', {'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1001) #'please log in first'

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '765215342@qq.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #login
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test empty level info
        response = c.post('/api/new_usermade_level')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1021) #'level info can't be empty'

        for i in range(10):
            #test new user-made level
            response = c.post('/api/new_usermade_level', {'level_info': 'jsonStr'})
            ret = json.loads(response.content)
            self.assertEqual(ret['status'], 1000) #'succeeded'
            self.assertEqual(ret['level_id'], i + 1)

        #test MAX_USER_CREATED_LEVEL_NUM
        response = c.post('/api/new_usermade_level', {'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1032) #'you can't create more level'

        user = User.objects.filter(name = 'sth')[0]
        set_vip(user)
        for i in range(20):
            #test new user-made level
            response = c.post('/api/new_usermade_level', {'level_info': 'jsonStr'})
            ret = json.loads(response.content)
            self.assertEqual(ret['status'], 1000) #'succeeded'
            self.assertEqual(ret['level_id'], i + 11)

        #test MAX_VIP_CREATED_LEVEL_NUM
        response = c.post('/api/new_usermade_level', {'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1032) #'you can't create more level'

    def test_share_level(self):
        c = Client()

        #test share level before login
        response = c.post('/api/share_level')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1001) #'please log in first'

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '765215342@qq.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #login
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test empty level id
        response = c.post('/api/share_level')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1027) #'level id can't be empty'

        #test empty share or not
        response = c.post('/api/share_level', {'level_id': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1033) #'share can't be empty'

        #test share isn't 0 or 1
        response = c.post('/api/share_level', {'level_id': 1, 'share': 'a'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1034) #'the input share needs to be 0 or 1'

        #test share isn't 0 or 1
        response = c.post('/api/share_level', {'level_id': 1, 'share': 2})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1034) #'the input share needs to be 0 or 1'

        #test can't cancel share
        response = c.post('/api/share_level', {'level_id': 1, 'share': 0})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1044) #'you can't cancle share the level'

        #test level id is not Integer
        response = c.post('/api/share_level', {'level_id': 'a', 'share': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1019) #'the input level id needs to be an Integer'

        #test level id is not Integer
        response = c.post('/api/share_level', {'level_id': 2147483648, 'share': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1019) #'the input level id needs to be an Integer'

        #test level doesn't exist
        response = c.post('/api/share_level', {'level_id': 1, 'share': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1017) #'this level doesn't exist'

        level1 = Level.objects.create(info = 'level1', user_name = 'sth2', default_level_id = -1)

        #test session isn't author or admin
        response = c.post('/api/share_level', {'level_id': level1.level_id, 'share': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1031) #'you don't have operation authority'

        level2 = Level.objects.create(info = 'level2', user_name = 'sth', default_level_id = -1)

        #test share level
        response = c.post('/api/share_level', {'level_id': level2.level_id, 'share': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        level2 = Level.objects.filter(level_id = 2)[0]
        self.assertEqual(level2.shared, True)

        user = User.objects.filter(name = 'sth')[0]
        user.authority = 3
        user.save()

        #test admin share level
        response = c.post('/api/share_level', {'level_id': level1.level_id, 'share': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        level1 = Level.objects.filter(level_id = 1)[0]
        self.assertEqual(level1.shared, True)

        '''#test not share level
        response = c.post('/api/share_level', {'level_id': level1.level_id, 'share': 0})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        level1 = Level.objects.filter(level_id = 1)[0]
        self.assertEqual(level1.shared, False)'''

    def test_get_all_level(self):
        c = Client()

        #test get all level before login
        response = c.post('/api/get_all_level')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1001) #'please log in first'

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '765215342@qq.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #login
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test no authority
        response = c.post('/api/get_all_level')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1031) #'you don't have operation authority'

        #new user-made level
        response = c.post('/api/new_usermade_level', {'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        user = User.objects.filter(name = 'sth')[0]
        user.authority = 3
        user.save()

        response = c.post('/api/get_all_level')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(json.loads(ret['all_level']), [1])

        #new default level
        response = c.post('/api/new_default_level', {'default_level_id': 1, 'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        response = c.post('/api/get_all_level')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(json.loads(ret['all_level']), [1, 2])

    def test_get_all_shared_level(self):
        c = Client()

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '765215342@qq.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #login
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #new user-made level
        response = c.post('/api/new_usermade_level', {'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test get all shared level
        response = c.post('/api/get_all_shared_level')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(json.loads(ret['all_shared_level']), [])

        level1 = Level.objects.filter(level_id = 1)[0]
        level1.shared = True
        level1.save()

        #test get all shared level
        response = c.post('/api/get_all_shared_level')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(json.loads(ret['all_shared_level']), [1])

        user = User.objects.filter(name = 'sth')[0]
        user.authority = 3
        user.save()
        #new default level
        response = c.post('/api/new_default_level', {'default_level_id': 1, 'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test get all shared level
        response = c.post('/api/get_all_shared_level')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(json.loads(ret['all_shared_level']), [1])

        level2 = Level.objects.filter(default_level_id = 1)[0]
        level2.shared = True
        level2.save()

        #test get all shared level
        response = c.post('/api/get_all_shared_level')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(json.loads(ret['all_shared_level']), [1, 2])

        level2 = Level.objects.filter(level_id = 2)[0]
        level2.shared = False
        level2.save()
        
        #test get all shared level
        response = c.post('/api/get_all_shared_level')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(json.loads(ret['all_shared_level']), [1])

class SolutionSystemTestCase(TestCase):
    def test_new_std_solution(self):
        c = Client()

        #test not login
        response = c.post('/api/new_std_solution', {'solution_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1001) #'please log in first'

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #login
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test doesn't have authority
        response = c.post('/api/new_std_solution', {'solution_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1031) #'you don't have operation authority'

        user = User.objects.filter(name = 'sth')[0]
        user.authority = 3
        user.save()

        #test empty default level id
        response = c.post('/api/new_std_solution', {'solution_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1020) #'default level id can't be empty'

        #test default level id is not Integer
        response = c.post('/api/new_std_solution', {'solution_info': 'jsonStr', 'default_level_id': 'a'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1018) #'the input default level id needs to be an Integer'

        #test default level id is not Integer
        response = c.post('/api/new_std_solution', {'solution_info': 'jsonStr', 'default_level_id': 2147483648})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1018) #'the input default level id needs to be an Integer'

        #test default level doesn't exist
        response = c.post('/api/new_std_solution', {'solution_info': 'jsonStr', 'default_level_id': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1017) #'this level doesn't exist'

        #test new default level
        response = c.post('/api/new_default_level', {'default_level_id': 1, 'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test edit is not 0 or 1
        response = c.post('/api/new_std_solution', {'solution_info': 'jsonStr', 'default_level_id': 1, 'edit': 'a'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1038) #'the input edit needs to be 0 or 1'

        #test edit is not 0 or 1
        response = c.post('/api/new_std_solution', {'solution_info': 'jsonStr', 'default_level_id': 1, 'edit': 2})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1038) #'the input edit needs to be 0 or 1'

        #test empty solution info
        response = c.post('/api/new_std_solution', {'default_level_id': 1, 'edit': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1023) #'solution info can't be empty'

        #test solution info doesn't contain 'block_num'
        response = c.post('/api/new_std_solution', {'solution_info': json.dumps({}), 'default_level_id': 1, 'edit': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1041) #'solution info dict needs to contain key 'block_num''

        #test 'block_num' isn't Integer
        response = c.post('/api/new_std_solution', {'solution_info': json.dumps({'block_num':'a'}), 'default_level_id': 1, 'edit': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1042) #''block_num' in solution_info dict needs to be an Integer'

        #test 'block_num' isn't Integer
        response = c.post('/api/new_std_solution', {'solution_info': json.dumps({'block_num':2147483648}), 'default_level_id': 1, 'edit': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1042) #''block_num' in solution_info dict needs to be an Integer'

        #test new std solution
        response = c.post('/api/new_std_solution', {'solution_info': json.dumps({'block_num': 6}), 'default_level_id': 1, 'edit': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(ret['solution_id'], 1)
        level1 = Level.objects.filter(default_level_id = 1)[0]
        self.assertEqual(level1.std_solution_id, 1)
        user = User.objects.filter(name = 'sth')[0]
        self.assertEqual(json.loads(user.solution_dict), {'1' : 1})

        #test default level has one std solution
        response = c.post('/api/new_std_solution', {'solution_info': json.dumps({'block_num': 5}), 'default_level_id': 1, 'edit': 0})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1039) #'this default level has already had one std solution'

        level = Level.objects.create(default_level_id = 2, info = 'level2', user_name = 'abc')
        solution = Solution.objects.create(level_id = level.level_id, info = json.dumps({'block_num': 6}), user_name = 'xxx', score = 3)
        level.std_solution_id = solution.solution_id
        level.save()
        #test new solution
        response = c.post('/api/new_solution', {'level_id': 2, 'solution_info': json.dumps({'block_num': 6})})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        user = User.objects.filter(name = 'sth')[0]
        self.assertEqual(json.loads(user.solution_dict), {'1' : 1, '2' : 3})

        #test edit std solution
        response = c.post('/api/new_std_solution', {'solution_info': json.dumps({'block_num': 7}), 'default_level_id': 2, 'edit': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(ret['solution_id'], 3)
        level2 = Level.objects.filter(default_level_id = 2)[0]
        self.assertEqual(level2.std_solution_id, 3)
        self.assertEqual(len(Solution.objects.all()), 3)
        solution2 = Solution.objects.filter(solution_id = 3)[0]
        self.assertEqual(solution2.info, json.dumps({'block_num': 7}))
        user = User.objects.filter(name = 'sth')[0]
        self.assertEqual(json.loads(user.solution_dict), {'1' : 1, '2' : 3})

    def test_new_solution(self):
        c = Client()

        #test not login
        response = c.post('/api/new_solution', {'level_id': 1, 'solution_info': 'jsonStr', 'score': 0})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1001) #'please log in first'

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #login
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test empty level id
        response = c.post('/api/new_solution', {'solution_info': 'jsonStr', 'score': 0})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1027) #'level id can\'t be empty'

        #test level id is not Integer
        response = c.post('/api/new_solution', {'level_id': 'a', 'solution_info': 'jsonStr', 'score': 0})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1019) #'the input level id needs to be an Integer'

        #test level id is too large
        response = c.post('/api/new_solution', {'level_id': 2147483648, 'solution_info': 'jsonStr', 'score': 0})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1019) #'the input level id needs to be an Integer'

        #test level id not exists
        response = c.post('/api/new_solution', {'level_id': 1, 'solution_info': 'jsonStr', 'score': 0})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1017) #'this level doesn't exist'

        user = User.objects.filter(name = 'sth')[0]
        user.authority = 3
        user.save()
        #new default level
        response = c.post('/api/new_default_level', {'default_level_id': 1, 'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test empty solution info
        response = c.post('/api/new_solution', {'level_id': 1, 'score': 0})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1023) #'solution info can't be empty'

        #test solution info doesn't contain 'block_num'
        response = c.post('/api/new_solution', {'level_id': 1, 'solution_info': json.dumps({})})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1041) #'solution info dict needs to contain key 'block_num''

        #test block_num is not Integer
        response = c.post('/api/new_solution', {'level_id': 1, 'solution_info': json.dumps({'block_num': 'a'})})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1042) #''block_num' in solution_info dict needs to be an Integer'

        #test block_num is not Integer
        response = c.post('/api/new_solution', {'level_id': 1, 'solution_info': json.dumps({'block_num': 2147483648})})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1042) #''block_num' in solution_info dict needs to be an Integer'

        #test default level doesn't have one std solution
        response = c.post('/api/new_solution', {'level_id': 1, 'solution_info': json.dumps({'block_num': 5})})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1040) #'calculate score error, this default level doesn't have one std solution'

        #logout
        response = c.post('/api/logout')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #register
        response = c.post('/api/register', {'name': 'sth2', 'password': 'abc', 'email': '122@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #login
        response = c.post('/api/login', {'name': 'sth2', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        sth2 = User.objects.filter(name = 'sth2')[0]
        sth2.authority = 3
        sth2.save()

        #new std solution
        response = c.post('/api/new_std_solution', {'solution_info': json.dumps({'block_num': 6}), 'default_level_id': 1, 'edit': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #logout
        response = c.post('/api/logout')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #login
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        
        #test new solution
        response = c.post('/api/new_solution', {'level_id': 1, 'solution_info': json.dumps({'block_num': 5})})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(ret['solution_id'], 2)
        solution = Solution.objects.filter(solution_id = 2)[0]
        self.assertEqual(solution.score, 3)

        #test new solution
        response = c.post('/api/new_solution', {'level_id': 1, 'solution_info': json.dumps({'block_num': 10})})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(ret['solution_id'], 2)
        solution = Solution.objects.filter(solution_id = 2)[0]
        self.assertEqual(solution.score, 2)

        #test new solution
        response = c.post('/api/new_solution', {'level_id': 1, 'solution_info': json.dumps({'block_num': 15})})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(ret['solution_id'], 2)
        solution = Solution.objects.filter(solution_id = 2)[0]
        self.assertEqual(solution.score, 1)

        #new usermade level
        response = c.post('/api/new_usermade_level', {'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(ret['level_id'], 2)

        #test new solution
        response = c.post('/api/new_solution', {'level_id': 2, 'solution_info': json.dumps({'block_num': 10})})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(ret['solution_id'], 3)
        solution = Solution.objects.filter(solution_id = 3)[0]
        self.assertEqual(solution.score, 4)
        sth = User.objects.filter(name = 'sth')[0]
        self.assertEqual(sth.solution_dict, json.dumps({'1':2, '2':3}))

    def test_get_solution_info(self):
        c = Client()

        #test empty solution id
        response = c.post('/api/get_solution_info')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1035) #'solution id can't be empty'

        #test solution id is not Integer
        response = c.post('/api/get_solution_info', {'solution_id': 'a'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1036) #'the input solution id needs to be an Integer'

        #test solution id is not Integer
        response = c.post('/api/get_solution_info', {'solution_id': 2147483648})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1036) #'the input solution id needs to be an Integer'

        #test solution id doesn't exist
        response = c.post('/api/get_solution_info', {'solution_id': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1037) #'this solution doesn't exist'

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #login
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #new usermade level
        response = c.post('/api/new_usermade_level', {'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #new solution
        response = c.post('/api/new_solution', {'level_id': 1, 'solution_info': json.dumps({'block_num': 5})})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        solution2 = Solution.objects.create(info = 'solution2', user_name = 'sth2', level_id = 1, score = 2)
        c.post('/api/logout')

        #test not login
        response = c.post('/api/get_solution_info', {'solution_id': solution2.solution_id})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1001) #'please log in first'

        #login
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test not author
        response = c.post('/api/get_solution_info', {'solution_id': solution2.solution_id})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1031) #'you don't have operation authority'
        
        #test get solution info
        response = c.post('/api/get_solution_info', {'solution_id': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000)
        self.assertEqual(ret['solution_info'], json.dumps({'block_num': 5}))
        self.assertEqual(ret['score'], 4)
        self.assertEqual(ret['level_id'], 1)
        self.assertEqual(ret['author'], 'sth')
        self.assertEqual(ret['shared'], False)

        solution = Solution.objects.filter(solution_id = 1)[0]
        solution.shared = True
        solution.save()

        #test get solution info
        response = c.post('/api/get_solution_info', {'solution_id': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000)
        self.assertEqual(ret['solution_info'], json.dumps({'block_num': 5}))
        self.assertEqual(ret['score'], 4)
        self.assertEqual(ret['level_id'], 1)
        self.assertEqual(ret['author'], 'sth')
        self.assertEqual(ret['shared'], True)

    def test_share_solution(self):
        c = Client()

        #test share solution before login
        response = c.post('/api/share_solution')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1001) #'please log in first'

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '765215342@qq.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #login
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test empty solution id
        response = c.post('/api/share_solution')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1035) #'solution id can't be empty'

        #test empty share or not
        response = c.post('/api/share_solution', {'solution_id': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1033) #'share can't be empty'

        #test share isn't 0 or 1
        response = c.post('/api/share_solution', {'solution_id': 1, 'share': 'a'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1034) #'the input share needs to be 0 or 1'

        #test share isn't 0 or 1
        response = c.post('/api/share_solution', {'solution_id': 1, 'share': 2})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1034) #'the input share needs to be 0 or 1'

        #test solution id is not Integer
        response = c.post('/api/share_solution', {'solution_id': 'a', 'share': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1036) #'the input solution id needs to be an Integer'

        #test solution id is not Integer
        response = c.post('/api/share_solution', {'solution_id': 2147483648, 'share': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1036) #'the input solution id needs to be an Integer'

        #test solution id doesn't exist
        response = c.post('/api/share_solution', {'solution_id': 1, 'share': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1037) #'this solution doesn't exist'

        level1 = Level.objects.create(default_level_id = -1, info = 'levelinfo', user_name = 'abc')
        level2 = Level.objects.create(default_level_id = -1, info = 'levelinfo', user_name = 'abc')

        solution1 = Solution.objects.create(info = 'solution1', user_name = 'sth2', level_id = 1, score = 2)

        #test session isn't author or admin
        response = c.post('/api/share_solution', {'solution_id': solution1.solution_id, 'share': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1031) #'you don't have operation authority'

        solution2 = Solution.objects.create(info = 'solution2', user_name = 'sth', level_id = 2, score = 3)

        #test can't share solution before sharing level
        response = c.post('/api/share_solution', {'solution_id': solution2.solution_id, 'share': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1043) #'the level need to be shared before sharing the solution'

        level1.shared = True
        level1.save()
        level2.shared = True
        level2.save()

        #test share solution
        response = c.post('/api/share_solution', {'solution_id': solution2.solution_id, 'share': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        solution2 = Solution.objects.filter(solution_id = 2)[0]
        self.assertEqual(solution2.shared, True)

        user = User.objects.filter(name = 'sth')[0]
        user.authority = 3
        user.save()

        #test admin share solution
        response = c.post('/api/share_solution', {'solution_id': solution1.solution_id, 'share': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        solution1 = Solution.objects.filter(solution_id = 1)[0]
        self.assertEqual(solution1.shared, True)

        #test not share solution
        response = c.post('/api/share_solution', {'solution_id': solution1.solution_id, 'share': 0})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        solution1 = Solution.objects.filter(solution_id = 1)[0]
        self.assertEqual(solution1.shared, False)

    def test_get_all_shared_solution(self):
        c = Client()

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '765215342@qq.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #login
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        Level.objects.create(default_level_id = -1, info = 'levelinfo', user_name = 'abc')

        #new solution
        response = c.post('/api/new_solution', {'solution_info': json.dumps({'block_num': 5}), 'level_id': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test get all shared solution
        response = c.post('/api/get_all_shared_solution')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(json.loads(ret['all_shared_solution']), [])

        solution1 = Solution.objects.filter(solution_id = 1)[0]
        solution1.shared = True
        solution1.save()

        #test get all shared solution
        response = c.post('/api/get_all_shared_solution')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(json.loads(ret['all_shared_solution']), [1])

        Solution.objects.create(user_name = 'abc', level_id = 2, info = 'solution info', score = 2)

        #test get all shared solution
        response = c.post('/api/get_all_shared_solution')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(json.loads(ret['all_shared_solution']), [1])

        solution2 = Solution.objects.filter(solution_id = 2)[0]
        solution2.shared = True
        solution2.save()

        #test get all shared solution
        response = c.post('/api/get_all_shared_solution')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(json.loads(ret['all_shared_solution']), [1, 2])

        solution2 = Solution.objects.filter(solution_id = 2)[0]
        solution2.shared = False
        solution2.save()
        
        #test get all shared solution
        response = c.post('/api/get_all_shared_solution')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(json.loads(ret['all_shared_solution']), [1])

    def test_change_level_info(self):
        c = Client()

        #test change level info before login
        response = c.post('/api/change_level_info')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1001) #'please log in first'

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '765215342@qq.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #login
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test empty level id
        response = c.post('/api/change_level_info')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1027) #'level id can't be empty'

        #test level id is not Integer
        response = c.post('/api/change_level_info', {'level_id': 'a'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1019) #'the input level id needs to be an Integer'

        #test level id is not Integer
        response = c.post('/api/change_level_info', {'level_id': 2147483648})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1019) #'the input level id needs to be an Integer'

        #test level doesn't exist
        response = c.post('/api/change_level_info', {'level_id': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1017) #'this level doesn't exist'

        level1 = Level.objects.create(info = 'level1', user_name = 'sth2', default_level_id = -1)

        #test session isn't author or admin
        response = c.post('/api/change_level_info', {'level_id': level1.level_id})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1031) #'you don't have operation authority'

        level2 = Level.objects.create(info = 'level2', user_name = 'sth', default_level_id = -1)
        level2.shared = True
        level2.save()

        #test can't edit shared level
        response = c.post('/api/change_level_info', {'level_id': level2.level_id})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1045) #'you can't edit shared level'

        level2 = Level.objects.filter(info = 'level2')[0]
        level2.shared = False
        level2.save()

        #test empty level info
        response = c.post('/api/change_level_info', {'level_id': level2.level_id})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1021) #'level info can't be empty'

        solution1 = Solution.objects.create(user_name = 'abc', level_id = level2.level_id, info = json.dumps({'block_num': 6}), score = 3)
        solution2 = Solution.objects.create(user_name = 'abc', level_id = level2.level_id, info = json.dumps({'block_num': 6}), score = 3)
        
        #test change level info
        response = c.post('/api/change_level_info', {'level_id': level2.level_id, 'level_info': 'change_info'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        level2 = Level.objects.filter(level_id = 2)[0]
        self.assertEqual(level2.info, 'change_info')
        solution1 = Solution.objects.filter(solution_id = 1)[0]
        solution2 = Solution.objects.filter(solution_id = 2)[0]
        self.assertEqual(solution1.score, 0)
        self.assertEqual(solution2.score, 0)

        user = User.objects.filter(name = 'sth')[0]
        user.authority = 3
        user.save()

        solution3 = Solution.objects.create(user_name = 'abc', level_id = level1.level_id, info = json.dumps({'block_num': 6}), score = 3)
        solution4 = Solution.objects.create(user_name = 'abc', level_id = level1.level_id, info = json.dumps({'block_num': 6}), score = 3)

        #test admin change level info
        response = c.post('/api/change_level_info', {'level_id': level1.level_id, 'level_info': 'change_info_level1'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        level1 = Level.objects.filter(level_id = 1)[0]
        self.assertEqual(level1.info, 'change_info_level1')
        solution3 = Solution.objects.filter(solution_id = 3)[0]
        solution4 = Solution.objects.filter(solution_id = 4)[0]
        self.assertEqual(solution3.score, 0)
        self.assertEqual(solution4.score, 0)