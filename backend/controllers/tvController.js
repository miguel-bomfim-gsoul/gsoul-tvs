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
            media.url_image,
            media.media_order 
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
            const { tv_id, name, tv_slug, image_id, url_image, media_order } = row;

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
                    url_image,
                    media_order
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
