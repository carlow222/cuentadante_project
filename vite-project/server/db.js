import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cuentadante_db',
  password: process.env.DB_PASSWORD || '123456',
  port: process.env.DB_PORT || 5432,
  max: 20, // máximo número de conexiones en el pool
  idleTimeoutMillis: 30000, // tiempo antes de cerrar conexiones inactivas
  connectionTimeoutMillis: 2000, // tiempo de espera para obtener conexión
});

pool.on('connect', (client) => {
  console.log('✅ Conectado a PostgreSQL:', process.env.DB_NAME);
});

pool.on('error', (err, client) => {
  console.error('❌ Error inesperado en cliente de base de datos:', err);
  process.exit(-1);
});

// Función para probar la conexión
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    client.release();
    console.log('🔗 Conexión exitosa a PostgreSQL');
    console.log('⏰ Hora del servidor:', result.rows[0].current_time);
    console.log('📊 Versión PostgreSQL:', result.rows[0].postgres_version.split(' ')[0]);
    return true;
  } catch (err) {
    console.error('❌ Error de conexión a la base de datos:', err.message);
    return false;
  }
};

// Función para verificar si las tablas existen
export const checkTables = async () => {
  try {
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    const tables = result.rows.map(row => row.table_name);
    console.log('📋 Tablas encontradas:', tables);
    
    const expectedTables = ['users', 'assets', 'requests', 'asset_movements'];
    const missingTables = expectedTables.filter(table => !tables.includes(table));
    
    if (missingTables.length > 0) {
      console.log('⚠️  Tablas faltantes:', missingTables);
      return false;
    } else {
      console.log('✅ Todas las tablas requeridas están presentes');
      return true;
    }
  } catch (err) {
    console.error('❌ Error verificando tablas:', err.message);
    return false;
  }
};

export const query = (text, params) => pool.query(text, params);
