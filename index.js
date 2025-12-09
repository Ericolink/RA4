const mysql = require('mysql2/promise');

// Función para conectarse con reintentos
async function connectWithRetry() {
  let connected = false;
  let retries = 5;
  let connection;

  while (!connected && retries > 0) {
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });
      connected = true;
      console.log("Conexión exitosa a la base de datos");
      return connection;
    } catch (err) {
      console.log(`Error de conexión, reintentando en 5s... (${err.message})`);
      await new Promise(r => setTimeout(r, 5000));
      retries--;
    }
  }

  throw new Error("No se pudo conectar a la base de datos");
}

async function main() {
  const connection = await connectWithRetry();

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

  // Insertar datos iniciales (solo si no existen)
  await connection.execute(`
    INSERT IGNORE INTO personajes (id, nombre, alias, fruta_del_diablo, tripulacion)
    VALUES 
      (1, 'Monkey D. Luffy', 'Sombrero de Paja', 'Gomu Gomu no Mi', 'Sombrero de Paja'),
      (2, 'Roronoa Zoro', 'Cazador de Piratas', '', 'Sombrero de Paja')
  `);

  await connection.execute(`
    INSERT IGNORE INTO tesoros (id, nombre, descripcion, ubicacion)
    VALUES
      (1, 'One Piece', 'El tesoro legendario de Gol D. Roger', 'Raftel'),
      (2, 'Vivre Card', 'Carta especial que indica la ubicación de un pirata', 'Variable')
  `);

  await connection.execute(`
    INSERT IGNORE INTO recetas (id, nombre, tipo, descripcion)
    VALUES
      (1, 'Ramen de Sanji', 'Plato', 'El famoso ramen que prepara Sanji para la tripulación'),
      (2, 'Meat on the Bone', 'Plato', 'La gran carne que Luffy siempre quiere comer')
  `);

  console.log("Datos iniciales insertados correctamente");
}

main().catch(err => console.error("Error en la app:", err));
