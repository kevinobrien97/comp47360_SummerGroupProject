# Generated by Django 4.0.5 on 2022-08-06 08:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dubbus', '0002_alter_routestops_options_alter_routesupdated_options_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='stoptimesupdated',
            options={'managed': True},
        ),
        migrations.AlterUniqueTogether(
            name='routestops',
            unique_together={('route_short_name', 'trip_headsign', 'stop_id')},
        ),
        migrations.AlterUniqueTogether(
            name='routesupdated',
            unique_together={('trip_headsign', 'route_short_name')},
        ),
        migrations.AlterUniqueTogether(
            name='stoptimesupdated',
            unique_together={('stop_id', 'trip_id')},
        ),
    ]
