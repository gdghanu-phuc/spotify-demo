/**
 * Spotify Clone - Custom Audio Player Manager
 */
class AudioPlayer {
  constructor() {
    this.audio = new Audio();
    this.playlist = [];       // Array of song objects
    this.currentIndex = -1;   // Index of current song in playlist
    this.isPlaying = false;
    
    // Playback modes
    this.isShuffle = false;
    this.isRepeat = 'none';   // 'none', 'track', 'playlist'
    this.originalPlaylist = []; // Keep reference for disabling shuffle
    
    // Default Volume
    this.volume = 0.7;
    this.audio.volume = this.volume;
    this.isMuted = false;

    // Callbacks registered by main app for UI updates
    this.onTrackChange = null;
    this.onPlayStateChange = null;
    this.onTimeUpdate = null;
    this.onQueueEnd = null;

    // Set up internal listeners
    this.initAudioListeners();
  }

  initAudioListeners() {
    // Audio progress updater
    this.audio.addEventListener('timeupdate', () => {
      if (this.onTimeUpdate && this.audio.duration) {
        const current = this.audio.currentTime;
        const duration = this.audio.duration;
        const percent = (current / duration) * 100;
        this.onTimeUpdate(current, duration, percent);
      }
    });

    // Auto-advance song on end
    this.audio.addEventListener('ended', () => {
      this.handleSongEnded();
    });

    // Handle audio errors gracefully
    this.audio.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      this.isPlaying = false;
      if (this.onPlayStateChange) this.onPlayStateChange(false);
    });
  }

  // Set the playlist and select a track index
  setPlaylist(songs, startIndex = 0) {
    if (!songs || songs.length === 0) return;
    
    this.playlist = [...songs];
    this.originalPlaylist = [...songs];
    this.currentIndex = startIndex;

    if (this.isShuffle) {
      this.shufflePlaylist(startIndex);
    }
  }

  // Play a song at the current index
  loadAndPlayCurrent() {
    if (this.currentIndex < 0 || this.currentIndex >= this.playlist.length) return;
    
    const track = this.playlist[this.currentIndex];
    
    // Set audio source (Vite proxy resolves /uploads correctly)
    this.audio.src = track.song_url;
    this.audio.load();
    
    // Start playback
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          if (this.onPlayStateChange) this.onPlayStateChange(true);
          if (this.onTrackChange) this.onTrackChange(track);
        })
        .catch(err => {
          console.warn('Playback blocked or failed. User interaction required.', err);
          this.isPlaying = false;
          if (this.onPlayStateChange) this.onPlayStateChange(false);
        });
    }
  }

  // Direct play from a playlist
  playTrack(track, playlist) {
    if (playlist && playlist.length > 0) {
      const idx = playlist.findIndex(s => s.id === track.id);
      this.setPlaylist(playlist, idx !== -1 ? idx : 0);
    } else {
      this.setPlaylist([track], 0);
    }
    this.loadAndPlayCurrent();
  }

  // Toggle playback play/pause
  togglePlay() {
    if (this.currentIndex === -1) {
      // If no track is selected, do nothing
      return;
    }

    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      this.audio.play().catch(() => {});
      this.isPlaying = true;
    }

    if (this.onPlayStateChange) this.onPlayStateChange(this.isPlaying);
  }

  // Play next track
  next() {
    if (this.playlist.length === 0) return;

    if (this.isRepeat === 'track') {
      // Just restart current song
      this.audio.currentTime = 0;
      this.audio.play().catch(() => {});
      return;
    }

    this.currentIndex++;

    if (this.currentIndex >= this.playlist.length) {
      if (this.isRepeat === 'playlist') {
        this.currentIndex = 0;
      } else {
        this.currentIndex = this.playlist.length - 1;
        this.isPlaying = false;
        this.audio.pause();
        if (this.onPlayStateChange) this.onPlayStateChange(false);
        if (this.onQueueEnd) this.onQueueEnd();
        return;
      }
    }

    this.loadAndPlayCurrent();
  }

  // Play previous track
  prev() {
    if (this.playlist.length === 0) return;

    // Restart track if played more than 3 seconds
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }

    this.currentIndex--;

    if (this.currentIndex < 0) {
      if (this.isRepeat === 'playlist') {
        this.currentIndex = this.playlist.length - 1;
      } else {
        this.currentIndex = 0;
      }
    }

    this.loadAndPlayCurrent();
  }

  // Toggle Shuffle mode
  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    
    if (this.playlist.length === 0) return this.isShuffle;

    const currentTrack = this.playlist[this.currentIndex];

    if (this.isShuffle) {
      // Shuffle the list but keep current playing track at its index
      this.shufflePlaylist(this.currentIndex);
    } else {
      // Return to original order, find the current track in it
      const originalIdx = this.originalPlaylist.findIndex(t => t.id === currentTrack.id);
      this.playlist = [...this.originalPlaylist];
      this.currentIndex = originalIdx !== -1 ? originalIdx : 0;
    }

    return this.isShuffle;
  }

  shufflePlaylist(keepIndex) {
    const currentTrack = this.playlist[keepIndex];
    const rest = this.playlist.filter((_, i) => i !== keepIndex);
    
    // Fisher-Yates shuffle algorithm
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }

    this.playlist = [currentTrack, ...rest];
    this.currentIndex = 0;
  }

  // Toggle Repeat mode: 'none' -> 'playlist' -> 'track' -> 'none'
  toggleRepeat() {
    if (this.isRepeat === 'none') {
      this.isRepeat = 'playlist';
    } else if (this.isRepeat === 'playlist') {
      this.isRepeat = 'track';
    } else {
      this.isRepeat = 'none';
    }
    return this.isRepeat;
  }

  // Handle song ended
  handleSongEnded() {
    if (this.isRepeat === 'track') {
      this.audio.currentTime = 0;
      this.audio.play().catch(() => {});
    } else {
      this.next();
    }
  }

  // Seek current audio to percentage
  seek(percent) {
    if (!this.audio.duration) return;
    const time = (percent / 100) * this.audio.duration;
    this.audio.currentTime = time;
  }

  // Set audio volume (0.0 to 1.0)
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (!this.isMuted) {
      this.audio.volume = this.volume;
    }
  }

  // Toggle mute state
  toggleMute() {
    this.isMuted = !this.isMuted;
    this.audio.muted = this.isMuted;
    return this.isMuted;
  }

  // Helper: Format seconds to M:SS
  static formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
}

export default AudioPlayer;
