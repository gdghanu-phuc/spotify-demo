import AudioPlayer from './player';

// Helper to format seconds to M:SS
const formatTime = (secs) => AudioPlayer.formatTime(secs);

// Helper to create gradient based on title length/character codes (simulates color extraction)
const getHeroGradient = (title) => {
  const code = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue1 = code % 360;
  const hue2 = (hue1 + 40) % 360;
  return `linear-gradient(to bottom, hsl(${hue1}, 45%, 25%) 0%, var(--color-dark-gray) 100%)`;
};

// Get greeting based on current local time
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

/**
 * -------------------------------------------------------------
 * HOME VIEW
 * -------------------------------------------------------------
 */
export const renderHome = (container, data, callbacks) => {
  const { albums, artists, songs, likedIds } = data;
  const { onPlaySong, onToggleLike, onNavigate } = callbacks;

  const greeting = getGreeting();

  container.innerHTML = `
    <div class="section-container" style="margin-top: 40px;">
      <h1 class="section-title" style="font-size: 32px; margin-bottom: 24px;">${greeting}</h1>
      
      <!-- Quick Play Grid -->
      <div class="cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin-bottom: 40px;">
        ${songs.slice(0, 6).map(song => `
          <div class="library-item" style="background-color: var(--color-medium-gray); padding: 8px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: var(--transition-fast);" class="quick-play-row" data-id="${song.id}">
            <div style="display: flex; align-items: center; gap: 12px; min-width: 0;" class="click-trigger" data-type="album" data-target-id="${song.album_id}">
              <img src="${song.cover_url}" class="library-item-img" style="width: 56px; height: 56px; border-radius: 4px 0 0 4px;" alt="${song.title}">
              <span style="font-weight: 700; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 8px;">${song.title}</span>
            </div>
            <button class="quick-play-btn" style="background-color: var(--color-spotify-green); border: none; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: var(--color-black); cursor: pointer; opacity: 0; transition: var(--transition-fast); margin-right: 8px;" data-song-id="${song.id}">
              <i class="bx bx-play" style="margin-left: 2px;"></i>
            </button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Suggested Albums -->
    <div class="section-container">
      <h2 class="section-title">Featured Albums</h2>
      <div class="cards-grid">
        ${albums.map(album => `
          <div class="music-card" data-action="album" data-id="${album.id}">
            <div class="card-img-container">
              <img src="${album.cover_url}" class="card-img" alt="${album.title}">
              <button class="card-play-btn" data-album-id="${album.id}">
                <i class="bx bx-play" style="margin-left: 2px;"></i>
              </button>
            </div>
            <div class="card-title">${album.title}</div>
            <div class="card-desc">Album • ${album.artist_name}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Artists Section -->
    <div class="section-container" style="margin-top: 40px;">
      <h2 class="section-title">Popular Artists</h2>
      <div class="cards-grid">
        ${artists.map(artist => `
          <div class="music-card" data-action="artist" data-id="${artist.id}">
            <div class="card-img-container" style="border-radius: 50%;">
              <img src="${artist.image_url}" class="card-img" alt="${artist.name}" style="border-radius: 50%;">
              <button class="card-play-btn" data-artist-id="${artist.id}" style="border-radius: 50%;">
                <i class="bx bx-play" style="margin-left: 2px;"></i>
              </button>
            </div>
            <div class="card-title">${artist.name}</div>
            <div class="card-desc">Artist</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Attach navigation event listeners to cards
  container.querySelectorAll('.music-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Prevent card navigation if play button inside card is clicked
      if (e.target.closest('.card-play-btn')) return;
      
      const action = card.dataset.action;
      const id = card.dataset.id;
      onNavigate(action, id);
    });
  });

  // Attach quick-play events in quick play row
  container.querySelectorAll('.quick-play-row').forEach(row => {
    // Hover animation triggers play button
    row.addEventListener('mouseenter', () => {
      const btn = row.querySelector('.quick-play-btn');
      if (btn) btn.style.opacity = '1';
    });
    row.addEventListener('mouseleave', () => {
      const btn = row.querySelector('.quick-play-btn');
      if (btn) btn.style.opacity = '0';
    });

    row.querySelector('.click-trigger').addEventListener('click', (e) => {
      const targetId = e.currentTarget.dataset.targetId;
      onNavigate('album', targetId);
    });

    row.querySelector('.quick-play-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const songId = parseInt(e.currentTarget.dataset.songId);
      const song = songs.find(s => s.id === songId);
      if (song) onPlaySong(song, songs);
    });
  });

  // Handle Play Button on Album Card
  container.querySelectorAll('.card-play-btn[data-album-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const albumId = parseInt(btn.dataset.albumId);
      onNavigate('album', albumId, { autoPlay: true });
    });
  });

  // Handle Play Button on Artist Card
  container.querySelectorAll('.card-play-btn[data-artist-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const artistId = parseInt(btn.dataset.artistId);
      onNavigate('artist', artistId, { autoPlay: true });
    });
  });
};

