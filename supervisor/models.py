from django.db import models


class Patient(models.Model):
    patient_name = models.CharField(max_length=128)
    date_of_birth = models.DateField()

class Doctor(models.Model):
    doctor_name = models.CharField(max_length=128)

    DOC_SPECIALITIES = (
        ('ACCU', 'ACCU'),
        ('Chiro', 'Chiro'),
        ('Medical', 'Medical'),
        ('PT', 'PT'),
    )
    doctor_speciality = models.CharField(max_length=20, choices=DOC_SPECIALITIES, default='PT')

    def __str__(self):
        return f'{self.doctor_name} - {self.doctor_speciality}'


class Clinic(models.Model):
    clinic_name = models.CharField(max_length=128)

    def __str__(self):
        return f'{self.clinic_name}'

class DoctorAssignment(models.Model):
    doctor_name = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    clinic_name = models.ForeignKey(Clinic, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.doctor_name} assigned to {self.clinic_name}'

class Appointment(models.Model):
    patient_name = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor_name = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    clinic_name = models.ForeignKey(Clinic, on_delete=models.CASCADE)
    appt_date = models.DateField()	
    appt_time = models.TimeField()	