# Generated by Django 4.1.13 on 2024-01-26 04:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('movies_booking', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='booking',
            name='seat_categories',
        ),
        migrations.AddField(
            model_name='booking',
            name='seat_numbers',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AddField(
            model_name='booking',
            name='theater',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='movies_booking.theater'),
        ),
    ]
