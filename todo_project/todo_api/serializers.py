from rest_framework import serializers
from .models import User, ShoppingList
import json

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'is_active', 'is_admin']


class ShoppingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingList
        fields = ['id', 'name', 'items']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        return ret

    def to_internal_value(self, data):
        internal_value = super().to_internal_value(data)
        items_list = data.get('items', [])
        internal_value['items'] = items_list
        return internal_value

    def create(self, validated_data):
        shopping_list = ShoppingList.objects.create(**validated_data)
        return shopping_list

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.items = validated_data.get('items', instance.items)
        instance.save()
        return instance