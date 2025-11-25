import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// ============================================================================
// RUTAS PARA SOLICITUDES
// ============================================================================

// Obtener todas las solicitudes con información completa
router.get('/requests', async (req, res) => {
    try {
        const result = await query(`
            SELECT r.*, 
                   a.name as asset_name,
                   a.serial_number as asset_serial,
                   a.inventory_number as asset_inventory,
                   a.brand as asset_brand,
                   a.model as asset_model,
                   a.category as asset_category,
                   a.location as asset_location,
                   a.condition as asset_condition
            FROM requests r
            JOIN assets a ON r.asset_id = a.id
            ORDER BY r.request_date DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Aprobar una solicitud
router.put('/requests/:id/approve', async (req, res) => {
    const { id } = req.params;
    const { approved_by, notes } = req.body;
    
    try {
        // Verificar que la solicitud existe y está pendiente
        const requestCheck = await query('SELECT * FROM requests WHERE id = $1', [id]);
        if (requestCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }
        
        const request = requestCheck.rows[0];
        if (request.status !== 'Pendiente') {
            return res.status(400).json({ error: 'La solicitud ya ha sido procesada' });
        }
        
        // Verificar que el bien está disponible
        const assetCheck = await query('SELECT * FROM assets WHERE id = $1', [request.asset_id]);
        if (assetCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Bien no encontrado' });
        }
        
        const asset = assetCheck.rows[0];
        if (asset.status !== 'Available') {
            return res.status(400).json({ error: 'El bien ya no está disponible' });
        }
        
        // Aprobar la solicitud
        await query(`
            UPDATE requests 
            SET status = 'Aprobado',
                approved_by = $1,
                approval_date = CURRENT_TIMESTAMP,
                notes = $2
            WHERE id = $3
        `, [approved_by, notes, id]);
        
        // Asignar el bien
        await query(`
            UPDATE assets 
            SET status = 'Assigned',
                assigned_to = $1,
                assignment_date = CURRENT_TIMESTAMP,
                expected_return_date = $2
            WHERE id = $3
        `, [request.applicant_name, request.expected_return_date, request.asset_id]);
        
        // Registrar el movimiento
        await query(`
            INSERT INTO asset_movements (asset_id, movement_type, to_person, reason, authorized_by, notes)
            VALUES ($1, 'ASSIGNMENT', $2, $3, $4, $5)
        `, [request.asset_id, request.applicant_name, 
            `Solicitud aprobada #${id}`, approved_by, notes]);
        
        res.json({ message: 'Solicitud aprobada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rechazar una solicitud
router.put('/requests/:id/reject', async (req, res) => {
    const { id } = req.params;
    const { rejected_by, rejection_reason } = req.body;
    
    try {
        // Verificar que la solicitud existe y está pendiente
        const requestCheck = await query('SELECT * FROM requests WHERE id = $1', [id]);
        if (requestCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }
        
        const request = requestCheck.rows[0];
        if (request.status !== 'Pendiente') {
            return res.status(400).json({ error: 'La solicitud ya ha sido procesada' });
        }
        
        // Rechazar la solicitud
        await query(`
            UPDATE requests 
            SET status = 'Rechazado',
                rejected_by = $1,
                rejection_date = CURRENT_TIMESTAMP,
                rejection_reason = $2
            WHERE id = $3
        `, [rejected_by, rejection_reason, id]);
        
        res.json({ message: 'Solicitud rechazada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// RUTAS PARA BIENES
// ============================================================================

// Obtener todos los bienes
router.get('/assets', async (req, res) => {
    try {
        const result = await query(`
            SELECT * FROM assets 
            ORDER BY name ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Procesar devolución de un bien
router.put('/assets/:id/return', async (req, res) => {
    const { id } = req.params;
    const { notes, returned_by } = req.body;
    
    try {
        // Verificar que el bien existe y está asignado
        const assetCheck = await query('SELECT * FROM assets WHERE id = $1', [id]);
        if (assetCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Bien no encontrado' });
        }
        
        const asset = assetCheck.rows[0];
        if (asset.status !== 'Assigned') {
            return res.status(400).json({ error: 'El bien no está asignado' });
        }
        
        const assigned_person = asset.assigned_to;
        
        // Marcar como disponible
        await query(`
            UPDATE assets 
            SET status = 'Available',
                assigned_to = NULL,
                assignment_date = NULL,
                expected_return_date = NULL
            WHERE id = $1
        `, [id]);
        
        // Actualizar solicitud si existe
        await query(`
            UPDATE requests 
            SET actual_return_date = CURRENT_DATE
            WHERE asset_id = $1 AND status = 'Aprobado' AND actual_return_date IS NULL
        `, [id]);
        
        // Registrar el movimiento
        await query(`
            INSERT INTO asset_movements (asset_id, movement_type, from_person, reason, authorized_by, notes)
            VALUES ($1, 'RETURN', $2, 'Devolución de bien', $3, $4)
        `, [id, assigned_person, returned_by, notes]);
        
        res.json({ message: 'Bien devuelto exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// RUTAS PARA MOVIMIENTOS
// ============================================================================

// Obtener todos los movimientos con información de bienes
router.get('/movements', async (req, res) => {
    try {
        const result = await query(`
            SELECT m.*, 
                   a.name as asset_name,
                   a.serial_number as asset_serial,
                   a.inventory_number as asset_inventory,
                   a.brand as asset_brand,
                   a.model as asset_model
            FROM asset_movements m
            JOIN assets a ON m.asset_id = a.id
            ORDER BY m.movement_date DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// RUTAS PARA ESTADÍSTICAS
// ============================================================================

// Obtener estadísticas del dashboard
router.get('/dashboard/stats', async (req, res) => {
    try {
        const stats = await query(`
            SELECT 
                (SELECT COUNT(*) FROM assets) as total_assets,
                (SELECT COUNT(*) FROM assets WHERE status = 'Available') as available_assets,
                (SELECT COUNT(*) FROM assets WHERE status = 'Assigned') as assigned_assets,
                (SELECT COUNT(*) FROM requests WHERE status = 'Pendiente') as pending_requests,
                (SELECT COUNT(*) FROM requests) as total_requests,
                (SELECT COUNT(*) FROM requests WHERE status = 'Aprobado') as approved_requests,
                (SELECT COUNT(*) FROM requests WHERE status = 'Rechazado') as rejected_requests,
                (SELECT COUNT(*) FROM asset_movements) as total_movements,
                (SELECT ROUND(AVG(current_value), 2) FROM assets WHERE current_value IS NOT NULL) as avg_asset_value,
                (SELECT SUM(current_value) FROM assets WHERE current_value IS NOT NULL) as total_asset_value
        `);
        
        res.json(stats.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener bienes próximos a vencer
router.get('/dashboard/expiring-assets', async (req, res) => {
    try {
        const result = await query(`
            SELECT a.*, 
                   CASE 
                       WHEN expected_return_date < CURRENT_DATE THEN 'vencido'
                       WHEN expected_return_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'por_vencer'
                       ELSE 'en_tiempo'
                   END as return_status,
                   expected_return_date - CURRENT_DATE as days_remaining
            FROM assets a
            WHERE status = 'Assigned' 
              AND expected_return_date IS NOT NULL
              AND expected_return_date <= CURRENT_DATE + INTERVAL '30 days'
            ORDER BY expected_return_date ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;