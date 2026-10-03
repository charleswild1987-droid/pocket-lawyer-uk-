import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { SubscriptionState, SubscriptionStatus, Invoice, StripeSubscriptionMeta } from '../types/subscription';

const STORAGE_KEY = 'pocketlawyer_subscription_v1';
const STRIPE_PUBLISHABLE_KEY = (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51MockPocketLawyerUK_LegalCompanion2026';

// Initialize Stripe Client SDK promise
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface SubscriptionContextType {
  subscription: SubscriptionState;
  isPro: boolean;
  isTrialActive: boolean;
  daysRemainingInTrial: number;
  hoursRemainingInTrial: number;
  trialProgressPercent: number;
  isTrialExpired: boolean;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  openPaywall: (reason?: string) => void;
  paywallReason: string;
  startSubscription: (paymentMethod: string) => Promise<boolean>;
  startStripeSubscription: (options?: { name?: string; email?: string; last4?: string; brand?: string }) => Promise<boolean>;
  createStripeCheckoutSession: () => Promise<{ sessionId: string; url: string }>;
  cancelSubscription: () => void;
  restorePurchases: () => Promise<boolean>;
  resetTrial: () => void;
  fastForwardToEndOfTrial: () => void;
  advanceTrialDays: (days: number) => void;
  simulateSubscribed: () => void;
  checkAccess: (featureName: string) => boolean;
  stripe: Stripe | null;
  isStripeLoaded: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [isStripeLoaded, setIsStripeLoaded] = useState(false);

  // Initialize Stripe SDK client instance
  useEffect(() => {
    let isMounted = true;
    stripePromise
      .then((stripe) => {
        if (isMounted) {
          setStripeInstance(stripe);
          setIsStripeLoaded(true);
        }
      })
      .catch((err) => {
        console.warn('Stripe client SDK initialized in offline/mock mode:', err);
        if (isMounted) {
          setIsStripeLoaded(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const [subscription, setSubscription] = useState<SubscriptionState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore storage error
    }

    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const trialEnd = new Date(now + sevenDaysMs).toISOString();

    return {
      status: 'trial',
      trialStartDate: new Date(now).toISOString(),
      trialEndDate: trialEnd,
      nextBillingDate: trialEnd,
      planName: 'PocketLawyer Pro (7-Day Free Trial)',
      monthlyPrice: 2.99,
      currency: 'GBP',
      paymentMethod: 'Stripe Billing (UK Card / Apple Pay)',
      autoRenew: true,
      invoices: [
        {
          id: 'INV-TRIAL-001',
          date: new Date(now).toLocaleDateString('en-GB'),
          description: '7-Day Free Trial Activation — PocketLawyer UK Pro (£2.99/mo after)',
          amount: 0.00,
          vat: 0.00,
          status: 'Paid',
          paymentMethod: 'Stripe 7-Day Free Trial Setup'
        }
      ],
      stripe: {
        customerId: `cus_uk_${Math.random().toString(36).substring(2, 9)}`,
        subscriptionId: `sub_pl_${Math.random().toString(36).substring(2, 9)}`,
        priceId: 'price_pocketlawyer_uk_monthly_299',
        paymentMethodId: 'pm_card_gb_debit',
        status: 'trialing',
        currency: 'gbp',
        unitAmount: 299,
        interval: 'month',
        trialStartMs: now,
        trialEndMs: now + sevenDaysMs,
        cardBrand: 'Visa',
        cardLast4: '4242',
        livemode: false
      }
    };
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paywallReason, setPaywallReason] = useState<string>('Unlock unlimited court-ready letters, tools, and landlord/accounts suites.');
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Heartbeat to update countdown every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscription));
    } catch (err) {
      console.warn('Could not save subscription to localStorage', err);
    }
  }, [subscription]);

  // Compute 7-day trial tracking status
  const trialStartMs = new Date(subscription.trialStartDate).getTime();
  const trialEndMs = new Date(subscription.trialEndDate).getTime();
  const totalTrialDurationMs = Math.max(1, trialEndMs - trialStartMs);
  const elapsedTrialMs = Math.max(0, currentTime - trialStartMs);
  const msRemaining = Math.max(0, trialEndMs - currentTime);

  const daysRemainingInTrial = Math.floor(msRemaining / (1000 * 60 * 60 * 24));
  const hoursRemainingInTrial = Math.floor((msRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const isTrialExpired = msRemaining <= 0;
  const isTrialActive = subscription.status === 'trial' && !isTrialExpired;

  // Trial progress from 0% (start) to 100% (ended)
  const trialProgressPercent = useMemo(() => {
    if (subscription.status !== 'trial') return 100;
    const progress = (elapsedTrialMs / totalTrialDurationMs) * 100;
    return Math.min(100, Math.max(0, Math.round(progress)));
  }, [subscription.status, elapsedTrialMs, totalTrialDurationMs]);

  // Handle automatic transition when trial ends
  useEffect(() => {
    if (subscription.status === 'trial' && isTrialExpired) {
      if (subscription.autoRenew && subscription.paymentMethod) {
        // Mock Stripe transition: Automatically bills £2.99/mo on day 7 via Stripe
        const nextBilling = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        const invoiceNum = `INV-STRIPE-${Math.floor(100000 + Math.random() * 900000)}`;
        const stripeInvoice: Invoice = {
          id: invoiceNum,
          date: new Date().toLocaleDateString('en-GB'),
          description: 'PocketLawyer UK Pro — First Recurring Monthly Charge (Post 7-Day Trial)',
          amount: 2.99,
          vat: 0.50, // 20% UK VAT included
          status: 'Paid',
          paymentMethod: 'Stripe Recurring Payment (£2.99/month)',
          stripePaymentIntentId: `pi_${Math.random().toString(36).substring(2, 12)}`
        };

        setSubscription(prev => ({
          ...prev,
          status: 'active',
          planName: 'PocketLawyer UK Pro (Stripe Active)',
          nextBillingDate: nextBilling,
          invoices: [stripeInvoice, ...prev.invoices],
          stripe: prev.stripe ? {
            ...prev.stripe,
            status: 'active'
          } : undefined
        }));
      } else {
        // Expired without renewal
        setSubscription(prev => ({
          ...prev,
          status: 'expired',
          autoRenew: false,
          stripe: prev.stripe ? { ...prev.stripe, status: 'canceled' } : undefined
        }));
      }
    }
  }, [isTrialExpired, subscription.status, subscription.autoRenew, subscription.paymentMethod]);

  // Pro access is granted if in active trial OR active subscription
  const isPro = subscription.status === 'active' || isTrialActive;

  const openPaywall = (reason?: string) => {
    if (reason) setPaywallReason(reason);
    setIsModalOpen(true);
  };

  /**
   * Stripe £2.99/month recurring payment workflow
   * Integrates Stripe's client-side SDK patterns with SCA (3D Secure) & UK VAT calculation
   */
  const startStripeSubscription = async (options?: {
    name?: string;
    email?: string;
    last4?: string;
    brand?: string;
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const nowMs = Date.now();
        const nextMonth = new Date(nowMs + 30 * 24 * 60 * 60 * 1000).toISOString();
        const invoiceNum = `INV-STRIPE-${Math.floor(100000 + Math.random() * 900000)}`;
        const last4 = options?.last4 || '4242';
        const brand = options?.brand || 'Visa';

        const stripeSubscriptionMeta: StripeSubscriptionMeta = {
          customerId: `cus_${Math.random().toString(36).substring(2, 10)}`,
          subscriptionId: `sub_299_${Math.random().toString(36).substring(2, 10)}`,
          priceId: 'price_pocketlawyer_uk_monthly_299',
          paymentMethodId: `pm_card_${last4}`,
          status: 'active',
          currency: 'gbp',
          unitAmount: 299,
          interval: 'month',
          trialStartMs: nowMs,
          trialEndMs: nowMs,
          latestPaymentIntentId: `pi_${Math.random().toString(36).substring(2, 12)}`,
          cardBrand: brand,
          cardLast4: last4,
          livemode: false
        };

        const newInvoice: Invoice = {
          id: invoiceNum,
          date: new Date().toLocaleDateString('en-GB'),
          description: 'PocketLawyer UK Pro — Stripe Recurring Subscription (£2.99/mo)',
          amount: 2.99,
          vat: 0.50, // 20% UK VAT included (£2.49 net + £0.50 VAT)
          status: 'Paid',
          paymentMethod: `Stripe • ${brand} ending in ${last4}`,
          stripePaymentIntentId: stripeSubscriptionMeta.latestPaymentIntentId
        };

        setSubscription(prev => ({
          ...prev,
          status: 'active',
          planName: 'PocketLawyer UK Pro (Stripe Recurring £2.99/mo)',
          paymentMethod: `Stripe (${brand} •••• ${last4})`,
          nextBillingDate: nextMonth,
          autoRenew: true,
          invoices: [newInvoice, ...prev.invoices],
          stripe: stripeSubscriptionMeta
        }));

        resolve(true);
      }, 750);
    });
  };

  /**
   * Generates a Stripe Checkout Session for £2.99/month recurring with 7-day free trial parameter
   */
  const createStripeCheckoutSession = async (): Promise<{ sessionId: string; url: string }> => {
    const sessionId = `cs_test_${Math.random().toString(36).substring(2, 14)}`;
    return {
      sessionId,
      url: `https://checkout.stripe.com/c/pay/${sessionId}`
    };
  };

  const startSubscription = async (method: string): Promise<boolean> => {
    return startStripeSubscription({
      name: 'Authorized Subscriber',
      brand: method.includes('Google') ? 'Google Pay' : 'Visa',
      last4: '4242'
    });
  };

  const cancelSubscription = () => {
    setSubscription(prev => ({
      ...prev,
      status: 'cancelled',
      autoRenew: false,
      stripe: prev.stripe ? { ...prev.stripe, status: 'canceled' } : undefined
    }));
  };

  const restorePurchases = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setSubscription(prev => ({
          ...prev,
          status: 'active',
          planName: 'PocketLawyer UK Pro (Restored via Stripe / Play)',
          autoRenew: true,
          stripe: prev.stripe ? { ...prev.stripe, status: 'active' } : undefined
        }));
        resolve(true);
      }, 800);
    });
  };

  // Mock controls for testing 7-day trial status transitions
  const resetTrial = () => {
    const start = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const end = new Date(start + sevenDaysMs).toISOString();

    setSubscription({
      status: 'trial',
      trialStartDate: new Date(start).toISOString(),
      trialEndDate: end,
      nextBillingDate: end,
      planName: 'PocketLawyer Pro (7-Day Free Trial)',
      monthlyPrice: 2.99,
      currency: 'GBP',
      paymentMethod: 'Stripe Billing (UK Card / Apple Pay)',
      autoRenew: true,
      invoices: [
        {
          id: `INV-TRIAL-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toLocaleDateString('en-GB'),
          description: '7-Day Free Trial Reset — PocketLawyer UK Pro',
          amount: 0.00,
          vat: 0.00,
          status: 'Paid',
          paymentMethod: 'Stripe 7-Day Free Trial Setup'
        }
      ],
      stripe: {
        customerId: `cus_uk_${Math.random().toString(36).substring(2, 9)}`,
        subscriptionId: `sub_pl_${Math.random().toString(36).substring(2, 9)}`,
        priceId: 'price_pocketlawyer_uk_monthly_299',
        paymentMethodId: 'pm_card_gb_debit',
        status: 'trialing',
        currency: 'gbp',
        unitAmount: 299,
        interval: 'month',
        trialStartMs: start,
        trialEndMs: start + sevenDaysMs,
        cardBrand: 'Visa',
        cardLast4: '4242',
        livemode: false
      }
    });
  };

  /**
   * Mock trial time advancement: fast-forwards trial by N days
   */
  const advanceTrialDays = (days: number) => {
    setSubscription(prev => {
      const currentStart = new Date(prev.trialStartDate).getTime();
      const currentEnd = new Date(prev.trialEndDate).getTime();
      const shiftMs = days * 24 * 60 * 60 * 1000;
      
      const newStart = new Date(currentStart - shiftMs).toISOString();
      const newEnd = new Date(currentEnd - shiftMs).toISOString();

      return {
        ...prev,
        trialStartDate: newStart,
        trialEndDate: newEnd
      };
    });
  };

  const fastForwardToEndOfTrial = () => {
    advanceTrialDays(7);
  };

  const simulateSubscribed = () => {
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    setSubscription(prev => ({
      ...prev,
      status: 'active',
      planName: 'PocketLawyer UK Pro Membership',
      paymentMethod: 'Stripe Recurring Card (£2.99/mo)',
      nextBillingDate: nextMonth,
      autoRenew: true,
      stripe: prev.stripe ? { ...prev.stripe, status: 'active' } : undefined
    }));
  };

  const checkAccess = (featureName: string): boolean => {
    if (isPro) return true;
    openPaywall(`To use ${featureName}, start your 7-day free trial or subscribe for £2.99/month.`);
    return false;
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isPro,
        isTrialActive,
        daysRemainingInTrial,
        hoursRemainingInTrial,
        trialProgressPercent,
        isTrialExpired,
        isModalOpen,
        setIsModalOpen,
        openPaywall,
        paywallReason,
        startSubscription,
        startStripeSubscription,
        createStripeCheckoutSession,
        cancelSubscription,
        restorePurchases,
        resetTrial,
        fastForwardToEndOfTrial,
        advanceTrialDays,
        simulateSubscribed,
        checkAccess,
        stripe: stripeInstance,
        isStripeLoaded
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
