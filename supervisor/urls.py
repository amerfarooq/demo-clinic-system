from django.urls import path
from . import views

urlpatterns = [
    path('', views.manageDoctors),
    path('get_doctors/', views.getDoctors),
    path('assign_doctor/', views.saveDoctorAssignment),
]