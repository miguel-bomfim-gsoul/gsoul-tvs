import db from '../db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getAllMedias(req, res) {
  const { p } = req.query || 1; // page
  const limit = req.query.limit ? parseInt(req.query.limit) : null;
  const offset = limit ? (p - 1) * limit : 0;

  const query = `
    SELECT
      m.id AS media_id,
      m.name,
      m.url_image,
      mt.tv_id,
      mt.start_time,
      mt.end_time
    FROM media m
    LEFT JOIN (
        SELECT *
        FROM media_tv
        WHERE id IN (
            SELECT MIN(id)
            FROM media_tv
            GROUP BY media_id
        )
    ) mt ON m.id = mt.media_id
    LEFT JOIN tvs ON mt.tv_id = tvs.id
    ${limit ? 'LIMIT ? OFFSET ?' : ''};
  `;

  const queryParams = limit ? [limit, offset] : [];

  try {
    const [results] = await db.query(query, queryParams);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

  export async function uploadMedia(req, res) {
    try {
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const fileNames = files.map(file => file.filename);
      res.status(201).json({ fileNames });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

export async function addMultipleMediaToTv(req, res) {
  const { mediaFiles, tv_id, duration_seconds = 10, start_time = null, end_time = null } = req.body;

  if (!Array.isArray(mediaFiles) || !tv_id) {
    return res.status(400).json({ error: 'Missing required data' });
  }

  const formattedStartTime = start_time ? new Date(start_time) : null;
  const formattedEndTime = end_time ? new Date(end_time) : null;

  const mediaQuery = 'INSERT INTO media (name, url_image) VALUES ?';
  const mediaTvQuery = 'INSERT INTO media_tv (media_id, tv_id, media_order, duration_seconds, start_time, end_time) VALUES ?';

  const mediaValues = mediaFiles.map(f => [f.name, `assets/${f.uploadedFileName}`]);

  try {
    const [mediaInsertResult] = await db.query(mediaQuery, [mediaValues]);

    const insertedMediaIdStart = mediaInsertResult.insertId;

    const mediaTvValues = mediaFiles.map((f, i) => [
      insertedMediaIdStart + i,
      tv_id,
      f.media_order ?? i + 1,
      f.duration_seconds ?? duration_seconds,
      formattedStartTime,
      formattedEndTime
    ]);

    await db.query(mediaTvQuery, [mediaTvValues]);

    res.status(201).json({ inserted: mediaFiles.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function addMultipleMedia(req, res) {
  const { fileNames } = req.body;

  if (!Array.isArray(fileNames) || fileNames.length === 0) {
    return res.status(400).json({ error: 'No file names provided' });
  }

  const values = fileNames.map(name => [name, `assets/${name}`]);

  try {
    const [result] = await db.query(
      'INSERT INTO media (name, url_image) VALUES ?',
      [values]
    );
    res.status(201).json({ inserted: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function relateMediaTv(req, res) {
  let { media_id, tv_ids, unselectedTvsIds } = req.body;
  if (!Array.isArray(tv_ids)) {
    tv_ids = tv_ids != null ? [tv_ids] : [];
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [[mediaExists]] = await connection.query(
      `SELECT COUNT(*) AS count FROM media WHERE id = ?`,
      [media_id]
    );

    if (mediaExists.count === 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Mídia inexistente. dá um F5 aí :)' });
    }

    // Buscar relacionamentos já existentes
    const [existingRelations] = await connection.query(
      `SELECT tv_id FROM media_tv WHERE media_id = ?`,
      [media_id]
    );
    const existingTvIds = existingRelations.map(r => r.tv_id);

    // Determinar quais são novas relações
    const newTvIds = tv_ids.filter(tvId => !existingTvIds.includes(tvId));

    // Inserir apenas os novos relacionamentos
    const values = [];
    for (const tvId of newTvIds) {
      const [[{ nextOrder }]] = await connection.query(
        `SELECT COALESCE(MAX(media_order), 0) + 1 AS nextOrder FROM media_tv WHERE tv_id = ?`,
        [tvId]
      );
      values.push([media_id, tvId, nextOrder]);
    }

    if (values.length > 0) {
      const placeholders = values.map(() => '(?, ?, ?)').join(', ');
      const flatValues = values.flat();
      await connection.query(
        `INSERT INTO media_tv (media_id, tv_id, media_order) VALUES ${placeholders}`,
        flatValues
      );
    }

    // Deletar relações desmarcadas
    if (unselectedTvsIds.length > 0) {
      const placeholders = unselectedTvsIds.map(() => '?').join(', ');
      await connection.query(
        `DELETE FROM media_tv WHERE media_id = ? AND tv_id IN (${placeholders})`,
        [media_id, ...unselectedTvsIds]
      );

      // Reordenar as mídias para as TVs afetadas
      for (const tvId of unselectedTvsIds) {
        const [medias] = await connection.query(
          `SELECT media_id FROM media_tv WHERE tv_id = ? ORDER BY media_order`,
          [tvId]
        );

        for (let i = 0; i < medias.length; i++) {
          await connection.query(
            `UPDATE media_tv SET media_order = ? WHERE tv_id = ? AND media_id = ?`,
            [i + 1, tvId, medias[i].media_id]
          );
        }
      }
    }

    await connection.commit();
    res.status(201).json();
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
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
    AND media_tv.is_active = 1
    ORDER BY media_tv.media_order;
  `;

  try {
    const [results] = await db.query(query, [tv_id]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateDate(req, res) {
  const { start_time, end_time, media_id, tv_id } = req.body

  let fields = [];
  let values = [];

  if (start_time) {
    fields.push('start_time = ?');
    values.push(new Date(start_time));
  }

  if (end_time) {
    fields.push('end_time = ?');
    values.push(new Date(end_time));
  }

  values.push(media_id, tv_id); 

  const query = `
    UPDATE media_tv
    SET ${fields.join(', ')}
    WHERE media_id = ?
    AND tv_id = ?
  `;

  try {
    const [results] = await db.query(query, values);

    await db.query(`
      UPDATE media_tv
      SET is_active = (
        CASE
          WHEN start_time IS NOT NULL
            AND (end_time IS NULL OR NOW() <= end_time)
            AND NOW() >= start_time
          THEN TRUE
          ELSE FALSE
        END
      )
    `);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json();
  }
}

export async function updateMediaOrder(req, res) {
  const { tv_id, media_id, newOrder } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `SELECT media_order, media_id FROM media_tv WHERE tv_id = ?`,
      [tv_id]
    );

    if (rows.length > 0) {
      
      const oldOrder = rows.find((media) => media.media_id === media_id).media_order;

      if (newOrder < oldOrder) {
        await connection.query(
          `UPDATE media_tv 
            SET media_order = media_order + 1 
            WHERE tv_id = ? 
            AND media_order IS NOT NULL
            AND media_order >= ?
            AND media_id != ?
            AND media_order < ?
            `,
            [tv_id, newOrder, media_id, oldOrder]
        );
      } else if (newOrder > oldOrder) {
        await connection.query(
        `UPDATE media_tv 
          SET media_order = media_order - 1 
          WHERE tv_id = ? 
          AND media_order IS NOT NULL
          AND media_order <= ? 
          AND media_id != ?
          AND media_order > ?
          `,
          [tv_id, newOrder, media_id, oldOrder]
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

export async function deleteMedia(req, res) {
  const { media_id } = req.params;

  try {
    const [media] = await db.query('SELECT * FROM media WHERE id = ?', [media_id]);
    if (!media.length) return res.status(404).json({ error: 'Mídia não encontrada' });

    const fileName = media[0].url_image;
    const filePath = path.join(__dirname, '..', fileName);

    const [mediaTvEntries] = await db.query('SELECT * FROM media_tv WHERE media_id = ?', [media_id]);

    for (const entry of mediaTvEntries) {
      const { tv_id, media_order } = entry;

      await db.query(
        `UPDATE media_tv 
         SET media_order = media_order - 1
         WHERE tv_id = ? 
         AND media_order > ?`,
        [tv_id, media_order]
      );
    }

    await db.query('DELETE FROM media_tv WHERE media_id = ?', [media_id]);

    await db.query('DELETE FROM media WHERE id = ?', [media_id]);

        if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.json('Mídia deletada com sucesso');
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}