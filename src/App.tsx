import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Home, 
  Briefcase, 
  Shield, 
  Zap, 
  Car, 
  Calculator, 
  FileText, 
  BookOpen, 
  BookMarked, 
  Crown,
  Search,
  Sparkles,
  ChevronRight,
  Download,
  Smartphone,
  Database,
  FileSpreadsheet,
  Receipt,
  HardHat
} from 'lucide-react';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { SubscriptionBanner } from './components/SubscriptionBanner';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AISentinelModal } from './components/AISentinelModal';
import { AISentinelToast } from './components/AISentinelToast';
import { PlayStoreExportModal } from './components/PlayStoreExportModal';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { SavedVaultModal } from './components/SavedVaultModal';

// Tabs
import { EmergencyTab } from './components/tabs/EmergencyTab';
import { LawDatabaseTab } from './components/tabs/LawDatabaseTab';
import { FormsGeneratorTab } from './components/tabs/FormsGeneratorTab';
import { HmrcFormsTab } from './components/tabs/HmrcFormsTab';
import { BuildingContractsTab } from './components/tabs/BuildingContractsTab';
import { LandlordTab } from './components/tabs/LandlordTab';
import { AccountsTab } from './components/tabs/AccountsTab';
import { NdaTab } from './components/tabs/NdaTab';
import { BillDisputesTab } from './components/tabs/BillDisputesTab';
import { FineDisputesTab } from './components/tabs/FineDisputesTab';
import { CalculatorsTab } from './components/tabs/CalculatorsTab';
import { NoticesTab } from './components/tabs/NoticesTab';
import { CodexTab } from './components/tabs/CodexTab';
import { JargonTab } from './components/tabs/JargonTab';
import { SubscriptionTab } from './components/tabs/SubscriptionTab';

