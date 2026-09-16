import React, { useState } from 'react';
import { X, Plus, Trash2, ShoppingBag, Truck, Calendar } from 'lucide-react';

export default function CreatePOModal({ suppliers, products, onClose, onSuccess }) {
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [poItems, setPoItems] = useState([
    {
      productId: products[0]?.id || '',
      quantityOrdered: 5,
      unitCost: products[0]?.costPrice || products[0]?.basePrice || 0,
    },
  ]);

  const handleAddItem = () => {
    const defaultProd = products[0];
    setPoItems([
      ...poItems,
      {
        productId: defaultProd?.id || '',
        quantityOrdered: 5,
        unitCost: defaultProd?.costPrice || defaultProd?.basePrice || 0,
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    if (poItems.length === 1) return;
    setPoItems(poItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...poItems];
    if (field === 'productId') {
      const selectedProd = products.find((p) => p.id === value);
      updated[index].productId = value;
      updated[index].unitCost = selectedProd?.costPrice || selectedProd?.basePrice || 0;
    } else {
      updated[index][field] = value;
    }
    setPoItems(updated);
  };

  const calculateTotal = () => {
    return poItems.reduce((acc, item) => acc + (parseFloat(item.unitCost) || 0) * (parseInt(item.quantityOrdered, 10) || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supplierId) {
      alert('Tafadhali chagua Supplier');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/forecasting/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId,
          expectedDelivery,
          notes,
          items: poItems,
        }),
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
      alert('Imefeli kutengeneza Purchase Order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-sky-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">Tengeneza Purchase Order Rasmi (PO)</h2>
              <p className="text-xs text-sky-200 font-medium">Agiza Mzigo Mpya Kutoka Kwa Official Supplier</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-sky-200 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Scroll Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-800">
          {/* Supplier & Delivery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Chagua Official Supplier *
              </label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-semibold bg-white"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.brandSupplied || 'All Brands'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tarehe Inayotarijiwa Kuwasili
              </label>
              <input
                type="date"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 font-semibold bg-white"
              />
            </div>
          </div>

          {/* PO Itemized Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Orodha ya Bidhaa Zinazoagizwa (Items List)
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200"
              >
                <Plus className="w-3.5 h-3.5" /> Ongeza Bidhaa Mpya
              </button>
            </div>

            <div className="space-y-2.5">
              {poItems.map((item, idx) => (
                <div key={idx} className="p-3 bg-sky-50/50 rounded-2xl border border-sky-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1">
                    <select
                      value={item.productId}
                      onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-28">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantityOrdered}
                      onChange={(e) => handleItemChange(idx, 'quantityOrdered', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white text-center"
                    />
                  </div>

                  <div className="w-36">
                    <input
                      type="number"
                      placeholder="Unit Cost (TSH)"
                      value={item.unitCost}
                      onChange={(e) => handleItemChange(idx, 'unitCost', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white text-right"
                    />
                  </div>

                  {poItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-rose-200 self-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Maelekezo au Kumbukumbu ya Agizo (Notes/Terms)
            </label>
            <textarea
              rows="2"
              placeholder="Mfano: Mzigo usafirishwe kwa Cargo ya Ndege, Malipo yatafanyika Net 30..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-sky-500 bg-white"
            />
          </div>

          {/* Total Calculation */}
          <div className="p-4 bg-sky-900 text-white rounded-2xl flex items-center justify-between shadow-md">
            <div>
              <div className="text-xs font-bold text-sky-200 uppercase tracking-wider">Jumla Kuu ya Agizo (Total FOB)</div>
              <div className="text-xl font-black">TSH {calculateTotal().toLocaleString()}</div>
            </div>
            <div className="text-xs font-bold text-sky-300 bg-white/10 px-3 py-1 rounded-full">
              {poItems.length} Item(s)
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all border border-slate-300"
            >
              Ghairi (Cancel)
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-[#0284c7] hover:bg-sky-700 transition-all shadow-md shadow-sky-600/30 flex items-center gap-2"
            >
              {submitting ? 'Inatuma...' : 'Tuma Purchase Order (Send PO)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