/**
 * -------------------------------------------------------------
 * SEARCH VIEW
 * -------------------------------------------------------------
 */
export const renderSearch = (container, results, query, callbacks) => {
  const { onPlaySong, onToggleLike, likedIds, onNavigate, onOpenPlaylistMenu } = callbacks;

  if (!query) {
    container.innerHTML = `
      <div style="height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--color-text-muted);">
        <i class="bx bx-search" style="font-size: 80px; margin-bottom: 16px;"></i>
        <h2 style="font-family: var(--font-header); font-weight: 700; color: #fff;">Search Spotify</h2>
        <p style="margin-top: 8px; font-size: 14px;">Find your favorite songs, artists, and albums</p>
      </div>
    `;
    return;
  }

  const { songs, albums, artists } = results;

  if (songs.length === 0 && albums.length === 0 && artists.length === 0) {
    container.innerHTML = `
      <div style="height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--color-text-muted);">
        <i class="bx bx-confused" style="font-size: 80px; margin-bottom: 16px;"></i>
        <h2 style="font-family: var(--font-header); font-weight: 700; color: #fff;">No results found for "${query}"</h2>
        <p style="margin-top: 8px; font-size: 14px;">Please check your spelling or try another keyword</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <!-- Top Result & Songs Panel -->
    <div style="display: grid; grid-template-columns: 2fr 3fr; gap: 32px; margin-top: 32px;">
      
      <!-- Top Result -->
      <div>
        <h2 class="section-title">Top Result</h2>
        ${artists.length > 0 ? `
          <div class="music-card" style="background-color: var(--color-medium-gray); padding: 24px; border-radius: 8px; width: 100%; height: 260px; display: flex; flex-direction: column; justify-content: flex-end; position: relative;" data-action="artist" data-id="${artists[0].id}">
            <img src="${artists[0].image_url}" style="width: 92px; height: 92px; border-radius: 50%; box-shadow: 0 8px 24px rgba(0,0,0,0.5); margin-bottom: 24px;" alt="${artists[0].name}">
            <div style="font-family: var(--font-header); font-size: 32px; font-weight: 800; color: #fff; margin-bottom: 8px;">${artists[0].name}</div>
            <div style="display: inline-block; background-color: rgba(0,0,0,0.2); padding: 6px 12px; border-radius: 100px; font-size: 12px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 1px; width: fit-content;">Artist</div>
            <button class="card-play-btn" data-artist-id="${artists[0].id}" style="bottom: 24px; right: 24px;">
              <i class="bx bx-play" style="margin-left: 2px;"></i>
            </button>
          </div>
        ` : albums.length > 0 ? `
          <div class="music-card" style="background-color: var(--color-medium-gray); padding: 24px; border-radius: 8px; width: 100%; height: 260px; display: flex; flex-direction: column; justify-content: flex-end; position: relative;" data-action="album" data-id="${albums[0].id}">
            <img src="${albums[0].cover_url}" style="width: 92px; height: 92px; border-radius: 6px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); margin-bottom: 24px;" alt="${albums[0].title}">
            <div style="font-family: var(--font-header); font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">${albums[0].title}</div>
            <div style="font-size: 14px; color: var(--color-text-muted); margin-bottom: 8px;">Album • ${albums[0].artist_name}</div>
            <button class="card-play-btn" data-album-id="${albums[0].id}" style="bottom: 24px; right: 24px;">
              <i class="bx bx-play" style="margin-left: 2px;"></i>
            </button>
          </div>
        ` : `
          <div class="music-card" style="background-color: var(--color-medium-gray); padding: 24px; border-radius: 8px; width: 100%; height: 260px; display: flex; flex-direction: column; justify-content: flex-end; position: relative;" data-action="song-play" data-song-id="${songs[0].id}">
            <img src="${songs[0].cover_url}" style="width: 92px; height: 92px; border-radius: 6px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); margin-bottom: 24px;" alt="${songs[0].title}">
            <div style="font-family: var(--font-header); font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">${songs[0].title}</div>
            <div style="font-size: 14px; color: var(--color-text-muted); margin-bottom: 8px;">Song • ${songs[0].artist_name}</div>
            <button class="card-play-btn" data-song-idx="0" style="bottom: 24px; right: 24px;">
              <i class="bx bx-play" style="margin-left: 2px;"></i>
            </button>
          </div>
        `}
      </div>

      <!-- Songs Results -->
      <div>
        <h2 class="section-title">Songs</h2>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          ${songs.slice(0, 4).map((song, idx) => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 16px; border-radius: 4px; transition: var(--transition-fast); cursor: pointer;" class="search-song-row" data-song-id="${song.id}">
              <div style="display: flex; align-items: center; gap: 16px; min-width: 0;">
                <div style="position: relative; width: 40px; height: 40px; flex-shrink: 0;">
                  <img src="${song.cover_url}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;" alt="${song.title}">
                  <div class="hover-play-icon" style="position: absolute; top:0; left:0; width:100%; height:100%; background-color: rgba(0,0,0,0.6); border-radius:4px; display: none; align-items: center; justify-content: center; font-size: 20px; color:#fff;">
                    <i class="bx bx-play"></i>
                  </div>
                </div>
                <div style="display: flex; flex-direction: column; min-width: 0;">
                  <span style="font-weight: 500; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" class="song-title-click">${song.title}</span>
                  <span style="font-size: 13px; color: var(--color-text-muted); margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" class="song-artist-click" data-artist-id="${song.artist_id}">${song.artist_name}</span>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 20px;">
                <button class="action-icon-btn ${likedIds.includes(song.id) ? 'liked' : ''}" data-action="like" data-song-id="${song.id}">
                  <i class="bx ${likedIds.includes(song.id) ? 'bxs-heart' : 'bx-heart'}"></i>
                </button>
                <div style="font-size: 13px; color: var(--color-text-muted); width: 40px; text-align: right;">${formatTime(song.duration)}</div>
                <button class="action-icon-btn" data-action="add-to-playlist" data-song-id="${song.id}">
                  <i class="bx bx-plus"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Albums Results -->
    ${albums.length > 0 ? `
      <div class="section-container" style="margin-top: 40px;">
        <h2 class="section-title">Albums</h2>
        <div class="cards-grid">
          ${albums.map(album => `
            <div class="music-card" data-action="album" data-id="${album.id}">
              <div class="card-img-container">
                <img src="${album.cover_url}" class="card-img" alt="${album.title}">
                <button class="card-play-btn" data-album-id="${album.id}">
                  <i class="bx bx-play" style="margin-left: 2px;"></i>
                </button>
              </div>
              <div class="card-title">${album.title}</div>
              <div class="card-desc">${album.release_year} • ${album.artist_name}</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Artists Results -->
    ${artists.length > 0 ? `
      <div class="section-container" style="margin-top: 40px;">
        <h2 class="section-title">Artists</h2>
        <div class="cards-grid">
          ${artists.map(artist => `
            <div class="music-card" data-action="artist" data-id="${artist.id}">
              <div class="card-img-container" style="border-radius: 50%;">
                <img src="${artist.image_url}" class="card-img" alt="${artist.name}" style="border-radius: 50%;">
                <button class="card-play-btn" data-artist-id="${artist.id}" style="border-radius: 50%;">
                  <i class="bx bx-play" style="margin-left: 2px;"></i>
                </button>
              </div>
              <div class="card-title">${artist.name}</div>
              <div class="card-desc">Artist</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;

  // Attach search song row interactions
  container.querySelectorAll('.search-song-row').forEach((row) => {
    const songId = parseInt(row.dataset.songId);
    const song = songs.find(s => s.id === songId);

    // Hover effect for play button overlay
    row.addEventListener('mouseenter', () => {
      row.querySelector('.hover-play-icon').style.display = 'flex';
    });
    row.addEventListener('mouseleave', () => {
      row.querySelector('.hover-play-icon').style.display = 'none';
    });

    // Click play icon or title to play
    row.querySelector('.hover-play-icon').addEventListener('click', (e) => {
      e.stopPropagation();
      onPlaySong(song, songs);
    });

    row.querySelector('.song-title-click').addEventListener('click', (e) => {
      e.stopPropagation();
      onPlaySong(song, songs);
    });

    // Click artist link to navigate
    row.querySelector('.song-artist-click').addEventListener('click', (e) => {
      e.stopPropagation();
      const artistId = e.currentTarget.dataset.artistId;
      onNavigate('artist', artistId);
    });

    // Like button
    row.querySelector('[data-action="like"]').addEventListener('click', (e) => {
      e.stopPropagation();
      onToggleLike(songId);
    });

    // Add to playlist button
    row.querySelector('[data-action="add-to-playlist"]').addEventListener('click', (e) => {
      e.stopPropagation();
      onOpenPlaylistMenu(e.currentTarget, songId);
    });
  });

  // Top result card navigates or plays
  const topResultCard = container.querySelector('.music-card');
  if (topResultCard) {
    topResultCard.addEventListener('click', (e) => {
      if (e.target.closest('.card-play-btn')) return;
      const action = topResultCard.dataset.action;
      const id = topResultCard.dataset.id;
      if (action === 'song-play') {
        const songId = parseInt(topResultCard.dataset.songId);
        const song = songs.find(s => s.id === songId);
        onPlaySong(song, songs);
      } else {
        onNavigate(action, id);
      }
    });
  }

  // Play button on artist cards
  container.querySelectorAll('.card-play-btn[data-artist-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const artistId = parseInt(btn.dataset.artistId);
      onNavigate('artist', artistId, { autoPlay: true });
    });
  });

  // Play button on album cards
  container.querySelectorAll('.card-play-btn[data-album-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const albumId = parseInt(btn.dataset.albumId);
      onNavigate('album', albumId, { autoPlay: true });
    });
  });

  // General music card navigation (Albums/Artists grids)
  container.querySelectorAll('.cards-grid .music-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-play-btn')) return;
      const action = card.dataset.action;
      const id = card.dataset.id;
      onNavigate(action, id);
    });
  });
};

/**
 * -------------------------------------------------------------
 * GENERIC SONGS TABLE RENDERING (Used in Album, Playlist, Liked views)
 * -------------------------------------------------------------
 */
const renderSongsTableHTML = (songs, likedIds, showRemoveColumn = false) => {
  if (songs.length === 0) {
    return `
      <div style="padding: 40px; text-align: center; color: var(--color-text-muted); font-size: 14px;">
        No songs found in this list.
      </div>
    `;
  }

  return `
    <table class="songs-table">
      <thead>
        <tr>
          <th style="width: 48px; text-align: center;">#</th>
          <th>Title</th>
          <th>Album</th>
          <th style="text-align: right; width: 120px;"><i class="bx bx-time" style="font-size: 18px;"></i></th>
          <th style="width: 48px;"></th>
        </tr>
      </thead>
      <tbody>
        ${songs.map((song, index) => `
          <tr data-song-id="${song.id}" class="song-row">
            <td class="td-index">${index + 1}</td>
            <td class="td-play-icon" data-song-idx="${index}"><i class="bx bx-play-circle"></i></td>
            <td>
              <div class="td-title">
                <img src="${song.cover_url}" class="td-title-img" alt="${song.title}">
                <div class="td-title-text">
                  <span class="td-title-name" data-song-idx="${index}">${song.title}</span>
                  <span class="td-title-artist" data-artist-id="${song.artist_id}">${song.artist_name}</span>
                </div>
              </div>
            </td>
            <td class="td-album" data-album-id="${song.album_id}">${song.album_title}</td>
            <td class="td-duration">
              <div style="display: flex; align-items: center; justify-content: flex-end; gap: 16px;">
                <button class="action-icon-btn ${likedIds.includes(song.id) ? 'liked' : ''}" data-action="like" data-song-id="${song.id}">
                  <i class="bx ${likedIds.includes(song.id) ? 'bxs-heart' : 'bx-heart'}"></i>
                </button>
                <span>${formatTime(song.duration)}</span>
              </div>
            </td>
            <td class="td-actions">
              ${showRemoveColumn ? `
                <button class="action-icon-btn remove-playlist-song-btn" data-action="remove" data-song-id="${song.id}" title="Remove from playlist">
                  <i class="bx bx-minus-circle"></i>
                </button>
              ` : `
                <button class="action-icon-btn add-to-playlist-row-btn" data-action="add" data-song-id="${song.id}">
                  <i class="bx bx-plus"></i>
                </button>
              `}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
};

// Bind table row interactions (play, navigation, like, add/remove to playlist)
const bindSongsTableEvents = (container, songs, callbacks, isPlaylist = false) => {
  const { onPlaySong, onToggleLike, onNavigate, onOpenPlaylistMenu, onRemoveSongFromPlaylist } = callbacks;

  container.querySelectorAll('.song-row').forEach(row => {
    const songId = parseInt(row.dataset.songId);
    const song = songs.find(s => s.id === songId);

    // Play Triggers (Play Icon click, Title click)
    const playTriggerElements = row.querySelectorAll('.td-play-icon, .td-title-name');
    playTriggerElements.forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onPlaySong(song, songs);
      });
    });

    // Artist navigation
    row.querySelector('.td-title-artist').addEventListener('click', (e) => {
      e.stopPropagation();
      const artistId = e.currentTarget.dataset.artistId;
      onNavigate('artist', artistId);
    });

    // Album navigation
    row.querySelector('.td-album').addEventListener('click', (e) => {
      e.stopPropagation();
      const albumId = e.currentTarget.dataset.albumId;
      onNavigate('album', albumId);
    });

    // Like button toggle
    row.querySelector('[data-action="like"]').addEventListener('click', (e) => {
      e.stopPropagation();
      onToggleLike(songId);
    });

    // Add / Remove from playlist
    const actionBtn = row.querySelector('[data-action="add"], [data-action="remove"]');
    if (actionBtn) {
      actionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (actionBtn.dataset.action === 'remove') {
          onRemoveSongFromPlaylist(songId);
        } else {
          onOpenPlaylistMenu(e.currentTarget, songId);
        }
      });
    }
  });
};

/**
 * -------------------------------------------------------------
 * ALBUM DETAILS VIEW
 * -------------------------------------------------------------
 */
export const renderAlbum = (container, albumData, callbacks) => {
  const { album, songs } = albumData;
  const { likedIds, onPlaySong, onNavigate } = callbacks;

  const gradient = getHeroGradient(album.title);
  
  container.innerHTML = `
    <div class="view-hero" style="background: ${gradient}">
      <div class="hero-img-container">
        <img src="${album.cover_url}" alt="${album.title}">
      </div>
      <div class="hero-details">
        <span class="hero-type">Album</span>
        <h1 class="hero-title">${album.title}</h1>
        <div class="hero-meta">
          <span class="artist-nav-link" style="cursor:pointer;" id="hero-artist-link">${album.artist_name}</span>
          <span class="hero-meta-muted">•</span>
          <span class="hero-meta-muted">${album.release_year}</span>
          <span class="hero-meta-muted">•</span>
          <span class="hero-meta-muted">${songs.length} song${songs.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>

    <div class="view-action-bar">
      <button class="play-main-btn" id="album-play-btn"><i class="bx bx-play" style="margin-left: 2px;"></i></button>
    </div>

    <!-- Song Table List -->
    ${renderSongsTableHTML(songs, likedIds, false)}
  `;

  // Attach artist link click
  const artistLink = container.querySelector('#hero-artist-link');
  if (artistLink) {
    artistLink.addEventListener('click', () => {
      onNavigate('artist', album.artist_id);
    });
  }

  // Play whole album button
  const albumPlayBtn = container.querySelector('#album-play-btn');
  if (albumPlayBtn && songs.length > 0) {
    albumPlayBtn.addEventListener('click', () => {
      onPlaySong(songs[0], songs);
    });
  }

  // Bind individual song row events
  bindSongsTableEvents(container, songs, callbacks);
};

/**
 * -------------------------------------------------------------
 * ARTIST PROFILE VIEW
 * -------------------------------------------------------------
 */
export const renderArtist = (container, artistData, callbacks) => {
  const { artist, albums, songs } = artistData;
  const { likedIds, onPlaySong, onNavigate } = callbacks;

  const gradient = getHeroGradient(artist.name);

  container.innerHTML = `
    <div class="view-hero" style="background: ${gradient}; min-height: 280px; align-items: center; padding: 40px 0 24px 0;">
      <div class="hero-img-container" style="border-radius: 50%; width: 200px; height: 200px;">
        <img src="${artist.image_url}" alt="${artist.name}" style="border-radius: 50%;">
      </div>
      <div class="hero-details">
        <span class="hero-type">Artist</span>
        <h1 class="hero-title" style="font-size: 72px; margin-bottom: 8px;">${artist.name}</h1>
        <p style="color: var(--color-text-muted); font-size: 14px; line-height: 1.6; max-width: 600px; margin-bottom: 12px; font-style: italic;">
          "${artist.bio || 'No biography details available.'}"
        </p>
      </div>
    </div>

    <div class="view-action-bar">
      <button class="play-main-btn" id="artist-play-btn"><i class="bx bx-play" style="margin-left: 2px;"></i></button>
    </div>

    <!-- Popular songs (Top Songs) -->
    <div class="section-container" style="margin-bottom: 40px;">
      <h2 class="section-title">Popular Tracks</h2>
      ${renderSongsTableHTML(songs, likedIds, false)}
    </div>

    <!-- Artist Albums -->
    <div class="section-container">
      <h2 class="section-title">Albums</h2>
      <div class="cards-grid">
        ${albums.map(album => `
          <div class="music-card" data-action="album" data-id="${album.id}">
            <div class="card-img-container">
              <img src="${album.cover_url}" class="card-img" alt="${album.title}">
              <button class="card-play-btn" data-album-id="${album.id}">
                <i class="bx bx-play" style="margin-left: 2px;"></i>
              </button>
            </div>
            <div class="card-title">${album.title}</div>
            <div class="card-desc">${album.release_year} • Album</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Play all songs
  const artistPlayBtn = container.querySelector('#artist-play-btn');
  if (artistPlayBtn && songs.length > 0) {
    artistPlayBtn.addEventListener('click', () => {
      onPlaySong(songs[0], songs);
    });
  }

  // Navigate to album cards
  container.querySelectorAll('.cards-grid .music-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-play-btn')) return;
      const action = card.dataset.action;
      const id = card.dataset.id;
      onNavigate(action, id);
    });
  });

  // Play button on album card overlays
  container.querySelectorAll('.card-play-btn[data-album-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const albumId = parseInt(btn.dataset.albumId);
      onNavigate('album', albumId, { autoPlay: true });
    });
  });

  // Bind popular songs table events
  bindSongsTableEvents(container, songs, callbacks);
};

/**
 * -------------------------------------------------------------
 * PLAYLIST DETAILS VIEW
 * -------------------------------------------------------------
 */
export const renderPlaylist = (container, playlistData, callbacks) => {
  const { playlist, songs } = playlistData;
  const { likedIds, onPlaySong, onEditPlaylist, onDeletePlaylist } = callbacks;

  const gradient = getHeroGradient(playlist.name);
  const totalSeconds = songs.reduce((acc, s) => acc + s.duration, 0);
  const totalDurationStr = formatTime(totalSeconds);

  container.innerHTML = `
    <div class="view-hero" style="background: ${gradient}">
      <div class="hero-img-container">
        <img src="${playlist.cover_url}" alt="${playlist.name}">
      </div>
      <div class="hero-details">
        <span class="hero-type">Playlist</span>
        
        <!-- Editable playlist name and description -->
        <h1 class="hero-title" id="playlist-title-display">${playlist.name}</h1>
        <p style="color: var(--color-text-muted); font-size: 14px; margin-bottom: 12px;" id="playlist-desc-display">
          ${playlist.description || 'No description provided.'}
        </p>

        <!-- Hidden edit inputs, toggleable -->
        <div id="playlist-edit-form-inline" class="hidden" style="display:flex; flex-direction:column; gap: 8px; margin-bottom: 12px; max-width: 400px;">
          <input type="text" id="edit-playlist-name-input" value="${playlist.name}" style="background-color: var(--color-light-gray); border: 1px solid var(--color-active-gray); color: #fff; padding: 6px 12px; border-radius: 4px; font-weight: bold;">
          <input type="text" id="edit-playlist-desc-input" value="${playlist.description || ''}" placeholder="Add a description" style="background-color: var(--color-light-gray); border: 1px solid var(--color-active-gray); color: #fff; padding: 6px 12px; border-radius: 4px; font-size: 13px;">
          <div style="display:flex; gap: 8px; margin-top: 4px;">
            <button class="outline-action-btn" id="btn-save-playlist-details" style="padding:4px 12px; background-color: var(--color-spotify-green); border-color:var(--color-spotify-green); color: #000;">Save</button>
            <button class="outline-action-btn" id="btn-cancel-playlist-details" style="padding:4px 12px;">Cancel</button>
          </div>
        </div>

        <div class="hero-meta">
          <span>Your Playlist</span>
          <span class="hero-meta-muted">•</span>
          <span class="hero-meta-muted">${songs.length} song${songs.length !== 1 ? 's' : ''}</span>
          <span class="hero-meta-muted">•</span>
          <span class="hero-meta-muted">${totalDurationStr}</span>
        </div>
      </div>
    </div>

    <div class="view-action-bar">
      <button class="play-main-btn" id="playlist-play-btn"><i class="bx bx-play" style="margin-left: 2px;"></i></button>
      <button class="outline-action-btn" id="btn-edit-playlist">Edit Details</button>
      <button class="outline-action-btn" id="btn-delete-playlist" style="border-color: #ff4d4d; color: #ff4d4d;">Delete</button>
    </div>

    <!-- Playlist Song Table List -->
    ${renderSongsTableHTML(songs, likedIds, true)}
  `;

  // Bind Playlist controls
  const playBtn = container.querySelector('#playlist-play-btn');
  if (playBtn && songs.length > 0) {
    playBtn.addEventListener('click', () => {
      onPlaySong(songs[0], songs);
    });
  }

  // Toggle Edit details view
  const editBtn = container.querySelector('#btn-edit-playlist');
  const deleteBtn = container.querySelector('#btn-delete-playlist');
  const titleDisplay = container.querySelector('#playlist-title-display');
  const descDisplay = container.querySelector('#playlist-desc-display');
  const editForm = container.querySelector('#playlist-edit-form-inline');
  const cancelEditBtn = container.querySelector('#btn-cancel-playlist-details');
  const saveEditBtn = container.querySelector('#btn-save-playlist-details');

  editBtn.addEventListener('click', () => {
    titleDisplay.classList.add('hidden');
    descDisplay.classList.add('hidden');
    editForm.classList.remove('hidden');
  });

  cancelEditBtn.addEventListener('click', () => {
    titleDisplay.classList.remove('hidden');
    descDisplay.classList.remove('hidden');
    editForm.classList.add('hidden');
  });

  saveEditBtn.addEventListener('click', () => {
    const newName = container.querySelector('#edit-playlist-name-input').value.trim();
    const newDesc = container.querySelector('#edit-playlist-desc-input').value.trim();
    if (newName) {
      onEditPlaylist(playlist.id, newName, newDesc);
    }
  });

  deleteBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this playlist? This cannot be undone.')) {
      onDeletePlaylist(playlist.id);
    }
  });

  // Bind songs table events (with showRemoveColumn = true)
  bindSongsTableEvents(container, songs, callbacks, true);
};

/**
 * -------------------------------------------------------------
 * LIKED SONGS VIEW
 * -------------------------------------------------------------
 */
export const renderLikedSongs = (container, likedSongs, callbacks) => {
  const { likedIds, onPlaySong } = callbacks;

  container.innerHTML = `
    <div class="view-hero" style="background: linear-gradient(to bottom, #5038a0 0%, var(--color-dark-gray) 100%)">
      <div class="hero-img-container" style="background: linear-gradient(135deg, #450ffd 0%, #c1acff 100%); display:flex; align-items:center; justify-content:center;">
        <i class="bx bxs-heart" style="font-size: 100px; color: #fff;"></i>
      </div>
      <div class="hero-details">
        <span class="hero-type">Playlist</span>
        <h1 class="hero-title">Liked Songs</h1>
        <div class="hero-meta">
          <span>Your Favorites</span>
          <span class="hero-meta-muted">•</span>
          <span class="hero-meta-muted">${likedSongs.length} song${likedSongs.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>

    <div class="view-action-bar">
      <button class="play-main-btn" id="liked-play-btn"><i class="bx bx-play" style="margin-left: 2px;"></i></button>
    </div>

    <!-- Songs Table List -->
    ${renderSongsTableHTML(likedSongs, likedIds, false)}
  `;

  // Play all liked songs
  const playBtn = container.querySelector('#liked-play-btn');
  if (playBtn && likedSongs.length > 0) {
    playBtn.addEventListener('click', () => {
      onPlaySong(likedSongs[0], likedSongs);
    });
  }

  // Bind table row events
  bindSongsTableEvents(container, likedSongs, callbacks);
};

/**
 * -------------------------------------------------------------
 * LIBRARY / SIDEBAR PLAYLISTS LIST
 * -------------------------------------------------------------
 */
export const renderSidebarPlaylists = (sidebarContainer, playlists, activePlaylistId, onSelectPlaylist) => {
  if (playlists.length === 0) {
    sidebarContainer.innerHTML = `
      <div class="auth-required-message" style="margin: 8px 0;">
        <p>No playlists created yet. Click the "+" button above to create one!</p>
      </div>
    `;
    return;
  }

  sidebarContainer.innerHTML = playlists.map(playlist => `
    <div class="library-item ${parseInt(activePlaylistId) === playlist.id ? 'active' : ''}" data-playlist-id="${playlist.id}">
      <img src="${playlist.cover_url}" class="library-item-img" alt="${playlist.name}">
      <div class="library-item-info">
        <div class="library-item-name">${playlist.name}</div>
        <div class="library-item-desc">Playlist • By You</div>
      </div>
    </div>
  `).join('');

  // Bind select playlist event
  sidebarContainer.querySelectorAll('.library-item').forEach(item => {
    item.addEventListener('click', () => {
      const playlistId = item.dataset.playlistId;
      onSelectPlaylist(playlistId);
    });
  });
};

/**
 * -------------------------------------------------------------
 * TOP NAV AUTHENTICATION PANEL
 * -------------------------------------------------------------
 */
export const renderHeaderAuth = (authContainer, user, callbacks) => {
  const { onShowLogin, onShowSignup, onLogout } = callbacks;

  if (user) {
    // Show user avatar and logout option
    authContainer.innerHTML = `
      <div class="profile-tag" id="profile-tag-menu">
        <div class="profile-avatar">${user.username[0].toUpperCase()}</div>
        <span class="profile-name">${user.username}</span>
      </div>
      <button class="outline-action-btn" id="btn-logout-action" style="padding: 6px 16px; font-size:12px;">Log out</button>
    `;

    const logoutBtn = authContainer.querySelector('#btn-logout-action');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', onLogout);
    }
  } else {
    // Show standard Login / Sign Up options
    authContainer.innerHTML = `
      <button class="btn btn-text" id="btn-show-signup-inline">Sign up</button>
      <button class="btn btn-white" id="btn-show-login-inline">Log in</button>
    `;

    authContainer.querySelector('#btn-show-signup-inline').addEventListener('click', onShowSignup);
    authContainer.querySelector('#btn-show-login-inline').addEventListener('click', onShowLogin);
  }
};
