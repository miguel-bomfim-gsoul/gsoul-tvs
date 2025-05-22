import db from '../db.js';

export async function addTv (req, res){
    const { name } = req.body;
    db.query('INSERT INTO tvs VALUES(0, ?)', [name], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(201).json({ status: `Ok! Tv with id: ${result.insertId} created` });
    })
}

export async function getallTVs (req, res) {
    db.query('SELECT * FROM tvs', (err, results) => {
        if (err) return res.staturs(500).json({ error: err });
        res.json(results);
    })
}

export async function getTvById (req, res){
    const { id } = req.params;
    db.query('SELECT * FROM tvs WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results[0]);
    })
}
