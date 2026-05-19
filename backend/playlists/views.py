from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Playlist, Track, PlaylistMessage
from .serializers import PlaylistSerializer, PlaylistWriteSerializer, TrackSerializer, TrackWriteSerializer, PlaylistMessageSerializer

def can_view(playlist, user):
    if playlist.is_public:
        return True
    if not user or not user.is_authenticated:
        return False
    return user.is_staff or playlist.owner_id == user.id

def can_edit(playlist, user):
    if not user or not user.is_authenticated:
        return False
    if user.is_staff:
        return True
    if playlist.is_public:
        return True
    return playlist.owner_id == user.id

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def playlists_collection(request):
    if request.method == 'GET':
        items = Playlist.objects.select_related('owner').prefetch_related('tracks').order_by('id')
        visible = [p for p in items if can_view(p, request.user)]
        return Response(PlaylistSerializer(visible, many=True).data)

    if not request.user or not request.user.is_authenticated:
        return Response({'message': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

    serializer = PlaylistWriteSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    playlist = serializer.save(owner=request.user)
    return Response(PlaylistSerializer(playlist).data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def playlist_detail(request, playlist_id):
    try:
        playlist = Playlist.objects.select_related('owner').prefetch_related('tracks').get(pk=playlist_id)
    except Playlist.DoesNotExist:
        return Response({'message': 'Playlist not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        if not can_view(playlist, request.user):
            return Response({'message': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
        return Response(PlaylistSerializer(playlist).data)

    if not request.user or not request.user.is_authenticated:
        return Response({'message': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

    if not can_edit(playlist, request.user):
        return Response({'message': 'You cannot edit this playlist'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        serializer = PlaylistWriteSerializer(playlist, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(PlaylistSerializer(playlist).data)

    playlist.delete()
    return Response({'message': 'Playlist deleted'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_track(request, playlist_id):
    try:
        playlist = Playlist.objects.get(pk=playlist_id)
    except Playlist.DoesNotExist:
        return Response({'message': 'Playlist not found'}, status=status.HTTP_404_NOT_FOUND)

    if not can_edit(playlist, request.user):
        return Response({'message': 'You cannot edit this playlist'}, status=status.HTTP_403_FORBIDDEN)

    serializer = TrackWriteSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    track = serializer.save(playlist=playlist)
    return Response(TrackSerializer(track).data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def track_detail(request, playlist_id, track_id):
    try:
        playlist = Playlist.objects.get(pk=playlist_id)
    except Playlist.DoesNotExist:
        return Response({'message': 'Playlist not found'}, status=status.HTTP_404_NOT_FOUND)

    if not can_edit(playlist, request.user):
        return Response({'message': 'You cannot edit this playlist'}, status=status.HTTP_403_FORBIDDEN)

    try:
        track = Track.objects.get(pk=track_id, playlist=playlist)
    except Track.DoesNotExist:
        return Response({'message': 'Track not found'}, status=status.HTTP_404_NOT_FOUND)

    track.delete()
    return Response({'message': 'Track deleted'})


@api_view(['GET'])
@permission_classes([AllowAny])
def playlist_messages(request, playlist_id):
    try:
        playlist = Playlist.objects.get(pk=playlist_id)
    except Playlist.DoesNotExist:
        return Response({'message': 'Playlist not found'}, status=status.HTTP_404_NOT_FOUND)

    if not can_view(playlist, request.user):
        return Response({'message': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    messages = PlaylistMessage.objects.filter(playlist=playlist).order_by('-created_at')[:30]
    return Response(PlaylistMessageSerializer(messages, many=True).data)
