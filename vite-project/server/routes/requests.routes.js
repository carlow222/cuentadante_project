import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// Get all requests
router.get('/', async (req, res) => {
    try {
        const result = await query(`
            SELECT r.*, 
                   a.name as asset_name,
                   a.serial_number as asset_serial,
                   a.inventory_number as asset_inventory,
                   a.brand as asset_brand,
                   a.model as asset_model,
                   a.category as asset_category,
                   a.status as asset_status
            FROM requests r
            JOIN assets a ON r.asset_id = a.id
            ORDER BY r.request_date DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new request
router.post('/', async (req, res) => {
    const { applicant_name, asset_id, reason, priority, expected_return_date } = req.body;
    
    try {
        // Validar que se proporcione asset_id
        if (!asset_id) {
            return res.status(400).json({ error: 'asset_id es requerido para solicitudes de bienes' });
        }

        // Verificar que el bien existe y está disponible
        const assetCheck = await query('SELECT * FROM assets WHERE id = $1', [asset_id]);
        if (assetCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Bien no encontrado' });
        }
        
        const asset = assetCheck.rows[0];
        if (asset.status !== 'Available') {
            return res.status(400).json({ 
                error: `El bien "${asset.name}" (S/N: ${asset.serial_number}) no está disponible. Estado actual: ${asset.status}` 
            });
        }

        const result = await query(
            `INSERT INTO requests (applicant_name, asset_id, reason, priority, expected_return_date) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [applicant_name, asset_id, reason, priority || 'Media', expected_return_date]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Approve request
router.put('/:id/approve', async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        // Get current request
        const currentRequest = await query('SELECT * FROM requests WHERE id = $1', [id]);
        if (currentRequest.rows.length === 0) {
            return res.status(404).json({ error: 'Request not found' });
        }

        const request = currentRequest.rows[0];
        const statusWorkflow = request.status_workflow;

        // Update the specific role status
        statusWorkflow[role] = 'Aprobado';

        // Check if all are approved
        const allApproved = Object.values(statusWorkflow).every(s => s === 'Aprobado');
        const finalStatus = allApproved ? 'Aprobado' : 'Pendiente';

        // Si la solicitud está completamente aprobada, cambiar estado del bien a Assigned
        if (allApproved && request.asset_id) {
            await query(
                'UPDATE assets SET status = $1 WHERE id = $2',
                ['Assigned', request.asset_id]
            );
        }

        // Update request
        const result = await query(
            `UPDATE requests 
             SET status_workflow = $1, final_status = $2, action_date = CURRENT_TIMESTAMP
             WHERE id = $3 RETURNING *`,
            [JSON.stringify(statusWorkflow), finalStatus, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reject request
router.put('/:id/reject', async (req, res) => {
    const { id } = req.params;
    const { role, reason } = req.body;

    try {
        // Get current request
        const currentRequest = await query('SELECT * FROM requests WHERE id = $1', [id]);
        if (currentRequest.rows.length === 0) {
            return res.status(404).json({ error: 'Request not found' });
        }

        const request = currentRequest.rows[0];
        const statusWorkflow = request.status_workflow;

        // Update the specific role status
        statusWorkflow[role] = 'Rechazado';

        // Update request
        const result = await query(
            `UPDATE requests 
       SET status_workflow = $1, final_status = 'Rechazado', 
           rejection_reason = $2, rejected_by_role = $3, action_date = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING *`,
            [JSON.stringify(statusWorkflow), reason, role, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
