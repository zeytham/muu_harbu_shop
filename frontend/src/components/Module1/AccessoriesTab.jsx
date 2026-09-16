import React, { useState } from 'react';
import { Package, Search, Zap, Headphones, BatteryCharging, Shield, Maximize2, Cable, HardDrive, Wrench, Barcode, AlertTriangle } from 'lucide-react';

export default function AccessoriesTab({ products, loading, onPrintBarcode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredProducts = products.filter((p) => {
    if (p.type === 'PHONE') return false;

    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || p.category?.slug === categoryFilter;

    return matchesSearch && matchesCategory;
  });

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
          <option value="chargers">⚡ Chargers & Power Blocks</option>
          <option value="audio">🎧 Audio & AirPods / Earbuds</option>
          <option value="power-banks">🔋 Power Banks</option>
          <option value="covers-skins">📲 Covers, Skins & Stickers</option>
          <option value="screen-protectors">🛡️ Screen Protectors & Privacy Glass</option>
          <option value="cables">🔌 Cables & Adapters</option>
          <option value="storage">💾 Memory Cards & Storage</option>
          <option value="spare-parts">🛠️ Repair Spare Parts</option>
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
                    {product.category?.name}
                  </span>

                  {product.brand?.name && (
                    <span className="text-[11px] font-extrabold text-sky-700">{product.brand.name}</span>
                  )}
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{product.description}</p>

                {/* Specs Tags */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <span key={key} className="px-2 py-0.5 text-[10px] font-semibold bg-[#80ddff]/25 text-sky-900 border border-sky-300 rounded-md">
                        {key}: {String(val)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Variant Matrix / Stock Display */}
              <div className="border-t border-sky-100 pt-4 space-y-2">
                {product.hasVariants ? (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-600 font-semibold">Variants ({product.variants?.length}):</span>
                      <span className="text-emerald-700 font-bold">Total Stock: {product.totalStock}</span>
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {product.variants?.map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-sky-50/70 text-[11px] border border-sky-100"
                        >
                          <div>
                            <span className="font-bold text-slate-900">{v.color || v.style || 'Variant'}</span>
                            {v.size && <span className="text-slate-500 ml-1.5">({v.size})</span>}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-amber-700 font-bold">TSH {v.price?.toLocaleString()}</span>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                                v.stockQuantity <= v.reorderLevel
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              Qty: {v.stockQuantity}
                            </span>
                            <button
                              onClick={() => onPrintBarcode(v.barcode || v.sku)}
                              className="p-1 hover:bg-sky-100 text-slate-700 rounded"
                              title="Print Sticker"
                            >
                              <Barcode className="w-3.5 h-3.5 text-sky-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="text-slate-900 font-extrabold text-base">TSH {product.basePrice?.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500">Cost: TSH {product.costPrice?.toLocaleString()}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-emerald-700 font-bold text-sm">Stock: {product.totalStock}</div>
                      <button
                        onClick={() => onPrintBarcode(product.barcode || product.sku)}
                        className="mt-1 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-slate-800 border border-sky-200 text-[10px] font-bold flex items-center gap-1 ml-auto"
                      >
                        <Barcode className="w-3 h-3 text-sky-600" />
                        <span>Print Sticker</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
