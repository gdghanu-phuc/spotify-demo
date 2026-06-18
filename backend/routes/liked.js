const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/auth');

// @route   GET /api/liked
// @desc    Get user's liked songs
router.get('/', protect, async (req, res) => {
  try {
    const queryText = `
      SELECT s.id, s.title, s.duration, s.song_url, 
             al.title AS album_title, al.cover_url, 
             ar.name AS artist_name, ar.id AS artist_id, al.id AS album_id
      FROM liked_songs ls
      JOIN songs s ON ls.song_id = s.id
      LEFT JOIN albums al ON s.album_id = al.id
      LEFT JOIN artists ar ON al.artist_id = ar.id
      WHERE ls.user_id = $1
      ORDER BY ls.created_at DESC
    `;
    const result = await db.query(queryText, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error retrieving liked songs' });
  }
});

// @route   GET /api/liked/ids
// @desc    Get an array of IDs of the user's liked songs (useful for UI active state)
router.get('/ids', protect, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT song_id FROM liked_songs WHERE user_id = $1',
      [req.user.id]
    );
    // Map array of objects to array of song IDs
    const ids = result.rows.map(row => row.song_id);
    res.json(ids);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error retrieving liked song IDs' });
  }
});

// @route   POST /api/liked
// @desc    Like a song (add to liked_songs table)
router.post('/', protect, async (req, res) => {
  const { songId } = req.body;
  if (!songId) {
    return res.status(400).json({ error: 'Song ID is required' });
  }

  try {
    // Verify song exists
    const songCheck = await db.query('SELECT * FROM songs WHERE id = $1', [songId]);
    if (songCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Song not found' });
    }

    // Insert liked song relation (ON CONFLICT DO NOTHING handles duplicate likes safely)
    await db.query(
      'INSERT INTO liked_songs (user_id, song_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, songId]
    );

    res.json({ message: 'Song liked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error liking song' });
  }
});

// @route   DELETE /api/liked/:songId
// @desc    Unlike a song (remove from liked_songs table)
router.delete('/:songId', protect, async (req, res) => {
  const songId = req.params.songId;
  try {
    const result = await db.query(
      'DELETE FROM liked_songs WHERE user_id = $1 AND song_id = $2',
      [req.user.id, songId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Song was not liked by this user' });
    }

    res.json({ message: 'Song unliked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error unliking song' });
  }
});

module.exports = router;
