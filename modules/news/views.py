from rest_framework import generics
from modules.news.models import News, Category
from modules.news.serializers import NewsSerializer, CategorySerializer
from rest_framework import filters


# Create your views here.

class NewsList(generics.ListAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title']


class CategoryNewsList(generics.ListAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer

    def get_queryset(self):
        categories = Category.objects.get(pk=self.kwargs.get('pk')).get_descendants(include_self=True).values_list('id', flat=True)
        return News.objects.filter(categories__pk__in=list(categories))


class CategoryList(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class NewsDetail(generics.RetrieveAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
