from django.db import models


# Create your models here.
class Spider(models.Model):
    name = models.CharField()