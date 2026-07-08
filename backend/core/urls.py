from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.register_patent, name='register'),
    path('verify/', views.verify_patent, name='verify'),
]