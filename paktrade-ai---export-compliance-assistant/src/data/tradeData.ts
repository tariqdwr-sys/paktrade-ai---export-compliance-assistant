import { Currency, ExportPreset, HSCodeItem, RestrictedItem } from '../types';

export const EXCHANGE_RATES: Record<Currency, number> = {
  PKR: 1,
  USD: 278.5,
  GBP: 358.2,
  EUR: 302.1,
  AED: 75.8,
  CAD: 202.4,
  AUD: 181.6,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  PKR: 'Rs.',
  USD: '$',
  GBP: '£',
  EUR: '€',
  AED: 'AED ',
  CAD: 'CA$',
  AUD: 'A$',
};

export interface CountryTradeProfile {
  code: string;
  name: string;
  currency: Currency;
  deMinimisValueLocal: number;
  deMinimisNote: string;
  standardVatPercent: number;
  tradeAgreementWithPakistan: string;
  specialRules: string[];
  requiredDocs: string[];
  customsAuthorityName: string;
}

export const DESTINATION_COUNTRIES: Record<string, CountryTradeProfile> = {
  'United States': {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    deMinimisValueLocal: 800,
    deMinimisNote: 'Shipments valued under $800 USD enter duty-free and tax-free under Section 321 de minimis exemption.',
    standardVatPercent: 0, // State sales taxes apply locally upon sale
    tradeAgreementWithPakistan: 'US GSP (Generalized System of Preferences - selectively active) & MFN Tariffs.',
    specialRules: [
      'FDA prior notice registration required for all foodstuffs, dried fruits, rice, and medical instruments.',
      'Textile products require clear fiber content labeling and country of origin "Made in Pakistan".',
      'ISPM-15 certified heat-treated wooden crates/pallets required for sea freight.'
    ],
    requiredDocs: [
      'Commercial Invoice with HTS 10-digit code',
      'Packing List',
      'Bill of Lading / Airway Bill (AWB)',
      'Pakistan Customs Form E / EIF clearance via WeBOC',
      'FDA Registration Number (For Food/Medical items)'
    ],
    customsAuthorityName: 'US Customs and Border Protection (CBP)'
  },
  'United Kingdom': {
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    deMinimisValueLocal: 135,
    deMinimisNote: 'Duty-free threshold is £135 GBP. UK VAT (20%) applies on all commercial goods regardless of value.',
    standardVatPercent: 20,
    tradeAgreementWithPakistan: 'UK Developing Countries Trading Scheme (DCTS) - Grants zero or reduced tariff on 92%+ of Pakistani export goods.',
    specialRules: [
      'For B2C sales under £135, seller/marketplace must collect UK VAT at point of sale or register for UK HMRC VAT.',
      'Surgical instruments require UKCA / CE marking compliance.',
      'UK Customs EORI number mandatory for commercial UK importers.'
    ],
    requiredDocs: [
      'Commercial Invoice specifying UK DCTS origin status',
      'Certificate of Origin (Form A or TDAP Origin Statement)',
      'Packing List',
      'Pakistan Customs Form E via WeBOC',
      'UK EORI statement on invoice'
    ],
    customsAuthorityName: 'HM Revenue & Customs (HMRC)'
  },
  'European Union (EU)': {
    code: 'EU',
    name: 'European Union (EU)',
    currency: 'EUR',
    deMinimisValueLocal: 150,
    deMinimisNote: 'Duty-free for goods valued up to €150 EUR. EU Import VAT (19% - 22% depending on country) applies on all imports.',
    standardVatPercent: 20,
    tradeAgreementWithPakistan: 'GSP+ Status (Generalized Scheme of Preferences Plus) - 0% duty on textiles, garments, leather, and surgical goods.',
    specialRules: [
      'GSP+ Benefit: Provide Rex system declaration or Chamber Certificate of Origin to claim 0% import duty.',
      'REACH compliance required for chemical dyes in leather and textiles.',
      'Import One-Stop Shop (IOSS) available for e-commerce shipments under €150.'
    ],
    requiredDocs: [
      'Commercial Invoice with GSP+ Origin Declaration statement',
      'Certificate of Origin (TDAP / Chamber of Commerce)',
      'Packing List',
      'WeBOC Form E Electronic Import Form',
      'EUR.1 Movement Certificate (where applicable)'
    ],
    customsAuthorityName: 'European Union Customs & Taxation Directorate'
  },
  'United Arab Emirates': {
    code: 'AE',
    name: 'United Arab Emirates',
    currency: 'AED',
    deMinimisValueLocal: 300,
    deMinimisNote: 'Duty-free threshold is AED 300 (~$81 USD). Standard 5% GCC Customs Duty + 5% UAE VAT apply above threshold.',
    standardVatPercent: 5,
    tradeAgreementWithPakistan: 'Pakistan-UAE CEPA (Comprehensive Economic Partnership Agreement - ongoing duty cuts).',
    specialRules: [
      'MOIAT (Ministry of Industry & Advanced Technology) document legalization required for high-value commercial shipments.',
      'Halal Certification mandatory for meat, processed food, and cosmetics.',
      'Textiles and carpets enjoy fast-track air clearance at Dubai Cargo Village.'
    ],
    requiredDocs: [
      'Commercial Invoice attested by Chamber of Commerce / UAE Embassy (for >AED 10,000)',
      'Certificate of Origin from Pakistan Chamber of Commerce',
      'Packing List',
      'Form E / EIF clearance certificate',
      'Halal Certificate (For food/beverages)'
    ],
    customsAuthorityName: 'Dubai Customs & Federal Customs Authority'
  },
  'Canada': {
    code: 'CA',
    name: 'Canada',
    currency: 'CAD',
    deMinimisValueLocal: 20,
    deMinimisNote: 'Duty-free and tax-free threshold is CAD $20 for postal parcels, CAD $150 for courier express goods.',
    standardVatPercent: 5, // Federal GST 5% + Provincial PST/HST (5% - 15%)
    tradeAgreementWithPakistan: 'Canada General Preferential Tariff (GPT) scheme for developing nations.',
    specialRules: [
      'Canadian Food Inspection Agency (CFIA) approval needed for rice, mangoes, and agri-products.',
      'Bilingual labeling (English & French) recommended for commercial retail products.'
    ],
    requiredDocs: [
      'Canada Customs Invoice (CCI) or detailed Commercial Invoice',
      'Packing List',
      'Airway Bill / Ocean Bill of Lading',
      'Form E via WeBOC'
    ],
    customsAuthorityName: 'Canada Border Services Agency (CBSA)'
  },
  'Australia': {
    code: 'AU',
    name: 'Australia',
    currency: 'AUD',
    deMinimisValueLocal: 1000,
    deMinimisNote: 'Duty-free and GST-free threshold is AUD $1,000. 10% Australian GST applies above threshold.',
    standardVatPercent: 10,
    tradeAgreementWithPakistan: 'MFN Tariff structure with special bilateral trade trade facilitation.',
    specialRules: [
      'Strict Australian Biosecurity (Department of Agriculture, Fisheries and Forestry - DAFF). Wood packaging, untreated leather, and food strictly inspected.',
      'Himalayan Pink Salt and spices require clean phytosanitary certification.'
    ],
    requiredDocs: [
      'Commercial Invoice',
      'Packing List',
      'Form E clearance',
      'Biosecurity Declaration & Phytosanitary Certificate (for organic/agri/wood goods)'
    ],
    customsAuthorityName: 'Australian Border Force (ABF)'
  },
  'Saudi Arabia': {
    code: 'SA',
    name: 'Saudi Arabia',
    currency: 'AED', // Using AED/SAR regional tier
    deMinimisValueLocal: 1000,
    deMinimisNote: 'Standard 5% GCC duty + 15% Saudi VAT apply on commercial goods.',
    standardVatPercent: 15,
    tradeAgreementWithPakistan: 'OIC Bilateral Preferential Trade Agreements.',
    specialRules: [
      'SABER Platform Registration required for non-food consumer products.',
      'SFDA (Saudi Food & Drug Authority) clearance for medical, surgical, and food items.',
      'Barcodes mandatory on all retail packages.'
    ],
    requiredDocs: [
      'Commercial Invoice attested',
      'SABER Certificate of Conformity',
      'Certificate of Origin',
      'Form E clearance'
    ],
    customsAuthorityName: 'Zakat, Tax and Customs Authority (ZATCA)'
  }
};

