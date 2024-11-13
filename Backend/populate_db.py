import os
import random
from faker import Faker
import django
from decimal import Decimal
from django.core.files import File

# Configura Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")
django.setup()

# Importar los modelos
from app.models import (
    User, Post, Category, Vaccine, ReproductiveData, DairyCowData, Traceability, PostImage, Auction, Bid
)

# Instancia de Faker
fake = Faker()

DEPARTMENTS = [
    "Atlántico Norte", 
    "Atlántico Sur", 
    "Boaco", 
    "Carazo", 
    "Chinandega", 
    "Chontales", 
    "Estelí", 
    "Granada", 
    "Jinotega", 
    "León", 
    "Madriz", 
    "Managua", 
    "Masaya", 
    "Matagalpa", 
    "Nueva Segovia", 
    "Rivas", 
    # "Régimen Autónomo de la Costa Caribe Norte", 
    # "Régimen Autónomo de la Costa Caribe Sur"
]

CATEGORY = [
    "Destace",
    "Engorde",
    "Mejoramiento Genético",
    "Producción de Leche",
]

titles = [
    "Vaca lechera de alta producción",
    "Venta de vaca de carne de primera calidad",
    "Vacas jóvenes listas para producción",
    "Oportunidad única: Vaca Holstein de alta genética",
    "Hermosa vaca Angus con excelente rendimiento",
    "Vacas Jersey en venta para producción de leche",
    "Vaca saludable lista para ordeño",
    "Vaca Hereford ideal para crianza",
    "Venta de vaca Brahman adaptada al clima",
    "Vaca lechera en excelentes condiciones",
    "Vacas reproductoras con alta fertilidad",
    "Vaca recién parida en venta",
    "Vaca con ternero incluido",
    "Vaca lechera de gran capacidad",
    "Vaca de carne de gran peso",
    "Vacas de excelente genética en venta",
    "Venta de vacas para producción intensiva",
    "Vaca de pastoreo adaptable",
    "Vacas Holstein de alta producción",
    "Vacas con certificado de sanidad",
    "Venta de vaca ideal para pequeños ganaderos",
    "Vacas Hereford de fácil adaptación",
    "Vaca con excelente historial reproductivo",
    "Vacas aptas para carne y leche",
    "Vaca lista para inseminación",
    "Vacas Charolais en venta",
    "Venta de vaca criolla resistente",
    "Vaca lechera con gran docilidad",
    "Vacas jóvenes para producción lechera",
    "Vacas mestizas de buena adaptabilidad",
    "Venta de vacas a buen precio",
    "Vacas robustas y saludables",
    "Vaca productiva lista para entrega",
    "Vacas de carne de gran rendimiento",
    "Venta de vacas Brahman puras",
    "Vaca ideal para mejorar el hato",
    "Vaca Jersey de alto rendimiento lechero",
    "Vaca con ternera en venta",
    "Venta de vaca Brown Swiss",
    "Vaca de carne lista para sacrificio",
    "Vaca de raza pura a buen precio",
    "Vaca lechera con excelente rendimiento",
    "Vaca adaptada a distintos climas",
    "Vaca de campo lista para producir",
    "Vaca en condiciones perfectas",
    "Vacas para doble propósito",
    "Vaca con buena capacidad reproductiva",
    "Vacas de producción alta en leche",
    "Venta de vaca adaptada al pastoreo",
    "Vaca F1 de genética superior",
    "Vacas robustas y productivas",
    "Vaca ideal para mejorar la genética",
    "Vaca lechera económica en venta",
    "Vaca de carne Angus",
    "Vacas Holstein jóvenes",
    "Venta de vacas sanas y fuertes",
    "Vaca productora de leche de calidad",
    "Vaca para cría de terneros",
    "Vaca Charolais de alta genética",
    "Vacas de alta producción garantizada",
    "Venta de vacas adaptables a cualquier entorno",
    "Vaca con garantía de producción",
    "Vacas cruzadas de buena adaptación",
    "Vaca lechera con historial de producción",
    "Vaca de carne lista para engorde",
    "Vacas con genética comprobada",
    "Vaca con excelente calidad en leche",
    "Vacas resistentes y productivas",
    "Vaca Holstein con ternero",
    "Venta de vacas de calidad superior",
    "Vacas listas para producción continua",
    "Vaca con alto rendimiento en leche",
    "Venta de vacas adaptadas a pasto",
    "Vaca de excelente conformación",
    "Vacas de buena genética y sanidad",
    "Vaca ideal para pequeñas producciones",
    "Venta de vacas con historial de salud",
    "Vaca lechera lista para ordeño diario",
    "Vaca de carne de calidad garantizada",
    "Vacas de diferentes razas disponibles",
    "Vaca Jersey con alta producción",
    "Venta de vacas listas para producción",
    "Vaca de alta genética para cría",
    "Vacas productivas con terneros",
    "Vaca lechera de fácil manejo",
    "Vacas de carne con buen peso",
    "Vaca ideal para pequeñas fincas",
    "Vacas adaptadas a diversos climas",
    "Vaca de excelente docilidad",
    "Venta de vaca de gran calidad",
    "Vaca con genética superior",
    "Vaca de gran fertilidad",
    "Vacas jóvenes y productivas",
    "Vaca para producción continua",
    "Vacas en perfecto estado de salud",
    "Venta de vaca de alta productividad",
    "Vaca con ternero a un excelente precio",
    "Vacas para producción sostenida",
    "Vacas con alta capacidad de producción",
    "Vaca para carne de gran calidad",
    "Vacas listas para ordeño inmediato",
    "Vacas de excelente conformación física",
    "Vaca de gran tamaño y rendimiento",
]

