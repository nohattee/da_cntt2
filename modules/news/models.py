from apscheduler.jobstores.base import JobLookupError
from django.db import models
from django.utils.translation import gettext_lazy as _

from mptt.models import MPTTModel
from mptt.fields import TreeForeignKey

from scrapy.settings import Settings
from scrapy.crawler import CrawlerRunner
from scrapy.utils.log import configure_logging

from modules.news.apps import scheduler
from tools.scraper.scraper.spiders.news import NewsSpider


# Create your models here.
class Spider(models.Model):
    name = models.CharField(max_length=256)
    url = models.CharField('URL', max_length=256)
    is_multiple = models.BooleanField('Multiple')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Category(MPTTModel):
    name = models.CharField(max_length=50)
    parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class MPTTMeta:
        order_insertion_by = ['name']

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Scraper(models.Model):
    class SchedulerType(models.TextChoices):
        ONCE = 'once', _('Once')
        HOURLY = 'hourly', _('Hourly')
        DAILY = 'daily', _('Daily')
        # WEEKLY = 'weekly', _('Weekly')
        # MONTHLY = 'month', _('Monthly')
        # YEARLY = 'yearly', _('Yearly')

    class CrawlType(models.TextChoices):
        ALL = 'all', _('All')
        LATEST = 'latest', _('Latest')

    name = models.CharField(max_length=256)
    homepage = models.CharField(max_length=256)
    crawl_type = models.CharField(
        max_length=50,
        choices=CrawlType.choices,
        default=CrawlType.LATEST
    )
    scheduler_type = models.CharField(
        max_length=50,
        choices=SchedulerType.choices,
        default=SchedulerType.ONCE
    )
    start_time = models.TimeField()
    start_date = models.DateField()
    job_id = models.CharField(max_length=256)
    is_active = models.BooleanField('Active', default=False)
    spiders = models.ManyToManyField(Spider, through='ScraperSpider')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def start_crawling(self):
        if self.is_active is False:
            return

        configure_logging()
        crawl_settings = Settings()
        crawl_settings.setmodule('tools.scraper.scraper.settings')
        runner = CrawlerRunner(crawl_settings)
        for _spider in self.scraperspider_set.all():
            runner.crawl(NewsSpider, spider=_spider)

    def update_job(self):
        if self.job_id is not None:
            try:
                scheduler.remove_job(job_id=self.job_id)
            except JobLookupError:
                print("No job")

        job_id = None
        if self.scheduler_type == 'once':
            job_id = scheduler.add_job(
                self.start_crawling,
                trigger='date',
                run_date='{} {}'.format(self.start_date, self.start_time),
            ).id

        if self.scheduler_type == 'hourly':
            job_id = scheduler.add_job(
                self.start_crawling,
                trigger='cron',
                args=[self],
                minute=self.start_time.minute
            ).id

        if self.scheduler_type == 'daily':
            job_id = scheduler.add_job(
                self.start_crawling,
                trigger='cron',
                minute=self.start_time.minute,
                hour=self.start_time.hour
            ).id

        self.job_id = job_id

    def __str__(self):
        return self.name


class ScraperSpider(models.Model):
    scraper = models.ForeignKey(Scraper, on_delete=models.CASCADE)
    spider = models.ForeignKey(Spider, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# class ScraperLog(models.Model):
#     class Status(models.TextChoices):
#         RUNNING = 'running', _('Running')
#         FINISHED = 'finished', _('Finished')
#         FAILED = 'failed', _('Failed')
#
#     start_time = models.DateTimeField()
#     end_time = models.DateTimeField(null=True)
#     description = models.TextField()
#     status = models.CharField(
#         max_length=50,
#         choices=Status.choices,
#         default=Status.RUNNING
#     )
#     scraper = models.ForeignKey(Scraper, on_delete=models.CASCADE)


# class SpiderLog(models.Model):
#     class Status(models.TextChoices):
#         RUNNING = 'running', _('Running')
#         FINISHED = 'finished', _('Finished')
#         FAILED = 'failed', _('Failed')
#
#     start_time = models.DateTimeField()
#     end_time = models.DateTimeField(null=True)
#     description = models.TextField()
#     status = models.CharField(
#         max_length=50,
#         choices=Status.choices,
#         default=Status.RUNNING
#     )
#     spider = models.ForeignKey(Spider, on_delete=models.CASCADE)
#
#     class Meta:
#         verbose_name = 'Spider Log'
#         verbose_name_plural = 'Spider Logs'
#
#     def __str__(self):
#         return str(self.id)


class Item(models.Model):
    title = models.TextField(null=True)
    content = models.TextField(null=True)
    url = models.TextField()
    author = models.TextField(null=True)
    category = models.TextField(null=True)
    tag = models.TextField(null=True)
    summary = models.TextField(null=True)
    published_at = models.TextField(null=True)
    thumbnail_link = models.TextField(null=True)
    image_link = models.TextField(null=True)
    spider = models.ForeignKey(Spider, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.url


class News(models.Model):
    title = models.CharField(max_length=256)
    content = models.TextField(null=True)
    url = models.CharField(max_length=256)
    thumbnail_link = models.CharField(max_length=256, null=True)
    image_link = models.CharField(max_length=256, null=True)
    author = models.CharField(max_length=256)
    summary = models.TextField(null=True)
    published_at = models.DateTimeField()
    categories = models.ManyToManyField(Category)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'News'

# class Parser(models.Model):
#     class SelectorType(models.TextChoices):
#         XPATH = 'xpath', _('XPATH')
#         CSS = 'css', _('CSS')
#
#     name = models.CharField(max_length=256)
#     selector_type = models.CharField(
#         max_length=50,
#         choices=SelectorType.choices,
#         default=SelectorType.XPATH
#     )
#     selector = models.CharField(max_length=256)
#     spider = models.ForeignKey(Spider, on_delete=models.CASCADE)

# class SpiderItem(models.Model):
#     class ItemType(models.TextChoices):
#         NEWSITEM = 'NewsItem', _('News')
#
#     item_type = models.CharField(
#         max_length=50,
#         choices=ItemType.choices,
#         default=ItemType.NEWSITEM
#     )
#     spider = models.ForeignKey(Spider, on_delete=models.CASCADE)
#     scraper_log = models.ForeignKey(ScraperLog, on_delete=models.CASCADE)


# class NewsItem(models.Model):
#     title = models.CharField(max_length=256, null=True)
#     content = models.TextField(null=True)
#     url = models.URLField()
#     author = models.CharField(max_length=256, null=True)
#     category = models.CharField(max_length=256, null=True)
#     tag = models.CharField(max_length=256, null=True)
#     summary = models.TextField(null=True)
#     publish_date = models.CharField(max_length=256, null=True)
#     scraper_log = models.ForeignKey(ScraperLog, on_delete=models.SET_NULL, null=True)
#
#     # spider_item = models.ForeignKey(SpiderItem, on_delete=models.CASCADE, null=True)

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
