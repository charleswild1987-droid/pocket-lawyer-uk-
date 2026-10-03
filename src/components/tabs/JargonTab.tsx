import React, { useState } from 'react';
import { BookMarked, Search, Landmark, PhoneCall, ExternalLink, Scale, CheckCircle2 } from 'lucide-react';

interface JargonItem {
  term: string;
  category: 'Latin Maxim' | 'Court Procedure' | 'Contract' | 'Criminal' | 'Civil';
  definition: string;
  example: string;
}

interface LandmarkCase {
  caseName: string;
  year: number;
  citation: string;
  area: string;
  principle: string;
  factsAndRatio: string;
}

interface JargonTabProps {
  searchQuery: string;
}

export const JargonTab: React.FC<JargonTabProps> = ({ searchQuery }) => {
  const [internalQuery, setInternalQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSection, setActiveSection] = useState<'jargon' | 'cases' | 'helplines'>('jargon');

  const query = (searchQuery || internalQuery).toLowerCase().trim();

  const jargonList: JargonItem[] = [
    { term: 'Ultra Vires', category: 'Latin Maxim', definition: 'Beyond the legal powers or authority of a person, corporation, or public body.', example: 'A local council acting outside its statutory authority under the Local Government Act.' },
    { term: 'Prima Facie', category: 'Latin Maxim', definition: 'At first face; on the face of it. Evidence that is sufficient to establish a fact unless rebutted.', example: 'A prima facie case of breach of contract based on an unpaid valid invoice.' },
    { term: 'Without Prejudice', category: 'Court Procedure', definition: 'Communications made in a genuine attempt to settle a dispute cannot be shown to the court on liability.', example: 'Marking settlement offers "Without Prejudice Save as to Costs" to protect confidentiality.' },
    { term: 'Ratio Decidendi', category: 'Court Procedure', definition: 'The legal principle or rationale upon which the court decides a case; binding precedent.', example: 'The neighbour principle established as the ratio in Donoghue v Stevenson.' },
    { term: 'Obiter Dicta', category: 'Court Procedure', definition: 'Remarks made in passing by a judge; persuasive but not binding precedent on future courts.', example: 'Judicial commentary contemplating hypothetical scenarios.' },
    { term: 'Habeas Corpus', category: 'Latin Maxim', definition: 'A prerogative writ requiring a person detained in custody to be brought before a court to determine lawfulness of detention.', example: 'Challenging unlawful state detention without trial under English common law.' },
    { term: 'Res Ipsa Loquitur', category: 'Latin Maxim', definition: 'The thing speaks for itself; a doctrine allowing negligence to be inferred from the very nature of an accident.', example: 'A barrel of flour falling out of a warehouse window onto a pedestrian.' },
    { term: 'Caveat Emptor', category: 'Contract', definition: 'Let the buyer beware. The buyer is responsible for checking the quality and suitability of goods before buying.', example: 'Purchasing second-hand vehicles from private individuals without statutory warranties.' },
    { term: 'Quantum Meruit', category: 'Contract', definition: 'As much as he has deserved. Reasonable compensation for work done where no fixed contract price was agreed.', example: 'A tradesman who completes emergency plumbing repairs without an advance quote.' },
    { term: 'Injunction', category: 'Court Procedure', definition: 'A court order requiring a person to do or refrain from doing a specific act.', example: 'A freezing injunction preventing a debtor from transferring assets overseas.' },
    { term: 'Litigant in Person', category: 'Court Procedure', definition: 'An individual who represents themselves in court proceedings without instructing a solicitor or barrister.', example: 'Bringing a small money claim in the County Court up to £10,000 without counsel.' },
    { term: 'McKenzie Friend', category: 'Court Procedure', definition: 'A lay assistant who sits alongside a Litigant in Person in court to take notes and quietly give advice.', example: 'A supportive family member taking contemporaneous notes at a civil hearing.' },
    { term: 'Sub Judice', category: 'Court Procedure', definition: 'Under judicial consideration. Public discussion is restricted by the Contempt of Court Act 1981.', example: 'Media restrictions preventing reporting on active jury trials.' },
    { term: 'Promissory Estoppel', category: 'Contract', definition: 'An equitable doctrine preventing a party from reneging on a promise if the other party relied upon it to their detriment.', example: 'Central London Property Trust v High Trees House [1947].' },
    { term: 'Bailiff / HCEO', category: 'Civil', definition: 'High Court Enforcement Officers and County Court bailiffs empowered to seize goods to satisfy a judgment.', example: 'Enforcing an unpaid judgment exceeding £600 via High Court Writ of Control.' },
    { term: 'Part 36 Offer', category: 'Court Procedure', definition: 'A formal settlement offer under CPR Part 36 carrying strict cost penalties if rejected and not beaten at trial.', example: 'Offering £5,000 in full settlement to trigger 10% penalty interest on late acceptance.' },
    { term: 'Tortfeasor', category: 'Civil', definition: 'A person or entity that commits a civil wrong (tort), such as negligence or nuisance.', example: 'The driver at fault in a road traffic collision.' },
    { term: 'Vicarious Liability', category: 'Civil', definition: 'Strict legal responsibility imposed on an employer for the wrongful tortious acts of an employee in the course of employment.', example: 'A company held liable for an employee van driver causing damage while on delivery.' },
    { term: 'Mens Rea', category: 'Criminal', definition: 'The guilty mind; the mental element of a criminal offence (intention or recklessness).', example: 'Intending to permanently deprive the owner of property in a theft charge.' },
    { term: 'Actus Reus', category: 'Criminal', definition: 'The guilty act; the physical or external conduct required to constitute a crime.', example: 'The physical appropriation of goods in a theft prosecution.' }
  ];

  const landmarkCases: LandmarkCase[] = [
    {
      caseName: 'Donoghue v Stevenson',
      year: 1932,
      citation: '[1932] AC 562 (House of Lords)',
      area: 'Tort & Negligence',
      principle: 'Established modern Negligence and Lord Atkin\'s famous "Neighbour Principle".',
      factsAndRatio: 'A woman drank ginger beer from an opaque bottle containing a decomposed snail. The House of Lords held that manufacturers owe a direct duty of care to ultimate consumers, defining a neighbour as anyone closely and directly affected by one\'s acts.'
    },
    {
      caseName: 'Carlill v Carbolic Smoke Ball Co',
      year: 1893,
      citation: '[1893] 1 QB 256 (Court of Appeal)',
      area: 'Contract Law',
      principle: 'Unilateral contracts and binding advertisements made to the whole world.',
      factsAndRatio: 'The company advertised a £100 reward to anyone contracting influenza after using their smoke ball, stating £1,000 was deposited in a bank. Mrs Carlill used it and caught flu. Held: The advertisement was an offer to the world, and performing the conditions constituted acceptance.'
    },
    {
      caseName: 'Salomon v A Salomon & Co Ltd',
      year: 1897,
      citation: '[1897] AC 22 (House of Lords)',
      area: 'Company Law',
      principle: 'The Corporate Veil and separate legal personality of a limited company.',
      factsAndRatio: 'Mr Salomon incorporated his boot manufacturing business. When it became insolvent, creditors sought to hold him personally liable. The House of Lords ruled that a company is an entirely separate legal person from its shareholders and directors.'
    },
    {
      caseName: 'Entick v Carrington',
      year: 1765,
      citation: '19 Howell\'s State Trials 1029',
      area: 'Constitutional Law',
      principle: 'The Rule of Law: The state must show lawful statutory authority for all intrusive actions.',
      factsAndRatio: 'The King\'s messengers broke into Entick\'s house under a general warrant issued by the Secretary of State to seize seditious papers. Held: The executive has no inherent power to interfere with private property without express statutory or common law authority.'
    },
    {
      caseName: 'Miller v The Prime Minister',
      year: 2019,
      citation: '[2019] UKSC 41 (Supreme Court)',
      area: 'Constitutional Law',
      principle: 'Parliamentary Sovereignty and limits on executive Royal Prerogative powers.',
      factsAndRatio: 'Prime Minister Boris Johnson advised the Queen to prorogue Parliament for 5 weeks during Brexit deliberations. The 11-judge Supreme Court unanimously held the advice unlawful and void, affirming that the executive cannot prevent Parliament from carrying out its constitutional scrutiny.'
    },
    {
      caseName: 'Montgomery v Lanarkshire Health Board',
      year: 2015,
      citation: '[2015] UKSC 11 (Supreme Court)',
      area: 'Medical Law',
      principle: 'Informed consent; patients must be warned of all material risks of treatment.',
      factsAndRatio: 'A diabetic mother was not warned of the 9-10% risk of shoulder dystocia during vaginal birth, resulting in cerebral palsy. The Supreme Court moved away from doctor-led standards, ruling doctors must disclose risks a reasonable person in the patient\'s position would consider significant.'
    }
  ];

  const filteredJargon = jargonList.filter((j) => {
    const matchesCat = activeCategory === 'all' || j.category === activeCategory;
    const matchesQuery = !query || j.term.toLowerCase().includes(query) || j.definition.toLowerCase().includes(query);
    return matchesCat && matchesQuery;
  });

  const filteredCases = landmarkCases.filter((c) => {
    return !query || c.caseName.toLowerCase().includes(query) || c.principle.toLowerCase().includes(query) || c.area.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">UK Legal Jargon Buster, Precedents & Helplines</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30 uppercase">
                Reference Guide
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Plain English explanations of Latin maxims, landmark Supreme Court precedents, and free statutory advice services.
            </p>
          </div>
        </div>
      </div>

      {/* Main Switcher */}
      <div className="flex border-b border-slate-800 text-xs font-semibold overflow-x-auto gap-2">
        <button
          onClick={() => setActiveSection('jargon')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'jargon' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5" />
          Latin & Legal Glossary ({filteredJargon.length})
        </button>

        <button
          onClick={() => setActiveSection('cases')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'cases' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Landmark className="w-3.5 h-3.5 text-blue-400" />
          Landmark Case Precedents
        </button>

        <button
          onClick={() => setActiveSection('helplines')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'helplines' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
          Official UK Helplines & Legal Aid
        </button>
      </div>

      {/* JARGON SECTION */}
      {activeSection === 'jargon' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={internalQuery}
                onChange={(e) => setInternalQuery(e.target.value)}
                placeholder="Search Latin term or definition (e.g. Ultra Vires, Without Prejudice)..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto text-[11px]">
              {['all', 'Latin Maxim', 'Court Procedure', 'Contract', 'Criminal', 'Civil'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                    activeCategory === cat ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'All Terms' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {filteredJargon.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-400 text-sm">{item.term}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-200">{item.definition}</p>
                <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-850">
                  <strong>Example:</strong> {item.example}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CASES SECTION */}
      {activeSection === 'cases' && (
        <div className="space-y-3">
          {filteredCases.map((c, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800 pb-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Scale className="w-4 h-4 text-blue-400" />
                    <span>{c.caseName}</span>
                    <span className="text-xs font-normal text-slate-400">({c.year})</span>
                  </h3>
                  <span className="text-xs text-amber-400 font-mono">{c.citation}</span>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded bg-blue-950 border border-blue-500/30 text-blue-300 font-semibold self-start sm:self-auto">
                  {c.area}
                </span>
              </div>

              <div className="text-xs space-y-1.5 pt-1">
                <div className="text-emerald-400 font-bold">
                  Principle: {c.principle}
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {c.factsAndRatio}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* HELPLINES SECTION */}
      {activeSection === 'helplines' && (
        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              ACAS (Employment Conciliation & Rights)
            </h4>
            <p className="text-slate-400">
              Free, impartial advice on workplace rights, disciplinary disputes, redundancy rules, and mandatory early conciliation.
            </p>
            <div className="font-mono text-amber-400 font-bold text-sm">0300 123 1100</div>
            <p className="text-[11px] text-slate-500">Mon–Fri: 8am–6pm • Free UK landline & mobile call</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-blue-400" />
              Shelter UK (Housing & Eviction Emergency)
            </h4>
            <p className="text-slate-400">
              Urgent advice for tenants facing Section 21 eviction, illegal lockouts, bailiff warrants, and severe disrepair.
            </p>
            <div className="font-mono text-amber-400 font-bold text-sm">0808 800 4444</div>
            <p className="text-[11px] text-slate-500">Free 365 days a year emergency housing advice</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-purple-400" />
              Citizens Advice Bureau (National Adviceline)
            </h4>
            <p className="text-slate-400">
              Confidential guidance across benefits, consumer credit, debt management, and civil court proceedings.
            </p>
            <div className="font-mono text-amber-400 font-bold text-sm">0800 144 8848 (England) / 0800 702 2020 (Wales)</div>
            <p className="text-[11px] text-slate-500">Mon–Fri: 9am–5pm</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-red-400" />
              Civil Legal Advice (Legal Aid Agency)
            </h4>
            <p className="text-slate-400">
              Government legal aid checks for domestic abuse, losing your home, debt, or special educational needs.
            </p>
            <div className="font-mono text-amber-400 font-bold text-sm">0345 345 4 345</div>
            <p className="text-[11px] text-slate-500">Subject to means and merits legal aid testing</p>
          </div>
        </div>
      )}
    </div>
  );
};
