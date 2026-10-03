export type SubscriptionStatus = 'trial' | 'active' | 'cancelled' | 'expired';

export interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: number; // in GBP
  vat: number; // 20% UK VAT
  status: 'Paid' | 'Pending' | 'Refunded';
  paymentMethod: string;
  stripePaymentIntentId?: string;
  receiptUrl?: string;
}

export interface StripeSubscriptionMeta {
  customerId: string;
  subscriptionId: string;
  priceId: string;
  paymentMethodId: string;
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete';
  latestPaymentIntentId?: string;
  currency: string;
  unitAmount: number; // 299 pence (£2.99)
  interval: 'month';
  trialStartMs: number;
  trialEndMs: number;
  clientSecret?: string;
  cardBrand?: string;
  cardLast4?: string;
  livemode: boolean;
}

export interface SubscriptionState {
  status: SubscriptionStatus;
  trialStartDate: string; // ISO string
  trialEndDate: string; // ISO string (7 days after start)
  nextBillingDate: string; // ISO string
  planName: string;
  monthlyPrice: number; // 2.99
  currency: string; // 'GBP'
  paymentMethod: string;
  autoRenew: boolean;
  invoices: Invoice[];
  stripe?: StripeSubscriptionMeta;
}
