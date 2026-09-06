import type { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI } from '@google/genai';
import {
  DESTINATION_COUNTRIES,
  EXCHANGE_RATES,
  CURRENCY_SYMBOLS,
} from '../src/data/tradeData.js';

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

function generateFallbackTradeResponse(userMsg: string, details?: any): string {
  const query = (userMsg || '').toLowerCase();

  let destination = 'United Kingdom';
  if (query.includes('usa') || query.includes('us') || query.includes('united states') || query.includes('america')) destination = 'United States';
  else if (query.includes('uk') || query.includes('england') || query.includes('london') || query.includes('britain')) destination = 'United Kingdom';
  else if (query.includes('eu') || query.includes('europe') || query.includes('germany') || query.includes('france')) destination = 'European Union (EU)';
  else if (query.includes('uae') || query.includes('dubai') || query.includes('emirates')) destination = 'United Arab Emirates';
  else if (query.includes('canada') || query.includes('toronto')) destination = 'Canada';
  else if (query.includes('australia') || query.includes('sydney')) destination = 'Australia';

  const destProfile = DESTINATION_COUNTRIES[destination] || DESTINATION_COUNTRIES['United Kingdom'];

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

  const valueDestCurrency = (valuePkr / EXCHANGE_RATES[destProfile.currency]).toFixed(2);
  const symbol = CURRENCY_SYMBOLS[destProfile.currency];

  return `### **Export Compliance Roadmap: Pakistan to ${destProfile.name}**

Assalam-o-Alaikum! **PakTrade AI** has prepared your customs & compliance breakdown for **${product}** bound for **${destProfile.name}**.

---

#### **1. Product Classification & HS Code**
* **HS Code:** \`${hsCode}\` (${product})
* **Trade Scheme:** ${destProfile.tradeAgreementWithPakistan}
* **Estimated Duty Rate:** 0% – 8% (Subject to Origin Certification)

---

#### **2. Estimated Taxes & Valuation (${destProfile.name})**
* **Declared Export Value:** **Rs. ${valuePkr.toLocaleString()} PKR** (approx. **${symbol}${valueDestCurrency} ${destProfile.currency}**)
* **De Minimis Threshold:** ${destProfile.deMinimisNote}
* **Standard Import VAT/GST:** **${destProfile.standardVatPercent}%**
* **Estimated Total Tax Payable:** ~**${symbol}${(Number(valueDestCurrency) * (destProfile.standardVatPercent / 100)).toFixed(2)} ${destProfile.currency}**

---

#### **3. Required Export Documentation Checklist**
* **Commercial Invoice:** Must state *"Made in Pakistan"*, exact fiber/material breakdown, HS code \`${hsCode}\`, and unit values.
* **Packing List:** Detailed piece count, net/gross weights (kg), and package dimensions.
* **Pakistan Customs Form E / EIF:** Mandatory Electronic Import Form registered in **WeBOC** via your bank for commercial shipments.
* **Certificate of Origin:** Issued by your local Chamber of Commerce or TDAP to claim reduced duty benefits under **${destProfile.tradeAgreementWithPakistan}**.

---

#### **4. Crucial Compliance Pro-Tips**
* ${destProfile.specialRules[0] || 'Ensure clean labeling and accurate weight declarations.'}
* ${destProfile.specialRules[1] || 'State Bank of Pakistan requires repatriation of foreign proceeds within 120 days.'}

*Need an automated Commercial Invoice for this shipment? Click the **Document Builder** tab above to generate one instantly!*`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, conversationHistory, extractedDetails } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

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

        const responseText = response.text || 'Thank you for consulting PakTrade AI. Let us help you with your export documentation and customs compliance.';
        return res.status(200).json({ text: responseText });
      } catch (geminiError: any) {
        console.error('Gemini error, using fallback compliance generator:', geminiError?.message || geminiError);
      }
    }

    const fallbackText = generateFallbackTradeResponse(message, extractedDetails);
    return res.status(200).json({ text: fallbackText });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({ error: 'Internal server error processing chat request.' });
  }
}
