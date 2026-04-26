require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');

// Import models to ensure associations are defined before sync
require('./models');

const app = express();

// Configure CORS — allow specific frontend origins or all in development
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((o) => o.trim())
  : ['*'];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Render health checks)
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/demand', require('./routes/demandRoutes'));
app.use('/api/shipments', require('./routes/shipmentRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/warehouses', require('./routes/warehouseRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));
app.use('/api/purchase_orders', require('./routes/purchaseOrderRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Sync DB — alter: true adds missing columns without dropping data
  await sequelize.sync({ alter: true });
  console.log('Database synced (alter mode)');

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
