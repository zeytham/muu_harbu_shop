import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  Send,
  Plus,
  Search,
  Trash2,
  RefreshCw,
  Award,
  CheckCircle,
  ShoppingBag,
  Gift,
  ShieldCheck,
} from 'lucide-react';

export default function CustomerCrmHub() {
  const [activeSubTab, setActiveSubTab] = useState('directory'); // directory | dispatch | logs | loyalty

  // Data States
  const [customers, setCustomers] = useState([]);
  const [smsLogs, setSmsLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Single / Bulk SMS State
  const [smsRecipient, setSmsRecipient] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [smsType, setSmsType] = useState('CUSTOM');
  const [isBulkSend, setIsBulkSend] = useState(false);
  const [sendingSms, setSendingSms] = useState(false);

  // Modals & Customer Detail View
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showSalesHistoryModal, setShowSalesHistoryModal] = useState(null);
  const [customerSales, setCustomerSales] = useState([]);
  const [loadingSales, setLoadingSales] = useState(false);

  // New Customer Form States
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustTin, setNewCustTin] = useState('');
  const [savingCustomer, setSavingCustomer] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [resCust, resSms] = await Promise.all([
        fetch('/api/customers').then((r) => r.json()),
        fetch('/api/sms').then((r) => r.json()),
      ]);

      if (resCust.success) setCustomers(resCust.data || []);
      if (resSms.success) setSmsLogs(resSms.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCreateCustomerSubmit = async (e) => {
    e.preventDefault();
    setSavingCustomer(true);
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCustName,
          phone: newCustPhone,
          email: newCustEmail,
          tinNumber: newCustTin,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddCustomerModal(false);
        setNewCustName('');
        setNewCustPhone('');
        setNewCustEmail('');
        setNewCustTin('');
        fetchAllData();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingCustomer(false);
    }
  };

  const handleDeleteCustomer = async (id, name) => {
    if (!window.confirm(`Futa mteja ${name}?`)) return;
    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendSmsSubmit = async (e) => {
    e.preventDefault();
    if (!smsMessage) {
      alert('Jaza ujumbe wa SMS!');
      return;
    }

    setSendingSms(true);
    try {
      if (isBulkSend) {
        for (const cust of customers) {
          if (cust.phone) {
            await fetch('/api/sms/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                recipient: cust.phone,
                message: smsMessage,
                type: smsType,
              }),
            });
          }
        }
      } else {
        const targetNumber = smsRecipient || '+255 624 945 919';
        await fetch('/api/sms/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient: targetNumber,
            message: smsMessage,
            type: smsType,
          }),
        });
      }

      setSmsMessage('');
      fetchAllData();
    } catch (err) {
      console.error(err);
    } finally {
      setSendingSms(false);
    }
  };

  const handleOpenSmsForCustomer = (cust) => {
    setSmsRecipient(cust.phone);
    setIsBulkSend(false);
    setActiveSubTab('dispatch');
  };

  const handleViewCustomerSales = async (cust) => {
    setShowSalesHistoryModal(cust);
    setLoadingSales(true);
    try {
      const res = await fetch(`/api/customers/${cust.id}/sales`);
      const data = await res.json();
      if (data.success) {
        setCustomerSales(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSales(false);
    }
  };

  const applySmsTemplate = (templateType) => {
    setSmsType(templateType);
    if (templateType === 'POS_RECEIPT') {
      setSmsMessage('Karibu PhoneVault Pro! Risiti yako ya POS ya mauzo tayari imesajiliwa.');
    } else if (templateType === 'WARRANTY_RMA') {
      setSmsMessage('Habari! Mzigo wako wa badala wa RMA kutoka kwa Supplier tayari umewasili dukani Kariakoo.');
    } else if (templateType === 'PROMO') {
      setSmsMessage('Habari VIP Customer! Tumepokea toleo jipya la Anker Fast Chargers na covers. Karibu PhoneVault Pro!');
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const platinumCount = customers.filter((c) => c.vipTier === 'PLATINUM').length;
  const goldCount = customers.filter((c) => c.vipTier === 'GOLD').length;
  const silverCount = customers.filter((c) => c.vipTier === 'SILVER').length;

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 w-full max-w-full overflow-hidden font-sans">
      {/* Top Banner Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Customer Directory & SMS Communication Hub
          </h2>
          <div className="text-xs text-slate-500 font-medium">
            Manage customer records, VIP loyalty tiers, and SMS notifications
          </div>
        </div>

        <button
          onClick={() => setShowAddCustomerModal(true)}
          className="px-4 py-2 rounded-lg bg-[#0284c7] hover:bg-sky-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" /> Sajili Mteja Mpya
        </button>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex bg-white p-1 rounded-xl border border-slate-200 space-x-1 shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('directory')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'directory'
              ? 'bg-[#0284c7] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4 shrink-0" />
          <span>Customer Directory ({customers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('dispatch')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'dispatch'
              ? 'bg-[#0284c7] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Send className="w-4 h-4 shrink-0" />
          <span>Dispatch SMS Gateway</span>
        </button>

        <button
          onClick={() => setActiveSubTab('logs')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'logs'
              ? 'bg-[#0284c7] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
          <span>SMS History Logs ({smsLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('loyalty')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'loyalty'
              ? 'bg-[#0284c7] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4 shrink-0" />
          <span>VIP Loyalty Analytics</span>
        </button>
      </div>

      {/* SUB-TAB 1: CUSTOMER CRM DIRECTORY */}
      {activeSubTab === 'directory' && (
        <div className="space-y-4">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-1">
              <div className="text-[10px] font-bold uppercase text-slate-500">Total Customers</div>
              <div className="text-xl font-bold text-slate-900">{customers.length}</div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-1">
              <div className="text-[10px] font-bold uppercase text-purple-700">VIP Platinum</div>
              <div className="text-xl font-bold text-purple-950">{platinumCount}</div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-1">
              <div className="text-[10px] font-bold uppercase text-sky-700">VIP Gold</div>
              <div className="text-xl font-bold text-sky-950">{goldCount}</div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-1">
              <div className="text-[10px] font-bold uppercase text-emerald-700">VIP Silver</div>
              <div className="text-xl font-bold text-emerald-950">{silverCount}</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tafuta Mteja kwa Jina au Simu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              onClick={fetchAllData}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold uppercase text-slate-700 border-b border-slate-200">
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Phone Number</th>
                  <th className="p-3">VIP Tier</th>
                  <th className="p-3 text-right">Total Spent (TSH)</th>
                  <th className="p-3 text-center">Sales</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">
                      Inapakia...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500 font-bold">
                      Hakuna mteja aliyepatikana.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{c.name}</div>
                        {c.email && <div className="text-[10px] text-slate-500 font-mono">{c.email}</div>}
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-900">{c.phone}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            c.vipTier === 'PLATINUM'
                              ? 'bg-purple-100 text-purple-900'
                              : c.vipTier === 'GOLD'
                              ? 'bg-sky-100 text-sky-900'
                              : c.vipTier === 'SILVER'
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {c.vipTier}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        {c.totalSpent.toLocaleString()} TSH
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleViewCustomerSales(c)}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px]"
                        >
                          {c.salesCount} Sales
                        </button>
                      </td>
                      <td className="p-3 text-right flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenSmsForCustomer(c)}
                          className="px-2.5 py-1 bg-[#0284c7] hover:bg-sky-700 text-white font-bold rounded text-[10px] flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" /> SMS
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(c.id, c.name)}
                          className="p-1 rounded text-rose-600 hover:bg-rose-50"
                          title="Futa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Cards View */}
          <div className="block md:hidden space-y-3">
            {loading ? (
              <div className="p-6 text-center text-xs text-slate-400">Inapakia...</div>
            ) : (
              filteredCustomers.map((c) => (
                <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{c.name}</div>
                      <div className="text-[11px] font-mono text-slate-500">{c.phone}</div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        c.vipTier === 'PLATINUM'
                          ? 'bg-purple-100 text-purple-900'
                          : c.vipTier === 'GOLD'
                          ? 'bg-sky-100 text-sky-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {c.vipTier}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-500 text-[10px]">TOTAL SPENT:</span>
                      <div className="font-mono font-bold text-slate-900">{c.totalSpent.toLocaleString()} TSH</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenSmsForCustomer(c)}
                        className="px-2.5 py-1 bg-[#0284c7] text-white font-bold text-[10px] rounded flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" /> SMS
                      </button>
                      <button onClick={() => handleDeleteCustomer(c.id, c.name)} className="text-rose-600 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DISPATCH SMS GATEWAY */}
      {activeSubTab === 'dispatch' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <form
            onSubmit={handleSendSmsSubmit}
            className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 text-slate-800"
          >
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Send className="w-4 h-4 text-slate-700" /> Dispatch SMS Gateway
              </h3>
            </div>

            {/* Quick Templates Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Quick Templates</label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applySmsTemplate('POS_RECEIPT')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-slate-700" /> POS Receipt Template
                </button>
                <button
                  type="button"
                  onClick={() => applySmsTemplate('WARRANTY_RMA')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-700" /> Warranty RMA Template
                </button>
                <button
                  type="button"
                  onClick={() => applySmsTemplate('PROMO')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold flex items-center gap-1.5"
                >
                  <Gift className="w-3.5 h-3.5 text-slate-700" /> VIP Promo Template
                </button>
              </div>
            </div>

            {/* Recipient Controls */}
            <div className="space-y-3">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-900">
                <input
                  type="checkbox"
                  checked={isBulkSend}
                  onChange={(e) => setIsBulkSend(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded border-slate-300"
                />
                <span>Bulk Broadcast ({customers.length} Registered Customers)</span>
              </label>

              {!isBulkSend && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Recipient Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+255 712 345 678"
                    value={smsRecipient}
                    onChange={(e) => setSmsRecipient(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono font-semibold text-slate-900 bg-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              )}
            </div>

            {/* SMS Text Body */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                SMS Message Body *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Andika ujumbe wako..."
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={sendingSms}
                className="px-5 py-2.5 rounded-lg bg-[#0284c7] hover:bg-sky-700 text-white font-bold text-xs shadow-sm flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> {sendingSms ? 'Inatuma...' : isBulkSend ? 'Send Bulk SMS' : 'Send SMS'}
              </button>
            </div>
          </form>

          {/* SMS Status Info Side */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 text-xs font-medium text-slate-700">
            <div className="font-bold text-slate-900 border-b border-slate-200 pb-2 uppercase">
              SMS Gateway Status
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <div className="text-[11px] text-slate-500">Route Status:</div>
              <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Active Direct SMS Route
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <div className="text-[11px] text-slate-500">Total SMS Dispatched:</div>
              <div className="text-sm font-mono font-bold text-slate-900">{smsLogs.length} Messages</div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SMS DISPATCH HISTORY LOGS */}
      {activeSubTab === 'logs' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-700" /> SMS History Logs
            </h3>
            <button
              onClick={fetchAllData}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          <div className="space-y-2">
            {smsLogs.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">Hakuna log za SMS kwa sasa.</div>
            ) : (
              smsLogs.map((log) => (
                <div key={log.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{log.recipient}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-200 text-slate-800">
                        {log.type}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{new Date(log.sentAt).toLocaleString()}</span>
                  </div>

                  <p className="text-slate-800 font-medium">{log.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: VIP LOYALTY ANALYTICS */}
      {activeSubTab === 'loyalty' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-700" /> VIP Loyalty Analytics
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-1">
              <div className="text-xs font-bold uppercase text-purple-900">VIP Platinum Tier</div>
              <div className="text-xl font-bold text-purple-950">{platinumCount} Customers</div>
              <div className="text-[10px] text-purple-700">Matumizi &gt; 5,000,000 TSH</div>
            </div>

            <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 space-y-1">
              <div className="text-xs font-bold uppercase text-sky-900">VIP Gold Tier</div>
              <div className="text-xl font-bold text-sky-950">{goldCount} Customers</div>
              <div className="text-[10px] text-sky-700">Matumizi &gt; 2,000,000 TSH</div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
              <div className="text-xs font-bold uppercase text-emerald-900">VIP Silver Tier</div>
              <div className="text-xl font-bold text-emerald-950">{silverCount} Customers</div>
              <div className="text-[10px] text-emerald-700">Matumizi &gt; 500,000 TSH</div>
            </div>
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase">Sajili Mteja Mpya</h3>
              <button onClick={() => setShowAddCustomerModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomerSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Ally Bakari"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Phone Number (+255...) *</label>
                <input
                  type="text"
                  required
                  placeholder="+255 712 345 678"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono bg-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="ally@gmail.com"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono bg-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">TRA TIN Number</label>
                <input
                  type="text"
                  placeholder="123-456-789"
                  value={newCustTin}
                  onChange={(e) => setNewCustTin(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono bg-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  disabled={savingCustomer}
                  className="px-5 py-2 rounded-lg bg-[#0284c7] hover:bg-sky-700 text-white font-bold shadow-sm"
                >
                  {savingCustomer ? 'Inahifadhi...' : 'Sajili Mteja'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOMER SALES HISTORY MODAL */}
      {showSalesHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-xl w-full shadow-xl space-y-4 animate-in fade-in zoom-in duration-200 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase">
                  Sales History: {showSalesHistoryModal.name}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">{showSalesHistoryModal.phone}</p>
              </div>
              <button onClick={() => setShowSalesHistoryModal(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-3">
              {loadingSales ? (
                <div className="p-6 text-center text-xs text-slate-400">Inapakia...</div>
              ) : customerSales.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 font-bold">
                  Bado hajafanya mauzo ya POS.
                </div>
              ) : (
                customerSales.map((sale) => (
                  <div key={sale.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="font-mono text-slate-900">{sale.invoiceNumber}</span>
                      <span className="font-mono text-slate-900">{sale.grandTotal.toLocaleString()} TSH</span>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1">
                      {sale.items?.map((it, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{it.product?.name}</span>
                          <span>{it.lineTotal.toLocaleString()} TSH</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
