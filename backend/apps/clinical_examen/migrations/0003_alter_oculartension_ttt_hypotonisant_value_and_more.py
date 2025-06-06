# Generated by Django 5.2 on 2025-05-15 18:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clinical_examen', '0002_alter_oculartension_ttt_hypotonisant_value_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='oculartension',
            name='ttt_hypotonisant_value',
            field=models.CharField(choices=[('BBLOQUANTS', 'BBLOQUANTS'), ('IAC', 'IAC'), ('PROSTAGLANDINES', 'PROSTAGLANDINES'), ('PILOCARPINE', 'PILOCARPINE'), ('AUTRES', 'AUTRES')], default=None, max_length=30, null=True, verbose_name='TTT hypotonisant value'),
        ),
        migrations.AlterField(
            model_name='plaintes',
            name='diplopie_type',
            field=models.CharField(choices=[('monoculaire', 'Monoculaire'), ('binoculaire', 'Binoculaire')], default=None, max_length=20, null=True, verbose_name='Diplopie type'),
        ),
        migrations.AlterField(
            model_name='plaintes',
            name='nystagmus_eye',
            field=models.CharField(choices=[('od', 'OD'), ('og', 'OG'), ('odg', 'ODG')], default=None, max_length=20, null=True, verbose_name='Œil affecté par nystagmus'),
        ),
        migrations.AlterField(
            model_name='plaintes',
            name='ptosis_eye',
            field=models.CharField(choices=[('od', 'OD'), ('og', 'OG'), ('odg', 'ODG')], default=None, max_length=20, null=True, verbose_name='Œil affecté par ptosis'),
        ),
        migrations.AlterField(
            model_name='plaintes',
            name='strabisme_eye',
            field=models.CharField(choices=[('od', 'OD'), ('og', 'OG'), ('odg', 'ODG')], default=None, max_length=20, null=True, verbose_name='Œil affecté par strabisme'),
        ),
    ]