descriptions = [
    "Vaca lechera con alta producción diaria, ideal para mejorar el hato lechero.",
    "Vaca de carne de primera calidad, excelente conformación y buena salud.",
    "Jóvenes vacas listas para iniciar producción de leche o cría.",
    "Vaca Holstein de alta genética, perfecta para aumentar la producción de leche.",
    "Hermosa vaca Angus con excelente rendimiento en carne, ideal para engorde.",
    "Vacas Jersey de buena genética, perfectas para aumentar la producción de leche.",
    "Vaca saludable y lista para ordeño, con buen historial de producción.",
    "Vaca Hereford de alta calidad, perfecta para crianza o cruce genético.",
    "Vaca Brahman resistente, adaptada a condiciones climáticas variadas.",
    "Vaca lechera en excelentes condiciones, ideal para producción intensiva.",
    "Vacas reproductoras de alta fertilidad, perfectas para expansión del hato.",
    "Vaca recién parida, ideal para producción continua de leche.",
    "Vaca con ternero, excelente opción para quienes buscan ampliar el hato.",
    "Vaca lechera de gran capacidad productiva, con excelente rendimiento.",
    "Vaca de carne con gran peso y buen estado de salud.",
    "Vacas de genética superior, ideales para mejorar la producción del hato.",
    "Vaca de alto rendimiento, adaptada para sistemas de producción intensiva.",
    "Vaca adaptable al pastoreo, ideal para pequeños y medianos ganaderos.",
    "Vacas Holstein de alta producción, perfectas para ordeño diario.",
    "Vacas con certificado de sanidad y excelente estado físico.",
    "Vaca ideal para ganaderos que buscan mejorar la producción lechera.",
    "Vacas Hereford adaptadas para diferentes climas, fácil manejo y docilidad.",
    "Vaca con historial reproductivo comprobado, ideal para cría.",
    "Vacas aptas para producción de carne y leche, excelentes en ambas áreas.",
    "Vaca lista para inseminación, alta capacidad de fertilidad.",
    "Vacas Charolais en venta, de genética excelente para carne.",
    "Vaca criolla resistente, adaptada a climas tropicales y fríos.",
    "Vaca lechera de buena docilidad, ideal para manejo fácil.",
    "Vacas jóvenes con alto potencial productivo en leche.",
    "Vacas mestizas con buena adaptación y alta producción de leche.",
    "Vacas en venta a buen precio, ideal para nuevos ganaderos.",
    "Vacas robustas, saludables y productivas en cualquier entorno.",
    "Vaca productiva lista para entrega inmediata, perfecta para hato lechero.",
    "Vacas de carne de gran rendimiento, ideales para sistemas de engorde.",
    "Vacas Brahman puras, adaptadas a diferentes condiciones de campo.",
    "Vaca perfecta para mejorar la genética del hato.",
    "Vaca Jersey con alta producción lechera y buen estado de salud.",
    "Vaca con ternera, ideal para quienes buscan expansión del hato.",
    "Venta de vaca Brown Swiss, excelente para ordeño continuo.",
    "Vaca lista para sacrificio, de gran peso y carne de calidad.",
    "Vaca de raza pura a buen precio, perfecta para cría o engorde.",
    "Vaca lechera con alto rendimiento y excelente calidad de leche.",
    "Vaca adaptada a climas cálidos y fríos, ideal para cualquier región.",
    "Vaca de campo lista para aumentar la producción lechera.",
    "Vaca en perfectas condiciones, ideal para ganaderos exigentes.",
    "Vacas para doble propósito, adaptadas a carne y leche.",
    "Vaca con alta capacidad reproductiva y excelente salud.",
    "Vacas de alta producción en leche, perfectas para ordeño diario.",
    "Vaca adaptada al pastoreo, excelente opción para pequeños ganaderos.",
    "Vaca F1 con genética superior, ideal para aumentar el hato.",
    "Vacas robustas y productivas, adaptadas a cualquier entorno.",
    "Vaca ideal para mejorar la genética de la finca.",
    "Vaca lechera a precio accesible, ideal para ordeño familiar.",
    "Vaca de carne Angus, perfecta para sistemas de engorde.",
    "Vacas Holstein jóvenes, listas para iniciar producción.",
    "Vacas sanas y fuertes, ideales para cualquier tipo de producción.",
    "Vaca productora de leche de alta calidad, excelente historial.",
    "Vaca para cría de terneros, ideal para ganaderos de cría.",
    "Vaca Charolais con excelente genética y alta producción de carne.",
    "Vacas de alta producción, perfectas para sistemas lecheros.",
    "Vaca adaptada a diversos entornos, ideal para distintos climas.",
    "Vaca de calidad garantizada, perfecta para ordeño diario.",
    "Vacas cruzadas con buena adaptación y alta productividad.",
    "Vaca con historial de alta producción lechera.",
    "Vaca de carne lista para sistemas de engorde.",
    "Vacas con genética comprobada para cría y producción.",
    "Vaca con excelente calidad en leche y docilidad.",
    "Vacas resistentes y productivas, adaptadas a diferentes condiciones.",
    "Vaca Holstein con ternero, ideal para expansión del hato.",
    "Vacas de calidad superior en venta, listas para producción.",
    "Vacas listas para producción continua de carne o leche.",
    "Vaca con alto rendimiento lechero y docilidad.",
    "Vaca adaptada a sistemas de pastoreo, excelente producción.",
    "Vaca de excelente conformación física y rendimiento.",
    "Vacas de buena genética, ideales para hato productivo.",
    "Vaca ideal para ganaderos de pequeña escala.",
    "Vacas con historial de salud comprobado, en excelente estado.",
    "Vaca lechera lista para ordeño diario, alta producción.",
    "Vaca de carne con calidad garantizada, ideal para engorde.",
    "Vacas de diferentes razas y edades, disponibles a buen precio.",
    "Vaca Jersey de alta producción lechera, excelente inversión.",
    "Vacas listas para sistemas de ordeño continuo.",
    "Vaca de genética superior, ideal para cría de alta calidad.",
    "Vacas productivas con terneros incluidos.",
    "Vaca lechera de fácil manejo, adaptada a diferentes sistemas.",
    "Vacas de carne con buen peso, listas para engorde.",
    "Vaca perfecta para fincas de pequeña escala.",
    "Vacas adaptadas a diversos climas, ideales para nuevos ganaderos.",
    "Vaca de gran docilidad, perfecta para sistemas de ordeño.",
    "Vaca de gran calidad, lista para entrega inmediata.",
    "Vaca con genética superior y alta producción de leche.",
    "Vaca de gran fertilidad, ideal para sistemas de cría.",
    "Vacas jóvenes con excelente potencial productivo.",
    "Vaca para sistemas de producción continua.",
    "Vacas en excelente estado de salud, disponibles para venta.",
    "Vaca de alta productividad lechera, ideal para ordeño diario.",
    "Vaca con ternero a buen precio, perfecta para ganaderos de cría.",
    "Vacas para producción sostenible de carne o leche.",
    "Vacas de alta capacidad de producción, adaptadas a sistemas intensivos.",
    "Vaca de carne de gran calidad, lista para engorde.",
    "Vacas listas para ordeño, perfectas para producción lechera.",
    "Vacas de excelente conformación física y productividad.",
    "Vaca de gran tamaño y alto rendimiento en carne.",
]

