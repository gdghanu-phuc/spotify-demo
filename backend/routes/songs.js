const express = require('express');
const router = express.Router();
const db = require('../config/db');

// @route   GET /api/songs
// @desc    Get all songs with artist and album info
router.get('/', async (req, res) => {
  try {
    const queryText = `
      SELECT s.id, s.title, s.duration, s.song_url, 
             al.title AS album_title, al.cover_url, 
             ar.name AS artist_name, ar.id AS artist_id, al.id AS album_id
      FROM songs s
      LEFT JOIN albums al ON s.album_id = al.id
      LEFT JOIN artists ar ON al.artist_id = ar.id
      ORDER BY s.id ASC
    `;
    const result = await db.query(queryText);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error retrieving songs' });
  }
});

// @route   GET /api/songs/search
// @desc    Search songs, artists, and albums
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json({ songs: [], albums: [], artists: [] });
  }

  const searchTerm = `%${q}%`;

  try {
    // 1. Search Songs
    const songsQuery = `
      SELECT s.id, s.title, s.duration, s.song_url, 
             al.title AS album_title, al.cover_url, 
             ar.name AS artist_name, ar.id AS artist_id, al.id AS album_id
      FROM songs s
      LEFT JOIN albums al ON s.album_id = al.id
      LEFT JOIN artists ar ON al.artist_id = ar.id
      WHERE s.title ILIKE $1 OR ar.name ILIKE $1 OR al.title ILIKE $1
      LIMIT 10
    `;
    const songsResult = await db.query(songsQuery, [searchTerm]);

    // 2. Search Albums
    const albumsQuery = `
      SELECT al.id, al.title, al.cover_url, al.release_year, ar.name AS artist_name
      FROM albums al
      JOIN artists ar ON al.artist_id = ar.id
      WHERE al.title ILIKE $1 OR ar.name ILIKE $1
      LIMIT 10
    `;
    const albumsResult = await db.query(albumsQuery, [searchTerm]);

    // 3. Search Artists
    const artistsQuery = `
      SELECT id, name, image_url, bio
      FROM artists
      WHERE name ILIKE $1
      LIMIT 10
    `;
    const artistsResult = await db.query(artistsQuery, [searchTerm]);

    res.json({
      songs: songsResult.rows,
      albums: albumsResult.rows,
      artists: artistsResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error searching music database' });
  }
});

// @route   GET /api/songs/albums
// @desc    Get all albums
router.get('/albums', async (req, res) => {
  try {
    const queryText = `
      SELECT al.id, al.title, al.cover_url, al.release_year, ar.name AS artist_name, ar.id AS artist_id
      FROM albums al
      JOIN artists ar ON al.artist_id = ar.id
      ORDER BY al.title ASC
    `;
    const result = await db.query(queryText);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error retrieving albums' });
  }
});

// @route   GET /api/songs/albums/:id
// @desc    Get album details and its tracks
router.get('/albums/:id', async (req, res) => {
  const albumId = req.params.id;
  try {
    // Get Album
    const albumQuery = `
      SELECT al.id, al.title, al.cover_url, al.release_year, ar.name AS artist_name, ar.id AS artist_id
      FROM albums al
      JOIN artists ar ON al.artist_id = ar.id
      WHERE al.id = $1
    `;
    const albumResult = await db.query(albumQuery, [albumId]);
    
    if (albumResult.rows.length === 0) {
      return res.status(404).json({ error: 'Album not found' });
    }

    // Get Songs in Album
    const songsQuery = `
      SELECT s.id, s.title, s.duration, s.song_url, 
             al.title AS album_title, al.cover_url, 
             ar.name AS artist_name, ar.id AS artist_id, al.id AS album_id
      FROM songs s
      LEFT JOIN albums al ON s.album_id = al.id
      LEFT JOIN artists ar ON al.artist_id = ar.id
      WHERE s.album_id = $1
      ORDER BY s.id ASC
    `;
    const songsResult = await db.query(songsQuery, [albumId]);

    res.json({
      album: albumResult.rows[0],
      songs: songsResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error retrieving album details' });
  }
});

// @route   GET /api/songs/artists
// @desc    Get all artists
router.get('/artists', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM artists ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error retrieving artists' });
  }
});

// @route   GET /api/songs/artists/:id
// @desc    Get artist profile, albums, and tracks
router.get('/artists/:id', async (req, res) => {
  const artistId = req.params.id;
  try {
    // Get Artist
    const artistResult = await db.query('SELECT * FROM artists WHERE id = $1', [artistId]);
    if (artistResult.rows.length === 0) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    // Get Albums of Artist
    const albumsQuery = 'SELECT id, title, cover_url, release_year FROM albums WHERE artist_id = $1 ORDER BY release_year DESC';
    const albumsResult = await db.query(albumsQuery, [artistId]);

    // Get Songs of Artist (via albums)
    const songsQuery = `
      SELECT s.id, s.title, s.duration, s.song_url, 
             al.title AS album_title, al.cover_url, 
             ar.name AS artist_name, ar.id AS artist_id, al.id AS album_id
      FROM songs s
      JOIN albums al ON s.album_id = al.id
      JOIN artists ar ON al.artist_id = ar.id
      WHERE ar.id = $1
      ORDER BY s.id ASC
    `;
    const songsResult = await db.query(songsQuery, [artistId]);

    res.json({
      artist: artistResult.rows[0],
      albums: albumsResult.rows,
      songs: songsResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error retrieving artist profile' });
  }
});

module.exports = router;