export type TabKey = 
  | 'emergency' 
  | 'laws'
  | 'forms'
  | 'hmrc'
  | 'building'
  | 'landlord' 
  | 'accounts' 
  | 'nda' 
  | 'billdisputes' 
  | 'finedisputes' 
  | 'calculators' 
  | 'notices' 
  | 'codex' 
  | 'jargon'
  | 'subscription';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('laws');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isSentinelOpen, setIsSentinelOpen] = useState(false);
  const [isPlayStoreExportOpen, setIsPlayStoreExportOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [documentModal, setDocumentModal] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    content: string;
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    content: '',
  });

  const { subscription, isPro, isTrialExpired, openPaywall } = useSubscription();

  const handleOpenDocument = (title: string, subtitle: string, content: string) => {
    setDocumentModal({
      isOpen: true,
      title,
      subtitle,
      content,
    });
  };

  const navItems = [
    { key: 'laws' as TabKey, label: 'UK Laws Database', shortLabel: 'Law DB', icon: Database, badge: 'All Acts' },
    { key: 'hmrc' as TabKey, label: 'HMRC Forms Generator', shortLabel: 'HMRC Tax', icon: Receipt, badge: 'Tax & SA' },
    { key: 'building' as TabKey, label: 'Building Service Contracts', shortLabel: 'Building', icon: HardHat, badge: 'CRA/HGCRA' },
    { key: 'forms' as TabKey, label: 'Law Forms Generator', shortLabel: 'Forms', icon: FileSpreadsheet, badge: 'HMCTS' },
    { key: 'emergency' as TabKey, label: 'Police & Custody', shortLabel: 'Police', icon: ShieldAlert, badge: 'PACE' },
    { key: 'landlord' as TabKey, label: 'Landlord Suite', shortLabel: 'Landlord', icon: Home, badge: 's13/s8' },
    { key: 'accounts' as TabKey, label: 'Accounts & B2B', shortLabel: 'Accounts', icon: Briefcase, badge: 'Late Pay' },
    { key: 'nda' as TabKey, label: 'NDA Generator', shortLabel: 'NDA', icon: Shield, badge: 'UK Law' },
    { key: 'billdisputes' as TabKey, label: 'Bill Disputes', shortLabel: 'Bills', icon: Zap, badge: 'Ofgem' },
    { key: 'finedisputes' as TabKey, label: 'Fine Disputes', shortLabel: 'Fines', icon: Car, badge: 'PCN' },
    { key: 'calculators' as TabKey, label: 'Calculators', shortLabel: 'Calc', icon: Calculator, badge: 'ERA' },
    { key: 'notices' as TabKey, label: 'Pre-Action Notices', shortLabel: 'Notices', icon: FileText, badge: 'CPR' },
    { key: 'codex' as TabKey, label: '10-Domain Codex', shortLabel: 'Codex', icon: BookOpen, badge: '10 Areas' },
    { key: 'jargon' as TabKey, label: 'Jargon & Cases', shortLabel: 'Jargon', icon: BookMarked, badge: 'Latin' },
    { key: 'subscription' as TabKey, label: 'Membership (£2.99)', shortLabel: 'Pro', icon: Crown, badge: '7d Trial' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 pb-20 md:pb-6">
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSentinel={() => setIsSentinelOpen(true)}
        onOpenPlayStoreExport={() => setIsPlayStoreExportOpen(true)}
        onOpenVault={() => setIsVaultOpen(true)}
      />

      {/* Trial Countdown / Subscription Banner */}
      <SubscriptionBanner />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        {/* Desktop Primary Module Tabs Bar */}
        <div className="hidden md:flex border-b border-slate-800 text-xs font-semibold overflow-x-auto gap-1 pb-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`py-2 px-3 rounded-lg border transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive 
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/10' 
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                    isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Role & Need Jump Cards for Mobile / Small Screens */}
        <div className="md:hidden flex overflow-x-auto gap-2 pb-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 border cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{item.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Component */}
        <div className="min-h-[500px]">
          {activeTab === 'laws' && (
            <LawDatabaseTab 
              searchQuery={searchQuery} 
              onNavigateToTab={(tab) => setActiveTab(tab)} 
            />
          )}
          {activeTab === 'hmrc' && <HmrcFormsTab onOpenDocument={handleOpenDocument} />}
          {activeTab === 'building' && <BuildingContractsTab onOpenDocument={handleOpenDocument} />}
          {activeTab === 'forms' && (
            <FormsGeneratorTab 
              onOpenDocument={handleOpenDocument} 
              onNavigateToTab={(tab) => setActiveTab(tab)} 
            />
          )}
          {activeTab === 'emergency' && <EmergencyTab onOpenDocument={handleOpenDocument} />}
          {activeTab === 'landlord' && <LandlordTab onOpenDocument={handleOpenDocument} />}
          {activeTab === 'accounts' && <AccountsTab onOpenDocument={handleOpenDocument} />}
          {activeTab === 'nda' && <NdaTab onOpenDocument={handleOpenDocument} />}
          {activeTab === 'billdisputes' && <BillDisputesTab onOpenDocument={handleOpenDocument} />}
          {activeTab === 'finedisputes' && <FineDisputesTab onOpenDocument={handleOpenDocument} />}
          {activeTab === 'calculators' && <CalculatorsTab />}
          {activeTab === 'notices' && <NoticesTab onOpenDocument={handleOpenDocument} />}
          {activeTab === 'codex' && <CodexTab searchQuery={searchQuery} />}
          {activeTab === 'jargon' && <JargonTab searchQuery={searchQuery} />}
          {activeTab === 'subscription' && <SubscriptionTab />}
        </div>
      </main>

      {/* Mobile Hand-Held Bottom Navigation Bar (Thumb Friendly) */}
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur border-t border-slate-800 shadow-2xl flex items-center justify-around py-2 px-1">
        <button
          onClick={() => setActiveTab('laws')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition ${
            activeTab === 'laws' ? 'text-blue-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Database className="w-5 h-5" />
          <span className="text-[10px]">Laws DB</span>
        </button>

        <button
          onClick={() => setActiveTab('hmrc')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition ${
            activeTab === 'hmrc' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Receipt className="w-5 h-5" />
          <span className="text-[10px]">HMRC</span>
        </button>

        <button
          onClick={() => setActiveTab('forms')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition ${
            activeTab === 'forms' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <FileSpreadsheet className="w-5 h-5" />
          <span className="text-[10px]">Forms</span>
        </button>

        <button
          onClick={() => setActiveTab('emergency')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition ${
            activeTab === 'emergency' ? 'text-red-400 font-bold' : 'text-slate-400'
          }`}
        >
          <ShieldAlert className="w-5 h-5" />
          <span className="text-[10px]">Police</span>
        </button>

        <button
          onClick={() => setIsVaultOpen(true)}
          className="flex flex-col items-center gap-0.5 p-1 rounded-lg transition text-slate-400 hover:text-amber-400"
        >
          <Database className="w-5 h-5 text-amber-400" />
          <span className="text-[10px]">Vault</span>
        </button>

        <button
          onClick={() => setActiveTab('subscription')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition ${
            activeTab === 'subscription' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Crown className="w-5 h-5 text-amber-400" />
          <span className="text-[10px]">Pro (£2.99)</span>
        </button>
      </nav>

      {/* Real-time AI Sentinel Self-Healing Toast Notifications */}
      <AISentinelToast />

      {/* Global Modals */}
      <SubscriptionModal />
      <AISentinelModal isOpen={isSentinelOpen} onClose={() => setIsSentinelOpen(false)} />
      <PlayStoreExportModal isOpen={isPlayStoreExportOpen} onClose={() => setIsPlayStoreExportOpen(false)} />
      <SavedVaultModal 
        isOpen={isVaultOpen} 
        onClose={() => setIsVaultOpen(false)} 
        onOpenDocument={handleOpenDocument} 
      />
      <DocumentPreviewModal
        isOpen={documentModal.isOpen}
        onClose={() => setDocumentModal(prev => ({ ...prev, isOpen: false }))}
        title={documentModal.title}
        subtitle={documentModal.subtitle}
        content={documentModal.content}
      />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <SubscriptionProvider>
        <AppContent />
      </SubscriptionProvider>
    </ErrorBoundary>
  );
}
