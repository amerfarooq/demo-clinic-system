from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', auth_view.login, name = 'login' ),
    # path('', include('home.urls')),
    # path('supervisor/', include('supervisor.urls')),
    # path('logout/', auth_view.logout, name = 'logout'),
]
