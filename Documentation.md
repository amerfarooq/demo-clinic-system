# Django

# 		

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


<a name="static-tut"></a>
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

### Deploying the Django web application on pythonanywhere.com

---

First, create an account on pythonanywhere.com and log in. This will take you to the dashboard. From there, follow the succeeding steps for deployment:

1. Open a new bash console from the ***Consoles*** tab.

2. Make sure your application is uploaded to github. Now when the console appears, perform a `git clone <github link>`

3. Next, create a new virtual environment in the bash console by typing `mkvirtualenv --python=/usr/bin/python3.6 myenv2 ` . The version of Python you provide should be the same version you used to develop your application.  Here `myenv2` is the name of the virtual environment.

4. If the virtual environment was successfully created, the bash console should now have something like `(myenv2) 05:21 ~ $ ` appended to it. Here `05:21` can be any number. Now install Django by typing `pip install django`.  Any extra extensions can either be manually installed via pip or you can create a `requirements.txt` file in which you list these extensions and place it in the root of your project directory. You can then use the command `pip install -r requirements.txt` to install them.

5. After Django finishes installing, head over the ***Web*** tab in the pythonanywhere dashboard. Next, click on `Add a new web app`.

6. Click next and on the ***Select a Python Web framework*** window, click on `Manual Configuration`. Choose your version of python and proceed to the end. You will then end up on your application's configuration page.

7. Scroll down to the **Virtualenv** part of the page and enter the name of the virtual environment you created in step 3. Hit the checkmark box and pythonanywhere will locate and add the virtual environment.

8. Now scroll up to the **Code** part on the same page and click on `WSGI configuration file`. Doing so will open the configuration file in a text editor in the browser. Remove the extra stuff from this file so that you only end up with: 

   ```python
   import os
   import sys
   
   path = '/home/testcalendar/demo-clinic-system'
   if path not in sys.path:
       sys.path.append(path)
   
   os.environ['DJANGO_SETTINGS_MODULE'] = 'clinic.settings'
   
   from django.core.wsgi import get_wsgi_application
   application = get_wsgi_application()
   
   ```

   Here, two things need to be edited. 

   + `path = '/home/testcalendar/demo-clinic-system'` should point to the main folder of your web application. You can located this folder through the bash console by using `ls` and `pwd`. The main folder is the one containing your `manage.py` file.
   + `os.environ['DJANGO_SETTINGS_MODULE'] = 'clinic.settings'` . Here, use the name of your project so it looks like `your-project-name.settings` instead. This name is the one you used in the **Starting a Django Project**, the first section of this documentation.

    Now click on the **Save** button or use CTRL + S. Then, navigate back to your apps configuration page  and click on the `reload <app>` button at the top.

9. Next, get your application domain from your configuration page e.g. `testcalendar.pythonanywhere.com` Now, open the **Files** tab in the pythonanywhere dashboard and navigate to your application's `settings.py` file. Here, add the copied domain to the `ALLOWED_HOSTS` so it looks like: 

   ```python
   ALLOWED_HOSTS = ['your-domain.pythonanywhere.com']
   ```

10. Reload your app again and then try to open the web application through the above domain. If you end up on an error page, check the error logs to see what went wrong and rectify the issue from there. 

11. When your application finally opens, you will see your web page but without any sort of styling. To fix this, head over to the bash console and type `python manage.py collectstatic`. This will collect all your static files in the `STATIC_ROOT` directory that was defined in the ***How to add HTML pages to a Django app***. 

12. Open your application's configuration page again and navigate to the **Static files** part. Click on *URL* and add `/static/`. Then click on the ***Enter path*** next to it and add the location of your STATIC_ROOT directory e.g `/home/testcalendar/demo-clinic-system/static`

13. Reload your app. Now it should load your static files and your site should appear as it was during development.

14. If you want to update the app, simply do a push onto your git repository, followed by a `git pull` from the bash console. There also exist methods to automate this so that whenever something is pushed on the repo, the web app gets updated automatically.


# Supervisor ( /supervisor )



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

This can be done by navigating to the `views.py` file which contains the view you want to restrict access to. Then add the following code which imports Django's built-in [view decorator](https://docs.djangoproject.com/en/2.0/topics/http/decorators/) and uses it to mark views that only logged-in users can access.

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


<a name="clinic-dropdown"></a>
### Showing a dropdown of clinics for user to select from:

---

