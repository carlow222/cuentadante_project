import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// Get all cereals
router.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM cereals ORDER BY name');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get cereal by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('SELECT * FROM cereals WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cereal not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new cereal
router.post('/', async (req, res) => {
    const { name, description, unit_of_measure, stock_quantity, minimum_stock } = req.body;
    try {
        const result = await query(
            `INSERT INTO cereals (name, description, unit_of_measure, stock_quantity, minimum_stock) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, description, unit_of_measure || 'kg', stock_quantity || 0, minimum_stock || 0]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update cereal
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, unit_of_measure, stock_quantity, minimum_stock } = req.body;
    try {
        const result = await query(
            `UPDATE cereals 
             SET name = $1, description = $2, unit_of_measure = $3, 
                 stock_quantity = $4, minimum_stock = $5
             WHERE id = $6 RETURNING *`,
            [name, description, unit_of_measure, stock_quantity, minimum_stock, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cereal not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update stock after request approval
router.put('/:id/update-stock', async (req, res) => {
    const { id } = req.params;
    const { quantity, operation } = req.body; // operation: 'subtract' or 'add'
    
    try {
        const currentCereal = await query('SELECT * FROM cereals WHERE id = $1', [id]);
        if (currentCereal.rows.length === 0) {
            return res.status(404).json({ error: 'Cereal not found' });
        }

        const currentStock = parseFloat(currentCereal.rows[0].stock_quantity);
        const changeAmount = parseFloat(quantity);
        
        let newStock;
        if (operation === 'subtract') {
            newStock = currentStock - changeAmount;
            if (newStock < 0) {
                return res.status(400).json({ error: 'Stock insuficiente' });
            }
        } else if (operation === 'add') {
            newStock = currentStock + changeAmount;
        } else {
            return res.status(400).json({ error: 'Operación inválida' });
        }

        const result = await query(
            'UPDATE cereals SET stock_quantity = $1 WHERE id = $2 RETURNING *',
            [newStock, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete cereal
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM cereals WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cereal not found' });
        }
        res.json({ message: 'Cereal deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;