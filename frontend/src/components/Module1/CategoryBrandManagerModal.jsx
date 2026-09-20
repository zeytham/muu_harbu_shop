import React, { useState } from 'react';
import { X, Plus, Tag, Smartphone, CheckCircle2, AlertCircle, Trash2, Layers, Award } from 'lucide-react';

export default function CategoryBrandManagerModal({ 
  categories = [], 
  brands = [], 
  phoneModels = [], 
  onClose, 
  onSuccess 
}) {
  const [activeTab, setActiveTab] = useState('BRANDS'); // 'BRANDS' | 'CATEGORIES' | 'MODELS'
  
  // New Brand Form State
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandLogo, setNewBrandLogo] = useState('');
  
  // New Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // New Phone Model Form State
  const [newModelBrandId, setNewModelBrandId] = useState(brands[0]?.id || '');
  const [newModelName, setNewModelName] = useState('');
  const [newModelYear, setNewModelYear] = useState('2025');

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // Handle Create Brand
  // Handle Create Brand
  const handleAddBrand = async (e) => {
    e.preventDefault();
    if (!newBrandName) {
      setMsg({ error: true, text: 'Tafadhali ingiza Jina la Brand' });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/categories/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBrandName, logo: newBrandLogo }),
      });
      const text = await res.text();
      let data = {};
      try { data = JSON.parse(text); } catch { data = { success: false, message: 'Server connection error' }; }
      if (res.ok && data.success) {
        setMsg({ error: false, text: `🎉 Brand "${newBrandName}" imeongezwa kikamilifu!` });
        setNewBrandName('');
        setNewBrandLogo('');
        await onSuccess();
      } else {
        setMsg({ error: true, text: data.message || 'Imeshindikana kuongeza Brand' });
      }
    } catch (err) {
      setMsg({ error: true, text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Handle Create Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName) {
      setMsg({ error: true, text: 'Tafadhali ingiza Jina la Category' });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName, description: newCatDesc }),
      });
      const text = await res.text();
      let data = {};
      try { data = JSON.parse(text); } catch { data = { success: false, message: 'Server connection error' }; }
      if (res.ok && data.success) {
        setMsg({ error: false, text: `🎉 Category "${newCatName}" imeongezwa kikamilifu!` });
        setNewCatName('');
        setNewCatDesc('');
        await onSuccess();
      } else {
        setMsg({ error: true, text: data.message || 'Imeshindikana kuongeza Category' });
      }
    } catch (err) {
      setMsg({ error: true, text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Handle Create Phone Model
  const handleAddModel = async (e) => {
    e.preventDefault();
    const targetBrandId = newModelBrandId || brands[0]?.id;
    if (!newModelName || !targetBrandId) {
      setMsg({ error: true, text: 'Tafadhali ingiza Jina la Model na uchague Brand' });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/categories/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: targetBrandId,
          modelName: newModelName,
          releaseYear: newModelYear,
        }),
      });
      const text = await res.text();
      let data = {};
      try { data = JSON.parse(text); } catch { data = { success: false, message: 'Server connection error' }; }
      if (res.ok && data.success) {
        setMsg({ error: false, text: `🎉 Phone Model "${newModelName}" imeongezwa kikamilifu kwenye catalog!` });
        setNewModelName('');
        await onSuccess();
      } else {
        setMsg({ error: true, text: data.message || 'Imeshindikana kuongeza Phone Model' });
      }
    } catch (err) {
      setMsg({ error: true, text: err.message });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white max-w-2xl w-full rounded-3xl p-6 border border-sky-200 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-sky-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Brands, Categories & Phone Models Manager</h3>
              <p className="text-xs text-slate-500 font-medium">Manage all manufacturer brands, accessory categories & phone models</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 my-4 bg-sky-50 p-1.5 rounded-2xl border border-sky-200">
          <button
            onClick={() => setActiveTab('BRANDS')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
              activeTab === 'BRANDS'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/60'
            }`}
          >
            <Award className="w-4 h-4" /> Brands ({brands.length})
          </button>

          <button
            onClick={() => setActiveTab('CATEGORIES')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
              activeTab === 'CATEGORIES'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/60'
            }`}
          >
            <Tag className="w-4 h-4" /> Categories ({categories.length})
          </button>

          <button
            onClick={() => setActiveTab('MODELS')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
              activeTab === 'MODELS'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/60'
            }`}
          >
            <Smartphone className="w-4 h-4" /> Phone Models ({phoneModels.length})
          </button>
        </div>

        {/* Notification Alert */}
        {msg && (
          <div className={`p-3 rounded-xl mb-4 text-xs font-bold flex items-center gap-2 ${
            msg.error ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}>
            {msg.error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          
          {/* TAB 1: BRANDS */}
          {activeTab === 'BRANDS' && (
            <div className="space-y-4">
              <form onSubmit={handleAddBrand} className="bg-sky-50/60 p-4 rounded-2xl border border-sky-200 space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-sky-600" /> Ongeza Brand Mpya (Add New Brand)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Jina la Brand *</label>
                    <input
                      type="text"
                      placeholder="mfano: Apple, Samsung, Tecno, Xiaomi"
                      value={newBrandName}
                      onChange={(e) => setNewBrandName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Logo URL (Optional)</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={newBrandLogo}
                      onChange={(e) => setNewBrandLogo(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-md transition disabled:opacity-50"
                >
                  {loading ? 'Inahifadhi Brand...' : '+ Hifadhi Brand Mpya'}
                </button>
              </form>

              {/* Brands Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {brands.map((b) => (
                  <div key={b.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 font-extrabold flex items-center justify-center text-xs shrink-0">
                        {b.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-slate-900 truncate">{b.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORIES */}
          {activeTab === 'CATEGORIES' && (
            <div className="space-y-4">
              <form onSubmit={handleAddCategory} className="bg-sky-50/60 p-4 rounded-2xl border border-sky-200 space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-sky-600" /> Ongeza Category Mpya (Add New Category)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Jina la Category *</label>
                    <input
                      type="text"
                      placeholder="mfano: Covers & Skins, Chargers, AirPods"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Maelezo Mafupi (Description)</label>
                    <input
                      type="text"
                      placeholder="Maelezo..."
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-md transition disabled:opacity-50"
                >
                  {loading ? 'Inahifadhi Category...' : '+ Hifadhi Category Mpya'}
                </button>
              </form>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((c) => (
                  <div key={c.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-900">{c.name}</h5>
                      <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{c.description || 'General category'}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                      {c._count?.products || 0} items
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PHONE MODELS */}
          {activeTab === 'MODELS' && (
            <div className="space-y-4">
              <form onSubmit={handleAddModel} className="bg-sky-50/60 p-4 rounded-2xl border border-sky-200 space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-sky-600" /> Ongeza Phone Model Mpya (Add Phone Model)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Chagua Brand *</label>
                    <select
                      value={newModelBrandId}
                      onChange={(e) => setNewModelBrandId(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                    >
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Jina la Model *</label>
                    <input
                      type="text"
                      placeholder="mfano: iPhone 16 Pro Max"
                      value={newModelName}
                      onChange={(e) => setNewModelName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Mwaka (Release Year)</label>
                    <input
                      type="number"
                      placeholder="2025"
                      value={newModelYear}
                      onChange={(e) => setNewModelYear(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-md transition disabled:opacity-50"
                >
                  {loading ? 'Inahifadhi Model...' : '+ Hifadhi Phone Model Mpya'}
                </button>
              </form>

              {/* Models List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {phoneModels.map((m) => (
                  <div key={m.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-900">{m.modelName}</h5>
                      <span className="text-[10px] font-semibold text-sky-700">Brand: {m.brand?.name || 'Generic'}</span>
                    </div>
                    {m.releaseYear && (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {m.releaseYear}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="pt-4 mt-2 border-t border-sky-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-xs transition"
          >
            Funga (Close)
          </button>
        </div>

      </div>
    </div>
  );
}
