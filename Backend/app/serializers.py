from rest_framework import serializers
from .models import Post, Traceability, DairyCowData, ReproductiveData, PostImage
from rest_framework.exceptions import ValidationError

class TraceabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Traceability
        fields = ['chapa_code', 'breed_M', 'breed_P', 'category', 'health_status', 'vaccines', 'comments']

class DairyCowDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = DairyCowData
        fields = ['daily_milk_production_in_liters', 'days_in_milk']

class ReproductiveDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReproductiveData
        fields = ['birth_date', 'last_calving', 'beeding_date', 'last_heat_date', 'days_pregnant', 'expected_calving_date', 'milk_production_in_liters']

class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['image']

class PostSerializer(serializers.ModelSerializer):
    traceability_data = TraceabilitySerializer(required=False)
    dairy_cow_data = DairyCowDataSerializer(required=False)
    reproductive_data = ReproductiveDataSerializer(required=False)
    images = PostImageSerializer(many=True, required=False)
    user_id = serializers.IntegerField(source='user.id', read_only=True)


    class Meta:
        model = Post
        exclude = ['user']

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        traceability_data = validated_data.pop('traceability_data', None)
        dairy_cow_data = validated_data.pop('dairy_cow_data', None)
        reproductive_data = validated_data.pop('reproductive_data', None)

        if len(image_data) > 9:
            raise ValidationError({"images": "El máximo de imágenes es de 9."})

        for image_data in images_data:
            PostImage.objects.create(post=post, **image_data)

        validated_data['user'] = self.context['request'].user
        post = Post.objects.create(**validated_data)
       
        if validated_data.get('traceability') and not traceability_data:
            raise ValidationError({"traceability_data": "Se requiere información de trazabilidad cuando 'traceability' es True."})
    
        
        if not dairy_cow_data or not reproductive_data:
            raise ValidationError({"data_missing": "Se requiere información reproductiva y lechera."})


        if traceability_data and post.traceability:
            
            traceability = Traceability.objects.create(
                chapa_code = traceability_data['chapa_code'],
                breed_M = traceability_data['breed_M'],
                breed_P = traceability_data['breed_P'],
                health_status = traceability_data['health_status'],
                comments = traceability_data['comments'],
                post=post,
            )

            traceability.category.set(traceability_data['category'])
            traceability.vaccines.set(traceability_data['vaccines'])

            traceability.save()

            if dairy_cow_data:
                DairyCowData.objects.create(traceability=traceability, **dairy_cow_data)
            if reproductive_data:
                ReproductiveData.objects.create(traceability=traceability, **reproductive_data)
        
        return post
