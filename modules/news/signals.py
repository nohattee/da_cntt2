from django.dispatch import receiver
from django.db.models.signals import post_save

from modules.news.models import Scraper


@receiver(post_save, sender=Scraper)
def setup_scraper(sender, instance, created, **kwargs):
    if created is False:
        return

    if instance.is_active is False:
        return

    instance.create_job()