export const POPULAR_HS_CODES: HSCodeItem[] = [
  {
    hsCode: '6203.42',
    chapter: '62',
    chapterName: 'Articles of Apparel & Clothing Accessories',
    productName: 'Men\'s or Boys\' Cotton Trousers / Denim Jeans',
    description: 'Cotton denim pants, trousers, overalls, and shorts woven from 100% cotton or cotton blends.',
    typicalDutyRate: '0% (EU GSP+ / UK DCTS) | 16.6% (US MFN)',
    typicalVatRate: '19% - 20% (EU/UK) | 0% (US)',
    pakistanExportDocs: ['Commercial Invoice', 'Packing List', 'Form E via WeBOC', 'Texprocil Origin Certificate'],
    specialRequirements: 'Fiber content percentage label + Care instructions required.',
    popularDestinations: ['United States', 'European Union (EU)', 'United Kingdom', 'Canada']
  },
  {
    hsCode: '6302.21',
    chapter: '63',
    chapterName: 'Made-Up Textile Articles & Bed Linen',
    productName: 'Bed Linen of Printed Cotton / Bed Sheets & Pillowcases',
    description: 'Woven bed sheets, pillow covers, duvet covers made of printed cotton or percale fabric.',
    typicalDutyRate: '0% (EU GSP+ / UK DCTS) | 6.5% - 12% (US)',
    typicalVatRate: '20% (UK/EU)',
    pakistanExportDocs: ['Commercial Invoice', 'Packing List', 'Form E', 'TDAP Origin Certificate'],
    specialRequirements: 'OEKO-TEX certification preferred by European buyers.',
    popularDestinations: ['United States', 'United Kingdom', 'European Union (EU)', 'Australia']
  },
  {
    hsCode: '6403.99',
    chapter: '64',
    chapterName: 'Footwear with Outer Soles & Leather Uppers',
    productName: 'Handmade Leather Peshawari Chappals & Leather Shoes',
    description: 'Traditional Pakistani handcrafted leather footwear, sandals, boots, and dress shoes with leather or rubber soles.',
    typicalDutyRate: '0% (EU GSP+) | 4% - 8% (UK DCTS) | 8.5% (US)',
    typicalVatRate: '20% (UK) | 19% (EU)',
    pakistanExportDocs: ['Commercial Invoice ("Handmade in Pakistan")', 'Packing List', 'Form E', 'Chamber Certificate of Origin'],
    specialRequirements: 'Animal leather origin declaration (Cow/Goat/Buffalo). Avoid wild/endangered species to prevent CITES hold.',
    popularDestinations: ['United Kingdom', 'United Arab Emirates', 'Saudi Arabia', 'United States', 'Canada']
  },
  {
    hsCode: '4203.10',
    chapter: '42',
    chapterName: 'Articles of Leather & Saddlery',
    productName: 'Leather Jackets, Coats & Apparel',
    description: 'Genuine leather motorcycling jackets, casual leather coats, and sheep/cowhide garments.',
    typicalDutyRate: '0% (EU GSP+ / UK DCTS) | 6% (US)',
    typicalVatRate: '20% (UK/EU) | 5% (UAE)',
    pakistanExportDocs: ['Commercial Invoice', 'Packing List', 'Form E', 'PLGMEA Certificate'],
    specialRequirements: 'REACH chemical dye safety declaration for European buyers.',
    popularDestinations: ['Germany', 'United Kingdom', 'United States', 'France', 'Australia']
  },
  {
    hsCode: '9018.90',
    chapter: '90',
    chapterName: 'Medical & Surgical Instruments',
    productName: 'Stainless Steel Surgical Scissors, Forceps & Scalpels',
    description: 'Precision medical, surgical, dental, and veterinary stainless steel hand instruments manufactured in Sialkot.',
    typicalDutyRate: '0% (US/EU/UK under medical duty exemption frameworks)',
    typicalVatRate: 'Reduced rates in EU/UK for medical devices',
    pakistanExportDocs: ['Commercial Invoice', 'Packing List', 'Form E via WeBOC', 'SIMAP Certificate of Origin'],
    specialRequirements: 'US FDA 510(k) or Device Listing + EU CE Mark / Medical Device Regulation (MDR) compliance.',
    popularDestinations: ['United States', 'European Union (EU)', 'United Kingdom', 'Japan']
  },
  {
    hsCode: '9506.62',
    chapter: '95',
    chapterName: 'Sports Equipment & Inflatables',
    productName: 'Inflatable Soccer Balls / Footballs & Sports Gloves',
    description: 'Hand-stitched and thermo-bonded professional match soccer balls, goalkeeper gloves, and martial arts wear.',
    typicalDutyRate: '0% (EU GSP+ / UK DCTS) | 4.8% (US)',
    typicalVatRate: '20% (UK/EU)',
    pakistanExportDocs: ['Commercial Invoice', 'Packing List', 'Form E', 'Sialkot Chamber Certificate'],
    specialRequirements: 'FIFA quality spec declaration for official match balls.',
    popularDestinations: ['United States', 'Germany', 'United Kingdom', 'France', 'Brazil']
  },
  {
    hsCode: '1006.30',
    chapter: '10',
    chapterName: 'Cereals & Grains',
    productName: 'Super Kernel Basmati Rice (Milled & Polished)',
    description: 'Aromatic long-grain Pakistani Super Kernel Basmati rice packed in PP bags or retail cloth pouches.',
    typicalDutyRate: 'Specific duty per metric ton or GSP quota rates',
    typicalVatRate: '0% - 5% (Food reduced rates in UK/EU)',
    pakistanExportDocs: ['Commercial Invoice', 'Packing List', 'Form E via WeBOC', 'Phytosanitary Certificate (DPPO)', 'REAP Certificate'],
    specialRequirements: 'DNA Purity test for Basmati authenticity + Aflatoxin pesticide test report.',
    popularDestinations: ['United Arab Emirates', 'United Kingdom', 'European Union (EU)', 'Saudi Arabia', 'Australia']
  },
  {
    hsCode: '2501.00',
    chapter: '25',
    chapterName: 'Salt, Sulphur & Mineral Products',
    productName: 'Himalayan Pink Rock Salt Lamps & Culinary Salt',
    description: 'Natural rock salt mined from Khewra Salt Mines, handcrafted lamps, bath salt blocks, and edible fine salt.',
    typicalDutyRate: '0% - 3.5%',
    typicalVatRate: 'Standard VAT',
    pakistanExportDocs: ['Commercial Invoice', 'Packing List', 'Form E', 'PCSIR Food Grade Lab Certificate (if edible)'],
    specialRequirements: 'Mandatory "Packed in Pakistan" label. US FDA facility registration for edible salt.',
    popularDestinations: ['United States', 'Canada', 'United Kingdom', 'Germany', 'Australia']
  },
  {
    hsCode: '9888.00',
    chapter: '98',
    chapterName: 'Services & IT Exports',
    productName: 'IT Services, Software Development & Digital Services',
    description: 'Export of software development, web design, mobile apps, and remote IT consulting services.',
    typicalDutyRate: '0% (Digital services duty exemption under WTO)',
    typicalVatRate: 'Reverse-charge VAT in buyer country',
    pakistanExportDocs: ['EIF Electronic Import/Export Form for Banking Remittance', 'PSEB Registration Certificate', 'Service Agreement / Invoice'],
    specialRequirements: 'State Bank of Pakistan PSEB 0% income tax credit compliance statement for inward remittance.',
    popularDestinations: ['United States', 'United Kingdom', 'United Arab Emirates', 'European Union (EU)', 'Canada']
  }
];

