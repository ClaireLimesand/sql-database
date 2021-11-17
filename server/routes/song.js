const express = require('express');
const router = express.Router();

const pg = require('pg');

const Pool = pg.Pool;

const pool = new Pool({
    database: 'jazzy_sql',
    host: 'localhost', 
});

pool.on('connect', () => {
    console.log('Postgresql connected');
});

pool.on('error', (error) => {
    console.log('Error with postgres pool', error)
});

router.get('/', (req, res) => {
    const sqlText = 'SELECT * FROM song;'
    pool.query(sqlText)
        .then((dbRes) => {
            const songsFromDb = dbRes.rows;
            res.send(songsFromDb)
        }).catch((dbErr) => {
        console.error(dbErr);
    });
});

router.post('/', (req, res) => {
    const newSong = req.body;
    const sqlText = (`
    INSERT INTO "song"
        ("title", "length", "released")
    VALUES
        ($1, $2, $3);
    `)
    const sqlValues = [
        newSong.title,
        newSong.length,
        newSong.released,
    ]
    console.log(sqlText)
    pool.query(sqlText, sqlValues)
    .then((dbRes) => {
        res.sendStatus(201);
    })
    .catch((dbErr) => {
        console.error(dbErr);
    })
});

module.exports = router;