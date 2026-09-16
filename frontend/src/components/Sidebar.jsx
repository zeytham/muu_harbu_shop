import React from 'react';
import { Smartphone, Package, ShieldCheck, AlertTriangle, ChevronLeft, ChevronRight, X, CheckCircle, ShoppingCart, Repeat, Award, DollarSign, TrendingUp, Settings } from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  alertCount = 0,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) {
  const navSections = [
    {
      title: 'Sales & Operations',
      items: [
        {
          id: 'pos',
          label: 'Smart POS Terminal',
          sublabel: 'Sales, Barcodes & Checkout',
          icon: ShoppingCart,
          badge: 'LIVE POS',
        },
      ],
    },
    {
      title: 'Inventory & Products',
      items: [
        {
          id: 'phones',
          label: 'Serialized Phones',
          sublabel: 'IMEI Tracking & Warranty',
          icon: Smartphone,
        },
        {
          id: 'accessories',
          label: 'Accessories & Gadgets',
          sublabel: 'Covers, Chargers, AirPods',
          icon: Package,
        },
        {
          id: 'compatibility',
          label: 'Compatibility Matcher',
          sublabel: 'Guaranteed Phone Fits',
          icon: ShieldCheck,
        },
      ],
    },
    {
      title: 'Customer & Services',
      items: [
        {
          id: 'upgrade',
          label: 'Phone Upgrade Program',
          sublabel: 'Trade-Up for Brand New Phones',
          icon: Repeat,
        },
        {
          id: 'warranties',
          label: 'Digital Warranty & RMA',
          sublabel: 'Supplier Swaps & Certificates',
          icon: Award,
        },
      ],
    },
    {
      title: 'Financials & Supply',
      items: [
        {
          id: 'financials',
          label: 'Owner Financials & Audit',
          sublabel: 'Profit, COGS & Daily Expenses',
          icon: DollarSign,
        },
        {
          id: 'forecasting',
          label: 'Restock & Supplier Hub',
          sublabel: 'AI Sales Velocity & PO Tracker',
          icon: TrendingUp,
        },
      ],
    },
    {
      title: 'System & Security',
      items: [
        {
          id: 'settings',
          label: 'Store Settings',
          sublabel: 'Branding, Security & Tax Setup',
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white border-r border-sky-200/80 transition-all duration-300 flex flex-col justify-between shadow-2xl ${
          isMobileOpen ? 'translate-x-0 w-72 max-w-[85vw]' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className="flex flex-col min-h-0 flex-1">
          <div className="h-16 px-4 flex items-center justify-between border-b border-sky-100 shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-10 w-10 rounded-xl bg-[#80ddff] flex items-center justify-center text-slate-950 font-black shadow-md shadow-sky-300/50 shrink-0 border border-sky-300">
                <Smartphone className="w-5 h-5 text-slate-950" />
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="truncate">
                  <h1 className="text-sm font-black text-slate-900 tracking-tight truncate">PhoneVault Pro</h1>
                  <p className="text-[10px] text-sky-700 font-bold tracking-wider uppercase">Enterprise ERP</p>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-sky-50 text-slate-600 hover:text-slate-900 transition-all border border-sky-200 shrink-0"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile Close Toggle */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-sky-50 text-slate-600 hover:text-slate-900 shrink-0"
              title="Close Navigation Drawer"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>
          </div>

          {/* Navigation Links Scrollable Area */}
          <div className="p-3 space-y-4 overflow-y-auto flex-1 max-h-[calc(100vh-140px)] scrollbar-thin">
            {navSections.map((section, idx) => (
              <div key={section.title || idx} className="space-y-1">
                {(!isCollapsed || isMobileOpen) ? (
                  <div className="px-3 pt-1 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100/60 mb-1 flex items-center justify-between">
                    <span>{section.title}</span>
                  </div>
                ) : (
                  idx > 0 && <div className="border-t border-slate-100 my-2" />
                )}

                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 sm:py-2.5 rounded-xl text-left transition-all ${
                        isActive
                          ? 'bg-[#0284c7] text-white font-extrabold shadow-md shadow-sky-600/30'
                          : 'text-slate-700 hover:text-slate-950 hover:bg-sky-50 font-semibold'
                      }`}
                      title={item.label}
                    >
                      <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-sky-700'}`} />
                      {(!isCollapsed || isMobileOpen) && (
                        <div className="truncate flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <div className="text-xs font-bold leading-tight truncate">{item.label}</div>
                            {item.badge && (
                              <span
                                className={`text-[9px] px-1.5 py-0.5 rounded-full font-black shrink-0 ${
                                  isActive ? 'bg-white text-sky-800' : 'bg-[#80ddff]/30 text-sky-950 border border-sky-300'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <div className={`text-[10px] truncate ${isActive ? 'text-sky-100' : 'text-slate-500'}`}>
                            {item.sublabel}
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Sidebar Status Widget */}
        <div className="p-3 border-t border-sky-100 shrink-0">
          {!isCollapsed || isMobileOpen ? (
            <div className="bg-sky-50/80 p-3 rounded-xl border border-sky-200/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Reorder Alerts:
                </span>
                <span className="font-extrabold text-sky-900 px-2 py-0.5 bg-[#80ddff]/40 rounded-full border border-sky-300 text-[11px]">
                  {alertCount}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 flex items-center justify-between">
                <span>System Status:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Live
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-2">
              <span className="h-3 w-3 rounded-full bg-[#0284c7] animate-ping" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