This is done using [Bootstrap forms](https://getbootstrap.com/docs/4.1/components/forms/#form-controls). The example is edited and added as follows:

```html
 <form class="col-lg-15 input-group">
     <div class="form-group">
         <label>Select Clinic</label>
         <select class="form-control" id="clinic-select">
             <option id="def-val-clinic" disabled selected value> --- </option>
             {% for clinic in clinics %}
             	<option>{{ clinic.clinic_name }}</option>
             {% endfor %}
         </select>
     </div>
</form>
```

`<option id="def-val-clinic" disabled selected value> --- </option>`  is used to set  `---` as the default value. Since we are performing actions whenever the value in this form changes, setting up a default value is necessary. We give this option an id to be able to remove it later from the form.

Next, we simply loop over the clinics array and use the clinic name inside the option tags to create the dropdown list. This array is being passed in the `manageDoctors`  view inside `supervisor/views.py` .

```python
def manageDoctors(request):
    clinics = Clinic.objects.all()
    doctors = Doctor.objects.all()
    return render(request, 'supervisor/manage-doctors.html', {'clinics':clinics, 'doctors':doctors})
```


<a name="list"></a>
### Showing a list of selected clinics:

---

To display this list we use [Bootstrap cards with a list group](https://getbootstrap.com/docs/4.1/components/card/#list-groups).  The following `div` is added to the body of the page. List items are appended through JS and JQuery.

```html
<div class="card" style="width: 14rem;">
    <div class="card-header">
        Selected Clinics
    </div>

    <ul class="list-group list-group-flush" id="clinic_list">
    </ul>
</div>
```



###  Adding a clinic to the selected clinic list:

---

To add a clinic to the above list, the following JQuery / Javascript code is used:

```javascript
let clinics = [];
var clinic_list_index = 1;

 $(document).ready(function () {
        $("#clinic-select").change(function(event) {
           
            $("#def-val-clinic").remove();
            var selected_clinic = $("#clinic-select option:selected").text();
            
            if (clinics.includes(selected_clinic)) 
                return;
           
            clinics.push(selected_clinic);
           
            $("#clinic_list").append(
                '<li data-clinic="' + selected_clinic.toString() + 
                '" class="list-group-item list-group-item-action " id="clinic-li-'+ 						(clinic_list_index).toString() + '">' +
                selected_clinic + 
                '<button class=' + '"button button-circle button-caution button-tiny float-					right"' + 
                ' type="button" id="rem-btn-' + clinic_list_index.toString() + 
                '" data-id="' + clinic_list_index.toString() + '">' +
                '<i class="fas fa-times"></i>' +
                "</li>"
            )
            
            $("#heading").append(
                '<div class="cell">' +
                selected_clinic +
                '</div>'
            )
            clinic_list_index++;
            reDrawTable(doctorsArr, clinics);  
        });
    });
```

Lets break it down.



`$("#clinic-select").change(function(event)` 

 Here we are specifying that whenever the user selects a new clinic from the dropdown list created [here](#clinic-dropdown), call the following function.




`$("#def-val-clinic").remove()`

  Remove the default `---` value from the dropdown list.

   

```javascript
if (clinics.includes(selected_clinic)) 
    return;

clinics.push(selected_clinic);
```

Here we check if the clinic has already been selected by using JavaScript's `includes()` function on the clinics array. If it hasn't, we add it to the array.



`var selected_clinic = $("#clinic-select option:selected").text()` 

This stores the clinic that the user selected in the `selected_clinic` variable.



   ```html
$("#clinic_list").append(
    '<li data-clinic="' + selected_clinic.toString() + 
        '" class="list-group-item list-group-item-action" id="clinic-li-'+ 						(clinic_list_index).toString() + '">' +
        selected_clinic + 
        '<button class=' + '"button button-circle button-caution button-tiny 						float-right"' + 
         ' type="button" id="rem-btn-' + clinic_list_index.toString() + 
         '" data-id="' + clinic_list_index.toString() + '">' +
        '<i class="fas fa-times"></i>' +
    "</li>"
   )
   ```

Next, we append the selected clinic to the `clinic-list` list group we made [earlier](#list). To do so we create a list item and add some classes to it.

 `data-clinic` is a data attribute that stores the name of the clinic so that we can use it later to remove that particular clinic from the `clincs` array. Data attributes are user defined attributes used for holding some information. You can read more about them [here](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes). 

`class="list-group-item list-group-item-action"` are the classes referencing the Bootstrap list group.

`id="clinic-li-'+ (clinic_list_index).toString() + '">'`  This line assigns an id to the list item. We are using a counter called `clinic_list_index` to assign each clinic list item a unique id and this is being done so that we can remove this clinic list item when the user presses the 'x' button. This is detailed ahead.

The remaining code simply adds an 'x' button next to the clinic name. This is also explained in more detail in the following section. 

This particular line though is important: `'type="button" id="rem-btn-' + clinic_list_index.toString()`  Here we are assigning the created button a unique id as well so that we assign a click event handler to it later. 

 `'data-id="' + clinic_list_index.toString()'`  Here we are storing the current value of `clinic_list_index` in the data-id attribute. This is because `clinic_list_index ` is incremented whenever a clinic is added to the list and we need its current value to be able to remove the clinic item when the user presses the 'x' button. The section detailing with the deletion will clear things up more regarding its need and use.



### Adding a small red cross button next to a listed clinic:

---

To show this <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKqlc56McqhIG5cr242_H1CLzAIy-n_UbNPcyoCtvGBqza4szp" alt="drawing" width="20px"/> button next to a listed clinic we require two CSS libraries.

1. [Buttons](http://unicorn-ui.com/buttons/) - for the small circular button
2. [Font Awesome](https://fontawesome.com/icons/times?style=solid) - for the 'x' icon

These can be added directly via CDN or by downloading them and adding them to the CSS folder inside the main `static/css` . Instructions for doing this can be found in the earlier part of this documentation [here](#static-tut). The HTML code for the button is as follows:

```html
<button class="button button-circle button-caution button-tiny float-right">
    <i class="fas fa-times"></i>
</button>
```

The button classes are referenced from the preceding Buttons link. The `float-right` class is part of Bootstrap and is used here to pull the button to the far right side of the clinic name. The `<i class="fas fa-times"></i>` references the 'x' icon and is taken from [here](https://fontawesome.com/icons/times?style=solid).



### Deleting a clinic when the user presses the 'x' button:

---

To accomplish this, a counter is used to assign the clinic and its corresponding 'x' button the same id. This counter is `var clinic_list_index = 1 ` .  The delete functionality is added into the code fence of the <u>*'Adding a clinic to the selected clinic list'*</u>  section.  The edited code block will be as follows:

```javascript
 var clinic_list_index = 1;
    $(document).ready(function () {
            $("#clinic-select").change(function(event) {
            
                $("#def-val-clinic").remove();

                var selected_clinic = $("#clinic-select option:selected").text();
                
                if (clinics.includes(selected_clinic)) 
                    return;
            
                clinics.push(selected_clinic);
            
                $("#clinic_list").append(
                    '<li data-clinic="' + selected_clinic.toString() + 
                    '" class="list-group-item list-group-item-action " id="clinic-li-'+ 						(clinic_list_index).toString() + '">' +
                    selected_clinic + 
                    '<button class =' + '"button button-circle button-caution button-tiny 						float-right rem-btn"' + 
                    ' type="button"' + 
                    'data-id="' + clinic_list_index.toString() + '">' +
                    '<i class="fas fa-times"></i>' +
                    "</li>"
                )
                
			   //------------
                // New section
                //------------
                $(".rem-btn").click(function () {
                    var li_id = $(this).attr('data-id');
                    var clinicName = $("#clinic-li-" + li_id.toString()).attr('data-clinic');
                    clinics.splice(clinics.indexOf(clinicName), 1);
                    $("#clinic-li-" + li_id.toString()).remove();   // removing clinic from 					Selected Clinics list
                    $("#clinic-col-" + li_id.toString()).remove();  // removing clinic 							heading from table
                    
                    if (clinicName == "G-10/2") {
                        $('.G-10-2').remove();
                    }
                    else if (clinicName == "Blue Area") {
                        $('.Blue-Area').remove();
                    }
                    else if (clinicName == "F-10") {
                        $('.F-10').remove(); 
                    }
                });

                $("#heading").append(
                    '<div class="cell"' + 
                    'id="clinic-col-' + clinic_list_index.toString() + 
                    '" data-id="' + clinic_list_index.toString() + '">' +
                    selected_clinic +
                    '</div>'
                )
                clinic_list_index++;
                redraw_table(doctorsArr);  
            });
    });
```



The first aspect of the deletion functionality is in this particular block of code:

```javascript
$("#clinic_list").append(
    '<li data-clinic="' + selected_clinic.toString() + 
    '" class="list-group-item list-group-item-action " id="clinic-li-'+ 					(clinic_list_index).toString() + '">' +
    selected_clinic + 
    '<button class =' + '"button button-circle button-caution button-tiny 					float-right rem-btn"' + 
    ' type="button"' + 
    'data-id="' + clinic_list_index.toString() + '">' +
    '<i class="fas fa-times"></i>' +
    "</li>"
 )
```

Whenever we add a new clinic to the 'Selected Clinics' list, we give it an id: `id="clinic-li-'+ 						(clinic_list_index).toString()` . Similarly, we also give the 'x' button a data-id: `'data-id="' + clinic_list_index.toString() `  and class



The new functionality in particular is this:

```javascript
$(".rem-btn").click(function () {
    var li_id = $(this).attr('data-id');
    var clinicName = $("#clinic-li-" + li_id.toString()).attr('data-clinic');
    clinics.splice(clinics.indexOf(clinicName), 1);
    $("#clinic-li-" + li_id.toString()).remove();   // removing clinic from 					Selected Clinics list
    $("#clinic-col-" + li_id.toString()).remove();  // removing clinic 							heading from table

    if (clinicName == "G-10/2") {
        $('.G-10-2').remove();
    }
    else if (clinicName == "Blue Area") {
        $('.Blue-Area').remove();
    }
    else if (clinicName == "F-10") {
        $('.F-10').remove(); 
    }
});
```



### Assigning the selected doctors to the selected clinics

---








# Clinic Day View ( /supervisor/clinic )