# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase
from django.test import Client
import json
from models import User
from models import Level
from models import Solution

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
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1002) #'user name can't be empty'

        #test empty password
        response = c.post('/api/register', {'name': 'sth', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1003) #'password can't be empty'

        #test empty email
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1004) #'email can't be empty'

        #test succeeded
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test this name already exists
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '123@456.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1005) #'this name already exists'

        #test 'this email already exists'
        response = c.post('/api/register', {'name': 'sth2', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1006) #'this email address already exists'

        #test 'this name is too long'
        response = c.post('/api/register', {'name': 'abcdefghijklmnopqrstvwxyz', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1007) #'this name is too long'

        #test 'this password is too long'
        response = c.post('/api/register', {'name': 'sth2', 'password': 'abcdefghijklmnopqrstvwxyz', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1008) #'this password is too long'

        #test 'this email is too long'
        response = c.post('/api/register', {'name': 'sth2', 'password': 'abc', 'email': 'abcdefghijklmnopqrstvwxyzabcdefghijklmnopqrstvwxyz@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1009) #'this email address is too long'

        #login and test register after login
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        response = c.post('/api/register', {'name': 'sth2', 'password': 'abc', 'email': '123@233.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1010) #'you have already logged in'

    def test_login(self):
        c = Client()

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        
        #test empty name
        response = c.post('/api/login', {'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1002) #'user name can't be empty'

        #test empty password
        response = c.post('/api/login', {'name': 'sth'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1003) #'password can't be empty'

        #test 'this name doesn\'t exist'
        response = c.post('/api/login', {'name': 'sth2', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1011) #'this name doesn't exist'

        #test 'wrong password'
        response = c.post('/api/login', {'name': 'sth', 'password': 'abcd'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1012) #'wrong password'

        #test login succeeded
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test login twice
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1010) #'you have already logged in'

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
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1001) #'please log in first'

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
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1013) #'new password can't be empty'

        #test new password is too long
        response = c.post('/api/change_password_after_login', {'new_password' : 'abcdefghijklmnopqrstuvwxyz'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1008) #'this password is too long'

    def test_change_password_by_email(self):
        c = Client()

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '765215342@qq.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test empty name
        response = c.post('/api/change_password_by_email')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1002) #'name can't be empty'

        #test name not exist
        response = c.post('/api/change_password_by_email', {'name': 'sthsth'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1011) #'this name doesn't exist'
        
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
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1002) #'name can't be empty'

        #test empty identifyingCode
        response = c.post('/api/change_password_by_identifyingCode', {'name': 'sth', 'new_password': 'newpw'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1014) #'identifying code can't be empty'

        #test empty new_password
        response = c.post('/api/change_password_by_identifyingCode', {'name': 'sth', 'identifyingCode': identifyingCode})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1013) #'new password can't be empty'

        #test name not exist
        response = c.post('/api/change_password_by_identifyingCode', {'name': 'sthsth', 'identifyingCode': identifyingCode, 'new_password': 'newpw'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1011) #'this name doesn't exist'

        #test new password is too long
        response = c.post('/api/change_password_by_identifyingCode', {'name': 'sth', 'identifyingCode': identifyingCode, 'new_password': 'newpw' + 'abcdefghijklmnopqrstvwxyz'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1008) #'this password is too long'

        #test wrong identifyingCode
        response = c.post('/api/change_password_by_identifyingCode', {'name': 'sth', 'identifyingCode': identifyingCode + '1', 'new_password': 'newpw'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1015) #'wrong identifying code'

        #test change password by identifyingCode
        response = c.post('/api/change_password_by_identifyingCode', {'name': 'sth', 'identifyingCode': identifyingCode, 'new_password': 'newpw'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test wrong identifyingCode
        response = c.post('/api/change_password_by_identifyingCode', {'name': 'sth', 'identifyingCode': '', 'new_password': 'newpw'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1015) #'wrong identifying code'

        #test login after changing password
        response = c.post('/api/login', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1012) #'wrong password'
        response = c.post('/api/login', {'name': 'sth', 'password': 'newpw'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test change password by old identifying code
        response = c.post('/api/change_password_by_identifyingCode', {'name': 'sth', 'identifyingCode': identifyingCode, 'new_password': 'newpw2'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1015) #'wrong identifying code'


class LevelSystemTestCase(TestCase):
    def test_get_level_info(self):
        c = Client()

        #create level
        Level.objects.create(default_level_id = 1, info = json.dumps([1,3,5]), user_name = "sth")
        Level.objects.create(default_level_id = -1, info = "123", user_name = "sth2")

        #test level id and default level id empty in the same time
        response = c.post('/api/get_level_info')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1016) #'level id and default level id can't be empty in the same time'

        #test default level id not exists
        response = c.post('/api/get_level_info', {'default_level_id': 2147483647})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1017) #'this level doesn't exist'

        #test default level id is not Integer
        response = c.post('/api/get_level_info', {'default_level_id': 'a'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1018) #'the input default level id needs to be an Integer'

        #test default level id is too large
        response = c.post('/api/get_level_info', {'default_level_id': '-2147483649'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1018) #'the input default level id needs to be an Integer'

        #test default level id is too large
        response = c.post('/api/get_level_info', {'default_level_id': 2147483648})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1018) #'the input default level id needs to be an Integer'

        #test get level info
        response = c.post('/api/get_level_info', {'default_level_id': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(json.loads(ret['level_info']), [1,3,5])


        #test level id not exists
        response = c.post('/api/get_level_info', {'level_id': 2147483647})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1017) #'this level doesn't exist'

        #test level id is not Integer
        response = c.post('/api/get_level_info', {'level_id': 'a'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1019) #'the input level id needs to be an Integer'

        #test level id is too large
        response = c.post('/api/get_level_info', {'level_id': '-2147483649'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1019) #'the input level id needs to be an Integer'

        #test level id is too large
        response = c.post('/api/get_level_info', {'level_id': 2147483648})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1019) #'the input level id needs to be an Integer'

        #test get level info
        response = c.post('/api/get_level_info', {'level_id': 2})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'
        self.assertEqual(ret['level_info'], "123")

    def test_new_default_level(self):
        c = Client()

        #test empty default level id
        response = c.post('/api/new_default_level', {'default_level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1020) #'default level id can't be empty'

        #test empty level info
        response = c.post('/api/new_default_level', {'default_level_id': 1})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1021) #'level info can't be empty'

        #test default level id is not Integer
        response = c.post('/api/new_default_level', {'default_level_id': 'a', 'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1018) #'the input default level id needs to be an Integer'

        #test default level id is too large
        response = c.post('/api/new_default_level', {'default_level_id': 2147483648666, 'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1018) #'the input default level id needs to be an Integer'

        #test new default level
        response = c.post('/api/new_default_level', {'default_level_id': 1, 'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test level id already exists
        response = c.post('/api/new_default_level', {'default_level_id': 1, 'level_info': 'jsonStr2'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1022) #'this default level id already exists'

    def test_new_usermade_level(self):
        c = Client()

        #test new usermade level before login
        response = c.post('/api/new_usermade_level', {'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1001) #'please log in first'

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
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1021) #'level info can't be empty'

        #test new user-made level
        response = c.post('/api/new_usermade_level', {'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

class SolutionSystemTestCase(TestCase):
    def test_new_solution(self):
        c = Client()

        #test not login
        response = c.post('/api/new_solution', {'level_id': 1, 'solution_info': 'jsonStr', 'score': 0})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1001) #'please log in first'

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
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1027) #'level id can\'t be empty'

        #test level id is not Integer
        response = c.post('/api/new_solution', {'level_id': 'a', 'solution_info': 'jsonStr', 'score': 0})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1019) #'the input level id needs to be an Integer'

        #test level id is too large
        response = c.post('/api/new_solution', {'level_id': 2147483648, 'solution_info': 'jsonStr', 'score': 0})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1019) #'the input level id needs to be an Integer'

        #test level id not exists
        response = c.post('/api/new_solution', {'level_id': 1, 'solution_info': 'jsonStr', 'score': 0})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1017) #'this level doesn't exist'

        #new default level
        response = c.post('/api/new_default_level', {'default_level_id': 233, 'level_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        #test empty solution info
        response = c.post('/api/new_solution', {'level_id': 1, 'score': 0})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1023) #'solution info can't be empty'

        #test empty solution info
        response = c.post('/api/new_solution', {'level_id': 1, 'solution_info': 'jsonStr'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1024) #'score can't be empty'

        #test score is not Integer
        response = c.post('/api/new_solution', {'level_id': 1, 'solution_info': 'jsonStr', 'score': 'a'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1025) #'the input score needs to be an Integer'

        #test score is not in range[0,4]
        response = c.post('/api/new_solution', {'level_id': 1, 'solution_info': 'jsonStr', 'score': 5})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 1026) #'the input score needs to be in range[0,4]'

        #test new solution
        response = c.post('/api/new_solution', {'level_id': 1, 'solution_info': 'jsonStr', 'score': 0})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 1000) #'succeeded'

        name_filter = Solution.objects.all()
        self.assertEqual(len(name_filter), 1)
        self.assertEqual(name_filter[0].solution_id, 1)
        self.assertEqual(name_filter[0].info, 'jsonStr')
