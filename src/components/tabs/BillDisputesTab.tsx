import React, { useState } from 'react';
import { Zap, Building2, Wifi, FileText, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';

interface BillDisputesTabProps {
  onOpenDocument: (title: string, subtitle: string, content: string) => void;
}

export const BillDisputesTab: React.FC<BillDisputesTabProps> = ({ onOpenDocument }) => {
  const { checkAccess } = useSubscription();

  const [activeSubTab, setActiveSubTab] = useState<'ofgem' | 'counciltax' | 'broadband'>('ofgem');

  // Ofgem Backbilling State
  const [energySupplier, setEnergySupplier] = useState('British Gas');
  const [accountNumber, setAccountNumber] = useState('BG-9482-1049');
  const [backbilledAmount, setBackbilledAmount] = useState(1450);
  const [customerName, setCustomerName] = useState('Sarah Jenkins');
  const [propertyAddress, setPropertyAddress] = useState('14 Park Avenue, Birmingham, B1 2AA');

  // Council Tax State
  const [councilName, setCouncilName] = useState('Birmingham City Council');
  const [councilTaxRef, setCouncilTaxRef] = useState('CTX-849204-01');
  const [exemptionType, setExemptionType] = useState<'single' | 'smi' | 'student'>('single');
  const [backdateYears, setBackdateYears] = useState(2);

  // Broadband State
  const [telecomProvider, setTelecomProvider] = useState('Virgin Media / O2');
  const [telecomAccount, setTelecomAccount] = useState('VM-5829104');
  const [hikePercentage, setHikePercentage] = useState(8.8);

  const handleGenerateOfgem = () => {
    if (!checkAccess('Ofgem Backbilling Dispute Generator')) return;

    const doc = `FORMAL STAGE 1 COMPLAINT: OFGEM 12-MONTH BACK-BILLING RULE BREACH
PURSUANT TO OFGEM STANDARD LICENCE CONDITION 21BA

Date: ${new Date().toLocaleDateString('en-GB')}

To: The Complaints Manager / Executive Team
${energySupplier}

Customer Name: ${customerName}
Account Number: ${accountNumber}
Supply Address: ${propertyAddress}

FORMAL DISPUTE OF UNLAWFUL ENERGY BACKBILLING CHARGES (£${backbilledAmount.toFixed(2)})

Dear Sirs,

I am writing to formally dispute the recent catch-up / backbilled charges amounting to £${backbilledAmount.toFixed(2)} applied to my account on recent billing correspondence.

STATUTORY REGULATORY FRAMEWORK:
Under Ofgem Standard Licence Condition 21BA (the "Backbilling Rule"), an energy supplier is strictly prohibited from seeking payment for gas or electricity used more than 12 months prior to the date of the bill, where the customer was not at fault for the billing delay.

STATEMENT OF FACTS:
1. The charges in question relate to energy units consumed more than 12 months prior to the bill date.
2. I have not acted obstructively, fraudulently, or prevented meter readings from being taken.
3. The failure to bill correctly on an ongoing basis rests entirely with your billing system and meter management.

REMEDIES DEMANDED:
Pursuant to SLC 21BA, I require you to:
1. Immediately cancel and write off all disputed charges for energy consumed more than 12 months ago;
2. Issue a revised, compliant bill reflecting only lawfully billable consumption within the preceding 12 months;
3. Suspend all collection, reminder, or default proceedings on this account while this formal dispute is being investigated.

If you fail to provide a satisfactory resolution within 8 weeks, or if you issue a Deadlock Letter before then, I will immediately escalate this complaint to the Energy Ombudsman (Ombudsman Services), who have the power to award compensation and enforce compliance.

Yours faithfully,

___________________________
${customerName}`;

    onOpenDocument('Ofgem Energy Backbilling Dispute Letter', 'Ofgem Standard Licence Condition 21BA', doc);
  };

  const handleGenerateCouncilTax = () => {
    if (!checkAccess('Council Tax Appeal Generator')) return;

    let claimBasis = '';
    if (exemptionType === 'single') {
      claimBasis = `25% Single Person Discount under Section 11 of the Local Government Finance Act 1992, on the grounds that I have been the sole adult occupant of the property.`;
    } else if (exemptionType === 'smi') {
      claimBasis = `100% Severe Mental Impairment (SMI) Exemption under Schedule 1 to the Local Government Finance Act 1992, supported by medical practitioner certification and qualifying disability benefits.`;
    } else {
      claimBasis = `Class N 100% Student Exemption under the Council Tax (Exempt Dwellings) Order 1992, on the grounds of full-time higher education enrolment.`;
    }

    const doc = `FORMAL NOTICE OF COUNCIL TAX APPEAL & STATUTORY REFUND CLAIM
PURSUANT TO SECTION 16 LOCAL GOVERNMENT FINANCE ACT 1992

Date: ${new Date().toLocaleDateString('en-GB')}

To: The Council Tax Assessment Department
${councilName}

Appellant: ${customerName}
Council Tax Account Reference: ${councilTaxRef}
Property Address: ${propertyAddress}

RE: FORMAL APPLICATION FOR STATUTORY DISCOUNT / EXEMPTION AND RETROSPECTIVE REFUND

Dear Revenues Team,

I am writing to formally request the application of a statutory reduction to my Council Tax liability in respect of the above property:

STATUTORY BASIS OF CLAIM:
I am entitled to a ${claimBasis}

RETROSPECTIVE BACKDATING:
Under established English valuation tribunal precedent and High Court authority, there is no statutory time limit restricting the backdating of mandatory statutory discounts where the factual criteria were satisfied during the relevant periods. I formally request that this discount be applied retrospectively for the past ${backdateYears} years.

ACTIONS REQUIRED:
1. Apply the statutory reduction to my account immediately;
2. Recalculate my historic liability over the period claimed;
3. Issue a revised Council Tax Demand Notice showing the overpayment;
4. Remit the resulting credit balance directly to my bank account.

Should this application be rejected in whole or in part, please treat this letter as a formal grievance under Section 16 of the Local Government Finance Act 1992, entitling me to appeal directly to the independent Valuation Tribunal for England within two months.

Yours sincerely,

___________________________
${customerName}`;

    onOpenDocument('Council Tax Exemption & Discount Appeal', 'Local Government Finance Act 1992 s.16', doc);
  };

  const handleGenerateBroadband = () => {
    if (!checkAccess('Mid-Contract Price Hike Cancellation')) return;

    const doc = `FORMAL NOTICE OF CANCELLATION: MID-CONTRACT PRICE INCREASE
PURSUANT TO OFCOM GENERAL CONDITION C1.6 & CONSUMER RIGHTS ACT 2015

Date: ${new Date().toLocaleDateString('en-GB')}

To: Cancellations & Retentions Department
${telecomProvider}

Customer Name: ${customerName}
Account Number: ${telecomAccount}
Installation Address: ${propertyAddress}

NOTICE OF PENALTY-FREE CONTRACT TERMINATION WITHOUT EARLY TERMINATION FEES

Dear Sirs,

I am writing in response to your recent notification informing me of an above-inflation price increase of ${hikePercentage}% applied to my telecommunications / broadband services.

STATUTORY & REGULATORY RIGHTS:
Under Ofcom General Condition C1.6 and the Consumer Rights Act 2015, where a telecommunications provider introduces a variation to the terms of a contract that is of material detriment to the consumer, the subscriber is legally entitled to terminate the contract within 30 days of receiving notice, completely free of charge and without the imposition of any Early Termination Charges (ETCs) or penalty fees.

FORMAL INSTRUCTIONS:
1. Please treat this letter as my formal 30-day notice to cancel my services without any exit penalty.
2. Confirm in writing within 5 working days that my contract is terminated and that my final balance is zero.
3. Provide prepaid returns packaging for any leased hardware/routers.

Any attempt to levy Early Termination Fees or report adverse data to credit reference agencies in breach of Ofcom General Conditions will be reported immediately to Ofcom and escalated to the Communications Ombudsman (CISAS / Ombudsman Services).

Yours faithfully,

___________________________
${customerName}`;

    onOpenDocument('Mid-Contract Price Hike Cancellation Notice', 'Ofcom General Condition C1.6', doc);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Household & Utility Bill Disputes Suite</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30 uppercase">
                Ofgem & Ofcom
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Enforce the Ofgem 12-Month Backbilling Rule, appeal Council Tax bands & single-person discounts, and cancel broadband price hikes penalty-free.
            </p>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-semibold overflow-x-auto gap-2">
        <button
          onClick={() => setActiveSubTab('ofgem')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'ofgem' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          Ofgem 12-Month Energy Backbilling
        </button>

        <button
          onClick={() => setActiveSubTab('counciltax')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'counciltax' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          Council Tax Discounts & SMI
        </button>

        <button
          onClick={() => setActiveSubTab('broadband')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'broadband' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          Broadband Price Hike Cancellation
        </button>
      </div>

      {/* OFGEM FORM */}
      {activeSubTab === 'ofgem' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="font-bold text-white text-sm">Ofgem 12-Month Backbilling Rule Dispute Generator</h3>
            <p className="text-xs text-slate-400">Demand cancellation of gas/electricity charges older than 12 months under SLC 21BA</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Energy Supplier Name</label>
              <input
                type="text"
                value={energySupplier}
                onChange={(e) => setEnergySupplier(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Energy Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Customer Full Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Disputed Backbilled Amount (£)</label>
              <input
                type="number"
                value={backbilledAmount}
                onChange={(e) => setBackbilledAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-semibold mb-1">Supply Address</label>
            <input
              type="text"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            />
          </div>

          <button
            onClick={handleGenerateOfgem}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Formal Ofgem SLC 21BA Dispute Letter</span>
          </button>
        </div>
      )}

      {/* COUNCIL TAX FORM */}
      {activeSubTab === 'counciltax' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="font-bold text-white text-sm">Council Tax Exemption & Single Person Discount Appeal</h3>
            <p className="text-xs text-slate-400">Formal appeal under Local Government Finance Act 1992 with backdated refund claim</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Local Council Name</label>
              <input
                type="text"
                value={councilName}
                onChange={(e) => setCouncilName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Council Tax Account Number</label>
              <input
                type="text"
                value={councilTaxRef}
                onChange={(e) => setCouncilTaxRef(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Statutory Exemption / Discount Category</label>
              <select
                value={exemptionType}
                onChange={(e) => setExemptionType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              >
                <option value="single">25% Single Adult Resident Discount (Section 11)</option>
                <option value="smi">100% Severe Mental Impairment SMI Exemption (Schedule 1)</option>
                <option value="student">100% Class N Full-Time Student Exemption</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Backdating Claim Period (Years)</label>
              <input
                type="number"
                min={1}
                max={6}
                value={backdateYears}
                onChange={(e) => setBackdateYears(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateCouncilTax}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Building2 className="w-4 h-4" />
            <span>Generate Formal Council Tax Appeal & Refund Claim</span>
          </button>
        </div>
      )}

      {/* BROADBAND FORM */}
      {activeSubTab === 'broadband' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="font-bold text-white text-sm">Broadband & Telecoms Mid-Contract Price Hike Cancellation</h3>
            <p className="text-xs text-slate-400">Invoke Ofcom General Condition C1.6 for penalty-free termination within 30 days</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Telecoms Provider</label>
              <input
                type="text"
                value={telecomProvider}
                onChange={(e) => setTelecomProvider(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Account / Contract Number</label>
              <input
                type="text"
                value={telecomAccount}
                onChange={(e) => setTelecomAccount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-semibold mb-1">Price Hike Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={hikePercentage}
              onChange={(e) => setHikePercentage(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            />
          </div>

          <button
            onClick={handleGenerateBroadband}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Wifi className="w-4 h-4" />
            <span>Generate Penalty-Free 30-Day Cancellation Notice</span>
          </button>
        </div>
      )}
    </div>
  );
};
