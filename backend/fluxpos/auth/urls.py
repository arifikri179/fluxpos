from django.urls import path
from .views import RegisterView, LoginView, activate_account, forgot_password, reset_password_confirm
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # URL: api/auth/register/
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('activate/<uidb64>/<token>/', activate_account, name='activate'),
    # URL: api/auth/login/
    path('login/', LoginView.as_view(), name='token_obtain_pair'),

    path('forgot-password/', forgot_password, name='forgot_password'),
    path('reset-password-confirm/<uidb64>/<token>/', reset_password_confirm, name='reset_password_confirm'),
    
    # URL: api/auth/token/refresh/
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 
]