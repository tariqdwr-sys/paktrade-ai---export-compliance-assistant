// Next.js App Router Route Handler (app/api/calculate-duty/route.ts)
// Also compatible with NextRequest / NextResponse if you prefer:
// import { NextRequest, NextResponse } from 'next/server';

const DESTINATION_COUNTRIES: Record<
  string,
  {
    name: string;
    currency: string;
    standardVatPercent: number;
    deMinimisValueLocal: number;
    deMinimisNote: string;
    tradeAgreementWithPakistan: string;
    requiredDocs: string[];
    specialRules: string[];
  }
> = {
  'United States': {
    name: 'United States',
    currency: 'USD',
    standardVatPercent: 0,
    deMinimisValueLocal: 800,
    deMinimisNote: 'US Section 321 de minimis allows duty-free entry up to $800 USD/day for non-commercial/courier parcels.',
    tradeAgreementWithPakistan: 'US GSP & Normal Trade Relations (MFN)',
    requiredDocs: ['Commercial Invoice (3 copies)', 'Packing List', 'Air Waybill (AWB)', 'US FDA Prior Notice (for food/medical)'],
    specialRules: ['TSCA declaration required for certain chemical goods', 'Lacey Act declaration for timber/plant products'],
  },
  'United Kingdom': {
    name: 'United Kingdom',
    currency: 'GBP',
    standardVatPercent: 20,
    deMinimisValueLocal: 135,
    deMinimisNote: 'Parcels under £135 GBP are exempt from customs duty, but 20% UK VAT is levied at import or point-of-sale.',
    tradeAgreementWithPakistan: 'UK Developing Countries Trading Scheme (DCTS) - Preferential duty rates for Pakistan.',
    requiredDocs: ['Commercial Invoice', 'Packing List', 'Certificate of Origin (Chamber of Commerce or TDAP)', 'EORI Number (for UK buyer)'],
    specialRules: ['Textile labeling must indicate fiber composition in English', 'Products made of leather require CITES non-endangered declaration if exotic'],
  },
  'European Union (EU)': {
    name: 'European Union (EU)',
    currency: 'EUR',
    standardVatPercent: 20,
    deMinimisValueLocal: 150,
    deMinimisNote: 'Parcels up to €150 EUR are duty-free under EU customs, but subject to destination member-state VAT (19%-22%).',
    tradeAgreementWithPakistan: 'EU GSP+ (Generalized Scheme of Preferences Plus) - 0% duty on Pakistani textiles and apparel.',
    requiredDocs: ['Commercial Invoice with REX Statement of Origin', 'Packing List', 'Air Waybill', 'EU Importer EORI'],
    specialRules: ['REACH chemical compliance for dyes and textiles', 'CE marking required for surgical instruments'],
  },
  'United Arab Emirates': {
    name: 'United Arab Emirates',
    currency: 'AED',
    standardVatPercent: 5,
    deMinimisValueLocal: 300,
    deMinimisNote: 'Parcels under AED 300 are exempt from import customs duty.',
    tradeAgreementWithPakistan: 'Pakistan - UAE Comprehensive Economic Partnership Agreement (CEPA)',
    requiredDocs: ['Commercial Invoice attested by Chamber/MoFA', 'Packing List', 'Certificate of Origin', 'Delivery Order'],
    specialRules: ['Strict prohibition on narcotics and unapproved medicines', 'Food items require Halal and ESMA conformity certificate'],
  },
  'Canada': {
    name: 'Canada',
    currency: 'CAD',
    standardVatPercent: 13,
    deMinimisValueLocal: 20,
    deMinimisNote: 'Canada de minimis threshold is CAD $20 (or CAD $150 duty-free for courier imports, GST/HST still applies over $20).',
    tradeAgreementWithPakistan: 'General Preferential Tariff (GPT)',
    requiredDocs: ['Canada Customs Invoice (CCI) or Commercial Invoice', 'Packing List', 'Cargo Control Document'],
    specialRules: ['Bilingual labeling (English/French) recommended for retail packaging', 'CFIA inspection for agricultural goods'],
  },
  'Australia': {
    name: 'Australia',
    currency: 'AUD',
    standardVatPercent: 10,
    deMinimisValueLocal: 1000,
    deMinimisNote: 'Consignments valued at AUD $1,000 or less enter duty-free and GST-free unless vendor collects GST under modern rules.',
    tradeAgreementWithPakistan: 'Most Favoured Nation (MFN) Tariff Treatment',
    requiredDocs: ['Commercial Invoice', 'Packing List', 'BICON Biosecurity Clearance Declaration'],
    specialRules: ['Extremely strict Department of Agriculture (DAFF) quarantine on untreated timber, straw, and seeds', 'Raw wood requires ISPM-15 heat treatment cert'],
  },
};

