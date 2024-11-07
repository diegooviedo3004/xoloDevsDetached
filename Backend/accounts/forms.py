from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm

User = get_user_model()

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True, help_text='Requerido. Ingrese un correo electrónico válido.')

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'avatar')
