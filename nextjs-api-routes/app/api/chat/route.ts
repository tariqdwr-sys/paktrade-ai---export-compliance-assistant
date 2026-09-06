// Next.js App Router Route Handler (app/api/chat/route.ts)
// Also compatible with NextRequest / NextResponse if you prefer:
// import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// System prompt for PakTrade AI
const PAKTRADE_AI_SYSTEM_INSTRUCTION = `You are PakTrade AI, an expert Cross-Border Trade & Customs Compliance Assistant built into an international shipping and export platform for Pakistani businesses and individuals.

Primary Purpose: Help Pakistani exporters, business owners, and individuals seamlessly ship products from Pakistan to international destinations (such as the US, UK, EU, UAE, Canada, Australia, KSA, etc.).

Your Primary Responsibilities:
1. Customs & Duty Guidance: Explain duty rates, HS (Harmonized System) codes, required import/export documents, and restricted/forbidden items for specific destination countries in clear, simple steps.
2. Tax & Compliance Calculation: Estimate potential customs duties, VAT/GST, and local tax requirements based on product value, item category, and destination country.
3. Automated Document Generation Guidance: Help users understand what forms they need (e.g., Commercial Invoice, Packing List, Certificate of Origin, Form E / EIF clearance via WeBOC for Pakistan Customs / State Bank of Pakistan, Shipping Labels).
4. Plain Language Explanations: Break down complex trade legalities and customs rules into easy-to-understand actionable steps.

Operational Rules & Tone:
- Tone: Professional, encouraging, clear, and highly practical.
- Structure: Always present steps using bold key headings, short bullet points, and clean visual layouts with Markdown.
- Currency & Units: Default to PKR for local export values and provide converted values in USD, EUR, GBP, or destination currency where relevant.
- Clarity First: Avoid heavy legalese. Explain the rule briefly and outline exact documents or steps needed to clear customs safely.

When a user asks for help with a shipment, ask or extract:
1. Product description & material
2. Destination country
3. Estimated declared value ($ or PKR)
4. Commercial or personal shipment status

Always provide a step-by-step export roadmap, required documentation list (including Form E / EIF guidance for WeBOC / SBP), and potential customs/tax considerations for their destination.`;

const DESTINATION_PROFILES: Record<string, { name: string; currency: string; vat: number; deMinimis: string; scheme: string }> = {
  'United States': { name: 'United States', currency: 'USD', vat: 0, deMinimis: '$800 USD (Section 321 exemption)', scheme: 'US Generalized System of Preferences (GSP)' },
  'United Kingdom': { name: 'United Kingdom', currency: 'GBP', vat: 20, deMinimis: '£135 GBP duty exemption', scheme: 'UK Developing Countries Trading Scheme (DCTS)' },
  'European Union (EU)': { name: 'European Union (EU)', currency: 'EUR', vat: 20, deMinimis: '€150 EUR duty exemption', scheme: 'EU GSP+ Status (0% Duty on Pakistani Textiles/Leather)' },
  'United Arab Emirates': { name: 'United Arab Emirates', currency: 'AED', vat: 5, deMinimis: 'AED 300 de minimis threshold', scheme: 'Pakistan - UAE Comprehensive Economic Partnership (CEPA)' },
  'Canada': { name: 'Canada', currency: 'CAD', vat: 13, deMinimis: 'CAD $20 standard / $150 courier exemption', scheme: 'General Preferential Tariff (GPT)' },
  'Australia': { name: 'Australia', currency: 'AUD', vat: 10, deMinimis: 'AUD $1,000 duty & GST exemption threshold', scheme: 'Most Favoured Nation (MFN) Tariff' },
};

