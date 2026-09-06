import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Globe,
  DollarSign,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  FileCheck,
  Building2,
  ShieldAlert,
  ArrowRight,
  Info,
  Percent,
  Sparkles,
} from 'lucide-react';
import { Currency, DutyCalculationResult, ShipmentDetails, ShipmentType } from '../types';
import { CURRENCY_SYMBOLS, DESTINATION_COUNTRIES, EXCHANGE_RATES } from '../data/tradeData';

interface DutyCalculatorProps {
  selectedCurrency: Currency;
  initialShipmentDetails?: ShipmentDetails;
  onNavigateToDocs: (shipmentData?: ShipmentDetails) => void;
}

export const DutyCalculator: React.FC<DutyCalculatorProps> = ({
  selectedCurrency,
  initialShipmentDetails,
  onNavigateToDocs,
}) => {
  const [category, setCategory] = useState(initialShipmentDetails?.productDescription || 'Leather Footwear / Peshawari Chappals');
  const [destination, setDestination] = useState(initialShipmentDetails?.destinationCountry || 'United Kingdom');
  const [value, setValue] = useState<number>(initialShipmentDetails?.declaredValue || 150000);
  const [inputCurrency, setInputCurrency] = useState<Currency>(initialShipmentDetails?.currency || 'PKR');
  const [shipmentType, setShipmentType] = useState<ShipmentType>(initialShipmentDetails?.shipmentType || 'commercial');

  const [calculation, setCalculation] = useState<DutyCalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateDuty = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/calculate-duty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          destination,
          value,
          currency: inputCurrency,
          shipmentType,
        }),
      });

      const data = await res.json();
      setCalculation(data);
    } catch (err) {
      console.error('Failed to calculate duty:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    calculateDuty();
  }, [category, destination, value, inputCurrency, shipmentType]);

  const destSymbol = calculation ? CURRENCY_SYMBOLS[calculation.destinationCurrency as Currency] || '$' : '$';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#006747] flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">Customs Duty & VAT Estimator</h1>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                  Global Tariffs 2026
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5 max-w-2xl">
                Calculate estimated import duties, destination VAT/GST, and local tax requirements based on product value, HS code category, and international destination.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs">
            <Info className="w-4 h-4 text-[#006747] flex-shrink-0" />
            <span className="text-slate-600 font-medium">
              Default Origin: <strong className="text-slate-900 font-bold">Pakistan (PK)</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-sm text-slate-900 border-b pb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#006747]" />
              <span>Shipment Calculator Inputs</span>
            </h2>

            {/* Product Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Product Category / HS Code Type
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006747] focus:bg-white text-slate-800 font-medium cursor-pointer"
              >
                <option value="Leather Footwear / Peshawari Chappals">Leather Footwear / Peshawari Chappals (6403.99)</option>
                <option value="Cotton Textiles & Bed Linen">Cotton Textiles & Bed Linen (6302.21)</option>
                <option value="Denim Jeans & Apparel">Denim Jeans & Apparel (6203.42)</option>
                <option value="Leather Jackets & Goods">Leather Jackets & Goods (4203.10)</option>
                <option value="Stainless Steel Surgical Instruments">Stainless Steel Surgical Instruments (9018.90)</option>
                <option value="Soccer Balls & Sports Goods">Soccer Balls & Sports Goods (9506.62)</option>
                <option value="Super Kernel Basmati Rice">Super Kernel Basmati Rice (1006.30)</option>
                <option value="Himalayan Pink Salt Products">Himalayan Pink Salt Products (2501.00)</option>
                <option value="IT Services & Software Export">IT Services & Software Export (9888.00)</option>
              </select>
            </div>

            {/* Destination Country */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Destination Country
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006747] focus:bg-white text-slate-800 font-medium cursor-pointer"
              >
                {Object.keys(DESTINATION_COUNTRIES).map((c) => (
                  <option key={c} value={c}>
                    {c} ({DESTINATION_COUNTRIES[c].currency})
                  </option>
                ))}
              </select>
            </div>

            {/* Declared Value & Input Currency */}
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-7">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Declared Value
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006747] focus:bg-white text-slate-800 font-bold"
                />
              </div>

              <div className="col-span-5">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Currency
                </label>
                <select
                  value={inputCurrency}
                  onChange={(e) => setInputCurrency(e.target.value as Currency)}
                  className="w-full text-xs px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006747] focus:bg-white text-slate-800 font-medium cursor-pointer"
                >
                  <option value="PKR">PKR (Rs.)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="AED">AED (AED)</option>
                </select>
              </div>
            </div>

            {/* Shipment Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shipment Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShipmentType('commercial')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    shipmentType === 'commercial'
                      ? 'bg-emerald-50 border-[#006747] text-[#006747]'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Commercial Sale (B2B/B2C)
                </button>

                <button
                  type="button"
                  onClick={() => setShipmentType('personal')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    shipmentType === 'personal'
                      ? 'bg-emerald-50 border-[#006747] text-[#006747]'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Personal Gift / Sample
                </button>
              </div>
            </div>

            {/* Information Card */}
            <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/80 text-xs text-slate-700 space-y-1.5">
              <p className="font-bold text-[#006747] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Trade Scheme Info</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                {DESTINATION_COUNTRIES[destination]?.tradeAgreementWithPakistan}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Calculation Breakdown Results */}
        <div className="lg:col-span-7 space-y-6">
          {calculation ? (
            <div className="space-y-6">
              {/* Summary Cards Row */}
              <div className="grid sm:grid-cols-3 gap-4">
                {/* Card 1: Declared Value */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Export Value
                  </span>
                  <div className="mt-1">
                    <p className="text-lg font-extrabold text-slate-900">
                      Rs. {calculation.declaredValuePkr.toLocaleString()}
                    </p>
                    <p className="text-xs text-emerald-700 font-semibold">
                      ~ {destSymbol}{calculation.declaredValueLocal.toLocaleString()} {calculation.destinationCurrency}
                    </p>
                  </div>
                </div>

                {/* Card 2: Estimated Duties */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Customs Duty
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-[#006747] font-bold px-1.5 py-0.5 rounded">
                      {calculation.dutyRatePercent}%
                    </span>
                  </div>
                  <div className="mt-1">
                    <p className="text-lg font-extrabold text-slate-900">
                      Rs. {calculation.dutyAmountPkr.toLocaleString()}
                    </p>
                    <p className="text-xs text-[#006747] font-semibold">
                      {destSymbol}{calculation.dutyAmountLocal.toLocaleString()} {calculation.destinationCurrency}
                    </p>
                  </div>
                </div>

                {/* Card 3: Destination VAT/GST */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Destination VAT
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                      {calculation.vatRatePercent}%
                    </span>
                  </div>
                  <div className="mt-1">
                    <p className="text-lg font-extrabold text-slate-900">
                      Rs. {calculation.vatAmountPkr.toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-700 font-semibold">
                      {destSymbol}{calculation.vatAmountLocal.toLocaleString()} {calculation.destinationCurrency}
                    </p>
                  </div>
                </div>
              </div>

              {/* De Minimis Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${
                  calculation.fitsDeMinimis
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {calculation.fitsDeMinimis ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-sm">
                    {calculation.fitsDeMinimis
                      ? 'Within De Minimis Exemption Threshold'
                      : 'Exceeds Local De Minimis Exemption'}
                  </h4>
                  <p className="mt-0.5 leading-relaxed text-xs opacity-90">{calculation.deMinimisNote}</p>
                </div>
              </div>

              {/* Detailed Breakdown Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 border-b pb-3 flex items-center justify-between">
                  <span>Itemized Tax & Landed Cost Breakdown</span>
                  <span className="text-xs text-slate-500 font-medium">HS Code: {calculation.hsCode}</span>
                </h3>

                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-slate-600">FOB Export Value (Pakistan)</span>
                    <span className="font-semibold text-slate-900">
                      Rs. {calculation.declaredValuePkr.toLocaleString()} PKR ({destSymbol}{calculation.declaredValueLocal} {calculation.destinationCurrency})
                    </span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <span>Import Duty ({calculation.dutyRatePercent}%)</span>
                      {calculation.dutyRatePercent === 0 && (
                        <span className="bg-emerald-100 text-[#006747] text-[9px] font-bold px-1.5 py-0.2 rounded">
                          PREFERENTIAL 0%
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-slate-900">
                      Rs. {calculation.dutyAmountPkr.toLocaleString()} PKR ({destSymbol}{calculation.dutyAmountLocal} {calculation.destinationCurrency})
                    </span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-slate-600">Import VAT / GST ({calculation.vatRatePercent}%)</span>
                    <span className="font-semibold text-slate-900">
                      Rs. {calculation.vatAmountPkr.toLocaleString()} PKR ({destSymbol}{calculation.vatAmountLocal} {calculation.destinationCurrency})
                    </span>
                  </div>

                  <div className="py-3 flex justify-between items-center font-extrabold text-sm text-[#006747] bg-emerald-50/50 -mx-6 px-6 mt-2">
                    <span>Total Tax & Duty Payable</span>
                    <span>
                      Rs. {calculation.totalTaxPkr.toLocaleString()} PKR ({destSymbol}{calculation.totalTaxLocal} {calculation.destinationCurrency})
                    </span>
                  </div>
                </div>

                {/* Form E Guidance Callout */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs text-slate-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#006747]" />
                    <h4 className="font-bold text-slate-900">State Bank of Pakistan & WeBOC Rule</h4>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600">{calculation.formEGuidance}</p>
                </div>

                {/* Create Invoice Action CTA */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() =>
                      onNavigateToDocs({
                        productDescription: category,
                        material: 'Standard Export Specification',
                        destinationCountry: destination,
                        declaredValue: value,
                        currency: inputCurrency,
                        shipmentType,
                      })
                    }
                    className="flex-1 bg-[#006747] hover:bg-[#005238] text-white text-xs font-bold py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Generate Commercial Invoice for this Calculation</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-12 text-center text-slate-500">
              <Calculator className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold">Calculating destination tariff...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
