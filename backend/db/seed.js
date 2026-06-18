const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// SQL Schema filepath
const schemaPath = path.join(__dirname, 'schema.sql');

// Base64 of a tiny silent MP3 file (about 1 second)
const silentMp3Base64 = 
  'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU3LjU2LjEwMAAAAAAAAAAA//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEluZm8AAAAPAAAAEgAAACwAWgCwAEEAQQBBAEEAQQBBAEEAQQBBAEEAQQBBAEEAQQBBAEEAQQBBAEEAQQBBAEEAQQBBAEEAQQBBAEEAAAADAAAAY29uZAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAADA2AAAAcAAAAMgAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAADA2AAAAcAAAAMgAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

// SVG placeholders for artist and album art
const createSvgArt = (title, color1, color2) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="grad-${title.replace(/\s+/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad-${title.replace(/\s+/g, '')})" />
  <circle cx="250" cy="220" r="100" fill="rgba(255,255,255,0.1)" />
  <polygon points="230,180 230,260 290,220" fill="#ffffff" opacity="0.9"/>
  <text x="50%" y="400" dominant-baseline="middle" text-anchor="middle" font-family="'Outfit', 'Inter', sans-serif" font-size="36" font-weight="bold" fill="#ffffff" letter-spacing="1">
    ${title}
  </text>
  <text x="50%" y="440" dominant-baseline="middle" text-anchor="middle" font-family="'Outfit', 'Inter', sans-serif" font-size="18" fill="rgba(255,255,255,0.7)">
    SPOTIFY CLONE SPECIAL
  </text>
</svg>
`;

async function seed() {
  const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  });

  try {
    console.log('Starting Database Seed...');

    // 1. Ensure upload directories exist
    const audioDir = path.join(__dirname, '..', 'public', 'uploads', 'audio');
    const imagesDir = path.join(__dirname, '..', 'public', 'uploads', 'images');

    fs.mkdirSync(audioDir, { recursive: true });
    fs.mkdirSync(imagesDir, { recursive: true });

    console.log('Created uploads directories');

    // 2. Write dummy mp3 files
    const audioBuffer = Buffer.from(silentMp3Base64, 'base64');
    const songsList = [
      'lost_in_the_waves.mp3',
      'summer_lounge.mp3',
      'compile_success.mp3',
      'infinite_loop.mp3',
      'traffic_lights.mp3',
      'rainy_streets.mp3'
    ];

    songsList.forEach(songFile => {
      fs.writeFileSync(path.join(audioDir, songFile), audioBuffer);
    });
    console.log('Created dummy MP3 audio files');

    // 3. Write SVG album and artist art
    const artsList = [
      { name: 'the_chillwaves.svg', title: 'The Chillwaves', c1: '#12c2e9', c2: '#c471ed' },
      { name: 'syntax_error.svg', title: 'Syntax Error', c1: '#f12711', c2: '#f5af19' },
      { name: 'midnight_beats.svg', title: 'Midnight Beats', c1: '#8a2387', c2: '#e94057' },
      { name: 'ocean_breeze.svg', title: 'Ocean Breeze', c1: '#00c6ff', c2: '#0072ff' },
      { name: 'dark_mode.svg', title: 'Dark Mode', c1: '#3a7bd5', c2: '#3a6073' },
      { name: 'neon_city.svg', title: 'Neon City', c1: '#f953c6', c2: '#b91d73' }
    ];

    artsList.forEach(art => {
      fs.writeFileSync(path.join(imagesDir, art.name), createSvgArt(art.title, art.c1, art.c2));
    });
    console.log('Created placeholder SVG covers');

    // 4. Run database schema
    console.log('Reading schema.sql...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schemaSql);
    console.log('Executed schema.sql successfully');

    // 5. Seed data
    console.log('Inserting seed records...');

    // Seed Artists
    const artistsResult = await pool.query(`
      INSERT INTO artists (name, bio, image_url) VALUES 
      ('The Chillwaves', 'Cool and relaxing ambient vibes for study and relaxation.', '/uploads/images/the_chillwaves.svg'),
      ('Syntax Error', 'Energetic synthwave and techno tracks made by coders, for coders.', '/uploads/images/syntax_error.svg'),
      ('Midnight Beats', 'Lofi, jazz hop, and downtempo rhythms for late-night thoughts.', '/uploads/images/midnight_beats.svg')
      RETURNING id, name;
    `);
    const artists = artistsResult.rows;
    console.log('Inserted Artists:', artists);

    const chillwavesId = artists.find(a => a.name === 'The Chillwaves').id;
    const syntaxErrorId = artists.find(a => a.name === 'Syntax Error').id;
    const midnightBeatsId = artists.find(a => a.name === 'Midnight Beats').id;

    // Seed Albums
    const albumsResult = await pool.query(`
      INSERT INTO albums (title, cover_url, artist_id, release_year) VALUES 
      ('Ocean Breeze', '/uploads/images/ocean_breeze.svg', ${chillwavesId}, 2024),
      ('Dark Mode', '/uploads/images/dark_mode.svg', ${syntaxErrorId}, 2023),
      ('Neon City', '/uploads/images/neon_city.svg', ${midnightBeatsId}, 2025)
      RETURNING id, title;
    `);
    const albums = albumsResult.rows;
    console.log('Inserted Albums:', albums);

    const oceanBreezeId = albums.find(a => a.title === 'Ocean Breeze').id;
    const darkModeId = albums.find(a => a.title === 'Dark Mode').id;
    const neonCityId = albums.find(a => a.title === 'Neon City').id;

    // Seed Songs
    await pool.query(`
      INSERT INTO songs (title, duration, song_url, album_id) VALUES 
      ('Lost in the Waves', 180, '/uploads/audio/lost_in_the_waves.mp3', ${oceanBreezeId}),
      ('Summer Lounge', 210, '/uploads/audio/summer_lounge.mp3', ${oceanBreezeId}),
      ('Compile Success', 150, '/uploads/audio/compile_success.mp3', ${darkModeId}),
      ('Infinite Loop', 240, '/uploads/audio/infinite_loop.mp3', ${darkModeId}),
      ('Traffic Lights', 195, '/uploads/audio/traffic_lights.mp3', ${neonCityId}),
      ('Rainy Streets', 220, '/uploads/audio/rainy_streets.mp3', ${neonCityId});
    `);
    console.log('Inserted Songs');

    console.log('Database Seeding Completed Successfully!');
  } catch (err) {
    console.error('Error during database seed:', err);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  seed();
}
