from django import forms
from .models import Post, PostImage

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['descripcion', 'sexo', 'raza', 'ubicacion', 'precio', 'kg', 'trazabilidad', 'video_url', 'draft']
        labels = {
            'descripcion': 'Descripción',
            'sexo': 'Sexo',
            'raza': 'Raza',
            'ubicacion': 'Ubicación',
            'precio': 'Precio',
            'kg': 'Peso (KG)',
            'trazabilidad': 'Trazabilidad',
            'video_url': 'Enlace de Video (YouTube)',
            'draft': 'Borrador'
        }
    
class PostImageForm(forms.ModelForm):
    class Meta:
        model = PostImage
        fields = ['image']