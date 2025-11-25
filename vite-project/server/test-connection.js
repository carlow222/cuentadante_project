import { testConnection, checkTables, query } from './db.js';

console.log('🔍 PRUEBA DE CONEXIÓN A LA BASE DE DATOS');
console.log('==========================================');

async function runTests() {
  // 1. Probar conexión básica
  console.log('\n1️⃣ Probando conexión básica...');
  const connectionOk = await testConnection();
  
  if (!connectionOk) {
    console.log('\n❌ No se pudo conectar a la base de datos');
    console.log('📝 Verifica:');
    console.log('   - PostgreSQL está ejecutándose');
    console.log('   - Las credenciales en .env son correctas');
    console.log('   - La base de datos existe');
    process.exit(1);
  }

  // 2. Verificar tablas
  console.log('\n2️⃣ Verificando estructura de tablas...');
  const tablesOk = await checkTables();
  
  if (!tablesOk) {
    console.log('\n⚠️  Algunas tablas faltan');
    console.log('📝 Ejecuta el script database_completa.sql en pgAdmin');
    process.exit(1);
  }

  // 3. Probar datos de ejemplo
  console.log('\n3️⃣ Verificando datos de ejemplo...');
  try {
    const usersResult = await query('SELECT COUNT(*) as count FROM users');
    const assetsResult = await query('SELECT COUNT(*) as count FROM assets');
    const requestsResult = await query('SELECT COUNT(*) as count FROM requests');

    console.log(`👥 Usuarios: ${usersResult.rows[0].count}`);
    console.log(`📦 Bienes: ${assetsResult.rows[0].count}`);
    console.log(`📋 Solicitudes: ${requestsResult.rows[0].count}`);

    if (assetsResult.rows[0].count == 0) {
      console.log('\n⚠️  No hay datos de ejemplo');
      console.log('📝 Ejecuta el script database_completa.sql completo');
    }

  } catch (err) {
    console.error('❌ Error verificando datos:', err.message);
  }

  // 4. Probar funcionalidad específica de bienes
  console.log('\n4️⃣ Probando funcionalidad de bienes...');
  try {
    const assetTest = await query(`
      SELECT a.name, a.brand, a.model, a.category, a.current_value, a.status
      FROM assets a 
      ORDER BY a.current_value DESC
      LIMIT 5
    `);

    if (assetTest.rows.length > 0) {
      console.log('📊 Muestra de bienes por categoría:');
      assetTest.rows.forEach(asset => {
        const icon = asset.category.includes('Computadoras') || asset.category.includes('Laptops') ? '💻' : 
                    asset.category.includes('Televisores') || asset.category.includes('Monitores') ? '📺' :
                    asset.category.includes('Proyectores') ? '📽️' : 
                    asset.category.includes('Mobiliario') ? '🪑' : '📦';
        const value = asset.current_value ? `$${parseFloat(asset.current_value).toFixed(2)}` : 'N/A';
        console.log(`   ${icon} ${asset.name} (${asset.brand} ${asset.model || ''}) - ${value} - ${asset.status}`);
      });
    }

    // Mostrar resumen por categorías
    const categoryTest = await query(`
      SELECT 
        category as categoria,
        COUNT(*) as cantidad,
        COUNT(CASE WHEN status = 'Available' THEN 1 END) as disponibles,
        ROUND(AVG(current_value), 2) as valor_promedio
      FROM assets
      WHERE current_value IS NOT NULL
      GROUP BY category
      ORDER BY cantidad DESC
      LIMIT 6
    `);

    if (categoryTest.rows.length > 0) {
      console.log('\n📈 Resumen por categorías:');
      categoryTest.rows.forEach(cat => {
        console.log(`   📦 ${cat.categoria}: ${cat.cantidad} bienes, ${cat.disponibles} disponibles, $${cat.valor_promedio} promedio`);
      });
    }

  } catch (err) {
    console.error('❌ Error en prueba de bienes:', err.message);
  }

  console.log('\n✅ TODAS LAS PRUEBAS COMPLETADAS');
  console.log('🚀 El sistema está listo para usar');
  process.exit(0);
}

runTests().catch(err => {
  console.error('❌ Error en las pruebas:', err);
  process.exit(1);
});
