from rest_framework import serializers
from .models import Post, PostImage

class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'image']

class PostsByUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()  # Use SerializerMethodField to fetch images

    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ['user']  # Ensures 'user' is read-only

    def get_images(self, instance):
        # This method retrieves related images and serializes them
        images = instance.images.all()
        return PostImageSerializer(images, many=True).data

    def create(self, validated_data):
        images_data = self.context['request'].FILES.getlist('images')  # Fetch images from request files
        post = Post.objects.create(user=self.context['request'].user, **validated_data)

        # Create related PostImage objects if images are provided
        for image in images_data:
            PostImage.objects.create(post=post, image=image)
            
        return post

    def update(self, instance, validated_data):
        images_data = self.context['request'].FILES.getlist('images')  # Fetch images from request files

        # Update post fields
        instance = super().update(instance, validated_data)

        # Update images if new ones are provided
        if images_data:
            # Delete old images
            instance.images.all().delete()
            # Add new images
            for image in images_data:
                PostImage.objects.create(post=instance, image=image)

        return instance
