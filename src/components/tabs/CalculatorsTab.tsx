import React, { useState } from 'react';
import { Calculator, Clock, DollarSign, AlertTriangle, ShieldCheck, Scale, CheckCircle } from 'lucide-react';
import { aiSentinel } from '../../services/aiSentinel';
import { useSubscription } from '../../context/SubscriptionContext';

export const CalculatorsTab: React.FC = () => {
  const { checkAccess } = useSubscription();

  const [activeSubTab, setActiveSubTab] = useState<'redundancy' | 'limitation' | 'courtfee'>('redundancy');

  // Redundancy state
  const [employeeAge, setEmployeeAge] = useState(44);
  const [yearsOfService, setYearsOfService] = useState(8);
  const [weeklyPay, setWeeklyPay] = useState(650);
  const STATUTORY_WEEKLY_CAP = 700; // statutory cap

  // Limitation state
  const [claimType, setClaimType] = useState<'contract' | 'deed' | 'tort' | 'injury' | 'defamation' | 'rent'>('contract');
  const [causeDate, setCauseDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 2);
    return d.toISOString().split('T')[0];
  });

  // Court fee state
  const [claimValue, setClaimValue] = useState(4500);

  // Redundancy calculation
  const sanitizedAge = aiSentinel.sanitizeNumber(employeeAge, 18, 16, 90);
  const sanitizedService = aiSentinel.sanitizeNumber(yearsOfService, 0, 0, 20); // max 20 years
  const cappedWeeklyPay = Math.min(aiSentinel.sanitizeNumber(weeklyPay, 0, 0), STATUTORY_WEEKLY_CAP);

  // Notice period calculation (ERA 1996 s.86)
  let noticeWeeks = 1;
  if (sanitizedService >= 2) {
    noticeWeeks = Math.min(12, sanitizedService);
  }

  // Statutory redundancy formula:
  // For years under 22: 0.5 week
  // For years 22 to 40: 1.0 week
  // For years 41+: 1.5 weeks
  // Let's compute based on age at end of each service year
  let totalWeeksPay = 0;
  for (let i = 0; i < sanitizedService; i++) {
    const ageAtYear = sanitizedAge - i;
    if (ageAtYear > 40) {
      totalWeeksPay += 1.5;
    } else if (ageAtYear >= 22) {
      totalWeeksPay += 1.0;
    } else {
      totalWeeksPay += 0.5;
    }
  }
  const statutoryRedundancyPay = totalWeeksPay * cappedWeeklyPay;

  // Limitation calculation
  let limitationYears = 6;
  if (claimType === 'deed') limitationYears = 12;
  if (claimType === 'injury') limitationYears = 3;
  if (claimType === 'defamation') limitationYears = 1;

  const causeDateTime = new Date(causeDate).getTime();
  const deadlineDate = new Date(causeDateTime);
  deadlineDate.setFullYear(deadlineDate.getFullYear() + limitationYears);
  const msRemaining = deadlineDate.getTime() - Date.now();
  const daysRemaining = Math.floor(msRemaining / (1000 * 60 * 60 * 24));
  const isTimeBarred = daysRemaining <= 0;

  // Court fee & track calculation
  let cprTrack = 'Small Claims Track (Litigants in Person - No Adverse Legal Costs)';
  let courtFee = 35;

  if (claimValue <= 300) courtFee = 35;
  else if (claimValue <= 500) courtFee = 50;
  else if (claimValue <= 1000) courtFee = 70;
  else if (claimValue <= 1500) courtFee = 80;
  else if (claimValue <= 3000) courtFee = 115;
  else if (claimValue <= 5000) courtFee = 205;
  else if (claimValue <= 10000) courtFee = 455;
  else if (claimValue <= 200000) courtFee = Math.round(claimValue * 0.05);
  else courtFee = 10000;

  if (claimValue > 100000) cprTrack = 'Multi-Track (High Court / Complex Disputes)';
  else if (claimValue > 25000) cprTrack = 'Intermediate Track (£25,000 to £100,000)';
  else if (claimValue > 10000) cprTrack = 'Fast Track (£10,000 to £25,000)';

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-blue-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">UK Statutory Calculators & Diagnostics</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30 uppercase">
                ERA 1996 • Limitation Act 1980 • CPR
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Statutory redundancy pay, minimum notice periods, strict limitation deadlines, and HMCTS County Court issue fees.
            </p>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-semibold overflow-x-auto gap-2">
        <button
          onClick={() => setActiveSubTab('redundancy')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'redundancy' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          Redundancy & Notice Calculator
        </button>

        <button
          onClick={() => setActiveSubTab('limitation')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'limitation' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          Limitation Period Deadline Checker
        </button>

        <button
          onClick={() => setActiveSubTab('courtfee')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'courtfee' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          Court Issue Fee & Track Estimator
        </button>
      </div>

      {/* REDUNDANCY CALCULATOR */}
      {activeSubTab === 'redundancy' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-white text-sm">Statutory Redundancy Pay & Notice Calculator</h3>
              <p className="text-xs text-slate-400">Employment Rights Act 1996 s.162 & s.86</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Statutory Redundancy Pay</span>
              <div className="text-2xl font-black text-amber-400">£{statutoryRedundancyPay.toFixed(2)}</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Employee Age</label>
              <input
                type="number"
                value={employeeAge}
                onChange={(e) => setEmployeeAge(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Continuous Service (Years, max 20)</label>
              <input
                type="number"
                min={0}
                max={20}
                value={yearsOfService}
                onChange={(e) => setYearsOfService(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Gross Weekly Pay (£)</label>
              <input
                type="number"
                value={weeklyPay}
                onChange={(e) => setWeeklyPay(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>Statutory Pay Breakdown</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Total Statutory Weeks:</span>
                <span className="font-bold text-slate-200">{totalWeeksPay} weeks</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Weekly Pay Used:</span>
                <span className="font-bold text-slate-200">£{cappedWeeklyPay.toFixed(2)} (Cap: £{STATUTORY_WEEKLY_CAP})</span>
              </div>
              <div className="flex justify-between pt-1 font-bold">
                <span className="text-white">Tax Status:</span>
                <span className="text-emerald-400">100% Tax-Free (under HMRC £30,000 threshold)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Statutory Minimum Notice Period</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Service Duration:</span>
                <span className="font-bold text-slate-200">{sanitizedService} complete years</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Statutory Notice:</span>
                <span className="font-bold text-blue-400">{noticeWeeks} weeks' paid notice</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                Under s.86 ERA 1996, employees with 2+ years' service are entitled to 1 week's notice per complete year (up to 12 weeks).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LIMITATION CALCULATOR */}
      {activeSubTab === 'limitation' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-white text-sm">Limitation Act 1980 Statutory Deadline Checker</h3>
              <p className="text-xs text-slate-400">Computes exact statutory time-bars for issuing County Court or High Court claims</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Statutory Deadline</span>
              <div className={`text-xl font-black ${isTimeBarred ? 'text-red-400' : 'text-emerald-400'}`}>
                {deadlineDate.toLocaleDateString('en-GB')}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Cause of Action / Claim Type</label>
              <select
                value={claimType}
                onChange={(e) => setClaimType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              >
                <option value="contract">Breach of Simple Contract (6 Years - s.5)</option>
                <option value="deed">Contract Executed as a Deed / Specialty (12 Years - s.8)</option>
                <option value="tort">General Tort & Negligence (6 Years - s.2)</option>
                <option value="injury">Personal Injury & Clinical Negligence (3 Years - s.11)</option>
                <option value="defamation">Defamation / Libel / Slander (Strictly 1 Year - s.4A)</option>
                <option value="rent">Landlord & Tenant Rent Arrears (6 Years - s.19)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Date Cause of Action Accrued (Breach/Injury Date)</label>
              <input
                type="date"
                value={causeDate}
                onChange={(e) => setCauseDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Statutory Limitation Period:</span>
              <span className="font-bold text-slate-200">{limitationYears} Years</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Time Remaining:</span>
              <span className={`font-bold ${isTimeBarred ? 'text-red-400' : 'text-emerald-400'}`}>
                {isTimeBarred ? `Time-Barred (${Math.abs(daysRemaining)} days ago)` : `${daysRemaining} days remaining`}
              </span>
            </div>
            <div className="pt-2 text-[11px] leading-relaxed">
              {isTimeBarred ? (
                <div className="text-red-400 flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>CLAIM TIME-BARRED: Under the Limitation Act 1980, the defendant has a complete statutory defence to strike out this claim with costs.</span>
                </div>
              ) : (
                <div className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Claim is within statutory limitation. Ensure a CPR Letter Before Action is served prior to issuing.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* COURT FEE & TRACK */}
      {activeSubTab === 'courtfee' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-white text-sm">HMCTS County Court Issue Fee & Allocation Track Estimator</h3>
              <p className="text-xs text-slate-400">Official HMCTS civil court fee scale (EX50) & Civil Procedure Rules (CPR)</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Court Issue Fee</span>
              <div className="text-2xl font-black text-emerald-400">£{courtFee}</div>
            </div>
          </div>

          <div className="text-xs max-w-sm">
            <label className="block text-slate-300 font-semibold mb-1">Claim Value / Amount Claimed (£)</label>
            <input
              type="number"
              value={claimValue}
              onChange={(e) => setClaimValue(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Allocated CPR Court Track:</span>
              <span className="font-bold text-amber-400">{cprTrack}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Court Issue Fee:</span>
              <span className="font-bold text-emerald-400">£{courtFee} (recoverable from defendant if successful)</span>
            </div>
            <div className="pt-2 text-[11px] text-slate-400 leading-relaxed">
              💡 <strong>Small Claims Protection:</strong> On claims up to £10,000, the general rule is "no adverse legal costs". Even if you lose, you generally only pay the other side's court issue fee and limited fixed expenses, making it safe for litigants in person.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
