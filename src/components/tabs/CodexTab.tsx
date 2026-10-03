import React, { useState } from 'react';
import { BookOpen, Shield, Home, Briefcase, ShoppingBag, Heart, Scale, AlertCircle, Database, Globe, FileSignature, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface CodexDomain {
  id: string;
  title: string;
  statutes: string;
  icon: any;
  color: string;
  summary: string;
  sections: Array<{ heading: string; content: string }>;
}

interface CodexTabProps {
  searchQuery: string;
}

export const CodexTab: React.FC<CodexTabProps> = ({ searchQuery }) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('criminal');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'criminal-0': true,
    'housing-0': true,
    'employment-0': true
  });

  const domains: CodexDomain[] = [
    {
      id: 'criminal',
      title: '1. Criminal Law & Justice',
      statutes: 'PACE 1984 • OAPA 1861 • Theft Act 1968 • CJIA 2008',
      icon: Shield,
      color: 'text-red-400',
      summary: 'Offence classifications, court trial allocation, assault hierarchy, theft, and statutory self-defence.',
      sections: [
        {
          heading: 'Offence Classification & Court Allocation',
          content: `Criminal offences in England and Wales are strictly divided into three tiers:
1. Summary-Only Offences: Tried exclusively in the Magistrates' Court before a District Judge or bench of 3 lay magistrates (e.g. Common Assault, low-level road traffic, minor criminal damage). Maximum sentencing is 6 months imprisonment per offence (or 12 months for 2 either-way offences).
2. Either-Way Offences: Can be heard in either the Magistrates' Court or Crown Court before a jury (e.g. ABH s.47, Theft, Burglary). The defendant has the constitutional right to elect jury trial at the Crown Court.
3. Indictable-Only Offences: Heard exclusively in the Crown Court before a High Court or Circuit Judge and 12 jurors (e.g. Murder, Manslaughter, Robbery, s.18 Intentional GBH).`
        },
        {
          heading: 'Non-Fatal Offences Against the Person Hierarchy',
          content: `Governed by Common Law and the Offences Against the Person Act 1861 (OAPA 1861):
- Common Assault & Battery (s.39 Criminal Justice Act 1988): Intentional or reckless causing of apprehension of immediate unlawful violence, or non-consensual physical contact. Summary only; max 6 months.
- Assault Occasioning Actual Bodily Harm (ABH - s.47 OAPA 1861): Requires an assault causing any hurt or injury calculated to interfere with health or comfort (e.g. cuts requiring stitches, extensive bruising, loss of tooth, psychiatric harm). Either-way; max 5 years.
- Grievous Bodily Harm / Wounding (s.20 OAPA 1861): Maliciously wounding or inflicting serious harm (broken bones, permanent disfigurement). Either-way; max 5 years.
- Intentional GBH (s.18 OAPA 1861): Specifically intending to cause really serious harm. Indictable-only; maximum penalty of Life Imprisonment.`
        },
        {
          heading: 'Statutory Self-Defence & Householder Defence',
          content: `Under Common Law and Section 76 of the Criminal Justice and Immigration Act 2008 (CJIA 2008):
- A person may use such force as is reasonable in the circumstances as they honestly believed them to be in defence of themselves, another, or property.
- Pre-emptive Strike: The law does NOT require you to wait to be hit. If you honestly believe violence is imminent, a reasonable pre-emptive blow is lawful.
- Duty to Retreat: There is no legal obligation to retreat before defending yourself, though retreating can be evidence of reasonableness.
- Householder Defence (s.76(5A)): In a dwelling, force used against an intruder is not reasonable only if it was "grossly disproportionate". Disproportionate force can be legally justified in a home invasion.`
        }
      ]
    },
    {
      id: 'housing',
      title: '2. Housing & Tenancy Law',
      statutes: 'Housing Act 1988/2004 • Landlord & Tenant Act 1985 • Homes Act 2018',
      icon: Home,
      color: 'text-amber-400',
      summary: 'Assured Shorthold Tenancies, Section 21 vs Section 8 eviction rules, 1x-3x deposit penalties, and disrepair.',
      sections: [
        {
          heading: 'Section 21 "No-Fault" Eviction Requirements',
          content: `For a Section 21 (Form 6A) notice to be lawful under the Deregulation Act 2015, the landlord must have strictly complied with:
1. Deposit Protection: Deposit protected in DPS, TDS, or MyDeposits within 30 days and Prescribed Information served.
2. Compliance Documentation: Served valid EPC (rating E+), current Gas Safety Certificate (CP12), and Government "How to Rent" guide.
3. 2-Month Notice Window: Minimum 2 calendar months notice, expiring not before the end of a fixed term.
4. Retaliatory Eviction Protection: Notice is invalid for 6 months if the local council has served an Improvement Notice or Emergency Remedial Action notice.`
        },
        {
          heading: 'Tenancy Deposit Scheme & Statutory Penalties',
          content: `Under Sections 213 and 214 of the Housing Act 2004:
- Landlords must protect deposits within 30 calendar days of receipt.
- If the landlord fails to protect the deposit, or fails to provide the Prescribed Information within 30 days, the court MUST order the landlord to repay the deposit AND pay statutory compensation of between 1x and 3x the deposit sum.
- Landlords cannot serve a Section 21 notice until the penalty is resolved or the unprotected deposit is returned in full.`
        },
        {
          heading: 'Housing Disrepair & Damp (Awaab\'s Law)',
          content: `Under Section 11 of the Landlord and Tenant Act 1985 and the Homes (Fitness for Human Habitation) Act 2018:
- The landlord is impliedly obligated to keep the structure and exterior in repair, as well as installations for water, gas, electricity, sanitation, and space heating.
- Tenants can claim general damages for distress, inconvenience, and health impairment, plus rent reduction for the period of disrepair after notice was given.
- Awaab\'s Law establishes strict statutory timelines for landlords to inspect and remedy damp and toxic mould hazards.`
        }
      ]
    },
    {
      id: 'employment',
      title: '3. Employment Rights',
      statutes: 'Employment Rights Act 1996 • Equality Act 2010 • PIDA 1998',
      icon: Briefcase,
      color: 'text-blue-400',
      summary: 'Worker status, unfair dismissal qualifying rules, 9 protected characteristics, and ACAS conciliation.',
      sections: [
        {
          heading: 'Employment Status (Employee vs Worker vs Contractor)',
          content: `English law distinguishes 3 primary statuses:
1. Employee: Works under a contract of service. Benefits from full employment rights including Unfair Dismissal protection (after 2 years), Statutory Redundancy Pay, maternity/paternity leave. Tested by Mutuality of Obligation, Control, and Personal Service (Uber v Aslam [2021]).
2. Worker: Entitled to core Day 1 rights: National Minimum Wage, 5.6 weeks paid statutory annual leave (Working Time Regs 1998), rest breaks, and Equality Act 2010 protection against discrimination.
3. Self-Employed: Operates an independent business on client contracts without statutory employee protections.`
        },
        {
          heading: 'Unfair Dismissal & 5 Fair Reasons',
          content: `Under Section 98 of the Employment Rights Act 1996:
- Qualifying Period: Generally 2 continuous years of service (except automatic unfair dismissal: whistleblowing, health & safety, pregnancy, union activity, which are Day 1 rights).
- 5 Statutory Fair Reasons: Capability/performance, Conduct, Redundancy, Statutory illegality, or Some Other Substantial Reason (SOSR).
- Procedural Fairness: Employers must follow the ACAS Code of Practice on Disciplinary and Grievance Procedures. An unreasonable failure to follow the ACAS Code permits employment tribunals to adjust compensation by up to 25%.`
        },
        {
          heading: 'Equality Act 2010 & ACAS Time Limits',
          content: `Under the Equality Act 2010, discrimination is unlawful based on 9 Protected Characteristics: Age, Disability, Gender Reassignment, Marriage/Civil Partnership, Pregnancy/Maternity, Race, Religion/Belief, Sex, and Sexual Orientation.
- Strict Limitation: Claimants must notify ACAS for Early Conciliation within 3 months minus 1 day from the act of discrimination or dismissal date.
- Remedies: Compensation for injury to feelings (Vento bands: up to £56,000+) plus uncapped financial loss.`
        }
      ]
    },
    {
      id: 'consumer',
      title: '4. Consumer Rights & Contracts',
      statutes: 'Consumer Rights Act 2015 • CCR 2013 • Consumer Credit Act 1974 s.75',
      icon: ShoppingBag,
      color: 'text-emerald-400',
      summary: '30-day short-term rejection, 6-month repair presumption, distance selling cooling-off, and Section 75 joint liability.',
      sections: [
        {
          heading: 'Consumer Rights Act 2015 Goods Remedies',
          content: `Every contract to supply goods includes implied statutory terms that goods must be:
- Of satisfactory quality (s.9)
- Fit for a particular purpose made known to the trader (s.10)
- As described (s.11)

Statutory Remedies Hierarchy:
1. 0 to 30 Days: Short-Term Right to Reject (s.20 & s.22) — consumer is entitled to a 100% full refund to original payment method.
2. 30 Days to 6 Months: One opportunity for repair or replacement (s.23). The burden of proof is reversed: defects are legally presumed to have existed at delivery.
3. After 1 Failed Repair: Final right to reject or price reduction (s.24). Only a deduction for use on motor vehicles can be made in the first 6 months.`
        },
        {
          heading: 'Section 75 Joint Credit Card Liability (£100 to £30,000)',
          content: `Under Section 75 of the Consumer Credit Act 1974:
- If you pay for goods or services using a credit card (even just a £1 deposit) for a purchase valued between £100 and £30,000, the credit card provider is jointly and severally liable with the supplier.
- If the merchant breaches contract, goes into administration, or provides defective goods, you can claim 100% of your money back directly from your credit card bank.`
        }
      ]
    },
    {
      id: 'family',
      title: '5. Family Law & Domestic Abuse',
      statutes: 'Divorce, Dissolution and Separation Act 2020 • Children Act 1989',
      icon: Heart,
      color: 'text-pink-400',
      summary: 'No-fault divorce procedures, Section 25 financial remedy criteria, paramountcy child welfare, and protective injunctions.',
      sections: [
        {
          heading: 'No-Fault Divorce (DDSA 2020)',
          content: `Since 6 April 2022, fault-based grounds (adultery, unreasonable behaviour, desertion) have been abolished.
- Sole or Joint Application: A statement that the marriage has broken down irretrievably is conclusive evidence.
- 20-Week Reflection Period: A mandatory minimum 20-week pause between application and Conditional Order, followed by 6 weeks to the Final Order.`
        },
        {
          heading: 'Child Arrangements & Paramountcy Principle',
          content: `Under Section 1 of the Children Act 1989:
- The child\'s welfare is the court\'s paramount consideration ("Paramountcy Principle").
- Section 1(3) Welfare Checklist: Wishes and feelings of the child, physical/emotional/educational needs, effect of any change, age/sex/background, harm suffered or at risk, and capacity of each parent.`
        },
        {
          heading: 'Domestic Abuse & Injunctions',
          content: `Under Part IV of the Family Law Act 1996 and the Domestic Abuse Act 2021:
- Non-Molestation Order: Prohibits harassment, violence, intimidation, or coercive control. Breach is a criminal offence punishable by up to 5 years imprisonment.
- Occupation Order: Declares who has the legal right to live in or enter the family home, and can exclude an abuser from the vicinity.`
        }
      ]
    },
    {
      id: 'civil',
      title: '6. Civil Litigation & Small Claims',
      statutes: 'Civil Procedure Rules (CPR) • County Courts Act 1984',
      icon: Scale,
      color: 'text-amber-500',
      summary: 'CPR Overriding Objective, Pre-Action conduct, Small Claims Track £10k no-costs rule, and High Court enforcement.',
      sections: [
        {
          heading: 'CPR Overriding Objective & Pre-Action Conduct',
          content: `Civil litigation in England and Wales is governed by CPR Part 1 (The Overriding Objective): dealing with cases justly and at proportionate cost.
- Litigants MUST comply with the relevant Pre-Action Protocol or Practice Direction (Pre-Action Conduct) before issuing claims.
- The Claimant must serve a detailed Letter Before Action providing 14 to 30 days for a response. Unreasonable refusal to engage or mediate can attract severe adverse costs penalties.`
        },
        {
          heading: 'Small Claims Track (£10,000 and Under)',
          content: `The Small Claims Track is tailored for Litigants in Person:
- Under CPR Rule 27.14, the general rule is "No Adverse Legal Costs". The losing party does not pay the winner's solicitor fees.
- The loser only pays court issue fees, fixed witness expenses (up to £95/day), and expert fees (capped at £750).`
        },
        {
          heading: 'Judgment Enforcement Methods',
          content: `Once a County Court Judgment (CCJ) is obtained:
1. High Court Enforcement Officer (HCEO) Writ of Control: For debts over £600, transferring the judgment to the High Court allows enforcement officers with greater seizure powers.
2. Attachment of Earnings Order: Deductions taken directly from the debtor\'s employer salary.
3. Third-Party Debt Order: Freezes and seizes funds directly from the debtor\'s bank accounts.
4. Charging Order: Places a legal charge over the debtor\'s property/house, preventing sale without debt repayment.`
        }
      ]
    },
    {
      id: 'tort',
      title: '7. Tort & Negligence',
      statutes: 'Defamation Act 2013 • Occupiers\' Liability Acts 1957/1984',
      icon: AlertCircle,
      color: 'text-orange-400',
      summary: '4-stage negligence test (Robinson/Caparo), defamation serious harm & honest opinion, and occupiers\' liability.',
      sections: [
        {
          heading: 'The 4-Stage Negligence Framework',
          content: `To succeed in negligence, the claimant must prove 4 essential elements on the balance of probabilities:
1. Duty of Care: Established precedent or Robinson v CC West Yorkshire / Caparo criteria (foreseeability, proximity, fair just and reasonable).
2. Breach of Duty: Falling below the objective standard of the reasonable person (Blyth v Birmingham Waterworks) or professional peer standard (Bolam / Bolitho).
3. Factual Causation: The "But For" test (Barnett v Chelsea & Kensington Hospital).
4. Legal Causation & Remoteness: The harm must not be too remote; it must be a reasonably foreseeable type of damage (The Wagon Mound No. 1).`
        },
        {
          heading: 'Defamation Act 2013',
          content: `Under the Defamation Act 2013:
- Serious Harm Test (s.1): A statement is not defamatory unless its publication has caused or is likely to cause serious harm to the reputation of the claimant. For commercial bodies, serious financial loss is required.
- Statutory Defences: Truth (s.2), Honest Opinion (s.3), Publication on matter of public interest (s.4).
- Single Publication Rule & Limitation: Strict 1-year limitation period from initial publication date.`
        }
      ]
    },
    {
      id: 'gdpr',
      title: '8. Data Protection & UK GDPR',
      statutes: 'UK GDPR • Data Protection Act 2018',
      icon: Database,
      color: 'text-purple-400',
      summary: '7 principles, Article 15 Subject Access Requests, right to erasure, ICO complaints, and distress compensation.',
      sections: [
        {
          heading: '7 Core Data Processing Principles',
          content: `Under Article 5 UK GDPR, personal data must be:
1. Lawful, fair and transparent
2. Purpose limitation (collected for specified, explicit purposes)
3. Data minimisation (adequate, relevant, and limited)
4. Accuracy (kept up to date)
5. Storage limitation (retained no longer than necessary)
6. Integrity and confidentiality (appropriate security & encryption)
7. Accountability (data controller must demonstrate compliance)`
        },
        {
          heading: 'Article 15 Subject Access Request (SAR)',
          content: `Individuals have the fundamental statutory right to obtain copies of all personal data held about them:
- Deadline: Must be complied with within 1 calendar month.
- Cost: Strictly free of charge (fees permitted only if manifestly unfounded or excessive).
- Failure to comply: Can be escalated to the Information Commissioner\'s Office (ICO) and pursued in County Court for a compliance order and Article 82 distress compensation.`
        }
      ]
    },
    {
      id: 'public',
      title: '9. Immigration & Public Law',
      statutes: 'British Nationality Act 1981 • Human Rights Act 1998',
      icon: Globe,
      color: 'text-teal-400',
      summary: 'Points-based immigration, 5-year ILR, British citizenship, Judicial Review 3-month deadline, and ECHR rights.',
      sections: [
        {
          heading: 'Judicial Review & Grounds of Challenge',
          content: `Judicial Review is the court mechanism to challenge decisions of public authorities and government ministers:
- 3 Established Grounds (Council of Civil Service Unions v Minister for Civil Service):
  1. Illegality: Acting Ultra Vires, beyond statutory power, or misdirecting the law.
  2. Irrationality / Unreasonableness: Associated with the Wednesbury principle — a decision so unreasonable that no sensible authority could ever have made it.
  3. Procedural Impropriety: Failure to observe natural justice, procedural fairness, or bias (apparent or actual).
- Strict Time Limit: Must be filed promptly, and in any event within 3 months of the challenged decision.`
        },
        {
          heading: 'Human Rights Act 1998',
          content: `Incorporates European Convention on Human Rights (ECHR) into UK domestic law:
- Section 6 Duty: It is unlawful for a public authority to act in a way incompatible with Convention rights.
- Core Articles: Article 2 (Right to Life), Article 3 (Prohibition of Torture & Inhuman Treatment - absolute), Article 5 (Right to Liberty), Article 6 (Right to Fair Trial), Article 8 (Right to Respect for Private and Family Life - qualified), Article 10 (Freedom of Expression).`
        }
      ]
    },
    {
      id: 'wills',
      title: '10. Wills, Probate & Estates',
      statutes: 'Wills Act 1837 • Administration of Estates Act 1925',
      icon: FileSignature,
      color: 'text-indigo-400',
      summary: 'Wills Act Section 9 execution rules, witness forfeiture s.15, statutory intestacy legacy, and LPAs.',
      sections: [
        {
          heading: 'Statutory Execution of a Valid Will (Wills Act 1837 s.9)',
          content: `For a Will to be legally valid under Section 9 of the Wills Act 1837:
1. In Writing: Hand-written or typed.
2. Signed by Testator: Or by another in testator's presence and direction.
3. Intention to give effect: Intention that the signature makes the Will operational.
4. Two Witnesses Present Together: Signed or acknowledged in the presence of 2 independent witnesses present at the same time.
- Witness Forfeiture Rule (s.15): If a beneficiary (or their spouse/civil partner) witnesses the Will, the Will remains valid, but their legacy or gift is completely void.`
        },
        {
          heading: 'Intestacy Rules (Dying Without a Valid Will)',
          content: `Governed by Section 46 of the Administration of Estates Act 1925:
- Married / Civil Partner with Children: Surviving spouse inherits all personal chattels plus statutory legacy of £322,000, plus 50% of the remaining estate balance. The children share the other 50% equally.
- Cohabitants & Unmarried Partners: Cohabitants have NO automatic statutory inheritance rights under intestacy, regardless of years together. They must file a court claim under the Inheritance (Provision for Family and Dependants) Act 1975.`
        }
      ]
    }
  ];

  // Filter domains based on search query if active
  const filteredDomains = searchQuery.trim()
    ? domains.filter((d) => 
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.statutes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.sections.some(s => s.heading.toLowerCase().includes(searchQuery.toLowerCase()) || s.content.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : domains;

  const currentDomain = domains.find(d => d.id === selectedDomain) || domains[0];

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">UK 10-Domain Legal Codex</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-400/30 uppercase">
                England & Wales
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Authoritative statutory guides, procedural standards, and legal rights across all core disciplines of English law.
            </p>
          </div>
        </div>
      </div>

      {/* Domain Selector Pill Carousel */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {domains.map((dom) => {
          const Icon = dom.icon;
          const isSelected = selectedDomain === dom.id;
          return (
            <button
              key={dom.id}
              onClick={() => setSelectedDomain(dom.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 cursor-pointer border ${
                isSelected 
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : dom.color}`} />
              <span>{dom.title.split('. ')[1]}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Domain View */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <currentDomain.icon className={`w-5 h-5 ${currentDomain.color}`} />
              <span>{currentDomain.title}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{currentDomain.summary}</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-amber-400 self-start sm:self-auto">
            {currentDomain.statutes}
          </span>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-3">
          {currentDomain.sections.map((sec, idx) => {
            const secKey = `${currentDomain.id}-${idx}`;
            const isExpanded = expandedSections[secKey] !== false; // default open
            return (
              <div 
                key={idx}
                className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(secKey)}
                  className="w-full p-3.5 text-left flex items-center justify-between font-bold text-slate-200 text-xs hover:text-white transition"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {sec.heading}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {isExpanded && (
                  <div className="p-4 pt-1 text-xs text-slate-300 leading-relaxed whitespace-pre-line border-t border-slate-850">
                    {sec.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
