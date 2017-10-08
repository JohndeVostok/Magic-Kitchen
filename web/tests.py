# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase
from django.test import Client
import json

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
        self.assertEqual(ret['error'], 'user name can\'t be empty')

        #test empty password
        response = c.post('/api/register', {'name': 'sth', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 'password can\'t be empty')

        #test empty email
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 'email can\'t be empty')

        #test succeeded
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'succeeded')

        #test this name already exists
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '123@456.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 'this name already exists')

        #test 'this email already exists'
        response = c.post('/api/register', {'name': 'sth2', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 'this email address already exists')

        #test 'this name is too long'
        response = c.post('/api/register', {'name': 'abcdefghijklmnopqrstvwxyz', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 'this name is too long')

        #test 'this password is too long'
        response = c.post('/api/register', {'name': 'sth2', 'password': 'abcdefghijklmnopqrstvwxyz', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 'this password is too long')

        #test 'this email is too long'
        response = c.post('/api/register', {'name': 'sth2', 'password': 'abc', 'email': 'abcdefghijklmnopqrstvwxyzabcdefghijklmnopqrstvwxyz@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 'this email address is too long')

        #login and test register after login
        response = c.get('/api/login?name=sth&password=abc')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'succeeded')
        response = c.post('/api/register', {'name': 'sth2', 'password': 'abc', 'email': '123@233.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 'you have already logged in')

    def test_login(self):
        c = Client()

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'succeeded')
        
        #test empty name
        response = c.get('/api/login?password=abc')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 'user name can\'t be empty')

        #test empty password
        response = c.get('/api/login?name=sth')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 'password can\'t be empty')

        #test 'this name does\'t exist'
        response = c.get('/api/login?name=sth2&password=abc')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 'this name does\'t exist')

        #test 'wrong password'
        response = c.get('/api/login?name=sth&password=abcd')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 'wrong password')

        #test login succeeded
        response = c.get('/api/login?name=sth&password=abc')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'succeeded')

        #test login twice
        response = c.get('/api/login?name=sth&password=abc')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'failed')
        self.assertEqual(ret['error'], 'you have already logged in')

    def test_logout(self):

        c = Client()

        #register
        response = c.post('/api/register', {'name': 'sth', 'password': 'abc', 'email': '123@111.com'})
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'succeeded')

        #test logout before login
        response = c.get('/api/logout')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'succeeded')

        #login succeeded
        response = c.get('/api/login?name=sth&password=abc')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'succeeded')

        #test logout after login
        response = c.get('/api/logout')
        ret = json.loads(response.content)
        self.assertEqual(ret['status'], 'succeeded')

