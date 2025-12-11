const { Pool } = require('pg');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

async function initDB() {
  try {
    await pool.query('SELECT NOW()');
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
    console.error("Error DB:", err);
  }
}

app.get('/', async (req, res) => {
  try {
    const personajes = await pool.query('SELECT * FROM personajes');
    const tesoros = await pool.query('SELECT * FROM tesoros');
    const recetas = await pool.query('SELECT * FROM recetas');

    let html = `
    <html>
      <head>
        <title>Mini Catálogo One Piece</title>
        <link href="https://fonts.cdnfonts.com/css/one-piece" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
            background: url("https://i.imgur.com/gJ6ISGv.jpeg") no-repeat center center fixed;
            background-size: cover;
            font-family: Arial;
            color: #fff;
          }
          h1 {
            font-family: 'One Piece', sans-serif;
            text-align: center;
            font-size: 50px;
            color: #ffdd00;
            text-shadow: 3px 3px #000;
            margin-top: 20px;
          }
          h2 {
            text-align: center;
            font-size: 32px;
            color: #ffe28a;
            text-shadow: 3px 3px #000;
          }
          .section {
            padding: 25px;
          }
          .card {
            background: rgba(0, 0, 0, 0.65);
            color: #fff;
            padding: 20px;
            margin: 20px auto;
            border-radius: 12px;
            max-width: 450px;
            border: 2px solid #ffdd00;
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
          }
          .card h3 {
            color: #ffdd00;
            margin-bottom: 10px;
          }
          .divider {
            height: 4px;
            background: #ffdd00;
            margin: 20px auto;
            width: 80%;
            border-radius: 2px;
          }
        </style>
      </head>
      <body>
        <h1>Mini Catálogo One Piece</h1>

        <div class="section">
          <h2>🏴‍☠️ Personajes</h2>
          <div class="divider"></div>
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

    html += `
        <div class="section">
          <h2>💰 Tesoros Legendarios</h2>
          <div class="divider"></div>
    `;

    tesoros.rows.forEach(t => {
      html += `
        <div class="card">
          <h3>${t.nombre}</h3>
          <p>${t.descripcion}</p>
          <p><strong>Ubicación:</strong> ${t.ubicacion}</p>
        </div>
      `;
    });

    html += `
        <div class="section">
          <h2>🍜 Recetas del Baratie</h2>
          <div class="divider"></div>
    `;

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
    console.error(err);
    res.status(500).send("Error al cargar el catálogo");
  }
});

initDB().then(() => {
  app.listen(port, () => console.log(`Servidor en puerto ${port}`));
});
