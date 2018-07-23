from django.urls import path
from . import views

urlpatterns = [
    path('', views.manageDoctors),
    path('get_doctors/', views.getDoctors), #ajax get
    path('assign_doctor/', views.saveDoctorAssignment), #ajax post
    path('clinic-day', views.clinicDay),
]