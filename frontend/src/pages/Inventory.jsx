import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Package, Search, Plus, Archive, ChevronDown, CheckCircle2, AlertCircle, X } from 'lucide-react';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStock, setNewStock] = useState({ name: '', category: '', warehouse_id: '', quantity: '' });

  useEffect(() => {
    fetchInventory();
    fetchWarehouses();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data } = await api.get('/inventory');
      setInventory(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const { data } = await api.get('/warehouses');
      setWarehouses(data);
      // Pre-select the first warehouse if available
      if (data.length > 0) {
        setNewStock(prev => ({ ...prev, warehouse_id: data[0].id }));
      }
    } catch (error) {
      console.error('Failed to load warehouses:', error);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      // First create the product
      const productResponse = await api.post('/products', {
        name: newStock.name,
        category: newStock.category,
        price: 0,
      });
      const newProduct = productResponse.data;

      // Then update inventory — pass warehouse_id (null if none selected, backend handles it)
      const { data } = await api.put('/inventory/update', {
        product_id: newProduct.id,
        warehouse_id: newStock.warehouse_id ? parseInt(newStock.warehouse_id) : null,
        quantity: parseInt(newStock.quantity) || 0,
      });

      const inventoryData = {
        ...data,
        Product: newProduct
      };

      setInventory([inventoryData, ...inventory]);
      setIsModalOpen(false);
      setNewStock({ name: '', category: '', warehouse_id: warehouses[0]?.id || '', quantity: '' });
    } catch (error) {
      console.error('Error adding stock:', error);
      alert(error.response?.data?.message || 'Failed to add stock. Ensure you have the correct role permissions.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Inventory Monitor</h2>
          <p className="text-blue-200 mt-1">Real-time stock tracking across warehouses</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-300">
             <Archive size={20} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-sm rounded-xl transition-all font-medium border border-blue-400/30 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            <Plus size={18} />
            <span>Add Stock</span>
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              className="pl-9 pr-4 py-1.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
            />
          </div>
          <button className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-black/20 border border-white/10 transition-colors">
            Filter <ChevronDown size={14} />
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5 text-sm">
              <thead className="bg-black/20">
                <tr>
                  <th className="px-6 py-4 text-left font-medium text-slate-400 tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-400 tracking-wider">SKU / Cat</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-400 tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-400 tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-400 tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-400 tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {inventory.length > 0 ? inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-400/20 group-hover:bg-blue-500/20 transition-colors">
                        <Package size={16} />
                      </div>
                      {item.Product?.name || `Product #${item.product_id}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">{item.Product?.category_id || '--'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2.5 py-1 rounded-md text-xs">
                        WH-{item.warehouse_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="font-semibold text-white tracking-wide">{item.quantity}</span>
                       <span className="text-slate-500 ml-1 text-xs">units</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.quantity < 20 ? (
                        <div className="flex items-center text-red-400 text-xs font-semibold bg-red-400/10 px-2.5 py-1 rounded-full border border-red-400/20 w-max">
                           <AlertCircle size={14} className="mr-1.5" /> Low Stock
                        </div>
                      ) : (
                        <div className="flex items-center text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20 w-max">
                           <CheckCircle2 size={14} className="mr-1.5" /> Optimal
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-400 font-medium hover:text-blue-300 cursor-pointer transition-colors hover:underline">
                      Manage
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <Archive size={40} className="mb-3 opacity-20" />
                        <p>No inventory records found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Stock Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-xl font-bold text-white">Add Stock Entry</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddStock} className="p-6 space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Product Name</label>
                <input required type="text" value={newStock.name} onChange={(e) => setNewStock({...newStock, name: e.target.value})} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                  <input required type="text" value={newStock.category} onChange={(e) => setNewStock({...newStock, category: e.target.value})} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Warehouse</label>
                  <select
                    value={newStock.warehouse_id}
                    onChange={(e) => setNewStock({...newStock, warehouse_id: e.target.value})}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    {warehouses.length === 0 ? (
                      <option value="">No warehouse — one will be created</option>
                    ) : (
                      warehouses.map(wh => (
                        <option key={wh.id} value={wh.id}>{wh.name} ({wh.location})</option>
                      ))
                    )}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Quantity</label>
                <input required type="number" min="1" value={newStock.quantity} onChange={(e) => setNewStock({...newStock, quantity: e.target.value})} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 px-4 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium">Cancel</button>
                <button type="submit" className="flex-1 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors font-medium shadow-lg shadow-blue-500/20">Add Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
