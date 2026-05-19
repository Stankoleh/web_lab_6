from django.urls import path
from .views import playlists_collection, playlist_detail, add_track, track_detail, playlist_messages

urlpatterns = [
    path('playlists/', playlists_collection),
    path('playlists/<int:playlist_id>/', playlist_detail),
    path('playlists/<int:playlist_id>/tracks/', add_track),
    path('playlists/<int:playlist_id>/messages/', playlist_messages),
    path('playlists/<int:playlist_id>/tracks/<int:track_id>/', track_detail),
]
