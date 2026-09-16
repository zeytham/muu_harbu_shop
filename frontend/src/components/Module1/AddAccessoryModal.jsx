import React, { useState } from 'react';
import { X, Package, Plus, Trash2, Shield, Zap } from 'lucide-react';

export default function AddAccessoryModal({ categories, brands, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('ACCESSORY'); // ACCESSORY, GADGET, SPARE_PART
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [brandId, setBrandId] = useState(brands[0]?.id || '');
  const [description, setDescription] = useState('');

  // Specs JSON fields
  const [specKey, setSpecKey] = useState('wattage');
  const [specVal, setSpecVal] = useState('20W PD');
  const [specs, setSpecs] = useState({ wattage: '20W PD' });

  // Has Variants Toggle
  const [hasVariants, setHasVariants] = useState(false);

  // Single Item fields
  const [basePrice, setBasePrice] = useState('25000');
  const [costPrice, setCostPrice] = useState('12000');
  const [stockQuantity, setStockQuantity] = useState('20');
  const [barcode, setBarcode] = useState('');
  const [sku, setSku] = useState('');

  // Variants Matrix fields
  const [variants, setVariants] = useState([
    { color: 'Black', size: 'Universal', price: '25000', costPrice: '12000', stockQuantity: '15', barcode: '', sku: '' },
    { color: 'Clear', size: 'Universal', price: '25000', costPrice: '12000', stockQuantity: '10', barcode: '', sku: '' },
  ]);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleAddSpec = () => {
    if (specKey && specVal) {
      setSpecs({ ...specs, [specKey]: specVal });
      setSpecKey('');
      setSpecVal('');
    }
  };

  const handleRemoveSpec = (k) => {
    const updated = { ...specs };
    delete updated[k];
    setSpecs(updated);
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { color: 'New Color', size: 'Standard', price: '25000', costPrice: '12000', stockQuantity: '10', barcode: '', sku: '' },
    ]);
  };

  const handleRemoveVariant = (idx) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleVariantChange = (idx, field, val) => {
    const updated = [...variants];
    updated[idx][field] = val;
    setVariants(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          type,
          categoryId,
          brandId,
          description,
          hasVariants,
          specifications: specs,
          basePrice,
          costPrice,
          stockQuantity,
          barcode,
          sku,
          variants: hasVariants ? variants : undefined,
        }),
      });

      const json = await res.json();
      if (json.success) {
        onSuccess();
        onClose();
      } else {
        setMsg({ error: true, text: json.message });
      }
    } catch (err) {
      setMsg({ error: true, text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Add Accessory or Electronics Gadget</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {msg && (
          <div className={`p-3 rounded-xl text-xs font-medium ${msg.error ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400'}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Item Name & Type */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-slate-400 font-semibold mb-1">Item Title / Name:</label>
              <input
                type="text"
                required
                placeholder="e.g. MagSafe Armor Case, Anker 20W Charger, AirPods Pro 2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Product Type:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="ACCESSORY">Accessory (Covers/Skins/Protectors)</option>
                <option value="GADGET">Gadget (Chargers/AirPods/Powerbanks)</option>
                <option value="SPARE_PART">Spare Part (Screens/Batteries)</option>
              </select>
            </div>
          </div>

          {/* Category & Brand Select */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Category:</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Brand:</label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Technical Specifications Matrix */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <label className="block text-slate-300 font-bold">Dynamic Specs (e.g. Wattage, mAh, Bluetooth, Warranty):</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Spec Key (e.g. wattage, capacity)"
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
              />
              <input
                type="text"
                placeholder="Value (e.g. 65W GaN, 20000mAh)"
                value={specVal}
                onChange={(e) => setSpecVal(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
              />
              <button
                type="button"
                onClick={handleAddSpec}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold"
              >
                Add Spec
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {Object.entries(specs).map(([k, v]) => (
                <span key={k} className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 flex items-center gap-1.5 border border-slate-700">
                  <span>{k}: {v}</span>
                  <button type="button" onClick={() => handleRemoveSpec(k)} className="hover:text-rose-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Has Variants Checkbox */}
          <div className="flex items-center gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <input
              type="checkbox"
              id="hasVariants"
              checked={hasVariants}
              onChange={(e) => setHasVariants(e.target.checked)}
              className="h-4 w-4 rounded accent-cyan-500"
            />
            <label htmlFor="hasVariants" className="text-white font-bold cursor-pointer">
              This product has multiple variants (Different Colors, Sizes, or Models)
            </label>
          </div>

          {/* Variants Form Matrix */}
          {hasVariants ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Color & Size Variants Matrix:</span>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-[11px] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Color/Variant Row
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-5 gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 items-center">
                    <input
                      type="text"
                      placeholder="Color (Black)"
                      value={v.color}
                      onChange={(e) => handleVariantChange(i, 'color', e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Size/Fit (Universal)"
                      value={v.size}
                      onChange={(e) => handleVariantChange(i, 'size', e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={v.price}
                      onChange={(e) => handleVariantChange(i, 'price', e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-bold"
                    />
                    <input
                      type="number"
                      placeholder="Stock Qty"
                      value={v.stockQuantity}
                      onChange={(e) => handleVariantChange(i, 'stockQuantity', e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-emerald-400 font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(i)}
                      className="p-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 w-fit justify-self-end"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Retail Price (TSH):</label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Cost Price (TSH):</label>
                <input
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Stock Quantity:</label>
                <input
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
            >
              {loading ? 'Saving...' : 'Save Product & Variants'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