const EXCHANGE_RATES: Record<string, number> = {
  PKR: 1,
  USD: 278.5,
  GBP: 354.2,
  EUR: 302.8,
  AED: 75.8,
  CAD: 204.6,
  AUD: 182.4,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, destination, value, currency, shipmentType } = body || {};

    const inputCurrency: string = currency || 'PKR';
    const inputVal = Number(value) || 0;
    const destName = destination || 'United Kingdom';
    const isCommercial = shipmentType !== 'personal';

    const destProfile = DESTINATION_COUNTRIES[destName] || DESTINATION_COUNTRIES['United Kingdom'];
    const rateToPkr = EXCHANGE_RATES[inputCurrency] || 1;
    const valuePkr = inputVal * rateToPkr;

    const ratePkrToDest = EXCHANGE_RATES[destProfile.currency] || 1;
    const valueDestLocal = valuePkr / ratePkrToDest;

    // Estimate duty rate based on category & destination
    let dutyRate = 6.0;
    let vatRate = destProfile.standardVatPercent;
    let hsCode = '6403.99';

    if (category?.toLowerCase().includes('textile') || category?.toLowerCase().includes('clothing')) {
      hsCode = '6203.42';
      dutyRate = destName.includes('EU') || destName.includes('Kingdom') ? 0 : 12; // GSP+ / DCTS 0%
    } else if (category?.toLowerCase().includes('footwear') || category?.toLowerCase().includes('leather')) {
      hsCode = '6403.99';
      dutyRate = destName.includes('EU') ? 0 : 5;
    } else if (category?.toLowerCase().includes('surgical') || category?.toLowerCase().includes('medical')) {
      hsCode = '9018.90';
      dutyRate = 0; // Medical exemption
    } else if (category?.toLowerCase().includes('sports')) {
      hsCode = '9506.62';
      dutyRate = 0;
    } else if (category?.toLowerCase().includes('rice') || category?.toLowerCase().includes('food')) {
      hsCode = '1006.30';
      dutyRate = 2.5;
    }

    const fitsDeMinimis = valueDestLocal <= destProfile.deMinimisValueLocal;
    const dutyAmountLocal = fitsDeMinimis && !isCommercial ? 0 : (valueDestLocal * (dutyRate / 100));
    const dutyAmountPkr = dutyAmountLocal * ratePkrToDest;

    // VAT calculation base (Value + Duty)
    const vatBase = valueDestLocal + dutyAmountLocal;
    const vatAmountLocal = (vatBase * (vatRate / 100));
    const vatAmountPkr = vatAmountLocal * ratePkrToDest;

    const totalTaxLocal = dutyAmountLocal + vatAmountLocal;
    const totalTaxPkr = dutyAmountPkr + vatAmountPkr;

    const result = {
      productCategory: category || 'General Merchandise',
      originCountry: 'Pakistan',
      destinationCountry: destName,
      declaredValueInput: inputVal,
      inputCurrency,
      declaredValuePkr: Math.round(valuePkr),
      declaredValueLocal: Number(valueDestLocal.toFixed(2)),
      destinationCurrency: destProfile.currency,
      exchangeRatePkrToLocal: ratePkrToDest,
      hsCode,
      dutyRatePercent: dutyRate,
      dutyAmountLocal: Number(dutyAmountLocal.toFixed(2)),
      dutyAmountPkr: Math.round(dutyAmountPkr),
      vatRatePercent: vatRate,
      vatAmountLocal: Number(vatAmountLocal.toFixed(2)),
      vatAmountPkr: Math.round(vatAmountPkr),
      totalTaxLocal: Number(totalTaxLocal.toFixed(2)),
      totalTaxPkr: Math.round(totalTaxPkr),
      totalLandingsPkr: Math.round(valuePkr + totalTaxPkr),
      deMinimisThresholdLocal: destProfile.deMinimisValueLocal,
      fitsDeMinimis,
      deMinimisNote: destProfile.deMinimisNote,
      tradeAgreementPreference: destProfile.tradeAgreementWithPakistan,
      requiredDocs: destProfile.requiredDocs,
      formEGuidance: isCommercial
        ? 'Under State Bank of Pakistan (SBP) Foreign Exchange Manual Chapter 12, commercial shipments exceeding $5,000 USD require Form E (EIF) bank clearance in WeBOC.'
        : 'Personal shipment under $5,000 USD via express courier bypasses formal SBP Form E bank lock.',
    };

    return Response.json(result);
  } catch (error) {
    console.error('Duty calculation error:', error);
    return Response.json({ error: 'Failed to calculate customs duty' }, { status: 500 });
  }
}
