const express = require('express');
const { getInventory, updateInventory } = require('../controllers/inventoryController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getInventory);

router.route('/update')
  .put(protect, authorize('Admin', 'Warehouse Manager', 'Supplier'), updateInventory);

module.exports = router;
