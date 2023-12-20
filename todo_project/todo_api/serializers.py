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
        fields = ['id', 'name', 'user_id', 'items']

    def perform_create(self, serializer):
        user_id = self.context['request'].user.id if self.context['request'].user.is_authenticated else None
        serializer.save(user_id=user_id)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.user_id = validated_data.get('user_id', instance.user_id)

        # Handle items update
        items_data = validated_data.get('items', [])
        instance.items.clear()  # Remove existing items

        for item_data in items_data:
            item, created = instance.items.get_or_create(item=item_data['item'], defaults={'quantity': item_data['quantity']})
            if not created:
                item.quantity = item_data['quantity']
                item.save()

        instance.save()
        return instance