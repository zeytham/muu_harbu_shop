import React, { useState } from 'react';
import { X, Smartphone, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AddPhoneModal({ products, onClose, onSuccess }) {
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [productId, setProductId] = useState(products[0]?.id || '');
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

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      if (isBulkMode) {
        // Parse line by line or comma separated IMEIs
        const lines = bulkImeisText
          .split(/[\n,]/)
          .map((s) => s.trim())
          .filter(Boolean);

        if (lines.length === 0) {
          setMsg({ error: true, text: 'Please enter at least one 15-digit IMEI number.' });
          setLoading(false);
          return;
        }

        const res = await fetch('/api/phones/units/bulk-import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
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
          setMsg({ error: true, text: json.message });
        }
      } else {
        // Single import
        if (!imei1) {
          setMsg({ error: true, text: 'IMEI 1 is required' });
          setLoading(false);
          return;
        }

        const res = await fetch('/api/phones/units', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
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
          setMsg({ error: true, text: json.message });
        }
      }
    } catch (err) {
      setMsg({ error: true, text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const phoneProducts = products.filter((p) => p.type === 'PHONE');

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
          <div className={`p-3 rounded-xl text-xs font-medium ${msg.error ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400'}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Phone Model Select */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Select Smartphone Model:</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-cyan-500"
            >
              {phoneProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.brand?.name})
                </option>
              ))}
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
                rows={5}
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
