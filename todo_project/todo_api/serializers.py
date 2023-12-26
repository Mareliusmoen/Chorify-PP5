from rest_framework import serializers
from .models import ShoppingList
from .models import ToDoList
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password']

    def create(self, validated_data):
        """
        Creates a new user instance using the validated data provided.

        :param validated_data: A dictionary containing the user's email and
        password.
        :return: A new User object instance.
        """
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
        """
        Creates a ShoppingList instance from validated data. If 'user'
        is present in the data, it is set separately. The instance is
        saved to the database and then returned.

        Parameters
        ----------
        validated_data : dict
            The data to use for creating the ShoppingList, with an
            optional 'user' key.

        Returns
        -------
        ShoppingList
            The newly created ShoppingList instance with 'user' set
            and saved to the database.
        """
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
        """
        Update the attributes of a given instance with the provided validated
        data. If specific fields are not provided in the validated_data, it
        retains the existing values. After updating, it saves the instance to
        the database.

        Parameters:
        - instance: The object instance to be updated.
        - validated_data: A dictionary of data to update the instance with.

        Returns:
        The updated instance after saving it to the database.
        """
        instance.name = validated_data.get('name', instance.name)
        instance.items = validated_data.get('items', instance.items)
        instance.save()
        return instance


class ToDoListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ToDoList
        fields = ['id', 'description', 'done', 'due_date', 'user']

    def create(self, validated_data):
        """
        Creates a new ToDoList instance using the provided validated_data.
        
        The function checks if user data is provided within the validated_data,
        and if so, associates the user with the new ToDoList instance before
        saving it to the database.
        
        Parameters:
        - validated_data (dict): Data to create a ToDoList instance, possibly
        containing 'user' key with user-specific data.
        
        Returns:
        - ToDoList: A newly created ToDoList instance with or without an
        associated user.
        """
        user_data = validated_data.pop('user', None)
        todo_list = ToDoList(**validated_data)

        if user_data:
            todo_list.user = user_data

        todo_list.save()
        return todo_list

    def update(self, instance, validated_data):
        """
        Update the attributes of an instance with validated_data.
        
        This method accepts an instance and a dictionary of validated
        data. It updates the instance's description, done status, and
        due date with the new values provided in validated_data. If no
        new value is provided for a field, the existing value is kept.
        After updating, it saves the instance to the database.
        
        Parameters:
        instance: The object instance to update.
        validated_data: A dict containing updatable fields.

        Returns:
        The updated instance after saving it to the database.
        """
        instance.description = validated_data.get('description', instance.description)
        instance.done = validated_data.get('done', instance.done)
        instance.due_date = validated_data.get('due_date', instance.due_date)
        instance.save()
        return instance