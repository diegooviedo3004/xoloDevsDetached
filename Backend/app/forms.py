from django import forms
from .models import Post, PostImage

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['description', 'sex', 'breed', 'location', 'starting_price', 'weight', 'traceability', 'video_url', 'draft']
        labels = {
            'description': 'Descripción',
            'sex': 'Sexo',
            'breed': 'Raza',
            'location': 'Ubicación',
            'starting_price': 'Precio',
            'weight': 'Peso (KG)',
            'traceability': 'Trazabilidad',
            'video_url': 'Enlace de Video (YouTube)',
            'draft': 'Borrador'
        }
    
class PostImageForm(forms.ModelForm):
    class Meta:
        model = PostImage
        fields = ['image']