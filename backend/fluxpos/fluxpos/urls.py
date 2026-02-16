from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API AUTH
    path('api/auth/', include('auth.urls')), # Panggil modul baru

    # API Modul Bisnis (Brand & Cabang)
    path('api/business/', include('business.urls')), 
    
    # API Modul Menu (Item, Kategori, dll)
    path('api/menu/', include('menuitem.urls')), 
    
    # Authentication (JWT)
 
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)