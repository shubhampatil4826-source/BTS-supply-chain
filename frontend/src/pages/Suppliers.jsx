import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Search, Plus, Mail, Phone, MapPin, Star, Building, X } from 'lucide-react';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const { data } = await api.get('/suppliers');
      setSuppliers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: '', contact: '', phone: '', type: '', location: '' });

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/suppliers', {
        name: newSupplier.name,
        contact_email: newSupplier.contact,
        phone: newSupplier.phone,
        type: newSupplier.type,
        location: newSupplier.location,
        rating: parseFloat((Math.random() * 1 + 4).toFixed(1))
      });
      setSuppliers([...suppliers, data]);
      setIsModalOpen(false);
      setNewSupplier({ name: '', contact: '', phone: '', type: '', location: '' });
    } catch (error) {
      console.error('Error adding supplier:', error);
      alert(error.response?.data?.message || 'Failed to add supplier. Ensure you are logged in.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 tracking-tight">Suppliers Directory</h2>
          <p className="text-slate-400 mt-1">Manage vendor relationships and capabilities</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Find supplier..." 
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-full sm:w-64 transition-all backdrop-blur-md"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-xl transition-all transform hover:-translate-y-0.5 font-medium border border-transparent shadow-lg shadow-emerald-500/20">
            <Plus size={18} />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="glass-card p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                    <Building size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{supplier.name}</h3>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-wider">{supplier.type}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <Mail size={16} className="text-slate-500" />
                  <a href={`mailto:${supplier.contact_email}`} className="hover:text-emerald-400 transition-colors">{supplier.contact_email}</a>
                </div>
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <Phone size={16} className="text-slate-500" />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <MapPin size={16} className="text-slate-500" />
                  <span>{supplier.location}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">{supplier.id}</span>
                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-amber-400">{supplier.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-xl font-bold text-white">Add New Supplier</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSupplier} className="p-6 space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Supplier Name</label>
                <input required type="text" value={newSupplier.name} onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
                  <input required type="text" value={newSupplier.type} onChange={(e) => setNewSupplier({...newSupplier, type: e.target.value})} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                  <input required type="text" value={newSupplier.location} onChange={(e) => setNewSupplier({...newSupplier, location: e.target.value})} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Email Contact</label>
                  <input required type="email" value={newSupplier.contact} onChange={(e) => setNewSupplier({...newSupplier, contact: e.target.value})} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                  <input required type="text" value={newSupplier.phone} onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 px-4 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium">Cancel</button>
                <button type="submit" className="flex-1 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors font-medium shadow-lg shadow-emerald-500/20">Add Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
