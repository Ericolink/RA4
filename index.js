const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: "dpg-d4rmqpemcj7s73f7g6eg-a",      // tu host de Render
    user: "admin",
    password: "AVcN7m3gu9uKzwzmJ9Yha2QNex4LWc92", // tu password
    database: "midb_n83a",                    // tu DB
  });

  // Prueba de conexión
  const [rows] = await connection.execute('SELECT NOW() AS now');
  console.log('Conexión exitosa, hora actual en DB:', rows[0].now);

  // Crear tabla de personajes si no existe
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS personajes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100),
      alias VARCHAR(100),
      fruta_del_diablo VARCHAR(100),
      tripulacion VARCHAR(100)
    )
  `);

  // Crear tabla de tesoros si no existe
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS tesoros (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100),
      descripcion TEXT,
      ubicacion VARCHAR(100)
    )
  `);

  // Crear tabla de recetas temáticas si no existe
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS recetas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100),
      tipo VARCHAR(50),
      descripcion TEXT
    )
  `);

  console.log("Tablas 'personajes', 'tesoros' y 'recetas' listas");

  // Ejemplo: insertar algunos datos de One Piece
  await connection.execute(`
    INSERT INTO personajes (nombre, alias, fruta_del_diablo, tripulacion)
    VALUES 
      ('Monkey D. Luffy', 'Sombrero de Paja', 'Gomu Gomu no Mi', 'Sombrero de Paja'),
      ('Roronoa Zoro', 'Cazador de Piratas', '', 'Sombrero de Paja')
  `);

  await connection.execute(`
    INSERT INTO tesoros (nombre, descripcion, ubicacion)
    VALUES
      ('One Piece', 'El tesoro legendario de Gol D. Roger', 'Raftel'),
      ('Vivre Card', 'Carta especial que indica la ubicación de un pirata', 'Variable')
  `);

  await connection.execute(`
    INSERT INTO recetas (nombre, tipo, descripcion)
    VALUES
      ('Ramen de Sanji', 'Plato', 'El famoso ramen que prepara Sanji para la tripulación'),
      ('Meat on the Bone', 'Plato', 'La gran carne que Luffy siempre quiere comer')
  `);

  console.log("Datos iniciales insertados correctamente");
}

main();
