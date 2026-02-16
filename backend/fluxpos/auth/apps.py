from django.apps import AppConfig

class AuthConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'auth'
    # Ini kunci utamanya, harus beda dari nama folder
    label = 'fluxpos_authentication'