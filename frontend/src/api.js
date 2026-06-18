/**
 * Spotify Clone - API Connector & Client-side Mock Database
 * Automatically detects if backend is unavailable (or on GitHub Pages)
 * and falls back to a fully featured client-side mock backend stored in LocalStorage.
 */

const originalFetch = window.fetch;

let apiModePromise = null;
let useMockApi = false;

// 1. DYNAMIC BASE PATH DETECTION (For GitHub Pages compatibility)
const pathSegments = window.location.pathname.split('/');
const getBasePath = () => {
  // If hosted on github.io, the first path segment is the repository name
  if (window.location.hostname.includes('github.io')) {
    const repoName = pathSegments[1];
    return repoName ? `/${repoName}` : '';
  }
  return '';
};
export const BASE_PATH = getBasePath();

// Helper to prefix upload paths with repo base path if deployed
export function resolveUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  return `${BASE_PATH}${cleanPath}`;
}

// Helper to recursively walk a JSON object and resolve all asset URLs
export function resolveUploadsInObject(obj) {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    if (obj.startsWith('/uploads/')) {
      return resolveUrl(obj);
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => resolveUploadsInObject(item));
  }
  if (typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = resolveUploadsInObject(obj[key]);
    }
    return newObj;
  }
  return obj;
}

// Ping the local backend to check connectivity, otherwise switch to mock mode
async function initApiMode() {
  if (window.location.hostname.includes('github.io')) {
    useMockApi = true;
    console.log('[API Mode] GitHub Pages detected. Using LocalStorage Mock API.');
    return;
  }

  try {
    // Ping backend health check
    const res = await originalFetch('/api/health');
    if (res.ok) {
      useMockApi = false;
      console.log('[API Mode] Backend connected. Using live API.');
    } else {
      useMockApi = true;
      console.log('[API Mode] Backend responded with error. Falling back to LocalStorage Mock API.');
    }
  } catch (err) {
    useMockApi = true;
    console.log('[API Mode] Backend unreachable. Falling back to LocalStorage Mock API.');
  }
}

function ensureApiMode() {
  if (!apiModePromise) {
    apiModePromise = initApiMode();
  }
  return apiModePromise;
}

// -------------------------------------------------------------
// LOCALSTORAGE DATABASE SEED & CONFIGURATION
// -------------------------------------------------------------
const SEED_ARTISTS = [
  { id: 1, name: 'The Chillwaves', bio: 'Cool and relaxing ambient vibes for study and relaxation.', image_url: '/uploads/images/the_chillwaves.svg' },
  { id: 2, name: 'Syntax Error', bio: 'Energetic synthwave and techno tracks made by coders, for coders.', image_url: '/uploads/images/syntax_error.svg' },
  { id: 3, name: 'Midnight Beats', bio: 'Lofi, jazz hop, and downtempo rhythms for late-night thoughts.', image_url: '/uploads/images/midnight_beats.svg' },
  { id: 4, name: 'MCK', bio: 'Talented Vietnamese rapper and songwriter, known for his versatile style and raw storytelling.', image_url: '/uploads/images/mck.svg' }
];

const SEED_ALBUMS = [
  { id: 1, title: 'Ocean Breeze', cover_url: '/uploads/images/ocean_breeze.svg', artist_id: 1, artist_name: 'The Chillwaves', release_year: 2024 },
  { id: 2, title: 'Dark Mode', cover_url: '/uploads/images/dark_mode.svg', artist_id: 2, artist_name: 'Syntax Error', release_year: 2023 },
  { id: 3, title: 'Neon City', cover_url: '/uploads/images/neon_city.svg', artist_id: 3, artist_name: 'Midnight Beats', release_year: 2025 },
  { id: 4, title: 'HVL', cover_url: '/uploads/images/hvl.svg', artist_id: 4, artist_name: 'MCK', release_year: 2026 }
];

