from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Tutorial
from .serializers import TutorialSerializer


class TutorialMVS(ModelViewSet):
    queryset = Tutorial.objects.all()
    serializer_class = TutorialSerializer

