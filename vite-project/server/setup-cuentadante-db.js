import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 CONFIGURANDO BASE DE DATOS PARA CUENTADANTE');
console.log('===============================================');

async function setupDatabase() {
  try {
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, '..', 'database', 'database_cuentadante.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 Archivo SQL leído correctamente');
    
    // Dividir en comandos individuales
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`🔧 Ejecutando ${commands.length} comandos SQL...`);
    
    // Ejecutar cada comando
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        try {
          await query(command);
          if (i % 10 === 0) {
            console.log(`   ✓ Progreso: ${i + 1}/${commands.length} comandos`);
          }
        } catch (err) {
          if (!err.message.includes('already exists') && !err.message.includes('does not exist')) {
            console.error(`❌ Error en comando ${i + 1}:`, err.message);
          }
        }
      }
    }
    
    console.log('✅ Base de datos configurada exitosamente');
    
    // Verificar la instalación
    console.log('\n🔍 Verificando instalación...');
    
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📋 Tablas creadas:');
    tables.rows.forEach(table => {
      console.log(`   ✓ ${table.table_name}`);
    });
    
    // Verificar datos
    const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as usuarios,
        (SELECT COUNT(*) FROM assets) as bienes,
        (SELECT COUNT(*) FROM requests) as solicitudes,
        (SELECT COUNT(*) FROM asset_movements) as movimientos
    `);
    
    const data = stats.rows[0];
    console.log('\n📊 Datos insertados:');
    console.log(`   👥 Usuarios: ${data.usuarios}`);
    console.log(`   📦 Bienes: ${data.bienes}`);
    console.log(`   📋 Solicitudes: ${data.solicitudes}`);
    console.log(`   🔄 Movimientos: ${data.movimientos}`);
    
    // Mostrar bienes disponibles
    const available = await query(`
      SELECT COUNT(*) as count 
      FROM assets 
      WHERE status = 'Available'
    `);
    
    console.log(`   ✅ Bienes disponibles: ${available.rows[0].count}`);
    
    console.log('\n🎉 ¡Sistema Cuentadante listo para usar!');
    
  } catch (error) {
    console.error('❌ Error configurando la base de datos:', error);
    process.exit(1);
  }
}

setupDatabase().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});