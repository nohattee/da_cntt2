from django import forms
from django.apps import apps
from django.forms import BaseInlineFormSet


# Create your forms here.
from modules.news.models import Spider


class ParserInlineFormSet(BaseInlineFormSet):
    pass