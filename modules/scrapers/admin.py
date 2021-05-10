from gettext import ngettext
from django.contrib import admin, messages
from mptt.admin import DraggableMPTTAdmin
from scrapy.settings import Settings
from scrapy.crawler import CrawlerRunner
from scrapy.utils.log import configure_logging

from tools.scraper.scraper.spiders.news import NewsSpider
from modules.scrapers.apps import scheduler
from modules.scrapers.forms import ParserInlineFormSet
from modules.scrapers.models import Spider, Scraper, ScraperSpider, Category, Parser, NewsItem, News

# Register your models here.
from crochet import setup
setup()


class NewsAdmin(admin.ModelAdmin):
    list_display = ['title', 'publish_date']


class ParserTabularInline(admin.TabularInline):
    model = Parser
    formset = ParserInlineFormSet
    extra = 0


class SpiderAdmin(admin.ModelAdmin):
    inlines = (
        ParserTabularInline,
    )


class ScraperSpiderTabularInline(admin.TabularInline):
    model = ScraperSpider
    extra = 0


class ScraperAdmin(admin.ModelAdmin):
    inlines = (
        ScraperSpiderTabularInline,
    )

    actions = ['setup_crawler', 'stop_crawler']
    list_display = ['name', 'status', 'scheduler_type']
    readonly_fields = ('status',)

    @admin.action(description='Start crawling')
    def setup_crawler(self, request, queryset):
        for query in queryset:
            if query.scheduler_type == 'once':
                start_crawling(query)

            else:
                if query.scheduler_type == 'hourly':
                    job = scheduler.add_job(
                        start_crawling,
                        trigger='cron',
                        args=[query],
                        minute=query.start_time.minute
                    )
                    query.job_id = job.id
                    query.save()
                elif query.scheduler_type == 'daily':
                    job = scheduler.add_job(
                        start_crawling,
                        trigger='cron',
                        args=[query],
                        minute=query.start_time.minute,
                        hour=query.start_time.hour
                    )
                    query.job_id = job.id
                    query.save()

        self.message_user(request, ngettext(
            '%d scraper was successfully marked as published.',
            '%d scrapers were successfully marked as published.',
            len(queryset),
        ) % len(queryset), messages.SUCCESS)

    @admin.action(description='Stop crawling')
    def stop_crawler(self, request, queryset):
        for query in queryset:
            scheduler.remove_job(query.job_id)
        self.message_user(request, ngettext(
            '%d scraper was successfully marked as published.',
            '%d scrapers were successfully marked as published.',
            len(queryset),
        ) % len(queryset), messages.SUCCESS)


admin.site.register(News)
admin.site.register(NewsItem)
admin.site.register(Spider, SpiderAdmin)
admin.site.register(Scraper, ScraperAdmin)
admin.site.register(Category, DraggableMPTTAdmin)


def start_crawling(scraper):
    scraper.status = 'running'
    scraper.save()

    configure_logging({'LOG_FORMAT': '%(levelname)s: %(message)s'})

    crawl_settings = Settings()

    crawl_settings.setmodule('tools.scraper.scraper.settings')
    runner = CrawlerRunner(crawl_settings)
    for _spider in scraper.scraperspider_set.all():
        if _spider.spider.item_type == 'news':
            runner.crawl(NewsSpider, spider=_spider)