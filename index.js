const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: "dpg-d4rmqpemcj7s73f7g6eg-a",      // ejemplo: onepiece-db.render.com
    user: "admin",
    password: "AVcN7m3gu9uKzwzmJ9Yha2QNex4LWc92",
    database: "midb_n83a",
  });

  // Prueba de conexión
  const [rows] = await connection.execute('SELECT NOW() AS now');
  console.log('Conexión exitosa, hora actual en DB:', rows[0].now);

  // Aquí puedes crear tablas si no existen
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS recetas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100),
      tipo VARCHAR(50),
      descripcion TEXT
    )
  `);

  console.log("Tabla 'recetas' lista");
}

main();