export const RESTRICTED_ITEMS: RestrictedItem[] = [
  {
    id: 'rest-1',
    productName: 'Leather & Wildlife Skins (Snake, Crocodile, Leopard)',
    category: 'Leather Goods',
    destinationCountry: 'All International Destinations',
    status: 'forbidden',
    authority: 'CITES (Convention on International Trade in Endangered Species) & Pakistan Wildlife Department',
    ruleExplanation: 'Export of products made from endangered wildlife species is strictly prohibited without CITES permits. Cow, goat, sheep, and buffalo leathers are permitted.',
    requiredPermits: ['CITES Non-Detriment Permit (if applicable)', 'Pakistan Forest & Wildlife Department Certificate'],
    actionableSteps: [
      'Ensure leather is strictly derived from domestic livestock (Cow, Goat, Sheep, Buffalo).',
      'Declare exact animal origin on Commercial Invoice (e.g. "100% Bovine Cowhide Leather").'
    ]
  },
  {
    id: 'rest-2',
    productName: 'Foodstuffs, Dry Fruits, Mangoes & Spices to USA',
    category: 'Food & Agriculture',
    destinationCountry: 'United States',
    status: 'special_permit',
    authority: 'US FDA (Food and Drug Administration) & USDA APHIS',
    ruleExplanation: 'All food and agricultural products entering the US require FDA Food Facility Registration and Prior Notice submitted before arrival.',
    requiredPermits: ['US FDA Food Facility Registration', 'FDA Prior Notice Confirmation Number', 'Department of Plant Protection Phytosanitary Certificate'],
    actionableSteps: [
      'Register your business facility on US FDA Industry Systems portal.',
      'File FDA Prior Notice 24 hours prior to flight/shipment arrival.'
    ]
  },
  {
    id: 'rest-3',
    productName: 'Untreated Wooden Packaging & Pallets',
    category: 'Logistics & Crates',
    destinationCountry: 'US, UK, EU, Australia, Canada',
    status: 'restricted',
    authority: 'IPPC (International Plant Protection Convention) ISPM-15',
    ruleExplanation: 'Raw wooden crates, pallets, and dunnage must be heat-treated or fumigated and stamped with the ISPM-15 official mark to prevent pest transmission.',
    requiredPermits: ['ISPM-15 Heat Treatment Certificate', 'Fumigation Certificate'],
    actionableSteps: [
      'Use ISPM-15 certified wooden box suppliers or switch to cardboard/plastic pallets.',
      'Ensure the wheat-and-ear ISPM-15 stamp is visible on both sides of wooden crates.'
    ]
  },
  {
    id: 'rest-4',
    productName: 'Unprocessed Raw Pink Salt in Bulk Bags (>10kg)',
    category: 'Minerals',
    destinationCountry: 'Global',
    status: 'restricted',
    authority: 'Pakistan Mineral Development Corporation & TDAP Export Policy Order',
    ruleExplanation: 'Pakistan restricts the export of raw unbranded Himalayan pink salt blocks in bulk to encourage local value-added processing and packaging.',
    requiredPermits: ['Value-Addition Compliance Certificate', 'PCSIR Quality Test Certificate'],
    actionableSteps: [
      'Export pink salt in retail-ready consumer packaging (jars, pouches, retail boxes) or handcrafted lamps.',
      'Ensure "Product of Pakistan" branding is printed on retail packaging.'
    ]
  },
  {
    id: 'rest-5',
    productName: 'Antique Rugs & Historical Heritage Artifacts (>100 Years Old)',
    category: 'Handicrafts & Antiques',
    destinationCountry: 'All Destinations',
    status: 'forbidden',
    authority: 'Pakistan Department of Archaeology and Museums',
    ruleExplanation: 'National cultural heritage items and artifacts older than 100 years cannot be exported without explicit Antiquities Act exemption permits.',
    requiredPermits: ['NOC from Department of Archaeology and Museums Pakistan'],
    actionableSteps: [
      'Export newly hand-knotted or vintage rugs under 100 years with weaver invoice.',
      'Obtain an Exemption Certificate from the Regional Archaeology Department for vintage crafts.'
    ]
  }
];

