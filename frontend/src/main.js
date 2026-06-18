import './api';
import AudioPlayer from './player';
import {
  renderHome,
  renderSearch,
  renderAlbum,
  renderArtist,
  renderPlaylist,
  renderLikedSongs,
  renderSidebarPlaylists,
  renderHeaderAuth
} from './ui';

// Initialize Audio Player
const player = new AudioPlayer();

// -------------------------------------------------------------
// APPLICATION STATE
// -------------------------------------------------------------
let state = {
  currentUser: null,
  likedSongIds: [],
  userPlaylists: [],
  currentView: 'home', // 'home', 'search', 'album', 'artist', 'playlist', 'liked'
  currentViewId: null,
  searchQuery: '',
  activePlaylistId: null
};

// -------------------------------------------------------------
// DOM ELEMENT REFERENCES
// -------------------------------------------------------------
const dom = {
  mainView: document.getElementById('main-view'),
  libraryPlaylists: document.getElementById('library-playlists'),
  authControls: document.getElementById('auth-controls'),
  navHome: document.getElementById('nav-home'),
  navSearch: document.getElementById('nav-search'),
  searchBarWrapper: document.getElementById('search-bar-wrapper'),
  searchInput: document.getElementById('search-input'),
  createPlaylistBtn: document.getElementById('create-playlist-btn'),
  
  // Auth Modal
  authModal: document.getElementById('auth-modal'),
  authModalClose: document.getElementById('auth-modal-close'),
  tabLogin: document.getElementById('tab-login'),
  tabSignup: document.getElementById('tab-signup'),
  formLogin: document.getElementById('form-login'),
  formSignup: document.getElementById('form-signup'),
  loginError: document.getElementById('login-error'),
  signupError: document.getElementById('signup-error'),
  
  // Bottom Player Bar
  playerTrackInfo: document.getElementById('player-track-info'),
  playerLikeBtn: document.getElementById('player-like-btn'),
  playerShuffle: document.getElementById('player-shuffle'),
  playerPrev: document.getElementById('player-prev'),
  playerPlayPause: document.getElementById('player-play-pause'),
  playerNext: document.getElementById('player-next'),
  playerRepeat: document.getElementById('player-repeat'),
  playerMute: document.getElementById('player-mute'),
  playerTimeCurrent: document.getElementById('player-time-current'),
  playerTimeTotal: document.getElementById('player-time-total'),
  progressBarWrapper: document.getElementById('progress-bar-wrapper'),
  progressBarFill: document.getElementById('progress-bar-fill'),
  progressThumb: document.getElementById('progress-thumb'),
  volumeBarWrapper: document.getElementById('volume-bar-wrapper'),
  volumeBarFill: document.getElementById('volume-bar-fill'),
  volumeThumb: document.getElementById('volume-thumb')
};

// Floating Playlist Dropdown Menu
let floatingDropdown = null;

// -------------------------------------------------------------
// INITIALIZATION
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  checkSession();
  setupAppEvents();
  setupPlayerEvents();
  navigateTo('home');
});

// Check if user is logged in
async function checkSession() {
  try {
    const res = await fetch('/api/auth/me');
    if (res.ok) {
      const data = await res.json();
      state.currentUser = data.user;
      
      // Load user specifics
      await Promise.all([
        fetchLikedSongIds(),
        fetchUserPlaylists()
      ]);
    }
  } catch (err) {
    console.error('Session check failed', err);
  } finally {
    updateAuthUI();
  }
}

// Fetch Liked Song IDs
async function fetchLikedSongIds() {
  if (!state.currentUser) return;
  try {
    const res = await fetch('/api/liked/ids');
    if (res.ok) {
      state.likedSongIds = await res.json();
    }
  } catch (err) {
    console.error('Error fetching liked song IDs', err);
  }
}

// Fetch User's Playlists
async function fetchUserPlaylists() {
  if (!state.currentUser) return;
  try {
    const res = await fetch('/api/playlists');
    if (res.ok) {
      state.userPlaylists = await res.json();
      renderSidebar();
    }
  } catch (err) {
    console.error('Error fetching user playlists', err);
  }
}

