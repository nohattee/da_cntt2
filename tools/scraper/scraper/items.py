# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class NewsItem(scrapy.Item):
    title = scrapy.Field()
    content = scrapy.Field()
    author = scrapy.Field()
    category = scrapy.Field()
    tag = scrapy.Field()
    url = scrapy.Field()
    image_link = scrapy.Field()
    thumbnail_link = scrapy.Field()
    image = scrapy.Field()
    summary = scrapy.Field()
    published_at = scrapy.Field()