export const EXPORT_PRESETS: ExportPreset[] = [
  {
    id: 'preset-1',
    title: 'Leather Peshawari Chappals to UK',
    product: 'Handmade Leather Peshawari Sandals & Chappals',
    material: 'Genuine Cowhide Leather with Rubber Sole',
    destination: 'United Kingdom',
    declaredValuePkr: 150000,
    shipmentType: 'commercial',
    hsCode: '6403.99',
    iconName: 'Footwear',
    tagline: '50 Pairs Commercial Batch to London Online Store'
  },
  {
    id: 'preset-2',
    title: 'Cotton Bed Sheets to USA',
    product: '300 Thread Count Printed Cotton Bed Sets & Pillow Covers',
    material: '100% Woven Cotton Percale',
    destination: 'United States',
    declaredValuePkr: 450000,
    shipmentType: 'commercial',
    hsCode: '6302.21',
    iconName: 'Bed',
    tagline: '100 Sets Air Cargo to Warehouse in Texas'
  },
  {
    id: 'preset-3',
    title: 'Surgical Scissors to Germany (EU)',
    product: 'Stainless Steel Mayo Surgical Operating Scissors',
    material: 'AISI 410 Surgical Stainless Steel',
    destination: 'European Union (EU)',
    declaredValuePkr: 850000,
    shipmentType: 'commercial',
    hsCode: '9018.90',
    iconName: 'Scissors',
    tagline: '200 Units Direct B2B to Hospital Supplier in Hamburg'
  },
  {
    id: 'preset-4',
    title: 'Super Kernel Basmati Rice to Dubai UAE',
    product: 'Aromatic Aged Super Kernel Basmati Rice (5kg Pouches)',
    material: 'Milled & Polished Long Grain Rice',
    destination: 'United Arab Emirates',
    declaredValuePkr: 300000,
    shipmentType: 'commercial',
    hsCode: '1006.30',
    iconName: 'Wheat',
    tagline: '500kg Sample Commercial Shipment to Supermarket'
  },
  {
    id: 'preset-5',
    title: 'Personal Gift Parcel to Canada',
    product: 'Embroidered Lawn Suits & Handcrafted Onyx Salt Lamp',
    material: 'Cotton Fabric & Pink Rock Salt',
    destination: 'Canada',
    declaredValuePkr: 35000,
    shipmentType: 'personal',
    hsCode: '6204.22',
    iconName: 'Gift',
    tagline: 'Personal Gift Courier Parcel to Toronto'
  }
];

