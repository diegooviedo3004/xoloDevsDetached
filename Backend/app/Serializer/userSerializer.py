from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import Cow, CowImage, CowLifeRecord, CowBreedDetails, CowBreed

User = get_user_model()


# Modificar el serializador de registro para incluir los números de teléfono
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2', 'first_name', 'last_name']
        extra_kwargs = {
            'first_name': {'required': False, 'allow_null': True},
            'last_name': {'required': False, 'allow_null': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')

        user = User.objects.create(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        user.set_password(validated_data['password'])
        user.save()

    

        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = User.objects.filter(email=data['email']).first()
        if user and user.check_password(data['password']):
            return user
        raise serializers.ValidationError("Credenciales inválidas.")

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name')



# serializador de ganado 
class CowImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CowImage
        fields = ['image_url']

class CowBreedDetailsSerializer(serializers.ModelSerializer):
    breed_name = serializers.CharField(source='breed.breed_name')

    class Meta:
        model = CowBreedDetails
        fields = ['breed_name', 'trait']

class CowLifeRecordSerializer(serializers.ModelSerializer):
    breeds = CowBreedDetailsSerializer(many=True, required=False)
    
    class Meta:
        model = CowLifeRecord
        fields = [
            'active', 'vaccinated', 'for_sale', 
            'birth_date', 'last_parturition_date', 'expected_parturition_date', 
            'last_heat_date', 'pregnancy_date', 'days_of_pregnancy',
            'milk_production', 'days_of_lactation', 'milk_control',
            'brucellosis_application', 'mother', 'father', 'comments', 'breeds'
        ]

class CowSerializer(serializers.ModelSerializer):
    images = CowImageSerializer(many=True, required=False)
    life_record = CowLifeRecordSerializer(required=False)

    class Meta:
        model = Cow
        fields = ['title', 'description', 'age', 'weight', 'price', 'images', 'life_record']

    def create(self, validated_data):
        life_record_data = validated_data.pop('life_record', None)
        images_data = validated_data.pop('images', [])
        user = self.context['request'].user  # Obtener el usuario del contexto de la solicitud
        cow = Cow.objects.create(user=user, **validated_data)
        
        if life_record_data:
            breeds_data = life_record_data.pop('breeds', [])
            life_record = CowLifeRecord.objects.create(cow=cow, **life_record_data)
            
            for breed_data in breeds_data:
                breed_name = breed_data.pop('breed_name')
                breed, created = CowBreed.objects.get_or_create(breed_name=breed_name)
                CowBreedDetails.objects.create(life_record=life_record, breed=breed, **breed_data)

        for image_data in images_data:
            CowImage.objects.create(cow=cow, **image_data)
        
        return cow