# Opciones para los campos que requieren elecciones predefinidas
BREED_CHOICES = [choice[0] for choice in Post._meta.get_field('breed').choices]
SEX_CHOICES = [choice[0] for choice in Post._meta.get_field('sex').choices]
POST_CHOICES = [choice[0] for choice in Post._meta.get_field('post_type').choices]

# Funciones para poblar datos
def populate_users(n=30):
    """ Crea usuarios falsos. """
    for _ in range(n):
        user = User.objects.create_user(
            email=fake.email(),
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password="password123",
            phone_number=fake.phone_number()
        )
        print(f"User creado: {user.email}")

def populate_categories(n=5):
    """ Crea categorías falsas. """
    for _ in range(n):
        category = Category.objects.create(
            name=random.choice(CATEGORY),
            description=fake.sentence()
        )
        print(f"Categoría creada: {category.name}")

def populate_vaccines(n=5):
    """ Crea vacunas falsas. """
    for _ in range(n):
        vaccine = Vaccine.objects.create(name=fake.word())
        print(f"Vacuna creada: {vaccine.name}")

def populate_posts(n=100):
    """ Crea posts falsos. """
    users = list(User.objects.all())
    images_folder = "cow_images"
    images = [f for f in os.listdir(images_folder) if f.endswith(".jpg")]

    for _ in range(n):
        post = Post.objects.create(
            user=random.choice(users),
            title=titles[_],
            description=descriptions[_],
            sex=random.choice(SEX_CHOICES),
            breed=random.choice(BREED_CHOICES),
            location=random.choice(DEPARTMENTS),
            lat=str(fake.latitude()),
            long=str(fake.longitude()),
            starting_price=Decimal(str(round(random.uniform(50, 200), 2))),
            weight=Decimal(str(round(random.uniform(50, 200), 2))),
            traceability=fake.boolean(),
            lot=fake.boolean(),
            post_type=random.choice(POST_CHOICES),
            video_url=fake.url(),
            is_approved=fake.boolean(),
            is_active=fake.boolean(),
        )
        image_filename = random.choice(images)
        image_path = os.path.join(images_folder, image_filename)
        
        # Abrir la imagen y asociarla al PostImage
        with open(image_path, 'rb') as img_file:
            post_image = PostImage.objects.create(post=post)
            post_image.image.save(image_filename, File(img_file))
        print(f"Post creado: {post.title}")

