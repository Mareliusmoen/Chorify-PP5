# Generated by Django 5.0 on 2023-12-15 08:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo_api', '0002_shoppinglist_item'),
    ]

    operations = [
        migrations.AddField(
            model_name='shoppinglist',
            name='items',
            field=models.TextField(blank=True, default='[]'),
        ),
        migrations.DeleteModel(
            name='Item',
        ),
    ]
