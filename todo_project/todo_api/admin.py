from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User
from django.contrib import admin
from .models import ShoppingList

class ShoppingListAdmin(admin.ModelAdmin):
    list_display = ('name', 'user') 
    search_fields = ('name', 'user__email')
    list_filter = ('user',)
admin.site.register(ShoppingList, ShoppingListAdmin)


class CustomUserAdmin(BaseUserAdmin):
    ordering = ['id']
    list_display = ['email', 'is_active', 'is_admin']
    search_fields = ['email']
    list_filter = ['is_active', 'is_admin']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Permissions'), {'fields': ('is_active', 'is_admin')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_active', 'is_admin'),
        }),
    )

    filter_horizontal = ()

admin.site.register(User, CustomUserAdmin)
