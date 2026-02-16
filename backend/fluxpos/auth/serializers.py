import re
from django.contrib.auth.models import User
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
    # Kita buat password wajib diisi dan write_only agar tidak tampil saat di-GET
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        # Daftarkan semua field agar diterima dari frontend
        fields = ('username', 'password', 'email', 'first_name', 'last_name')

    def validate_password(self, value):
        """
        Fungsi ini otomatis dijalankan saat serializer.is_valid() dipanggil.
        """
        # 1. Cek Panjang Minimal
        if len(value) < 8:
            raise serializers.ValidationError("Password minimal harus 8 karakter.")
        
        # 2. Cek Huruf Besar (Capital)
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("Password harus mengandung minimal satu huruf kapital.")
            
        # 3. Cek Simbol (Menggunakan Regex)
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("Password harus mengandung minimal satu simbol (@, #, $, dll).")
            
        return value

    def create(self, validated_data):
        # Menggunakan create_user agar password otomatis di-hash oleh Django
        # validated_data sudah termasuk first_name dan last_name yang dikirim React
        user = User.objects.create_user(**validated_data)
        return user