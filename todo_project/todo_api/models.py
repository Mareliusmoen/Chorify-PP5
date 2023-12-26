from django.db import models
from django.db.models import JSONField
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import User
from django.conf import settings

class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        """
        Creates a new user with the provided email and an optional password.

        Parameters:
        - email: A string representing the user's email address. Must be provided.
        - password: An optional string for the user's password. If not provided,
          no password will be set.

        Raises:
        - ValueError: If the email parameter is empty.

        Returns:
        The newly created user object.
        """
        if not email:
            raise ValueError('Users must have an email address')
        
        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        """
        Create a new superuser with the specified email and password.
        
        Parameters:
        email (str): The email address for the new superuser.
        password (str): The password for the new superuser.

        Returns:
        User: The newly created superuser instance.
        """
        user = self.create_user(email, password=password)
        user.is_admin = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    email = models.EmailField(verbose_name='email address', max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin


class ShoppingList(models.Model):
    name = models.CharField(max_length=100)
    items = JSONField(default=list)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class ToDoList(models.Model):
    description = models.TextField()
    done = models.BooleanField(default=False)
    due_date = models.DateField(null=True, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.description