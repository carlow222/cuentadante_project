import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM assets');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { name, description, serial_number, inventory_number, status } = req.body;
    try {
        const result = await query(
            'INSERT INTO assets (name, description, serial_number, inventory_number, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, description, serial_number, inventory_number, status]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
