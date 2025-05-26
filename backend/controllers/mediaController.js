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
    const { tv_slug } = req.params;
        const query = `
        SELECT
            media.url_image AS url,
            tvs.id AS tv_id,
            tvs.name AS tv_name,
            tvs.tv_slug
        FROM media
        JOIN tvs ON media.tv_id = tvs.id
        WHERE tvs.tv_slug = ?
        `
    db.query(
        query,
        [tv_slug], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    })
}