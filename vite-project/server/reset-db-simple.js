import { query } from './db.js';

console.log('🔄 REINICIANDO BASE DE DATOS PARA CUENTADANTE');
console.log('==============================================');

async function resetDatabase() {
  try {
    console.log('🗑️ Eliminando tablas existentes...');
    
    // Eliminar tablas en orden correcto
    await query('DROP TABLE IF EXISTS asset_movements CASCADE');
    await query('DROP TABLE IF EXISTS requests CASCADE');
    await query('DROP TABLE IF EXISTS assignments CASCADE');
    await query('DROP TABLE IF EXISTS assets CASCADE');
    await query('DROP TABLE IF EXISTS users CASCADE');
    
    console.log('✅ Tablas eliminadas');
    
    console.log('🏗️ Creando nuevas tablas...');
    
    // Crear tabla de usuarios
    await query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'Cuentadante',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Crear tabla de bienes
    await query(`
      CREATE TABLE assets (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        serial_number VARCHAR(255) UNIQUE NOT NULL,
        inventory_number VARCHAR(255) UNIQUE NOT NULL,
        brand VARCHAR(100),
        model VARCHAR(100),
        category VARCHAR(100) NOT NULL DEFAULT 'Electronics',
        purchase_date DATE,
        warranty_expiry DATE,
        purchase_price DECIMAL(10,2),
        current_value DECIMAL(10,2),
        condition VARCHAR(50) NOT NULL DEFAULT 'New',
        location VARCHAR(255),
        status VARCHAR(50) NOT NULL DEFAULT 'Available',
        assigned_to VARCHAR(255),
        assignment_date TIMESTAMP,
        expected_return_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Crear tabla de solicitudes
    await query(`
      CREATE TABLE requests (
        id SERIAL PRIMARY KEY,
        request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        applicant_name VARCHAR(255) NOT NULL,
        applicant_position VARCHAR(255),
        asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
        reason TEXT NOT NULL,
        priority VARCHAR(50) DEFAULT 'Media',
        status VARCHAR(50) DEFAULT 'Pendiente',
        approved_by VARCHAR(255),
        approval_date TIMESTAMP,
        rejection_reason TEXT,
        rejected_by VARCHAR(255),
        rejection_date TIMESTAMP,
        expected_return_date DATE,
        actual_return_date DATE,
        notes TEXT
      )
    `);
    
    // Crear tabla de movimientos
    await query(`
      CREATE TABLE asset_movements (
        id SERIAL PRIMARY KEY,
        asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
        movement_type VARCHAR(50) NOT NULL,
        from_person VARCHAR(255),
        to_person VARCHAR(255),
        movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reason TEXT,
        authorized_by VARCHAR(255),
        notes TEXT
      )
    `);
    
    console.log('✅ Tablas creadas');
    
    console.log('📊 Creando índices...');
    
    await query('CREATE INDEX idx_assets_serial ON assets(serial_number)');
    await query('CREATE INDEX idx_assets_status ON assets(status)');
    await query('CREATE INDEX idx_requests_status ON requests(status)');
    
    console.log('✅ Índices creados');
    
    console.log('👥 Insertando usuarios...');
    
    await query(`
      INSERT INTO users (name, email, role) VALUES 
      ('María González', 'maria.gonzalez@sena.edu.co', 'Cuentadante'),
      ('Carlos Rodríguez', 'carlos.rodriguez@sena.edu.co', 'Cuentadante'),
      ('Ana Martínez', 'ana.martinez@sena.edu.co', 'Cuentadante')
    `);
    
    console.log('✅ Usuarios insertados');
    
    console.log('📦 Insertando bienes...');
    
    await query(`
      INSERT INTO assets (name, description, serial_number, inventory_number, brand, model, category, purchase_date, warranty_expiry, purchase_price, current_value, condition, location, status) VALUES 
      ('Computadora HP EliteDesk', 'HP EliteDesk 800 G6, Intel i5-10500, 16GB RAM, 512GB SSD', 'SGH438K012', '100000000001', 'HP', 'EliteDesk 800 G6', 'Computadoras', '2024-02-15', '2026-02-15', 720.00, 650.00, 'Excelente', 'Aula de Informática 1', 'Available'),
      ('Computadora Dell OptiPlex', 'Dell OptiPlex 7080, Intel i5-10505, 16GB RAM, 256GB SSD', 'CN-8D4H-7K2L', '100000000002', 'Dell', 'OptiPlex 7080', 'Computadoras', '2024-03-10', '2026-03-10', 680.00, 610.00, 'Excelente', 'Aula de Informática 2', 'Available'),
      ('Laptop Lenovo ThinkPad', 'Lenovo ThinkPad T14 Gen 3, Ryzen 5 PRO, 16GB RAM, 512GB SSD', 'PF4K9M3Z', '100000000003', 'Lenovo', 'ThinkPad T14 Gen 3', 'Laptops', '2024-01-20', '2026-01-20', 950.00, 870.00, 'Excelente', 'Oficina de Coordinación', 'Assigned', 'Juan Pérez - Instructor', CURRENT_TIMESTAMP, CURRENT_DATE + INTERVAL '30 days'),
      ('Laptop HP Pavilion', 'HP Pavilion 15-eg2097nr, Intel i5-1235U, 8GB RAM, 512GB SSD', '5CD4567GHI', '100000000004', 'HP', 'Pavilion 15-eg2097nr', 'Laptops', '2024-04-05', '2026-04-05', 630.00, 570.00, 'Bueno', 'Sala de Profesores', 'Available'),
      ('Televisor Samsung 55"', 'Samsung QN55Q60BAFXZA, QLED 4K Smart TV', '0TQN55Q60BA01234', '100000000005', 'Samsung', 'QN55Q60BA', 'Televisores', '2024-01-30', '2025-01-30', 520.00, 460.00, 'Excelente', 'Aula Magna', 'Available'),
      ('Monitor Dell 24"', 'Dell P2422HE, 23.8" Full HD, USB-C, HDMI, DisplayPort', 'CN0V3R1M2N3P', '100000000007', 'Dell', 'P2422HE', 'Monitores', '2024-02-28', '2026-02-28', 210.00, 190.00, 'Excelente', 'Aula de Informática 1', 'Available'),
      ('Proyector Epson', 'Epson PowerLite 1781W, 3600 lúmenes, WXGA inalámbrico', 'V1W2X3Y4Z5', '100000000008', 'Epson', 'PowerLite 1781W', 'Proyectores', '2024-03-05', '2026-03-05', 450.00, 410.00, 'Bueno', 'Aula de Capacitación A', 'Available'),
      ('Impresora HP LaserJet', 'HP LaserJet Pro MFP M28w, WiFi, impresión y escaneo', 'VNC9J78901', '100000000009', 'HP', 'LaserJet Pro MFP M28w', 'Impresoras', '2024-04-10', '2025-04-10', 140.00, 120.00, 'Bueno', 'Oficina Principal', 'Available'),
      ('Mesa de Reuniones', 'Mesa para 10 personas, tablero melamina, base metálica', 'MEL10-2024-001', '100000000010', 'Oficina Total', 'Ejecutiva Pro 10', 'Mobiliario', '2024-01-15', NULL, 580.00, 520.00, 'Excelente', 'Sala de Juntas', 'Available'),
      ('Tablet Samsung Galaxy', 'Samsung Galaxy Tab S8, 11", 128GB, WiFi', 'SM-X706B123456', '100000000011', 'Samsung', 'Galaxy Tab S8', 'Tablets', '2024-05-15', '2025-05-15', 450.00, 400.00, 'Excelente', 'Biblioteca', 'Available')
    `);
    
    console.log('✅ Bienes insertados');
    
    console.log('📋 Insertando solicitudes...');
    
    await query(`
      INSERT INTO requests (applicant_name, applicant_position, asset_id, reason, priority, status, expected_return_date) VALUES
      ('Juan Pérez', 'Instructor de Programación', 1, 'Curso intensivo de desarrollo web para 20 estudiantes', 'Alta', 'Pendiente', CURRENT_DATE + INTERVAL '14 days'),
      ('María Gómez', 'Coordinadora Académica', 5, 'Presentación de logros del programa ante autoridades', 'Importante', 'Pendiente', CURRENT_DATE + INTERVAL '7 days'),
      ('Carlos López', 'Instructor de Diseño', 8, 'Sesión de proyección de portafolios estudiantiles', 'Media', 'Aprobado', CURRENT_DATE + INTERVAL '5 days', 'María González', CURRENT_TIMESTAMP),
      ('Ana Martínez', 'Directora Académica', 10, 'Reunión estratégica con aliados institucionales', 'Importante', 'Pendiente', CURRENT_DATE + INTERVAL '3 days'),
      ('Luis Rodríguez', 'Técnico de Soporte', 4, 'Pruebas de compatibilidad con software educativo', 'Media', 'Rechazado', CURRENT_DATE + INTERVAL '10 days', NULL, NULL, 'Equipo no compatible con software requerido', 'María González', CURRENT_TIMESTAMP)
    `);
    
    console.log('✅ Solicitudes insertadas');
    
    // Verificar instalación
    const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as usuarios,
        (SELECT COUNT(*) FROM assets) as bienes,
        (SELECT COUNT(*) FROM requests) as solicitudes,
        (SELECT COUNT(*) FROM assets WHERE status = 'Available') as disponibles
    `);
    
    const data = stats.rows[0];
    console.log('\n📊 Resumen de la instalación:');
    console.log(`   👥 Usuarios: ${data.usuarios}`);
    console.log(`   📦 Bienes: ${data.bienes}`);
    console.log(`   📋 Solicitudes: ${data.solicitudes}`);
    console.log(`   ✅ Bienes disponibles: ${data.disponibles}`);
    
    console.log('\n🎉 ¡Base de datos configurada exitosamente para Cuentadante!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetDatabase().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});