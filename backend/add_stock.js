const { Product, Inventory, Warehouse } = require('./src/models');

async function addStock() {
  try {
    // Check if warehouse exists, if not create one
    let warehouse = await Warehouse.findOne();
    if (!warehouse) {
      warehouse = await Warehouse.create({
        name: 'Main Warehouse',
        location: 'Main Distribution Center',
        capacity: 10000
      });
    }

    const product = await Product.create({
      name: 'Sample Product from Antigravity',
      category: 'Electronics',
      price: 199.99
    });

    const inventory = await Inventory.create({
      product_id: product.id,
      warehouse_id: warehouse.id,
      quantity: 50
    });

    console.log('Successfully added stock entry:');
    console.log('Product:', product.toJSON());
    console.log('Warehouse ID:', warehouse.id);
    console.log('Inventory:', inventory.toJSON());
    process.exit(0);
  } catch (error) {
    console.error('Error adding stock:', error);
    process.exit(1);
  }
}

addStock();
