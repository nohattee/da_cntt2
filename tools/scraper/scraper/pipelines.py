# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
import scrapy
from bs4 import BeautifulSoup
from django.utils import timezone
from itemadapter import ItemAdapter
from scrapy.exceptions import DropItem
from dateutil import parser
import requests
from validators.url import url

from modules.news.models import Item, News


class ScraperPipeline:
    def extract_text_item(self, item, scraper):
        def extract_text_with_bs4(attr):
            return BeautifulSoup(str(attr)).get_text().strip()

        if item['thumbnail_link']:
            thumbnail_link = BeautifulSoup(item['thumbnail_link'], 'html.parser')
            if thumbnail_link:
                thumbnail_link = thumbnail_link.img['src']
                if not(url(thumbnail_link)):
                    thumbnail_link = scraper.homepage + thumbnail_link
        else:
            thumbnail_link = None

        if item['image_link']:
            image_link = BeautifulSoup(item['image_link'], 'html.parser')
            if image_link:
                image_link = image_link.img['src']
                if not(url(image_link)):
                    image_link = scraper.homepage + image_link
        else:
            image_link = None

        output = {
            'title': extract_text_with_bs4(item['title']),
            'content': extract_text_with_bs4(item['content']),
            'author': extract_text_with_bs4(item['author']),
            'image_link': image_link,
            'thumbnail_link': thumbnail_link,
            # 'category': BeautifulSoup(item['category']).get_text(),
            # 'tag': BeautifulSoup(item['tag']).get_text(),
            'summary': extract_text_with_bs4(item['summary']),
            'published_at': parser.parse(' '.join(extract_text_with_bs4(item['published_at']).split(' - ')),
                                         fuzzy=True),
            'url': item['url']
        }
        return output

    def process_item(self, item, spider):
        news = self.extract_text_item(item, spider.spider.scraper)
        news, is_created = News.objects.get_or_create(**news)
        if spider.spider.category not in news.categories.all():
            news.categories.add(spider.spider.category)

        newsItem, is_created = Item.objects.get_or_create(**item)
        if is_created:
            spider.spider.spider.item_set.add(newsItem)

        return item
