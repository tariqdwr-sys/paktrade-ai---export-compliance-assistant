# Next.js API Routes for PakTrade AI

This folder contains the complete, drop-in backend API routes for Next.js and Vercel deployments:

1. **AI Chat Assistant with Gemini:**
   - File: `app/api/chat/route.ts`
   - Handles `/api/chat` POST requests with `@google/genai` (Gemini 3.6 Flash) integration and an intelligent fallback compliance engine.

2. **Customs Duty & VAT Calculation Engine:**
   - File: `app/api/calculate-duty/route.ts`
   - Handles `/api/calculate-duty` POST requests with real-time landed costs, currency conversions (PKR, USD, GBP, EUR, AED, CAD, AUD), UK DCTS / EU GSP+ tariff preferences, destination VAT/GST, US Section 321 de minimis thresholds, and State Bank of Pakistan (SBP) Form E regulations.

### How to use in Next.js (App Router):
1. Copy `app/api/chat/route.ts` into your Next.js project at `app/api/chat/route.ts`.
2. Copy `app/api/calculate-duty/route.ts` into your Next.js project at `app/api/calculate-duty/route.ts`.
3. Install the Gemini SDK in your Next.js project:
   ```bash
   npm install @google/genai
   ```
4. Set your environment variable in Vercel Dashboard:
   - Go to **Vercel Project** -> **Settings** -> **Environment Variables**
   - Add `GEMINI_API_KEY` with your Google AI Studio API key.
   - Redeploy or trigger a new build.
