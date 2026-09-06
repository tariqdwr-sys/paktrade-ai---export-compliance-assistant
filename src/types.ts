export type Currency = 'PKR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'CAD' | 'AUD';

export type ShipmentType = 'commercial' | 'personal';

export interface ShipmentDetails {
  productDescription: string;
  material: string;
  destinationCountry: string;
  declaredValue: number;
  currency: Currency;
  shipmentType: ShipmentType;
  quantity?: number;
  weightKg?: number;
}

export interface StructuredComplianceData {
  hsCode: string;
  hsDescription: string;
  estimatedDutyPercent: number;
  estimatedVatPercent: number;
  dutyPkr: number;
  dutyLocal: number;
  vatPkr: number;
  vatLocal: number;
  destinationCurrency: string;
  localCurrencySymbol: string;
  exchangeRateToPkr: number;
  requiredDocuments: string[];
  formEType: string;
  restrictedItemsNote?: string;
  tradeAgreementPreference?: string;
  roadmapSteps: {
    title: string;
    description: string;
    type: 'pakistan_exit' | 'transit_carrier' | 'destination_clearance' | 'documentation';
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  extractedDetails?: ShipmentDetails;
  complianceData?: StructuredComplianceData;
}

export interface DutyCalculationResult {
  productCategory: string;
  originCountry: string;
  destinationCountry: string;
  declaredValueInput: number;
  inputCurrency: Currency;
  declaredValuePkr: number;
  declaredValueLocal: number;
  destinationCurrency: string;
  exchangeRatePkrToLocal: number;
  hsCode: string;
  dutyRatePercent: number;
  dutyAmountLocal: number;
  dutyAmountPkr: number;
  vatRatePercent: number;
  vatAmountLocal: number;
  vatAmountPkr: number;
  totalTaxLocal: number;
  totalTaxPkr: number;
  totalLandingsPkr: number;
  deMinimisThresholdLocal: number;
  fitsDeMinimis: boolean;
  deMinimisNote: string;
  tradeAgreementPreference: string;
  requiredDocs: string[];
  formEGuidance: string;
}

export interface HSCodeItem {
  hsCode: string;
  chapter: string;
  chapterName: string;
  productName: string;
  description: string;
  typicalDutyRate: string;
  typicalVatRate: string;
  pakistanExportDocs: string[];
  specialRequirements: string;
  popularDestinations: string[];
}

export type DocumentType = 'commercial_invoice' | 'packing_list' | 'certificate_of_origin' | 'form_e_guide';

export interface CommercialInvoiceData {
  exporterName: string;
  exporterAddress: string;
  exporterNtnStrn: string;
  exporterPhone: string;
  webocId: string;
  importerName: string;
  importerAddress: string;
  importerCountry: string;
  importerTaxId: string;
  invoiceNumber: string;
  invoiceDate: string;
  formENumber: string;
  incoterm: 'FOB' | 'DDP' | 'DAP' | 'CIF' | 'CFR';
  modeOfTransport: 'Air Freight' | 'Sea Freight' | 'Express Courier (DHL/FedEx/UPS)';
  portOfLoading: string;
  portOfDischarge: string;
  currency: Currency;
  items: {
    description: string;
    hsCode: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    material: string;
  }[];
  shippingCharges: number;
  countryOfOrigin: string;
  bankName: string;
  ibanNumber: string;
}

export interface RestrictedItem {
  id: string;
  productName: string;
  category: string;
  destinationCountry: string;
  status: 'forbidden' | 'restricted' | 'special_permit';
  authority: string;
  ruleExplanation: string;
  requiredPermits: string[];
  actionableSteps: string[];
}

export interface ExportPreset {
  id: string;
  title: string;
  product: string;
  material: string;
  destination: string;
  declaredValuePkr: number;
  shipmentType: ShipmentType;
  hsCode: string;
  iconName: string;
  tagline: string;
}
