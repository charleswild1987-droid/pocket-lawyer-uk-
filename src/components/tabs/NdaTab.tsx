import React, { useState } from 'react';
import { Shield, FileText, CheckCircle, Lock, Calendar, Users, Sparkles } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';

interface NdaTabProps {
  onOpenDocument: (title: string, subtitle: string, content: string) => void;
}

export const NdaTab: React.FC<NdaTabProps> = ({ onOpenDocument }) => {
  const { checkAccess } = useSubscription();

  const [ndaType, setNdaType] = useState<'mutual' | 'unilateral'>('mutual');
  const [partyA, setPartyA] = useState('Alpha Innovations Ltd');
  const [partyB, setPartyB] = useState('Beta Solutions Ltd');
  const [purpose, setPurpose] = useState('commercial partnership and technology integration evaluation');
  const [durationYears, setDurationYears] = useState(3);
  const [includeNonSolicit, setIncludeNonSolicit] = useState(true);

  const handleGenerateNDA = () => {
    if (!checkAccess('Non-Disclosure Agreement Generator')) return;

    const nonSolicitClause = includeNonSolicit
      ? `\n7. NON-SOLICITATION OF EMPLOYEES
7.1 The Receiving Party agrees that for a period of 12 months from the date of this Agreement, it shall not directly or indirectly solicit, entice away, or offer employment to any senior employee or key contractor of the Disclosing Party who was introduced in connection with the Permitted Purpose, without the prior written consent of the Disclosing Party.`
      : '';

    const preamble = ndaType === 'mutual'
      ? `NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT (MUTUAL)
GOVERNED BY THE LAWS OF ENGLAND AND WALES

THIS AGREEMENT is dated ${new Date().toLocaleDateString('en-GB')}

BETWEEN:
(1) ${partyA} ("Party A")
(2) ${partyB} ("Party B")
(together, the "Parties" and each a "Party")`
      : `NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT (UNILATERAL / ONE-WAY)
GOVERNED BY THE LAWS OF ENGLAND AND WALES

THIS AGREEMENT is dated ${new Date().toLocaleDateString('en-GB')}

BETWEEN:
(1) ${partyA} (the "Disclosing Party")
(2) ${partyB} (the "Receiving Party")`;

    const doc = `${preamble}

RECITALS:
The Parties wish to enter into discussions regarding ${purpose} (the "Permitted Purpose"). In connection with these discussions, certain proprietary and confidential information will be disclosed.

IT IS AGREED AS FOLLOWS:

1. DEFINITION OF CONFIDENTIAL INFORMATION
1.1 "Confidential Information" means all information of a confidential nature, whether oral, written, electronic, or visual, disclosed by or on behalf of the Disclosing Party to the Receiving Party, including but not limited to business plans, financial data, customer lists, software source code, specifications, algorithms, intellectual property, and trade secrets.

2. OBLIGATIONS OF THE RECEIVING PARTY
2.1 The Receiving Party shall:
    (a) keep the Confidential Information strictly secret and confidential;
    (b) not disclose the Confidential Information to any third party without the prior written consent of the Disclosing Party;
    (c) use the Confidential Information solely for the Permitted Purpose;
    (d) apply the same degree of care to protect the Confidential Information as it applies to its own confidential information, being not less than a reasonable degree of care;
    (e) disclose Confidential Information only to those of its directors, officers, employees, and professional advisers who need to know such information for the Permitted Purpose and who are bound by confidentiality obligations no less onerous than those set out herein.

3. EXCLUSIONS FROM CONFIDENTIALITY
3.1 The obligations in Clause 2 shall not apply to information that:
    (a) is or becomes publicly known through no breach of this Agreement;
    (b) was already lawfully known to the Receiving Party prior to disclosure;
    (c) is lawfully acquired from a third party free of any confidentiality restriction; or
    (d) is required to be disclosed by order of a court of competent jurisdiction, regulatory authority, or statute, provided reasonable prior notice is given to the Disclosing Party.

4. RETURN OR DESTRUCTION OF MATERIALS
4.1 Upon written request from the Disclosing Party or upon conclusion of discussions, the Receiving Party shall promptly return or destroy (and certify destruction of) all documents, files, notes, and digital media containing Confidential Information.

5. DURATION OF OBLIGATIONS
5.1 The obligations of confidentiality under this Agreement shall remain in full force and effect for a period of ${durationYears} years from the date hereof. Provided however, that in respect of any Confidential Information that constitutes a trade secret under English law, the obligations shall survive indefinitely.

6. INJUNCTIVE RELIEF
6.1 The Receiving Party acknowledges that damages alone would not be an adequate remedy for any breach of this Agreement and that the Disclosing Party shall be entitled to seek injunctive relief, specific performance, or other equitable remedies in any court of competent jurisdiction.${nonSolicitClause}

8. THIRD PARTY RIGHTS
8.1 A person who is not a party to this Agreement shall have no rights under the Contracts (Rights of Third Parties) Act 1999 to enforce any of its terms.

9. GOVERNING LAW AND JURISDICTION
9.1 This Agreement and any dispute or claim arising out of or in connection with it or its subject matter or formation (including non-contractual disputes or claims) shall be governed by and construed in accordance with the law of England and Wales.
9.2 Each party irrevocably agrees that the courts of England and Wales shall have exclusive jurisdiction to settle any dispute or claim arising out of or in connection with this Agreement.

IN WITNESS WHEREOF, the Parties have executed this Agreement on the date first written above:

Signed for and on behalf of ${partyA}:
Signature: ___________________________
Name: ___________________________
Title: Director / Authorized Signatory

Signed for and on behalf of ${partyB}:
Signature: ___________________________
Name: ___________________________
Title: Director / Authorized Signatory`;

    onOpenDocument('Non-Disclosure Agreement (NDA)', `England & Wales Court-Ready ${ndaType === 'mutual' ? 'Mutual' : 'Unilateral'} NDA`, doc);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Court-Ready Non-Disclosure Agreement (NDA) Generator</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-400/30 uppercase">
                England & Wales
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Generate fully court-admissible Mutual or Unilateral confidentiality agreements with non-solicitation and trade secret protections.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Agreement Structure</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setNdaType('mutual')}
                className={`py-2 px-3 rounded-lg border font-semibold transition cursor-pointer ${
                  ndaType === 'mutual' 
                    ? 'bg-purple-600/30 border-purple-400 text-purple-200' 
                    : 'bg-slate-950 border-slate-700 text-slate-400'
                }`}
              >
                Mutual (Both Disclose)
              </button>
              <button
                type="button"
                onClick={() => setNdaType('unilateral')}
                className={`py-2 px-3 rounded-lg border font-semibold transition cursor-pointer ${
                  ndaType === 'unilateral' 
                    ? 'bg-purple-600/30 border-purple-400 text-purple-200' 
                    : 'bg-slate-950 border-slate-700 text-slate-400'
                }`}
              >
                Unilateral (One-Way)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Confidentiality Duration</label>
            <select
              value={durationYears}
              onChange={(e) => setDurationYears(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-semibold"
            >
              <option value={2}>2 Years (Standard commercial evaluation)</option>
              <option value={3}>3 Years (Software & technology collaboration)</option>
              <option value={5}>5 Years (High-value IP & investments)</option>
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {ndaType === 'mutual' ? 'Party A (Company / Individual)' : 'Disclosing Party Name'}
            </label>
            <input
              type="text"
              value={partyA}
              onChange={(e) => setPartyA(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {ndaType === 'mutual' ? 'Party B (Company / Individual)' : 'Receiving Party Name'}
            </label>
            <input
              type="text"
              value={partyB}
              onChange={(e) => setPartyB(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            />
          </div>
        </div>

        <div className="text-xs">
          <label className="block text-slate-300 font-semibold mb-1">Permitted Purpose / Project Scope</label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
          />
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <label className="flex items-center gap-2.5 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNonSolicit}
              onChange={(e) => setIncludeNonSolicit(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-purple-500"
            />
            <span>Include 12-Month Non-Solicitation of Key Employees & Contractors Clause</span>
          </label>
        </div>

        <button
          onClick={handleGenerateNDA}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Generate Court-Ready Non-Disclosure Agreement (PDF / Print Ready)</span>
        </button>
      </div>
    </div>
  );
};