def populate_traceabilities(n=20):
    """ Crea registros de trazabilidad falsos. """
    posts = list(Post.objects.all()[:10])
    categories = list(Category.objects.all())
    vaccines = list(Vaccine.objects.all())

    for _ in range(n):
        traceability = Traceability.objects.create(
            post=random.choice(posts),
            chapa_code=fake.unique.word(),
            health_status=fake.paragraph(),
            breed_M=random.choice(BREED_CHOICES),
            breed_P=random.choice(BREED_CHOICES),
            comments=fake.sentence()
        )
        traceability.category.add(*random.sample(categories, k=min(2, len(categories))))
        traceability.vaccines.add(*random.sample(vaccines, k=min(2, len(vaccines))))
        dairy_cow_data = DairyCowData.objects.create(
            traceability=traceability,
            daily_milk_production_in_liters=fake.random_int(min=0, max=50),
            days_in_milk=fake.random_int(min=0, max=365),
        )
        reproductive_data = ReproductiveData.objects.create(
            traceability=traceability,
            birth_date=fake.date_between(start_date='-5y', end_date='today'),
            last_calving=fake.date_between(start_date='-5y', end_date='today'),
            beeding_date=fake.date_between(start_date='-5y', end_date='today'),
            last_heat_date=fake.date_between(start_date='-1y', end_date='today'),
            days_pregnant=fake.random_int(min=0, max=280),
            expected_calving_date=fake.date_between(start_date='today', end_date='+280d'),
            milk_production_in_liters=fake.random_int(min=0, max=50),
        )
        print(f"Trazabilidad creada: {traceability.chapa_code}")

