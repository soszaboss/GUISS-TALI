# Generated by Django 5.2 on 2025-05-16 17:37

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clinical_examen', '0008_alter_biomicroscopy_segment_anterieur_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='biomicroscopy',
            name='segment_anterieur',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='clinical_examen.segmentanterieur', verbose_name='Segment antérieur'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='biomicroscopy',
            name='segment_posterieur',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='clinical_examen.segmentposterieur', verbose_name='Segment postérieur'),
            preserve_default=False,
        ),
    ]
