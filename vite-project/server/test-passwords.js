import pg from 'pg';

const passwords = ['123456', 'postgres', 'admin', 'root', '1234', '12345', 'password', ''];

async function testPassword(password) {
  const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', // Probamos con la DB por defecto
    password: password,
    port: 5432,
  });

  try {
    const res = await pool.query('SELECT NOW()');
    console.log(`✅ ¡CONTRASEÑA CORRECTA! -> "${password}"`);
    pool.end();
    return true;
  } catch (err) {
    console.log(`❌ Falló con: "${password}"`);
    pool.end();
    return false;
  }
}

console.log('Probando contraseñas comunes...\n');

for (const pwd of passwords) {
  const result = await testPassword(pwd);
  if (result) {
    console.log('\n🎉 Usa esta contraseña en tu archivo .env');
    process.exit(0);
  }
}

console.log('\n❌ Ninguna contraseña común funcionó.');
console.log('Necesitas verificar en PGAdmin cuál es tu contraseña.');