function generateFallbackResponse(userMsg: string, details?: any): string {
  const query = (userMsg || '').toLowerCase();

  let destination = 'United Kingdom';
  if (query.includes('usa') || query.includes('us') || query.includes('united states') || query.includes('america')) destination = 'United States';
  else if (query.includes('uk') || query.includes('england') || query.includes('london') || query.includes('britain')) destination = 'United Kingdom';
  else if (query.includes('eu') || query.includes('europe') || query.includes('germany') || query.includes('france')) destination = 'European Union (EU)';
  else if (query.includes('uae') || query.includes('dubai') || query.includes('emirates')) destination = 'United Arab Emirates';
  else if (query.includes('canada') || query.includes('toronto')) destination = 'Canada';
  else if (query.includes('australia') || query.includes('sydney')) destination = 'Australia';

  const profile = DESTINATION_PROFILES[destination] || DESTINATION_PROFILES['United Kingdom'];

  let product = 'Textile & Leather Goods';
  let hsCode = '6403.99';
  if (query.includes('chappal') || query.includes('footwear') || query.includes('shoe') || query.includes('sandal')) {
    product = 'Leather Footwear / Peshawari Chappals';
    hsCode = '6403.99';
  } else if (query.includes('bed sheet') || query.includes('textile') || query.includes('towel') || query.includes('fabric')) {
    product = 'Cotton Bed Linen / Textiles';
    hsCode = '6302.21';
  } else if (query.includes('jacket') || query.includes('coat') || query.includes('leather apparel')) {
    product = 'Genuine Leather Garments';
    hsCode = '4203.10';
  } else if (query.includes('scissor') || query.includes('surgical') || query.includes('medical')) {
    product = 'Stainless Steel Surgical Instruments';
    hsCode = '9018.90';
  } else if (query.includes('rice') || query.includes('basmati')) {
    product = 'Super Kernel Basmati Rice';
    hsCode = '1006.30';
  } else if (query.includes('salt') || query.includes('pink salt')) {
    product = 'Himalayan Pink Rock Salt';
    hsCode = '2501.00';
  }

  let valuePkr = 150000;
  if (details && details.declaredValue) {
    valuePkr = details.currency === 'USD' ? details.declaredValue * 278.5 : details.declaredValue;
  }

  return `### **Export Compliance Roadmap: Pakistan to ${profile.name}**

Assalam-o-Alaikum! **PakTrade AI** has prepared your customs & compliance breakdown for **${product}** bound for **${profile.name}**.

---

#### **1. Product Classification & HS Code**
* **HS Code:** \`${hsCode}\` (${product})
* **Trade Scheme:** ${profile.scheme}
* **Estimated Duty Rate:** 0% – 8% (Subject to Origin Certification)

---

#### **2. Estimated Taxes & Valuation (${profile.name})**
* **Declared Export Value:** **Rs. ${valuePkr.toLocaleString()} PKR**
* **De Minimis Threshold:** ${profile.deMinimis}
* **Standard Import VAT/GST:** **${profile.vat}%**

---

#### **3. Required Export Documentation Checklist**
* **Commercial Invoice:** Must state *"Made in Pakistan"*, exact fiber/material breakdown, HS code \`${hsCode}\`, and unit values.
* **Packing List:** Detailed piece count, net/gross weights (kg), and package dimensions.
* **Pakistan Customs Form E / EIF:** Mandatory Electronic Import Form registered in **WeBOC** via your bank for commercial shipments.
* **Certificate of Origin:** Issued by your local Chamber of Commerce or TDAP to claim reduced duty benefits under **${profile.scheme}**.

---

#### **4. Crucial Compliance Pro-Tips**
* Ensure clear physical *"Made in Pakistan"* labeling on all finished goods.
* State Bank of Pakistan requires repatriation of foreign exchange proceeds within 120 days of shipment date.

*Need an automated Commercial Invoice for this shipment? Click the **Document Builder** tab to generate one instantly!*`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, conversationHistory, extractedDetails } = body || {};

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const contents: any[] = [];
        if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
          for (const item of conversationHistory) {
            contents.push({
              role: item.sender === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }],
            });
          }
        }

        let currentPrompt = message;
        if (extractedDetails && extractedDetails.productDescription) {
          currentPrompt += `\n\n[Shipment Parameters: Product: "${extractedDetails.productDescription}", Material: "${extractedDetails.material || 'N/A'}", Destination: "${extractedDetails.destinationCountry || 'UK'}", Declared Value: ${extractedDetails.declaredValue || 100000} ${extractedDetails.currency || 'PKR'}, Type: "${extractedDetails.shipmentType || 'commercial'}"]`;
        }

        contents.push({
          role: 'user',
          parts: [{ text: currentPrompt }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents,
          config: {
            systemInstruction: PAKTRADE_AI_SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        const responseText = response.text || 'Thank you for consulting PakTrade AI.';
        return Response.json({ text: responseText });
      } catch (geminiErr: any) {
        console.error('Gemini error in Next.js route, using fallback:', geminiErr?.message || geminiErr);
      }
    }

    const fallbackText = generateFallbackResponse(message, extractedDetails);
    return Response.json({ text: fallbackText });
  } catch (error: any) {
    console.error('Chat route error:', error);
    return Response.json({ error: 'Internal server error processing chat request.' }, { status: 500 });
  }
}