def populate_auctions(n=10):
    """ Crea subastas falsas. """
    posts = Post.objects.filter(post_type="Auction")
    for post in posts:
        auction = Auction.objects.create(
            post=post,
            end_date=fake.date_time_between(start_date="+1d", end_date="+30d")
        )
        print(f"Subasta creada para el post: {post.title}")

def populate_bids(n=50):
    """ Crea ofertas falsas. """
    auctions = Auction.objects.all()
    for _ in range(n):
        auction = random.choice(auctions)
        amount = Decimal(random.uniform(float(auction.get_highest_bid() or 100), 2000)).quantize(Decimal("0.00"))
        bid = Bid.objects.create(
            auction=auction,
            amount=amount
        )
        print(f"Oferta creada: {bid.amount} para subasta {auction.post.title}")

# def populate_reproductive_data(n=10):
#     """ Crea datos reproductivos falsos. """
#     posts = [ post for post in Post.objects.all() if post.traceability ]
#     for _ in range(n):
#         reproductive_data = ReproductiveData.objects.create(
#             post=random.choice(posts),
#             birth_date=fake.date_of_birth(minimum_age=1, maximum_age=10),
#             is_pregnant=fake.boolean(),
#             last_delivery_date=fake.date_this_decade(),
#             estimated_delivery_date=fake.future_date(end_date="+100d"),
#             has_died=fake.boolean()
#         )
#         print(f"Datos reproductivos creados para el post: {reproductive_data.post.title}")

# def populate_dairy_cow_data(n=10):
#     """ Crea datos de vacas lecheras falsos. """
#     posts = [ post for post in Post.objects.all() if post.traceability ]
#     for _ in range(n):
#         dairy_cow_data = DairyCowData.objects.create(
#             post=random.choice(posts),
#             average_daily_milk=round(random.uniform(5.0, 30.0), 2),
#             last_milk_production=fake.date_this_month(),
#             last_mastitis=fake.date_this_year(),
#             has_mastitis=fake.boolean(),
#             is_lactating=fake.boolean()
#         )
#         print(f"Datos de vaca lechera creados para el post: {dairy_cow_data.post.title}")

# Ejecuta las funciones de poblamiento
if __name__ == "__main__":
    print("Poblando la base de datos con datos falsos...")
    populate_users(5)
    populate_categories(5)
    populate_vaccines(5)
    populate_posts(20)
    populate_traceabilities(10)
    populate_auctions(6)
    populate_bids(50)
    print("¡Base de datos poblada exitosamente!")