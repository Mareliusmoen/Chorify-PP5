from django.urls import path
from . import views

urlpatterns = [
    # User management
    path('users/', views.UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetail.as_view(), name='user-detail'),
    # Add other URL patterns for your todo_api app here
]