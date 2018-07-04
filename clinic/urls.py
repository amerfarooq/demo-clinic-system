from django.contrib import admin
from django.urls import path
from django.contrib.auth import views as auth_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login', auth_view.login, name = 'login' ),
    path('logout', auth_view.logout, name = 'logout'),
]
