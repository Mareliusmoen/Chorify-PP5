from django.urls import path
from .views import UserList, UserDetail, ShoppingListView, ShoppingListDetailView, ToDoListView, ToDoListDetailView

urlpatterns = [
    # User management
    path('users/', UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    
    # Shopping lists
    path('shopping-lists/', ShoppingListView.as_view(), name='shopping-list'),
    path('shopping-lists/<int:pk>/', ShoppingListDetailView.as_view(), name='shopping-list-detail'),

    # ToDo lists
    path('todo-lists/', ToDoListView.as_view(), name='todo-list'),
    path('todo-lists/<int:pk>/', ToDoListDetailView.as_view(), name='todo-list-detail'),
]
