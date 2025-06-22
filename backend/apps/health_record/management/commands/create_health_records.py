from django.core.management.base import BaseCommand, CommandError
from django.utils.translation import gettext_lazy as _
from django.db import transaction

from factories.health_record import HealthRecordFactory


class Command(BaseCommand):
    help = 'Creates a health record for testing purposes'
    def add_arguments(self, parser):
        parser.add_argument(
            '-c',
            '--count',
            type=int,
            help='Number of record(s) to create',
        )

    def handle(self, *args, **options):
        count = options['count']

        if not count:
            raise CommandError(_('Please specify a number of record(s) to create'))
        else:
            count = int(count)

        for i in range(count):
            with transaction.atomic():
                health_record = HealthRecordFactory()
                health_record.save()