// -------------------------------------------------------------
// ROUTING & VIEW NAVIGATION
// -------------------------------------------------------------
async function navigateTo(view, id = null, options = {}) {
  state.currentView = view;
  state.currentViewId = id;

  // Toggle active class on sidebar tabs
  dom.navHome.classList.toggle('active', view === 'home');
  dom.navSearch.classList.toggle('active', view === 'search');
  
  // Toggle search input visibility in top nav
  dom.searchBarWrapper.style.display = view === 'search' ? 'flex' : 'none';

  // Clear main view during load
  dom.mainView.innerHTML = `<div style="height: 60vh; display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--color-text-muted);">Loading...</div>`;

  try {
    // Check if view requires auth
    if ((view === 'liked' || view === 'playlist') && !state.currentUser) {
      dom.mainView.innerHTML = `
        <div style="height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--color-text-muted);">
          <i class="bx bx-lock-alt" style="font-size: 80px; margin-bottom: 16px;"></i>
          <h2 style="font-family: var(--font-header); font-weight: 700; color: #fff;">Login Required</h2>
          <p style="margin-top: 8px; font-size: 14px; margin-bottom: 24px;">Register or log in to access your personal playlists and favorites.</p>
          <button class="btn btn-white" id="btn-view-auth-trigger">Log In</button>
        </div>
      `;
      dom.mainView.querySelector('#btn-view-auth-trigger').addEventListener('click', showAuthModal);
      return;
    }

    const callbacks = {
      onPlaySong,
      onToggleLike,
      likedIds: state.likedSongIds,
      onNavigate: navigateTo,
      onOpenPlaylistMenu,
      onRemoveSongFromPlaylist,
      onEditPlaylist,
      onDeletePlaylist
    };

    if (view === 'home') {
      // Fetch albums, artists, and songs
      const [albumsRes, artistsRes, songsRes] = await Promise.all([
        fetch('/api/songs/albums'),
        fetch('/api/songs/artists'),
        fetch('/api/songs')
      ]);

      const albums = await albumsRes.json();
      const artists = await artistsRes.json();
      const songs = await songsRes.json();

      renderHome(dom.mainView, { albums, artists, songs, likedIds: state.likedSongIds }, callbacks);

    } else if (view === 'search') {
      if (!state.searchQuery) {
        renderSearch(dom.mainView, null, '', callbacks);
      } else {
        const res = await fetch(`/api/songs/search?q=${encodeURIComponent(state.searchQuery)}`);
        const results = await res.json();
        renderSearch(dom.mainView, results, state.searchQuery, callbacks);
      }

    } else if (view === 'album') {
      const res = await fetch(`/api/songs/albums/${id}`);
      if (!res.ok) throw new Error('Album not found');
      const albumData = await res.json();
      
      renderAlbum(dom.mainView, albumData, callbacks);
      
      if (options.autoPlay && albumData.songs.length > 0) {
        onPlaySong(albumData.songs[0], albumData.songs);
      }

    } else if (view === 'artist') {
      const res = await fetch(`/api/songs/artists/${id}`);
      if (!res.ok) throw new Error('Artist not found');
      const artistData = await res.json();

      renderArtist(dom.mainView, artistData, callbacks);
      
      if (options.autoPlay && artistData.songs.length > 0) {
        onPlaySong(artistData.songs[0], artistData.songs);
      }

    } else if (view === 'playlist') {
      const res = await fetch(`/api/playlists/${id}`);
      if (!res.ok) throw new Error('Playlist not found');
      const playlistData = await res.json();
      
      renderPlaylist(dom.mainView, playlistData, callbacks);
      
      if (options.autoPlay && playlistData.songs.length > 0) {
        onPlaySong(playlistData.songs[0], playlistData.songs);
      }

    } else if (view === 'liked') {
      const res = await fetch('/api/liked');
      const likedSongs = await res.json();
      renderLikedSongs(dom.mainView, likedSongs, callbacks);
    }

    // Mark current playing song in UI table rows if playing
    highlightPlayingRow();

  } catch (err) {
    console.error('Error rendering view', err);
    dom.mainView.innerHTML = `
      <div style="height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ff4d4d;">
        <i class="bx bx-error-circle" style="font-size: 80px; margin-bottom: 16px;"></i>
        <h2 style="font-family: var(--font-header); font-weight: 700;">Error loading page</h2>
        <p style="margin-top: 8px; font-size: 14px; color: var(--color-text-muted);">The requested content could not be retrieved.</p>
      </div>
    `;
  }
}

