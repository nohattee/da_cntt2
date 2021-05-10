# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from bs4 import BeautifulSoup
from itemadapter import ItemAdapter
from scrapy.exceptions import DropItem
from dateutil import parser

from modules.scrapers.models import NewsItem, News


class ScraperPipeline:
    def extract_text_item(self, item):
        def extract_text_with_bs4(attr):
            return BeautifulSoup(str(attr)).get_text().strip()
        output = {
            'title': extract_text_with_bs4(item['title']),
            'content': extract_text_with_bs4(item['content']),
            'author': extract_text_with_bs4(item['author']),
            # 'category': BeautifulSoup(item['category']).get_text(),
            # 'tag': BeautifulSoup(item['tag']).get_text(),
            'summary': extract_text_with_bs4(item['summary']),
            'publish_date': parser.parse(''.join(extract_text_with_bs4(item['publish_date']).split('-')))
        }
        return output

    # def extract_text_item(self, item):
    #     output = {'title': ''.join(item['title'].getall()), 'content': ''.join(item['content'].getall()),
    #               'author': ''.join(item['author'].getall()), 'category': ''.join(item['category'].getall()),
    #               'tag': ''.join(item['tag'].getall()), 'summary': ''.join(item['summary'].getall()),
    #               'publish_date': ''.join(item['publish_date'].getall())}
    #     return output

    def process_item(self, item, spider):
        if spider.spider.spider.item_type == 'news':
            news = self.extract_text_item(item)
            news, is_created = News.objects.get_or_create(**news)
            if spider.spider.category not in news.categories.all():
                news.categories.add(spider.spider.category)

            newsItem, is_created = NewsItem.objects.get_or_create(**item)
            if is_created:
                SpiderItem.objects.create()

        return item

