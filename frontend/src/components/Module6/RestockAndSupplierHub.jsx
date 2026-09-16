import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  PackageCheck,
  AlertCircle,
  Truck,
  Building2,
  FileText,
  Plus,
  RefreshCw,
  CheckCircle,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  Layers,
  ArrowRight,
  PieChart,
} from 'lucide-react';
import CreatePOModal from './CreatePOModal';
import CreateSupplierModal from './CreateSupplierModal';

export default function RestockAndSupplierHub({ products = [], onRefresh }) {
  const [activeTab, setActiveTab] = useState('velocity'); // velocity, pos, abc

  // Data states
  const [velocityData, setVelocityData] = useState([]);
  const [abcData, setAbcData] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & Print
  const [isCreatePoOpen, setIsCreatePoOpen] = useState(false);
  const [isCreateSupplierOpen, setIsCreateSupplierOpen] = useState(false);
  const [printPo, setPrintPo] = useState(null);
  const [restockPoId, setRestockPoId] = useState(null);
  const [restockImeis, setRestockImeis] = useState({});

  const fetchModuleData = async () => {
    setLoading(true);
    try {
      const [resVel, resAbc, resSup, resPo] = await Promise.all([
        fetch('/api/forecasting/velocity?days=30').then((r) => r.json()),
        fetch('/api/forecasting/abc-matrix').then((r) => r.json()),
        fetch('/api/forecasting/suppliers').then((r) => r.json()),
        fetch('/api/forecasting/purchase-orders').then((r) => r.json()),
      ]);

      if (resVel.success) setVelocityData(resVel.data);
      if (resAbc.success) setAbcData(resAbc);
      if (resSup.success) setSuppliers(resSup.data);
      if (resPo.success) setPurchaseOrders(resPo.data);
    } catch (err) {
      console.error('Error loading forecasting data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModuleData();
  }, []);

  const handleReceiveRestock = async (poId) => {
    try {
      const res = await fetch(`/api/forecasting/purchase-orders/${poId}/receive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPhoneUnits: [], // Handled by backend for non-phones, or auto-created
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('🎉 Mzigo Umepokelewa na kuingizwa Kwenye Inventory Moja Kwa Moja!');
        fetchModuleData();
        if (onRefresh) onRefresh();
      } else {
        alert('Hitilafu: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Imefeli kupokea mzigo');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-sky-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#80ddff]/20 text-[#80ddff] text-xs font-black tracking-wider uppercase border border-[#80ddff]/30">
              <TrendingUp className="w-3.5 h-3.5" /> MODULE 6 • SMART AI FORECASTING & SUPPLIER HUB
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              AI Sales Velocity & Supplier Restock Engine
            </h1>
            <p className="text-xs sm:text-sm text-sky-200 font-medium max-w-2xl">
              Piga hesabu ya kasi ya mauzo ya kila siku (Daily Velocity), zuia stock kuisha, na tengeneza Risiti Rasmi za Agizo la Mzigo (PO) moja kwa moja kwa Official Suppliers.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCreatePoOpen(true)}
              className="px-5 py-3 rounded-2xl bg-[#0284c7] hover:bg-sky-500 text-white font-black text-xs transition-all shadow-lg shadow-sky-600/40 flex items-center gap-2 border border-sky-400/30"
            >
              <Plus className="w-4 h-4" /> Tengeneza PO Mpya
            </button>
            <button
              onClick={fetchModuleData}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-sky-200 hover:text-white transition-all border border-white/10"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-1 border-t border-sky-800/60 pt-4">
          <button
            onClick={() => setActiveTab('velocity')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'velocity'
                ? 'bg-white text-slate-950 shadow-md font-bold'
                : 'text-sky-200 hover:bg-white/10'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-sky-700" /> 🧠 AI Restock Predictor
          </button>
          <button
            onClick={() => setActiveTab('pos')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'pos'
                ? 'bg-white text-slate-950 shadow-md font-bold'
                : 'text-sky-200 hover:bg-white/10'
            }`}
          >
            <Truck className="w-4 h-4 text-purple-700" /> 📋 Supplier PO Manager ({purchaseOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('abc')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'abc'
                ? 'bg-white text-slate-950 shadow-md font-bold'
                : 'text-sky-200 hover:bg-white/10'
            }`}
          >
            <PieChart className="w-4 h-4 text-amber-600" /> 📊 ABC Matrix & Dead Stock
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: AI RESTOCK PREDICTOR & SALES VELOCITY */}
      {activeTab === 'velocity' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-sky-200 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-rose-100 text-rose-800 border border-rose-300 flex items-center justify-center font-black shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-rose-700">
                  {velocityData.filter((v) => v.status === 'CRITICAL_STOCKOUT_RISK').length}
                </div>
                <div className="text-xs text-slate-600 font-bold">Critical Stockout Risk (&le; 7 Days)</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-sky-200 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center font-black shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-amber-700">
                  {velocityData.filter((v) => v.status === 'REORDER_NEEDED').length}
                </div>
                <div className="text-xs text-slate-600 font-bold">Reorder Needed (&le; 14 Days)</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-sky-200 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-black shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-700">
                  {velocityData.filter((v) => v.status === 'HEALTHY').length}
                </div>
                <div className="text-xs text-slate-600 font-bold">Healthy Stock Coverage</div>
              </div>
            </div>
          </div>

          {/* Velocity List */}
          <div className="bg-white rounded-3xl border border-sky-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-sky-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Uchambuzi wa Kasi ya Mauzo ya Siku 30 (30-Day Velocity Analysis)
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Matokeo yanakokotoa Daily Velocity Rate (DVR) na kubaini siku ambazo mzigo utamalizika.
                </p>
              </div>
            </div>

            {/* Mobile Touch Cards View */}
            <div className="block md:hidden divide-y divide-sky-100">
              {velocityData.map((item) => (
                <div key={item.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-black text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-600 font-medium">{item.brand} • {item.category}</div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                        item.status === 'CRITICAL_STOCKOUT_RISK'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : item.status === 'REORDER_NEEDED'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      {item.status === 'CRITICAL_STOCKOUT_RISK' ? 'Critical Risk' : item.status === 'REORDER_NEEDED' ? 'Reorder Needed' : 'Healthy'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-sky-50/50 p-2.5 rounded-xl border border-sky-100">
                    <div>
                      <span className="text-slate-600 font-bold block">Stock Iliyopo:</span>
                      <span className="font-extrabold text-slate-900">{item.currentStock} Units</span>
                    </div>
                    <div>
                      <span className="text-slate-600 font-bold block">DVR (Units/Siku):</span>
                      <span className="font-extrabold text-sky-800">{item.dailyVelocityRate} / Siku</span>
                    </div>
                    <div>
                      <span className="text-slate-600 font-bold block">Siku Zilizobaki:</span>
                      <span className="font-extrabold text-indigo-700">{item.daysRemaining === 999 ? '∞ Siku' : `${item.daysRemaining} Siku`}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 font-bold block">Recommended Order:</span>
                      <span className="font-extrabold text-emerald-700">+{item.recommendedReorder} Pcs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-sky-50/70 text-slate-700 font-extrabold border-b border-sky-100">
                    <th className="p-3.5 pl-6">Bidhaa / Model Name</th>
                    <th className="p-3.5">Category & Brand</th>
                    <th className="p-3.5 text-center">Stock Iliyopo</th>
                    <th className="p-3.5 text-center">Velocity (DVR/Siku)</th>
                    <th className="p-3.5 text-center">Siku Zilizobaki (DIR)</th>
                    <th className="p-3.5 text-center">Hali (Status)</th>
                    <th className="p-3.5 text-right pr-6">Reorder Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100 font-medium">
                  {velocityData.map((item) => (
                    <tr key={item.id} className="hover:bg-sky-50/40 transition-colors">
                      <td className="p-3.5 pl-6 font-extrabold text-slate-900">{item.name}</td>
                      <td className="p-3.5 text-slate-600">{item.brand} • {item.category}</td>
                      <td className="p-3.5 text-center font-bold">{item.currentStock} Units</td>
                      <td className="p-3.5 text-center font-extrabold text-sky-800">{item.dailyVelocityRate} / Siku</td>
                      <td className="p-3.5 text-center font-extrabold text-indigo-700">
                        {item.daysRemaining === 999 ? '∞ Siku' : `${item.daysRemaining} Siku`}
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                            item.status === 'CRITICAL_STOCKOUT_RISK'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : item.status === 'REORDER_NEEDED'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          {item.status === 'CRITICAL_STOCKOUT_RISK' ? 'Critical Risk' : item.status === 'REORDER_NEEDED' ? 'Reorder Needed' : 'Healthy'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right pr-6 font-black text-emerald-700">+{item.recommendedReorder} Pcs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SUPPLIER PO MANAGER & DIRECTORY */}
      {activeTab === 'pos' && (
        <div className="space-y-6">
          {/* Supplier Directory Cards */}
          <div className="bg-white rounded-3xl border border-sky-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-sky-700" /> Ma-Supplier Rasmi (Official Supplier Directory)
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Orodha ya Ma-Distributor rasmi wa Apple, Samsung, Anker na Baseus.
                </p>
              </div>
              <button
                onClick={() => setIsCreateSupplierOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 font-extrabold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-purple-700" /> Sajili Supplier Mpya
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {suppliers.map((s) => (
                <div key={s.id} className="bg-sky-50/50 rounded-2xl p-4 border border-sky-200 space-y-2">
                  <div className="text-xs font-black text-slate-900 truncate">{s.name}</div>
                  <div className="text-[11px] text-sky-800 font-bold">{s.contactPerson} • {s.phone}</div>
                  <div className="text-[10px] text-slate-600">{s.email}</div>
                  <div className="pt-2 flex items-center justify-between text-[10px] border-t border-sky-200">
                    <span className="font-bold text-slate-700">Lead Time: {s.leadTimeDays} Siku</span>
                    <span className="font-black text-purple-800 px-1.5 py-0.5 bg-purple-100 rounded">{s.paymentTerms}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase Orders Tracker */}
          <div className="bg-white rounded-3xl border border-sky-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-sky-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-700" /> Orodha ya Purchase Orders (PO Tracker)
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Fuatilia maagizo ya mzigo na uingize stock dukani ukishawasili.
                </p>
              </div>
            </div>

            <div className="divide-y divide-sky-100">
              {purchaseOrders.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-medium text-xs">
                  Bado hujatengeneza Purchase Order yoyote. Bonyeza "Tengeneza PO Mpya" hapo juu.
                </div>
              ) : (
                purchaseOrders.map((po) => (
                  <div key={po.id} className="p-5 space-y-3 hover:bg-sky-50/30 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-sky-900">{po.poNumber}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                              po.status === 'DELIVERED_AND_RESTOCKED'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}
                          >
                            {po.status === 'DELIVERED_AND_RESTOCKED' ? 'Delivered & Restocked' : 'In Transit / Sent'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 font-bold mt-1">
                          Supplier: <span className="text-slate-900">{po.supplier?.name}</span> • Tar: {new Date(po.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-slate-500 font-bold">Jumla Kuu (FOB)</div>
                          <div className="text-sm font-black text-slate-900">TSH {po.totalAmount.toLocaleString()}</div>
                        </div>

                        {po.status !== 'DELIVERED_AND_RESTOCKED' && (
                          <button
                            onClick={() => handleReceiveRestock(po.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-1.5"
                          >
                            <PackageCheck className="w-4 h-4" /> Receive & Restock
                          </button>
                        )}
                      </div>
                    </div>

                    {/* PO Items List */}
                    <div className="bg-sky-50/50 p-3 rounded-2xl border border-sky-100 flex flex-wrap gap-2 text-xs">
                      {po.items?.map((item) => (
                        <span key={item.id} className="bg-white px-3 py-1.5 rounded-xl border border-sky-200 font-bold text-slate-800">
                          {item.product?.name}: <span className="text-sky-900 font-black">{item.quantityOrdered} Pcs</span> @ TSH {item.unitCost.toLocaleString()}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: FAST-MOVING VS DEAD-STOCK ABC MATRIX */}
      {activeTab === 'abc' && abcData && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-sky-200 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-black shrink-0">
                A
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{abcData.summary.classACount}</div>
                <div className="text-xs text-slate-600 font-bold">Class A (Top Revenue Movers)</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-sky-200 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-sky-100 text-sky-800 border border-sky-300 flex items-center justify-center font-black shrink-0">
                B
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{abcData.summary.classBCount}</div>
                <div className="text-xs text-slate-600 font-bold">Class B (Steady Movers)</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-sky-200 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center font-black shrink-0">
                C
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{abcData.summary.classCCount}</div>
                <div className="text-xs text-slate-600 font-bold">Class C (Slow Movers)</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-sky-200 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-rose-100 text-rose-800 border border-rose-300 flex items-center justify-center font-black shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-lg font-black text-rose-700">
                  TSH {abcData.summary.deadStockCapitalTiedUp.toLocaleString()}
                </div>
                <div className="text-xs text-slate-600 font-bold">Dead Stock Capital (&gt;45 Days)</div>
              </div>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="bg-white rounded-3xl border border-sky-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-sky-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Mchanganuo wa ABC Inventory Matrix & Dead Stock
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Inapanga bidhaa kwa uwiano wa mapato na kubaini mtaji uliokwama.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-sky-50/70 text-slate-700 font-extrabold border-b border-sky-100">
                    <th className="p-3.5 pl-6">Class</th>
                    <th className="p-3.5">Bidhaa / Model</th>
                    <th className="p-3.5 text-right">Revenue (TSH)</th>
                    <th className="p-3.5 text-center">Stock Iliyopo</th>
                    <th className="p-3.5 text-right">Capital Tied Up</th>
                    <th className="p-3.5 text-center pr-6">Hali ya Dead Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100 font-medium">
                  {abcData.data.map((item) => (
                    <tr key={item.id} className="hover:bg-sky-50/40 transition-colors">
                      <td className="p-3.5 pl-6">
                        <span
                          className={`h-7 w-7 rounded-xl flex items-center justify-center font-black text-xs ${
                            item.abcClass === 'A'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : item.abcClass === 'B'
                              ? 'bg-sky-100 text-sky-800 border border-sky-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {item.abcClass}
                        </span>
                      </td>
                      <td className="p-3.5 font-extrabold text-slate-900">{item.name}</td>
                      <td className="p-3.5 text-right font-black text-sky-900">TSH {item.revenue.toLocaleString()}</td>
                      <td className="p-3.5 text-center font-bold">{item.currentStock} Units</td>
                      <td className="p-3.5 text-right font-extrabold text-slate-800">TSH {item.tiedUpCapital.toLocaleString()}</td>
                      <td className="p-3.5 text-center pr-6">
                        {item.isDeadStock ? (
                          <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full font-black text-[10px] border border-rose-300">
                            Dead Stock (&gt;45 Days)
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-bold text-[11px]">Active</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create PO */}
      {isCreatePoOpen && (
        <CreatePOModal
          suppliers={suppliers}
          products={products}
          onClose={() => setIsCreatePoOpen(false)}
          onSuccess={fetchModuleData}
        />
      )}

      {/* Modal: Create Supplier */}
      {isCreateSupplierOpen && (
        <CreateSupplierModal
          onClose={() => setIsCreateSupplierOpen(false)}
          onSuccess={fetchModuleData}
        />
      )}
    </div>
  );
}