// -------------------------------------------------------------
// EVENT BINDINGS (SIDEBARS & MENUS)
// -------------------------------------------------------------
function setupAppEvents() {
  // Navigation Links
  dom.navHome.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('home');
  });
  dom.navSearch.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('search');
  });

  // Search Input Handler
  dom.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim();
    navigateTo('search');
  });

  // Create Playlist Button
  dom.createPlaylistBtn.addEventListener('click', async () => {
    if (!state.currentUser) {
      showAuthModal();
      return;
    }

    try {
      const defaultName = `My Playlist #${state.userPlaylists.length + 1}`;
      const res = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: defaultName, description: 'Created with love.' })
      });

      if (res.ok) {
        const newPlaylist = await res.json();
        await fetchUserPlaylists();
        navigateTo('playlist', newPlaylist.id);
      }
    } catch (err) {
      console.error('Error creating playlist', err);
    }
  });

  // Close floating dropdown when clicking anywhere
  document.addEventListener('click', () => {
    closeFloatingDropdown();
  });

  // Setup Auth modal trigger toggling
  dom.authModalClose.addEventListener('click', hideAuthModal);
  dom.tabLogin.addEventListener('click', () => toggleAuthTabs('login'));
  dom.tabSignup.addEventListener('click', () => toggleAuthTabs('signup'));

  // Auth Submit forms
  dom.formLogin.addEventListener('submit', handleLogin);
  dom.formSignup.addEventListener('submit', handleSignup);
}

// Render library playlists
function renderSidebar() {
  renderSidebarPlaylists(
    dom.libraryPlaylists,
    state.userPlaylists,
    state.currentView === 'playlist' ? state.currentViewId : null,
    (id) => navigateTo('playlist', id)
  );
}

// Update Top nav display
function updateAuthUI() {
  renderHeaderAuth(dom.authControls, state.currentUser, {
    onShowLogin: () => showAuthModal('login'),
    onShowSignup: () => showAuthModal('signup'),
    onLogout: handleLogout
  });

  if (state.currentUser) {
    dom.createPlaylistBtn.style.display = 'flex';
  } else {
    dom.libraryPlaylists.innerHTML = `
      <div class="auth-required-message">
        <p>Log in to create and view playlists</p>
      </div>
    `;
    state.likedSongIds = [];
    state.userPlaylists = [];
  }
}

