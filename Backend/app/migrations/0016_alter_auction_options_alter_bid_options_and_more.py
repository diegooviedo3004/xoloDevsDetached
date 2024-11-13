# Generated by Django 5.1.2 on 2024-11-13 07:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0015_category_vaccine_rename_timestamp_bid_created_at_and_more"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="auction",
            options={"verbose_name": "subasta", "verbose_name_plural": "subastas"},
        ),
        migrations.AlterModelOptions(
            name="bid",
            options={
                "ordering": ["-amount"],
                "verbose_name": "oferta",
                "verbose_name_plural": "ofertas",
            },
        ),
        migrations.AlterModelOptions(
            name="category",
            options={"verbose_name": "categoría", "verbose_name_plural": "categorías"},
        ),
        migrations.AlterModelOptions(
            name="dairycowdata",
            options={
                "verbose_name": "dato de vaca lechera",
                "verbose_name_plural": "datos de vacas lecheras",
            },
        ),
        migrations.AlterModelOptions(
            name="post",
            options={"verbose_name": "anuncio", "verbose_name_plural": "anuncios"},
        ),
        migrations.AlterModelOptions(
            name="postimage",
            options={
                "verbose_name": "imagen del post",
                "verbose_name_plural": "imagenes del post",
            },
        ),
        migrations.AlterModelOptions(
            name="reproductivedata",
            options={
                "verbose_name": "dato reproductivo",
                "verbose_name_plural": "datos reproductivos",
            },
        ),
        migrations.AlterModelOptions(
            name="traceability",
            options={
                "verbose_name": "trazabilidad",
                "verbose_name_plural": "trazabilidades",
            },
        ),
        migrations.AlterModelOptions(
            name="vaccine",
            options={"verbose_name": "vacuna", "verbose_name_plural": "vacunas"},
        ),
        migrations.AlterField(
            model_name="auction",
            name="post",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="auction",
                to="app.post",
            ),
        ),
        migrations.AlterField(
            model_name="post",
            name="location",
            field=models.CharField(max_length=300),
        ),
    ]
