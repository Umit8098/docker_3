from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TutorialMVS

router=DefaultRouter()
router.register('tutorials',TutorialMVS)

urlpatterns= router.urls


'''
from django.urls import include

urlpatterns = [  
    path('', include(router.urls)),
]

# urlpatterns += router.urls
'''