import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import POSTerminal from './components/Module2/POSTerminal';
import PhoneUnitsTab from './components/Module1/PhoneUnitsTab';
import AccessoriesTab from './components/Module1/AccessoriesTab';
import CompatibilityFinder from './components/Module1/CompatibilityFinder';
import BarcodePrinterModal from './components/Module1/BarcodePrinterModal';
import AddPhoneModal from './components/Module1/AddPhoneModal';
import AddAccessoryModal from './components/Module1/AddAccessoryModal';
import UpgradeProgram from './components/Module3/UpgradeProgram';
import WarrantyVault from './components/Module4/WarrantyVault';
import FinancialAnalytics from './components/Module5/FinancialAnalytics';
import RestockAndSupplierHub from './components/Module6/RestockAndSupplierHub';
import StoreSettingsHub from './components/Settings/StoreSettingsHub';
import LoginPortal from './components/Auth/LoginPortal';
import LockScreenModal from './components/Auth/LockScreenModal';

import { Smartphone, Package, ShieldCheck, AlertTriangle, Layers, DollarSign, ShoppingCart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('pos'); // Default to POS Terminal!

  // Auth & Session States
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('phonevault_user');
    return saved ? JSON.parse(saved) : { id: 'demo-1', name: 'Store Owner', email: 'admin@phonevault.tz', role: 'ADMIN' };
  });
  const [isLocked, setIsLocked] = useState(false);
  const [storeSettings, setStoreSettings] = useState(null);

  // Sidebar Layout States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Data states
  const [products, setProducts] = useState([]);
  const [phoneUnits, setPhoneUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [phoneModels, setPhoneModels] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bridge state between Module 3 (Upgrade) and Module 2 (POS)
  const [posTransferData, setPosTransferData] = useState(null);

  // Modals
  const [isAddPhoneOpen, setIsAddPhoneOpen] = useState(false);
  const [isAddAccessoryOpen, setIsAddAccessoryOpen] = useState(false);
  const [printBarcode, setPrintBarcode] = useState(null);

  const handleTransferToPos = ({ voucherCode, voucherValue, customer, targetPhoneUnit }) => {
    setPosTransferData({
      voucherCode,
      voucherValue,
      customer,
      targetPhoneUnit,
    });
    setActiveTab('pos');
  };

  const fetchStoreSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) {
        setStoreSettings(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    fetchStoreSettings();
    try {
      const safeFetch = async (url) => {
        try {
          const r = await fetch(url);
          if (!r.ok) return { success: false, data: [] };
          return await r.json();
        } catch {
          return { success: false, data: [] };
        }
      };

      const [resProd, resPhones, resCat, resBrands, resModels, resAlerts] = await Promise.all([
        safeFetch('/api/products'),
        safeFetch('/api/phones/units'),
        safeFetch('/api/categories'),
        safeFetch('/api/categories/brands'),
        safeFetch('/api/categories/models'),
        safeFetch('/api/products/alerts/low-stock'),
      ]);

      if (resProd.success && Array.isArray(resProd.data)) setProducts(resProd.data);
      if (resPhones.success && Array.isArray(resPhones.data)) setPhoneUnits(resPhones.data);
      if (resCat.success && Array.isArray(resCat.data)) setCategories(resCat.data);
      if (resBrands.success && Array.isArray(resBrands.data)) setBrands(resBrands.data);
      if (resModels.success && Array.isArray(resModels.data)) setPhoneModels(resModels.data);
      if (resAlerts.success && Array.isArray(resAlerts.data)) setAlerts(resAlerts.data);
    } catch (err) {
      console.error('Data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('phonevault_token');
    localStorage.removeItem('phonevault_user');
    setCurrentUser(null);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Calculate Total Valuation of Inventory
  const calculateTotalValuation = () => {
    let total = 0;
    // Phones
    phoneUnits.forEach((u) => {
      total += u.retailPrice || 0;
    });
    // Accessories
    products.forEach((p) => {
      if (p.type !== 'PHONE') {
        if (p.hasVariants) {
          p.variants?.forEach((v) => {
            total += (v.price || 0) * (v.stockQuantity || 0);
          });
        } else {
          total += (p.basePrice || 0) * (p.stockQuantity || 0);
        }
      }
    });
    return total;
  };

  if (!currentUser) {
    return (
      <LoginPortal
        storeSettings={storeSettings}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          fetchAllData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen sky-page-bg text-slate-900 flex font-sans antialiased">
      {/* Quick Lock Screen Modal */}
      {isLocked && (
        <LockScreenModal
          currentUser={currentUser}
          storeSettings={storeSettings}
          onUnlock={() => setIsLocked(false)}
          onLogout={handleLogout}
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alertCount={alerts.length}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          alerts={alerts}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onOpenAddPhone={() => setIsAddPhoneOpen(true)}
          onOpenAddAccessory={() => setIsAddAccessoryOpen(true)}
          onRefresh={fetchAllData}
          loading={loading}
          currentUser={currentUser}
          storeSettings={storeSettings}
          onLockScreen={() => setIsLocked(true)}
          onOpenSettings={() => setActiveTab('settings')}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Executive Overview Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Phones Stat */}
            <div className="bg-white rounded-2xl p-4 border border-sky-200 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#80ddff]/30 text-sky-900 border border-sky-300 flex items-center justify-center font-black shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{phoneUnits.length}</div>
                <div className="text-xs text-slate-600 font-bold">IMEI Serialized Phones</div>
              </div>
            </div>

            {/* Accessories Catalog Stat */}
            <div className="bg-white rounded-2xl p-4 border border-sky-200 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-800 border border-purple-300 flex items-center justify-center font-black shrink-0">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">
                  {products.filter((p) => p.type !== 'PHONE').length}
                </div>
                <div className="text-xs text-slate-600 font-bold">Accessories & Gadgets</div>
              </div>
            </div>

            {/* Total Inventory Valuation Stat */}
            <div className="bg-white rounded-2xl p-4 border border-sky-200 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-black shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <div className="text-lg font-black text-emerald-700">
                  TSH {calculateTotalValuation().toLocaleString()}
                </div>
                <div className="text-xs text-slate-600 font-bold">Est. Stock Valuation</div>
              </div>
            </div>

            {/* Reorder Alerts Stat */}
            <div className="bg-white rounded-2xl p-4 border border-sky-200 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center font-black shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-amber-700">{alerts.length}</div>
                <div className="text-xs text-slate-600 font-bold">Low Stock Reorders</div>
              </div>
            </div>
          </div>

          {/* Active Tab View Rendering */}
          <div className="pt-2">
            {activeTab === 'pos' && (
              <POSTerminal
                products={products}
                phoneUnits={phoneUnits}
                onRefresh={fetchAllData}
                initialVoucherCode={posTransferData?.voucherCode}
                initialVoucherValue={posTransferData?.voucherValue}
                initialCustomer={posTransferData?.customer}
                initialPhoneUnit={posTransferData?.targetPhoneUnit}
              />
            )}

            {activeTab === 'settings' && (
              <StoreSettingsHub
                settings={storeSettings}
                onRefreshSettings={fetchStoreSettings}
              />
            )}

            {activeTab === 'upgrade' && (
              <UpgradeProgram
                products={products}
                phoneUnits={phoneUnits}
                onTransferToPos={handleTransferToPos}
              />
            )}

            {activeTab === 'warranties' && (
              <WarrantyVault />
            )}

            {activeTab === 'financials' && (
              <FinancialAnalytics />
            )}

            {activeTab === 'forecasting' && (
              <RestockAndSupplierHub products={products} onRefresh={fetchAllData} />
            )}

            {activeTab === 'phones' && (
              <PhoneUnitsTab
                phoneUnits={phoneUnits}
                loading={loading}
                onOpenBulkImport={() => setIsAddPhoneOpen(true)}
                onPrintBarcode={(code) => setPrintBarcode(code)}
              />
            )}

            {activeTab === 'accessories' && (
              <AccessoriesTab
                products={products}
                loading={loading}
                onPrintBarcode={(code) => setPrintBarcode(code)}
              />
            )}

            {activeTab === 'compatibility' && (
              <CompatibilityFinder phoneModels={phoneModels} />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-sky-200/80 py-6 text-center text-xs text-slate-600">
          PhoneVault Pro Enterprise • Built with Node.js, React, Prisma & Tailwind CSS
        </footer>
      </div>

      {/* Modals */}
      {isAddPhoneOpen && (
        <AddPhoneModal
          products={products}
          onClose={() => setIsAddPhoneOpen(false)}
          onSuccess={fetchAllData}
        />
      )}

      {isAddAccessoryOpen && (
        <AddAccessoryModal
          categories={categories}
          brands={brands}
          onClose={() => setIsAddAccessoryOpen(false)}
          onSuccess={fetchAllData}
        />
      )}

      {printBarcode && (
        <BarcodePrinterModal
          code={printBarcode}
          onClose={() => setPrintBarcode(null)}
        />
      )}
    </div>
  );
}
