const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/auth');

// @route   GET /api/playlists
// @desc    Get current user's playlists
router.get('/', protect, async (req, res) => {
  try {
    const playlists = await db.query(
      'SELECT * FROM playlists WHERE user_id = $1 ORDER BY id DESC',
      [req.user.id]
    );
    res.json(playlists.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error retrieving playlists' });
  }
});

// @route   GET /api/playlists/:id
// @desc    Get playlist details and its songs
router.get('/:id', protect, async (req, res) => {
  const playlistId = req.params.id;
  try {
    // Get Playlist info
    const playlistResult = await db.query('SELECT * FROM playlists WHERE id = $1', [playlistId]);
    if (playlistResult.rows.length === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    const playlist = playlistResult.rows[0];

    // Get songs in this playlist
    const queryText = `
      SELECT s.id, s.title, s.duration, s.song_url, 
             al.title AS album_title, al.cover_url, 
             ar.name AS artist_name, ar.id AS artist_id, al.id AS album_id,
             ps.position
      FROM playlist_songs ps
      JOIN songs s ON ps.song_id = s.id
      LEFT JOIN albums al ON s.album_id = al.id
      LEFT JOIN artists ar ON al.artist_id = ar.id
      WHERE ps.playlist_id = $1
      ORDER BY ps.position ASC
    `;
    const songsResult = await db.query(queryText, [playlistId]);

    res.json({
      playlist,
      songs: songsResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error retrieving playlist details' });
  }
});

// @route   POST /api/playlists
// @desc    Create a new playlist
router.post('/', protect, async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Playlist name is required' });
  }

  // Generate a solid color gradient for default cover URL
  const defaultCovers = [
    '/uploads/images/ocean_breeze.svg',
    '/uploads/images/dark_mode.svg',
    '/uploads/images/neon_city.svg'
  ];
  const coverUrl = defaultCovers[Math.floor(Math.random() * defaultCovers.length)];

  try {
    const result = await db.query(
      'INSERT INTO playlists (name, description, user_id, cover_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description || '', req.user.id, coverUrl]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating playlist' });
  }
});

// @route   PUT /api/playlists/:id
// @desc    Update playlist details
router.put('/:id', protect, async (req, res) => {
  const playlistId = req.params.id;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Playlist name is required' });
  }

  try {
    // Verify ownership
    const playlistCheck = await db.query('SELECT * FROM playlists WHERE id = $1 AND user_id = $2', [playlistId, req.user.id]);
    if (playlistCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to edit this playlist' });
    }

    const result = await db.query(
      'UPDATE playlists SET name = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [name, description, playlistId, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating playlist' });
  }
});

// @route   DELETE /api/playlists/:id
// @desc    Delete a playlist
router.delete('/:id', protect, async (req, res) => {
  const playlistId = req.params.id;
  try {
    // Verify ownership
    const playlistCheck = await db.query('SELECT * FROM playlists WHERE id = $1 AND user_id = $2', [playlistId, req.user.id]);
    if (playlistCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to delete this playlist' });
    }

    await db.query('DELETE FROM playlists WHERE id = $1 AND user_id = $2', [playlistId, req.user.id]);
    res.json({ message: 'Playlist deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting playlist' });
  }
});

// @route   POST /api/playlists/:id/songs
// @desc    Add a song to a playlist
router.post('/:id/songs', protect, async (req, res) => {
  const playlistId = req.params.id;
  const { songId } = req.body;

  if (!songId) {
    return res.status(400).json({ error: 'Song ID is required' });
  }

  try {
    // Verify playlist ownership
    const playlistCheck = await db.query('SELECT * FROM playlists WHERE id = $1 AND user_id = $2', [playlistId, req.user.id]);
    if (playlistCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to edit this playlist' });
    }

    // Check if song is already in playlist
    const songCheck = await db.query(
      'SELECT * FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      [playlistId, songId]
    );
    if (songCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Song is already in this playlist' });
    }

    // Get the maximum position to append the song
    const posResult = await db.query(
      'SELECT COALESCE(MAX(position), 0) as max_pos FROM playlist_songs WHERE playlist_id = $1',
      [playlistId]
    );
    const nextPos = posResult.rows[0].max_pos + 1;

    // Insert song
    await db.query(
      'INSERT INTO playlist_songs (playlist_id, song_id, position) VALUES ($1, $2, $3)',
      [playlistId, songId, nextPos]
    );

    res.json({ message: 'Song added to playlist successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error adding song to playlist' });
  }
});

// @route   DELETE /api/playlists/:id/songs/:songId
// @desc    Remove a song from a playlist
router.delete('/:id/songs/:songId', protect, async (req, res) => {
  const playlistId = req.params.id;
  const songId = req.params.songId;

  try {
    // Verify playlist ownership
    const playlistCheck = await db.query('SELECT * FROM playlists WHERE id = $1 AND user_id = $2', [playlistId, req.user.id]);
    if (playlistCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to edit this playlist' });
    }

    const deleteResult = await db.query(
      'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      [playlistId, songId]
    );

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ error: 'Song not found in playlist' });
    }

    res.json({ message: 'Song removed from playlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error removing song from playlist' });
  }
});

module.exports = router;
