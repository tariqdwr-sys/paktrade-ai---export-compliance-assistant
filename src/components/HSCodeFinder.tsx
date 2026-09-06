import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Tag,
  CheckCircle,
  AlertTriangle,
  Globe,
  FileText,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { HSCodeItem, ShipmentDetails } from '../types';
import { POPULAR_HS_CODES } from '../data/tradeData';

interface HSCodeFinderProps {
  onSelectHSCodeForChat: (hsItem: HSCodeItem) => void;
  onNavigateToDocsWithHS: (hsItem: HSCodeItem) => void;
}

export const HSCodeFinder: React.FC<HSCodeFinderProps> = ({
  onSelectHSCodeForChat,
  onNavigateToDocsWithHS,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('ALL');
  const [hsCodes, setHsCodes] = useState<HSCodeItem[]>(POPULAR_HS_CODES);

  useEffect(() => {
    let filtered = POPULAR_HS_CODES;

    if (selectedChapter !== 'ALL') {
      filtered = filtered.filter((item) => item.chapter === selectedChapter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.hsCode.toLowerCase().includes(q) ||
          item.productName.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.chapterName.toLowerCase().includes(q)
      );
    }

    setHsCodes(filtered);
  }, [searchQuery, selectedChapter]);

  const chapters = [
    { id: 'ALL', name: 'All Categories' },
    { id: '62', name: '62 - Apparel & Garments' },
    { id: '63', name: '63 - Textiles & Bedding' },
    { id: '64', name: '64 - Leather Footwear' },
    { id: '42', name: '42 - Leather Apparel' },
    { id: '90', name: '90 - Surgical Instruments' },
    { id: '95', name: '95 - Sports Equipment' },
    { id: '10', name: '10 - Rice & Cereals' },
    { id: '25', name: '25 - Pink Salt & Minerals' },
    { id: '98', name: '98 - IT & Software Services' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Search Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">Harmonized System (HS) Code Finder</h1>
              <span className="bg-emerald-100 text-[#006747] text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Pakistan Export Directory
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5 max-w-2xl">
              Search 6-digit international tariff classification codes for major Pakistani export goods. View destination tariff rules, SBP Form E requirements, and compliance permits.
            </p>
          </div>

          {/* Live Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search HS code or product (e.g. 6403, Bed Sheet, Surgical)..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#006747] focus:bg-white"
            />
          </div>
        </div>

        {/* Chapter Filter Badges */}
        <div className="flex gap-1.5 overflow-x-auto pt-4 border-t border-slate-100 mt-4 scrollbar-none">
          {chapters.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setSelectedChapter(ch.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedChapter === ch.id
                  ? 'bg-[#006747] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {ch.name}
            </button>
          ))}
        </div>
      </div>

      {/* HS Code Item Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hsCodes.map((item) => (
          <div
            key={item.hsCode}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all p-5 flex flex-col justify-between space-y-4 group"
          >
            <div>
              {/* Top Header Row */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Ch. {item.chapter} • {item.chapterName}
                </span>
                <span className="font-mono text-xs font-extrabold bg-emerald-50 text-[#006747] border border-emerald-200 px-2 py-0.5 rounded-md">
                  {item.hsCode}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-extrabold text-sm text-slate-900 mt-2.5 group-hover:text-[#006747] transition-colors">
                {item.productName}
              </h3>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                {item.description}
              </p>

              {/* Duty & VAT Badges */}
              <div className="mt-3.5 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 font-medium">Typical Tariff Rate:</span>
                  <span className="font-bold text-slate-800">{item.typicalDutyRate}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 font-medium">Standard Destination VAT:</span>
                  <span className="font-bold text-slate-800">{item.typicalVatRate}</span>
                </div>
              </div>

              {/* Special Requirement Callout */}
              <div className="mt-3 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span><strong>Requirement:</strong> {item.specialRequirements}</span>
              </div>

              {/* Popular Destinations Badges */}
              <div className="mt-3">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">
                  TOP DESTINATIONS:
                </span>
                <div className="flex flex-wrap gap-1">
                  {item.popularDestinations.map((dest, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md"
                    >
                      {dest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => onSelectHSCodeForChat(item)}
                className="flex-1 bg-[#006747] hover:bg-[#005238] text-white text-xs font-bold py-2 px-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Ask AI Compliance</span>
              </button>

              <button
                onClick={() => onNavigateToDocsWithHS(item)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-1"
                title="Create Commercial Invoice with this HS code"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Invoice</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {hsCodes.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-bold text-slate-700">No HS Codes matched your query</p>
          <p className="text-xs text-slate-400 mt-1">Try searching for broader terms like "textile", "leather", or "rice".</p>
        </div>
      )}
    </div>
  );
};
