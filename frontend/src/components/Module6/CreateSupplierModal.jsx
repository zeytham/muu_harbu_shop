import React, { useState } from 'react';
import { X, Building2, Phone, Mail, MapPin, Clock, CreditCard } from 'lucide-react';

export default function CreateSupplierModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    brandSupplied: 'Apple',
    leadTimeDays: '3',
    paymentTerms: 'NET_30',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Tafadhali jaza Jina la Supplier na Namba ya Simu');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/forecasting/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        alert('Hitilafu: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Imefeli kusajili supplier mpya');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sky-100 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center font-bold text-purple-900">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Sajili Supplier Mpya (New Distributor)</h2>
              <p className="text-xs text-slate-500 font-medium">Ongeza Maelezo ya Supplier Rasmi Wa Mzigo</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
          <div>
            <label className="block uppercase tracking-wider mb-1 font-bold text-slate-800">
              Jina la Kampuni / Supplier *
            </label>
            <input
              type="text"
              required
              placeholder="Mfano: Anker Official East Africa Distributor"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block uppercase tracking-wider mb-1 font-bold text-slate-800">Mtu wa Mawasiliano</label>
              <input
                type="text"
                placeholder="Mfano: David Minja"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider mb-1 font-bold text-slate-800">Namba ya Simu *</label>
              <input
                type="text"
                required
                placeholder="+255 712 345 678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block uppercase tracking-wider mb-1 font-bold text-slate-800">Barua Pepe (Email)</label>
              <input
                type="email"
                placeholder="orders@supplier.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider mb-1 font-bold text-slate-800">Brand Wanayosupply</label>
              <input
                type="text"
                placeholder="Mfano: Apple, Samsung, Anker"
                value={formData.brandSupplied}
                onChange={(e) => setFormData({ ...formData, brandSupplied: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block uppercase tracking-wider mb-1 font-bold text-slate-800">Lead Time (Siku)</label>
              <input
                type="number"
                min="1"
                value={formData.leadTimeDays}
                onChange={(e) => setFormData({ ...formData, leadTimeDays: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-center font-bold"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider mb-1 font-bold text-slate-800">Masharti ya Malipo</label>
              <select
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-bold"
              >
                <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                <option value="NET_30">Net 30 Days</option>
                <option value="PREPAID">Prepaid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider mb-1 font-bold text-slate-800">Anwani ya Duka/Ofisi</label>
            <input
              type="text"
              placeholder="Kariakoo Commercial Zone, Dar es Salaam"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
            >
              Ghairi
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black shadow-md shadow-purple-600/30"
            >
              {submitting ? 'Inasajili...' : 'Hifadhi Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
