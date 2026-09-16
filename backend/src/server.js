import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import productsRoutes from './routes/products.routes.js';
import phonesRoutes from './routes/phones.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import compatibilityRoutes from './routes/compatibility.routes.js';
import barcodesRoutes from './routes/barcodes.routes.js';
import authRoutes from './routes/auth.routes.js';
import posRoutes from './routes/pos.routes.js';
import upgradeRoutes from './routes/upgrade.routes.js';
import warrantiesRoutes from './routes/warranties.routes.js';
import financialsRoutes from './routes/financials.routes.js';
import forecastingRoutes from './routes/forecasting.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import smsRoutes from './routes/sms.routes.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', system: 'Phone & Accessories Management System API', version: '1.0.0' });
});

// API Routes for Module 1, Module 2, Module 3, Module 4, Module 5, Module 6, Settings & SMS
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/phones', phonesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/compatibility', compatibilityRoutes);
app.use('/api/barcodes', barcodesRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/upgrades', upgradeRoutes);
app.use('/api/warranties', warrantiesRoutes);
app.use('/api/financials', financialsRoutes);
app.use('/api/forecasting', forecastingRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/sms', smsRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err.stack);
  res.status(500).json({ error: true, message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Phone Shop System API running on port ${PORT}`);
});
