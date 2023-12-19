from rest_framework import serializers
from .models import User, ShoppingList
from django.contrib.auth import get_user_model
import json

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
        fields = ['id', 'email', 'is_active', 'is_admin']

class ShoppingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingList
        fields = ['id', 'name', 'items', 'user']
        read_only_fields = ['user']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        shopping_list = ShoppingList.objects.create(**validated_data, user=user_data)
        return shopping_list

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.items = validated_data.get('items', instance.items)
        instance.user = validated_data.get('user', instance.user)
        instance.save()
        return instance