export const STATE_BANK_FORM_E_GUIDE = {
  title: 'Pakistan Customs Form E / EIF Clearance Guide',
  overview: 'Under State Bank of Pakistan (SBP) Foreign Exchange Regulations, every commercial export from Pakistan exceeding $5,000 USD (or equivalent) MUST be backed by an Electronic Import/Export Form (EIF / Form E) generated through the WeBOC (Web Based One Customs) system.',
  keySteps: [
    {
      step: '1. WeBOC User Account',
      detail: 'Register your business on www.weboc.gov.pk using your Sales Tax Registration Number (STRN), National Tax Number (NTN), and active Chamber of Commerce membership.'
    },
    {
      step: '2. Bank EIF Approval',
      detail: 'Request your authorized dealer bank in Pakistan to issue an Electronic Form E against your Commercial Invoice and buyer Purchase Order.'
    },
    {
      step: '3. Customs Declaration Filing',
      detail: 'File the Single Administrative Document / Goods Declaration (GD) in WeBOC attaching the Form E number, Airway Bill/Bill of Lading, and Commercial Invoice.'
    },
    {
      step: '4. Foreign Exchange Repatriation',
      detail: 'State Bank requires export proceeds to be realized in Pakistan within 120 days from shipping date through legal banking channels.'
    }
  ],
  exemptionNotes: 'Personal gift parcels valued under $5,000 USD via courier companies (DHL, FedEx, UPS) or non-commercial samples generally follow simplified Courier Customs Clearance without requiring formal Form E banking holds.'
};
