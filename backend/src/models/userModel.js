const { pool } = require('../config/db');

// Create users table if it doesn't exist
const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      uucms VARCHAR(50) NOT NULL UNIQUE,
      stream VARCHAR(50),
      year INTEGER CHECK (year IN (1,2,3)),
      gender VARCHAR(10) CHECK (gender IN ('male','female')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

// Find user by email
const findByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

// Find user by UUCMS
const findByUucms = async (uucms) => {
  const result = await pool.query('SELECT * FROM users WHERE uucms = $1', [uucms]);
  return result.rows[0];
};

// Create a new user
const createUser = async ({ name, email, password, uucms, stream, year, gender }) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, uucms, stream, year, gender)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, email, uucms, stream, year, gender, created_at`,
    [name, email, password, uucms, stream, parseInt(year), gender]
  );
  return result.rows[0];
};

module.exports = { createUsersTable, findByEmail, findByUucms, createUser };
