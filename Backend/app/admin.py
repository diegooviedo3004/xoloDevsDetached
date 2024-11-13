from django.contrib import admin
from .models import Post, Bid, PostImage, Promotion, Auction, Category, DairyCowData, ReproductiveData, Traceability, Vaccine
from django.contrib.auth import get_user_model

User = get_user_model()

# Register your models here.
admin.site.register(Post)
admin.site.register(PostImage)
admin.site.register(Bid)
admin.site.register(Auction)
admin.site.register(Category)
admin.site.register(DairyCowData)
admin.site.register(ReproductiveData)
admin.site.register(Traceability)
admin.site.register(Vaccine)