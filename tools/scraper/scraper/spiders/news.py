import scrapy
from bs4 import BeautifulSoup
from django.utils import timezone

from tools.scraper.scraper.items import NewsItem


class NewsSpider(scrapy.Spider):
    name = 'news'

    def __init__(self, *a, **kwargs):
        super(NewsSpider, self).__init__(*a, **kwargs)
        self.spider = kwargs.get('spider')
        self.parsers = self.spider.spider.parser_set
        self.total_failed = 0
        self.news_thumbnail_link = None

    def start_requests(self):
        page = 1
        max_page = 9999
        if self.spider.scraper.crawl_type == 'latest':
            max_page = 10

        while self.total_failed < 10 and page < max_page:
            yield scrapy.Request(
                url=self.spider.spider.url.format(page),
                callback=self.parse,
                errback=self.errback
            )
            page += 1

    def errback(self, failure):
        if failure.value.response.status == 401:
            self.total_failed = self.total_failed + 1
        if failure.value.response.status == 402:
            self.total_failed = self.total_failed + 1
        if failure.value.response.status == 403:
            self.total_failed = self.total_failed + 1
        if failure.value.response.status == 404:
            self.total_failed = self.total_failed + 1
        if failure.value.response.status == 500:
            self.total_failed = self.total_failed + 1

    def parse(self, response):
        parser_url = self.parsers.get(name='link')
        news_page_link = self._parse_attribute(
            response,
            parser_url.selector_type,
            parser_url.selector
        )

        if news_page_link:
            parser_thumbnail_link = self.parsers.get(name='thumbnail_link')
            self.news_thumbnail_link = self._parse_attribute(
                response,
                parser_thumbnail_link.selector_type,
                parser_thumbnail_link.selector
            )

            for i, page_link in enumerate(news_page_link):
                yield response.follow(
                    page_link,
                    self.parse_item,
                    cb_kwargs={'index': i}
                )
        else:
            self.total_failed += 1

    def parse_item(self, response, index):
        parser_title = self.parsers.filter(name='title').first()
        parser_content = self.parsers.filter(name='content').first()
        parser_author = self.parsers.filter(name='author').first()
        parser_category = self.parsers.filter(name='category').first()
        parser_tag = self.parsers.filter(name='tag').first()
        parser_summary = self.parsers.filter(name='summary').first()
        parser_image_link = self.parsers.filter(name='image_link').first()
        parser_published_at = self.parsers.filter(name='published_at').first()
        item = NewsItem()

        if self.news_thumbnail_link is not None and index < len(self.news_thumbnail_link):
            item['thumbnail_link'] = self.news_thumbnail_link[index].get()
        else:
            item['thumbnail_link'] = None

        if parser_title:
            item['title'] = ''.join(
                self._parse_attribute(response, parser_title.selector_type, parser_title.selector).getall())
        else:
            item['title'] = parser_title

        if parser_content:
            item['content'] = ''.join(
                self._parse_attribute(response, parser_content.selector_type, parser_content.selector).getall())
        else:
            item['content'] = parser_content

        if parser_author:
            item['author'] = ''.join(
                self._parse_attribute(response, parser_author.selector_type, parser_author.selector).getall())
        else:
            item['author'] = parser_author

        if parser_category:
            item['category'] = ''.join(
                self._parse_attribute(response, parser_category.selector_type, parser_category.selector).getall())
        else:
            item['category'] = parser_category

        if parser_tag:
            item['tag'] = ''.join(
                self._parse_attribute(response, parser_tag.selector_type, parser_tag.selector).getall())
        else:
            item['tag'] = parser_tag

        if parser_summary:
            item['summary'] = ''.join(
                self._parse_attribute(response, parser_summary.selector_type, parser_summary.selector).getall())
        else:
            item['summary'] = parser_summary

        if parser_image_link:
            item['image_link'] = ''.join(
                self._parse_attribute(response, parser_image_link.selector_type, parser_image_link.selector).getall())
        else:
            item['image_link'] = parser_image_link

        if parser_published_at:
            item['published_at'] = ''.join(self._parse_attribute(
                response,
                parser_published_at.selector_type,
                parser_published_at.selector
            ).getall())
        else:
            item['published_at'] = parser_published_at

        item['url'] = response.request.url
        return item

    def _parse_attribute(self, response, selector_type, selector):
        attribute = ' '

        if selector_type == 'xpath':
            attribute = response.xpath(selector)

        if selector_type == 'css':
            attribute = response.css(selector)

        return attribute
