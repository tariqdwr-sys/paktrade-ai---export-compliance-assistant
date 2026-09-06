import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  Building2,
  Globe,
  Ship,
  Sparkles,
  Info,
  Calendar,
  Lock,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { CommercialInvoiceData, Currency, DocumentType, HSCodeItem, ShipmentDetails } from '../types';
import { CURRENCY_SYMBOLS, DESTINATION_COUNTRIES, STATE_BANK_FORM_E_GUIDE } from '../data/tradeData';

interface DocumentGeneratorProps {
  initialShipmentDetails?: ShipmentDetails;
  initialHSCodeItem?: HSCodeItem;
}

export const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  initialShipmentDetails,
  initialHSCodeItem,
}) => {
  const [activeDocType, setActiveDocType] = useState<DocumentType>('commercial_invoice');

  // Commercial Invoice Form State
  const [invoiceData, setInvoiceData] = useState<CommercialInvoiceData>({
    exporterName: 'PakTrade Global Exports Ltd',
    exporterAddress: 'Plot 42, Export Processing Zone (EPZ), Karachi, Pakistan',
    exporterNtnStrn: 'NTN: 4829103-7 | STRN: 3270019283011',
    exporterPhone: '+92 21 35890012',
    webocId: 'WEBOC-EXP-89021',
    importerName: 'British Craft Imports Ltd',
    importerAddress: '124 High Street, Soho, London W1D 3NE, United Kingdom',
    importerCountry: initialShipmentDetails?.destinationCountry || 'United Kingdom',
    importerTaxId: 'GB982301928',
    invoiceNumber: 'PK-EXP-2026-089',
    invoiceDate: new Date().toISOString().split('T')[0],
    formENumber: 'EIF-2026-MCB-90211',
    incoterm: 'DAP',
    modeOfTransport: 'Express Courier (DHL/FedEx/UPS)',
    portOfLoading: 'Karachi Air Cargo / Islamabad Int Airport',
    portOfDischarge: 'London Heathrow Airport (LHR)',
    currency: initialShipmentDetails?.currency || 'USD',
    items: [
      {
        description: initialShipmentDetails?.productDescription || initialHSCodeItem?.productName || 'Handmade Leather Peshawari Chappals',
        hsCode: initialHSCodeItem?.hsCode || '6403.99',
        quantity: 50,
        unitPrice: 15.00,
        totalPrice: 750.00,
        material: initialShipmentDetails?.material || '100% Cowhide Leather & Rubber Sole',
      },
    ],
    shippingCharges: 120.00,
    countryOfOrigin: 'Pakistan (Made in Pakistan)',
    bankName: 'MCB Bank Limited, Main Branch Lahore',
    ibanNumber: 'PK36MCBL09281002930192',
  });

  const handleAddItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: 'Cotton Embroidered Pouches',
          hsCode: '6302.21',
          quantity: 20,
          unitPrice: 10.00,
          totalPrice: 200.00,
          material: '100% Woven Cotton',
        },
      ],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index: number, field: string, val: any) => {
    setInvoiceData((prev) => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: val };
      if (field === 'quantity' || field === 'unitPrice') {
        const q = Number(updated[index].quantity) || 0;
        const p = Number(updated[index].unitPrice) || 0;
        updated[index].totalPrice = Number((q * p).toFixed(2));
      }
      return { ...prev, items: updated };
    });
  };

  const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const grandTotal = subtotal + (Number(invoiceData.shippingCharges) || 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">Automated Trade Document Builder</h1>
              <span className="bg-emerald-100 text-[#006747] text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                WeBOC & SBP Compliant
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5 max-w-2xl">
              Generate standardized export documents for Pakistan Customs, destination customs authorities, and State Bank of Pakistan bank clearances.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#006747] hover:bg-[#005238] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>

        {/* Document Switcher Tabs */}
        <div className="flex gap-2 pt-4 border-t border-slate-100 mt-4 overflow-x-auto scrollbar-none">
          {[
            { id: 'commercial_invoice', label: 'Commercial Invoice' },
            { id: 'packing_list', label: 'Packing List' },
            { id: 'form_e_guide', label: 'SBP Form E / EIF Checklist' },
            { id: 'certificate_of_origin', label: 'Certificate of Origin Guide' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDocType(tab.id as DocumentType)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeDocType === tab.id
                  ? 'bg-[#006747] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Document Content View */}
      {activeDocType === 'commercial_invoice' && (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left: Input Form Controls */}
          <div className="lg:col-span-5 space-y-4 print:hidden">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
              <h2 className="font-bold text-sm text-slate-900 border-b pb-3 flex items-center justify-between">
                <span>Invoice Parameters</span>
                <span className="text-xs text-slate-400 font-mono">WeBOC Compatible</span>
              </h2>

              {/* Exporter Section */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">Exporter (Pakistan)</label>
                <input
                  type="text"
                  value={invoiceData.exporterName}
                  onChange={(e) => setInvoiceData({ ...invoiceData, exporterName: e.target.value })}
                  placeholder="Exporter Business Name"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006747]"
                />
                <input
                  type="text"
                  value={invoiceData.exporterNtnStrn}
                  onChange={(e) => setInvoiceData({ ...invoiceData, exporterNtnStrn: e.target.value })}
                  placeholder="NTN & STRN Number"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006747]"
                />
              </div>

              {/* Importer Section */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">Buyer / Importer (Destination)</label>
                <input
                  type="text"
                  value={invoiceData.importerName}
                  onChange={(e) => setInvoiceData({ ...invoiceData, importerName: e.target.value })}
                  placeholder="Buyer Business Name"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006747]"
                />
                <input
                  type="text"
                  value={invoiceData.importerAddress}
                  onChange={(e) => setInvoiceData({ ...invoiceData, importerAddress: e.target.value })}
                  placeholder="Buyer Address & Country"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006747]"
                />
              </div>

              {/* Trade Details */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice No</label>
                  <input
                    type="text"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                    className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Form E Number</label>
                  <input
                    type="text"
                    value={invoiceData.formENumber}
                    onChange={(e) => setInvoiceData({ ...invoiceData, formENumber: e.target.value })}
                    className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Incoterm</label>
                  <select
                    value={invoiceData.incoterm}
                    onChange={(e) => setInvoiceData({ ...invoiceData, incoterm: e.target.value as any })}
                    className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                  >
                    <option value="DAP">DAP (Delivered at Place)</option>
                    <option value="FOB">FOB (Free on Board)</option>
                    <option value="DDP">DDP (Delivered Duty Paid)</option>
                    <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Currency</label>
                  <select
                    value={invoiceData.currency}
                    onChange={(e) => setInvoiceData({ ...invoiceData, currency: e.target.value as Currency })}
                    className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="PKR">PKR (Rs.)</option>
                  </select>
                </div>
              </div>

              {/* Items Management */}
              <div className="space-y-3 pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800">Line Items</span>
                  <button
                    onClick={handleAddItem}
                    className="text-[11px] text-[#006747] font-bold flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Item</span>
                  </button>
                </div>

                {invoiceData.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between gap-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        placeholder="Item Description"
                        className="w-full bg-white border px-2 py-1 rounded"
                      />
                      {invoiceData.items.length > 1 && (
                        <button onClick={() => handleRemoveItem(idx)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={item.hsCode}
                        onChange={(e) => handleItemChange(idx, 'hsCode', e.target.value)}
                        placeholder="HS Code"
                        className="bg-white border px-2 py-1 rounded"
                      />
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        placeholder="Qty"
                        className="bg-white border px-2 py-1 rounded"
                      />
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                        placeholder="Price"
                        className="bg-white border px-2 py-1 rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Printable Invoice Document Sheet */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-300 shadow-lg p-8 text-slate-900 font-sans print:col-span-12 print:shadow-none print:border-none print:p-0">
            {/* Invoice Document Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-[#006747] text-white flex items-center justify-center font-bold">
                    <Ship className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-extrabold uppercase tracking-tight text-[#006747]">
                    Commercial Invoice
                  </h2>
                </div>
                <p className="text-xs text-slate-500 font-bold mt-1">INVOICE NO: {invoiceData.invoiceNumber}</p>
              </div>

              <div className="text-right text-xs space-y-0.5">
                <p className="font-bold text-slate-900">DATE: {invoiceData.invoiceDate}</p>
                <p className="text-slate-600 font-mono">FORM E #: {invoiceData.formENumber}</p>
                <p className="text-emerald-800 font-semibold">{invoiceData.countryOfOrigin}</p>
              </div>
            </div>

            {/* Exporter vs Importer Grid */}
            <div className="grid grid-cols-2 gap-6 text-xs mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <h4 className="font-extrabold text-[#006747] uppercase border-b border-slate-200 pb-1 mb-2">
                  EXPORTER / SHIPPER (PAKISTAN)
                </h4>
                <p className="font-bold text-slate-900">{invoiceData.exporterName}</p>
                <p className="text-slate-600 leading-relaxed mt-0.5">{invoiceData.exporterAddress}</p>
                <p className="font-mono text-[11px] text-slate-800 mt-1">{invoiceData.exporterNtnStrn}</p>
                <p className="text-slate-500 mt-0.5">WeBOC ID: {invoiceData.webocId}</p>
              </div>

              <div>
                <h4 className="font-extrabold text-[#006747] uppercase border-b border-slate-200 pb-1 mb-2">
                  BUYER / CONSIGNEE (IMPORTER)
                </h4>
                <p className="font-bold text-slate-900">{invoiceData.importerName}</p>
                <p className="text-slate-600 leading-relaxed mt-0.5">{invoiceData.importerAddress}</p>
                <p className="font-mono text-[11px] text-slate-800 mt-1">Tax/EORI ID: {invoiceData.importerTaxId}</p>
                <p className="text-slate-500 mt-0.5">Destination: {invoiceData.importerCountry}</p>
              </div>
            </div>

            {/* Logistics Particulars */}
            <div className="grid grid-cols-3 gap-2 text-[11px] mb-6 p-3 bg-emerald-50/50 rounded-lg border border-emerald-200/80">
              <div>
                <span className="text-slate-500 block">Incoterm:</span>
                <strong className="text-slate-900 font-bold">{invoiceData.incoterm}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Mode of Transport:</span>
                <strong className="text-slate-900 font-bold">{invoiceData.modeOfTransport}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Port of Loading:</span>
                <strong className="text-slate-900 font-bold">{invoiceData.portOfLoading}</strong>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full text-left text-xs mb-6 border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                  <th className="p-2.5">Item Description & Material</th>
                  <th className="p-2.5">HS Code</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-right">Unit Price ({invoiceData.currency})</th>
                  <th className="p-2.5 text-right">Total ({invoiceData.currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 border-b border-slate-200">
                {invoiceData.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-medium text-slate-900">
                      {item.description}
                      <span className="block text-[10px] text-slate-500 font-normal">{item.material}</span>
                    </td>
                    <td className="p-2.5 font-mono text-[#006747] font-bold">{item.hsCode}</td>
                    <td className="p-2.5 text-center font-semibold">{item.quantity}</td>
                    <td className="p-2.5 text-right">{item.unitPrice.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-bold">{item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Section */}
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-1 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-semibold">{subtotal.toFixed(2)} {invoiceData.currency}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Estimated Shipping Freight:</span>
                  <span className="font-semibold">{invoiceData.shippingCharges.toFixed(2)} {invoiceData.currency}</span>
                </div>
                <div className="flex justify-between py-2 text-sm font-extrabold text-[#006747] border-b-2 border-slate-900">
                  <span>Grand Total ({invoiceData.incoterm}):</span>
                  <span>{grandTotal.toFixed(2)} {invoiceData.currency}</span>
                </div>
              </div>
            </div>

            {/* Declaration & Signature Footer */}
            <div className="border-t border-slate-200 pt-6 text-[10px] text-slate-600 space-y-4">
              <p className="italic">
                <strong>Exporter Declaration:</strong> We hereby certify that this commercial invoice shows the actual price of the goods described, that no other invoice has been issued, and that all particulars are true and correct. Country of Origin: Pakistan.
              </p>

              <div className="flex justify-between items-end pt-6">
                <div>
                  <p className="font-bold text-slate-900">Bank IBAN: {invoiceData.ibanNumber}</p>
                  <p className="text-slate-500">{invoiceData.bankName}</p>
                </div>

                <div className="text-center w-48 border-t border-slate-400 pt-1">
                  <p className="font-bold text-slate-900">Authorized Exporter Signature</p>
                  <p className="text-slate-500">{invoiceData.exporterName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SBP Form E Clearance Guide Tab */}
      {activeDocType === 'form_e_guide' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#006747] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{STATE_BANK_FORM_E_GUIDE.title}</h2>
              <p className="text-xs text-slate-500">State Bank of Pakistan (SBP) & Foreign Exchange Regulations</p>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {STATE_BANK_FORM_E_GUIDE.overview}
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {STATE_BANK_FORM_E_GUIDE.keySteps.map((s, i) => (
              <div key={i} className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <h3 className="font-bold text-xs text-[#006747]">{s.step}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs text-amber-900">
            <strong>Personal Gift & Low-Value Exemption:</strong> {STATE_BANK_FORM_E_GUIDE.exemptionNotes}
          </div>
        </div>
      )}

      {/* Certificate of Origin Guide Tab */}
      {activeDocType === 'certificate_of_origin' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3">Certificate of Origin (TDAP & Chamber Guide)</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            To claim 0% or reduced customs duties in destination countries under <strong>EU GSP+</strong>, <strong>UK DCTS</strong>, or <strong>UAE CEPA</strong>, Pakistani exporters must present an official Certificate of Origin.
          </p>
          <ul className="list-disc ml-5 text-xs text-slate-700 space-y-2">
            <li><strong>Chamber of Commerce Origin:</strong> Issued by Karachi, Lahore, Sialkot, Faisalabad, or Islamabad Chamber of Commerce.</li>
            <li><strong>TDAP Origin Statement:</strong> Registered Exporter (REX) system declaration for EU GSP+ preference.</li>
            <li><strong>"Made in Pakistan" Labeling:</strong> Must be physically stitched, printed, or engraved on retail products.</li>
          </ul>
        </div>
      )}

      {/* Packing List Tab */}
      {activeDocType === 'packing_list' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 text-center text-slate-500 py-12">
          <FileText className="w-10 h-10 mx-auto text-[#006747] mb-2" />
          <h3 className="text-sm font-bold text-slate-800">Export Packing List Generator</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Fill in box dimensions, net weight (kg), and gross weight (kg) to generate an export packing sheet for airline cargo and courier clearance.
          </p>
        </div>
      )}
    </div>
  );
};
