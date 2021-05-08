from django import forms
from django.apps import apps
from django.forms import BaseInlineFormSet


# Create your forms here.
from modules.scrapers.models import Spider


class ParserInlineFormSet(BaseInlineFormSet):
    def clean(self):
        super().clean()
        News = apps.get_model('scrapers', 'spider')
        print(list(map(lambda x: x.name, Spider._meta.get_fields())))
        for i in Spider._meta.get_fields():
            print(i.name)
