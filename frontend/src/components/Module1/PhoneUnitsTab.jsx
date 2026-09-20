import React, { useState } from 'react';
import { Smartphone, Search, Filter, ShieldCheck, Tag, Upload, AlertCircle, Barcode, CheckCircle2, Layers, Trash2 } from 'lucide-react';

export default function PhoneUnitsTab({ 
  phoneUnits = [], 
  loading, 
  onOpenBulkImport, 
  onOpenCatBrandManager, 
  onPrintBarcode, 
  onRefresh 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [conditionFilter, setConditionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('IN_STOCK');
  const [updatingId, setUpdatingId] = useState(null);

  const filteredUnits = phoneUnits.filter((unit) => {
    const matchesSearch =
      unit.imei1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.color?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCondition = conditionFilter === 'ALL' || unit.condition === conditionFilter;
    const matchesStatus = statusFilter === 'ALL' || unit.status === statusFilter;

    return matchesSearch && matchesCondition && matchesStatus;
  });

  const handleStatusChange = async (unitId, newStatus) => {
    setUpdatingId(unitId);
    try {
      const res = await fetch(`/api/phones/units/${unitId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        if (onRefresh) await onRefresh();
      } else {
        alert(data.message || 'Imeshindikana kubadilisha status');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUnit = async (unitId, imei) => {
    if (!confirm(`Je, una uhakika unataka kufuta simu yenye IMEI: ${imei}?`)) return;
    setUpdatingId(unitId);
    try {
      const res = await fetch(`/api/phones/units/${unitId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        if (onRefresh) await onRefresh();
      } else {
        alert(data.message || 'Imeshindikana kufuta unit');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const getConditionBadge = (cond) => {
    switch (cond) {
      case 'NEW_SEALED':
        return <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-extrabold bg-[#80ddff]/30 text-sky-900 border border-sky-300 rounded-full">New Sealed</span>;
      case 'REFURBISHED':
        return <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-extrabold bg-purple-100 text-purple-800 border border-purple-300 rounded-full">Refurbished</span>;
      case 'USED_LIKE_NEW':
        return <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full">Used (Like New)</span>;
      default:
        return <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 rounded-full">{cond}</span>;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* Top Banner Card */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-sky-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#80ddff]/30 text-sky-900 border border-sky-300 text-xs font-extrabold">
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
            Serialized Inventory Control
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900">Smartphones & Tablets (IMEI Tracked)</h2>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Each physical device is tracked by individual 15-digit IMEI, battery health, condition, warranty & cashier floor price limits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenCatBrandManager}
            className="px-3.5 py-3 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-300 text-xs font-bold transition flex items-center gap-1.5"
            title="Manage Brands, Categories & Phone Models"
          >
            <Layers className="w-4 h-4 text-sky-700" />
            <span>Brands & Categories</span>
          </button>

          <button
            onClick={onOpenBulkImport}
            className="sky-btn-main px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span>⚡ Rapid Bulk IMEI Importer</span>
          </button>
        </div>
      </div>

      {/* Responsive Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search IMEI, Serial #, Model or Color..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-sky-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-sm"
          />
        </div>

        {/* Condition Filter */}
        <select
          value={conditionFilter}
          onChange={(e) => setConditionFilter(e.target.value)}
          className="bg-white border border-sky-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-sky-500 shadow-sm font-semibold"
        >
          <option value="ALL">Filter: All Conditions</option>
          <option value="NEW_SEALED">New Sealed Box</option>
          <option value="REFURBISHED">Refurbished Grade A</option>
          <option value="USED_LIKE_NEW">Used - Like New</option>
          <option value="USED_GOOD">Used - Good</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-sky-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-sky-500 shadow-sm font-semibold sm:col-span-2 lg:col-span-1"
        >
          <option value="ALL">Filter: All Stock Statuses</option>
          <option value="IN_STOCK">In Stock (Available)</option>
          <option value="RESERVED">Reserved</option>
          <option value="SOLD">Sold</option>
          <option value="IN_REPAIR">In Repair</option>
        </select>
      </div>

      {/* Data Container */}
      <div className="bg-white rounded-2xl border border-sky-200 overflow-hidden shadow-sm p-4 sm:p-0">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">Loading serialized phone inventory...</div>
        ) : filteredUnits.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No devices found matching criteria.</div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="block md:hidden space-y-3">
              {filteredUnits.map((unit) => (
                <div key={unit.id} className="bg-sky-50/70 p-4 rounded-xl border border-sky-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{unit.product?.name}</h4>
                      <p className="text-[11px] text-sky-700 font-bold">{unit.product?.brand?.name || 'Smartphone'}</p>
                    </div>
                    {getConditionBadge(unit.condition)}
                  </div>

                  <div className="pt-2 border-t border-sky-200/80 text-xs space-y-1">
                    <div className="font-mono text-sky-800 font-extrabold flex items-center gap-1">
                      <Barcode className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      {unit.imei1}
                    </div>
                    <div className="text-slate-800 font-semibold">{unit.color} • {unit.storage}</div>
                  </div>

                  <div className="pt-2 border-t border-sky-200/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-slate-900 font-black text-sm">TSH {unit.retailPrice?.toLocaleString()}</div>
                      <select
                        value={unit.status}
                        disabled={updatingId === unit.id}
                        onChange={(e) => handleStatusChange(unit.id, e.target.value)}
                        className="mt-1 text-[10px] font-bold bg-white border border-sky-300 rounded px-1.5 py-0.5"
                      >
                        <option value="IN_STOCK">IN_STOCK</option>
                        <option value="SOLD">SOLD</option>
                        <option value="RESERVED">RESERVED</option>
                        <option value="DEFECTIVE">DEFECTIVE</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onPrintBarcode(unit.imei1)}
                        className="px-2.5 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-slate-800 border border-sky-300 text-[11px] font-bold transition-all flex items-center gap-1"
                      >
                        <Barcode className="w-3.5 h-3.5 text-sky-600" /> Print
                      </button>
                      <button
                        onClick={() => handleDeleteUnit(unit.id, unit.imei1)}
                        className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-sky-50 text-slate-700 font-extrabold border-b border-sky-200">
                  <tr>
                    <th className="p-4">Phone Model</th>
                    <th className="p-4">Primary IMEI 1 & Serial</th>
                    <th className="p-4">Color & Specs</th>
                    <th className="p-4">Condition</th>
                    <th className="p-4">Cost / Retail Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100">
                  {filteredUnits.map((unit) => (
                    <tr key={unit.id} className="hover:bg-sky-50/60 transition-all">
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900 text-sm">{unit.product?.name}</div>
                        <div className="text-[11px] text-sky-700 font-bold">{unit.product?.brand?.name || 'Smartphone'}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-mono text-sky-800 font-extrabold flex items-center gap-1.5">
                          <Barcode className="w-4 h-4 text-sky-600" />
                          {unit.imei1}
                        </div>
                        {unit.serialNumber && (
                          <div className="text-[10px] font-mono text-slate-500 mt-0.5">SN: {unit.serialNumber}</div>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="text-slate-800 font-semibold">{unit.color} • {unit.storage}</div>
                        {unit.batteryHealth && (
                          <div className="text-[10px] text-emerald-700 font-bold">Battery: {unit.batteryHealth}% Health</div>
                        )}
                      </td>

                      <td className="p-4">{getConditionBadge(unit.condition)}</td>

                      <td className="p-4">
                        <div className="text-slate-900 font-extrabold text-sm">TSH {unit.retailPrice?.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-500">Buy: TSH {unit.buyingPrice?.toLocaleString()}</div>
                      </td>

                      <td className="p-4">
                        <select
                          value={unit.status}
                          disabled={updatingId === unit.id}
                          onChange={(e) => handleStatusChange(unit.id, e.target.value)}
                          className="px-2 py-1 text-[11px] font-extrabold bg-sky-50 text-sky-900 border border-sky-300 rounded-lg cursor-pointer hover:bg-sky-100"
                        >
                          <option value="IN_STOCK">IN_STOCK</option>
                          <option value="SOLD">SOLD</option>
                          <option value="RESERVED">RESERVED</option>
                          <option value="DEFECTIVE">DEFECTIVE</option>
                        </select>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onPrintBarcode(unit.imei1)}
                            className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-slate-800 border border-sky-200 text-[11px] font-bold transition-all flex items-center gap-1.5"
                          >
                            <Barcode className="w-3.5 h-3.5 text-sky-600" />
                            <span>Sticker</span>
                          </button>
                          <button
                            onClick={() => handleDeleteUnit(unit.id, unit.imei1)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
                            title="Delete IMEI"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
