import React, { useState } from 'react';
import { X, Smartphone, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AddPhoneModal({ products = [], brands = [], onClose, onSuccess }) {
  const phoneProducts = products.filter((p) => p.type === 'PHONE');

  const [isBulkMode, setIsBulkMode] = useState(false);
  const [productId, setProductId] = useState(phoneProducts[0]?.id || '');
  const [color, setColor] = useState('Natural Titanium');
  const [storage, setStorage] = useState('256GB');
  const [ram, setRam] = useState('8GB');
  const [condition, setCondition] = useState('NEW_SEALED');
  const [buyingPrice, setBuyingPrice] = useState('2400000');
  const [retailPrice, setRetailPrice] = useState('2850000');
  const [minSellingPrice, setMinSellingPrice] = useState('2750000');
  const [warrantyMonths, setWarrantyMonths] = useState('12');

  // Single mode
  const [imei1, setImei1] = useState('');
  const [imei2, setImei2] = useState('');
  const [serialNumber, setSerialNumber] = useState('');

  // Bulk mode
  const [bulkImeisText, setBulkImeisText] = useState('');

  // Inline "Add New Model" toggle state
  const [showAddModelForm, setShowAddModelForm] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [newModelBrandId, setNewModelBrandId] = useState('');
  const [addingModel, setAddingModel] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // Handle Inline Creation of New Phone Model
  const handleCreateNewModel = async (e) => {
    e.preventDefault();
    if (!newModelName) {
      alert('Tafadhali ingiza Jina la Model (mfano: iPhone 16 Pro Max au Galaxy S25 Ultra)');
      return;
    }

    setAddingModel(true);
    try {
      // Create brand if no brand selected yet
      let selectedBrandId = newModelBrandId || brands[0]?.id;
      if (!selectedBrandId) {
        // Quick create default brand if list is empty
        const bRes = await fetch('/api/categories/brands', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Generic Brand' }),
        });
        const bData = await bRes.json();
        if (bData.success) selectedBrandId = bData.data.id;
      }

      const res = await fetch('/api/categories/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelName: newModelName,
          brandId: selectedBrandId,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setMsg({ error: false, text: `🎉 Model "${newModelName}" imeongezwa kikamilifu kwenye catalog!` });
        setShowAddModelForm(false);
        setNewModelName('');
        // Trigger parent data refresh to reload products dropdown
        await onSuccess();
        if (json.data?.product?.id) {
          setProductId(json.data.product.id);
        }
      } else {
        setMsg({ error: true, text: json.message || 'Imeshindikana kuongeza model' });
      }
    } catch (err) {
      console.error(err);
      setMsg({ error: true, text: err.message });
    } finally {
      setAddingModel(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const activeProductId = productId || phoneProducts[0]?.id;

    if (!activeProductId) {
      setMsg({
        error: true,
        text: 'Hauna Smartphone Model iliyochaguliwa. Bonyeza "+ Add New Model" kuongeza model kwanza.',
      });
      setLoading(false);
      return;
    }

    try {
      if (isBulkMode) {
        const lines = bulkImeisText
          .split(/[\n,]/)
          .map((s) => s.trim())
          .filter(Boolean);

        if (lines.length === 0) {
          setMsg({ error: true, text: 'Tafadhali ingiza IMEI namba angalau moja (tarakimu 15).' });
          setLoading(false);
          return;
        }

        const res = await fetch('/api/phones/units/bulk-import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: activeProductId,
            color,
            storage,
            ram,
            condition,
            buyingPrice,
            retailPrice,
            minSellingPrice,
            warrantyMonths,
            imeis: lines,
          }),
        });

        const json = await res.json();
        if (json.success) {
          onSuccess();
          onClose();
        } else {
          setMsg({ error: true, text: json.message || 'Imeshindikana kuhifadhi simu' });
        }
      } else {
        if (!imei1) {
          setMsg({ error: true, text: 'IMEI 1 inahitajika (IMEI 1 is required)' });
          setLoading(false);
          return;
        }

        const res = await fetch('/api/phones/units', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: activeProductId,
            imei1,
            imei2,
            serialNumber,
            color,
            storage,
            ram,
            condition,
            buyingPrice,
            retailPrice,
            minSellingPrice,
            warrantyMonths,
          }),
        });

        const json = await res.json();
        if (json.success) {
          onSuccess();
          onClose();
        } else {
          setMsg({ error: true, text: json.message || 'Imeshindikana kuhifadhi simu' });
        }
      }
    } catch (err) {
      setMsg({ error: true, text: err.message || 'Application failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              {isBulkMode ? 'Rapid Bulk IMEI Importer' : 'Register New Phone IMEI'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setIsBulkMode(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              !isBulkMode ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Single IMEI Registration
          </button>
          <button
            type="button"
            onClick={() => setIsBulkMode(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              isBulkMode ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Bulk IMEI Rapid Scanner Mode
          </button>
        </div>

        {msg && (
          <div
            className={`p-3 rounded-xl text-xs font-medium ${
              msg.error
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}
          >
            {msg.text}
          </div>
        )}

        {/* Quick Add Model Form (Inline) */}
        {showAddModelForm ? (
          <div className="p-4 bg-slate-950 rounded-xl border border-cyan-500/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-cyan-300">
                + Ongeza Smartphone Model Mpya (Add New Phone Model to Catalog)
              </span>
              <button
                type="button"
                onClick={() => setShowAddModelForm(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Jina la Model (Model Name):</label>
                <input
                  type="text"
                  placeholder="Mfano: iPhone 16 Pro Max, Galaxy S25 Ultra"
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Brand:</label>
                <select
                  value={newModelBrandId}
                  onChange={(e) => setNewModelBrandId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-bold"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              disabled={addingModel}
              onClick={handleCreateNewModel}
              className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black rounded-lg text-xs"
            >
              {addingModel ? 'Saving Model...' : 'Hifadhi Model Hii & Chagua'}
            </button>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Phone Model Select */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-slate-400 font-semibold">Select Smartphone Model:</label>
              <button
                type="button"
                onClick={() => setShowAddModelForm(true)}
                className="text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Ongeza Model Mpya (Add New Model)
              </button>
            </div>

            <select
              value={productId || (phoneProducts[0]?.id || '')}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-cyan-500"
            >
              {phoneProducts.length === 0 ? (
                <option value="">(Hakuna Model Iliyopo - Bonyeza "+ Ongeza Model Mpya" hapo juu)</option>
              ) : (
                phoneProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.brand?.name ? `(${p.brand.name})` : ''}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Device Specs Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Color:</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Storage:</label>
              <input
                type="text"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Condition:</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="NEW_SEALED">New Sealed</option>
                <option value="REFURBISHED">Refurbished</option>
                <option value="USED_LIKE_NEW">Used (Like New)</option>
                <option value="USED_GOOD">Used (Good)</option>
              </select>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Cost Price (TSH):</label>
              <input
                type="number"
                value={buyingPrice}
                onChange={(e) => setBuyingPrice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Retail Price (TSH):</label>
              <input
                type="number"
                value={retailPrice}
                onChange={(e) => setRetailPrice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Min Floor Price:</label>
              <input
                type="number"
                value={minSellingPrice}
                onChange={(e) => setMinSellingPrice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* IMEI Inputs */}
          {isBulkMode ? (
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Scan or Paste Multiple IMEIs (One per line):
              </label>
              <textarea
                rows={4}
                placeholder="358921104829101&#10;358921104829102&#10;358921104829103"
                value={bulkImeisText}
                onChange={(e) => setBulkImeisText(e.target.value)}
                className="w-full bg-slate-950 border border-cyan-500/50 rounded-xl p-3 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">IMEI 1 (Primary):</label>
                <input
                  type="text"
                  placeholder="358921104829101"
                  value={imei1}
                  onChange={(e) => setImei1(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">IMEI 2 (Optional):</label>
                <input
                  type="text"
                  placeholder="358921104829102"
                  value={imei2}
                  onChange={(e) => setImei2(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
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
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
            >
              {loading ? 'Saving...' : isBulkMode ? 'Execute Bulk Import' : 'Save Phone Unit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
