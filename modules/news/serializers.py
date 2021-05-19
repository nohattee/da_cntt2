from rest_framework import serializers

from modules.news.models import News, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class NewsSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    class Meta:
        model = News
        fields = ['id', 'title', 'content', 'summary', 'categories', 'thumbnail_link', 'image_link', 'published_at']
