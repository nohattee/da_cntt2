from django.contrib import admin

from mptt.admin import DraggableMPTTAdmin

from modules.scrapers.forms import ParserInlineFormSet
from modules.scrapers.models import Spider, Scraper, ScraperSpider, Category, Parser


# Register your models here.
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


admin.site.register(ScraperSpider)
admin.site.register(Spider, SpiderAdmin)
admin.site.register(Scraper, ScraperAdmin)
admin.site.register(Category, DraggableMPTTAdmin)
