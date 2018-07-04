from django.db import models

# Create your models here.

class Patient(models.Model):
    patient_name = models.CharField(max_length=128)
    date_of_birth = models.DateField()

class Doctor(models.Model):
    doc_name = models.CharField(max_length=128)
    doc_speciality = models.CharField(max_length=128)

class Clinic(models.Model):
    clinic_name = models.CharField(max_length=128)

class Doc_Clinic(models.Model):
    doc_name = models.ForeignKey(Doctor,on_delete=models.CASCADE)
    clinic_name = models.ForeignKey(Clinic,on_delete=models.CASCADE)

class Appointment(models.Model):
    patient_name = models.ForeignKey(Patient,on_delete=models.CASCADE)
    doc_name = models.ForeignKey(Doctor,on_delete=models.CASCADE)
    clinic_name = models.ForeignKey(Clinic,on_delete=models.CASCADE)
    appt_date = models.DateField()	
    appt_time = models.TimeField()	