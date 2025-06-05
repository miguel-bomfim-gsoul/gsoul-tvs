import db from '../db.js';

export async function getUserEmails(req, res) {
  try {
    const [results] = await db.query('SELECT user_id, email FROM allowed_users');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}