// -------------------------------------------------------------
// PLAYBACK METADATA COORDINATORS
// -------------------------------------------------------------
function setupPlayerEvents() {
  // Main volume controls slider
  setupSliderInteraction(dom.volumeBarWrapper, (percent) => {
    dom.volumeBarFill.style.width = `${percent}%`;
    if (dom.volumeThumb) dom.volumeThumb.style.left = `${percent}%`;
    player.setVolume(percent / 100);
    updateVolumeIcon(percent / 100);
  });

  // Seek bar controls slider
  setupSliderInteraction(dom.progressBarWrapper, (percent) => {
    player.seek(percent);
  });

  // Player button actions
  dom.playerPlayPause.addEventListener('click', () => player.togglePlay());
  dom.playerNext.addEventListener('click', () => player.next());
  dom.playerPrev.addEventListener('click', () => player.prev());
  
  dom.playerShuffle.addEventListener('click', () => {
    const active = player.toggleShuffle();
    dom.playerShuffle.classList.toggle('active', active);
  });

  dom.playerRepeat.addEventListener('click', () => {
    const repeatState = player.toggleRepeat(); // 'none', 'playlist', 'track'
    dom.playerRepeat.classList.toggle('active', repeatState !== 'none');
    
    // UI indicator change
    const icon = dom.playerRepeat.querySelector('i');
    if (repeatState === 'track') {
      dom.playerRepeat.style.color = 'var(--color-spotify-green)';
      icon.className = 'bx bx-repeat'; // Repeat 1 would be nice, bx-repeat is fine
    } else if (repeatState === 'playlist') {
      dom.playerRepeat.style.color = 'var(--color-spotify-green)';
      icon.className = 'bx bx-repeat';
    } else {
      dom.playerRepeat.style.color = '';
      icon.className = 'bx bx-repeat';
    }
  });

  // Mute toggle
  dom.playerMute.addEventListener('click', () => {
    const muted = player.toggleMute();
    const icon = dom.playerMute.querySelector('i');
    if (muted) {
      icon.className = 'bx bx-volume-mute';
      dom.volumeBarFill.style.width = '0%';
      if (dom.volumeThumb) dom.volumeThumb.style.left = '0%';
    } else {
      const p = player.volume * 100;
      dom.volumeBarFill.style.width = `${p}%`;
      if (dom.volumeThumb) dom.volumeThumb.style.left = `${p}%`;
      updateVolumeIcon(player.volume);
    }
  });

  // Player Bottom Liked Song Heart click
  dom.playerLikeBtn.addEventListener('click', () => {
    if (player.currentIndex === -1) return;
    const track = player.playlist[player.currentIndex];
    onToggleLike(track.id);
  });

  // CONNECT AUDIO PLAYER CALLBACKS TO LOCAL STATE & VIEW UPDATES
  player.onTrackChange = (track) => {
    // Update bottom metadata details
    dom.playerTrackInfo.innerHTML = `
      <img src="${track.cover_url}" class="library-item-img" style="width:56px; height:56px; border-radius:4px;" alt="${track.title}">
      <div class="track-text">
        <span class="track-name" id="bottom-track-name">${track.title}</span>
        <span class="track-artist" id="bottom-track-artist" style="cursor:pointer;">${track.artist_name}</span>
      </div>
    `;

    // Rebind artist details view on clicking bottom artist name
    dom.playerTrackInfo.querySelector('#bottom-track-artist').addEventListener('click', () => {
      navigateTo('artist', track.artist_id);
    });

    // Update Heart Icon on bottom bar
    dom.playerLikeBtn.disabled = !state.currentUser;
    updateBottomHeart(track.id);

    // Update row active styling
    highlightPlayingRow();
  };

  player.onPlayStateChange = (isPlaying) => {
    const icon = dom.playerPlayPause.querySelector('i');
    icon.className = isPlaying ? 'bx bx-pause-circle' : 'bx bx-play-circle';
  };

  player.onTimeUpdate = (current, duration, percent) => {
    dom.playerTimeCurrent.textContent = AudioPlayer.formatTime(current);
    dom.playerTimeTotal.textContent = AudioPlayer.formatTime(duration);
    dom.progressBarFill.style.width = `${percent}%`;
    if (dom.progressThumb) dom.progressThumb.style.left = `${percent}%`;
  };
}

// Highlight playing row
function highlightPlayingRow() {
  if (player.currentIndex === -1 || player.playlist.length === 0) return;
  const currentTrack = player.playlist[player.currentIndex];
  
  // Clear all active songs
  document.querySelectorAll('.songs-table tbody tr').forEach(row => {
    row.classList.remove('active-song');
    const indexCol = row.querySelector('.td-index');
    if (indexCol) {
      // Revert from green playing to simple number index
      const rowId = parseInt(row.dataset.songId);
      indexCol.style.color = '';
      const originalIdx = indexCol.getAttribute('data-original-index') || indexCol.textContent;
      indexCol.textContent = originalIdx;
    }
  });

  // Find row containing the song id
  const targetRow = document.querySelector(`.songs-table tbody tr[data-song-id="${currentTrack.id}"]`);
  if (targetRow) {
    targetRow.classList.add('active-song');
    const indexCol = targetRow.querySelector('.td-index');
    if (indexCol) {
      if (!indexCol.getAttribute('data-original-index')) {
        indexCol.setAttribute('data-original-index', indexCol.textContent);
      }
      indexCol.style.color = 'var(--color-spotify-green)';
      indexCol.innerHTML = '<i class="bx bxs-volume-full"></i>';
    }
  }
}

// -------------------------------------------------------------
// CORE INTERACTION LOGIC (PLAYING SONGS & LIKING)
// -------------------------------------------------------------
function onPlaySong(song, playlist) {
  player.playTrack(song, playlist);
}

