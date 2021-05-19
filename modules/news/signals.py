from django.dispatch import receiver
from django.db.models.signals import pre_save

from modules.news.models import Scraper


@receiver(pre_save, sender=Scraper)
def setup_scraper(sender, instance, **kwargs):
    instance.update_job()
