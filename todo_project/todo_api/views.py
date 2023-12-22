from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from django.contrib.auth.models import User  # Import the default User model
from .models import ShoppingList
from .serializers import UserSerializer, ShoppingListSerializer, UserRegistrationSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]  # Require authentication for the list and create views


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]  # Require authentication for the detail, update, and destroy views


class ShoppingListView(generics.ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ShoppingListSerializer

    def get_queryset(self):
        # Use the authenticated user from the request
        user = self.request.user
        # Filter shopping lists based on the authenticated user
        return ShoppingList.objects.filter(user=user)

    def perform_create(self, serializer):
        try:
            # Use self.request.user directly as the authenticated user has already been determined
            serializer.save(user=self.request.user)
        except Exception as e:
            print(f"Error in perform_create: {e}")
            raise

class ShoppingListDetailView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = ShoppingList.objects.all()
    serializer_class = ShoppingListSerializer