async function onToggleLike(songId) {
  if (!state.currentUser) {
    showAuthModal();
    return;
  }

  const isLiked = state.likedSongIds.includes(songId);
  const method = isLiked ? 'DELETE' : 'POST';
  const url = isLiked ? `/api/liked/${songId}` : '/api/liked';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: isLiked ? null : JSON.stringify({ songId })
    });

    if (res.ok) {
      if (isLiked) {
        state.likedSongIds = state.likedSongIds.filter(id => id !== songId);
      } else {
        state.likedSongIds.push(songId);
      }

      // Update hearts everywhere on current page
      updateHeartsInDOM(songId, !isLiked);
      
      // Update bottom player bar heart if it matches
      if (player.currentIndex !== -1 && player.playlist[player.currentIndex].id === songId) {
        updateBottomHeart(songId);
      }

      // If we are currently in Liked Songs view, we need to refresh the view to remove the unliked track
      if (state.currentView === 'liked') {
        navigateTo('liked');
      }
    }
  } catch (err) {
    console.error('Error toggling like', err);
  }
}

// Helper to update active states of hearts in UI table/grid rows
function updateHeartsInDOM(songId, isLikedNow) {
  const rowBtns = document.querySelectorAll(`[data-song-id="${songId}"][data-action="like"]`);
  rowBtns.forEach(btn => {
    btn.classList.toggle('liked', isLikedNow);
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = isLikedNow ? 'bx bxs-heart' : 'bx bx-heart';
    }
  });
}

// Helper to update bottom player bar heart active state
function updateBottomHeart(songId) {
  const isLiked = state.likedSongIds.includes(songId);
  dom.playerLikeBtn.classList.toggle('liked', isLiked);
  const icon = dom.playerLikeBtn.querySelector('i');
  if (icon) {
    icon.className = isLiked ? 'bx bxs-heart' : 'bx bx-heart';
  }
}

// -------------------------------------------------------------
// PLAYLIST OPERATIONS (EDIT / DELETE / ADD / REMOVE)
// -------------------------------------------------------------
async function onEditPlaylist(id, newName, newDesc) {
  try {
    const res = await fetch(`/api/playlists/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, description: newDesc })
    });

    if (res.ok) {
      await fetchUserPlaylists();
      navigateTo('playlist', id);
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to update playlist');
    }
  } catch (err) {
    console.error('Error updating playlist details', err);
  }
}

async function onDeletePlaylist(id) {
  try {
    const res = await fetch(`/api/playlists/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      await fetchUserPlaylists();
      navigateTo('home');
    }
  } catch (err) {
    console.error('Error deleting playlist', err);
  }
}

async function onRemoveSongFromPlaylist(songId) {
  const playlistId = state.currentViewId;
  try {
    const res = await fetch(`/api/playlists/${playlistId}/songs/${songId}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      // Refresh current playlist view
      navigateTo('playlist', playlistId);
    }
  } catch (err) {
    console.error('Error removing song from playlist', err);
  }
}

// Floating Context menu listing playlists to map a song to
function onOpenPlaylistMenu(buttonEl, songId) {
  if (!state.currentUser) {
    showAuthModal();
    return;
  }

  closeFloatingDropdown();

  if (state.userPlaylists.length === 0) {
    alert('Please create a playlist first in the sidebar library!');
    return;
  }

  // Create menu wrapper element
  floatingDropdown = document.createElement('div');
  floatingDropdown.className = 'dropdown-menu show';
  
  // Style absolute positioning
  const rect = buttonEl.getBoundingClientRect();
  floatingDropdown.style.position = 'fixed';
  floatingDropdown.style.left = `${rect.left - 130}px`;
  floatingDropdown.style.top = `${rect.top + window.scrollY + 28}px`;

  // List user playlists
  floatingDropdown.innerHTML = `
    <div style="padding: 6px 12px; font-size:11px; text-transform:uppercase; color:var(--color-text-subtle); font-weight:700;">Add to Playlist</div>
    ${state.userPlaylists.map(pl => `
      <div class="dropdown-item" data-playlist-id="${pl.id}">${pl.name}</div>
    `).join('')}
  `;

  // Bind playlist selection click
  floatingDropdown.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', async (e) => {
      e.stopPropagation();
      const playlistId = item.dataset.playlistId;
      await addSongToPlaylist(playlistId, songId);
      closeFloatingDropdown();
    });
  });

  // Append to body to bypass relative overflows
  document.body.appendChild(floatingDropdown);
}

async function addSongToPlaylist(playlistId, songId) {
  try {
    const res = await fetch(`/api/playlists/${playlistId}/songs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songId })
    });

    if (res.ok) {
      alert('Track added to playlist successfully!');
    } else {
      const err = await res.json();
      alert(err.error || 'Song already exists in this playlist.');
    }
  } catch (err) {
    console.error('Error mapping song to playlist', err);
  }
}

