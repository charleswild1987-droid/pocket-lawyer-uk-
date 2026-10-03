import React from 'react';
import { Sparkles, Crown, AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';

export const SubscriptionBanner: React.FC = () => {
  const { subscription, daysRemainingInTrial, hoursRemainingInTrial, isTrialExpired, openPaywall } = useSubscription();

  if (subscription.status === 'active') {
    return (
      <div className="bg-emerald-950/40 border-b border-emerald-500/20 px-4 py-2 text-xs flex items-center justify-between text-emerald-300">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>PocketLawyer Pro Active:</strong> You have unlimited court letters, landlord notices, and B2B late payment calculators (£2.99/month).
          </span>
        </div>
        <button
          onClick={() => openPaywall()}
          className="text-emerald-400 hover:text-emerald-300 font-semibold underline shrink-0 ml-3"
        >
          Manage Plan
        </button>
      </div>
    );
  }

  if (isTrialExpired || subscription.status === 'expired') {
    return (
      <div className="bg-gradient-to-r from-amber-950/90 via-red-950/80 to-amber-950/90 border-b border-amber-500/40 px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2 text-amber-200">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>7-Day Free Trial Expired:</strong> Document generation & specialist suites are locked. Emergency rights remain free.
          </span>
        </div>
        <button
          onClick={() => openPaywall('Your 7-day trial has ended. Subscribe for £2.99/month to keep full access.')}
          className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <span>Unlock Pro (£2.99/mo)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-950/60 via-indigo-950/50 to-slate-900 border-b border-blue-500/30 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 text-blue-200">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>7-Day Free Trial Active:</strong> You have <strong>{daysRemainingInTrial} days, {hoursRemainingInTrial} hours</strong> left of unlimited Pro tools before £2.99/month billing.
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-slate-400 hidden md:inline">Cancel anytime in 1 tap</span>
        <button
          onClick={() => openPaywall()}
          className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition"
        >
          <span>View Plan Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
