from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.shortcuts import redirect
from django.conf import settings
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .serializers import RegisterSerializer

# --- VIEW UNTUK REGISTRASI ---
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        # 1. Simpan user tapi is_active set ke FALSE
        user = serializer.save()
        user.is_superuser = True
        user.is_staff = True
        user.is_active = False 
        user.save()

        # 2. Siapkan data untuk Link Aktivasi
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
    
        activation_link = f"https://localhost:8000/api/auth/activate/{uid}/{token}/"
        subject = 'Aktivasi Akun FluxPOS'
        context = {
            'first_name': user.first_name,
            'last_name': user.last_name,
            'activation_url': activation_link,
        }
        html_content = render_to_string('activation_email.html', context)
        
        email = EmailMultiAlternatives(
            subject, 
            f"Halo, aktivasi akun Anda di sini: {activation_link}",
            'FluxPOS Official <fluxposofficial@gmail.com>', 
            [user.email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()

# --- VIEW UNTUK PROSES AKTIVASI (Backend Endpoint) ---
@api_view(['GET'])
@permission_classes([AllowAny])
def activate_account(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return redirect(f'{settings.FRONTEND_URL}/login?activated=true')
    else:
        return redirect(f'{settings.FRONTEND_URL}/login?activated=false')

# --- 2. FORGOT & RESET PASSWORD ---
@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    email_user = request.data.get('email')
    user = User.objects.filter(email=email_user).first()
    
    if user:
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        # Link Reset mengarah ke FRONTEND (Netlify)
        reset_link = f"https://fluxpos.netlify.app/reset-password/{uid}/{token}"


        subject = 'Reset Password FluxPOS'
        
        # Siapkan Context untuk HTML
        context = {
            'first_name': user.first_name,
            'reset_link': reset_link,
        }
        
        # Render template HTML (Pastikan file html-nya sudah ada di folder templates)
        html_content = render_to_string('reset_password.html', context)
        text_content = f"Klik link berikut untuk reset password Anda: {reset_link}"

        # Kirim Email dengan format MultiAlternatives (Teks + HTML)
        email = EmailMultiAlternatives(
            subject, 
            text_content, 
            'FluxPOS Official <fluxposofficial@gmail.com>', 
            [user.email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()

    return Response({"detail": "Instruksi reset telah dikirim ke email jika terdaftar."}, status=status.HTTP_200_OK)
@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_confirm(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        new_password = request.data.get('password')
        if new_password:
            user.set_password(new_password)
            user.save()
            return Response({"detail": "Password berhasil diperbarui."}, status=status.HTTP_200_OK)
        return Response({"detail": "Password tidak boleh kosong."}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({"detail": "Link reset tidak valid atau kadaluarsa."}, status=status.HTTP_400_BAD_REQUEST)



# --- CUSTOM SERIALIZER UNTUK LOGIN ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Cek syarat tambahan: Harus Superuser DAN Active
        if not (self.user.is_superuser and self.user.is_active):
            raise PermissionDenied("Akses ditolak. Pastikan akun sudah diaktivasi via email.")
        return data

# --- VIEW UNTUK LOGIN ---
class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer