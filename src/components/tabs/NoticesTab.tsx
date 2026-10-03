import React, { useState } from 'react';
import { FileText, ShieldAlert, ShoppingBag, Home, Lock, Database, ArrowRight } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';

interface NoticesTabProps {
  onOpenDocument: (title: string, subtitle: string, content: string) => void;
}

export const NoticesTab: React.FC<NoticesTabProps> = ({ onOpenDocument }) => {
  const { checkAccess } = useSubscription();

  const [activeSubTab, setActiveSubTab] = useState<'lba' | 'cra' | 'disrepair' | 'sar' | 'deposit'>('lba');

  // LBA state
  const [claimantName, setClaimantName] = useState('John Doe');
  const [debtorName, setDebtorName] = useState('Apex Contracting Ltd');
  const [debtAmount, setDebtAmount] = useState(1850);
  const [debtReason, setDebtReason] = useState('Unpaid building materials and carpentry services delivered');

  // CRA state
  const [retailerName, setRetailerName] = useState('Currys Retail Ltd');
  const [productName, setProductName] = useState('4K Ultra HD OLED Smart Television');
  const [purchasePrice, setPurchasePrice] = useState(1299);
  const [defectDetails, setDefectDetails] = useState('Screen flickering, spontaneous rebooting, and defective HDMI audio output');

  // Disrepair state
  const [disrepairLandlord, setDisrepairLandlord] = useState('Metropolitan Housing Association');
  const [disrepairAddress, setDisrepairAddress] = useState('Flat 2B, 18 Camden High Street, London, NW1 0JH');
  const [disrepairHazards, setDisrepairHazards] = useState('Severe rising damp and toxic black mould in master bedroom, leaking waste pipe beneath bathroom sink');

  // SAR state
  const [dataController, setDataController] = useState('Barclays Bank UK PLC');
  const [sarDetails, setSarDetails] = useState('All internal underwriting notes, SAR logs, credit assessment notes, and call recordings regarding account 40-12-89 89201482');

  // Deposit penalty state
  const [depositLandlord, setDepositLandlord] = useState('Estate Holdings Ltd');
  const [depositAmount, setDepositAmount] = useState(1500);

  const handleGenerateLBA = () => {
    if (!checkAccess('Letter Before Action Generator')) return;

    const doc = `LETTER BEFORE ACTION (FORMAL NOTICE PURSUANT TO THE CPR PRE-ACTION PROTOCOL)

Date: ${new Date().toLocaleDateString('en-GB')}

To: ${debtorName}
From: ${claimantName}

RE: FORMAL LETTER BEFORE CLAIM — DEBT OWED £${debtAmount.toFixed(2)}

Dear Sirs,

This letter is a formal Letter Before Action sent in compliance with the Pre-Action Protocol for Debt Claims under the Civil Procedure Rules (CPR).

SUMMARY OF CLAIM:
1. You remain indebted to ${claimantName} in the sum of £${debtAmount.toFixed(2)} in respect of:
   ${debtReason}.
2. Despite previous requests, this debt remains unpaid and overdue.

INTEREST:
In the event that court proceedings are issued, we will claim statutory interest pursuant to Section 69 of the County Courts Act 1984 at the rate of 8.0% per annum from the date payment fell due until judgment.

ACTION REQUIRED:
Unless the full sum of £${debtAmount.toFixed(2)} is received into our nominated bank account within fourteen (14) days of the date of this letter, we will issue proceedings in the County Court (Money Claim Online) without further notice.

Should legal proceedings be issued, we will seek recovery of:
- The principal debt of £${debtAmount.toFixed(2)};
- Court issue fees;
- Solicitors' fixed costs (where applicable);
- Accrued statutory interest under Section 69.

Please treat this letter with the utmost urgency.

Yours faithfully,

___________________________
${claimantName}`;

    onOpenDocument('Letter Before Action (LBA)', 'CPR Pre-Action Protocol Compliant Debt Notice', doc);
  };

  const handleGenerateCRA = () => {
    if (!checkAccess('Consumer Rights Act 2015 Rejection Demand')) return;

    const doc = `FORMAL NOTICE OF REJECTION & REFUND DEMAND
PURSUANT TO THE CONSUMER RIGHTS ACT 2015 (CRA 2015)

Date: ${new Date().toLocaleDateString('en-GB')}

To: The Store Manager / Customer Legal Department
${retailerName}

From: ${claimantName}
Product: ${productName}
Purchase Price: £${purchasePrice.toFixed(2)}

RE: FORMAL EXERCISE OF STATUTORY SHORT-TERM RIGHT TO REJECT FAULTY GOODS

Dear Sirs,

I write regarding the purchase of ${productName} for £${purchasePrice.toFixed(2)}.

STATUTORY GROUNDS OF BREACH:
Under the Consumer Rights Act 2015, goods supplied to consumers must be:
- Of satisfactory quality (Section 9);
- Fit for a particular purpose (Section 10);
- As described (Section 11).

The item is inherently defective in breach of these statutory requirements:
${defectDetails}

STATUTORY REMEDY:
As this defect has manifested within the initial 30 days of ownership, I hereby exercise my absolute statutory SHORT-TERM RIGHT TO REJECT under Section 20 and Section 22 of the Consumer Rights Act 2015.

I demand a full 100% refund of £${purchasePrice.toFixed(2)} to my original payment method without deduction.

Please confirm receipt of this rejection and arrangements for collection/return within five (5) working days.

Yours faithfully,

___________________________
${claimantName}`;

    onOpenDocument('Consumer Rights Act 2015 Rejection Demand', 'Statutory Right to Reject Faulty Goods (s.20 CRA)', doc);
  };

  const handleGenerateDisrepair = () => {
    if (!checkAccess('Landlord Disrepair Notice Generator')) return;

    const doc = `FORMAL NOTICE OF HOUSING DISREPAIR & HAZARDS TO HUMAN HEALTH
PURSUANT TO SECTION 11 LANDLORD AND TENANT ACT 1985 & HOMES (FITNESS FOR HUMAN HABITATION) ACT 2018

Date: ${new Date().toLocaleDateString('en-GB')}

To: The Landlord / Housing Manager
${disrepairLandlord}

From: ${claimantName} (Tenant)
Premises: ${disrepairAddress}

RE: URGENT NOTICE OF STATUTORY DISREPAIR DEFECTS & AWAAB'S LAW STANDARDS

Dear Landlord,

I write to give formal notice of substantial housing disrepair and actionable statutory hazards affecting the above premises:

PARTICULARS OF DISREPAIR:
${disrepairHazards}

STATUTORY OBLIGATIONS:
1. Under Section 11 of the Landlord and Tenant Act 1985, you are legally covenant-bound to keep in repair the structure and exterior of the dwelling-house, and to keep in repair and proper working order installations for the supply of water, gas, electricity, sanitation, and space heating.
2. Under the Homes (Fitness for Human Habitation) Act 2018, you are obligated to ensure the property is free from Category 1 and Category 2 hazards under the Housing Health and Safety Rating System (HHSRS), including damp and mould growth.

TIMEFRAME FOR REMEDIAL ACTION:
I require a qualified contractor to inspect the property within forty-eight (48) hours of this letter, and for comprehensive remedial works to commence within fourteen (14) days.

Failure to remedy these hazards will result in immediate notification to the Local Authority Environmental Health Department for an Emergency Remedial Order and the instruction of housing disrepair solicitors to claim general damages and rent reduction.

Yours sincerely,

___________________________
${claimantName}`;

    onOpenDocument('Landlord Disrepair Formal Notice', 'Section 11 Landlord & Tenant Act 1985 Notice', doc);
  };

  const handleGenerateSAR = () => {
    if (!checkAccess('UK GDPR Subject Access Request Generator')) return;

    const doc = `STATUTORY SUBJECT ACCESS REQUEST (SAR)
PURSUANT TO ARTICLE 15 OF THE UK GENERAL DATA PROTECTION REGULATION (UK GDPR) & DATA PROTECTION ACT 2018

Date: ${new Date().toLocaleDateString('en-GB')}

To: The Data Protection Officer (DPO) / Legal Department
${dataController}

Data Subject: ${claimantName}

RE: FORMAL STATUTORY REQUEST FOR COPIES OF PERSONAL DATA (ARTICLE 15 UK GDPR)

Dear Data Protection Officer,

Please accept this letter as a formal Subject Access Request made under Article 15 of the UK GDPR and Section 45 of the Data Protection Act 2018.

SCOPE OF DATA REQUESTED:
I require full, unredacted copies of all personal data relating to me held by your organization, including but not limited to:
${sarDetails}

STATUTORY MANDATE:
1. Strict 1-Month Deadline: Under Article 12(3) of the UK GDPR, you must comply with this request without undue delay and at the latest within one calendar month of receipt.
2. Free of Charge: Under Article 12(5), personal data must be provided completely free of charge.

If you fail to comply within the statutory timeframe, I will immediately submit a formal complaint to the Information Commissioner's Office (ICO) and reserve the right to apply to the County Court for a compliance order and compensation for distress under Section 168 of the Data Protection Act 2018.

Yours faithfully,

___________________________
${claimantName}`;

    onOpenDocument('UK GDPR Subject Access Request (SAR)', 'Article 15 UK GDPR Statutory Data Demand', doc);
  };

  const handleGenerateDepositPenalty = () => {
    if (!checkAccess('Tenancy Deposit Penalty Notice Generator')) return;

    const doc = `FORMAL CLAIM FOR RETURN OF TENANCY DEPOSIT & STATUTORY COMPENSATION (1X TO 3X)
PURSUANT TO SECTIONS 213 & 214 OF THE HOUSING ACT 2004

Date: ${new Date().toLocaleDateString('en-GB')}

To: ${depositLandlord}
From: ${claimantName} (Former Tenant)

RE: UNLAWFUL FAILURE TO PROTECT TENANCY DEPOSIT (£${depositAmount.toFixed(2)}) — NOTICE OF COUNTY COURT CLAIM

Dear Landlord,

I write regarding the tenancy deposit of £${depositAmount.toFixed(2)} paid to you in respect of the tenancy.

STATUTORY NON-COMPLIANCE:
Under Section 213 of the Housing Act 2004 (as amended by the Localism Act 2011), any landlord receiving a tenancy deposit under an Assured Shorthold Tenancy MUST:
1. Protect the deposit in a government-approved scheme within 30 days of receipt;
2. Provide the tenant with full Prescribed Information within 30 days.

You failed to satisfy these mandatory requirements within the statutory 30-day window.

STATUTORY PENALTY:
Under Section 214(4) of the Housing Act 2004, where a landlord breaches Section 213, the court MUST order the landlord to pay to the tenant a statutory penalty of between one and three times the deposit amount (£${depositAmount.toFixed(2)} to £${(depositAmount * 3).toFixed(2)}), in addition to the return of the deposit.

SETTLEMENT OFFER:
To avoid the expense and adverse publicity of County Court Part 8 proceedings, I offer to settle this claim if you remit the sum of £${(depositAmount * 2).toFixed(2)} (full return of deposit plus 1x statutory penalty) within fourteen (14) days.

Failing receipt, proceedings will be commenced without further notice.

Yours sincerely,

___________________________
${claimantName}`;

    onOpenDocument('Tenancy Deposit 1x-3x Penalty Claim Notice', 'Housing Act 2004 s.213 & s.214 Claim', doc);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Pre-Action Protocol & Statutory Notice Generators</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-400/30 uppercase">
                CPR Compliant
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Court-compliant Letters Before Action, CRA 2015 consumer refund demands, housing disrepair notices, GDPR SARs, and tenancy deposit penalty claims.
            </p>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-semibold overflow-x-auto gap-2">
        <button
          onClick={() => setActiveSubTab('lba')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'lba' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Letter Before Action (LBA)
        </button>

        <button
          onClick={() => setActiveSubTab('cra')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'cra' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
          Consumer Rights Act 2015 Rejection
        </button>

        <button
          onClick={() => setActiveSubTab('disrepair')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'disrepair' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-3.5 h-3.5 text-emerald-400" />
          Landlord Disrepair Notice (s.11)
        </button>

        <button
          onClick={() => setActiveSubTab('sar')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'sar' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-purple-400" />
          UK GDPR Subject Access Request
        </button>

        <button
          onClick={() => setActiveSubTab('deposit')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'deposit' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-red-400" />
          Deposit 1x-3x Penalty Claim
        </button>
      </div>

      {/* LBA FORM */}
      {activeSubTab === 'lba' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="font-bold text-white text-sm">Civil Procedure Rules (CPR) Letter Before Action</h3>
            <p className="text-xs text-slate-400">Mandatory pre-action conduct notice prior to issuing County Court Money Claims</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Your Full Name / Trading Name</label>
              <input
                type="text"
                value={claimantName}
                onChange={(e) => setClaimantName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Debtor Name (Person or Company)</label>
              <input
                type="text"
                value={debtorName}
                onChange={(e) => setDebtorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-semibold mb-1">Debt Principal Amount (£)</label>
            <input
              type="number"
              value={debtAmount}
              onChange={(e) => setDebtAmount(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            />
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-semibold mb-1">Factual Basis of Debt</label>
            <input
              type="text"
              value={debtReason}
              onChange={(e) => setDebtReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            />
          </div>

          <button
            onClick={handleGenerateLBA}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Official CPR Letter Before Action</span>
          </button>
        </div>
      )}

      {/* CRA FORM */}
      {activeSubTab === 'cra' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="font-bold text-white text-sm">Consumer Rights Act 2015 30-Day Rejection Demand</h3>
            <p className="text-xs text-slate-400">Demand 100% full refund for faulty goods under Sections 9, 19, 20 & 22 CRA 2015</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Retailer / Seller Company Name</label>
              <input
                type="text"
                value={retailerName}
                onChange={(e) => setRetailerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Product Description</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Purchase Price (£)</label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Defects / Fault Details</label>
              <input
                type="text"
                value={defectDetails}
                onChange={(e) => setDefectDetails(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateCRA}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Generate Statutory Rejection & 100% Refund Demand</span>
          </button>
        </div>
      )}

      {/* DISREPAIR FORM */}
      {activeSubTab === 'disrepair' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="font-bold text-white text-sm">Section 11 Landlord Disrepair & Damp Hazard Notice</h3>
            <p className="text-xs text-slate-400">Formal legal notice under Landlord & Tenant Act 1985 & Homes Act 2018</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Landlord / Housing Association</label>
              <input
                type="text"
                value={disrepairLandlord}
                onChange={(e) => setDisrepairLandlord(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Rented Property Address</label>
              <input
                type="text"
                value={disrepairAddress}
                onChange={(e) => setDisrepairAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-semibold mb-1">Disrepair Hazards (Damp, Mould, Leaks, Boiler)</label>
            <textarea
              rows={3}
              value={disrepairHazards}
              onChange={(e) => setDisrepairHazards(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            />
          </div>

          <button
            onClick={handleGenerateDisrepair}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Generate Formal Landlord Disrepair Notice</span>
          </button>
        </div>
      )}

      {/* SAR FORM */}
      {activeSubTab === 'sar' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="font-bold text-white text-sm">UK GDPR Subject Access Request (Article 15 SAR)</h3>
            <p className="text-xs text-slate-400">Statutory demand for your personal data • Strictly 1 calendar month deadline • Strictly free</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Company / Data Controller</label>
              <input
                type="text"
                value={dataController}
                onChange={(e) => setDataController(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Your Full Name</label>
              <input
                type="text"
                value={claimantName}
                onChange={(e) => setClaimantName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-semibold mb-1">Scope of Personal Data Requested</label>
            <textarea
              rows={3}
              value={sarDetails}
              onChange={(e) => setSarDetails(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            />
          </div>

          <button
            onClick={handleGenerateSAR}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Database className="w-4 h-4" />
            <span>Generate Statutory UK GDPR Article 15 SAR Demand</span>
          </button>
        </div>
      )}

      {/* DEPOSIT PENALTY FORM */}
      {activeSubTab === 'deposit' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="font-bold text-white text-sm">Tenancy Deposit Non-Protection Penalty Notice</h3>
            <p className="text-xs text-slate-400">Housing Act 2004 s.213 & s.214 • Claim full deposit return plus 1x to 3x compensation</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Landlord / Agency Name</label>
              <input
                type="text"
                value={depositLandlord}
                onChange={(e) => setDepositLandlord(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Original Deposit Paid (£)</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="text-slate-400">Potential Statutory Recovery:</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">
              £{depositAmount} (Original Deposit) + £{depositAmount} to £{depositAmount * 3} (1x–3x Statutory Penalty)
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Under Section 214(4) of the Housing Act 2004, the court has no discretion to dismiss the penalty if the deposit was not protected or prescribed info served within 30 days.
            </p>
          </div>

          <button
            onClick={handleGenerateDepositPenalty}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Generate Deposit Penalty Demand Letter</span>
          </button>
        </div>
      )}
    </div>
  );
};
