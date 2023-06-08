# Full Stack Project Tutorial App- Backend

```
# KURULUM KOMUTLARI
   1 py -m venv env
   2 .\env\Scripts\activate
   3 pip install djangorestframework
   5 django-admin startproject main .
   6 pip install python-decouple
   7 py manage.py migrate
   8 py manage.py createsuperuser
   9 py manage.py startapp tutorial
```
## How To Use

<!-- This is an example, please update according to your application -->

To clone and run this application, you'll need [Git](https://git-scm.com)

```Python

# Clone this repository
$ git clone https://github.com/your-user-name/your-project-name

# Install dependencies
    $ cd api
    $ python -m venv env
    > env/Scripts/activate (for win OS)
    > source env/Scripts/activate(for bash)
    $ source env/bin/activate (for macOs/linux OS)
    $ pip install -r requirements.txt

# Edit .backend.env to .env

# Add SECRET_KEY in .env file
# migrate
    $ python manage.py migrate
# Run the app
    $ python manage.py runserver
```

<li>Frontend kısmını apimize bağlayabilmek için cors-headers paketini kullanacağız</li>
<a href="https://github.com/adamchainz/django-cors-headers">Cors Headers paketi için</a>