from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core import serializers
from supervisor.models import Clinic, Doctor

@login_required
def manageDoctors(request):
    clinics = Clinic.objects.all()
    doctors = Doctor.objects.all()
    return render(request, 'supervisor/manage-doctors.html', {'clinics':clinics, 'doctors':doctors})


def getDoctors(request):
    doctors_json = serializers.serialize("json", Doctor.objects.all())
    return JsonResponse( {'doctors' : doctors_json })

