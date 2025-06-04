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
        const query = `
            SELECT
                media.url_image,
                media_tv.duration_seconds
            FROM media
            JOIN media_tv ON media.id = media_tv.media_id
            JOIN tvs ON media_tv.tv_id = tvs.id
            WHERE tvs.id = ?
        `
    db.query(
        query,
        [tv_id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    })
}