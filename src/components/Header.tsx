import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  Crown, 
  Search, 
  AlertTriangle,
  Smartphone,
  Info,
  Database
} from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { aiSentinel } from '../services/aiSentinel';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { storageVault } from '../services/storageVault';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenSentinel: () => void;
  onOpenPlayStoreExport: () => void;
  onOpenVault: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenSentinel,
  onOpenPlayStoreExport,
  onOpenVault,
}) => {
  const { subscription, isPro, daysRemainingInTrial, hoursRemainingInTrial, isTrialExpired, openPaywall } = useSubscription();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [healthScore, setHealthScore] = useState(100);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [vaultCount, setVaultCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const stats = storageVault.getVaultStats();
      setVaultCount(stats.documentCount + stats.incidentCount);
    };
    updateCount();
    return storageVault.subscribe(updateCount);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    return aiSentinel.subscribe(() => {
      setHealthScore(aiSentinel.getHealthScore());
    });
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-md">
      {/* Top utility notification bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-xs py-1.5 px-4 text-center flex items-center justify-between border-b border-blue-800/40">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
            UK Law
          </span>
          <span className="text-slate-200">
            Current for England & Wales • PACE 1984 • CRA 2015 • ERA 1996 • UK GDPR
          </span>
          {isOffline && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
              📶 Offline Mode (Cached)
            </span>
          )}
        </div>

        {/* Desktop Quick Subscription CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {subscription.status === 'trial' && !isTrialExpired && (
            <button 
              onClick={() => openPaywall()}
              className="text-amber-300 hover:text-amber-200 font-medium flex items-center gap-1 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Trial active: <strong>{daysRemainingInTrial}d {hoursRemainingInTrial}h left</strong> • £2.99/mo after
            </button>
          )}
          {subscription.status === 'active' && (
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" /> Pro Member (£2.99/mo)
            </span>
          )}
          {isTrialExpired && (
            <button 
              onClick={() => openPaywall('Your 7-day trial has ended. Subscribe for £2.99/month to keep full access.')}
              className="text-amber-400 hover:text-amber-300 font-semibold animate-pulse"
            >
              ⚠️ Trial Ended • Unlock Pro for £2.99/mo
            </button>
          )}
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black">
            <Scale className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-white tracking-tight">PocketLawyer</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-blue-600/80 text-white border border-blue-400/30">
                UK
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-0.5 hidden xs:block">
              Pocket Legal Advisor & Document Suite
            </p>
          </div>
        </div>

        {/* Global Live Search Bar */}
        <div className="flex-1 max-w-md relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search statutes, police rights, notice generators, Latin terms..."
            className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 bg-slate-700 rounded px-1.5 py-0.5"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Sentinel Health Pill */}
          <button
            onClick={onOpenSentinel}
            title="AI Sentinel: Autonomous Self-Healing & Error Prevention System"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40 text-xs font-medium transition cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">AI Sentinel:</span>
            <span>{healthScore}%</span>
          </button>

          {/* Subscription / Trial Button */}
          <button
            onClick={() => openPaywall()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm ${
              isPro 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:brightness-110 shadow-amber-500/20'
            }`}
          >
            {subscription.status === 'active' ? (
              <>
                <Crown className="w-3.5 h-3.5" />
                <span>Pro Member</span>
              </>
            ) : subscription.status === 'trial' && !isTrialExpired ? (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>7-Day Trial ({daysRemainingInTrial}d left)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Unlock Pro (£2.99)</span>
              </>
            )}
          </button>

          {/* My Vault Button with live badge */}
          <button
            onClick={onOpenVault}
            title="My Saved Documents, Contracts & Recorded Incident Evidence"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer shadow-sm"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">My Vault</span>
            {vaultCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                {vaultCount}
              </span>
            )}
          </button>

          {/* Google Play / Offline Export Package Button */}
          <button
            onClick={onOpenPlayStoreExport}
            title="Download offline package or Google Play Store bundle"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700/80 text-xs font-medium transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden lg:inline">Google Play / Zip</span>
          </button>

          {/* PWA In-App Install Button */}
          {isInstallable && !isInstalled && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}

          {isIOS && !isInstalled && (
            <button
              onClick={() => setShowIOSModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition"
            >
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Add to Home</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile search bar if screen is small */}
      <div className="p-3 border-t border-slate-800/80 md:hidden bg-slate-900/90">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 10 law domains, generators, jargon..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* iOS Installation Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-slate-100 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Install PocketLawyer on iPhone / iPad</h3>
            <p className="text-sm text-slate-400 mt-2">
              Safari supports 1-tap installation without visiting the App Store:
            </p>
            <ol className="mt-4 space-y-2 text-sm text-slate-300 list-decimal list-inside">
              <li>Tap the <strong>Share</strong> button (box with upward arrow) in Safari.</li>
              <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
              <li>Tap <strong>Add</strong> at top right.</li>
            </ol>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
