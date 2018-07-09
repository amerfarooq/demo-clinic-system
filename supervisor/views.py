from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core import serializers
from supervisor.models import Clinic, Doctor, DoctorAssignment
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse


@login_required
def manageDoctors(request):
    clinics = Clinic.objects.all()
    doctors = Doctor.objects.all()
    return render(request, 'supervisor/manage-doctors.html', {'clinics':clinics, 'doctors':doctors})


def getDoctors(request):
    doctors_json = serializers.serialize("json", Doctor.objects.all())
    return JsonResponse( {'doctors' : doctors_json })

@csrf_exempt
def saveDoctorAssignment(request):
    if (request.method == 'POST'):
        doctor = request.POST['name']
        clinic = request.POST['clinic']

        doc_obj = Doctor.objects.filter(doctor_name=doctor).first();
        cli_obj = Clinic.objects.filter(clinic_name=clinic).first();


        DoctorAssignment(doctor_name=doc_obj, clinic_name=cli_obj).save()
        
        return HttpResponse('')