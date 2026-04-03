from django.urls import path
from . import views

urlpatterns = [
    path('access/', views.site_access, name='site-access'),
    path('', views.index, name='index'),
]
