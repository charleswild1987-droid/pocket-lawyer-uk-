import React, { useState } from 'react';
import { 
  Briefcase, 
  Calculator, 
  FileText, 
  AlertOctagon, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { aiSentinel } from '../../services/aiSentinel';

interface AccountsTabProps {
  onOpenDocument: (title: string, subtitle: string, content: string) => void;
}

export const AccountsTab: React.FC<AccountsTabProps> = ({ onOpenDocument }) => {
  const { checkAccess } = useSubscription();

  // Late payment calculator state
  const [invoiceAmount, setInvoiceAmount] = useState(2450);
  const [baseRate, setBaseRate] = useState(5.0); // Bank of England rate
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 45); // 45 days ago
    return d.toISOString().split('T')[0];
  });

  // Business info for letter generator
  const [creditorName, setCreditorName] = useState('Swift Freelance Ltd');
  const [debtorName, setDebtorName] = useState('Acme Marketing Agency Ltd');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2024-892');
  const [goodsDescription, setGoodsDescription] = useState('Website redesign, copywriting, and SEO consultancy services');

  // Statutory Demand Warning state
  const [debtorType, setDebtorType] = useState<'company' | 'individual'>('company');

  // Calculations
  const sanitizedAmount = aiSentinel.sanitizeNumber(invoiceAmount, 0, 0);
  const statutoryRate = baseRate + 8.0; // 8% statutory uplift
  const dueDateTime = new Date(dueDate).getTime();
  const nowTime = Date.now();
  const daysOverdue = Math.max(0, Math.floor((nowTime - dueDateTime) / (1000 * 60 * 60 * 24)));

  // Accrued statutory interest formula: (Amount * Rate / 365) * Days
  const accruedInterest = (sanitizedAmount * (statutoryRate / 100) / 365) * daysOverdue;

  // Statutory compensation tier under Section 5A
  let statutoryComp = 40;
  if (sanitizedAmount >= 10000) {
    statutoryComp = 100;
  } else if (sanitizedAmount >= 1000) {
    statutoryComp = 70;
  }

  const totalRecoverable = sanitizedAmount + accruedInterest + statutoryComp;

  const handleGenerateB2BDemand = () => {
    if (!checkAccess('Commercial Debt Recovery Generator')) return;

    const doc = `STRICT B2B FINAL DEMAND FOR PAYMENT
PURSUANT TO THE LATE PAYMENT OF COMMERCIAL DEBTS (INTEREST) ACT 1998 (AS AMENDED)

Date: ${new Date().toLocaleDateString('en-GB')}

To: The Directors / Accounts Payable
${debtorName}

From:
${creditorName}

RE: OVERDUE COMMERCIAL INVOICE ${invoiceNumber} — FORMAL DEMAND PRIOR TO LEGAL PROCEEDINGS

Dear Sirs,

We write regarding outstanding commercial invoice ${invoiceNumber} for the provision of:
${goodsDescription}.

The contractual due date for payment was ${dueDate}. As of today, this payment is ${daysOverdue} days overdue.

STATUTORY ENTITLEMENT:
Under the Late Payment of Commercial Debts (Interest) Act 1998 (as amended by the 2013 Regulations), we are legally entitled to statutory interest at the Bank of England Base Rate plus 8.0% per annum (currently ${statutoryRate.toFixed(2)}%), together with fixed statutory compensation for debt recovery costs under Section 5A.

STATEMENT OF CLAIM:
1. Principal Debt: £${sanitizedAmount.toFixed(2)}
2. Statutory Interest (${daysOverdue} days @ ${statutoryRate.toFixed(2)}% p.a.): £${accruedInterest.toFixed(2)}
3. Section 5A Statutory Debt Recovery Compensation: £${statutoryComp.toFixed(2)}
--------------------------------------------------------------------------------
TOTAL CURRENTLY LAWFULLY DUE: £${totalRecoverable.toFixed(2)}

Please note that statutory interest continues to accrue at the daily rate of £${((sanitizedAmount * (statutoryRate / 100)) / 365).toFixed(2)} until payment in full is received.

FINAL NOTICE:
Unless payment of £${totalRecoverable.toFixed(2)} is received into our nominated bank account within seven (7) days of the date of this letter, we will immediately commence County Court litigation or issue a formal Statutory Demand under the Insolvency Act 1986 without further courtesy notice.

County court proceedings will include claims for court issue fees, solicitors' fixed costs, and ongoing statutory interest under Section 69 of the County Courts Act 1984.

Yours faithfully,

___________________________
Credit Control / Accounts
${creditorName}`;

    onOpenDocument('B2B Late Payment Final Demand Letter', 'Late Payment of Commercial Debts (Interest) Act 1998', doc);
  };

  const handleGenerateStatDemandWarning = () => {
    if (!checkAccess('Statutory Demand Insolvency Warning')) return;

    const minThreshold = debtorType === 'company' ? 750 : 5000;
    if (sanitizedAmount < minThreshold) {
      alert(`Note: The minimum statutory debt threshold for a ${debtorType === 'company' ? 'Corporate Winding-Up Petition' : 'Personal Bankruptcy Petition'} under the Insolvency Act 1986 is £${minThreshold.toLocaleString()}. Your principal debt is £${sanitizedAmount.toFixed(2)}.`);
    }

    const doc = `PRE-INSOLVENCY WARNING NOTICE: INTENTION TO SERVE STATUTORY DEMAND
PURSUANT TO THE INSOLVENCY ACT 1986 (${debtorType === 'company' ? 'SECTION 123(1)(a)' : 'SECTION 268(1)(a)'})

Date: ${new Date().toLocaleDateString('en-GB')}

To: ${debtorName}
From: ${creditorName}

WARNING OF IMPENDING STATUTORY DEMAND & ${debtorType === 'company' ? 'WINDING-UP PETITION' : 'BANKRUPTCY PETITION'}

Take notice that you remain indebted to ${creditorName} in the liquidated sum of £${sanitizedAmount.toFixed(2)} in respect of invoice ${invoiceNumber} which fell due on ${dueDate}.

Under the Insolvency Act 1986, a debtor who fails to satisfy an undisputed debt exceeding £${minThreshold} within 21 days of service of a formal Statutory Demand is legally deemed unable to pay their debts.

Unless the full outstanding sum of £${sanitizedAmount.toFixed(2)} is settled within 7 days of this letter, we will instruct our process servers to formally serve a Statutory Demand (Form 4.1 for companies / Form 6.1 for individuals).

Upon expiry of the 21-day statutory notice period, we will immediately present a Petition to the High Court of Justice (Insolvency and Companies Court) for ${debtorType === 'company' ? 'the compulsory liquidation (Winding Up) of your company and the appointment of the Official Receiver' : 'an Order of Bankruptcy against your personal estate'}.

The presentation of a winding-up petition will result in the immediate freezing of your company's bank accounts under Section 127 of the Insolvency Act 1986.

We strongly advise you to seek independent legal advice if you are unable to satisfy this undisputed debt.

Signed:
___________________________
${creditorName}`;

    onOpenDocument('21-Day Statutory Demand Insolvency Warning', 'Insolvency Act 1986 Pre-Petition Warning', doc);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Accounts & Commercial Debt Recovery Suite</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-400/30 uppercase">
                Late Payment Act 1998
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Calculate Bank of England base rate + 8% statutory interest, £40–£100 recovery compensation, and generate court-ready B2B demands.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Calculator & Demand Letter */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Calculator */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              Statutory Late Payment Interest Calculator
            </h3>
            <span className="text-[10px] text-amber-400 font-mono">BoE + 8%</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Invoice Principal Amount (£)</label>
              <input
                type="number"
                value={invoiceAmount}
                onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Invoice Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bank of England Base Rate (%)</label>
                <input
                  type="number"
                  step="0.25"
                  value={baseRate}
                  onChange={(e) => setBaseRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Results Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Days Overdue</span>
              <span className="font-bold text-amber-400">{daysOverdue} days</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Statutory Rate (BoE + 8%)</span>
              <span className="font-bold text-slate-200">{statutoryRate.toFixed(2)}% p.a.</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Accrued Statutory Interest</span>
              <span className="font-bold text-emerald-400">£{accruedInterest.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Section 5A Statutory Debt Fee</span>
              <span className="font-bold text-emerald-400">£{statutoryComp.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 text-sm font-black">
              <span className="text-white">Total Lawfully Recoverable</span>
              <span className="text-amber-400">£{totalRecoverable.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            💡 <strong>Section 5A Compensation Scale:</strong> £40 for debts under £1,000; £70 for debts between £1,000 and £9,999.99; £100 for debts £10,000 and above. You are entitled to this fee immediately upon an invoice becoming overdue.
          </div>
        </div>

        {/* Letter details */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              B2B Demand & Pre-Insolvency Notice
            </h3>
            <span className="text-[10px] text-blue-400">Court Admissible</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Your Business / Trading Name</label>
              <input
                type="text"
                value={creditorName}
                onChange={(e) => setCreditorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Debtor Company / Client Name</label>
              <input
                type="text"
                value={debtorName}
                onChange={(e) => setDebtorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Invoice Number</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Debtor Entity Type</label>
                <select
                  value={debtorType}
                  onChange={(e) => setDebtorType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                >
                  <option value="company">Limited Company (Min £750)</option>
                  <option value="individual">Sole Trader / Person (Min £5,000)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Description of Goods / Services Supplied</label>
              <input
                type="text"
                value={goodsDescription}
                onChange={(e) => setGoodsDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleGenerateB2BDemand}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Generate B2B Late Payment Final Demand Letter</span>
            </button>

            <button
              onClick={handleGenerateStatDemandWarning}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/30 text-amber-300 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              <span>Generate 21-Day Statutory Demand Warning</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
