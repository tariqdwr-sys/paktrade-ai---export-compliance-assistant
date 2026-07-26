import React from 'react';
import {
  Layers,
  ArrowRight,
  Sparkles,
  Globe,
  Ship,
  CheckCircle2,
  DollarSign,
  FileText,
  BadgeAlert,
} from 'lucide-react';
import { ExportPreset, ShipmentDetails } from '../types';
import { EXPORT_PRESETS, CURRENCY_SYMBOLS } from '../data/tradeData';

interface TradePresetsProps {
  onSelectPreset: (preset: ExportPreset) => void;
}

export const TradePresets: React.FC<TradePresetsProps> = ({ onSelectPreset }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">Popular Pakistani Export Scenarios</h1>
              <span className="bg-emerald-100 text-[#006747] text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                1-Click Inspection
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5 max-w-2xl">
              Select any sample export batch to instantly analyze HS code tariffs, SBP Form E bank clearances, and destination customs rules in PakTrade AI.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Presets */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXPORT_PRESETS.map((preset) => (
          <div
            key={preset.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 hover:border-emerald-300 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[10px] font-extrabold text-[#006747] bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  HS {preset.hsCode}
                </span>
                <span className="text-xs font-bold text-slate-500">{preset.destination}</span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#006747] transition-colors">
                {preset.title}
              </h3>
              <p className="text-xs text-slate-500">{preset.tagline}</p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Material Spec:</span>
                  <span className="font-semibold text-slate-800">{preset.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Declared Value:</span>
                  <span className="font-extrabold text-[#006747]">
                    Rs. {preset.declaredValuePkr.toLocaleString()} PKR
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectPreset(preset)}
              className="w-full bg-[#006747] hover:bg-[#005238] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Inspect with PakTrade AI</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-200 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
