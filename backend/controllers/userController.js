import db from '../db.js';

export async function getUserEmails (req, res) {
    const query = `SELECT user_id, email FROM allowed_users`
        db.query(
        query, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    })
}