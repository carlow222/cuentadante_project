import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.routes.js';
import assetRoutes from './routes/assets.routes.js';
import requestRoutes from './routes/requests.routes.js';
import cuentadanteRoutes from './routes/cuentadante.routes.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Routes principales (mantener compatibilidad)
app.use('/api/users', userRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/requests', requestRoutes);

// Nuevas rutas específicas para Cuentadante
app.use('/api', cuentadanteRoutes);


app.get('/', (req, res) => {
    res.send('Cuentadante API is running');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
