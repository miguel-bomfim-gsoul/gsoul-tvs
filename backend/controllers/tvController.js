import db from '../db.js';

export async function addTv (req, res){
    const { name } = req.body;
    const tv_slug = name.toLocaleLowerCase().replace(/\s/g, "-");
    db.query('INSERT INTO tvs VALUES(0, ?, ?)', [name, tv_slug], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(201).json({ status: `Ok! Tv with id: ${result.insertId} created` });
    })
}

export async function getallTVs (req, res) {
    const query = `
        SELECT
            tvs.id AS tv_id,    
            tvs.name,
            tvs.tv_slug,
            media.id AS image_id,
            media.name AS media_name,
            media.url_image,
            media.media_order,
            media.duration_seconds,
            media.start_time,
            media.end_time
        FROM tvs
        LEFT JOIN
            media ON media.tv_id = tvs.id
        ORDER BY
            tvs.id, image_id
    `
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err });

        const tvs = {};
        results.forEach((row) => {
            const { tv_id, name, tv_slug, image_id, media_name, url_image, media_order, duration_seconds, start_time, end_time } = row;

            if (!tvs[tv_id]) {
                tvs[tv_id] = {
                    id: tv_id,
                    name,
                    tv_slug,
                    images: []
                };
            }

            if (image_id) {
                tvs[tv_id].images.push({
                    id: image_id,
                    media_name,
                    url_image,
                    media_order,
                    duration_seconds,
                    start_time,
                    end_time
                });
            }
        });
        res.json(Object.values(tvs));
    })
}

export async function getTvById (req, res){
    const { id } = req.params;
    db.query('SELECT * FROM tvs WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results[0]);
    })
}

export async function deleteTv (req, res){
    const { id } = req.params;
    db.query('DELETE FROM tvs WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json('Tv deletada com sucesso!');
    })
}
