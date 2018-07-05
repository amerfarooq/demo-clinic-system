from django.shortcuts import render
from supervisor.models import Clinic, Doctor

def manageDoctors(request):
    clinics = Clinic.objects.all()
    doctors = Doctor.objects.all()
    return render(request, 'supervisor/manage-doctors.html', {'clinics':clinics, 'doctors':doctors})
