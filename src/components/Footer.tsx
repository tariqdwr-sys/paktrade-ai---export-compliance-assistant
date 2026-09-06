import React from 'react';
import { Ship, Shield, ExternalLink, Globe, FileText, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800 mt-16 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-[#006747] flex items-center justify-center font-bold">
                <Ship className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight">
                PakTrade <span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Pakistan's AI-Powered Cross-Border Trade & Customs Compliance Assistant. Empowering Pakistani exporters to seamlessly reach global destinations.
            </p>
          </div>

          {/* SBP & Customs Resources */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Official Pakistan Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.weboc.gov.pk"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>WeBOC Customs Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.sbp.org.pk"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>State Bank of Pakistan (SBP)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://tdap.gov.pk"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>Trade Development Authority (TDAP)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://fbr.gov.pk"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>Federal Board of Revenue (FBR)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Trade Schemes */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">International Tariff Agreements</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>UK Developing Countries Trading Scheme (DCTS)</li>
              <li>EU GSP+ Generalized Scheme of Preferences</li>
              <li>Pakistan - UAE CEPA Trade Agreement</li>
              <li>US Section 321 De Minimis ($800 Threshold)</li>
              <li>GCC Common Customs Tariff (5% Duty)</li>
            </ul>
          </div>

          {/* Compliance Disclaimer */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Compliance Disclaimer</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Calculations and AI guidance provided by PakTrade AI are for estimation and guidance purposes. Final duty, VAT, and customs clearance determinations rest with destination customs authorities and State Bank of Pakistan authorized dealer banks.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
          <p>© 2026 PakTrade AI. Empowering Pakistani Exporters Worldwide.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Export Policy Order 2026</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy & Data Security</span>
            <span className="hover:text-slate-300 cursor-pointer">WeBOC Form E Guide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
