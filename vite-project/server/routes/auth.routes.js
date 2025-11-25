import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// Login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Validar que se proporcionen email y password
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email y contraseña son requeridos' 
            });
        }

        // Buscar usuario por email
        const result = await query(
            'SELECT * FROM users WHERE email = $1', 
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ 
                error: 'Credenciales inválidas' 
            });
        }

        const user = result.rows[0];

        // Verificar contraseña (en un sistema real usarías bcrypt)
        if (user.password !== password) {
            return res.status(401).json({ 
                error: 'Credenciales inválidas' 
            });
        }

        // Verificar que sea cuentadante
        if (user.role !== 'Cuentadante') {
            return res.status(403).json({ 
                error: 'Acceso denegado. Solo cuentadantes pueden acceder al sistema.' 
            });
        }

        // Login exitoso - no devolver la contraseña
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({
            message: 'Login exitoso',
            user: userWithoutPassword,
            token: `token_${user.id}_${Date.now()}` // Token simple para demo
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
});

// Verificar token (middleware simple)
router.get('/verify', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    // Validación simple del token (en producción usar JWT)
    if (token.startsWith('token_')) {
        const userId = token.split('_')[1];
        
        try {
            const result = await query(
                'SELECT id, name, email, role FROM users WHERE id = $1', 
                [userId]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'Token inválido' });
            }

            res.json({ 
                valid: true, 
                user: result.rows[0] 
            });
        } catch (error) {
            res.status(500).json({ error: 'Error verificando token' });
        }
    } else {
        res.status(401).json({ error: 'Token inválido' });
    }
});

// Logout (simple)
router.post('/logout', (req, res) => {
    res.json({ message: 'Logout exitoso' });
});

export default router;