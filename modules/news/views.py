from rest_framework import generics
from modules.news.models import News, Category
from modules.news.serializers import NewsSerializer, CategorySerializer
from rest_framework import filters
from rest_framework.views import APIView
from sklearn.metrics.pairwise import cosine_similarity
from pyvi import ViTokenizer
import numpy as np
from gensim.models.doc2vec import Doc2Vec
from dateutil.relativedelta import relativedelta
from rest_framework.response import Response


# Create your views here.
model = Doc2Vec.load("models/d2v.model")


def most_similar(doc_id,similarity_matrix):
    similar_ix=np.argsort(similarity_matrix[doc_id])[::-1]
    i = 0 
    for ix in similar_ix:
        if i > 20:
            break
        i = i + 1
        if ix==doc_id:
            continue


class NewsList(generics.ListAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title']

class RecommendNewsList(APIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer

    def get(self, request, pk, format=None):
        news = News.objects.get(pk=self.kwargs.get('pk'))
        nextNews = news.published_at + relativedelta(months=3)
        beforeNews = news.published_at + relativedelta(months=-3) 
        allNews = News.objects.filter(published_at__range=[beforeNews, nextNews]).order_by('-published_at')[:100]
        global model
        document_embeddings = np.zeros((len(allNews) + 1,512))
       
        idx_id = {}
        id_idx = {}
        i = 0
        for new in allNews:
            id_idx[new.id] = i
            idx_id[i] = new.id
            document_embeddings[i] = model.infer_vector(ViTokenizer.tokenize(new.content).split())
            i = i + 1

        if news not in allNews:
            id_idx[news.id] = i
            idx_id[i] = news.id
            document_embeddings[i] = model.infer_vector(ViTokenizer.tokenize(news.content).split())

        pairwise_similarities = cosine_similarity(document_embeddings)

        similar_ix = np.argsort(pairwise_similarities[id_idx[news.id]])[::-1]

        list_ids = [idx_id[ix] for ix in similar_ix[:15] if idx_id[ix] != news.id]
        allNews = News.objects.filter(pk__in=list_ids)
        
        return Response(NewsSerializer(instance=allNews, many=True).data)
    
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
