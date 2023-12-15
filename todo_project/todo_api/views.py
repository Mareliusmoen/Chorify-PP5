from django.shortcuts import render
from rest_framework import generics
from .models import User, ShoppingList
from .serializers import UserSerializer, ShoppingListSerializer


# User views
class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# Shoppinglist and shoppingitems views
class ShoppingListView(generics.ListCreateAPIView):
    queryset = ShoppingList.objects.all()
    serializer_class = ShoppingListSerializer

class ShoppingListDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ShoppingList.objects.all()
    serializer_class = ShoppingListSerializer
