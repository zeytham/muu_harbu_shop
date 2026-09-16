import React, { useState } from 'react';
import { Menu, Search, Bell, Plus, RefreshCw, Smartphone, Package, ShieldCheck, User, X, AlertTriangle, ChevronDown } from 'lucide-react';

export default function Header({
  activeTab,
  alerts = [],
  onOpenMobileNav,
  onOpenAddPhone,
  onOpenAddAccessory,
  onRefresh,
  loading,
  currentUser,
  storeSettings,
  onLockScreen,
  onOpenSettings,
  onLogout,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileAddMenu, setShowMobileAddMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'pos':
        return 'Smart POS Terminal Desk';
      case 'upgrade':
        return 'Phone Upgrade Program';
      case 'warranties':
        return 'Digital Warranty & Supplier RMA';
      case 'phones':
        return 'Serialized Phones (IMEI Tracking)';
      case 'accessories':
        return 'Accessories & Gadgets Catalog';
      case 'compatibility':
        return 'Compatibility Matcher Engine';
      case 'financials':
        return 'Owner Financials & Store Audit';
      case 'forecasting':
        return 'AI Restock Predictor & Supplier Hub';
      case 'settings':
        return 'Store Settings & Security Controls';
      default:
        return storeSettings?.shopName || 'PhoneVault Pro Management';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-sky-200/80 px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between shadow-sm max-w-full overflow-hidden">
      {/* Left Section: Mobile Navigation Menu Trigger & Breadcrumb Title */}
      <div className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-xl bg-sky-50 border border-sky-200 text-slate-700 hover:text-slate-950 shrink-0"
          title="Open Menu"
        >
          <Menu className="w-5 h-5 text-sky-800" />
        </button>

        <div className="truncate">
          <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight truncate">
            {getBreadcrumbTitle()}
          </h2>
          <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold hidden sm:block truncate">
            {storeSettings?.shopName || 'PhoneVault Pro Enterprise'} • Enterprise v1.0
          </p>
        </div>
      </div>

      {/* Right Section: Sync Button, Mobile Quick Add, Notifications & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Sync / Refresh Data Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 sm:p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-slate-700 border border-sky-200 transition-all flex items-center gap-1.5 text-xs font-bold shrink-0"
          title="Sync System Data"
        >
          <RefreshCw className={`w-4 h-4 text-sky-600 shrink-0 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden md:inline">Sync Data</span>
        </button>

        {/* Notifications Center Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowMobileAddMenu(false);
              setShowUserMenu(false);
            }}
            className="p-2 sm:p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-slate-700 border border-sky-200 transition-all flex items-center gap-1 text-xs font-semibold relative shrink-0"
            title="Reorder Alerts"
          >
            <Bell className="w-4 h-4 text-amber-600 shrink-0" />
            {alerts.length > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] font-black bg-rose-500 text-white rounded-full leading-none">
                {alerts.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="fixed inset-x-3 top-16 sm:absolute sm:right-0 sm:left-auto sm:top-full sm:mt-2 w-auto sm:w-96 bg-white border border-sky-200 rounded-2xl shadow-2xl p-4 z-50 space-y-3 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-sky-100 pb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <h4 className="text-xs font-bold text-slate-900">Reorder & Low Stock Alerts ({alerts.length})</h4>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {alerts.length === 0 ? (
                  <div className="text-xs text-slate-500 text-center py-4">All inventory stock levels are optimal!</div>
                ) : (
                  alerts.map((al) => (
                    <div key={al.id} className="p-3 bg-sky-50 rounded-xl border border-sky-100 space-y-1 text-left">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span>{al.productName}</span>
                        <span className="text-rose-600 font-extrabold">{al.currentStock} left</span>
                      </div>
                      <p className="text-[11px] text-slate-600">{al.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-sky-50 transition-all border border-sky-200 shrink-0"
          >
            <div className="h-8 w-8 rounded-lg bg-[#80ddff]/40 border border-sky-300 flex items-center justify-center text-slate-950 font-black text-xs shrink-0">
              <User className="w-4 h-4 text-slate-950" />
            </div>
            <div className="hidden xl:block text-left pr-1">
              <div className="text-xs font-black text-slate-900 leading-tight">{currentUser?.name || 'Store Owner'}</div>
              <div className="text-[10px] text-emerald-600 font-bold">Owner Logged In</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-sky-200 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
              <button
                onClick={() => {
                  onLockScreen();
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-sky-50 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-amber-600" />
                <span>Lock Screen (PIN)</span>
              </button>
              <button
                onClick={() => {
                  onOpenSettings();
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-sky-50 flex items-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-sky-600" />
                <span>Store Settings</span>
              </button>
              <div className="border-t border-sky-100 my-1" />
              <button
                onClick={() => {
                  onLogout();
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