const SEED_SONGS = [
  { id: 1, title: 'Lost in the Waves', duration: 180, song_url: '/uploads/audio/lost_in_the_waves.mp3', album_id: 1, album_title: 'Ocean Breeze', artist_id: 1, artist_name: 'The Chillwaves', cover_url: '/uploads/images/ocean_breeze.svg' },
  { id: 2, title: 'Summer Lounge', duration: 210, song_url: '/uploads/audio/summer_lounge.mp3', album_id: 1, album_title: 'Ocean Breeze', artist_id: 1, artist_name: 'The Chillwaves', cover_url: '/uploads/images/ocean_breeze.svg' },
  { id: 3, title: 'Compile Success', duration: 150, song_url: '/uploads/audio/compile_success.mp3', album_id: 2, album_title: 'Dark Mode', artist_id: 2, artist_name: 'Syntax Error', cover_url: '/uploads/images/dark_mode.svg' },
  { id: 4, title: 'Infinite Loop', duration: 240, song_url: '/uploads/audio/infinite_loop.mp3', album_id: 2, album_title: 'Dark Mode', artist_id: 2, artist_name: 'Syntax Error', cover_url: '/uploads/images/dark_mode.svg' },
  { id: 5, title: 'Traffic Lights', duration: 195, song_url: '/uploads/audio/traffic_lights.mp3', album_id: 3, album_title: 'Neon City', artist_id: 3, artist_name: 'Midnight Beats', cover_url: '/uploads/images/neon_city.svg' },
  { id: 6, title: 'Rainy Streets', duration: 220, song_url: '/uploads/audio/rainy_streets.mp3', album_id: 3, album_title: 'Neon City', artist_id: 3, artist_name: 'Midnight Beats', cover_url: '/uploads/images/neon_city.svg' },
  { id: 7, title: 'Elegie', duration: 120, song_url: '/uploads/audio/lost_in_the_waves.mp3', album_id: 4, album_title: 'HVL', artist_id: 4, artist_name: 'MCK', cover_url: '/uploads/images/hvl.svg' },
  { id: 8, title: 'CHEPHU', duration: 195, song_url: '/uploads/audio/infinite_loop.mp3', album_id: 4, album_title: 'HVL', artist_id: 4, artist_name: 'MCK', cover_url: '/uploads/images/hvl.svg' },
  { id: 9, title: 'Oanh M = Thuoc', duration: 180, song_url: '/uploads/audio/compile_success.mp3', album_id: 4, album_title: 'HVL', artist_id: 4, artist_name: 'MCK', cover_url: '/uploads/images/hvl.svg' },
  { id: 10, title: 'XAXOI', duration: 215, song_url: '/uploads/audio/summer_lounge.mp3', album_id: 4, album_title: 'HVL', artist_id: 4, artist_name: 'MCK', cover_url: '/uploads/images/hvl.svg' },
  { id: 11, title: 'CAMON', duration: 240, song_url: '/uploads/audio/traffic_lights.mp3', album_id: 4, album_title: 'HVL', artist_id: 4, artist_name: 'MCK', cover_url: '/uploads/images/hvl.svg' }
];

let db = null;

function initMockDB() {
  if (db) return;
  const localData = localStorage.getItem('spotify_clone_mock_db');
  if (localData) {
    db = JSON.parse(localData);
    
    // Automatically upgrade database with new seed artists, albums, or songs if missing
    let updated = false;
    SEED_ARTISTS.forEach(artist => {
      if (!db.artists.some(a => a.id === artist.id)) {
        db.artists.push(artist);
        updated = true;
      }
    });
    SEED_ALBUMS.forEach(album => {
      if (!db.albums.some(a => a.id === album.id)) {
        db.albums.push(album);
        updated = true;
      }
    });
    SEED_SONGS.forEach(song => {
      if (!db.songs.some(s => s.id === song.id)) {
        db.songs.push(song);
        updated = true;
      }
    });
    if (updated) {
      saveDB();
    }
  } else {
    db = {
      users: [
        { id: 1, username: 'demo', email: 'demo@demo.com', password: 'password123' }
      ],
      artists: SEED_ARTISTS,
      albums: SEED_ALBUMS,
      songs: SEED_SONGS,
      likedSongs: {
        'demo': [1, 3, 5]
      },
      playlists: [
        {
          id: 101,
          name: 'Chill Vibes Mix',
          description: 'A selection of the finest relaxing beats.',
          owner: 'demo',
          cover_url: '/uploads/images/ocean_breeze.svg',
          song_ids: [1, 2, 5]
        }
      ]
    };
    saveDB();
  }
}

