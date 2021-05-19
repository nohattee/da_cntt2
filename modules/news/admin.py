from gettext import ngettext
from django.contrib import admin, messages
from mptt.admin import DraggableMPTTAdmin

from modules.news.apps import scheduler
from modules.news.forms import ParserInlineFormSet
from modules.news.models import Spider, Scraper, ScraperSpider, Category, Parser, Item, News


# Register your models here.
class ParserTabularInline(admin.TabularInline):
    model = Parser
    formset = ParserInlineFormSet
    extra = 0


class ItemTabularInline(admin.TabularInline):
    model = Item
    readonly_fields = [f.name for f in model._meta.fields]
    fields = ['url']



@admin.register(Spider)
class SpiderAdmin(admin.ModelAdmin):
    list_display = ['name', 'url', 'total_items']
    inlines = (
        ParserTabularInline,
    )

    def total_items(self, obj):
        return obj.item_set.count()

    total_items.short_description = 'Total Items'


class ScraperSpiderTabularInline(admin.TabularInline):
    model = ScraperSpider
    extra = 0


@admin.register(Scraper)
class ScraperAdmin(admin.ModelAdmin):
    inlines = (
        ScraperSpiderTabularInline,
    )

    actions = ['setup_crawler', 'stop_crawler']
    list_display = ['name', 'scheduler_type', 'start_time', 'start_date', 'is_active']
    readonly_fields = ('job_id',)

    @admin.action(description='Start crawling now')
    def setup_crawler(self, request, queryset):
        for query in queryset:
            query.start_crawling()

        self.message_user(request, ngettext(
            '%d scraper was successfully running.',
            '%d scrapers were successfully running.',
            len(queryset),
        ) % len(queryset), messages.SUCCESS)

    @admin.action(description='Disable crawler')
    def disable_crawler(self, request, queryset):
        for query in queryset:
            scheduler.remove_job(query.job_id)
        self.message_user(request, ngettext(
            '%d scraper was successfully disabled.',
            '%d scrapers were successfully disbled.',
            len(queryset),
        ) % len(queryset), messages.SUCCESS)

    @admin.action(description='Enable crawler')
    def enable_crawler(self, request, queryset):
        for query in queryset:
            query.create_job()
        self.message_user(request, ngettext(
            '%d scraper was successfully disabled.',
            '%d scrapers were successfully disbled.',
            len(queryset),
        ) % len(queryset), messages.SUCCESS)


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ['title', 'published_at', 'url']


admin.site.register(Item)
admin.site.register(Category, DraggableMPTTAdmin)
