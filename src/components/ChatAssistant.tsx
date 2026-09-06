import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Package,
  Globe,
  DollarSign,
  FileText,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { ChatMessage, Currency, ShipmentDetails, ShipmentType } from '../types';
import { CURRENCY_SYMBOLS, DESTINATION_COUNTRIES, EXCHANGE_RATES } from '../data/tradeData';

interface ChatAssistantProps {
  selectedCurrency: Currency;
  onNavigateToDocs: (shipmentData?: ShipmentDetails) => void;
  onNavigateToCalculator: (shipmentData?: ShipmentDetails) => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  selectedCurrency,
  onNavigateToDocs,
  onNavigateToCalculator,
}) => {
  // Extraction parameters
  const [productDescription, setProductDescription] = useState('Handmade Leather Peshawari Chappals');
  const [material, setMaterial] = useState('Genuine Cowhide Leather with Rubber Sole');
  const [destinationCountry, setDestinationCountry] = useState('United Kingdom');
  const [declaredValue, setDeclaredValue] = useState<number>(150000);
  const [currency, setCurrency] = useState<Currency>('PKR');
  const [shipmentType, setShipmentType] = useState<ShipmentType>('commercial');

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Chat message history initialized with PakTrade AI welcoming prompt
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Assalam-o-Alaikum! **I am PakTrade AI**, your expert Cross-Border Trade & Customs Compliance Assistant.

I am built to help Pakistani exporters, artisans, SMEs, and individuals seamlessly ship products from Pakistan to international markets worldwide (including the **US, UK, EU, UAE, Canada, Australia, KSA, and more**).

To provide an accurate step-by-step export roadmap, tell me about your shipment or fill in the parameters on the left:
1. **Product description & material** (e.g. Cotton Bed Sheets, Leather Jackets, Surgical Scissors)
2. **Destination Country**
3. **Estimated Declared Value** (PKR or USD)
4. **Commercial or Personal status**

You can also click any sample scenario below to generate an instant customs clearance roadmap!`,
    },
  ]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Scroll ONLY the internal chat messages container, never the window or whole page
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = textToSend || inputMessage;
    if (!queryText.trim() || isLoading) return;

    const userMsgId = 'user-' + Date.now();
    const currentShipmentDetails: ShipmentDetails = {
      productDescription,
      material,
      destinationCountry,
      declaredValue,
      currency,
      shipmentType,
    };

    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        sender: 'user',
        text: queryText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        extractedDetails: currentShipmentDetails,
      },
    ];

    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          conversationHistory: newMessages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          extractedDetails: currentShipmentDetails,
        }),
      });

      const data = await response.json();
      const aiResponseText = data.text || 'PakTrade AI response received.';

      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          extractedDetails: currentShipmentDetails,
        },
      ]);
    } catch (err) {
      console.error('Failed to communicate with AI endpoint:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-err-' + Date.now(),
          sender: 'ai',
          text: `### **Export Compliance Summary**\n\n**PakTrade AI** has extracted your parameters for **${productDescription}** (${material}) to **${destinationCountry}**.\n\n* **Value:** Rs. ${declaredValue.toLocaleString()} PKR (${currency})\n* **Type:** ${shipmentType.toUpperCase()} Shipment\n\n*For detailed duty calculations and document generation, click the action buttons below.*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          extractedDetails: currentShipmentDetails,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPreset = (presetText: string, prod: string, mat: string, dest: string, val: number) => {
    setProductDescription(prod);
    setMaterial(mat);
    setDestinationCountry(dest);
    setDeclaredValue(val);
    setCurrency('PKR');

    handleSendMessage(presetText);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper renderer for AI formatted markdown text
  const renderFormattedMarkdown = (content: string) => {
    const lines = content.split('\n');

    return (
      <div className="space-y-2.5 text-slate-800 text-xs leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          // Heading 3
          if (line.startsWith('### ')) {
            return (
              <h3 key={idx} className="font-bold text-sm text-[#006747] border-b border-emerald-100 pb-1 mt-3">
                {line.replace('### ', '').replace(/\*\*/g, '')}
              </h3>
            );
          }

          // Heading 4
          if (line.startsWith('#### ')) {
            return (
              <h4 key={idx} className="font-bold text-xs text-slate-900 mt-2 flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-[#006747]" />
                {line.replace('#### ', '').replace(/\*\*/g, '')}
              </h4>
            );
          }

          // Horizontal rule
          if (line.startsWith('---')) {
            return <hr key={idx} className="border-slate-200 my-2" />;
          }

          // Bullet list items
          if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
            const cleanLine = line.trim().substring(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006747] mt-1.5 flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: formatBoldTags(cleanLine) }} />
              </div>
            );
          }

          // Pro-tip callout box
          if (line.toLowerCase().includes('pro-tip') || line.toLowerCase().includes('important note')) {
            return (
              <div key={idx} className="bg-amber-50 border-l-4 border-amber-500 p-2.5 rounded-r-lg text-slate-800 font-medium text-xs my-2">
                <span dangerouslySetInnerHTML={{ __html: formatBoldTags(line) }} />
              </div>
            );
          }

          return <p key={idx} dangerouslySetInnerHTML={{ __html: formatBoldTags(line) }} />;
        })}
      </div>
    );
  };

  function formatBoldTags(str: string): string {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="bg-emerald-50 text-[#006747] px-1 py-0.5 rounded font-mono text-[11px] border border-emerald-200">$1</code>');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Badge */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-[#004d34] to-[#006747] rounded-2xl p-6 text-white shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-900/60 border border-emerald-400/30 px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Cross-Border Compliance AI Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Pakistan Export Compliance Assistant
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
            Instant HS code classifications, duty & VAT estimates, SBP Form E clearance requirements, and destination customs regulations for exporters shipping worldwide.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15">
          <ShieldCheck className="w-8 h-8 text-emerald-300 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-white">WeBOC & SBP Compliant</p>
            <p className="text-emerald-200 text-[11px]">Updated 2026 Export Regulations</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Shipment Parameters Form & Quick Presets */}
        <div className="lg:col-span-4 space-y-6">
          {/* Shipment Parameters Box */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#006747] flex items-center justify-center font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Shipment Parameters</h3>
                  <p className="text-[11px] text-slate-500">Auto-inject into PakTrade AI inspection</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProductDescription('');
                  setMaterial('');
                  setDeclaredValue(0);
                }}
                className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Description & Name
                </label>
                <input
                  type="text"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="e.g. Cotton Bed Sheets, Peshawari Chappals"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006747] focus:bg-white text-slate-800"
                />
              </div>

              {/* Material */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fabric / Material / Specifications
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="e.g. 100% Woven Cotton, Cowhide Leather, Stainless Steel"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006747] focus:bg-white text-slate-800"
                />
              </div>

              {/* Destination Country */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination Country
                </label>
                <select
                  value={destinationCountry}
                  onChange={(e) => setDestinationCountry(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006747] focus:bg-white text-slate-800 font-medium cursor-pointer"
                >
                  {Object.keys(DESTINATION_COUNTRIES).map((c) => (
                    <option key={c} value={c}>
                      {c} ({DESTINATION_COUNTRIES[c].currency})
                    </option>
                  ))}
                </select>
              </div>

              {/* Declared Value & Currency */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-7">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Declared Value
                  </label>
                  <input
                    type="number"
                    value={declaredValue}
                    onChange={(e) => setDeclaredValue(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006747] focus:bg-white text-slate-800 font-semibold"
                  />
                </div>

                <div className="col-span-5">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="w-full text-xs px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006747] focus:bg-white text-slate-800 font-medium cursor-pointer"
                  >
                    <option value="PKR">PKR (Rs.)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              {/* Shipment Type (Commercial vs Personal) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Shipment Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShipmentType('commercial')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                      shipmentType === 'commercial'
                        ? 'bg-emerald-50 border-[#006747] text-[#006747]'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Commercial B2B/B2C
                  </button>

                  <button
                    type="button"
                    onClick={() => setShipmentType('personal')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                      shipmentType === 'personal'
                        ? 'bg-emerald-50 border-[#006747] text-[#006747]'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Personal Parcel
                  </button>
                </div>
              </div>

              {/* Submit / Inspect Button */}
              <button
                type="button"
                onClick={() =>
                  handleSendMessage(
                    `Please analyze shipment: ${productDescription} (${material}) to ${destinationCountry}. Declared Value: ${declaredValue} ${currency}. Type: ${shipmentType}.`
                  )
                }
                className="w-full mt-2 bg-[#006747] hover:bg-[#005238] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Run Compliance Inspection</span>
              </button>
            </div>
          </div>

          {/* Preset Prompts Box */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <h4 className="font-bold text-xs text-slate-800 mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#006747]" />
              <span>Sample Pakistani Export Scenarios</span>
            </h4>

            <div className="space-y-2">
              {[
                {
                  label: '50 Leather Peshawari Chappals to London UK',
                  prod: 'Handmade Leather Peshawari Chappals',
                  mat: 'Cowhide Leather with Rubber Sole',
                  dest: 'United Kingdom',
                  val: 150000,
                  query: 'I want to ship 50 handmade Cotton Peshawari Chappals to London UK. Total value is 150,000 PKR. This is a commercial shipment.',
                },
                {
                  label: '100 Cotton Bed Sheets to USA',
                  prod: '300 Thread Count Printed Cotton Bed Sheets',
                  mat: '100% Woven Cotton Percale',
                  dest: 'United States',
                  val: 450000,
                  query: 'Help me ship 100 sets of Cotton Bed Sheets to New York USA valued at 450,000 PKR for commercial sale.',
                },
                {
                  label: '200 Surgical Scissors to Hamburg Germany',
                  prod: 'Stainless Steel Surgical Operating Scissors',
                  mat: 'AISI 410 Surgical Grade Stainless Steel',
                  dest: 'European Union (EU)',
                  val: 850000,
                  query: 'I am exporting 200 Surgical Scissors to Hamburg Germany valued at 850,000 PKR. What EU MDR & Form E steps are needed?',
                },
                {
                  label: '500kg Super Kernel Basmati Rice to Dubai',
                  prod: 'Aromatic Super Kernel Basmati Rice (5kg Pouches)',
                  mat: 'Milled & Polished Long Grain Rice',
                  dest: 'United Arab Emirates',
                  val: 300000,
                  query: 'Commercial export of 500kg Super Kernel Basmati Rice to Dubai UAE valued at 300,000 PKR. What phytosanitary and UAE CEPA docs are required?',
                },
              ].map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    handleApplyPreset(preset.query, preset.prod, preset.mat, preset.dest, preset.val)
                  }
                  className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:border-emerald-300 bg-slate-50 hover:bg-emerald-50/40 text-xs transition-all group"
                >
                  <p className="font-semibold text-slate-800 group-hover:text-[#006747] flex items-center justify-between">
                    <span>{preset.label}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#006747] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Value: Rs. {preset.val.toLocaleString()} PKR</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Chat Interface */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden min-h-[640px] max-h-[780px] lg:h-[780px]">
          {/* Chat Header */}
          <div className="bg-slate-50/90 border-b border-slate-200/80 p-4 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#006747] flex items-center justify-center text-white shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-slate-900 text-sm">PakTrade AI</h2>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-[#006747] font-bold px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online Compliance
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Cross-Border Customs & SBP Form E Clearance Assistant</p>
              </div>
            </div>

            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'reset-' + Date.now(),
                    sender: 'ai',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    text: 'Chat history cleared. How can PakTrade AI assist your export shipment today?',
                  },
                ]);
                if (messagesContainerRef.current) {
                  messagesContainerRef.current.scrollTop = 0;
                }
              }}
              className="text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-200/60 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          </div>

          {/* Chat Messages Body */}
          <div ref={messagesContainerRef} className="flex-1 min-h-0 p-5 space-y-5 overflow-y-auto bg-slate-50/30">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[92%] ${isAi ? '' : 'ml-auto flex-row-reverse'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-xs ${
                      isAi ? 'bg-[#006747]' : 'bg-slate-700'
                    }`}
                  >
                    {isAi ? 'PT' : 'YOU'}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl p-4 shadow-2xs border ${
                      isAi
                        ? 'bg-white border-slate-200/90 text-slate-800 rounded-tl-xs'
                        : 'bg-[#006747] border-[#005238] text-white rounded-tr-xs'
                    }`}
                  >
                    {isAi ? (
                      <div>
                        {renderFormattedMarkdown(msg.text)}

                        {/* Quick Context Action Bar for AI message */}
                        {msg.id !== 'welcome-msg' && (
                          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                onClick={() =>
                                  onNavigateToDocs({
                                    productDescription,
                                    material,
                                    destinationCountry,
                                    declaredValue,
                                    currency,
                                    shipmentType,
                                  })
                                }
                                className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-[#006747] font-semibold px-2.5 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
                              >
                                <FileText className="w-3 h-3" />
                                <span>Generate Invoice</span>
                              </button>

                              <button
                                onClick={() =>
                                  onNavigateToCalculator({
                                    productDescription,
                                    material,
                                    destinationCountry,
                                    declaredValue,
                                    currency,
                                    shipmentType,
                                  })
                                }
                                className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors"
                              >
                                <DollarSign className="w-3 h-3" />
                                <span>Duty Calculator</span>
                              </button>
                            </div>

                            <button
                              onClick={() => copyToClipboard(msg.text, msg.id)}
                              className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 ml-auto"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-600">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    )}

                    <span className={`block text-[10px] mt-1.5 ${isAi ? 'text-slate-400' : 'text-emerald-100 text-right'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-[#006747] flex-shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                  PT
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-xs shadow-2xs flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#006747] animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-[#006747] animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-[#006747] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-slate-500 font-medium ml-1">Analyzing SBP Form E, Tariff Schedules & Customs rules...</span>
                </div>
              </div>
            )}

          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-white border-t border-slate-200/80 flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask PakTrade AI about HS codes, duty rates, Form E, or destination tariffs..."
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006747] focus:bg-white transition-all shadow-2xs"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="absolute right-2 p-2 bg-[#006747] text-white rounded-lg hover:bg-[#005238] disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              Estimates are provided for guidance based on State Bank of Pakistan & destination customs tariffs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
