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
        user = self.context['request'].user
        shopping_list = ShoppingList(user=user, **validated_data)
        shopping_list.save()
        return shopping_list

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)

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
