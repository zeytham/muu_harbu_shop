import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, Shield, Package, Sparkles } from 'lucide-react';

export default function CompatibilityFinder({ phoneModels }) {
  const [selectedModelId, setSelectedModelId] = useState('');
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (phoneModels && phoneModels.length > 0 && !selectedModelId) {
      setSelectedModelId(phoneModels[0].id);
    }
  }, [phoneModels]);

  useEffect(() => {
    if (selectedModelId) {
      fetchCompatibleItems(selectedModelId);
    }
  }, [selectedModelId]);

  const fetchCompatibleItems = async (modelId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/compatibility?phoneModelId=${modelId}`);
      const json = await res.json();
      if (json.success) {
        setAccessories(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectedModelObj = phoneModels.find((m) => m.id === selectedModelId);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-sky-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#80ddff]/30 text-sky-900 border border-sky-300 text-xs font-extrabold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Smart Phone Compatibility Matcher
            </div>
            <h2 className="text-xl font-black text-slate-900">Find Accessories Compatible With Any Phone</h2>
            <p className="text-xs text-slate-600 mt-1">
              Select a customer's phone model to instantly see all matching covers, protectors, skins & universal gadgets.
            </p>
          </div>

          {/* Model Select Dropdown */}
          <div className="w-full md:w-72">
            <label className="text-xs text-slate-600 font-bold mb-1.5 block">Select Customer Phone Model:</label>
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="w-full bg-sky-50 border-2 border-sky-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-extrabold focus:outline-none focus:border-sky-500 shadow-sm"
            >
              {phoneModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.brand?.name} {m.modelName} ({m.screenSize || 'Standard'})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600" />
          Matching Items for <span className="text-sky-700 font-extrabold">{selectedModelObj?.brand?.name} {selectedModelObj?.modelName}</span>
        </h3>
        <span className="text-xs text-slate-500">Total {accessories.length} items verified</span>
      </div>

      {/* Compatible Items Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs">Filtering compatible accessories...</div>
      ) : accessories.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-xs">No compatible items found for this model yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accessories.map((acc) => (
            <div key={acc.id} className="bg-white rounded-2xl p-5 border border-sky-200 flex items-start gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0 font-bold">
                <Package className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider">{acc.category?.name}</span>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Guaranteed Fit
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 truncate">{acc.name}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-1">{acc.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900">
                    TSH {acc.hasVariants ? acc.variants[0]?.price?.toLocaleString() : acc.basePrice?.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">In Stock</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
