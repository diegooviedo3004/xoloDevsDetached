from django import forms
from .models import Post, PostImage

class PostForm(forms.ModelForm):
    end_date = forms.DateTimeField(
        widget=forms.DateInput(attrs={'type': 'datetime-local', 'class': 'form-control'}),
        label='Fecha final de subasta',
        required=False,
    )

    class Meta:
        model = Post
        fields = ['title', 'description', 'type', 'sex', 'breed', 'location', 'starting_price', 'weight', 'traceability', 'video_url', 'draft', 'end_date']
        labels = {
            'title': 'Título',
            'description': 'Descripción',
            'type': 'Tipo de publicación',
            'sex': 'Sexo',
            'breed': 'Raza',
            'location': 'Ubicación',
            'starting_price': 'Precio',
            'weight': 'Peso (KG)',
            'traceability': 'Trazabilidad',
            'video_url': 'Enlace de Video (YouTube)',
            'draft': 'Borrador',
            'end_date': 'Fecha final de subasta',

        }
    
class PostImageForm(forms.ModelForm):
    class Meta:
        model = PostImage
        fields = ['image']