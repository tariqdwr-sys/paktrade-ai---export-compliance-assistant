# PakTrade AI 🇵🇰✈️🌍
### Expert Cross-Border Trade & Customs Compliance Assistant for Pakistani Exporters

**Live Deployment URL:** [https://paktrade-ai-export-compliance-assis-eight.vercel.app/](https://paktrade-ai-export-compliance-assis-eight.vercel.app/)

---

## 🌟 Overview

**PakTrade AI** is an intelligent, full-stack Cross-Border Trade & Customs Compliance Assistant engineered specifically for Pakistani exporters, business owners, artisans, SMEs, and individuals shipping products internationally from Pakistan to major global markets (including the **United States, United Kingdom, European Union, United Arab Emirates, Canada, Australia, and Saudi Arabia**).

Exporting from Pakistan involves navigating complex regulatory hurdles — from State Bank of Pakistan (SBP) foreign exchange regulations and WeBOC Form E/EIF bank clearances to international tariffs, destination VAT/GST rules, and biosecurity regulations. **PakTrade AI** simplifies trade legalities into clear, actionable step-by-step roadmaps.

---

## 🚀 Key Features

### 1. 🤖 AI Cross-Border Assistant (Powered by Gemini 3.6 Flash)
* **Natural Language Queries:** Ask PakTrade AI about any product, material, or destination country in plain English or Urdu/Pakistani trade terms.
* **Smart Parameter Extraction:** Auto-extracts product description, fabric/material composition, destination country, declared value (PKR or foreign currency), and commercial vs. personal shipment status.
* **Instant Export Roadmaps:** Generates customized step-by-step export roadmaps highlighting classification codes, estimated destination duties, mandatory documents, and State Bank of Pakistan compliance rules.

### 2. 🧮 Destination Customs Duty & VAT Calculator
* **Landed Cost Breakdown:** Calculates estimated import duties, destination VAT/GST (e.g., UK 20% VAT, EU 20% VAT, UAE 5% VAT), and total tax liabilities in both PKR and destination currency.
* **De Minimis Exemption Checking:** Automatically flags whether a parcel falls below local tax-free de minimis thresholds (e.g., US $800 Section 321 exemption, UK £135 threshold, Australia AUD $1,000 exemption).
* **Trade Agreement Preferences:** Highlights active tariff preference schemes for Pakistani origin goods (e.g., **UK DCTS**, **EU GSP+ 0% duty**, **UAE CEPA**).

### 3. 🔍 Harmonized System (HS) Code Finder
* **Searchable Directory:** Browse and search 6-digit international HS classification codes for top Pakistani export categories (Apparel & Denim, Bed Linen, Leather Footwear & Peshawari Chappals, Surgical Instruments, Sports Goods, Super Kernel Basmati Rice, Pink Himalayan Salt, and IT Services).
* **Compliance Pre-checks:** View typical tariff rates, required TDAP/Chamber certificates of origin, and destination labeling/testing requirements for each product category.

### 4. 📄 Automated Export Document Builder
* **WeBOC & SBP Compliant Commercial Invoices:** Generate print-ready and downloadable PDF-formatted Commercial Invoices pre-filled with Exporter NTN/STRN, WeBOC ID, Form E / EIF number, Incoterms (DAP, FOB, DDP, CIF), bank IBAN, and line items.
* **SBP Form E / EIF Clearance Checklist:** Clear guidance on State Bank of Pakistan rules for commercial exports exceeding $5,000 USD via authorized dealer banks in Pakistan.
* **Certificates of Origin & Packing Lists:** Detailed instructions on obtaining Chamber of Commerce certificates and TDAP REX system declarations.

### 5. 🛡️ Prohibited & Restricted Items Directory
* **Regulatory Compliance Rules:** Search restricted export categories under Pakistan's Export Policy Order, CITES wildlife protection (animal leather declarations), US FDA food/medical facility registrations, and ISPM-15 heat-treated wood packaging standards.
* **Actionable Steps:** Step-by-step instructions on securing NOCs, phytosanitary certificates, and laboratory test reports.

### 6. ⚡ 1-Click Popular Export Scenarios
* Test and inspect pre-configured commercial export batches (e.g., *Leather Peshawari Chappals to London UK*, *Cotton Bed Sheets to Texas USA*, *Surgical Scissors to Hamburg Germany*, *Basmati Rice to Dubai UAE*).

---

## 🏛️ International Tariff & Trade Frameworks Covered

| Destination Market | Tariff Framework / Trade Agreement | De Minimis Exemption | Standard VAT / GST |
| :--- | :--- | :--- | :--- |
| **United States** 🇺🇸 | US GSP & Section 301 Tariff Schedules | $800 USD | State sales tax |
| **United Kingdom** 🇬🇧 | UK Developing Countries Trading Scheme (DCTS) | £135 GBP | 20% UK VAT |
| **European Union** 🇪🇺 | EU GSP+ Status (0% Duty on Textiles & Leather) | €150 EUR | 19% – 22% Import VAT |
| **United Arab Emirates** 🇦🇪 | Pakistan-UAE CEPA Agreement | AED 300 | 5% UAE VAT |
| **Canada** 🇨🇦 | General Preferential Tariff (GPT) | CAD $20 (Courier $150) | 5% GST + PST/HST |
| **Australia** 🇦🇺 | ABF MFN Tariff Structure | AUD $1,000 | 10% GST |

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion (Framer Motion)
* **Backend:** Express.js (Node.js runtime)
* **AI Engine:** `@google/genai` (Gemini 3.6 Flash model) with server-side proxying for key security
* **Bundler & Build Tool:** Vite, `esbuild`, `tsx`
* **Deployment:** Hosted on Cloud Run / Vercel container platform

---

## 📁 Project Structure

```
├── .env.example              # Environment variables template
├── metadata.json             # Applet metadata & permissions
├── package.json              # NPM dependencies & scripts
├── server.ts                 # Express backend server with Gemini API integration
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
└── src/
    ├── main.tsx              # React entry point
    ├── App.tsx               # Main application layout & tab controller
    ├── index.css             # Tailwind CSS imports
    ├── types.ts              # TypeScript interfaces & types
    ├── data/
    │   └── tradeData.ts      # Exchange rates, HS code directory, countries & restricted items
    └── components/
        ├── Navbar.tsx        # Navigation header & currency switcher
        ├── ChatAssistant.tsx # PakTrade AI conversational interface
        ├── DutyCalculator.tsx# Landed cost & customs duty estimator
        ├── HSCodeFinder.tsx  # Searchable HS code directory
        ├── DocumentGenerator.tsx # Commercial Invoice & Form E document builder
        ├── RestrictedItemsChecker.tsx # Prohibited & restricted items search
        ├── TradePresets.tsx  # 1-click popular shipment scenarios
        └── Footer.tsx        # Footer with official SBP, WeBOC, & TDAP links
```

---

## 💻 Local Development Setup

### Prerequisites
* **Node.js**: v18 or higher
* **npm**: v9 or higher
* **Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/)

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/paktrade-ai.git
   cd paktrade-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (based on `.env.example`):
   ```env
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
   PORT=3000
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

5. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

---

## 📜 Disclaimer

*PakTrade AI provides duty calculations, tariff rates, and compliance guidance for estimation and informational purposes based on published customs schedules and State Bank of Pakistan regulations. Official duty determinations and clearances are conducted by destination customs authorities and State Bank of Pakistan authorized dealer banks.*

---

## 🤝 Contact & Support

* **App Website:** [https://paktrade-ai-export-compliance-assis-eight.vercel.app/](https://paktrade-ai-export-compliance-assis-eight.vercel.app/)
* **Platform:** Built with Google AI Studio & Gemini AI.
