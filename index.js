const { Pool } = require('pg');

// Crear pool de conexiones con SSL
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  max: 10,
  idleTimeoutMillis: 30000,
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  try {
    // Probar conexión
    const res = await pool.query('SELECT NOW()');
    console.log('Conexión exitosa, hora actual en DB:', res.rows[0].now);

    // Crear tabla de personajes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS personajes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        alias VARCHAR(100),
        fruta_del_diablo VARCHAR(100),
        tripulacion VARCHAR(100)
      )
    `);

    // Crear tabla de tesoros
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tesoros (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        descripcion TEXT,
        ubicacion VARCHAR(100)
      )
    `);

    // Crear tabla de recetas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recetas (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        tipo VARCHAR(50),
        descripcion TEXT
      )
    `);

    console.log("Tablas 'personajes', 'tesoros' y 'recetas' listas");

    // Insertar datos iniciales
    await pool.query(`
      INSERT INTO personajes (nombre, alias, fruta_del_diablo, tripulacion)
      VALUES 
        ('Monkey D. Luffy', 'Sombrero de Paja', 'Gomu Gomu no Mi', 'Sombrero de Paja')
      ON CONFLICT DO NOTHING
    `);

    await pool.query(`
      INSERT INTO tesoros (nombre, descripcion, ubicacion)
      VALUES
        ('One Piece', 'El tesoro legendario de Gol D. Roger', 'Raftel')
      ON CONFLICT DO NOTHING
    `);

    await pool.query(`
      INSERT INTO recetas (nombre, tipo, descripcion)
      VALUES
        ('Ramen de Sanji', 'Plato', 'El famoso ramen que prepara Sanji para la tripulación')
      ON CONFLICT DO NOTHING
    `);

    console.log("Datos iniciales insertados correctamente");

  } catch (err) {
    console.error("Error en la DB:", err);
  }
}

main();
