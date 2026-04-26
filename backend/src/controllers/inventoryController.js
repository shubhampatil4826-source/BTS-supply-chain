const { Inventory, Product, Warehouse } = require('../models');

const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findAll({
      include: [
        { model: Product, attributes: ['name', 'category'] },
        { model: Warehouse, attributes: ['name', 'location'] },
      ]
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateInventory = async (req, res) => {
  try {
    let { product_id, quantity, warehouse_id } = req.body;

    // If no warehouse_id provided, use the first warehouse or create a default one
    if (!warehouse_id) {
      let warehouse = await Warehouse.findOne();
      if (!warehouse) {
        warehouse = await Warehouse.create({
          name: 'Main Warehouse',
          location: 'HQ',
          capacity: 10000,
        });
      }
      warehouse_id = warehouse.id;
    } else {
      // Verify the warehouse actually exists
      const warehouseExists = await Warehouse.findByPk(warehouse_id);
      if (!warehouseExists) {
        // Fall back to first warehouse or create default
        let warehouse = await Warehouse.findOne();
        if (!warehouse) {
          warehouse = await Warehouse.create({
            name: 'Main Warehouse',
            location: 'HQ',
            capacity: 10000,
          });
        }
        warehouse_id = warehouse.id;
      }
    }

    let inventoryItem = await Inventory.findOne({ where: { product_id, warehouse_id } });
    if (inventoryItem) {
      inventoryItem.quantity = quantity;
      await inventoryItem.save();
    } else {
      inventoryItem = await Inventory.create({ product_id, quantity, warehouse_id });
    }

    res.json(inventoryItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getInventory, updateInventory };
