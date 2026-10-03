import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  CheckCircle, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  CreditCard, 
  Receipt, 
  RefreshCw, 
  AlertCircle, 
  Play, 
  ChevronRight,
  HelpCircle,
  Clock,
  Printer,
  FileText
} from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';

export const SubscriptionModal: React.FC = () => {
  const { 
    subscription, 
    isPro, 
    daysRemainingInTrial, 
    hoursRemainingInTrial, 
    trialProgressPercent,
    isTrialExpired,
    isModalOpen, 
    setIsModalOpen, 
    paywallReason,
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

  const [activeTab, setActiveTab] = useState<'plans' | 'googleplay' | 'card' | 'invoices' | 'devtools'>('plans');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const [cardHolder, setCardHolder] = useState('C. Wild');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');

  if (!isModalOpen) return null;

  const handleGooglePlaySubscribe = async () => {
    setIsProcessing(true);
    try {
      await startSubscription('Google Play In-App Purchase');
      setFeedbackMessage('Google Play subscription successfully activated! Your 7-day trial is backed by Google Play Billing.');
      setTimeout(() => {
        setFeedbackMessage(null);
        setActiveTab('invoices');
      }, 1500);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await startStripeSubscription({
        name: cardHolder,
        last4: '4242',
        brand: 'Visa'
      });
      setFeedbackMessage('Stripe recurring billing activated! 7-day trial authenticated (£0.00 today), then £2.99/month.');
      setTimeout(() => {
        setFeedbackMessage(null);
        setActiveTab('invoices');
      }, 1500);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = async () => {
    setIsProcessing(true);
    try {
      await restorePurchases();
      setFeedbackMessage('Purchases restored from Google Play Account!');
      setTimeout(() => setFeedbackMessage(null), 2500);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel auto-renewal? You will keep Pro access until your current billing period ends.')) {
      cancelSubscription();
      setFeedbackMessage('Auto-renewal cancelled. You will still have access until the end of the trial/billing period.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Header Banner */}
        <div className="relative bg-gradient-to-br from-amber-600 via-amber-700 to-slate-900 p-6 text-white shrink-0">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/50 hover:bg-slate-900 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            7-Day Free Trial • £2.99 / Month
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            PocketLawyer UK Pro
          </h2>
          <p className="text-amber-100 text-sm mt-1 max-w-lg">
            Complete legal security in your pocket. Generate court-compliant notices, dispute letters, NDAs, and landlord/accounts suites.
          </p>

          {/* Current Status Pill */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-amber-400/30 text-xs">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>
              Status: <strong>
                {subscription.status === 'active' 
                  ? '👑 Active Pro Member' 
                  : subscription.status === 'trial' && !isTrialExpired
                    ? `⭐ 7-Day Free Trial (${daysRemainingInTrial}d ${hoursRemainingInTrial}h remaining)`
                    : '⚠️ Free Trial Expired'}
              </strong>
            </span>
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('plans')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'plans' 
                ? 'border-amber-400 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            Membership & Benefits
          </button>

          <button
            onClick={() => setActiveTab('googleplay')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'googleplay' 
                ? 'border-amber-400 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            Google Play Billing
          </button>

          <button
            onClick={() => setActiveTab('card')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'card' 
                ? 'border-amber-400 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-blue-400" />
            Card / Direct Checkout
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'invoices' 
                ? 'border-amber-400 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            Receipts & VAT ({subscription.invoices.length})
          </button>

          <button
            onClick={() => setActiveTab('devtools')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'devtools' 
                ? 'border-amber-400 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            Testing Controls
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-sm">

          {/* Feedback banner */}
          {feedbackMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          {/* TAB 1: PLANS & BENEFITS */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              {paywallReason && (
                <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 shrink-0 text-blue-400" />
                  <span>{paywallReason}</span>
                </div>
              )}

              {/* Price card */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-850 border-2 border-amber-500/60 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-black text-[11px] px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Most Popular • 7 Days Free
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      PocketLawyer UK Pro
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Full access to all 12 modules, legal calculators & document generators
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-amber-400">£2.99</span>
                      <span className="text-slate-400 text-xs">/ month</span>
                    </div>
                    <p className="text-[11px] text-emerald-400 font-semibold">
                      7 Days Free Trial First
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>100+ Court-Ready Letters</strong> (LBA, CRA 2015)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Landlord Suite</strong> (Section 13 & 8 Notices)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Accounts & B2B Debts</strong> (Late Payment Act)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Court-Admissible NDA</strong> Generator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Ofgem & Ofcom Disputes</strong> (Backbilling)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Fine & Flight Claims</strong> (PCN, UK261 £520)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>AI Sentinel Engine</strong> 24/7 Self-Healing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Clean PDF & Court Printing</strong> Included</span>
                  </div>
                </div>

                {/* Trial timeline bar */}
                <div className="mt-5 p-3 rounded-xl bg-slate-900/80 border border-slate-700/60">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                    <span>Today: 7-Day Free Trial</span>
                    <span>Day 7: First £2.99 billing</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-amber-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(15, (7 - daysRemainingInTrial) / 7 * 100))}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    🛡️ <strong>Zero Risk:</strong> You will not be charged today. If you cancel before the 7 days elapse, you pay nothing.
                  </p>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setActiveTab('googleplay')}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    Start 7-Day Free Trial on Google Play
                  </button>
                  <button
                    onClick={() => setActiveTab('card')}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pay via Card / Google Pay
                  </button>
                </div>
              </div>

              {/* Free vs Pro Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-3 bg-slate-950 p-2.5 font-semibold text-slate-300">
                  <span>Feature</span>
                  <span className="text-center text-slate-400">Basic Free</span>
                  <span className="text-center text-amber-400">Pro (£2.99/mo)</span>
                </div>
                <div className="divide-y divide-slate-800">
                  <div className="grid grid-cols-3 p-2.5 items-center">
                    <span>Emergency Police HUD & GOWISELY</span>
                    <span className="text-center text-emerald-400 font-bold">Free Forever</span>
                    <span className="text-center text-emerald-400 font-bold">Included</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 items-center">
                    <span>10-Domain UK Law Codex</span>
                    <span className="text-center text-emerald-400">Read summaries</span>
                    <span className="text-center text-emerald-400 font-bold">Full Deep Codex</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 items-center">
                    <span>Landlord & Accounts Letter Generators</span>
                    <span className="text-center text-slate-500">Locked</span>
                    <span className="text-center text-emerald-400 font-bold">Unlimited</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 items-center">
                    <span>NDA & Dispute Appeals</span>
                    <span className="text-center text-slate-500">Locked</span>
                    <span className="text-center text-emerald-400 font-bold">Unlimited</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 items-center">
                    <span>Court-Formatted PDF & Print Export</span>
                    <span className="text-center text-slate-500">Watermark</span>
                    <span className="text-center text-emerald-400 font-bold">Official Clean</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE PLAY BILLING SIMULATOR */}
          {activeTab === 'googleplay' && (
            <div className="max-w-md mx-auto space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-700/80 shadow-lg">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Google Play In-App Billing</h4>
                    <p className="text-xs text-slate-400">Google Play Store UK • com.pocketlawyer.uk</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Item</span>
                    <span className="font-medium text-slate-200">PocketLawyer UK Pro (Monthly)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Free Trial</span>
                    <span className="font-bold text-emerald-400">7 Days (£0.00 today)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Starting price</span>
                    <span className="font-bold text-amber-400">£2.99 / month (inc. UK VAT)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Payment Account</span>
                    <span className="font-medium text-slate-300">Google Account Balance / Saved Card</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
                  By tapping <strong>Subscribe</strong>, you agree to automatic monthly billing through your Google Play account after your 7-day trial. You can cancel at any time in Google Play Subscriptions at least 24 hours before the trial ends.
                </p>

                <div className="mt-5 space-y-2">
                  <button
                    onClick={handleGooglePlaySubscribe}
                    disabled={isProcessing}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 fill-white" />
                    )}
                    <span>{isProcessing ? 'Connecting to Google Play...' : 'Subscribe • 7 Days Free, then £2.99/mo'}</span>
                  </button>

                  <button
                    onClick={handleRestore}
                    disabled={isProcessing}
                    className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 transition"
                  >
                    Restore Google Play Purchase
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CARD CHECKOUT */}
          {activeTab === 'card' && (
            <form onSubmit={handleCardSubscribe} className="max-w-md mx-auto space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-700/80">
                <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  Direct Card & Google Pay Checkout
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  7-Day Free Trial • £2.99 / month thereafter • UK VAT registered
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      defaultValue="C. Wild"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Card Number (UK Debit/Credit)</label>
                    <input
                      type="text"
                      defaultValue="•••• •••• •••• 4242"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry</label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">CVC / CVV</label>
                      <input
                        type="password"
                        defaultValue="•••"
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>256-bit TLS encrypted • Strong Customer Authentication (SCA) compliant</span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="mt-4 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span>{isProcessing ? 'Verifying Card...' : 'Start 7-Day Free Trial (£0.00 today)'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: INVOICES & VAT */}
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Billing Invoices & UK VAT Receipts</h4>
                  <p className="text-xs text-slate-400">All prices include 20% UK VAT (£0.50 per £2.99 invoice)</p>
                </div>

                {subscription.status === 'active' && (
                  <button
                    onClick={handleCancel}
                    className="text-xs text-red-400 hover:text-red-300 underline font-medium"
                  >
                    Cancel Auto-Renewal
                  </button>
                )}
              </div>

              {subscription.invoices.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No invoices yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {subscription.invoices.map((inv) => (
                    <div 
                      key={inv.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-400">{inv.id}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-semibold border border-emerald-500/30">
                            {inv.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200">{inv.description}</p>
                        <p className="text-[11px] text-slate-400">{inv.date} • {inv.paymentMethod}</p>
                      </div>

                      <div className="text-right flex items-center gap-3">
                        <div>
                          <div className="font-bold text-white text-sm">£{inv.amount.toFixed(2)}</div>
                          <div className="text-[10px] text-slate-400">VAT £{inv.vat.toFixed(2)}</div>
                        </div>

                        <button
                          onClick={() => printReceipt(inv.id)}
                          title="Print or save PDF receipt"
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: DEV & REVIEW TESTING CONTROLS */}
          {activeTab === 'devtools' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-4">
              <div>
                <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Testing & Review Sandbox
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Use these instant controls to simulate the full subscription lifecycle without waiting 7 days.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-2.5">
                <button
                  onClick={resetTrial}
                  className="p-3 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 text-left transition text-xs cursor-pointer"
                >
                  <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Reset to 7-Day Free Trial
                  </div>
                  <p className="text-slate-400 mt-0.5">Restores trial to 7 days remaining from right now.</p>
                </button>

                <button
                  onClick={() => advanceTrialDays(1)}
                  className="p-3 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 text-left transition text-xs cursor-pointer"
                >
                  <div className="font-semibold text-blue-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Advance Trial +1 Day
                  </div>
                  <p className="text-slate-400 mt-0.5">Progresses the 7-day trial status clock forward by 24h.</p>
                </button>

                <button
                  onClick={() => advanceTrialDays(3)}
                  className="p-3 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 text-left transition text-xs cursor-pointer"
                >
                  <div className="font-semibold text-indigo-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Advance Trial +3 Days
                  </div>
                  <p className="text-slate-400 mt-0.5">Simulates midpoint of the 7-day free trial.</p>
                </button>

                <button
                  onClick={fastForwardToEndOfTrial}
                  className="p-3 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 text-left transition text-xs cursor-pointer"
                >
                  <div className="font-semibold text-red-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Fast-Forward to Day 7 (Expire Trial)
                  </div>
                  <p className="text-slate-400 mt-0.5">Simulates day 7 passing to test the paywall lock.</p>
                </button>

                <button
                  onClick={simulateSubscribed}
                  className="p-3 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 text-left transition text-xs cursor-pointer"
                >
                  <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" />
                    Simulate Subscribed (£2.99/mo)
                  </div>
                  <p className="text-slate-400 mt-0.5">Activates full paid subscriber mode directly.</p>
                </button>

                <button
                  onClick={cancelSubscription}
                  className="p-3 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 text-left transition text-xs cursor-pointer"
                >
                  <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <X className="w-3.5 h-3.5" />
                    Simulate Cancellation
                  </div>
                  <p className="text-slate-400 mt-0.5">Turns off auto-renewal and simulates cancellation.</p>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <span>Protected by English Law • Consumer Contracts Regulations 2013</span>
          <div className="flex gap-4">
            <button onClick={() => alert('PocketLawyer UK Privacy Policy:\n\nAll personal data, document drafts, and incident logs remain 100% on your device in local storage. No client documents or legal inquiries are transmitted to third parties.')} className="hover:underline">Privacy Policy</button>
            <button onClick={() => alert('PocketLawyer UK Terms of Service:\n\nPocketLawyer UK provides automated legal information, statutory calculators, and court-compliant document templates. It does not constitute formal SRA solicitor representation.')} className="hover:underline">Terms of Service</button>
            <button onClick={handleRestore} className="text-amber-400 hover:underline">Restore Purchase</button>
          </div>
        </div>

      </div>
    </div>
  );
};
