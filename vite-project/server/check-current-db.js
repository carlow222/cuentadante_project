import { query } from './db.js';

console.log('🔍 VERIFICANDO ESTRUCTURA ACTUAL DE LA BASE DE DATOS');
console.log('===================================================');

async function checkCurrentStructure() {
  try {
    // Verificar estructura de assets
    console.log('\n📦 ESTRUCTURA DE TABLA ASSETS:');
    const assetsColumns = await query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'assets' 
      ORDER BY ordinal_position
    `);
    
    assetsColumns.rows.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
    });
    
    // Verificar estructura de requests
    console.log('\n📋 ESTRUCTURA DE TABLA REQUESTS:');
    const requestsColumns = await query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'requests' 
      ORDER BY ordinal_position
    `);
    
    requestsColumns.rows.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
    });
    
    // Verificar datos actuales
    console.log('\n📊 DATOS ACTUALES:');
    
    const assetsCount = await query('SELECT COUNT(*) as count FROM assets');
    console.log(`   Bienes: ${assetsCount.rows[0].count}`);
    
    const requestsCount = await query('SELECT COUNT(*) as count FROM requests');
    console.log(`   Solicitudes: ${requestsCount.rows[0].count}`);
    
    // Verificar algunos bienes de ejemplo
    console.log('\n📦 MUESTRA DE BIENES:');
    const sampleAssets = await query(`
      SELECT name, serial_number, brand, model, category, status 
      FROM assets 
      LIMIT 5
    `);
    
    sampleAssets.rows.forEach(asset => {
      console.log(`   ${asset.name} (${asset.brand} ${asset.model}) - ${asset.status}`);
    });
    
    // Verificar solicitudes
    console.log('\n📋 MUESTRA DE SOLICITUDES:');
    const sampleRequests = await query(`
      SELECT applicant_name, priority, final_status 
      FROM requests 
      LIMIT 5
    `);
    
    sampleRequests.rows.forEach(req => {
      console.log(`   ${req.applicant_name} - ${req.priority} - ${req.final_status || 'Sin estado'}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkCurrentStructure().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});