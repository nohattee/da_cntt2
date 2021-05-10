from django.db import models
from django.utils.translation import gettext_lazy as _

from mptt.models import MPTTModel
from mptt.fields import TreeForeignKey


# Create your models here.
class Spider(models.Model):
    class ItemType(models.TextChoices):
        NEWS = 'news', _('News')

    name = models.CharField(max_length=256)
    url = models.CharField('URL', max_length=256)
    is_multiple = models.BooleanField('Multiple')
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

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Scraper(models.Model):
    class Status(models.TextChoices):
        STOPPED = 'stopped', _('Stopped')
        RUNNING = 'running', _('Running')

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
    status = models.CharField(
        max_length=50,
        choices=Status.choices,
        default=Status.STOPPED
    )
    job_id = models.CharField(max_length=256)
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
    spider = models.ForeignKey(Spider, on_delete=models.CASCADE)


class ScraperLog(models.Model):
    class Status(models.TextChoices):
        FAILED = 'failed', _('Failed')
        FINISHED = 'finished', _('Finished')

    scraper = models.ForeignKey(Scraper, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True)
    status = models.CharField(
        max_length=50,
        choices=Status.choices,
        default=None
    )


class SpiderItem(models.Model):
    class ItemType(models.TextChoices):
        NEWSITEM = 'NewsItem', _('News')

    item_type = models.CharField(
        max_length=50,
        choices=ItemType.choices,
        default=ItemType.NEWSITEM
    )
    spider = models.ForeignKey(Spider, on_delete=models.CASCADE)
    scraper_log = models.ForeignKey(ScraperLog, on_delete=models.CASCADE)


class NewsItem(models.Model):
    title = models.CharField(max_length=256, null=True)
    content = models.TextField(null=True)
    url = models.URLField()
    author = models.CharField(max_length=256, null=True)
    category = models.CharField(max_length=256, null=True)
    tag = models.CharField(max_length=256, null=True)
    summary = models.TextField(null=True)
    publish_date = models.CharField(max_length=256, null=True)
    scraper_log = models.ForeignKey(ScraperLog, on_delete=models.SET_NULL, null=True)

    # spider_item = models.ForeignKey(SpiderItem, on_delete=models.CASCADE, null=True)


class News(models.Model):
    title = models.CharField(max_length=256)
    content = models.TextField(null=True)
    url = models.URLField()
    author = models.CharField(max_length=256)
    summary = models.TextField(null=True)
    publish_date = models.DateTimeField()
    categories = models.ManyToManyField(Category)

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
