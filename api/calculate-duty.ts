import {
  DESTINATION_COUNTRIES,
  EXCHANGE_RATES,
  STATE_BANK_FORM_E_GUIDE,
} from '../src/data/tradeData.js';
import { Currency, DutyCalculationResult } from '../src/types.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { category, destination, value, currency, shipmentType } = req.body || {};

    const inputCurrency: Currency = currency || 'PKR';
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

    const result: DutyCalculationResult = {
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
      formEGuidance: isCommercial ? STATE_BANK_FORM_E_GUIDE.overview : 'Personal shipment under $5,000 USD via express courier bypasses formal SBP Form E bank lock.',
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error('Duty calculation error:', error);
    return res.status(500).json({ error: 'Failed to calculate customs duty' });
  }
}
