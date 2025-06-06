# Generated by Django 5.2 on 2025-04-24 15:46

import django.db.models.deletion
import django_extensions.db.fields
import phonenumber_field.modelfields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Conducteur',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('email', models.EmailField(db_index=True, max_length=254, unique=True, verbose_name='Email')),
                ('first_name', models.CharField(max_length=30, verbose_name='First name')),
                ('last_name', models.CharField(max_length=30, verbose_name='Last name')),
                ('phone_number', phonenumber_field.modelfields.PhoneNumberField(db_index=True, default='SN', max_length=128, region=None, unique=True, verbose_name='Phone number')),
                ('date_naissance', models.DateField(verbose_name='Date of birth')),
                ('sexe', models.CharField(choices=[('Homme', 'Male'), ('Femme', 'Female'), ('Anonyme', 'Anonymous')], default='Homme', max_length=10, verbose_name='Gender')),
                ('numero_permis', models.CharField(db_index=True, max_length=14, unique=True, verbose_name='License number')),
                ('type_permis', models.CharField(choices=[('Léger', 'Light'), ('Lourd', 'Heavy'), ('Autres à préciser', 'Other (please specify)')], verbose_name='License type')),
                ('autre_type_permis', models.CharField(blank=True, max_length=100, null=True, verbose_name='Other license type')),
                ('date_delivrance_permis', models.DateField(verbose_name='License issue date')),
                ('date_peremption_permis', models.DateField(verbose_name='License expiration date')),
                ('transporteur_professionnel', models.BooleanField(choices=[(True, 'Yes'), (False, 'No')], verbose_name='Professional transporter')),
                ('service', models.CharField(choices=[('Public', 'Public'), ('Privé', 'Private'), ('Particulier', 'Individual')], max_length=12, verbose_name='Service')),
                ('type_instruction_suivie', models.CharField(choices=[('Française', 'French'), ('Arabe', 'Arabic')], max_length=15, verbose_name='Instruction type')),
                ('niveau_instruction', models.CharField(choices=[('Primaire', 'Primary'), ('Secondaire', 'Secondary'), ('Supérieure', 'Higher education'), ('Autres', 'Other'), ('Aucune', 'None')], max_length=15, verbose_name='Education level')),
                ('annees_experience', models.PositiveIntegerField(verbose_name='Years of experience')),
                ('image', models.ImageField(default='profils/profile_avatars/avatar.png', null=True, upload_to='profils/conducteurs', verbose_name='Profile picture')),
            ],
            options={
                'verbose_name': 'Driver',
                'verbose_name_plural': 'Drivers',
            },
        ),
        migrations.CreateModel(
            name='Vehicule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('immatriculation', models.CharField(blank=True, max_length=15, null=True, verbose_name='Registration')),
                ('modele', models.CharField(blank=True, max_length=15, null=True, verbose_name='Model')),
                ('annee', models.CharField(blank=True, max_length=15, null=True, verbose_name='Year')),
                ('type_vehicule_conduit', models.CharField(choices=[('Léger', 'Light'), ('Lourd', 'Heavy'), ('Autres', 'Other')], max_length=15, verbose_name='Vehicle type driven')),
                ('autre_type_vehicule_conduit', models.CharField(blank=True, max_length=100, null=True, verbose_name='Other vehicle type')),
                ('conducteur', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='patients.conducteur', verbose_name='Driver')),
            ],
            options={
                'verbose_name': 'Vehicle',
                'verbose_name_plural': 'Vehicles',
            },
        ),
    ]
