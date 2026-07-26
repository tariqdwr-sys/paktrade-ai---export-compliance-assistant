import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ChatAssistant } from './components/ChatAssistant';
import { DutyCalculator } from './components/DutyCalculator';
import { HSCodeFinder } from './components/HSCodeFinder';
import { DocumentGenerator } from './components/DocumentGenerator';
import { RestrictedItemsChecker } from './components/RestrictedItemsChecker';
import { TradePresets } from './components/TradePresets';
import { Footer } from './components/Footer';
import { Currency, ExportPreset, HSCodeItem, ShipmentDetails } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('assistant');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('PKR');

  const [activeShipmentDetails, setActiveShipmentDetails] = useState<ShipmentDetails | undefined>({
    productDescription: 'Handmade Leather Peshawari Chappals',
    material: 'Cowhide Leather with Rubber Sole',
    destinationCountry: 'United Kingdom',
    declaredValue: 150000,
    currency: 'PKR',
    shipmentType: 'commercial',
  });

  const [activeHSCodeItem, setActiveHSCodeItem] = useState<HSCodeItem | undefined>();

  const handleNavigateToDocs = (shipmentData?: ShipmentDetails) => {
    if (shipmentData) {
      setActiveShipmentDetails(shipmentData);
    }
    setActiveTab('documents');
  };

  const handleNavigateToCalculator = (shipmentData?: ShipmentDetails) => {
    if (shipmentData) {
      setActiveShipmentDetails(shipmentData);
    }
    setActiveTab('calculator');
  };

  const handleSelectHSCodeForChat = (hsItem: HSCodeItem) => {
    setActiveHSCodeItem(hsItem);
    setActiveShipmentDetails({
      productDescription: hsItem.productName,
      material: hsItem.description,
      destinationCountry: hsItem.popularDestinations[0] || 'United Kingdom',
      declaredValue: 200000,
      currency: 'PKR',
      shipmentType: 'commercial',
    });
    setActiveTab('assistant');
  };

  const handleNavigateToDocsWithHS = (hsItem: HSCodeItem) => {
    setActiveHSCodeItem(hsItem);
    setActiveTab('documents');
  };

  const handleSelectPreset = (preset: ExportPreset) => {
    setActiveShipmentDetails({
      productDescription: preset.product,
      material: preset.material,
      destinationCountry: preset.destination,
      declaredValue: preset.declaredValuePkr,
      currency: 'PKR',
      shipmentType: preset.shipmentType,
    });
    setActiveTab('assistant');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col justify-between selection:bg-emerald-100 selection:text-[#006747]">
      <div>
        {/* Navigation Navbar Header */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
        />

        {/* Dynamic Tab Views */}
        <main className="transition-all duration-200">
          {activeTab === 'assistant' && (
            <ChatAssistant
              selectedCurrency={selectedCurrency}
              onNavigateToDocs={handleNavigateToDocs}
              onNavigateToCalculator={handleNavigateToCalculator}
            />
          )}

          {activeTab === 'calculator' && (
            <DutyCalculator
              selectedCurrency={selectedCurrency}
              initialShipmentDetails={activeShipmentDetails}
              onNavigateToDocs={handleNavigateToDocs}
            />
          )}

          {activeTab === 'hscode' && (
            <HSCodeFinder
              onSelectHSCodeForChat={handleSelectHSCodeForChat}
              onNavigateToDocsWithHS={handleNavigateToDocsWithHS}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentGenerator
              initialShipmentDetails={activeShipmentDetails}
              initialHSCodeItem={activeHSCodeItem}
            />
          )}

          {activeTab === 'restricted' && <RestrictedItemsChecker />}

          {activeTab === 'presets' && <TradePresets onSelectPreset={handleSelectPreset} />}
        </main>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
