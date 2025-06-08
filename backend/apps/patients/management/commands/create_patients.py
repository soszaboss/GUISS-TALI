from django.core.management.base import BaseCommand, CommandError
from django.utils.translation import gettext_lazy as _


from tests.unit.patients.factories import VehiculeFactory


class Command(BaseCommand):
    help = 'Creates a patient for testing purposes'
    def add_arguments(self, parser):
        parser.add_argument(
            '-c',
            '--count',
            type=int,
            help='Number of patient(s) to create',
        )

    def handle(self, *args, **options):
        count = options['count']

        if not count:
            raise CommandError(_('Please specify a number of patient(s) to create'))
        else:
            count = int(count)

        for i in range(count):
            patient = VehiculeFactory()
            patient.save()
        print('Successfully created {} patients'.format(count))