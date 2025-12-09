const { Pool } = require('pg');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Crear pool de conexiones con SSL
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

// Función para inicializar DB
async function initDB() {
  try {
    await pool.query('SELECT NOW()'); // Probar conexión
    console.log('Conexión exitosa a la DB');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS personajes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        alias VARCHAR(100),
        fruta_del_diablo VARCHAR(100),
        tripulacion VARCHAR(100)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tesoros (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        descripcion TEXT,
        ubicacion VARCHAR(100)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS recetas (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        tipo VARCHAR(50),
        descripcion TEXT
      )
    `);

    console.log("Tablas listas");
  } catch (err) {
    console.error("Error en la DB:", err);
  }
}

// Rutas de ejemplo
app.get('/', async (req, res) => {
  const personajes = await pool.query('SELECT * FROM personajes');
  res.json(personajes.rows);
});

// Inicializar DB y arrancar servidor
initDB().then(() => {
  app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
});
