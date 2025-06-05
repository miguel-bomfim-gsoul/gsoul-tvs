import db from '../db.js';

export async function addMedia(req, res) {
  const { name, url_image, media_order, duration_seconds, start_time, end_time, tv_id } = req.body;
  const query = 'INSERT INTO media VALUES (0, ?, ?, ?, ?, ?, ?, ?)';

  try {
    const [result] = await db.query(query, [name, url_image, media_order, duration_seconds, start_time, end_time, tv_id]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getMediaByTv(req, res) {
  const { tv_id } = req.params;
  const query = `
    SELECT
      media.url_image,
      media_tv.duration_seconds
    FROM media
    JOIN media_tv ON media.id = media_tv.media_id
    JOIN tvs ON media_tv.tv_id = tvs.id
    WHERE tvs.id = ?
  `;

  try {
    const [results] = await db.query(query, [tv_id]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// fix it
export async function updateMediaOrder(req, res) {
  const { tv_id, media_id, newOrder } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `SELECT media_order FROM media_tv WHERE tv_id = ? AND media_id = ?`,
      [tv_id, media_id]
    );

    if (rows.length > 0) {
      const oldOrder = rows[0].media_order;

      await connection.query(
        `UPDATE media_tv SET media_order = -1 WHERE tv_id = ? AND media_id = ?`,
        [tv_id, media_id]
      );

      if (newOrder < oldOrder) {
        await connection.query(
          `UPDATE media_tv 
            SET media_order = media_order + 1 
            WHERE tv_id = ? 
            AND media_order IS NOT NULL
            AND media_order >= ? 
            AND media_order < ?`,
            [tv_id, newOrder, oldOrder]
        );
      } else if (newOrder > oldOrder) {
        await connection.query(
        `UPDATE media_tv 
          SET media_order = media_order - 1 
          WHERE tv_id = ? 
          AND media_order IS NOT NULL
          AND media_order > ? 
          AND media_order <= ?`,
          [tv_id, oldOrder, newOrder]
        );
      }

      await connection.query(
        `UPDATE media_tv SET media_order = ? WHERE tv_id = ? AND media_id = ?`,
        [newOrder, tv_id, media_id]
      );
    }

    await connection.commit();

    const [updatedList] = await connection.query(
      `SELECT * FROM media_tv WHERE tv_id = ? ORDER BY media_order`,
      [tv_id]
    );

    res.json({ success: true, updatedList });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    connection.release();
  }
}