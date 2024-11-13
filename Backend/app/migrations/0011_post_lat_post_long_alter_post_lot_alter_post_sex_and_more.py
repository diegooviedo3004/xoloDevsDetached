# Generated by Django 5.1.2 on 2024-11-09 18:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0010_alter_post_sex'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='lat',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='post',
            name='long',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='lot',
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AlterField(
            model_name='post',
            name='sex',
            field=models.CharField(choices=[('M', 'Macho'), ('F', 'Hembra')], max_length=1),
        ),
        migrations.AlterField(
            model_name='post',
            name='starting_price',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
        migrations.AlterField(
            model_name='post',
            name='traceability',
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AlterField(
            model_name='post',
            name='type',
            field=models.CharField(choices=[('Auction', 'Subasta'), ('Post', 'Publicación')], default='Post', max_length=50),
        ),
        migrations.AlterField(
            model_name='user',
            name='is_superuser',
            field=models.BooleanField(default=False),
        ),
    ]
