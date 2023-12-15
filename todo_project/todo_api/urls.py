from django.urls import path
from .views import UserList, UserDetail, ShoppingListView, ShoppingListDetailView

urlpatterns = [
    # User management
    path('users/', UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('shopping-lists/', ShoppingListView.as_view(), name='shopping-list'),
    path('shopping-lists/<int:pk>/', ShoppingListDetailView.as_view(), name='shopping-list-detail'),
]