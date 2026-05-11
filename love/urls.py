from django.urls import path
from . import views

urlpatterns = [
    path('accommodation/', views.accommodation, name='accommodation'),
    path('accommodation/budget/', views.budget, name='budget'),
    path('accommodation/midrange/', views.midrange, name='midrange'),
    path('accommodation/comfort/', views.comfort, name='comfort'),
    path('access/', views.site_access, name='site-access'),
    path('wedding-list/', views.wedding_list, name='wedding-list'),
    path('api/submit-booking/', views.submit_booking, name='submit-booking'),
    path('', views.index, name='index'),
]
