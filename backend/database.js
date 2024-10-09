const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tvshows.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS shows (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        genre TEXT NOT NULL,
        year INTEGER
    )`);

    const sampleShows = [
        { title: 'Friends', description: 'Six young men and women live in the same apartment complex and face life and love together in Manhattan, New York City.', genre: 'Comedy', year: 1994 },
        { title: 'Supernatural', description: 'This haunting series follows the thrilling yet terrifying journeys of Sam and Dean Winchester, two brothers who face an increasingly sinister landscape as they hunt monsters.', genre: 'Fantasy', year: 2005 },
        { title: 'The Big Bang Theory', description: 'A group of nerdy friends navigate life and relationships in a quirky way', genre: 'Comedy', year: 2007 }
    ];

    const stmt = db.prepare(`INSERT INTO shows (title, description, genre, year) VALUES (?, ?, ?, ?)`);
    sampleShows.forEach(show => {
        stmt.run(show.title, show.description, show.genre, show.year);
    });
    stmt.finalize();
});

db.close((err) =>{
    if (err) {
        console.error('Error closing the database:', err.message);
    } else {
        console.log('Database conection closed.');
    }
});
