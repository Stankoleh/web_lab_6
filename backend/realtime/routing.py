from django.urls import re_path

from .consumers import PlaylistConsumer

websocket_urlpatterns = [
    re_path(r'ws/playlists/(?P<playlist_id>\d+)/$', PlaylistConsumer.as_asgi()),
]
