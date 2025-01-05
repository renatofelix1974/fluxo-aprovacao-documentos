const pool = require('../config/db');

exports.getExample = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM example');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching data', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createExample = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query('INSERT INTO example (name) VALUES ($1) RETURNING *', [name]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting data', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
