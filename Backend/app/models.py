from django.db import models
from django.core.mail import send_mail
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from decimal import Decimal


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


class Post(models.Model):
    SEX_CHOICES = [
        ('M', 'Macho'),
        ('F', 'Hembra'),
    ]

    POST_CHOICES = [
        ('Auction', 'Subasta'),
        ('Post', 'Publicación'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    sex = models.CharField(max_length=1, choices=SEX_CHOICES)
    breed = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    starting_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    weight = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    traceability = models.BooleanField(default=False, blank=True)
    lot = models.BooleanField(default=False, blank=True)
    type = models.CharField(choices=POST_CHOICES, max_length=50, default='Post')
    video_url = models.URLField(blank=True, null=True)
    draft = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.description[:20]} - {self.type}"

    def is_auction_active(self):
        """Check if the auction is active based on the end date and current time."""
        return self.is_active and self.end_date > timezone.now()

    def get_highest_bid(self):
        """Get the highest bid placed on this post."""
        highest_bid = self.bids.order_by('-amount').first()
        return highest_bid.amount if highest_bid else None

    def place_bid(self, user, amount):
        """Method to handle placing a bid."""
        highest_bid = self.get_highest_bid()
        if highest_bid and amount <= highest_bid:
            raise ValueError("Bid must be higher than the current highest bid.")
        return Bid.objects.create(post=self, user=user, amount=amount)


class PostImage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='post_images/')

    def __str__(self):
        return f"Image for {self.post.description[:20]}"


class Bid(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='bids')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bid by {self.user.email} on {self.post.description[:20]} - Amount: {self.amount}"

    class Meta:
        ordering = ['-amount']
