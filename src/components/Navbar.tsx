import React from 'react';
import {
  Ship,
  Calculator,
  Search,
  FileText,
  AlertTriangle,
  Sparkles,
  Layers,
  Globe,
  Bot,
} from 'lucide-react';
import { Currency } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCurrency,
  setSelectedCurrency,
}) => {
  const navItems = [
    { id: 'assistant', label: 'PakTrade AI Assistant', icon: Bot, badge: 'AI Powered' },
    { id: 'calculator', label: 'Duty & Tax Calculator', icon: Calculator },
    { id: 'hscode', label: 'HS Code Finder', icon: Search },
    { id: 'documents', label: 'Document Builder', icon: FileText },
    { id: 'restricted', label: 'Restricted Items', icon: AlertTriangle },
    { id: 'presets', label: 'Popular Shipments', icon: Layers },
  ];

  return (
    <header className="bg-white border-b border-emerald-950/10 sticky top-0 z-50 shadow-xs">
      {/* Top Notification Bar */}
      <div className="bg-[#004d34] text-emerald-50 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-emerald-950">
              Sbp Compliance 2026
            </span>
            <span>
              Updated for WeBOC EIF clearances, UK DCTS scheme, EU GSP+ 0% tariffs & UAE CEPA rules.
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-emerald-200">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Tariff Engine
            </span>
            <span>Pakistan Export Desk</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <button
            onClick={() => setActiveTab('assistant')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#006747] flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:bg-[#005238] transition-colors">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                  PakTrade <span className="text-[#006747]">AI</span>
                </span>
                <span className="bg-emerald-100 text-[#006747] text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                Pakistan Export & Customs Compliance Assistant
              </p>
            </div>
          </button>

          {/* Right Utilities */}
          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1" />
              <span className="text-slate-500 font-medium hidden sm:inline">Display:</span>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
                className="bg-white border border-slate-200 rounded px-2 py-1 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#006747] text-xs cursor-pointer"
              >
                <option value="PKR">PKR (Rs.)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
                <option value="AED">AED (AED)</option>
                <option value="CAD">CAD (CA$)</option>
                <option value="AUD">AUD (A$)</option>
              </select>
            </div>

            {/* Quick Export CTA */}
            <button
              onClick={() => setActiveTab('documents')}
              className="hidden sm:flex items-center gap-1.5 bg-[#006747] hover:bg-[#005238] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Create Invoice</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex space-x-1 sm:space-x-2 border-t border-slate-100 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#006747] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                      isActive ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-100 text-[#006747]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
