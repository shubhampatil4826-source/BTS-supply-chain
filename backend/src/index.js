require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');

// Import models to ensure associations are defined before sync
require('./models');

const app = express();

// Configure CORS - allow frontend origin from env, or all origins in development
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
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

  // Sync DB — use alter in development, no-op sync in production
  if (process.env.NODE_ENV !== 'production') {
    await sequelize.sync({ alter: true });
    console.log('Database synced');
  } else {
    await sequelize.sync();
    console.log('Database connected in production mode');
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
