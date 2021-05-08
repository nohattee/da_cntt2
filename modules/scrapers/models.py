from django.db import models
from django.utils.translation import gettext_lazy as _

from mptt.models import MPTTModel
from mptt.fields import TreeForeignKey


# Create your models here.
class Spider(models.Model):
    class ItemType(models.TextChoices):
        NEWS = 'news', _('News')

    name = models.CharField(max_length=256)
    url = models.CharField(max_length=256)
    selector_link = models.CharField(max_length=256)
    item_type = models.CharField(
        max_length=50,
        choices=ItemType.choices,
        default=ItemType.NEWS
    )


class Category(MPTTModel):
    name = models.CharField(max_length=50)
    parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    class MPTTMeta:
        order_insertion_by = ['name']

    def __str__(self):
        return self.name


class Scraper(models.Model):
    class SchedulerType(models.TextChoices):
        ONCE = 'once', _('Once')
        HOURLY = 'hourly', _('Hourly')
        DAILY = 'daily', _('Daily')
        WEEKLY = 'weekly', _('Weekly')
        MONTHLY = 'month', _('Monthly')
        YEARLY = 'yearly', _('Yearly')

    name = models.CharField(max_length=256)
    scheduler_type = models.CharField(
        max_length=50,
        choices=SchedulerType.choices,
        default=SchedulerType.ONCE
    )
    start_time = models.TimeField()
    start_date = models.DateField()
    is_active = models.BooleanField('Active', default=False)
    spiders = models.ManyToManyField(Spider, through='ScraperSpider')


class ScraperSpider(models.Model):
    scraper = models.ForeignKey(Scraper, on_delete=models.CASCADE)
    spider = models.ForeignKey(Spider, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)


class Parser(models.Model):
    class SelectorType(models.TextChoices):
        XPATH = 'xpath', _('XPATH')
        CSS = 'css', _('CSS')

    name = models.CharField(max_length=256)
    selector_type = models.CharField(
        max_length=50,
        choices=SelectorType.choices,
        default=SelectorType.XPATH
    )
    selector = models.CharField(max_length=256)
    parsers = models.ForeignKey(Spider, on_delete=models.CASCADE)


class SpiderItem(models.Model):
    name = models.CharField(256)


# class SpiderItem(models.Model):
#     item_type = models.Choices
#
#
# class NewsItem(models.Model):
#     title = models.CharField(max_length=256)
#     content = models.TextField()
#     image_link = models.CharField(max_length=256)
#     author = models.CharField(max_length=256)
#     category = models.CharField(max_length=256)
#     summary = models.TextField()
#     publish_date = models.CharField(max_length=256)
