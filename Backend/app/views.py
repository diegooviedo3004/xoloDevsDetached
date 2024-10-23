from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .Serializer.userSerializer import RegisterSerializer, LoginSerializer, UserSerializer, CowSerializer
from django.shortcuts import get_object_or_404
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from .models import *
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import permission_classes, authentication_classes
User = get_user_model()

from rest_framework import serializers
from .models import Cow, PhoneNumber

class PhoneNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhoneNumber
        fields = ['number', 'type']

class UserProfileSerializer(serializers.ModelSerializer):
    phone_numbers = PhoneNumberSerializer(many=True, read_only=True)  # Números de teléfono relacionados

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'profile_picture', 'phone_numbers']


# class ProfilePictureUpdateView(APIView):
#     permission_classes = [IsAuthenticated]
#     parser_classes = [MultiPartParser, FormParser]  # Permitir subir archivos

#     @swagger_auto_schema(request_body=ProfilePictureSerializer)
#     def patch(self, request):
#         user = request.user
#         serializer = ProfilePictureSerializer(user, data=request.data, partial=True)
        
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "Foto de perfil actualizada exitosamente"}, status=status.HTTP_200_OK)
        
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(request_body=RegisterSerializer)
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Usuario registrado con éxito"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserProfileView(APIView):
    permission_classes = [AllowAny]  # Desactivamos la autenticación

    @swagger_auto_schema(responses={200: UserProfileSerializer})
    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)  # Busca el usuario o lanza 404 si no existe
        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class LoginView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(request_body=LoginSerializer, responses={200: 'Token de acceso y código de usuario'})
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,
                'status': 200
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# @authentication_classes([JWTAuthentication])
# @permission_classes([IsAuthenticated])
class CreateCowView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [AllowAny]


    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('title', openapi.IN_FORM, description="Nombre de la vaca", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('description', openapi.IN_FORM, description="Descripción de la vaca", type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('age', openapi.IN_FORM, description="Edad de la vaca", type=openapi.TYPE_INTEGER, required=True),
            openapi.Parameter('weight', openapi.IN_FORM, description="Peso de la vaca", type=openapi.TYPE_NUMBER, required=True),
            openapi.Parameter('price', openapi.IN_FORM, description="Precio de la vaca", type=openapi.TYPE_NUMBER, required=True),
            openapi.Parameter('active', openapi.IN_FORM, description="Estado activo de la vaca", type=openapi.TYPE_BOOLEAN, required=False),
            openapi.Parameter('vaccinated', openapi.IN_FORM, description="¿Vaca vacunada?", type=openapi.TYPE_BOOLEAN, required=False),
            openapi.Parameter('for_sale', openapi.IN_FORM, description="¿Vaca en venta?", type=openapi.TYPE_BOOLEAN, required=False),
            openapi.Parameter('birth_date', openapi.IN_FORM, description="Fecha de nacimiento", type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, required=False),
            openapi.Parameter('last_parturition_date', openapi.IN_FORM, description="Fecha del último parto", type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, required=False),
            openapi.Parameter('expected_parturition_date', openapi.IN_FORM, description="Fecha esperada de parto", type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, required=False),
            openapi.Parameter('last_heat_date', openapi.IN_FORM, description="Fecha del último celo", type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, required=False),
            openapi.Parameter('pregnancy_date', openapi.IN_FORM, description="Fecha de preñez", type=openapi.TYPE_STRING, format=openapi.FORMAT_DATE, required=False),
            openapi.Parameter('days_of_pregnancy', openapi.IN_FORM, description="Días de preñez", type=openapi.TYPE_INTEGER, required=False),
            openapi.Parameter('milk_production', openapi.IN_FORM, description="Producción de leche", type=openapi.TYPE_NUMBER, required=False),
            openapi.Parameter('days_of_lactation', openapi.IN_FORM, description="Días de lactancia", type=openapi.TYPE_INTEGER, required=False),
            openapi.Parameter('brucellosis_application', openapi.IN_FORM, description="¿Aplicación de brucelosis?", type=openapi.TYPE_BOOLEAN, required=False),
            openapi.Parameter('mother', openapi.IN_FORM, description="ID de la madre", type=openapi.TYPE_INTEGER, required=False),
            openapi.Parameter('father', openapi.IN_FORM, description="Nombre del padre", type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('comments', openapi.IN_FORM, description="Comentarios adicionales", type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('breeds', openapi.IN_FORM, description="Razas de la vaca", type=openapi.TYPE_STRING, multiple=True, required=False),
            openapi.Parameter('traits', openapi.IN_FORM, description="Características de la raza", type=openapi.TYPE_STRING, multiple=True, required=False),
            openapi.Parameter('images', openapi.IN_FORM, description="Imágenes de la vaca", type=openapi.TYPE_FILE, multiple=True, required=False),
        ],
        responses={201: 'Vaca creada con éxito'},
        consumes=["multipart/form-data"]
    )
    def post(self, request):
        # Obtener el usuario autenticado
        user = request.user

        if user.is_anonymous:
            return Response({"detail": "Usuario no autenticado."}, status=status.HTTP_401_UNAUTHORIZED)

        # Procesar el serializador
        serializer = CowSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            # Extraer los datos validados y agregar el usuario manualmente
            cow_data = serializer.validated_data
            cow = Cow.objects.create(user=user, **cow_data)  # Crear la vaca

            # Manejo de razas y características
            breeds = request.data.getlist('breeds', [])
            if breeds:
                life_record = cow.life_record
                for breed_name in breeds:
                    breed, created = CowBreed.objects.get_or_create(breed_name=breed_name)
                    CowBreedDetails.objects.create(life_record=life_record, breed=breed)
            print(f"Archivos recibidos: {request.FILES}")

            # Manejo de imágenes
            images = request.FILES.getlist('images', [])  # Obtener las imágenes
            # Imprimir las imágenes recibidas para depuración
            print(f"Imágenes recibidas: {images}")
            for image in images:
                CowImage.objects.create(cow=cow, image_url=image)  # Cloudinary subirá la imagen automáticamente

            # Devolver la respuesta exitosa
            return Response({
                'message': 'Vaca creada con éxito',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)

        # Responder con errores de validación
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)