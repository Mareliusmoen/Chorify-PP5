from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from django.contrib.auth.models import User
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
        """
        Handles POST requests by creating a new resource instance 
        using the provided request data. It validates the data, 
        creates the resource, then returns the resource data and
        the HTTP 201 Created status. It also sets the headers for
        the success response.

        Parameters:
        - request: The HTTP request object containing the data.
        - *args: Variable length argument list.
        - **kwargs: Arbitrary keyword arguments.

        Returns:
        - Response object with the created resource data and the
        HTTP 201 Created status, along with success headers.
        """
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
        """
        Retrieves the queryset of ShoppingList objects filtered by the
        current user.

        This function takes no parameters but uses the `self.request.user`
        to filter the ShoppingList objects.

        Returns:
            QuerySet: A QuerySet containing all ShoppingList objects
                      associated with the current user.
        """
        user = self.request.user
        return ShoppingList.objects.filter(user=user)

    def perform_create(self, serializer):
        """
        Attempts to create a resource using the provided serializer and
        associates it with the current user. If an error occurs during
        the save operation, it prints the error and re-raises the
        exception.

        :param serializer: The serializer instance that is used to
                           create the resource.
        :raises: Re-raises any exception that serializer.save() may
                 encounter.
        """
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            print(f"Error in perform_create: {e}")
            raise

    def list(self, request, *args, **kwargs):
        """
        Retrieves a list of shopping items by querying the database, 
        serializes the data, and returns it in a JSON formatted 
        HTTP response with status 200 OK.

        Parameters:
        request - The HTTP request object.
        *args - Variable length argument list.
        **kwargs - Arbitrary keyword arguments.

        Returns:
        Response - The serialized data in JSON format with a 200 OK 
        status.
        """
        queryset = self.get_queryset()
        serializer = ShoppingListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK, content_type='application/json')


class ShoppingListDetailView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = ShoppingList.objects.all()
    serializer_class = ShoppingListSerializer

    def perform_update(self, serializer):
        """
        Attempts to save updates made to a serialized object, 
        associating it with the current user. If an error occurs 
        during save, it prints the error message and re-raises 
        the exception.

        Parameters:
        serializer (Serializer): The serializer instance 
                                 containing update data.

        Returns:
        None
        """
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            print(f"Error in perform_update: {e}")
            raise

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a specific object by processing a GET request, serialize
        the object, and return the serialized data in JSON format with a
        200 OK HTTP status.

        Parameters:
        - request: The HTTP request object.
        - *args: Variable length argument list.
        - **kwargs: Arbitrary keyword arguments.

        Returns:
        - Response object containing serialized data and HTTP status.
        """
        instance = self.get_object()
        serializer = ShoppingListSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK, content_type='application/json')


class ToDoListView(generics.ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ToDoListSerializer

    def get_queryset(self):
        """
        Retrieves the queryset of ToDoList objects that are
        associated with the currently logged-in user.
        
        Returns:
            QuerySet: A Django QuerySet containing ToDoList
            objects filtered by the current user.
        """
        user = self.request.user
        return ToDoList.objects.filter(user=user)

    def perform_create(self, serializer):
        """
        Attempts to save the provided serializer with the user from the
        current request. If an exception occurs, it prints an error message and
        raises the exception.

        Parameters:
        - serializer: The serializer instance to be saved.

        Returns:
        None

        Raises:
        - Exception: if the save operation fails.
        """
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            print(f"Error in perform_create: {e}")
            raise

    def list(self, request, *args, **kwargs):
        """
        Handles GET requests for listing all ToDo items. It retrieves
        the queryset via `get_queryset`, serializes the queryset, and
        returns an HTTP 200 OK response with the serialized data in
        JSON format.

        Parameters:
        - request: The HTTP request object.
        - *args: Variable length argument list.
        - **kwargs: Arbitrary keyword arguments.

        Returns:
        - Response object with serialized data and HTTP 200 OK status.
        """
        queryset = self.get_queryset()
        serializer = ToDoListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK, content_type='application/json')


class ToDoListDetailView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = ToDoList.objects.all()
    serializer_class = ToDoListSerializer

    def perform_update(self, serializer):
        """
        Attempts to save updated data via serializer with the user from the
        request context. If an error occurs, it prints the error message and
        re-raises the exception.
        
        :param serializer: The serializer instance that contains validated data
        :type serializer: Serializer
        
        :raises Exception: Propagates any exceptions raised by serializer.save
        """
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            print(f"Error in perform_update: {e}")
            raise

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieves a single instance of a ToDoList based on the provided
        request parameters, serializes the data, and returns it with an
        HTTP 200 OK status in JSON format.

        Args:
            request: The HTTP request object.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: An instance of Response containing the serialized
            data and an HTTP 200 OK status.
        """
        instance = self.get_object()
        serializer = ToDoListSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK, content_type='application/json')
