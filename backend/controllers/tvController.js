import db from '../db.js';

export async function addTv(req, res) {
  const { name } = req.body;
  const uniqueId = Date.now();
  const tv_slug = `${name.toLocaleLowerCase().replace(/\s/g, "-")}-${uniqueId}`;

  try {
    const [result] = await db.query('INSERT INTO tvs VALUES(0, ?, ?)', [name, tv_slug]);
    res.status(201).json({ status: `Ok! Tv with id: ${result.insertId} created` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getallTVs(req, res) {
  const query = `
    SELECT
      t.id AS tv_id,
      t.name AS tv_name,
      t.tv_slug,
      m.id AS media_id,
      m.name AS media_name,
      m.url_image,
      mt.media_order,
      mt.duration_seconds,
      mt.start_time,
      mt.end_time
    FROM
      tvs t
    LEFT JOIN
      media_tv mt ON t.id = mt.tv_id
    LEFT JOIN
      media m ON m.id = mt.media_id
    ORDER BY
      mt.media_order;
  `;

  try {
    const [results] = await db.query(query);

    const tvs = {};
    results.forEach((row) => {
      const { tv_id, tv_name, tv_slug, media_id, media_name, url_image, media_order, duration_seconds, start_time, end_time } = row;

      if (!tvs[tv_id]) {
        tvs[tv_id] = {
          id: tv_id,
          tv_name,
          tv_slug,
          medias: []
        };
      }

      if (media_id) {
        tvs[tv_id].medias.push({
          id: media_id,
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getRelatedTvs(req, res) {
  const { id } = req.params;

  try {
    const [results] = await db.query('SELECT tv_id, media_order FROM media_tv WHERE media_id = ?', [id]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getTvById(req, res) {
  const { id } = req.params;

  try {
    const [results] = await db.query('SELECT * FROM tvs WHERE id = ?', [id]);
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteTv(req, res) {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM tvs WHERE id = ?', [id]);
    res.json('Tv deletada com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
