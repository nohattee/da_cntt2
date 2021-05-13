import scrapy
from django.utils import timezone

from tools.scraper.scraper.items import NewsItem


class NewsSpider(scrapy.Spider):
    name = 'news'

    def __init__(self, *a, **kwargs):
        super(NewsSpider, self).__init__(*a, **kwargs)
        self.spider = kwargs.get('spider')
        self.spider_log = self.spider.spider.spiderlog_set.create(
            start_time=timezone.now()
        )
        self.parsers = self.spider.spider.parser_set
        self.total_failed = 0

    def start_requests(self):
        page = 1
        # while self.total_failed < 10:
        yield scrapy.Request(
            url=self.spider.spider.url.format(page),
            callback=self.parse,
            errback=self.errback_news
        )
            # page += 1

    def parse(self, response):
        parser_url = self.parsers.get(name='asd')
        print(parser_url)
        news_page_link = self._parse_attribute(
            response,
            parser_url.selector_type,
            parser_url.selector
        )

        if news_page_link:
            yield from response.follow_all(
                news_page_link,
                self.parse_item,
            )
        else:
            self.total_failed += 1

    def parse_item(self, response):
        parser_title = self.parsers.filter(name='title').first()
        parser_content = self.parsers.filter(name='content').first()
        parser_author = self.parsers.filter(name='author').first()
        parser_category = self.parsers.filter(name='category').first()
        parser_tag = self.parsers.filter(name='tag').first()
        parser_summary = self.parsers.filter(name='summary').first()
        parser_publish_date = self.parsers.filter(name='publish_date').first()
        item = NewsItem()
        if parser_title:
            item['title'] = ''.join(self._parse_attribute(response, parser_title.selector_type, parser_title.selector).getall())
        else:
            item['title'] = parser_title

        if parser_content:
            item['content'] = ''.join(self._parse_attribute(response, parser_content.selector_type, parser_content.selector).getall())
        else:
            item['content'] = parser_content

        if parser_author:
            item['author'] = ''.join(self._parse_attribute(response, parser_author.selector_type, parser_author.selector).getall())
        else:
            item['author'] = parser_author

        if parser_category:
            item['category'] = ''.join(self._parse_attribute(response, parser_category.selector_type, parser_category.selector).getall())
        else:
            item['category'] = parser_category

        if parser_tag:
            item['tag'] = ''.join(self._parse_attribute(response, parser_tag.selector_type, parser_tag.selector).getall())
        else:
            item['tag'] = parser_tag

        if parser_summary:
            item['summary'] = ''.join(self._parse_attribute(response, parser_summary.selector_type, parser_summary.selector).getall())
        else:
            item['summary'] = parser_summary

        if parser_publish_date:
            item['publish_date'] = ''.join(self._parse_attribute(
                response,
                parser_publish_date.selector_type,
                parser_publish_date.selector
            ).getall())
        else:
            item['publish_date'] = parser_publish_date

        item['url'] = response.request.url
        return item

    def _parse_attribute(self, response, selector_type, selector):
        attribute = ' '

        if selector_type == 'xpath':
            attribute = response.xpath(selector)

        if selector_type == 'css':
            attribute = response.css(selector)

        return attribute

    def errback_news(self, failure):
        self.spider_log.status = 'failed'
        self.spider_log.desctiption = repr(failure)
        self.spider_log.end_time = timezone.now()
        self.spider_log.save()
        # self.logger.error(repr(failure))
