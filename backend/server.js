const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('./tvshows.db');
app.use(cors());
app.use(bodyParser.json());
// Endpoint to fetch all TV shows
app.get('/api/shows', (req, res) => {
   db.all('SELECT * FROM shows', [], (err, rows) => {
       if (err) {
           return res.status(500).json({ error: err.message });
       }
       res.json(rows);
   });
});
// Endpoint to generate a random show based on genres
app.post('/api/random-show', (req, res) => {
   const { genres } = req.body;
   if (!genres || !Array.isArray(genres) || genres.length === 0) {
       return res.status(400).json({ error: 'Please provide an array of genres.' });
   }
   // Create placeholders for each genre
   const placeholders = genres.map(() => '?').join(',');
   const sql = `SELECT * FROM shows WHERE genre IN (${placeholders}) ORDER BY RANDOM() LIMIT 1`;
   // Execute the query with the genres array as parameters
   db.get(sql, genres, (err, row) => {
       if (err) {
           return res.status(500).json({ error: err.message });
       }
       if (!row) {
           return res.status(500).json({ message: 'No shows found for the selected genres' });
       }
       res.json(row);
   });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});