# Generated by Django 5.1.2 on 2024-11-09 19:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0012_alter_post_sex'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='phone_number',
            field=models.CharField(max_length=8, null=True),
        ),
    ]