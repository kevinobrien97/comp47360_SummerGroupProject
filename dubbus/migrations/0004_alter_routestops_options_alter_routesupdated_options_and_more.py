# Generated by Django 4.0.5 on 2022-08-06 10:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dubbus', '0003_alter_stoptimesupdated_options_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='routestops',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='routesupdated',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='stops',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='stoptimesupdated',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='weather',
            options={'managed': False},
        ),
    ]