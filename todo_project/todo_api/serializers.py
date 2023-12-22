from rest_framework import serializers
from .models import ShoppingList
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'is_active', 'is_staff']

class ShoppingListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Change PrimaryKeyRelatedField to UserSerializer

    class Meta:
        model = ShoppingList
        fields = ['id', 'name', 'user', 'items']

    def create(self, validated_data):
        # Remove 'user' from validated_data if present
        user_data = validated_data.pop('user', None)

        # Create the ShoppingList object without 'user'
        shopping_list = ShoppingList(**validated_data)

        # If 'user' data is available, set it separately
        if user_data:
            shopping_list.user = user_data

        # Save the instance to the database
        shopping_list.save()

        return shopping_list

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.items = validated_data.get('items', instance.items)
        instance.save()
        return instance