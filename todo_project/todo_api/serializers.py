from rest_framework import serializers
from .models import User, ShoppingList
import json

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
        fields = ['id', 'name', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        shopping_list = ShoppingList.objects.create(**validated_data)

        # Assuming items_data is a list of dictionaries containing item details
        shopping_list.items = items_data
        shopping_list.save()

        return shopping_list

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.items = validated_data.get('items', instance.items)
        instance.save()

        return instance