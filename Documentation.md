​		

### Starting a Django project:

---



To start a Django project, enter the following command in the terminal:

```django
 django-admin startproject <appname>
```



### Creating a Django app:

---



A Django project consists of multiple apps, each of which relate to a particular functionality of the web application e.g. a web app for blogging might have an app for blog posts and another for a forum.

To create an app, navigate to your application folder and ensure that manage.py is located within that folder. Then run the following command:

```django
python manage.py startapp <appname>
```



The created app must then be registered so that Django is aware of it. To do this, navigate to the settings.py file and the add the app name to the INSTALLED_APPS array:

```python
INSTALLED_APPS = [
    '<your app name>',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]
```

The other apps shown are included by default.





### Mapping URLS in a Django project:

---



The main urls.py file is located inside the main project folder e.g. for a project named 'clinic' the file would be in clinic/urls.py. This folder also contains the settings.py file of the application. Whenever the user requests a page, Django queries this file to appropriately redirect them to the desired webpage. Usually, each app within the main application has its own urls.py file which is included into the main urls.py of the project e.g. for a clinic application containing a home app and a supervisor app, its urls.py might look something like this:

```python
from django.contrib import admin
from django.urls import path
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('home.urls')),
    path('supervisor/', include('supervisor.urls')),
]
```



The first path `path('admin/', admin.site.urls) `  is for the admin panel which is included by default. It allows us to add users and to create objects for our models (database tables). The other two belong our apps. ` path('', include('home.urls')),`  indicates that if our site is located at e.g. site.com and a users visits it, Django will use the URLS defined in home.urls to display the appropriate view. Similarly, if the user visits site.com/supervisor, it will use the URLS in supervisor.urls to display the appropriate page. The urls.py for the home app might look like this:

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),
]
```

This means that when user visits site.com, Django will query the main urls.py file which will redirect it to the urls.py file in the home app. From here, Django will call the home view (a function) which will then be subsequently displayed to the user.



### Adding HTML pages to a Django app:

---



To add HTML pages for an app, two directories need to be created within that apps directory: 

1. A directory named 'static' which will hold images, CSS and JS files.
2. A directory named templates and a sub-directory within it with the same name as the app.



For a home app of a clinic application, this might look something like:

```python
clinic
	-home
    	-static
        	-css
            -js
            -images
        -templates
        	-home
            	-html files
```

The reason for creating another directory with the same name as the app is because when Django assembles the project, it amalgamates all the template files into one folder. So to distinguish between the files of different apps, this extra directory needs to be created.

To serve static files that are not tied to a particular app, the following lines need to be included to the settings.py file.

```python
STATIC_URL = '/static/' #included be default

#new lines
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
```



The `STATICFILES_DIRS` tuple tells Django where to look for static files that are not particular to an app. In this case, we just told Django to also look for static files in a folder called `static` in our root folder, not just in our apps.

Django also provides a mechanism for collecting static files into one place so that they can be served easily. Using the `collectstatic` command, Django looks for all static files in your apps and collects them wherever you told it to, i.e. the `STATIC_ROOT`. In our case, we are telling Django that when we run `python manage.py collectstatic`, gather all static files into a folder called `staticfiles` in our project root directory. This feature is very handy for serving static files, especially in production settings.







