const { Order, DemandData, Inventory, Shipment, Product, sequelize } = require('../models');

const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { customer_name, quantity, total_value, product_id } = req.body;
    const user_id = req.user?.id || null;
    const qty = parseInt(quantity) || 1;

    // Resolve product_id — use provided, or fall back to first product, or create placeholder
    let resolvedProductId = product_id ? parseInt(product_id) : null;
    if (resolvedProductId) {
      const productExists = await Product.findByPk(resolvedProductId, { transaction });
      if (!productExists) resolvedProductId = null;
    }
    if (!resolvedProductId) {
      let product = await Product.findOne({ transaction });
      if (!product) {
        product = await Product.create(
          { name: 'General Item', category: 'General', price: 0 },
          { transaction }
        );
      }
      resolvedProductId = product.id;
    }

    // Deduct inventory if available — but never block the order
    const inventory = await Inventory.findOne({ where: { product_id: resolvedProductId }, transaction });
    if (inventory && inventory.quantity >= qty) {
      inventory.quantity -= qty;
      await inventory.save({ transaction });
    }
    // If inventory doesn't exist or is insufficient, we still proceed

    // Create order
    const order = await Order.create(
      {
        user_id,
        product_id: resolvedProductId,
        customer_name: customer_name || 'Unknown',
        quantity: qty,
        total_value: parseFloat(total_value) || 0,
        status: 'Pending',
      },
      { transaction }
    );

    // Log demand
    await DemandData.create({ product_id: resolvedProductId, quantity: qty }, { transaction });

    // Create default shipment
    await Shipment.create({ order_id: order.id, status: 'Pending' }, { transaction });

    await transaction.commit();
    res.status(201).json(order);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOrders, createOrder };
