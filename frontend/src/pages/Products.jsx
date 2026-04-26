import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Search, Tag, DollarSign, PackageOpen, X } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category_id: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/products', {
        name: newProduct.name,
        price: parseFloat(newProduct.price) || 0,
        category_id: newProduct.category_id || 'General'
      });
      setProducts([data, ...products]);
      setIsModalOpen(false);
      setNewProduct({ name: '', price: '', category_id: '' });
    } catch (error) {
      console.error('Error adding product:', error);
      alert(error.response?.data?.message || 'Failed to add product. Ensure you are logged in.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Product Catalog</h2>
          <p className="text-slate-400 mt-1">Manage your SKUs and variants</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full sm:w-64 transition-all"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-colors font-medium border border-blue-400/30 shadow-lg shadow-blue-500/20">
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length === 0 && (
             <div className="col-span-full glass-card p-12 text-center flex flex-col items-center justify-center rounded-2xl">
               <PackageOpen size={48} className="text-slate-500 mb-4" />
               <h3 className="text-xl font-bold text-white">No products found</h3>
               <p className="text-slate-400 mt-2">Start adding inventory items to build your catalog.</p>
             </div>
          )}
          {products.map((product) => (
            <div key={product.id} className="glass-card rounded-2xl p-5 group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-blue-500/20"></div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center mb-4 text-blue-400 shadow-inner">
                  <PackageOpen size={24} />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{product.name}</h3>
                
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center text-slate-400 text-sm bg-slate-800/50 px-3 py-1 rounded-lg border border-white/5">
                    <Tag size={14} className="mr-1.5" />
                    <span>Cat ID: {product.category_id || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-green-400 text-sm font-semibold bg-green-900/20 px-3 py-1 rounded-lg border border-green-500/20">
                    <DollarSign size={14} />
                    <span>{product.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-xl font-bold text-white">Add New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Product Name</label>
                <input 
                  required
                  type="text" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="e.g. Smart Sensor V2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                  <input 
                    required
                    type="text" 
                    value={newProduct.category_id}
                    onChange={(e) => setNewProduct({...newProduct, category_id: e.target.value})}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="e.g. Electronics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Price ($)</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    min="0"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="e.g. 299.99"
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
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
