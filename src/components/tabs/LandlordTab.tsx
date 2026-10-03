import React, { useState } from 'react';
import { 
  Home, 
  FileText, 
  CheckSquare, 
  AlertCircle, 
  Key, 
  Calendar, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';

interface LandlordTabProps {
  onOpenDocument: (title: string, subtitle: string, content: string) => void;
}

export const LandlordTab: React.FC<LandlordTabProps> = ({ onOpenDocument }) => {
  const { checkAccess } = useSubscription();

  const [activeSubTab, setActiveSubTab] = useState<'s13' | 's8' | 'entry' | 's21diagnostic'>('s13');

  // S13 State
  const [s13Tenant, setS13Tenant] = useState('John Doe');
  const [s13Address, setS13Address] = useState('Flat 4, 12 Victoria Road, London, SW1A 1AA');
  const [s13CurrentRent, setS13CurrentRent] = useState(1200);
  const [s13NewRent, setS13NewRent] = useState(1350);
  const [s13StartingDate, setS13StartingDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    return d.toISOString().split('T')[0];
  });
  const [s13Landlord, setS13Landlord] = useState('Landlord Services Ltd');

  // S8 State
  const [s8Tenant, setS8Tenant] = useState('Jane Smith');
  const [s8Address, setS8Address] = useState('22 High Street, Manchester, M1 1AA');
  const [s8Ground, setS8Ground] = useState<'ground8' | 'ground10' | 'ground14'>('ground8');
  const [s8ArrearsAmount, setS8ArrearsAmount] = useState(3200);
  const [s8Landlord, setS8Landlord] = useState('Apex Properties UK');

  // 24h Entry Notice State
  const [entryTenant, setEntryTenant] = useState('John Doe');
  const [entryAddress, setEntryAddress] = useState('Flat 4, 12 Victoria Road, London, SW1A 1AA');
  const [entryDate, setEntryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [entryTime, setEntryTime] = useState('10:00 AM');
  const [entryReason, setEntryReason] = useState('Annual Gas Safety Inspection (CP12) and boiler service');
  const [entryLandlord, setEntryLandlord] = useState('Landlord Services Ltd');

  // S21 Diagnostic Checkpoints
  const [s21Checks, setS21Checks] = useState({
    depositProtected30Days: true,
    prescribedInfoServed: true,
    epcProvided: true,
    gasSafetyCP12Served: true,
    howToRentServed: true,
    noticeAtLeastTwoMonths: true,
    fixedTermNotBreached: true,
    noCouncilImprovementNotice: true
  });

  const handleGenerateS13 = () => {
    if (!checkAccess('Section 13 Rent Increase Generator')) return;

    const doc = `FORM 4: HOUSING ACT 1988 SECTION 13(2)
LANDLORD'S NOTICE PROPOSING A NEW RENT UNDER AN ASSURED PERIODIC TENANCY

To the Tenant(s): ${s13Tenant}
Of Premises: ${s13Address}

1. The landlord is proposing a new rent of £${s13NewRent.toFixed(2)} per calendar month.
2. The current rent is £${s13CurrentRent.toFixed(2)} per calendar month.
3. The starting date for the proposed new rent is: ${s13StartingDate}.
   (Note: Statutory notice must be at least one full rental period or one calendar month).

4. Landlord Details:
   Name: ${s13Landlord}
   Date of Notice: ${new Date().toLocaleDateString('en-GB')}

IMPORTANT INFORMATION FOR THE TENANT:
- If you accept the proposed new rent, you do not need to do anything. Simply pay the new amount starting on ${s13StartingDate}.
- If you DO NOT accept the proposed new rent, you MUST refer this notice to the First-tier Tribunal (Property Chamber) before the starting date stated in paragraph 3 above using Form Rent 1.
- If you do not refer this notice to the Tribunal before the starting date, the new rent will automatically become legally binding.

Signed: ___________________________
On behalf of: ${s13Landlord}
Date: ${new Date().toLocaleDateString('en-GB')}`;

    onOpenDocument('Section 13 Rent Increase Notice (Form 4)', 'Statutory Notice under Housing Act 1988 s.13', doc);
  };

  const handleGenerateS8 = () => {
    if (!checkAccess('Section 8 Possession Notice Generator')) return;

    let groundsText = '';
    let noticePeriodDays = 14;

    if (s8Ground === 'ground8') {
      groundsText = `GROUND 8 (Mandatory Arrears Ground - Schedule 2 Housing Act 1988):
Both at the date of the service of this notice and at the date of the court hearing, at least two months' rent is lawfully unpaid (rent being payable monthly). The current outstanding balance is £${s8ArrearsAmount.toFixed(2)}.`;
      noticePeriodDays = 14;
    } else if (s8Ground === 'ground10') {
      groundsText = `GROUND 10 & 11 (Discretionary Arrears & Persistent Delay - Schedule 2 Housing Act 1988):
Some rent lawfully due from the tenant is unpaid on the date on which proceedings for possession are begun, and the tenant has persistently delayed paying rent which has become lawfully due.`;
      noticePeriodDays = 14;
    } else {
      groundsText = `GROUND 14 (Nuisance / Anti-Social Behaviour - Schedule 2 Housing Act 1988):
The tenant or a person residing in or visiting the dwelling-house has been guilty of conduct causing or likely to cause a nuisance or annoyance to a person residing, visiting or otherwise engaging in a lawful activity in the locality.`;
      noticePeriodDays = 0; // immediate
    }

    const doc = `FORM 3: SECTION 8 NOTICE SEEKING POSSESSION OF A PROPERTY LET ON AN ASSURED SHORTHOLD TENANCY
Pursuant to Section 8 of the Housing Act 1988 (as amended)

To: ${s8Tenant}
Address: ${s8Address}

1. The Landlord intends to apply to the County Court for an order for possession of the property.
2. The grounds on which the landlord relies are:
   ${groundsText}

3. Particulars of Grounds:
   The tenant is in breach of their tenancy obligations regarding rental payments / tenancy conduct. As of today, the total rent arrears stand at £${s8ArrearsAmount.toFixed(2)}.

4. The Court proceedings will not begin until after:
   ${new Date(Date.now() + noticePeriodDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}
   ${noticePeriodDays === 0 ? '(Immediate court proceedings under Ground 14 nuisance provisions)' : `(Minimum ${noticePeriodDays} days statutory notice requirement)`}

Landlord / Agent: ${s8Landlord}
Date of Notice: ${new Date().toLocaleDateString('en-GB')}

Signed: ___________________________`;

    onOpenDocument('Section 8 Notice Seeking Possession (Form 3)', 'Housing Act 1988 Schedule 2 Notice', doc);
  };

  const handleGenerateEntry = () => {
    if (!checkAccess('Landlord 24h Notice of Entry')) return;

    const doc = `FORMAL NOTICE OF INSPECTION / ENTRY (24 HOURS' STATUTORY NOTICE)
Pursuant to Section 11(6) of the Landlord and Tenant Act 1985

Date: ${new Date().toLocaleDateString('en-GB')}

To: ${entryTenant}
Property: ${entryAddress}

Dear ${entryTenant},

Please accept this letter as formal statutory written notice of our intention to access the above property on:

Date of Visit: ${entryDate}
Approximate Time: ${entryTime}
Purpose of Entry: ${entryReason}

LEGAL BASIS:
Under Section 11(6) of the Landlord and Tenant Act 1985, the landlord or an authorized agent is entitled to enter the premises for the purpose of viewing their condition and state of repair, having given at least 24 hours' notice in writing to the tenant.

We always respect your right to quiet enjoyment of the premises. If the scheduled time is inconvenient, please contact us immediately to reschedule for another mutually agreed slot within 48 hours.

Yours sincerely,

___________________________
${entryLandlord}
Contact Telephone / Email`;

    onOpenDocument('Landlord 24-Hour Notice of Entry', 'Section 11(6) Landlord & Tenant Act 1985', doc);
  };

  // Section 21 validity score
  const totalChecks = Object.keys(s21Checks).length;
  const passedChecks = Object.values(s21Checks).filter(Boolean).length;
  const isS21Valid = passedChecks === totalChecks;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-blue-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Landlord & Property Legal Suite</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30 uppercase">
                Housing Acts 1988 & 2004
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Statutory rent increases (Form 4), Section 8 possession notices, 24h entry, and Section 21 validity audit.
            </p>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-semibold overflow-x-auto gap-2">
        <button
          onClick={() => setActiveSubTab('s13')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 's13' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Section 13 Rent Increase (Form 4)
        </button>

        <button
          onClick={() => setActiveSubTab('s8')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 's8' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-red-400" />
          Section 8 Possession (Form 3)
        </button>

        <button
          onClick={() => setActiveSubTab('entry')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'entry' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Key className="w-3.5 h-3.5 text-emerald-400" />
          24h Notice of Entry
        </button>

        <button
          onClick={() => setActiveSubTab('s21diagnostic')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 's21diagnostic' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
          Section 21 Validity Diagnostic
        </button>
      </div>

      {/* S13 FORM */}
      {activeSubTab === 's13' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-white text-sm">Section 13(2) Rent Increase Generator</h3>
              <p className="text-xs text-slate-400">Generates court-admissible Form 4 for periodic Assured Shorthold Tenancies</p>
            </div>
            <span className="text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
              Min 1 Month Notice Required
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tenant Name(s)</label>
              <input
                type="text"
                value={s13Tenant}
                onChange={(e) => setS13Tenant(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Landlord / Agency Name</label>
              <input
                type="text"
                value={s13Landlord}
                onChange={(e) => setS13Landlord(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-semibold mb-1">Rental Property Full Address</label>
            <input
              type="text"
              value={s13Address}
              onChange={(e) => setS13Address(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Current Rent (£/mo)</label>
              <input
                type="number"
                value={s13CurrentRent}
                onChange={(e) => setS13CurrentRent(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Proposed New Rent (£/mo)</label>
              <input
                type="number"
                value={s13NewRent}
                onChange={(e) => setS13NewRent(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Proposed Starting Date</label>
              <input
                type="date"
                value={s13StartingDate}
                onChange={(e) => setS13StartingDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            💡 <strong>Statutory Requirement:</strong> The proposed starting date must be at least 1 calendar month after service of this notice (or one full tenancy period if tenancy is weekly/quarterly). The increase can only take place once every 12 months.
          </div>

          <button
            onClick={handleGenerateS13}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Official Form 4 Notice</span>
          </button>
        </div>
      )}

      {/* S8 FORM */}
      {activeSubTab === 's8' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-white text-sm">Section 8 Notice Seeking Possession (Form 3)</h3>
              <p className="text-xs text-slate-400">Statutory eviction notice under Housing Act 1988 Schedule 2</p>
            </div>
            <span className="text-[10px] text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/30">
              Ground 8 = Mandatory
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tenant Full Name</label>
              <input
                type="text"
                value={s8Tenant}
                onChange={(e) => setS8Tenant(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Landlord / Freeholder Name</label>
              <input
                type="text"
                value={s8Landlord}
                onChange={(e) => setS8Landlord(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-semibold mb-1">Property Address</label>
            <input
              type="text"
              value={s8Address}
              onChange={(e) => setS8Address(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Statutory Eviction Ground</label>
              <select
                value={s8Ground}
                onChange={(e) => setS8Ground(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              >
                <option value="ground8">Ground 8: Mandatory 2+ Months Rent Arrears (2 weeks notice)</option>
                <option value="ground10">Ground 10 & 11: Discretionary Arrears & Persistent Delay (2 weeks)</option>
                <option value="ground14">Ground 14: Anti-Social Behaviour / Nuisance (Immediate)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Outstanding Rent Arrears (£)</label>
              <input
                type="number"
                value={s8ArrearsAmount}
                onChange={(e) => setS8ArrearsAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateS8}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Formal Section 8 Notice (Form 3)</span>
          </button>
        </div>
      )}

      {/* 24H NOTICE ENTRY */}
      {activeSubTab === 'entry' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="font-bold text-white text-sm">Landlord 24-Hour Notice of Entry</h3>
            <p className="text-xs text-slate-400">Statutory inspection notice pursuant to Section 11(6) Landlord and Tenant Act 1985</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tenant Name</label>
              <input
                type="text"
                value={entryTenant}
                onChange={(e) => setEntryTenant(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Landlord / Agent</label>
              <input
                type="text"
                value={entryLandlord}
                onChange={(e) => setEntryLandlord(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-semibold mb-1">Property Address</label>
            <input
              type="text"
              value={entryAddress}
              onChange={(e) => setEntryAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Date of Visit (Min 24h away)</label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Time of Visit</label>
              <input
                type="text"
                value={entryTime}
                onChange={(e) => setEntryTime(e.target.value)}
                placeholder="e.g. 10:00 AM - 12:00 PM"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-semibold mb-1">Reason for Entry</label>
            <input
              type="text"
              value={entryReason}
              onChange={(e) => setEntryReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            />
          </div>

          <button
            onClick={handleGenerateEntry}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Key className="w-4 h-4" />
            <span>Generate 24-Hour Notice of Entry Letter</span>
          </button>
        </div>
      )}

      {/* S21 DIAGNOSTIC */}
      {activeSubTab === 's21diagnostic' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">Section 21 "No-Fault" Eviction Validity Diagnostic</h3>
              <p className="text-xs text-slate-400">8-point statutory audit under Deregulation Act 2015 & Housing Act 1988</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              isS21Valid ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-red-950 text-red-400 border border-red-500/30'
            }`}>
              {isS21Valid ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              <span>{isS21Valid ? 'Section 21 Valid' : 'Notice Defective / Void'}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { key: 'depositProtected30Days', label: 'Tenancy Deposit protected in an authorized government scheme within 30 days of receipt (Housing Act 2004 s.213)' },
              { key: 'prescribedInfoServed', label: 'Prescribed Information regarding the deposit scheme served on tenant within 30 days' },
              { key: 'epcProvided', label: 'Valid Energy Performance Certificate (EPC) rating E or above served prior to tenancy start' },
              { key: 'gasSafetyCP12Served', label: 'Valid Gas Safety Certificate (CP12) served prior to tenant moving in (Trecarrell House v Rouncefield)' },
              { key: 'howToRentServed', label: 'Government "How to Rent: The checklist for renting in England" booklet served at start of tenancy' },
              { key: 'noticeAtLeastTwoMonths', label: 'At least two full months of written notice provided on official Form 6A' },
              { key: 'fixedTermNotBreached', label: 'Notice expiry date is NOT before the end of the fixed term of the tenancy' },
              { key: 'noCouncilImprovementNotice', label: 'No local council Improvement Notice or Emergency Remedial Action served in last 6 months (Retaliatory eviction bar)' }
            ].map((item) => (
              <label 
                key={item.key}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 hover:border-slate-700 transition cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={(s21Checks as any)[item.key]}
                  onChange={(e) => setS21Checks({ ...s21Checks, [item.key]: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-amber-500"
                />
                <span className="text-slate-300">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="font-bold text-slate-200 mb-1">
              Diagnostic Verdict: {passedChecks} / {totalChecks} Statutory Prerequisites Met
            </div>
            {isS21Valid ? (
              <p className="text-emerald-400 text-[11px]">
                ✅ All statutory prerequisites appear satisfied. The landlord may issue County Court possession proceedings on Form N5B accelerated procedure.
              </p>
            ) : (
              <p className="text-red-400 text-[11px]">
                ❌ <strong>DEFECTIVE NOTICE:</strong> Any missing prerequisite makes Form 6A legally invalid. If the landlord issues court proceedings, the tenant can request a strike-out and seek legal costs. Furthermore, failure to protect deposits exposes the landlord to 1x to 3x compensation claims.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
