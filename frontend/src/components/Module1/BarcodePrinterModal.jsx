import React, { useState, useEffect } from 'react';
import { X, Printer, Barcode, Check } from 'lucide-react';

export default function BarcodePrinterModal({ code, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (code) {
      fetchBarcodeData(code);
    }
  }, [code]);

  const fetchBarcodeData = async (barcodeVal) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/barcodes/${barcodeVal}`);
      const json = await res.json();
      if (json.success) {
        setData(json.labelData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Barcode className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Thermal Barcode Sticker Generator</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sticker Preview Container */}
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Generating thermal sticker layout...</div>
        ) : data ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-400 text-center">
              Print Preview (Fits 50mm x 30mm or 40mm x 25mm Thermal Sticker Rolls):
            </p>

            {/* Thermal Label Graphic Box */}
            <div id="printable-sticker" className="mx-auto w-64 bg-white text-black p-4 rounded-xl shadow-lg border-2 border-slate-300 font-mono text-center space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-tighter truncate">{data.subtitle}</div>
              <div className="text-sm font-extrabold line-clamp-1">{data.title}</div>
              
              {/* Simulated Code128 Barcode Visual */}
              <div className="bg-black text-white px-3 py-2 rounded flex flex-col items-center justify-center my-2">
                <div className="text-[10px] tracking-widest font-mono select-none">
                  ||| | |||| | ||||| ||| |||| | ||
                </div>
                <div className="text-[11px] font-bold tracking-wider mt-1">{data.barcode}</div>
              </div>

              {data.price && (
                <div className="text-xs font-black text-black">
                  PRICE: {data.price}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-rose-400 text-xs">Could not generate sticker data.</div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            disabled={!data}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Label</span>
          </button>
        </div>
      </div>
    </div>
  );
}
