# Playlist Service — Lab 6

SPA playlist service with Django REST API, React frontend, music inside playlists, unit tests/coverage, and WebSocket functionality.

## Features
- Login/logout with demo users.
- Users listing and CRUD.
- Playlists listing, filtering, details, create/edit/delete.
- Add and delete music tracks inside playlists.
- WebSocket live room inside every playlist details page.
- Frontend unit tests and coverage.

## Demo login
```text
admin / admin123
anna / anna123
mark / mark123
```

## Backend run
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py seed_data
python manage.py runserver 0.0.0.0:3001
```

## Frontend run
```bash
cd frontend
npm install
npm run dev -- --host
```

## Lab #6 WebSocket
WebSocket is integrated into every playlist.

Open a playlist details page, for example:
```text
http://192.168.1.231:5173/playlists/1
```

Then open the same playlist in another browser tab/device and send a message in the “Live room for this playlist” block.
The message appears in real time only inside this playlist.

WebSocket URL format:
```text
ws://<host>:3001/ws/playlists/<playlist_id>/
```

Examples:
```text
ws://192.168.1.231:3001/ws/playlists/1/
ws://192.168.1.231:3001/ws/playlists/2/
```

Playlist 1 and playlist 2 have different WebSocket rooms.

## Tests and coverage
```bash
cd frontend
npm install
npm run test
npm run coverage
```


## Persistent playlist WebSocket
Lab 6 WebSocket is implemented inside each playlist details page. Messages are saved in SQLite in `PlaylistMessage`, loaded by `GET /api/playlists/<id>/messages/`, and broadcast live by `ws://<host>:3001/ws/playlists/<id>/`.
After updating this version run `python manage.py migrate` to create the message table.
