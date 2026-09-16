import React, { useState } from 'react';
import { X, Search, Smartphone, Package, User, FileText, ArrowRight } from 'lucide-react';

export default function GlobalSearchModal({ products = [], phoneUnits = [], onClose, onSelectTab }) {
  const [searchTerm, setSearchTerm] = useState('');

  const term = searchTerm.trim().toLowerCase();

  const matchingPhones = term
    ? phoneUnits.filter(
        (u) =>
          u.product?.name?.toLowerCase().includes(term) ||
          u.imei1?.toLowerCase().includes(term) ||
          u.color?.toLowerCase().includes(term)
      )
    : [];

  const matchingAccessories = term
    ? products.filter(
        (p) =>
          p.type !== 'PHONE' &&
          (p.name?.toLowerCase().includes(term) || p.category?.name?.toLowerCase().includes(term))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-sky-100 space-y-4 text-slate-800">
        {/* Header Search Input */}
        <div className="flex items-center justify-between border-b border-sky-100 pb-3">
          <div className="flex items-center gap-2 flex-1 mr-3">
            <Search className="w-5 h-5 text-sky-600 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search by IMEI 15-digit, Phone Model, Cover name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm font-extrabold text-slate-900 bg-transparent focus:outline-none placeholder-slate-400"
            />
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1 text-xs">
          {!searchTerm ? (
            <div className="py-8 text-center text-slate-400 font-medium">
              Andika IMEI namba au jina la simu/accessory kuanza kutafuta kwa haraka...
            </div>
          ) : matchingPhones.length === 0 && matchingAccessories.length === 0 ? (
            <div className="py-8 text-center text-slate-500 font-medium">
              Hakuna matokeo yaliyopatikana kwa: <strong className="text-slate-900 font-bold">"{searchTerm}"</strong>
            </div>
          ) : (
            <>
              {/* Phones Matching */}
              {matchingPhones.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-black uppercase text-sky-800 tracking-wider flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5" /> Simu Zilizopatikana ({matchingPhones.length})
                  </div>

                  {matchingPhones.map((phone) => (
                    <div
                      key={phone.id}
                      onClick={() => {
                        onSelectTab('phones');
                        onClose();
                      }}
                      className="p-3 bg-sky-50/70 hover:bg-sky-100 rounded-2xl border border-sky-100 flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div>
                        <div className="font-extrabold text-slate-900">{phone.product?.name}</div>
                        <div className="text-[11px] font-mono font-bold text-sky-800">IMEI: {phone.imei1}</div>
                        <div className="text-[10px] text-slate-500">{phone.color} • {phone.storage}</div>
                      </div>

                      <div className="text-right">
                        <div className="font-black text-slate-900">TSH {phone.retailPrice?.toLocaleString()}</div>
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {phone.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Accessories Matching */}
              {matchingAccessories.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-black uppercase text-purple-800 tracking-wider flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" /> Accessories Zilizopatikana ({matchingAccessories.length})
                  </div>

                  {matchingAccessories.map((acc) => (
                    <div
                      key={acc.id}
                      onClick={() => {
                        onSelectTab('accessories');
                        onClose();
                      }}
                      className="p-3 bg-purple-50/50 hover:bg-purple-100/60 rounded-2xl border border-purple-100 flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div>
                        <div className="font-extrabold text-slate-900">{acc.name}</div>
                        <div className="text-[10px] text-purple-700 font-semibold">{acc.category?.name}</div>
                      </div>

                      <div className="font-black text-slate-900">
                        TSH {(acc.basePrice || acc.costPrice || 0).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
