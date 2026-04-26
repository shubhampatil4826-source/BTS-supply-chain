import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShoppingCart, Search, Plus, Eye, MoreVertical, X } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({ customer: '', items: '', total: '' });

  const handleAddOrder = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/orders', {
        customer_name: newOrder.customer,
        quantity: parseInt(newOrder.items) || 1,
        total_value: parseFloat(newOrder.total) || 0,
      });
      setOrders([data, ...orders]);
      setIsModalOpen(false);
      setNewOrder({ customer: '', items: '', total: '' });
    } catch (error) {
      console.error('Error creating order:', error);
      alert(error.response?.data?.message || 'Failed to create order.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'In Transit': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Shipped': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">Sales Orders</h2>
          <p className="text-slate-400 mt-1">Manage outbound customer orders and fulfillment</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full sm:w-64 transition-all backdrop-blur-md"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl transition-all transform hover:-translate-y-0.5 font-medium border border-transparent shadow-lg shadow-blue-500/20">
            <Plus size={18} />
            <span>New Order</span>
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="py-4 px-6 text-sm font-semibold text-slate-300">Order ID</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-300">Customer</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-300">Date</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-300">Items</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-300">Total</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-300">Status</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">No orders yet</td>
                </tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                        <ShoppingCart size={16} />
                      </div>
                      <span className="font-medium text-white">#{order.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-300">{order.customer_name || '—'}</td>
                  <td className="py-4 px-6 text-slate-400 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-6 text-slate-300">{order.quantity}</td>
                  <td className="py-4 px-6 font-semibold text-white">${parseFloat(order.total_value || 0).toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-white/10 bg-white/5 text-center sm:text-left text-sm text-slate-400">
          Showing 1 to {orders.length} of {orders.length} orders
        </div>
      </div>

      {/* Add Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-xl font-bold text-white">Create New Order</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddOrder} className="p-6 space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Customer Name</label>
                <input 
                  required
                  type="text" 
                  value={newOrder.customer}
                  onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Total Items</label>
                  <input 
                    required
                    type="number" 
                    min="1"
                    value={newOrder.items}
                    onChange={(e) => setNewOrder({...newOrder, items: e.target.value})}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="e.g. 10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Total Value ($)</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    min="0"
                    value={newOrder.total}
                    onChange={(e) => setNewOrder({...newOrder, total: e.target.value})}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="e.g. 500.00"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 px-4 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors font-medium shadow-lg shadow-blue-500/20">
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
