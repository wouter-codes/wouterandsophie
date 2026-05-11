from django.urls import path
from . import views

urlpatterns = [
    path('accommodation/', views.accommodation, name='accommodation'),
    path('accommodation/budget/', views.budget, name='budget'),
    path('accommodation/midrange/', views.midrange, name='midrange'),
    path('accommodation/comfort/', views.comfort, name='comfort'),
    path('access/', views.site_access, name='site-access'),
    path('the-wedding/', views.the_wedding, name='the-wedding'),
    path('wedding-list/', views.wedding_list, name='wedding-list'),
    path('faq/', views.faq, name='faq'),
    path('api/submit-booking/', views.submit_booking, name='submit-booking'),
    path('', views.index, name='index'),
]
