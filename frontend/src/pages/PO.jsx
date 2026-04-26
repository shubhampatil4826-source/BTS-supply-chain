import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ClipboardList, Search, Plus, ArrowRight, FileText, X } from 'lucide-react';

const PurchaseOrders = () => {
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPOs();
  }, []);

  const fetchPOs = async () => {
    try {
      const { data } = await api.get('/purchase_orders');
      setPos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPO, setNewPO] = useState({ supplier: '', total: '' });

  const handleAddPO = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/purchase_orders', {
        supplier_id: 1, // Ensure you have at least one supplier created in the DB!
        total_amount: parseFloat(newPO.total) || 0
      });
      setPos([data, ...pos]);
      setIsModalOpen(false);
      setNewPO({ supplier: '', total: '' });
    } catch (error) {
      console.error('Error creating PO:', error);
      alert(error.response?.data?.message || 'Failed to create PO. Ensure you are logged in and have created a Supplier first.');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Received': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 tracking-tight">Purchase Orders</h2>
          <p className="text-slate-400 mt-1">Manage inbound shipments and supplier requisitions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search POs..." 
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-full sm:w-64 transition-all backdrop-blur-md"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2 rounded-xl transition-all transform hover:-translate-y-0.5 font-medium border border-transparent shadow-lg shadow-purple-500/20">
            <Plus size={18} />
            <span>Create PO</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
          <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ClipboardList size={20} className="text-purple-400" />
              Active Requisitions
            </h3>
          </div>
          <div className="divide-y divide-white/5">
            {pos.map((po) => (
              <div key={po.id} className="p-6 hover:bg-white/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-lg text-white">{po.id}</h4>
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${getStatusStyle(po.status)}`}>
                        {po.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">{po.supplier}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 sm:gap-8">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Expected</p>
                    <p className="text-slate-300 text-sm font-medium">{po.expectedDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Total</p>
                    <p className="text-emerald-400 font-bold">{po.total}</p>
                  </div>
                  <button className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors group-hover:translate-x-1">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl">
             <h3 className="text-lg font-bold text-white mb-4">PO Summary</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-slate-400">Total Active</span>
                  <span className="text-xl font-bold text-white">4</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-slate-400">Total Value</span>
                  <span className="text-xl font-bold text-emerald-400">$170,700</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-slate-400">Pending Approval</span>
                  <span className="text-xl font-bold text-amber-400">1</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Create PO Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-xl font-bold text-white">Create Purchase Order</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddPO} className="p-6 space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Supplier Name</label>
                <input required type="text" value={newPO.supplier} onChange={(e) => setNewPO({...newPO, supplier: e.target.value})} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Total Amount ($)</label>
                <input required type="number" step="0.01" min="0" value={newPO.total} onChange={(e) => setNewPO({...newPO, total: e.target.value})} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 px-4 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium">Cancel</button>
                <button type="submit" className="flex-1 py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors font-medium shadow-lg shadow-purple-500/20">Create PO</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrders;