function saveDB() {
  localStorage.setItem('spotify_clone_mock_db', JSON.stringify(db));
}

function getSessionUser() {
  const user = sessionStorage.getItem('spotify_clone_current_user') || localStorage.getItem('spotify_clone_current_user');
  return user ? JSON.parse(user) : null;
}

function setSessionUser(user) {
  sessionStorage.setItem('spotify_clone_current_user', JSON.stringify(user));
  localStorage.setItem('spotify_clone_current_user', JSON.stringify(user));
}

function clearSessionUser() {
  sessionStorage.removeItem('spotify_clone_current_user');
  localStorage.removeItem('spotify_clone_current_user');
}

// -------------------------------------------------------------
// REQUEST MOCK INTERCEPTOR ROUTER
// -------------------------------------------------------------
function handleMockRequest(url, options = {}) {
  const parsedUrl = new URL(url, window.location.origin);
  const pathname = parsedUrl.pathname.replace(BASE_PATH, ''); // strip deployed subpath
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : null;

  const mockResponse = (data, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  const mockError = (errorMsg, status = 400) => {
    return new Response(JSON.stringify({ error: errorMsg }), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  initMockDB();

  // Health
  if (pathname === '/api/health') {
    return mockResponse({ status: 'OK', message: 'Spotify Clone Mock API is running' });
  }

  // Auth: Me
  if (pathname === '/api/auth/me') {
    const currentUser = getSessionUser();
    if (currentUser) {
      return mockResponse({ user: currentUser });
    }
    return mockError('Not authenticated', 401);
  }

  // Auth: Login
  if (pathname === '/api/auth/login' && method === 'POST') {
    const { email, password } = body;
    const user = db.users.find(u => (u.email === email || u.username === email) && u.password === password);
    if (user) {
      setSessionUser(user);
      return mockResponse({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });
    }
    return mockError('Invalid credentials. (Hint: Try username "demo" and password "password123")', 401);
  }

  // Auth: Register
  if (pathname === '/api/auth/register' && method === 'POST') {
    const { username, email, password } = body;
    if (db.users.some(u => u.email === email || u.username === username)) {
      return mockError('Username or email already exists');
    }
    const newUser = { id: Date.now(), username, email, password };
    db.users.push(newUser);
    saveDB();
    setSessionUser(newUser);
    return mockResponse({ message: 'Registration successful', user: { id: newUser.id, username: newUser.username, email: newUser.email } });
  }

  // Auth: Logout
  if (pathname === '/api/auth/logout' && method === 'POST') {
    clearSessionUser();
    return mockResponse({ message: 'Logout successful' });
  }

  // Catalog: Songs
  if (pathname === '/api/songs' && method === 'GET') {
    return mockResponse(resolveUploadsInObject(db.songs));
  }

  // Catalog: Albums
  if (pathname === '/api/songs/albums' && method === 'GET') {
    return mockResponse(resolveUploadsInObject(db.albums));
  }

  // Catalog: Artists
  if (pathname === '/api/songs/artists' && method === 'GET') {
    return mockResponse(resolveUploadsInObject(db.artists));
  }

  // Catalog: Album Details
  const albumMatch = pathname.match(/^\/api\/songs\/albums\/(\d+)$/);
  if (albumMatch && method === 'GET') {
    const albumId = parseInt(albumMatch[1]);
    const album = db.albums.find(a => a.id === albumId);
    if (!album) return mockError('Album not found', 404);
    const albumSongs = db.songs.filter(s => s.album_id === albumId);
    return mockResponse(resolveUploadsInObject({ album, songs: albumSongs }));
  }

  // Catalog: Artist Details
  const artistMatch = pathname.match(/^\/api\/songs\/artists\/(\d+)$/);
  if (artistMatch && method === 'GET') {
    const artistId = parseInt(artistMatch[1]);
    const artist = db.artists.find(a => a.id === artistId);
    if (!artist) return mockError('Artist not found', 404);
    const artistSongs = db.songs.filter(s => s.artist_id === artistId);
    const artistAlbums = db.albums.filter(a => a.artist_id === artistId);
    return mockResponse(resolveUploadsInObject({ artist, songs: artistSongs, albums: artistAlbums }));
  }

  // Catalog: Search
  if (pathname.startsWith('/api/songs/search') && method === 'GET') {
    const query = parsedUrl.searchParams.get('q') || '';
    const q = query.toLowerCase();
    const songs = db.songs.filter(s => s.title.toLowerCase().includes(q) || s.artist_name.toLowerCase().includes(q) || s.album_title.toLowerCase().includes(q));
    const albums = db.albums.filter(a => a.title.toLowerCase().includes(q) || a.artist_name.toLowerCase().includes(q));
    const artists = db.artists.filter(a => a.name.toLowerCase().includes(q));
    return mockResponse(resolveUploadsInObject({ songs, albums, artists }));
  }

  // Liked: Liked IDs
  if (pathname === '/api/liked/ids' && method === 'GET') {
    const user = getSessionUser();
    if (!user) return mockError('Not authenticated', 401);
    const likes = db.likedSongs[user.username] || [];
    return mockResponse(likes);
  }

  // Liked: List Liked Songs
  if (pathname === '/api/liked' && method === 'GET') {
    const user = getSessionUser();
    if (!user) return mockError('Not authenticated', 401);
    const likes = db.likedSongs[user.username] || [];
    const likedSongs = db.songs.filter(s => likes.includes(s.id));
    return mockResponse(resolveUploadsInObject(likedSongs));
  }

  // Liked: Toggle Like
  if (pathname === '/api/liked' && method === 'POST') {
    const user = getSessionUser();
    if (!user) return mockError('Not authenticated', 401);
    const { songId } = body;
    if (!db.likedSongs[user.username]) {
      db.likedSongs[user.username] = [];
    }
    if (!db.likedSongs[user.username].includes(songId)) {
      db.likedSongs[user.username].push(songId);
      saveDB();
    }
    return mockResponse({ success: true });
  }

  const likedSongMatch = pathname.match(/^\/api\/liked\/(\d+)$/);
  if (likedSongMatch && method === 'DELETE') {
    const user = getSessionUser();
    if (!user) return mockError('Not authenticated', 401);
    const songId = parseInt(likedSongMatch[1]);
    if (db.likedSongs[user.username]) {
      db.likedSongs[user.username] = db.likedSongs[user.username].filter(id => id !== songId);
      saveDB();
    }
    return mockResponse({ success: true });
  }

  // Playlists: List User Playlists
  if (pathname === '/api/playlists' && method === 'GET') {
    const user = getSessionUser();
    if (!user) return mockError('Not authenticated', 401);
    const userPlaylists = db.playlists.filter(p => p.owner === user.username);
    return mockResponse(resolveUploadsInObject(userPlaylists));
  }

  // Playlists: Create Playlist
  if (pathname === '/api/playlists' && method === 'POST') {
    const user = getSessionUser();
    if (!user) return mockError('Not authenticated', 401);
    const { name, description } = body;
    const defaultCovers = [
      '/uploads/images/ocean_breeze.svg',
      '/uploads/images/dark_mode.svg',
      '/uploads/images/neon_city.svg'
    ];
    const coverUrl = defaultCovers[Math.floor(Math.random() * defaultCovers.length)];
    
    const newPlaylist = {
      id: Date.now(),
      name,
      description: description || '',
      owner: user.username,
      cover_url: coverUrl,
      song_ids: []
    };
    db.playlists.push(newPlaylist);
    saveDB();
    return mockResponse(resolveUploadsInObject(newPlaylist));
  }

  // Playlists: Details / Update / Delete
  const playlistMatch = pathname.match(/^\/api\/playlists\/(\d+)$/);
  if (playlistMatch) {
    const playlistId = parseInt(playlistMatch[1]);
    const playlist = db.playlists.find(p => p.id === playlistId);
    if (!playlist) return mockError('Playlist not found', 404);

    if (method === 'GET') {
      const playlistSongs = db.songs.filter(s => playlist.song_ids.includes(s.id));
      return mockResponse(resolveUploadsInObject({ playlist, songs: playlistSongs }));
    }

    if (method === 'PUT') {
      const { name, description } = body;
      playlist.name = name;
      playlist.description = description || '';
      saveDB();
      return mockResponse(resolveUploadsInObject(playlist));
    }

    if (method === 'DELETE') {
      db.playlists = db.playlists.filter(p => p.id !== playlistId);
      saveDB();
      return mockResponse({ success: true });
    }
  }

  // Playlists: Add Song
  const playlistSongsMatch = pathname.match(/^\/api\/playlists\/(\d+)\/songs$/);
  if (playlistSongsMatch && method === 'POST') {
    const playlistId = parseInt(playlistSongsMatch[1]);
    const { songId } = body;
    const playlist = db.playlists.find(p => p.id === playlistId);
    if (!playlist) return mockError('Playlist not found', 404);
    if (playlist.song_ids.includes(songId)) {
      return mockError('Song already exists in this playlist');
    }
    playlist.song_ids.push(songId);
    saveDB();
    return mockResponse({ success: true });
  }

  // Playlists: Remove Song
  const playlistSongDeleteMatch = pathname.match(/^\/api\/playlists\/(\d+)\/songs\/(\d+)$/);
  if (playlistSongDeleteMatch && method === 'DELETE') {
    const playlistId = parseInt(playlistSongDeleteMatch[1]);
    const songId = parseInt(playlistSongDeleteMatch[2]);
    const playlist = db.playlists.find(p => p.id === playlistId);
    if (!playlist) return mockError('Playlist not found', 404);
    playlist.song_ids = playlist.song_ids.filter(id => id !== songId);
    saveDB();
    return mockResponse({ success: true });
  }

  return mockError('Mock endpoint not found', 404);
}

// -------------------------------------------------------------
// PATCH GLOBAL FETCH WINDOW OBJECT
// -------------------------------------------------------------
window.fetch = async function(url, options = {}) {
  await ensureApiMode();

  // Automatically prepend deployment path to static requests mapping to uploads folder
  if (typeof url === 'string' && url.includes('/uploads/')) {
    url = resolveUrl(url);
  }

  // If in local mock database mode, intercept api routes
  if (useMockApi && typeof url === 'string' && url.includes('/api/')) {
    return handleMockRequest(url, options);
  }

  // Standard live backend fetch
  const res = await originalFetch(url, options);

  // If responding with DB records, adjust cover/audio paths dynamically to support GitHub pages routing
  if (res.ok && typeof url === 'string' && url.includes('/api/')) {
    const clonedRes = res.clone();
    try {
      const data = await clonedRes.json();
      const resolvedData = resolveUploadsInObject(data);
      return new Response(JSON.stringify(resolvedData), {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers
      });
    } catch (e) {
      // not JSON or body error
    }
  }

  return res;
};
