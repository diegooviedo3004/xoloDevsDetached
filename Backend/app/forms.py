from django import forms
from .models import Post, PostImage, Traceability, DairyCowData, ReproductiveData
from decimal import Decimal

"""
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
        """
class PostForm(forms.ModelForm):
    traceability = forms.BooleanField(required=False, widget=forms.CheckboxInput(), label="¿Incluye trazabilidad?")
    end_date = forms.DateTimeField(required=False, widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}), label="Fecha de finalización de la subasta")


    class Meta:
        model = Post
        fields = ['title', 'description', 'sex', 'breed', 'location', 'starting_price', 'weight', 'lot', 'post_type', 'video_url', 'is_approved', 'is_active', 'traceability', 'end_date']
    #     widgets = {
    #         'description': forms.Textarea(attrs={'rows': 4, 'cols': 40}),
    #         'video_url': forms.URLInput(attrs={'placeholder': 'Enter video URL (optional)'}),
    #     }

    # def clean_starting_price(self):
    #     starting_price = self.cleaned_data.get('starting_price')
    #     if starting_price < Decimal('0.00'):
    #         raise forms.ValidationError('El precio inicial no puede ser negativo.')
    #     return starting_price

    # def clean_weight(self):
    #     weight = self.cleaned_data.get('weight')
    #     if weight < Decimal('0.00'):
    #         raise forms.ValidationError('El peso no puede ser negativo.')
    #     return weight

class TraceabilityForm(forms.ModelForm):
    class Meta:
        model = Traceability
        fields = '__all__'

        # fields = ['chapa_code', 'record', 'breed_M', 'breed_P', 'category', 'health_status', 'vaccines', 'comments']
        # widgets = {
        #     'health_status': forms.Textarea(attrs={'rows': 4, 'cols': 40}),
        #     'comments': forms.Textarea(attrs={'rows': 4, 'cols': 40}),
        # }
    
class PostImageForm(forms.ModelForm):
    class Meta:
        model = PostImage
        fields = ['image']

class ReproductiveDataForm(forms.ModelForm):
    class Meta:
        model = ReproductiveData
        fields = '__all__'
        widgets = {
            'birth_date': forms.DateInput(attrs={'type': 'date'}),
            'last_calving': forms.DateInput(attrs={'type': 'date'}),
            'beeding_date': forms.DateInput(attrs={'type': 'date'}),
            'last_heat_date': forms.DateInput(attrs={'type': 'date'}),
            'expected_calving_date': forms.DateInput(attrs={'type': 'date'}),
        }

    # def clean_days_pregnant(self):
    #     days_pregnant = self.cleaned_data.get('days_pregnant')
    #     if days_pregnant is not None and days_pregnant < 0:
    #         raise forms.ValidationError("The number of days pregnant cannot be negative.")
    #     return days_pregnant

    # def clean_milk_production_in_liters(self):
    #     milk_production = self.cleaned_data.get('milk_production_in_liters')
    #     if milk_production is not None and milk_production < 0:
    #         raise forms.ValidationError("Milk production cannot be negative.")
    #     return milk_production

class DairyCowDataForm(forms.ModelForm):
    class Meta:
        model = DairyCowData
        fields = [
            'traceability',
            'daily_milk_production_in_liters',
            'days_in_milk',
        ]
        widgets = {
            'daily_milk_production_in_liters': forms.NumberInput(attrs={'min': 0}),
            'days_in_milk': forms.NumberInput(attrs={'min': 0}),
        }

    def clean_daily_milk_production_in_liters(self):
        daily_milk = self.cleaned_data.get('daily_milk_production_in_liters')
        if daily_milk is not None and daily_milk < 0:
            raise forms.ValidationError("Daily milk production cannot be negative.")
        return daily_milk

    def clean_days_in_milk(self):
        days_in_milk = self.cleaned_data.get('days_in_milk')
        if days_in_milk is not None and days_in_milk < 0:
            raise forms.ValidationError("Days in milk cannot be negative.")
        return days_in_milk
