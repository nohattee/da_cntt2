from rest_framework import generics
from modules.news.models import News, Category
from modules.news.serializers import NewsSerializer, CategorySerializer


# Create your views here.

class NewsList(generics.ListAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer

class CategoryList(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class NewsDetail(generics.RetrieveAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
