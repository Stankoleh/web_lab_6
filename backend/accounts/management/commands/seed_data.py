from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from playlists.models import Playlist, Track

class Command(BaseCommand):
    help = 'Create demo users and playlists'

    def handle(self, *args, **kwargs):
        if User.objects.filter(username='admin').exists():
            self.stdout.write(self.style.WARNING('Seed data already exists'))
            return

        admin = User.objects.create_user(username='admin', password='admin123', is_staff=True, is_superuser=True)
        anna = User.objects.create_user(username='anna', password='anna123')
        User.objects.create_user(username='mark', password='mark123')

        Token.objects.get_or_create(user=admin)
        Token.objects.get_or_create(user=anna)

        focus = Playlist.objects.create(
            name='Focus Mix',
            description='Playlist for concentration and study.',
            is_public=True,
            owner=admin
        )
        private = Playlist.objects.create(
            name='Anna Private Collection',
            description='Visible only to Anna.',
            is_public=False,
            owner=anna
        )

        Track.objects.create(playlist=focus, title='Time', artist='Hans Zimmer', url='')
        Track.objects.create(playlist=focus, title='Experience', artist='Ludovico Einaudi', url='')
        Track.objects.create(playlist=private, title='Numb', artist='Linkin Park', url='')

        self.stdout.write(self.style.SUCCESS('Seed data created'))
