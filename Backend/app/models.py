from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    profile_picture = models.ImageField(upload_to='images/vendetuvaca/Inscripcion/', null=True, blank=True)  

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_groups',  
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions',  
        blank=True
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

class PhoneNumber(models.Model):
    user = models.ForeignKey(User, related_name='phone_numbers', on_delete=models.CASCADE)  
    number = models.CharField(max_length=20)  
    type = models.CharField(max_length=10, choices=(('home', 'Home'), ('work', 'Work'), ('mobile', 'Mobile')), default='mobile')

    def __str__(self):
        return f"{self.number} ({self.type})"

# Create Publication rest framewok

class Cow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Asociado directamente al usuario
    title = models.CharField(max_length=100)  # Nombre del ganado
    description = models.TextField()  # Detalles
    age = models.IntegerField()  # Edad
    weight = models.DecimalField(max_digits=5, decimal_places=2)  # Peso
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Precio

    def __str__(self):
        return self.title

class CowImage(models.Model):
    """Modelo para almacenar múltiples imágenes asociadas a una vaca"""
    cow = models.ForeignKey(Cow, related_name='images', on_delete=models.CASCADE)
    image_url = models.ImageField(upload_to='images/vendetuvaca/cows/', null=True, blank=True)

    def __str__(self):
        return f"Imagen de {self.cow.title}"

class CowBreed(models.Model):
    breed_name = models.CharField(max_length=50)

    def __str__(self):
        return self.breed_name

class CowLifeRecord(models.Model):
    cow = models.OneToOneField(Cow, on_delete=models.CASCADE, related_name='life_record')
    active = models.BooleanField(default=True)
    vaccinated = models.BooleanField(default=False)
    for_sale = models.BooleanField(default=False)

    # Datos de reproducción
    birth_date = models.DateField(null=True, blank=True)
    last_parturition_date = models.DateField(null=True, blank=True)
    expected_parturition_date = models.DateField(null=True, blank=True)
    last_heat_date = models.DateField(null=True, blank=True)
    pregnancy_date = models.DateField(null=True, blank=True)
    days_of_pregnancy = models.IntegerField(null=True, blank=True)

    # Datos de producción
    milk_production = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    days_of_lactation = models.IntegerField(null=True, blank=True)
    milk_control = models.BooleanField(default=False)

    # Vacunación y control de enfermedades
    brucellosis_application = models.BooleanField(default=False)

    # Relaciones de parentesco
    mother = models.ForeignKey(Cow, on_delete=models.SET_NULL, null=True, blank=True, related_name='calves')
    father = models.CharField(max_length=50, null=True, blank=True)

    comments = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'Hoja de vida de {self.cow.title}'

class CowBreedDetails(models.Model):
    life_record = models.ForeignKey(CowLifeRecord, on_delete=models.CASCADE, related_name='breeds')
    breed = models.ForeignKey(CowBreed, on_delete=models.CASCADE)
    trait = models.CharField(max_length=10, null=True, blank=True)  # Rasgos como "-t", "-gr", etc.