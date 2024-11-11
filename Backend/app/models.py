from django.db import models
from django.core.mail import send_mail
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from decimal import Decimal


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)
    is_active = models.BooleanField(_('active'), default=True)
    is_staff = models.BooleanField(_('staff status'), default=False)
    is_superuser = models.BooleanField(default=False) 
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    phone_number = models.CharField(max_length=8, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        send_mail(subject, message, from_email, [self.email], **kwargs)


class Post(TimeStampedModel):
    SEX_CHOICES = [
        ('Macho', 'Macho'),
        ('Hembra', 'Hembra'),
    ]

    POST_CHOICES = [
        ('Auction', 'Subasta'),
        ('Post', 'Anuncio'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    sex = models.CharField(max_length=10, choices=SEX_CHOICES)

    RAZAS_CHOICES = [
        ('angus', 'Angus'),
        ('holstein', 'Holstein'),
        ('charolais', 'Charolais'),
        ('brahman', 'Brahman'),
        ('limousin', 'Limousin'),
        ('simmental', 'Simmental'),
        ('hereford', 'Hereford'),
        ('pardo_suizo', 'Pardo Suizo'),
        ('santa_gertrudis', 'Santa Gertrudis'),
        ('gyr', 'Gyr'),
        ('girolando', 'Girolando'),
        ('otro', 'Otro'),  # Opción para otras razas no listadas
    ]
    
    breed = models.CharField(max_length=20, choices=RAZAS_CHOICES, default='otro')
    
    location = models.CharField(max_length=100)

    lat = models.TextField()
    long = models.TextField()

    starting_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    weight = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    traceability = models.BooleanField(default=False, blank=True)
    lot = models.BooleanField(default=False, blank=True)
    post_type = models.CharField(choices=POST_CHOICES, max_length=50, default='Post')
    video_url = models.URLField(blank=True, null=True)
    approved = models.BooleanField(default=False) # Si ya lo aprobamos manualmente
    is_active = models.BooleanField(default=True) #Soft delete 

    def __str__(self):
        return f"{self.description[:20]} - {self.type}"

    
   

  

class Categoria(TimeStampedModel):
    name = models.CharField(max_length = 100)
    descripcion = models.TextField(null = True, blank = True)

class Vacuna(TimeStampedModel):
    name = models.CharField(max_length = 100)

class InfoReproductiva(TimeStampedModel):
    trazabilidad = models.ForeignKey('Trazabilidad', models.SET_NULL, null=True)
    fecha_de_nacimiento = models.DateField(null=True, blank=True)
    ultimo_parto = models.DateField(null=True, blank=True)
    fecha_de_prenez = models.DateField(null=True, blank=True)
    fecha_de_ultimo_celo = models.DateField(null=True, blank=True)
    dias_de_prenez = models.IntegerField(null=True, blank=True, default=0)
    fecha_esperada_parto = models.DateField(null=True, blank=True)
    produccion_leche_litros = models.IntegerField(null=True, blank=True, default=0)

class InfoLechera(TimeStampedModel):
    trazabilidad = models.ForeignKey('Trazabilidad', models.SET_NULL, null=True)
    produccion_diaria_litros = models.IntegerField(null=True, blank=True, default=0)
    dias_de_lactancia = models.IntegerField(null=True, blank=True, default=0)
    


class Trazabilidad(TimeStampedModel):
    RAZAS_CHOICES = [
        ('angus', 'Angus'),
        ('holstein', 'Holstein'),
        ('charolais', 'Charolais'),
        ('brahman', 'Brahman'),
        ('limousin', 'Limousin'),
        ('simmental', 'Simmental'),
        ('hereford', 'Hereford'),
        ('pardo_suizo', 'Pardo Suizo'),
        ('santa_gertrudis', 'Santa Gertrudis'),
        ('gyr', 'Gyr'),
        ('girolando', 'Girolando'),
        ('otro', 'Otro'),  # Opción para otras razas no listadas
    ]
    

    post = models.ForeignKey(Post, on_delete=models.SET_NULL, null=True)
    codigo_chapa = models.CharField(max_length = 20)
    expediente = models.ImageField(upload_to='expedientes/', null=True, blank=True)
    breed_M = models.CharField(max_length=20, choices=RAZAS_CHOICES, default='otro', null=True, blank=True)
    breed_P = models.CharField(max_length=20, choices=RAZAS_CHOICES, default='otro', null=True, blank=True)
    categoria = models.ManyToManyField(Categoria, blank=True)
    estado_de_salud = models.TextField(null=True, blank=True)
    vacunas = models.ManyToManyField(Vacuna, blank=True)
    comentarios = models.TextField(null=True, blank=True)


    def clean(self):
        if not self.post.traceability:
            raise ValidationError("Creando una trazabilidad para un post sin trazabilidad")

class PostImage(TimeStampedModel):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='post_images/')

    def __str__(self):
        return f"Image for {self.post.description[:20]}"

class Subasta(TimeStampedModel):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='bids')
    end_date = models.DateTimeField(null=True, blank=True)

    def get_highest_bid(self):
        """Get the highest bid placed on this post."""
        highest_bid = self.bids.order_by('-amount').first()
        return highest_bid.amount if highest_bid else None

    def is_auction_active(self):
        """Check if the auction is active based on the end date and current time."""
        return self.end_date > timezone.now()

    def get_final_amount(self):
        """Get the highest bid placed on this post."""
        if not self.is_auction_active:
            return self.get_highest_bid
            

class Bid(TimeStampedModel):
    subasta = models.ForeignKey(Subasta, on_delete=models.CASCADE, related_name='bids')
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Bid by {self.user.email} on {self.post.description[:20]} - Amount: {self.amount}"

    class Meta:
        ordering = ['-amount']

    def clean(self):
        if not self.subasta.is_auction_active():
            raise ValidationError("No se pueden realizar pujas en una subasta cerrada o fuera de su tiempo activo.")
            
        puja_mayor = self.subasta.get_highest_bid
        if puja_mayor and self.amount <= puja_mayor.amount:
            raise ValidationError(f"El monto de la puja debe ser mayor a la puja anterior de {puja_mayor.monto}")

    def save(self, *args, **kwargs):
        # Ejecutar la validación antes de guardar
        self.full_clean()
        super().save(*args, **kwargs)



import stripe
from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

stripe.api_key = settings.STRIPE_SECRET_KEY

class Promotion(models.Model):
    PLAN_CHOICES = [
        ('A', 'Plan A'),  # Ejemplo: $10.00
        ('B', 'Plan B'),  # Ejemplo: $20.00
        ('C', 'Plan C'),  # Ejemplo: $30.00
    ]

    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='promotions')
    plan = models.CharField(max_length=1, choices=PLAN_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    stripe_payment_id = models.CharField(max_length=100, blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Asigna un monto en función del plan seleccionado
        plan_prices = {'A': 10.00, 'B': 20.00, 'C': 30.00}
        self.amount = plan_prices.get(self.plan, 10.00)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.post.title} - {self.is_paid}"

    def create_stripe_session(self):
        """Crear una sesión de pago de Stripe para esta promoción."""
        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': f'Promoción {self.get_plan_display()} para {self.post.title}',
                        },
                        'unit_amount': int(self.amount * 100),  # Stripe maneja los montos en centavos
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=settings.YOUR_DOMAIN + '/success/',
                cancel_url=settings.YOUR_DOMAIN + '/cancel/',
                metadata={'promotion_id': self.id},
            )
            self.stripe_payment_id = checkout_session.id
            self.save()
            return checkout_session
        except Exception as e:
            print(f"Error creando la sesión de pago de Stripe: {e}")
            return None

