import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Search,
  CheckCircle,
  FileCheck,
  ChevronRight,
  Info,
  Building,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { RestrictedItem } from '../types';
import { RESTRICTED_ITEMS } from '../data/tradeData';

export const RestrictedItemsChecker: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredItems = RESTRICTED_ITEMS.filter((item) => {
    const matchesQuery =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.destinationCountry.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">Prohibited & Restricted Export Items Directory</h1>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                Pakistan Customs Policy 2026
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5 max-w-2xl">
              Verify export restrictions under Pakistan Customs Export Policy Order, CITES wildlife protection, US FDA food registration, and ISPM-15 timber packaging standards.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product (e.g. leather, salt, wood, food)..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#006747] focus:bg-white"
            />
          </div>
        </div>

        {/* Status Filter Badges */}
        <div className="flex gap-2 pt-4 border-t border-slate-100 mt-4 overflow-x-auto scrollbar-none">
          {[
            { id: 'ALL', label: 'All Regulatory Rules' },
            { id: 'forbidden', label: 'Forbidden / Prohibited' },
            { id: 'special_permit', label: 'Special Permit / FDA' },
            { id: 'restricted', label: 'Restricted / ISPM-15' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st.id
                  ? 'bg-[#006747] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredItems.map((item) => {
          const isForbidden = item.status === 'forbidden';
          const isPermit = item.status === 'special_permit';

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {item.category} • Bound for {item.destinationCountry}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">{item.productName}</h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 flex-shrink-0 ${
                      isForbidden
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : isPermit
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>{item.status.replace('_', ' ')}</span>
                  </span>
                </div>

                {/* Regulatory Authority */}
                <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Building className="w-4 h-4 text-[#006747] flex-shrink-0" />
                  <span>Authority: {item.authority}</span>
                </div>

                {/* Explanation */}
                <p className="text-xs text-slate-700 leading-relaxed">{item.ruleExplanation}</p>

                {/* Permits List */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                    Required Permits & Certificates:
                  </span>
                  <ul className="space-y-1">
                    {item.requiredPermits.map((p, idx) => (
                      <li key={idx} className="text-xs text-slate-800 flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-[#006747] flex-shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Steps */}
              <div className="pt-3 border-t border-slate-100 bg-emerald-50/50 -mx-6 -mb-6 p-4 rounded-b-2xl text-xs text-slate-800 space-y-1.5">
                <span className="font-bold text-[#006747] block flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-[#006747]" />
                  <span>Actionable Exporter Compliance Steps:</span>
                </span>
                {item.actionableSteps.map((step, idx) => (
                  <p key={idx} className="text-[11px] text-slate-700 pl-4 border-l-2 border-[#006747]">
                    {step}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
