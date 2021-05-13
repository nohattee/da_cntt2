from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings

from modules.news.models import Scraper
from tools.scraper.scraper.spiders.news import NewsSpider


@shared_task
def crawling():
    scraper = Scraper.objects.get(pk=1)
    process = CrawlerProcess(get_project_settings())
    process.crawl(NewsSpider, scraper=scraper)
    process.start()


# @app.on_after_finalize.connect
# def setup_periodic_tasks(sender, **kwargs):
#     sender.add_periodic_task(10.0, test.s('hello'))
#
#
# @shared_task
# def test(arg):
#     print(arg)
