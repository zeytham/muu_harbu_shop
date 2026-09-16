import React, { useState, useEffect } from 'react';
import {
  Settings,
  Building2,
  Lock,
  DollarSign,
  Database,
  Save,
  CheckCircle,
  AlertCircle,
  FileText,
  Key,
  ShieldCheck,
  Download,
  Percent,
} from 'lucide-react';

export default function StoreSettingsHub({ settings, onRefreshSettings }) {
  const [activeTab, setActiveTab] = useState('branding'); // branding, security, tax, backup

  // Form states
  const [shopName, setShopName] = useState(settings?.shopName || 'PhoneVault Pro Enterprise');
  const [shopPhone, setShopPhone] = useState(settings?.shopPhone || '+255 700 112 233');
  const [shopEmail, setShopEmail] = useState(settings?.shopEmail || 'info@phonevault.tz');
  const [shopAddress, setShopAddress] = useState(settings?.shopAddress || 'Kariakoo Commercial Complex, Dar es Salaam');
  const [tinNumber, setTinNumber] = useState(settings?.tinNumber || '123-456-789');
  const [vrnNumber, setVrnNumber] = useState(settings?.vrnNumber || '40-012345-X');
  const [receiptHeader, setReceiptHeader] = useState(settings?.receiptHeader || 'Karibu PhoneVault Pro - Quality Guaranteed!');
  const [receiptFooter, setReceiptFooter] = useState(settings?.receiptFooter || 'Asante kwa kununua nasi! Warranty Certificate Included.');

  const [currency, setCurrency] = useState(settings?.currency || 'TSH');
  const [exchangeRate, setExchangeRate] = useState(settings?.exchangeRate || 2650);
  const [taxRate, setTaxRate] = useState(settings?.taxRate || 18);

  const [newPassword, setNewPassword] = useState('');
  const [newPin, setNewPin] = useState(settings?.pin || '1234');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (settings) {
      setShopName(settings.shopName || '');
      setShopPhone(settings.shopPhone || '');
      setShopEmail(settings.shopEmail || '');
      setShopAddress(settings.shopAddress || '');
      setTinNumber(settings.tinNumber || '');
      setVrnNumber(settings.vrnNumber || '');
      setReceiptHeader(settings.receiptHeader || '');
      setReceiptFooter(settings.receiptFooter || '');
      setCurrency(settings.currency || 'TSH');
      setExchangeRate(settings.exchangeRate || 2650);
      setTaxRate(settings.taxRate || 18);
    }
  }, [settings]);

  const handleSaveBrandingAndTax = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopName,
          shopPhone,
          shopEmail,
          shopAddress,
          tinNumber,
          vrnNumber,
          currency,
          exchangeRate,
          taxRate,
          receiptHeader,
          receiptFooter,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('🎉 Mipangilio Ya Duka Imesajiliwa Kwenye Mfumo Mzima!');
        if (onRefreshSettings) onRefreshSettings();
      } else {
        alert('Hitilafu: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Imefeli kuhifadhi mipangilio');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      const res = await fetch('/api/settings/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPassword,
          newPin,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('🔒 Security Password & Manager PIN zimebadilishwa kwa mafanikio!');
        setNewPassword('');
      } else {
        alert('Hitilafu: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Imefeli kubadilisha password/PIN');
    } finally {
      setSaving(false);
    }
  };

  const handleExportBackup = () => {
    window.open('/api/settings/export-backup', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-sky-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#80ddff]/20 text-[#80ddff] text-xs font-black tracking-wider uppercase border border-[#80ddff]/30">
              <Settings className="w-3.5 h-3.5" /> STORE SETTINGS & OWNER PROFILE HUB
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              System Configuration & Branding Controls
            </h1>
            <p className="text-xs sm:text-sm text-sky-200 font-medium max-w-2xl">
              Badilisha Jina la Duka, TIN/VRN, Password, Manager PIN, Kodi ya TRA, na utoe Backup ya Mfumo. Mabadiliko yanaonekana kwenye Risiti, POS, na Report zote moja kwa moja.
            </p>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-1 border-t border-sky-800/60 pt-4">
          <button
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'branding' ? 'bg-white text-slate-950 shadow-md font-bold' : 'text-sky-200 hover:bg-white/10'
            }`}
          >
            <Building2 className="w-4 h-4 text-sky-700" /> 🏪 Branding & Receipts
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'security' ? 'bg-white text-slate-950 shadow-md font-bold' : 'text-sky-200 hover:bg-white/10'
            }`}
          >
            <Lock className="w-4 h-4 text-purple-700" /> 🔑 Password & Manager PIN
          </button>
          <button
            onClick={() => setActiveTab('tax')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'tax' ? 'bg-white text-slate-950 shadow-md font-bold' : 'text-sky-200 hover:bg-white/10'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-600" /> 💱 Currency & TRA Tax
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'backup' ? 'bg-white text-slate-950 shadow-md font-bold' : 'text-sky-200 hover:bg-white/10'
            }`}
          >
            <Database className="w-4 h-4 text-amber-600" /> 💾 System Data Backup
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-black flex items-center justify-between shadow-sm">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-700 hover:text-emerald-950">
            ×
          </button>
        </div>
      )}

      {/* SUB-TAB 1: STORE BRANDING & RECEIPT DETAILS */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveBrandingAndTax} className="bg-white rounded-3xl border border-sky-200/80 p-6 shadow-sm space-y-6 text-slate-800">
          <div className="border-b border-sky-100 pb-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Taarifa za Duka & Muundo wa Risiti (Store Profile & Receipts)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Jina na namba unazoweka hapa zitaonekana kwenye Risiti za POS, Certificates za Warranty, na Proforma Invoices.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
            <div>
              <label className="block text-slate-700 uppercase tracking-wider mb-1.5">Jina la Duka (Store Name) *</label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-black text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 uppercase tracking-wider mb-1.5">Namba ya Simu ya Duka</label>
              <input
                type="text"
                value={shopPhone}
                onChange={(e) => setShopPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 uppercase tracking-wider mb-1.5">TRA TIN Number</label>
              <input
                type="text"
                value={tinNumber}
                onChange={(e) => setTinNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 uppercase tracking-wider mb-1.5">TRA VRN Number</label>
              <input
                type="text"
                value={vrnNumber}
                onChange={(e) => setVrnNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 uppercase tracking-wider mb-1.5">Anwani ya Duka (Physical Address)</label>
              <input
                type="text"
                value={shopAddress}
                onChange={(e) => setShopAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
              />
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-sky-100">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Maneno ya Risiti (Receipt Header & Footer)</h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Receipt Header Announcement</label>
              <input
                type="text"
                value={receiptHeader}
                onChange={(e) => setReceiptHeader(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Receipt Footer Legal Terms</label>
              <input
                type="text"
                value={receiptFooter}
                onChange={(e) => setReceiptFooter(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#0284c7] hover:bg-sky-700 text-white font-black text-xs transition-all shadow-md shadow-sky-600/30 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> {saving ? 'Inahifadhi...' : 'Hifadhi Mipangilio Ya Duka'}
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 2: SECURITY & MANAGER PIN */}
      {activeTab === 'security' && (
        <form onSubmit={handleSaveSecurity} className="bg-white rounded-3xl border border-sky-200/80 p-6 shadow-sm space-y-6 text-slate-800">
          <div className="border-b border-sky-100 pb-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Usalama Wa Mwenye Duka & Manager PIN (Security Controls)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Badilisha password ya kuingilia au Manager PIN ya tarakimu 4 inayotumika kuruhusu discount kwenye POS Terminal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
            <div>
              <label className="block text-slate-700 uppercase tracking-wider mb-1.5">New Owner Password</label>
              <input
                type="password"
                placeholder="Weka password mpya..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 uppercase tracking-wider mb-1.5">Manager 4-Digit Override PIN</label>
              <input
                type="password"
                maxLength={4}
                placeholder="1234"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-black text-slate-900 bg-white text-center text-base"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs transition-all shadow-md shadow-purple-600/30 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" /> {saving ? 'Inahifadhi...' : 'Badilisha Password & PIN'}
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 3: CURRENCY & TRA TAX */}
      {activeTab === 'tax' && (
        <form onSubmit={handleSaveBrandingAndTax} className="bg-white rounded-3xl border border-sky-200/80 p-6 shadow-sm space-y-6 text-slate-800">
          <div className="border-b border-sky-100 pb-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Kodi ya TRA VAT & Viwango vya Dola (Currency & Tax Setup)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Weka kiwango cha kodi cha TRA na rate ya kubadilisha Dola kwenda Shilingi kwenye mauzo ya POS.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
            <div>
              <label className="block text-slate-700 uppercase tracking-wider mb-1.5">Default Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-black text-slate-900 bg-white"
              >
                <option value="TSH">Tanzanian Shilling (TSH)</option>
                <option value="USD">US Dollar ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 uppercase tracking-wider mb-1.5">Exchange Rate (1 USD = X TSH)</label>
              <input
                type="number"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-black text-slate-900 bg-white text-right"
              />
            </div>

            <div>
              <label className="block text-slate-700 uppercase tracking-wider mb-1.5">TRA EFD VAT Rate (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-black text-slate-900 bg-white text-right"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs transition-all shadow-md shadow-emerald-600/30 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> {saving ? 'Inahifadhi...' : 'Hifadhi Viwango Vya Kodi & Dola'}
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 4: SYSTEM DATA BACKUP */}
      {activeTab === 'backup' && (
        <div className="bg-white rounded-3xl border border-sky-200/80 p-6 shadow-sm space-y-6 text-slate-800">
          <div className="border-b border-sky-100 pb-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-600" /> System Data Backup & Security Export
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Pakua nakala kamili ya data ya duka lako (Inventory, Mauzo, Warranties, na Matumizi) kwa usalama.
            </p>
          </div>

          <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/20 text-amber-800 rounded-xl shrink-0 font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-black text-amber-950">1-Click Full JSON Database Backup</div>
                <div className="text-xs text-amber-900 font-medium">
                  Faili hili linahifadhi bidhaa zote, namba za IMEI, historia ya mauzo ya POS, risiti za matumizi, na taarifa za ma-supplier kwa ajili ya usalama wa ziada.
                </div>
              </div>
            </div>

            <button
              onClick={handleExportBackup}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs transition-all shadow-md shadow-amber-600/30 flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Pakua Data Backup (Download JSON Export)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
