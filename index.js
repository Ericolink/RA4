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

// Función para inicializar DB y datos
async function initDB() {
  try {
    await pool.query('SELECT NOW()'); // Probar conexión
    console.log('Conexión exitosa a la DB');

    // Crear tablas
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

    // Insertar datos iniciales si no existen
    await pool.query(`
      INSERT INTO personajes (nombre, alias, fruta_del_diablo, tripulacion)
      VALUES 
        ('Monkey D. Luffy', 'Sombrero de Paja', 'Gomu Gomu no Mi', 'Sombrero de Paja'),
        ('Roronoa Zoro', 'Cazador de Piratas', NULL, 'Sombrero de Paja'),
        ('Nami', 'La Navegante', NULL, 'Sombrero de Paja')
      ON CONFLICT DO NOTHING
    `);

    await pool.query(`
      INSERT INTO tesoros (nombre, descripcion, ubicacion)
      VALUES
        ('One Piece', 'El tesoro legendario de Gol D. Roger', 'Raftel'),
        ('Vivre Card', 'Mapa especial que indica ubicación de personas', 'Varios')
      ON CONFLICT DO NOTHING
    `);

    await pool.query(`
      INSERT INTO recetas (nombre, tipo, descripcion)
      VALUES
        ('Ramen de Sanji', 'Plato', 'El famoso ramen que prepara Sanji para la tripulación'),
        ('Gyoza', 'Snack', 'Deliciosas empanadillas japonesas')
      ON CONFLICT DO NOTHING
    `);

    console.log("Tablas y datos iniciales listos");

  } catch (err) {
    console.error("Error en la DB:", err);
  }
}

// Ruta principal: mini catálogo
app.get('/', async (req, res) => {
  try {
    const personajes = await pool.query('SELECT * FROM personajes');
    const tesoros = await pool.query('SELECT * FROM tesoros');
    const recetas = await pool.query('SELECT * FROM recetas');

    let html = `
      <html>
        <head>
          <title>Mini Catálogo One Piece</title>
          <style>
            body { font-family: Arial; background: #f5f5f5; margin: 0; padding: 0; }
            h1, h2 { text-align: center; }
            .section { padding: 20px; }
            .card { background: #fff; padding: 15px; margin: 10px auto; border-radius: 8px; max-width: 400px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
          </style>
        </head>
        <body>
          <h1>Mini Catálogo One Piece</h1>
          
          <div class="section">
            <h2>Personajes</h2>
    `;

    personajes.rows.forEach(p => {
      html += `
        <div class="card">
          <h3>${p.nombre} (${p.alias})</h3>
          <p><strong>Fruta del Diablo:</strong> ${p.fruta_del_diablo || 'Ninguna'}</p>
          <p><strong>Tripulación:</strong> ${p.tripulacion}</p>
        </div>
      `;
    });

    html += `<div class="section"><h2>Tesoros</h2>`;
    tesoros.rows.forEach(t => {
      html += `
        <div class="card">
          <h3>${t.nombre}</h3>
          <p>${t.descripcion}</p>
          <p><strong>Ubicación:</strong> ${t.ubicacion}</p>
        </div>
      `;
    });

    html += `<div class="section"><h2>Recetas</h2>`;
    recetas.rows.forEach(r => {
      html += `
        <div class="card">
          <h3>${r.nombre}</h3>
          <p><strong>Tipo:</strong> ${r.tipo}</p>
          <p>${r.descripcion}</p>
        </div>
      `;
    });

    html += `
        </body>
      </html>
    `;

    res.send(html);

  } catch (err) {
    res.status(500).send("Error al cargar el catálogo");
  }
});

// Inicializar DB y arrancar servidor
initDB().then(() => {
  app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
});
