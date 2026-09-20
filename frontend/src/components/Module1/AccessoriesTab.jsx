import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Zap, 
  Headphones, 
  BatteryCharging, 
  Shield, 
  Maximize2, 
  Cable, 
  HardDrive, 
  Wrench, 
  Barcode, 
  Plus, 
  Layers, 
  Trash2 
} from 'lucide-react';

export default function AccessoriesTab({ 
  products = [], 
  categories = [], 
  brands = [], 
  loading, 
  onOpenAddAccessory, 
  onOpenCatBrandManager, 
  onPrintBarcode, 
  onRefresh 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [deletingId, setDeletingId] = useState(null);

  const filteredProducts = products.filter((p) => {
    if (p.type === 'PHONE') return false;

    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || p.category?.slug === categoryFilter || p.categoryId === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = async (id, name) => {
    if (!confirm(`Je, una uhakika unataka kufuta accessory "${name}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (onRefresh) await onRefresh();
      } else {
        alert(data.message || 'Imeshindikana kufuta product');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }

  };

  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'chargers': return <Zap className="w-4 h-4 text-amber-600" />;
      case 'audio': return <Headphones className="w-4 h-4 text-purple-600" />;
      case 'power-banks': return <BatteryCharging className="w-4 h-4 text-emerald-600" />;
      case 'covers-skins': return <Shield className="w-4 h-4 text-sky-600" />;
      case 'screen-protectors': return <Maximize2 className="w-4 h-4 text-blue-600" />;
      case 'cables': return <Cable className="w-4 h-4 text-orange-600" />;
      case 'storage': return <HardDrive className="w-4 h-4 text-indigo-600" />;
      case 'spare-parts': return <Wrench className="w-4 h-4 text-rose-600" />;
      default: return <Package className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white p-6 rounded-2xl border border-sky-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#80ddff]/30 text-sky-900 border border-sky-300 text-xs font-extrabold mb-1">
            <Package className="w-3.5 h-3.5" />
            Dynamic Multi-Variant Catalog
          </div>
          <h2 className="text-xl font-black text-slate-900">Accessories, Gadgets & Spare Parts</h2>
          <p className="text-xs text-slate-600 max-w-2xl">
            Covers, Chargers, AirPods, Powerbanks, Smartwatches, Memory Cards & Cables with individual color/size variant stock levels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenCatBrandManager}
            className="px-3.5 py-3 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-300 text-xs font-bold transition flex items-center gap-1.5"
            title="Manage Categories & Brands"
          >
            <Layers className="w-4 h-4 text-sky-700" />
            <span>Brands & Categories</span>
          </button>

          <button
            onClick={onOpenAddAccessory}
            className="sky-btn-main px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Accessory</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search accessories by title, SKU, barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-sky-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-sm"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white border border-sky-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-sky-500 shadow-sm font-semibold"
        >
          <option value="ALL">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs">Loading accessories catalog...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-xs">No items found matching filter.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-5 border border-sky-200 hover:border-sky-400 transition-all flex flex-col justify-between space-y-4 shadow-sm"
            >
              {/* Category & Title */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-slate-700 rounded-lg flex items-center gap-1.5 border border-sky-200">
                    {getCategoryIcon(product.category?.slug)}
                    {product.category?.name || 'Accessory'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onPrintBarcode(product.barcode || product.sku || product.name)}
                      className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold"
                      title="Print Barcode"
                    >
                      <Barcode className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base leading-tight mb-1">{product.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{product.description || 'No description provided'}</p>
              </div>

              {/* Price & Stock info */}
              <div className="pt-3 border-t border-sky-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block font-semibold">Retail Price</span>
                  <span className="text-slate-900 font-black text-sm">
                    TSH {(product.basePrice || product.variants?.[0]?.price || 0).toLocaleString()}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-slate-500 text-[10px] block font-semibold">In Stock</span>
                  <span className={`font-black text-xs px-2 py-0.5 rounded-md ${
                    product.totalStock > 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {product.totalStock || 0} units
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
