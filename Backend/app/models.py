from django.db import models
from django.core.mail import send_mail
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from decimal import Decimal
from django.core.exceptions import ValidationError
from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

import stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

BREED_CHOICES = [
    ('Angus', 'Angus'),
    ('Holstein', 'Holstein'),
    ('Charolais', 'Charolais'),
    ('Brahman', 'Brahman'),
    ('Limousin', 'Limousin'),
    ('Simmental', 'Simmental'),
    ('Hereford', 'Hereford'),
    ('Pardo suizo', 'Pardo Suizo'),
    ('Santa gertrudis', 'Santa Gertrudis'),
    ('Gyr', 'Gyr'),
    ('Girolando', 'Girolando'),
    ('Others', 'Otros'),
]

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

    breed = models.CharField(max_length=20, choices=BREED_CHOICES, default='Others')

    location = models.CharField(max_length=300)

    lat = models.TextField()
    long = models.TextField()

    starting_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    weight = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    traceability = models.BooleanField(default=False, blank=True)
    lot = models.BooleanField(default=False, blank=True)
    post_type = models.CharField(choices=POST_CHOICES, max_length=50, default='Post')
    video_url = models.URLField(blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def _str_(self):
        return f"{self.description[:20]} - {self.post_type}"

    class Meta:
        verbose_name = _('anuncio')
        verbose_name_plural = _('anuncios')

class Category(TimeStampedModel):
    name = models.CharField(max_length = 100)
    description = models.TextField(null = True, blank = True)

    def _str_(self):
        return self.name

    class Meta:
        verbose_name = _('categoría')
        verbose_name_plural = _('categorías')

class Vaccine(TimeStampedModel):
    name = models.CharField(max_length = 100)
    
    def _str_(self):
        return self.name

    class Meta:
        verbose_name = _('vacuna')
        verbose_name_plural = _('vacunas')

class ReproductiveData(TimeStampedModel):
    traceability = models.ForeignKey('Traceability', models.SET_NULL, null=True)
    birth_date = models.DateField(null=True, blank=True)
    last_calving = models.DateField(null=True, blank=True)
    beeding_date = models.DateField(null=True, blank=True)
    last_heat_date = models.DateField(null=True, blank=True)
    days_pregnant = models.IntegerField(null=True, blank=True, default=0)
    expected_calving_date = models.DateField(null=True, blank=True)
    milk_production_in_liters = models.IntegerField(null=True, blank=True, default=0)

    def _str_(self):
        return f"Datos reproductivos - {self.traceability}"

    class Meta:
        verbose_name = _('dato reproductivo')
        verbose_name_plural = _('datos reproductivos')

class DairyCowData(TimeStampedModel):
    traceability = models.ForeignKey('Traceability', models.SET_NULL, null=True)
    daily_milk_production_in_liters = models.IntegerField(null=True, blank=True, default=0)
    days_in_milk = models.IntegerField(null=True, blank=True, default=0)
    
    def _str_(self):
        return f"Producción diaria: {self.daily_milk_production_in_liters}L"

    class Meta:
        verbose_name = _('dato de vaca lechera')
        verbose_name_plural = _('datos de vacas lecheras')

class Traceability(TimeStampedModel):
    
    post = models.ForeignKey(Post, on_delete=models.SET_NULL, null=True, related_name="traceabilities")
    chapa_code = models.CharField(max_length = 20)
    record = models.ImageField(upload_to='record/', null=True, blank=True)
    breed_M = models.CharField(max_length=20, choices=BREED_CHOICES, default='Others', null=True, blank=True)
    breed_P = models.CharField(max_length=20, choices=BREED_CHOICES, default='Others', null=True, blank=True)
    category = models.ManyToManyField(Category, blank=True)
    health_status = models.TextField(null=True, blank=True)
    vaccines = models.ManyToManyField(Vaccine, blank=True)
    comments = models.TextField(null=True, blank=True)


    def clean(self):
        if not self.post.traceability:
            raise ValidationError("Creando una trazabilidad para un post sin trazabilidad")
        
    def _str_(self):
        return f"Trazabilidad {self.chapa_code}"

    class Meta:
        verbose_name = _('trazabilidad')
        verbose_name_plural = _('trazabilidades')

class PostImage(TimeStampedModel):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='post_images/')

    def _str_(self):
        return f"Image for {self.post.description[:20]}"
    
    class Meta:
        verbose_name = _('imagen del post')
        verbose_name_plural = _('imagenes del post')

class Auction(TimeStampedModel):
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
            
    def _str_(self):
        return f"Subasta para {self.post.title}"

    class Meta:
        verbose_name = _('subasta')
        verbose_name_plural = _('subastas')

class Bid(TimeStampedModel):
    auction = models.ForeignKey(Auction, on_delete=models.CASCADE, related_name='bids')
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def _str_(self):
        return f"Bid by {self.user.email} on {self.post.description[:20]} - Amount: {self.amount}"

    class Meta:
        ordering = ['-amount']
        verbose_name = _('oferta')
        verbose_name_plural = _('ofertas')

    def clean(self):
        if not self.auction.is_auction_active():
            raise ValidationError("No se pueden realizar pujas en una subasta cerrada o fuera de su tiempo activo.")
            
        highest_bid = self.auction.get_highest_bid()
        if highest_bid and self.amount <= highest_bid:
            raise ValidationError(f"El monto de la puja debe ser mayor a la puja anterior de {highest_bid.amount}")

    def save(self, *args, **kwargs):
        # Ejecutar la validación antes de guardar
        self.full_clean()
        super().save(*args, **kwargs)

class Promotion(models.Model):
    PLAN_CHOICES = [
        ('A', 'Plan A'), 
        ('B', 'Plan B'), 
        ('C', 'Plan C'),
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

    def _str_(self):
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