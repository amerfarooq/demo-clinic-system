​		

### Starting a Django project

---

To start a Django project, enter the following command in the terminal:

```django
 django-admin startproject <appname>
```



### Creating a Django app

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



### How to run Django's local server to test your application:

------

Django includes the ability to run a localserver where you can test your application. To run it, navigate to the directory that contains your `manage.py` file and open a command line terminal. Then type

```python
python manage.py runserver
```

An IP will be displayed, which is usually `http://127.0.0.1:8000` where the application can then be viewed.



### How to access the admin panel:

------

Django includes an admin interface by default. To make use of it, you first need to create a user. To do so, navigate to the directory that contains your `manage.py` file and open a command line terminal. Then type

```python
python manage.py createsuperuser
```

Django will then prompt you for a username and password which can then be used to login by visiting `yoursite.com/admin` 



### How to add HTML pages to a Django app

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



### How to install extensions

---

Extensions can be installed via pip e.g. to install [django-widget-tweaks](https://github.com/jazzband/django-widget-tweaks), open a command line terminal and type:

```python
pip install django-widget-tweaks
```

To enable the installed app, navigate to the `settings.py` file and add the app name to  `INSTALLED_APPS` like so:

```python
INSTALLED_APPS = [
    ...
    'widget_tweaks',
    ...
]
```





### Creating a login page in Django

---

Django includes an authentication system by default. To make use of it, we can edit the main urls.py as follows:

```python
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_view	#this needs to be imported

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', auth_view.login, name = 'login' ),
]
```

Here we are telling Django that when the user visits site.com, they should be displayed the login portal. To achieve this, Django looks for a directory named registration inside the template folders located in the project and searches for a login.html file. It passes this file the registration form which can then be rendered. The login.html file can render the form like so:

```django
{% for field in form.visible_fields %}
<div class="col-lg-4 col-centered">                             
    <div class="form-group">

        {{ field.label_tag }}

        {% if form.is_bound %}
            {% if field.errors %}
                {% render_field field class="form-control is-invalid" %}                       
                {% for error in field.errors %}                                           
                    <div class="invalid-feedback">
                        {{ error }}
                    </div>
                {% endfor %}
        
            {% else %}
                {% render_field field class="form-control is-valid" %}
            {% endif %} 

        {% else %}        
        	{% render_field field class="form-control" %}
        {% endif %}

        {% if field.help_text %}
        	<small class="form-text text-muted">{{ field.help_text }}</small>
        {% endif %}

    </div>
</div>
{% endfor %}


<br>
<div class="btn-centered">
    <button type="submit" class="btn btn-primary">Login</button>
</div>

```

An explanation for how this works can be found [here](https://simpleisbetterthancomplex.com/article/2017/08/19/how-to-render-django-form-manually.html).

Users can be added manually by going to the Users tab in the admin panel.



### Redirecting a user after logging in:

---

By default, Django redirects a user to accounts/profile when they login i.e. `site.com/accounts/profile.` To change this, the `settings.py` file can be edited to add a custom path like so:

```python
LOGIN_REDIRECT_URL = '/example'
```

Now when the user logs in, they will automatically be redirected to `site.com/example`



### How to show more reader-friendly object names in the admin panel

---

By default, objects created via the admin interface usually have names like `Doctor Object (1)`  for a Doctor model. To change this, a method can be added to the Doctor model in `models.py` like so:

```python
class Doctor(models.Model):
    doctor_name = models.CharField(max_length=128)

    DOC_SPECIALITIES = (
        ('ACCU', 'ACCU'),
        ('Chiro', 'Chiro'),
        ('Medical', 'Medical'),
        ('PT', 'PT'),
    )
    doctor_speciality = models.CharField(max_length=20, choices=DOC_SPECIALITIES, 		default='PT')

    def __str__(self):
        return f'{self.doctor_name} - {self.doctor_speciality}'

```

This will show up new Doctor objects as "Doctor Name Speciality" e.g. `Amer Farooq - Chiro` 



### How to populate a drop-down menu using data from models

---

For example, if you have a drop down menu on your web page that shows a list of all the clinics, how can you populate that menu using data from your Clinic model. Suppose our Clinic model looks something like this:

```python
class Clinic(models.Model):
    clinic_name = models.CharField(max_length=128)

    def __str__(self):
        return f'{self.clinic_name}'
```

To achieve this,  edit the view that renders your webpage in `views.py` like so:

```python
def manageDoctors(request):
    clinics = Clinic.objects.all()
    return render(request, 'supervisor/manage-doctors.html', {'clinics' : clinics})
```

Here, all the Clinic objects in the database are being passed to the `manage-doctors.html` page in a dictionary. Then inside the `manage-doctors.html` page, we can display them like so:

```django
<form method="POST">
    <label>Select Clinic</label>
    <select id="clinic-select">
        {% for clinic in clinics %}
        	<option>{{ clinic.clinic_name }}</option>
        {% endfor %}
    </select>
</form>
```

Here we are simply looping over the Clinic objects and inserting them into the webpage inside `option` tags. This loop is a construct of Jinja2, a templating engine that is included in Django. It's documentation can be found [here](http://jinja.pocoo.org/docs/2.10/). 



### How to use JQuery with Django templates:

---

To download JQuery, go to this [link](https://jquery.com/download/) and choose the production version. Add the .js file to your static directory and then simply include the file in your template like so:

```django
<script src="{% static 'css/jquery-3.3.1.min.js' %}"></script>
```

It is also recommend to have a separate content block in the template file for working with scripts i.e. in your template file (e.g. `base.html`) , you could include the following block:

```django
{% block scripts %}
{% endblock %}
```

All Javascript related code can then be inserted here.



### How to remove HTML elements via JQuery

---

Elements can be removed using four methods provided by JQuery, namely:

1. `remove()`
2. `empty()`
3. `detach()`
4. `unwrap()`

The documentation for these can be found [here](https://api.jquery.com/category/manipulation/dom-removal/).



### How to restrict access of a view to only logged-in users

----

This can be done by navigating to the `views.py` file which contains the view you want to restrict access to.

Then add the following code which imports Django's built-in [view decorator](https://docs.djangoproject.com/en/2.0/topics/http/decorators/) and uses it to mark views that only logged-in users can access.

```python
from django.contrib.auth.decorators import login_required

@login_required
def yourView(request):
    ....
```

Users that are not authenticated can be redirected to a login page by editing the `settings.py` file and adding a `LOGIN_REDIRECT` like so:

```python
LOGIN_URL = '/<your url here>'
```



