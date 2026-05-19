import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone

from playlists.models import Playlist, PlaylistMessage


class PlaylistConsumer(AsyncWebsocketConsumer):
    """Persistent WebSocket room for one playlist.

    URL format: ws://<host>:3001/ws/playlists/<playlist_id>/
    Messages are broadcast in real time and saved to SQLite, so they remain
    after logout, page refresh, or reconnect.
    """

    async def connect(self):
        self.playlist_id = self.scope['url_route']['kwargs']['playlist_id']
        self.group_name = f'playlist_{self.playlist_id}_room'

        exists = await self.playlist_exists(self.playlist_id)
        if not exists:
            await self.close(code=4404)
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send(text_data=json.dumps({
            'type': 'system',
            'author': 'System',
            'message': f'Connected to live room for playlist #{self.playlist_id}',
            'createdAt': timezone.localtime().strftime('%H:%M:%S'),
            'playlistId': self.playlist_id,
            'persisted': False,
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        try:
            payload = json.loads(text_data or '{}')
        except json.JSONDecodeError:
            payload = {}

        author = str(payload.get('author') or 'Anonymous').strip()[:60] or 'Anonymous'
        message = str(payload.get('message') or '').strip()[:300]
        event_type = str(payload.get('type') or 'playlist-message')[:30]

        if not message:
            return

        saved = await self.save_message(self.playlist_id, author, message)

        await self.channel_layer.group_send(self.group_name, {
            'type': 'broadcast_playlist_message',
            'payload': {
                'id': saved['id'],
                'type': event_type,
                'author': saved['author'],
                'message': saved['message'],
                'createdAt': saved['createdAt'],
                'playlistId': self.playlist_id,
                'persisted': True,
            },
        })

    async def broadcast_playlist_message(self, event):
        await self.send(text_data=json.dumps(event['payload']))

    @database_sync_to_async
    def playlist_exists(self, playlist_id):
        return Playlist.objects.filter(pk=playlist_id).exists()

    @database_sync_to_async
    def save_message(self, playlist_id, author, message):
        playlist = Playlist.objects.get(pk=playlist_id)
        item = PlaylistMessage.objects.create(playlist=playlist, author=author, text=message)
        return {
            'id': item.id,
            'author': item.author,
            'message': item.text,
            'createdAt': timezone.localtime(item.created_at).strftime('%H:%M:%S'),
        }
