# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase
from django.test import Client

# Create your tests here.

class IndexTestCase(TestCase):
    def test_index_page(self):
        c = Client()
        response = c.get("/")
        self.assertRedirects(response, "/codechef.html")
