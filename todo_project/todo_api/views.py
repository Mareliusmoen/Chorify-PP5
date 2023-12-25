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
from .models import ToDoList
from .serializers import ToDoListSerializer


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
    # Require authentication for the list and create views
    permission_classes = [permissions.IsAuthenticated]


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # Require authentication for the detail, update, and destroy views
    permission_classes = [permissions.IsAuthenticated]


class ShoppingListView(generics.ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ShoppingListSerializer

    def get_queryset(self):
        user = self.request.user
        return ShoppingList.objects.filter(user=user)

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            print(f"Error in perform_create: {e}")
            raise

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = ShoppingListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK, content_type='application/json')


class ShoppingListDetailView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = ShoppingList.objects.all()
    serializer_class = ShoppingListSerializer

    def perform_update(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            print(f"Error in perform_update: {e}")
            raise

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = ShoppingListSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK, content_type='application/json')


class ToDoListView(generics.ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ToDoListSerializer

    def get_queryset(self):
        user = self.request.user
        return ToDoList.objects.filter(user=user)

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            print(f"Error in perform_create: {e}")
            raise

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = ToDoListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK, content_type='application/json')


class ToDoListDetailView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = ToDoList.objects.all()
    serializer_class = ToDoListSerializer

    def perform_update(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            print(f"Error in perform_update: {e}")
            raise

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = ToDoListSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK, content_type='application/json')
