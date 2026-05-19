# Lab 6. Extended SPA with extra functionality

## Реалізовано
- Login/logout
- User roles
- Users listing + CRUD
- Private and public playlists
- Public playlists editable by every authenticated user
- Routing with refresh support
- REST + JSON communication
- WebSocket live notifications about playlist updates
- Unit tests and coverage commands

## Start
```bash
npm install
npm run dev
```
Front-end: `http://localhost:8000`

## Scripts
- `npm run lint`
- `npm run test`
- `npm run coverage`
- `npm run build`


## Important run notes

For local browser demo run backend as:

```bash
python manage.py runserver 3001
```

For Network demo run backend as:

```bash
python manage.py runserver 0.0.0.0:3001
```

If the UI shows `Failed to fetch`, the frontend cannot reach the backend. Check that Django is running on port `3001` and that Windows Firewall allows Python.

Coverage check:

```bash
npm run test
npm run coverage
```


## Persistent playlist WebSocket
Lab 6 WebSocket is implemented inside each playlist details page. Messages are saved in SQLite in `PlaylistMessage`, loaded by `GET /api/playlists/<id>/messages/`, and broadcast live by `ws://<host>:3001/ws/playlists/<id>/`.
After updating this version run `python manage.py migrate` to create the message table.
