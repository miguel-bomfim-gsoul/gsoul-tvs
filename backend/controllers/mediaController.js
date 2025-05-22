import db from '../db.js';

export function addMedia (req, res) {
    const { name, url_image, media_order, duration_seconds, start_time, end_time, tv_id } = req.body;
    const query = 'INSERT INTO media VALUES (0, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, url_image, media_order, duration_seconds, start_time, end_time, tv_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(201).json({ id: result.insertId });
    });
}

export function getMediaByTv (req, res) {
    const { tv_id } = req.params;
    db.query('SELECT * FROM media WHERE tv_id = ?', [tv_id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    })
}