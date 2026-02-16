from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure--e*&zj(v-z4j$y)%hp0z-4c5*+i_(@8(-5#5rkzm08#v)@@khz'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth', # Ini punya Django
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'business', 
    'auth.apps.AuthConfig', # <--- UBAH INI (Gunakan path ke apps.py)
    'menuitem'
]

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {'min_length': 8}, # Minimal 8 karakter
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# settings.py

# ... konfigurasi lainnya ...

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True

# Gunakan email dan kode 16 digit tadi
EMAIL_HOST_USER = 'fluxposofficial@gmail.com'
EMAIL_HOST_PASSWORD = 'lvuhqonaurvnwlqe'  # Masukkan kodenya di sini tanpa spasi
DEFAULT_FROM_EMAIL = 'FluxPOS Official <fluxposofficial@gmail.com>'

# Masa berlaku link (1 jam)
PASSWORD_RESET_TIMEOUT = 3600









from datetime import timedelta

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=3),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

import os

FRONTEND_URL = os.getenv(
    'https://polite-arithmetic-603996.netlify.app',
    'http://localhost:5173'  # default untuk local
)

# Tambahkan IP pengakses ke ALLOWED_HOSTS
ALLOWED_HOSTS = ['*', '192.168.1.6', '192.168.1.12', 'polite-arithmetic-603996.netlify.app']

# Pastikan domain Netlify ada di sini
CORS_ALLOWED_ORIGINS = [
    "https://polite-arithmetic-603996.netlify.app",
    "http://localhost:5173",
]

CORS_ALLOW_ALL_ORIGINS = True
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
       'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'fluxpos.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # Tambahkan BASE_DIR / 'templates' di dalam list DIRS
        'DIRS': [BASE_DIR / 'templates'], 
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug', # Tambahkan ini juga jika belum ada
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
WSGI_APPLICATION = 'fluxpos.wsgi.application'


MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'fluxpos',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': 'localhost',  # Or the hostname/IP address of your database server
        'PORT': '3306',        # The port MySQL is running on (default is 3306)
    }
}


# Password validation
# https://docs.djangoproject.com/en/6.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/6.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Jakarta'

USE_I18N = True
USE_TZ = True



STATIC_URL = 'static/'
