const pool = require('./db');

async function createUser(username, email, password, role = 'user') {
  const query = `
    INSERT INTO users (username, email, password, role)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;
  const values = [username, email, password, role];

  const result = await pool.query(query, values);
  return result.rows[0];
}

module.exports = { createUser };
