const pool = require('./db');

// Criar novo usuário
async function createUser(fullName, username, password, email, cpf, role) {
  const query = `
    INSERT INTO users (full_name, username, password, email, cpf, role)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const values = [fullName, username, password, email, cpf, role];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Buscar todos os usuários
async function getAllUsers() {
  const query = `SELECT id, full_name, username, email, cpf, role FROM users;`;
  const result = await pool.query(query);
  return result.rows;
}

// Atualizar senha
async function resetPassword(userId, newPassword) {
  const query = `
    UPDATE users
    SET password = $1
    WHERE id = $2 RETURNING *;
  `;
  const values = [newPassword, userId];
  const result = await pool.query(query, values);
  return result.rows[0];
}

module.exports = { createUser, getAllUsers, resetPassword };