function closeFloatingDropdown() {
  if (floatingDropdown) {
    floatingDropdown.remove();
    floatingDropdown = null;
  }
}

// -------------------------------------------------------------
// AUTH MODAL LOGIC (LOGIN / SIGN UP HANDLERS)
// -------------------------------------------------------------
function showAuthModal(tab = 'login') {
  dom.authModal.classList.add('show');
  toggleAuthTabs(tab);
}

function hideAuthModal() {
  dom.authModal.classList.remove('show');
  dom.loginError.textContent = '';
  dom.signupError.textContent = '';
  dom.formLogin.reset();
  dom.formSignup.reset();
}

function toggleAuthTabs(tab) {
  dom.tabLogin.classList.toggle('active', tab === 'login');
  dom.tabSignup.classList.toggle('active', tab === 'signup');
  dom.formLogin.classList.toggle('hidden', tab !== 'login');
  dom.formSignup.classList.toggle('hidden', tab !== 'signup');
}

// Log In form submission
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  dom.loginError.textContent = '';

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const data = await res.json();
      state.currentUser = data.user;
      hideAuthModal();
      
      // Load details
      await Promise.all([
        fetchLikedSongIds(),
        fetchUserPlaylists()
      ]);
      
      updateAuthUI();
      // Reload current page view to refresh active buttons/auth triggers
      navigateTo(state.currentView, state.currentViewId);
    } else {
      const err = await res.json();
      dom.loginError.textContent = err.error || 'Failed to login';
    }
  } catch (err) {
    console.error('Login error', err);
    dom.loginError.textContent = 'Server connection failed.';
  }
}

// Sign Up form submission
async function handleSignup(e) {
  e.preventDefault();
  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  dom.signupError.textContent = '';

  if (password.length < 6) {
    dom.signupError.textContent = 'Password must be at least 6 characters.';
    return;
  }

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    if (res.ok) {
      const data = await res.json();
      state.currentUser = data.user;
      hideAuthModal();
      
      await Promise.all([
        fetchLikedSongIds(),
        fetchUserPlaylists()
      ]);
      
      updateAuthUI();
      navigateTo(state.currentView, state.currentViewId);
    } else {
      const err = await res.json();
      dom.signupError.textContent = err.error || 'Failed to sign up';
    }
  } catch (err) {
    console.error('Registration error', err);
    dom.signupError.textContent = 'Server connection failed.';
  }
}

// Log out action
async function handleLogout() {
  try {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (res.ok) {
      state.currentUser = null;
      state.likedSongIds = [];
      state.userPlaylists = [];
      
      // Pause audio if playing personal playlist or liked songs
      if (state.currentView === 'playlist' || state.currentView === 'liked') {
        player.audio.pause();
        player.isPlaying = false;
        player.onPlayStateChange(false);
      }

      updateAuthUI();
      renderSidebar();
      navigateTo('home');
    }
  } catch (err) {
    console.error('Logout error', err);
  }
}

// -------------------------------------------------------------
// MOUSE INTERACTIVE SLIDER HELPERS (PROGRESS BAR & VOLUME BAR)
// -------------------------------------------------------------
function setupSliderInteraction(element, onMoveCallback) {
  let isDragging = false;

  const calculatePercentage = (e) => {
    const rect = element.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const x = clientX - rect.left;
    const width = rect.width;
    return Math.max(0, Math.min(100, (x / width) * 100));
  };

  const onStart = (e) => {
    isDragging = true;
    onMove(e);
  };

  const onMove = (e) => {
    if (!isDragging) return;
    const percent = calculatePercentage(e);
    onMoveCallback(percent);
  };

  const onEnd = () => {
    isDragging = false;
  };

  // Bind Mouse events
  element.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);

  // Bind Touch events for mobile responsiveness
  element.addEventListener('touchstart', onStart, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onEnd);
}

// Adjust Volume speaker icons based on levels
function updateVolumeIcon(vol) {
  const icon = dom.playerMute.querySelector('i');
  if (vol === 0) {
    icon.className = 'bx bx-volume-mute';
  } else if (vol < 0.3) {
    icon.className = 'bx bx-volume';
  } else if (vol < 0.7) {
    icon.className = 'bx bx-volume-low';
  } else {
    icon.className = 'bx bx-volume-full';
  }
}
