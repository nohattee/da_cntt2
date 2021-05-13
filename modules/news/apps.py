from django.apps import AppConfig

from crochet import setup
from apscheduler.schedulers.background import BackgroundScheduler

setup()
scheduler = BackgroundScheduler()


class ScrapersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'modules.news'

    def ready(self):
        scheduler.start()
        import modules.news.signals
