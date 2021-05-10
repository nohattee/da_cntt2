from django.apps import AppConfig

from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler()


class ScrapersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'modules.scrapers'

    def ready(self):
        scheduler.start()
