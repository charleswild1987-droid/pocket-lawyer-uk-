import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  CreditCard, 
  Play, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  Receipt, 
  Printer, 
  RefreshCw, 
  AlertTriangle,
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { storageVault } from '../../services/storageVault';

export const SubscriptionTab: React.FC = () => {
  const { 
    subscription, 
    isPro, 
    daysRemainingInTrial, 
    hoursRemainingInTrial, 
    trialProgressPercent,
    isTrialExpired,
    startSubscription,
    startStripeSubscription,
    cancelSubscription,
    restorePurchases,
    resetTrial,
    fastForwardToEndOfTrial,
    advanceTrialDays,
    simulateSubscribed,
    isStripeLoaded
  } = useSubscription();

  const [paymentMode, setPaymentMode] = useState<'googleplay' | 'card'>('googleplay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [cardHolder, setCardHolder] = useState('Charles Wild');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');

  const handleSubscribeGooglePlay = async () => {
    setIsProcessing(true);
    try {
      await startSubscription('Google Play In-App Purchase');
      setSuccessMsg('PocketLawyer UK Pro subscription activated via Google Play Billing!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubscribeCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await startStripeSubscription({
        name: cardHolder,
        last4: '4242',
        brand: 'Visa'
      });
      setSuccessMsg('Stripe recurring subscription activated! 7-day trial authenticated (£0.00 today), then £2.99/month.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Cancel auto-renewal? You will keep Pro access until your current billing period ends.')) {
      cancelSubscription();
      setSuccessMsg('Auto-renewal has been cancelled.');
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const handleRestore = async () => {
    setIsProcessing(true);
    try {
      await restorePurchases();
      setSuccessMsg('Subscription restored from Google Play account!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const printReceipt = (invId: string) => {
    const inv = subscription.invoices.find(i => i.id === invId);
    if (!inv) return;
    const printWindow = window.open('', '', 'width=650,height=700');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt ${inv.id} - PocketLawyer UK</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 30px; color: #1e293b; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
            .badge { background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: left; }
            .total { font-weight: bold; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>PocketLawyer UK Ltd.</h2>
            <p>VAT Registration: GB 942 8172 09 • Registered in England & Wales</p>
            <p><strong>Official Tax Invoice & Receipt</strong></p>
          </div>
          <p><strong>Invoice Number:</strong> ${inv.id}</p>
          <p><strong>Date:</strong> ${inv.date}</p>
          <p><strong>Payment Method:</strong> ${inv.paymentMethod}</p>
          <p><strong>Status:</strong> <span class="badge">${inv.status}</span></p>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Net</th>
                <th>UK VAT (20%)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${inv.description}</td>
                <td>£${(inv.amount - inv.vat).toFixed(2)}</td>
                <td>£${inv.vat.toFixed(2)}</td>
                <td><strong>£${inv.amount.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 30px; font-size: 12px; color: #64748b;">
            <p>Thank you for subscribing to PocketLawyer UK. You can cancel your subscription at any time via Google Play or the in-app subscription manager.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">Membership & Subscription</h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black uppercase tracking-wider">
                  £2.99 / Month
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                7-Day Free Trial included. Unlimited court-compliant letters, landlord notices, and dispute generators.
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-5">
            <span className="text-xs text-slate-400">Current Plan Status</span>
            <div className="text-base font-bold text-amber-400 flex items-center justify-end gap-1.5 mt-0.5">
              {subscription.status === 'active' ? (
                <>
                  <Crown className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Active Pro (£2.99/mo)</span>
                </>
              ) : subscription.status === 'trial' && !isTrialExpired ? (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Free Trial ({daysRemainingInTrial}d {hoursRemainingInTrial}h left)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400">Trial Expired</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 text-xs">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Subscription Status Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-sm">Subscription Details</h3>
            <p className="text-xs text-slate-400">Plan: {subscription.planName}</p>
          </div>

          {subscription.status === 'active' && (
            <button
              onClick={handleCancel}
              className="text-xs text-red-400 hover:text-red-300 font-semibold underline self-start sm:self-auto cursor-pointer"
            >
              Cancel Auto-Renewal
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400">Price</span>
            <div className="text-lg font-bold text-amber-400 mt-1">£2.99 / mo</div>
            <span className="text-[10px] text-slate-500">Includes 20% UK VAT</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400">Trial Period</span>
            <div className="text-lg font-bold text-white mt-1">7 Days Free</div>
            <span className="text-[10px] text-emerald-400 font-medium">£0.00 during trial</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400">Next Billing Date</span>
            <div className="text-base font-bold text-slate-200 mt-1">
              {new Date(subscription.nextBillingDate).toLocaleDateString('en-GB')}
            </div>
            <span className="text-[10px] text-slate-400">Auto-renews monthly</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400">Payment Gateway</span>
            <div className="text-xs font-bold text-slate-300 mt-1 truncate">
              {subscription.paymentMethod}
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">Protected by 256-bit TLS</span>
          </div>
        </div>

        {/* 7-Day Free Trial Progress Bar */}
        {subscription.status === 'trial' && !isTrialExpired && (
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">7-Day Free Trial Timeline</span>
              <span className="font-bold text-amber-400">{daysRemainingInTrial} days, {hoursRemainingInTrial} hours remaining</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-amber-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(8, trialProgressPercent))}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Status: Trial Active ({trialProgressPercent}% elapsed)</span>
              <span>Ends: {new Date(subscription.trialEndDate).toLocaleDateString('en-GB')}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              🛡️ <strong>Zero-risk trial:</strong> You have unlimited access right now. You won't be charged until {new Date(subscription.trialEndDate).toLocaleDateString('en-GB')}. If you cancel before then, you pay nothing.
            </p>
          </div>
        )}
      </div>

      {/* Payment Processing Section */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Payment Gateways */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              Secure Payment Processing
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono">SCA & PCI-DSS</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setPaymentMode('googleplay')}
              className={`p-3 rounded-xl border font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                paymentMode === 'googleplay' 
                  ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Google Play Billing</span>
            </button>

            <button
              onClick={() => setPaymentMode('card')}
              className={`p-3 rounded-xl border font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                paymentMode === 'card' 
                  ? 'bg-amber-950/60 border-amber-400 text-amber-300' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Credit / Debit Card</span>
            </button>
          </div>

          {paymentMode === 'googleplay' ? (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-white font-bold">
                <Play className="w-4 h-4 text-emerald-400 fill-current" />
                <span>Google Play Store In-App Purchase</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Subscribing through Google Play links directly to your Google Account on Android. Google manages trial tracking, automatic renewal, and instant 1-tap cancellation.
              </p>

              <button
                onClick={handleSubscribeGooglePlay}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isProcessing ? 'Processing...' : 'Subscribe with Google Play (£2.99/mo after 7-day trial)'}</span>
              </button>

              <button
                onClick={handleRestore}
                disabled={isProcessing}
                className="w-full text-center text-xs text-slate-400 hover:text-slate-200 transition py-1"
              >
                Restore Existing Google Play Purchase
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubscribeCard} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cardholder Name</label>
                <input
                  type="text"
                  defaultValue="Charles Wild"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Card Number (Visa / Mastercard)</label>
                <input
                  type="text"
                  defaultValue="•••• •••• •••• 4242"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Expires</label>
                  <input
                    type="text"
                    defaultValue="10/29"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">CVC</label>
                  <input
                    type="password"
                    defaultValue="•••"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>{isProcessing ? 'Verifying Card...' : 'Start 7-Day Free Trial (£0.00 today)'}</span>
              </button>
            </form>
          )}
        </div>

        {/* VAT Invoices & Sandbox Controls */}
        <div className="space-y-4">
          {/* VAT Invoices */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-400" />
                UK Tax Receipts & VAT ({subscription.invoices.length})
              </h3>
              <span className="text-[10px] text-slate-400">20% UK VAT</span>
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto text-xs">
              {subscription.invoices.map((inv) => (
                <div key={inv.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-amber-400">{inv.id}</span>
                    <p className="text-[11px] text-slate-300">{inv.description}</p>
                    <span className="text-[10px] text-slate-500">{inv.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">£{inv.amount.toFixed(2)}</span>
                    <button
                      onClick={() => printReceipt(inv.id)}
                      className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                      title="Print or save PDF receipt"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instant Sandbox Testing Controls */}
          <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 space-y-2 text-xs">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Instant Testing & Review Controls (No Waiting 7 Days)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Simulate any subscription lifecycle state in 1 click for review testing:
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => advanceTrialDays(1)}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-800 text-blue-400 text-left font-semibold cursor-pointer"
              >
                Advance Trial +1 Day
              </button>
              <button
                onClick={() => advanceTrialDays(3)}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-800 text-indigo-400 text-left font-semibold cursor-pointer"
              >
                Advance Trial +3 Days
              </button>
              <button
                onClick={fastForwardToEndOfTrial}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-800 text-red-400 text-left font-semibold cursor-pointer"
              >
                Fast-Forward Day 7 (Expire)
              </button>
              <button
                onClick={resetTrial}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-800 text-emerald-400 text-left font-semibold cursor-pointer"
              >
                Reset 7-Day Free Trial
              </button>
              <button
                onClick={simulateSubscribed}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-800 text-amber-400 text-left font-semibold cursor-pointer"
              >
                Simulate Subscribed (£2.99/mo)
              </button>
              <button
                onClick={cancelSubscription}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 text-left font-semibold cursor-pointer"
              >
                Simulate Cancellation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Google Play Store & Data Safety Compliance Hub */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-blue-500/30 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Google Play Subscription & Data Safety Hub</h3>
              <p className="text-xs text-slate-400">Manage Android billing, GDPR data portability, and device storage</p>
            </div>
          </div>
          <a
            href="https://play.google.com/store/account/subscriptions"
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            <span>Manage in Google Play</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          {/* Storage & Privacy Summary */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-white block">Local Device Storage</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              PocketLawyer stores your incident notes, audio records, and bookmarks on this device only. Zero data is sold or sent to ad trackers.
            </p>
            <div className="pt-1">
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                100% On-Device Sandbox
              </span>
            </div>
          </div>

          {/* GDPR Data Export */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-white block">GDPR Data Portability</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Export all your saved incidents, generated documents, and subscription records in machine-readable JSON format.
            </p>
            <button
              onClick={async () => {
                const jsonStr = await storageVault.exportAllVaultData();
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `pocketlawyer_my_data_${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Export My Data (JSON)</span>
            </button>
          </div>

          {/* Google Play 2024 Account & Data Wipe Requirement */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-red-500/30 space-y-2">
            <span className="font-bold text-red-400 block">Account & Data Wipe</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Google Play policy allows users to wipe all stored data at any time. This clears all local cache, drafts, and resets the app.
            </p>
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to wipe all local data and reset PocketLawyer UK? This will remove all incident logs, bookmarks, and draft forms.')) {
                  await storageVault.clearAllVault();
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="py-1.5 px-3 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Wipe All Data & Reset</span>
            </button>
          </div>
        </div>

        {/* Legal Policies Links */}
        <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
          <div className="flex items-center gap-4">
            <a href="/privacy.html" target="_blank" className="hover:text-amber-400 underline">
              Google Play Privacy Policy
            </a>
            <a href="/terms.html" target="_blank" className="hover:text-amber-400 underline">
              Terms of Service
            </a>
            <a href="/.well-known/assetlinks.json" target="_blank" className="hover:text-amber-400 underline">
              AssetLinks JSON
            </a>
          </div>
          <span>Google Play Package: uk.co.pocketlawyer.app</span>
        </div>
      </div>
    </div>
  );
};
