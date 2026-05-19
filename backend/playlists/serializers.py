from rest_framework import serializers
from .models import Playlist, Track, PlaylistMessage

class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ['id', 'title', 'artist', 'url']

class PlaylistSerializer(serializers.ModelSerializer):
    tracks = TrackSerializer(many=True, read_only=True)
    ownerId = serializers.IntegerField(source='owner.id', read_only=True)
    ownerUsername = serializers.CharField(source='owner.username', read_only=True)
    isPublic = serializers.BooleanField(source='is_public')

    class Meta:
        model = Playlist
        fields = ['id', 'name', 'description', 'isPublic', 'ownerId', 'ownerUsername', 'created_at', 'tracks']

class PlaylistWriteSerializer(serializers.ModelSerializer):
    isPublic = serializers.BooleanField(source='is_public')

    class Meta:
        model = Playlist
        fields = ['name', 'description', 'isPublic']

class TrackWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ['title', 'artist', 'url']


class PlaylistMessageSerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source='created_at', format='%H:%M:%S', read_only=True)
    message = serializers.CharField(source='text', read_only=True)

    class Meta:
        model = PlaylistMessage
        fields = ['id', 'author', 'message', 'createdAt']
