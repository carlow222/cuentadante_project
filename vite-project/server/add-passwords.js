import { query } from './db.js';

async function addPasswords() {
    try {
        // Agregar columna password si no existe
        await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255)');
        console.log('✅ Columna password verificada');

        // Actualizar contraseñas de usuarios existentes
        await query(`UPDATE users SET password = 'cuentadante123' WHERE email = 'maria.gonzalez@sena.edu.co'`);
        await query(`UPDATE users SET password = 'cuentadante123' WHERE email = 'carlos.rodriguez@sena.edu.co'`);
        await query(`UPDATE users SET password = 'cuentadante123' WHERE email = 'ana.martinez@sena.edu.co'`);
        console.log('✅ Contraseñas actualizadas para usuarios existentes');

        // Crear usuario demo
        await query(`
            INSERT INTO users (name, email, role, password) 
            VALUES ('Cuentadante Demo', 'cuentadante@sistema.edu.co', 'Cuentadante', 'cuentadante_1') 
            ON CONFLICT (email) DO UPDATE SET password = 'cuentadante_1'
        `);
        console.log('✅ Usuario demo creado/actualizado');

        // Mostrar todos los usuarios
        const result = await query('SELECT id, name, email, role FROM users');
        console.log('\n📋 Usuarios disponibles:');
        result.rows.forEach(user => {
            console.log(`   - ${user.name} (${user.email})`);
        });

        console.log('\n🔑 Credenciales de acceso:');
        console.log('   Email: cuentadante@sistema.edu.co');
        console.log('   Password: cuentadante_1');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

addPasswords();
