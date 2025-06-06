from django.core.management.base import BaseCommand, CommandError
from django.utils.translation import gettext_lazy as _


from tests.unit.users.factories import ProfileFactory


class Command(BaseCommand):
    help = 'Creates users'
    def add_arguments(self, parser):
        parser.add_argument(
            '-c',
            '--count',
            type=int,
            help='Number of user(s) to create',
        )

    def handle(self, *args, **options):
        count = options['count']

        if not count:
            raise CommandError(_('Please specify a number of users to create'))
        else:
            count = int(count)

        for i in range(count):
            user = ProfileFactory()
            user.save()
        print('Successfully created {} users'.format(count))