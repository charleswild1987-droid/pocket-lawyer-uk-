import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Search, 
  BookOpen, 
  Filter, 
  Shield, 
  Home, 
  Briefcase, 
  ShoppingBag, 
  Scale, 
  Heart, 
  Lock, 
  Globe, 
  FileText, 
  Car, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { TabKey } from '../../App';

export interface StatuteEntry {
  id: string;
  actTitle: string;
  year: number;
  category: 
    | 'Criminal & Public Order'
    | 'Housing & Property'
    | 'Employment & Work'
    | 'Consumer & Finance'
    | 'Civil & Tort'
    | 'Family & Children'
    | 'Data & Tech'
    | 'Public & Human Rights'
    | 'Wills & Estates'
    | 'Motoring & Transport';
  jurisdiction: 'England & Wales' | 'UK-wide' | 'England' | 'Great Britain';
  citation: string;
  summary: string;
  keySections: Array<{ section: string; title: string; explanation: string }>;
  citizenRights: string[];
  remediesOrPenalties: string;
  practicalAdvice: string;
  relatedToolTab?: TabKey;
  relatedToolLabel?: string;
  tags: string[];
}

interface LawDatabaseTabProps {
  searchQuery: string;
  onNavigateToTab?: (tab: TabKey) => void;
}

export const LawDatabaseTab: React.FC<LawDatabaseTabProps> = ({ searchQuery, onNavigateToTab }) => {
  const [internalSearch, setInternalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedActId, setExpandedActId] = useState<string | null>('pace-1984');
  const [savedBookmarks, setSavedBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pocketlawyer_bookmarked_laws');
      return saved ? JSON.parse(saved) : ['pace-1984', 'cra-2015', 'era-1996'];
    } catch {
      return ['pace-1984', 'cra-2015', 'era-1996'];
    }
  });

  const query = (searchQuery || internalSearch).toLowerCase().trim();

  const toggleBookmark = (id: string) => {
    setSavedBookmarks(prev => {
      const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('pocketlawyer_bookmarked_laws', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const categories = [
    'All',
    'Criminal & Public Order',
    'Housing & Property',
    'Employment & Work',
    'Consumer & Finance',
    'Civil & Tort',
    'Family & Children',
    'Data & Tech',
    'Public & Human Rights',
    'Wills & Estates',
    'Motoring & Transport',
    'Bookmarks'
  ];

  const statutes: StatuteEntry[] = [
    // CRIMINAL
    {
      id: 'pace-1984',
      actTitle: 'Police and Criminal Evidence Act 1984 (PACE)',
      year: 1984,
      category: 'Criminal & Public Order',
      jurisdiction: 'England & Wales',
      citation: '1984 c. 60',
      summary: 'The primary statute governing police powers in England and Wales. Regulates stop and search, powers of arrest, detention time limits, interrogation standards, and the admissibility of evidence in criminal trials.',
      keySections: [
        { section: 'Section 1', title: 'Power to Stop and Search', explanation: 'Allows police officers to search individuals or vehicles in a public place if they have reasonable grounds to suspect they are carrying stolen goods, offensive weapons, prohibited articles, or items used in criminal damage.' },
        { section: 'Section 2', title: 'Mandatory Information (GOWISELY)', explanation: 'Prior to searching, the officer must provide their name, collar number, police station, grounds for search, object sought, entitlement to a search record, and legal power used.' },
        { section: 'Section 24', title: 'Arrest Without Warrant', explanation: 'Police can only arrest without warrant for an offence if both the suspicion test AND the necessity test are satisfied (e.g. to ascertain identity, prevent injury or disappearance).' },
        { section: 'Section 56 & 58', title: 'Custody Fundamental Rights', explanation: 'Absolute statutory rights to have someone informed of detention (s.56) and to consult a qualified solicitor privately and free of charge at any time (s.58).' },
        { section: 'Section 76 & 78', title: 'Exclusion of Unfair Evidence', explanation: 'Mandatory exclusion of confessions obtained by oppression, and court discretion to exclude evidence that would have an adverse effect on the fairness of proceedings.' }
      ],
      citizenRights: [
        'Right to be searched only down to Jacket, Outer coat and Gloves (JOG) in public.',
        'Right to free, independent legal advice in police custody regardless of income.',
        'Right to silence during interview (subject to CJPOA 1994 adverse inference cautions).',
        'Right to receive a written copy of any stop and search record within 3 months.'
      ],
      remediesOrPenalties: 'Unlawful stops or arrests constitute civil battery and false imprisonment; unlawfully obtained evidence may be excluded at trial under Section 78.',
      practicalAdvice: 'Always request the officer’s collar number and police station. Say "I do not consent to this search, but I will cooperate under PACE powers." In custody, always ask for the duty solicitor before answering any substantive questions.',
      relatedToolTab: 'emergency',
      relatedToolLabel: 'Open Emergency Police HUD & Incident Logger',
      tags: ['police', 'stop and search', 'arrest', 'custody', 'gowisely', 'caution', 'duty solicitor', 'handcuffs']
    },
    {
      id: 'oapa-1861',
      actTitle: 'Offences Against the Person Act 1861 (OAPA)',
      year: 1861,
      category: 'Criminal & Public Order',
      jurisdiction: 'England & Wales',
      citation: '1861 c. 100',
      summary: 'The historic and foundational statute defining non-fatal violent offences, grievous bodily harm, and unlawful wounding in England and Wales.',
      keySections: [
        { section: 'Section 47', title: 'Assault Occasioning Actual Bodily Harm (ABH)', explanation: 'An assault or battery causing any injury or hurt that interferes with health or comfort, including cuts requiring stitches, broken teeth, loss of consciousness, or documented psychiatric harm. Maximum 5 years imprisonment.' },
        { section: 'Section 20', title: 'Unlawful Wounding or Inflicting GBH', explanation: 'Maliciously breaking both layers of the dermis (wounding) or causing really serious harm (broken bones, permanent disability). Maximum 5 years imprisonment.' },
        { section: 'Section 18', title: 'Grievous Bodily Harm with Intent', explanation: 'Wounding or causing grievous bodily harm with specific intention to cause really serious injury or to resist arrest. Indictable only; maximum penalty of Life Imprisonment.' }
      ],
      citizenRights: [
        'Right to statutory self-defence under Section 76 Criminal Justice & Immigration Act 2008.',
        'Right to jury trial in the Crown Court for either-way offences under s.47 and s.20.'
      ],
      remediesOrPenalties: 'Sentencing ranges from community orders to life imprisonment; victims can claim criminal injuries compensation from CICA.',
      practicalAdvice: 'Document all physical injuries immediately with photographs and hospital records. If charged, seek immediate Crown Court trial representation.',
      relatedToolTab: 'codex',
      relatedToolLabel: 'Read Criminal Law Codex Guide',
      tags: ['assault', 'violence', 'abh', 'gbh', 'wounding', 'injury', 'fight', 'battery']
    },
    {
      id: 'theft-act-1968',
      actTitle: 'Theft Act 1968',
      year: 1968,
      category: 'Criminal & Public Order',
      jurisdiction: 'England & Wales',
      citation: '1968 c. 60',
      summary: 'Defines property offences in England and Wales, replacing historic common law larceny with codified definitions of theft, robbery, burglary, and blackmail.',
      keySections: [
        { section: 'Section 1', title: 'Basic Definition of Theft', explanation: 'A person is guilty of theft if they dishonestly appropriate property belonging to another with the intention of permanently depriving the other of it. Max 7 years imprisonment.' },
        { section: 'Section 2', title: 'Exceptions to Dishonesty', explanation: 'A person is NOT dishonest if they believe in law they have the right to deprive, or believe they would have the owner\'s consent, or the owner cannot be discovered by taking reasonable steps.' },
        { section: 'Section 8', title: 'Robbery', explanation: 'Stealing, and immediately before or at the time of doing so, using force or putting any person in fear of being then and there subjected to force. Max Life Imprisonment.' },
        { section: 'Section 9', title: 'Burglary', explanation: 'Entering any building or part of a building as a trespasser with intent to steal, inflict GBH, or do unlawful damage. Max 14 years for dwellings.' },
        { section: 'Section 21', title: 'Blackmail', explanation: 'Making an unwarranted demand with menaces with a view to gain for oneself or another or with intent to cause loss. Max 14 years.' }
      ],
      citizenRights: [
        'Protection against wrongful arrest if an item was genuinely believed to be abandoned or honestly retained under a lien.'
      ],
      remediesOrPenalties: 'Up to 7 years for theft; up to 14 years for burglary; up to Life Imprisonment for robbery.',
      practicalAdvice: 'If you find lost property, take documented reasonable steps (e.g. reporting to police or venue reception) to avoid "theft by finding" allegations.',
      relatedToolTab: 'codex',
      relatedToolLabel: 'View Theft & Criminal Defences',
      tags: ['theft', 'stealing', 'robbery', 'burglary', 'shoplifting', 'blackmail', 'property']
    },
    {
      id: 'cjia-2008',
      actTitle: 'Criminal Justice and Immigration Act 2008 (Section 76)',
      year: 2008,
      category: 'Criminal & Public Order',
      jurisdiction: 'England & Wales',
      citation: '2008 c. 4',
      summary: 'Codifies the English common law defence of self-defence, defence of others, and defence of property, including the enhanced "Householder Defence".',
      keySections: [
        { section: 'Section 76(3)', title: 'Subjective Assessment of Circumstances', explanation: 'The reasonableness of force used is judged on the circumstances as the defendant honestly believed them to be, even if their belief was mistaken.' },
        { section: 'Section 76(5A)', title: 'Householder Defence', explanation: 'In a dwelling house where the defendant is not a trespasser and faces an intruder, the force used is only unreasonable if it was GROSSLY disproportionate.' },
        { section: 'Section 76(6A)', title: 'No Duty to Retreat', explanation: 'A person is not under a legal duty to retreat before defending themselves, although retreating can be considered when assessing reasonableness.' }
      ],
      citizenRights: [
        'Right to strike a pre-emptive blow if violence is honestly and reasonably believed to be imminent.',
        'Right to protect your family and home against violent intruders using proportionate or non-grossly disproportionate force.'
      ],
      remediesOrPenalties: 'Self-defence is a complete justification resulting in a full acquittal of all violent charges.',
      practicalAdvice: 'State to the police: "I acted in lawful self-defence because I honestly believed I was under imminent attack." Do not elaborate without a solicitor.',
      relatedToolTab: 'emergency',
      relatedToolLabel: 'Consult Emergency Police Rights',
      tags: ['self defence', 'fighting back', 'burglary attack', 'householder defence', 'reasonable force']
    },

    // HOUSING & PROPERTY
    {
      id: 'housing-act-1988',
      actTitle: 'Housing Act 1988',
      year: 1988,
      category: 'Housing & Property',
      jurisdiction: 'England & Wales',
      citation: '1988 c. 50',
      summary: 'The bedrock statute of the private rented sector in England and Wales. Created Assured Shorthold Tenancies (ASTs), Section 21 no-fault evictions, and Section 8 fault-based possession notices.',
      keySections: [
        { section: 'Section 13', title: 'Statutory Rent Increases (Form 4)', explanation: 'Allows landlords of periodic tenancies to propose a new rent once every 12 months with at least 1 month statutory notice. Tenants can challenge above-market increases at the First-tier Tribunal.' },
        { section: 'Section 8 & Sched 2', title: 'Possession on Statutory Grounds', explanation: 'Enables eviction for breach of tenancy: Mandatory Ground 8 (at least 2 months\' rent arrears at notice and hearing), Ground 10 & 11 (persistent arrears), and Ground 14 (nuisance/anti-social behaviour).' },
        { section: 'Section 21', title: 'Notice Requiring Possession', explanation: 'Enables landlords to recover possession after the fixed term without proving fault, provided 2 months\' written notice is given on Form 6A and all statutory prerequisites are met.' }
      ],
      citizenRights: [
        'Right to at least 2 full months\' notice on Section 21 evictions.',
        'Right to refer unfair rent increases to the First-tier Tribunal before the effective date.',
        'Right to remain in the property until a County Court bailiff warrant is lawfully executed.'
      ],
      remediesOrPenalties: 'Unlawful eviction or harassment is a criminal offence under the Protection from Eviction Act 1977 and gives rise to substantial civil damages.',
      practicalAdvice: 'Never move out simply because a Section 21 notice was posted. Check the 8 statutory prerequisites (deposit, EPC, Gas CP12, How to Rent). If any is missing, the notice is legally invalid.',
      relatedToolTab: 'landlord',
      relatedToolLabel: 'Use Landlord & Section 13/8/21 Suite',
      tags: ['tenancy', 'landlord', 'rent increase', 'eviction', 'section 21', 'section 8', 'rent arrears', 'ast']
    },
    {
      id: 'housing-act-2004',
      actTitle: 'Housing Act 2004 (Sections 213 & 214)',
      year: 2004,
      category: 'Housing & Property',
      jurisdiction: 'England & Wales',
      citation: '2004 c. 34',
      summary: 'Mandates statutory protection of all tenancy deposits in government-approved custodial or insurance schemes (DPS, TDS, MyDeposits) and enforces severe financial penalties for non-compliance.',
      keySections: [
        { section: 'Section 213', title: 'Mandatory 30-Day Protection & Prescribed Info', explanation: 'Landlords must protect the deposit in a recognized scheme within 30 days of receipt AND serve comprehensive Prescribed Information on the tenant.' },
        { section: 'Section 214', title: 'Court Orders & 1x to 3x Compensation', explanation: 'If the landlord fails to comply with s.213 within 30 days, the County Court MUST order the landlord to repay the deposit AND award statutory compensation of between 1 and 3 times the deposit.' },
        { section: 'Section 215', title: 'Section 21 Eviction Bar', explanation: 'No Section 21 notice can be served while a deposit remains unprotected or compensation proceedings are unsettled.' }
      ],
      citizenRights: [
        'Absolute right to deposit protection within 30 days of payment.',
        'Right to receive up to 3 times the deposit in court compensation if the landlord was late or failed to provide Prescribed Information.'
      ],
      remediesOrPenalties: 'Mandatory statutory compensation order of 1x to 3x deposit amount plus legal costs.',
      practicalAdvice: 'Check with DPS, TDS, and MyDeposits online. If your deposit was not protected within 30 days, you have an open-and-shut County Court Part 8 claim against your landlord.',
      relatedToolTab: 'notices',
      relatedToolLabel: 'Generate Tenancy Deposit Penalty Notice',
      tags: ['deposit', 'tenancy deposit', 'dps', 'tds', 'mydeposits', 'compensation', 'prescribed info']
    },
    {
      id: 'lta-1985',
      actTitle: 'Landlord and Tenant Act 1985 (Section 11)',
      year: 1985,
      category: 'Housing & Property',
      jurisdiction: 'England & Wales',
      citation: '1985 c. 70',
      summary: 'Implies strict covenants into all residential tenancy agreements requiring the landlord to maintain the structure, exterior, and utility installations of the dwelling-house.',
      keySections: [
        { section: 'Section 11(1)', title: 'Repairing Obligations', explanation: 'Landlord must keep in repair: (a) the structure and exterior (walls, roofs, windows, gutters); (b) water, gas, electricity, sanitation (basins, toilets, baths); (c) space heating and water heating (boilers, radiators).' },
        { section: 'Section 11(6)', title: 'Landlord 24-Hour Notice of Entry', explanation: 'The landlord or their agent may enter the property to view its condition only after giving at least 24 hours\' written notice to the tenant, visiting at a reasonable hour.' }
      ],
      citizenRights: [
        'Right to a safe, heated home in good repair.',
        'Right to quiet enjoyment: landlords CANNOT enter without 24 hours written notice and tenant consent.'
      ],
      remediesOrPenalties: 'Specific performance orders requiring repairs, general damages for distress and inconvenience, and rent abatement (refund) for the disrepair period.',
      practicalAdvice: 'Report disrepair in writing immediately with photos. Keep a log. If the landlord fails to act within 14 days, send our formal Section 11 Pre-Action Notice.',
      relatedToolTab: 'notices',
      relatedToolLabel: 'Generate Section 11 Disrepair Notice',
      tags: ['disrepair', 'broken boiler', 'leaks', 'landlord entry', 'quiet enjoyment', 'roof leak', 'radiator']
    },
    {
      id: 'tenant-fees-act-2019',
      actTitle: 'Tenant Fees Act 2019',
      year: 2019,
      category: 'Housing & Property',
      jurisdiction: 'England',
      citation: '2019 c. 15',
      summary: 'Bans almost all fees charged by letting agents and landlords to tenants in England, cap tenancy deposits, and outlines strict penalties for prohibited payments.',
      keySections: [
        { section: 'Section 1 & Sched 1', title: 'Prohibited Payments', explanation: 'Landlords and agents cannot charge for credit checks, references, inventories, renewal fees, or cleaning. Only permitted payments: rent, tenancy deposit (capped at 5 weeks for rents under £50k/yr), holding deposit (capped at 1 week), default fees for lost keys or late rent (after 14 days).' },
        { section: 'Section 8', title: 'Financial Penalties & Section 21 Bar', explanation: 'Local councils can fine violators up to £5,000 for a first breach, and up to £30,000 for repeated breaches. Section 21 notices are invalid while prohibited fees remain unreturned.' }
      ],
      citizenRights: [
        'Right not to pay admin, reference, contract, or inventory fees.',
        'Right to a full refund of any unlawfully charged fees plus interest.'
      ],
      remediesOrPenalties: 'Repayment of fees via First-tier Tribunal, local authority fines up to £30,000, and Section 21 eviction notices rendered void.',
      practicalAdvice: 'If an agent demands £150 for "referencing" or "admin", refuse to pay and cite the Tenant Fees Act 2019 Schedule 1.',
      relatedToolTab: 'landlord',
      relatedToolLabel: 'Open Landlord & Rent Suite',
      tags: ['tenant fees', 'admin fees', 'deposit cap', '5 week deposit', 'holding deposit', 'letting agent']
    },

    // EMPLOYMENT & WORK
    {
      id: 'era-1996',
      actTitle: 'Employment Rights Act 1996 (ERA)',
      year: 1996,
      category: 'Employment & Work',
      jurisdiction: 'UK-wide',
      citation: '1996 c. 18',
      summary: 'The comprehensive statutory framework for employment law in Great Britain. Covers written terms, unfair dismissal, statutory redundancy, notice periods, and protection against wage deductions.',
      keySections: [
        { section: 'Section 13', title: 'Protection of Wages', explanation: 'Employers cannot make unauthorized deductions from worker pay unless required by statute (tax/NI) or authorised in writing in the contract.' },
        { section: 'Section 86', title: 'Statutory Minimum Notice', explanation: 'Employees are entitled to 1 week notice after 1 month service; 1 week per year of service between 2 and 12 years (max 12 weeks).' },
        { section: 'Section 94 & 98', title: 'Right Not to Be Unfairly Dismissed', explanation: 'Qualifying employees (2 years service) can only be dismissed for one of 5 fair reasons: capability, conduct, redundancy, statutory restriction, or SOSR, following a fair process.' },
        { section: 'Section 103A', title: 'Protected Disclosures (Whistleblowing)', explanation: 'Automatic unfair dismissal if dismissed for making a protected public interest disclosure. Day 1 right with NO qualifying period and UNCAPPED compensation.' },
        { section: 'Section 162', title: 'Statutory Redundancy Pay Calculation', explanation: 'Formula based on age and service: 0.5 week/yr under 22; 1.0 week/yr ages 22-40; 1.5 weeks/yr ages 41+. Capped weekly pay.' }
      ],
      citizenRights: [
        'Right to receive itemized pay statements.',
        'Right to fair redundancy pay and paid time off to seek work.',
        'Right to written reasons for dismissal (after 2 years service).'
      ],
      remediesOrPenalties: 'Employment Tribunal awards for basic and compensatory awards for unfair dismissal; uncapped compensation for whistleblowing and discrimination.',
      practicalAdvice: 'Keep all emails, performance reviews, and contract amendments. You must contact ACAS for Early Conciliation within 3 months minus 1 day of your dismissal.',
      relatedToolTab: 'calculators',
      relatedToolLabel: 'Calculate Redundancy & Notice Pay',
      tags: ['employment', 'unfair dismissal', 'redundancy', 'whistleblowing', 'notice period', 'salary deduction', 'wages']
    },
    {
      id: 'equality-act-2010',
      actTitle: 'Equality Act 2010',
      year: 2010,
      category: 'Employment & Work',
      jurisdiction: 'Great Britain',
      citation: '2010 c. 15',
      summary: 'Consolidates all anti-discrimination law into a single comprehensive statute. Protects individuals from unfair treatment, harassment, and victimisation across employment, services, housing, and education.',
      keySections: [
        { section: 'Section 4', title: 'The 9 Protected Characteristics', explanation: 'Age, Disability, Gender Reassignment, Marriage and Civil Partnership, Pregnancy and Maternity, Race, Religion or Belief, Sex, and Sexual Orientation.' },
        { section: 'Section 13 & 19', title: 'Direct and Indirect Discrimination', explanation: 'Direct: Treating someone less favourably because of a protected characteristic. Indirect: Applying a neutral rule or practice that disproportionately disadvantages a protected group without objective justification.' },
        { section: 'Section 20 & 21', title: 'Duty to Make Reasonable Adjustments', explanation: 'Employers and service providers MUST take positive steps and make reasonable adjustments to remove physical or policy disadvantages faced by disabled persons.' },
        { section: 'Section 26 & 27', title: 'Harassment and Victimisation', explanation: 'Prohibits unwanted conduct violating dignity or creating an intimidating, hostile, or humiliating environment, and protects people who blow the whistle or complain about discrimination.' }
      ],
      citizenRights: [
        'Right to equal treatment in the workplace, public venues, shops, and tenancies.',
        'Day 1 protection with no service length requirement in employment.',
        'Right to claim compensation for "Injury to Feelings" under Vento guidelines (up to £56,000+).'
      ],
      remediesOrPenalties: 'Uncapped compensatory awards in employment tribunals and civil County Courts, including past and future loss of earnings.',
      practicalAdvice: 'Document exact dates, comments, witnesses, and HR reports. Notify ACAS within 3 months minus 1 day from the last discriminatory act.',
      relatedToolTab: 'codex',
      relatedToolLabel: 'Explore Employment & Equality Codex',
      tags: ['discrimination', 'equality act', 'protected characteristics', 'disability', 'race', 'sexism', 'harassment']
    },
    {
      id: 'late-payment-act-1998',
      actTitle: 'Late Payment of Commercial Debts (Interest) Act 1998',
      year: 1998,
      category: 'Employment & Work',
      jurisdiction: 'UK-wide',
      citation: '1998 c. 20',
      summary: 'Empowers businesses and freelancers in commercial B2B contracts to claim statutory interest and fixed recovery compensation on late-paid invoices.',
      keySections: [
        { section: 'Section 4', title: 'Statutory Interest Rate', explanation: 'Implies a statutory interest rate of the Bank of England Base Rate plus 8.0% per annum into all commercial B2B contracts for goods or services.' },
        { section: 'Section 5A', title: 'Fixed Statutory Compensation Tiers', explanation: 'Automatic entitlement to debt recovery compensation once an invoice is overdue: £40 for debts under £1,000; £70 for debts between £1,000 and £9,999.99; £100 for debts of £10,000 and above.' }
      ],
      citizenRights: [
        'Right for freelancers and small businesses to be paid within 30 days (or max 60 days if agreed).',
        'Automatic statutory interest and fee entitlement without needing prior contract clauses.'
      ],
      remediesOrPenalties: 'Interest compounds on a daily basis; recoverable in full through Money Claim Online or Statutory Demand.',
      practicalAdvice: 'When sending an overdue reminder to a corporate client, explicitly calculate the Bank of England + 8% daily rate and add the £40, £70, or £100 Section 5A fee.',
      relatedToolTab: 'accounts',
      relatedToolLabel: 'Open B2B Late Payment Calculator & Demand',
      tags: ['late payment', 'freelancer', 'invoice', 'unpaid bill', 'statutory interest', 'b2b debt']
    },

    // CONSUMER & FINANCE
    {
      id: 'cra-2015',
      actTitle: 'Consumer Rights Act 2015 (CRA)',
      year: 2015,
      category: 'Consumer & Finance',
      jurisdiction: 'UK-wide',
      citation: '2015 c. 15',
      summary: 'The principal consumer protection statute in the UK. Sets statutory quality benchmarks for goods, digital content, and services, and establishes clear remedies for faulty items.',
      keySections: [
        { section: 'Sections 9, 10 & 11', title: 'Implied Terms for Goods', explanation: 'Goods supplied to consumers must be of satisfactory quality (s.9), fit for a particular purpose made known to the seller (s.10), and as described (s.11).' },
        { section: 'Sections 20 & 22', title: '30-Day Short-Term Right to Reject', explanation: 'If goods are faulty within the first 30 days of ownership or delivery, the consumer has an absolute right to reject the item and receive a 100% full refund.' },
        { section: 'Section 23', title: 'Right to Repair or Replacement', explanation: 'After 30 days (up to 6 months), the retailer is entitled to ONE opportunity to repair or replace. The burden of proof is reversed: defects are presumed to have existed at delivery.' },
        { section: 'Section 24', title: 'Final Right to Reject / Price Reduction', explanation: 'If a single repair fails or replacement is impossible, the consumer can demand a full refund (no deduction for use in the first 6 months, except motor vehicles).' },
        { section: 'Section 49', title: 'Contracts for Services', explanation: 'Every contract to supply a service must be performed with reasonable care and skill, within a reasonable time, and at a reasonable price.' }
      ],
      citizenRights: [
        'Right to a 100% full refund for faulty goods within 30 days.',
        'Protection against unfair terms in small print contracts (Part 2 CRA 2015).'
      ],
      remediesOrPenalties: 'Full statutory refund, price reduction, damages for consequential loss, or repeat performance.',
      practicalAdvice: 'Always complain to the RETAILER who sold you the item, NOT the manufacturer. The retailer has the statutory contract obligation under the CRA 2015.',
      relatedToolTab: 'notices',
      relatedToolLabel: 'Generate CRA 2015 Rejection Notice',
      tags: ['consumer rights', 'faulty goods', 'refund', 'warranty', 'repair', 'replace', 'services']
    },
    {
      id: 'cca-1974-s75',
      actTitle: 'Consumer Credit Act 1974 (Section 75)',
      year: 1974,
      category: 'Consumer & Finance',
      jurisdiction: 'UK-wide',
      citation: '1974 c. 39',
      summary: 'Establishes joint and several liability between credit card providers and suppliers for breach of contract or misrepresentation on purchases between £100 and £30,000.',
      keySections: [
        { section: 'Section 75', title: 'Joint and Several Liability of Creditor', explanation: 'If a consumer enters into a debtor-creditor-supplier agreement (e.g. paying by credit card), the credit card issuer is jointly liable with the merchant for any breach of contract or misrepresentation.' }
      ],
      citizenRights: [
        'Right to claim 100% of a purchase back from your credit card company if a business goes bust, scams you, or delivers defective goods.',
        'Applies even if you only paid a £1 deposit on credit card and the remainder by cash or debit card, provided the total purchase price is between £100 and £30,000.'
      ],
      remediesOrPenalties: 'Full refund of purchase price plus consequential losses from the credit card bank.',
      practicalAdvice: 'Always pay at least a partial deposit (£10 or £50) on a credit card when booking holidays, buying cars, or ordering furniture to trigger Section 75 legal protection.',
      relatedToolTab: 'codex',
      relatedToolLabel: 'Read Consumer Law Codex Guide',
      tags: ['section 75', 'credit card', 'chargeback', 'company bust', 'airline refund', 'deposit protection']
    },
    {
      id: 'ccr-2013',
      actTitle: 'Consumer Contracts Regulations 2013 (CCR)',
      year: 2013,
      category: 'Consumer & Finance',
      jurisdiction: 'UK-wide',
      citation: 'SI 2013/3134',
      summary: 'Regulates online, distance, and doorstep sales, giving consumers an automatic 14-day statutory cooling-off cancellation period without needing to provide any reason.',
      keySections: [
        { section: 'Regulation 29 & 30', title: '14-Day Right to Cancel', explanation: 'Consumers purchasing online or by phone have 14 calendar days from receipt of goods to cancel the order for any reason and receive a 100% refund including standard delivery costs.' }
      ],
      citizenRights: [
        'Right to change your mind and return online purchases within 14 days without penalty.'
      ],
      remediesOrPenalties: 'Full refund including outbound standard delivery fees within 14 days of return.',
      practicalAdvice: 'Notify the seller in writing within 14 days of receiving the package. You then have a further 14 days to post the items back.',
      relatedToolTab: 'notices',
      relatedToolLabel: 'View Consumer Notice Templates',
      tags: ['online shopping', 'returns', 'cooling off', 'distance selling', 'change mind']
    },

    // CIVIL & TORT
    {
      id: 'limitation-act-1980',
      actTitle: 'Limitation Act 1980',
      year: 1980,
      category: 'Civil & Tort',
      jurisdiction: 'England & Wales',
      citation: '1980 c. 58',
      summary: 'Establishes statutory time limits within which civil legal claims must be filed at court before becoming legally barred.',
      keySections: [
        { section: 'Section 2', title: 'Actions Founded on Tort', explanation: 'General tort and negligence claims must be brought within 6 years from the date on which the cause of action accrued.' },
        { section: 'Section 4A', title: 'Defamation / Malicious Falsehood', explanation: 'Strict 1-year limitation period from the date of publication.' },
        { section: 'Section 5', title: 'Actions Founded on Simple Contract', explanation: 'Claims for breach of contract must be issued within 6 years from the date of the breach.' },
        { section: 'Section 8', title: 'Contracts Executed as a Deed', explanation: 'Specialty contracts and deeds carry an extended 12-year limitation period.' },
        { section: 'Section 11', title: 'Personal Injury & Clinical Negligence', explanation: 'Strict 3-year limitation period from the date of the accident or date of knowledge of the injury.' }
      ],
      citizenRights: [
        'Protection against ancient or surprise claims once the statutory limitation period has expired.'
      ],
      remediesOrPenalties: 'A defendant has an absolute statutory defence to strike out any time-barred claim with costs.',
      practicalAdvice: 'Never delay issuing a claim. Use our Limitation Calculator to find your exact cut-off date.',
      relatedToolTab: 'calculators',
      relatedToolLabel: 'Open Limitation Period Calculator',
      tags: ['limitation', 'time bar', 'deadlines', 'court claim', '6 years', '3 years personal injury']
    },
    {
      id: 'defamation-act-2013',
      actTitle: 'Defamation Act 2013',
      year: 2013,
      category: 'Civil & Tort',
      jurisdiction: 'England & Wales',
      citation: '2013 c. 26',
      summary: 'Reforms English libel and slander law, introducing the "Serious Harm" threshold to prevent trivial lawsuits and codifying defenses of truth, honest opinion, and public interest.',
      keySections: [
        { section: 'Section 1', title: 'The Serious Harm Test', explanation: 'A statement is not defamatory unless its publication has caused or is likely to cause serious harm to the reputation of the claimant. For trading corporations, serious financial loss is required.' },
        { section: 'Section 2', title: 'Defence of Truth', explanation: 'It is a full defence to show that the imputation conveyed by the statement is substantially true.' },
        { section: 'Section 3', title: 'Defence of Honest Opinion', explanation: 'Protects statements of opinion based on existing facts that an honest person could have held.' }
      ],
      citizenRights: [
        'Freedom of speech to express honest opinions and publish matters in the public interest.',
        'Protection against frivolous libel claims by large corporations.'
      ],
      remediesOrPenalties: 'Damages for injury to reputation, court injunctions prohibiting republication, and published apologies.',
      practicalAdvice: 'If threatened with a defamation letter, examine whether the statement caused measurable serious harm and whether the statement was factual truth or honest opinion.',
      relatedToolTab: 'codex',
      relatedToolLabel: 'Read Tort & Defamation Codex',
      tags: ['defamation', 'libel', 'slander', 'reputation', 'review', 'social media', 'serious harm']
    },

    // FAMILY & CHILDREN
    {
      id: 'ddsa-2020',
      actTitle: 'Divorce, Dissolution and Separation Act 2020',
      year: 2020,
      category: 'Family & Children',
      jurisdiction: 'England & Wales',
      citation: '2020 c. 11',
      summary: 'Abolished fault-based divorce in England and Wales, ending the need to allege adultery or unreasonable behaviour, and allowing sole or joint applications.',
      keySections: [
        { section: 'Section 1', title: 'Irretrievable Breakdown Statement', explanation: 'A simple statement by one or both spouses that the marriage has broken down irretrievably is conclusive proof. Allegations of fault cannot be raised or defended.' },
        { section: 'Timetable', title: '20-Week Reflection Period', explanation: 'Mandatory 20-week cooling-off period from application to Conditional Order, and a further 6 weeks to Final Order (total 26 weeks minimum).' }
      ],
      citizenRights: [
        'Right to divorce without blaming your partner or proving fault.',
        'Right to make a joint application with your spouse.'
      ],
      remediesOrPenalties: 'Court issues a legally binding Final Order dissolving the marriage or civil partnership.',
      practicalAdvice: 'Divorce dissolves the marriage, but it does NOT resolve financial claims. Always secure a separate Clean Break Court Consent Order under Section 25 Matrimonial Causes Act 1973.',
      relatedToolTab: 'codex',
      relatedToolLabel: 'Explore Family Law Codex',
      tags: ['divorce', 'separation', 'no fault', 'clean break', 'marriage', 'conditional order']
    },
    {
      id: 'children-act-1989',
      actTitle: 'Children Act 1989',
      year: 1989,
      category: 'Family & Children',
      jurisdiction: 'England & Wales',
      citation: '1989 c. 41',
      summary: 'The fundamental statute governing child welfare, parental responsibility, and court orders regarding with whom a child lives and spends time.',
      keySections: [
        { section: 'Section 1', title: 'The Paramountcy Principle', explanation: 'The child\'s welfare shall be the court\'s paramount consideration in determining any question with respect to the upbringing of a child.' },
        { section: 'Section 1(3)', title: 'The Welfare Checklist', explanation: 'Judges must consider: wishes and feelings of the child, physical/emotional needs, effect of changes, age/sex/background, harm suffered or at risk, and capability of parents.' },
        { section: 'Section 8', title: 'Child Arrangements Orders', explanation: 'Orders regulating with whom a child is to live, spend time, or have contact, as well as Specific Issue Orders and Prohibited Steps Orders.' }
      ],
      citizenRights: [
        'Presumption of parental involvement: Courts operate on the presumption that involvement of both parents in a child\'s life will further the child\'s welfare unless safety risks exist.'
      ],
      remediesOrPenalties: 'Legally enforceable Child Arrangements Orders. Breach can result in unpaid community work orders or transfer of residency.',
      practicalAdvice: 'Focus exclusively on the child’s routine, stability, and emotional wellbeing, not disputes between the adults. Courts prioritize consistency.',
      relatedToolTab: 'codex',
      relatedToolLabel: 'Read Children & Family Law Codex',
      tags: ['children', 'custody', 'child arrangements', 'parental responsibility', 'welfare checklist']
    },

    // DATA & TECH
    {
      id: 'uk-gdpr',
      actTitle: 'UK General Data Protection Regulation & DPA 2018',
      year: 2018,
      category: 'Data & Tech',
      jurisdiction: 'UK-wide',
      citation: '2018 c. 12',
      summary: 'The primary privacy and data protection framework in the UK. Regulates how companies, public bodies, and websites collect, process, and retain personal data.',
      keySections: [
        { section: 'Article 5', title: 'The 7 Data Protection Principles', explanation: 'Lawfulness, fairness, and transparency; purpose limitation; data minimisation; accuracy; storage limitation; integrity and confidentiality; and accountability.' },
        { section: 'Article 15', title: 'Right of Access (Subject Access Request - SAR)', explanation: 'Individuals have the statutory right to obtain confirmation and copies of all personal data held about them within 1 calendar month, completely free of charge.' },
        { section: 'Article 17', title: 'Right to Erasure ("Right to be Forgotten")', explanation: 'Entitlement to have personal data deleted where it is no longer necessary for the original purpose or where consent is withdrawn.' },
        { section: 'Article 82', title: 'Right to Compensation for Distress', explanation: 'Any person who has suffered material or non-material damage (including psychological distress) as a result of an infringement has the right to compensation from the controller.' }
      ],
      citizenRights: [
        'Right to see everything a bank, employer, or company writes about you in internal notes.',
        'Right to receive your data within 1 month without paying any fee.'
      ],
      remediesOrPenalties: 'Information Commissioner’s Office (ICO) fines up to £17.5m or 4% of global turnover, plus County Court compensation orders.',
      practicalAdvice: 'When sending a Subject Access Request, specify email chains, CRM notes, and recorded phone calls. If they miss the 1-month deadline, submit a complaint to the ICO immediately.',
      relatedToolTab: 'notices',
      relatedToolLabel: 'Generate UK GDPR Article 15 SAR',
      tags: ['gdpr', 'privacy', 'data protection', 'sar', 'subject access request', 'ico', 'right to be forgotten']
    },

    // PUBLIC & HUMAN RIGHTS
    {
      id: 'hra-1998',
      actTitle: 'Human Rights Act 1998 (HRA)',
      year: 1998,
      category: 'Public & Human Rights',
      jurisdiction: 'UK-wide',
      citation: '1998 c. 42',
      summary: 'Enacts the European Convention on Human Rights (ECHR) into domestic UK law, making it unlawful for any public authority to act in a way that violates protected rights.',
      keySections: [
        { section: 'Section 6', title: 'Public Authority Duty', explanation: 'It is unlawful for a public authority (police, NHS, local council, courts, government departments) to act in a way which is incompatible with a Convention right.' },
        { section: 'Article 2, 3, 5, 8', title: 'Core Protected Rights', explanation: 'Article 2 (Right to life); Article 3 (Prohibition of torture and inhuman treatment - absolute); Article 5 (Right to liberty); Article 8 (Right to respect for private and family life); Article 10 (Freedom of expression).' }
      ],
      citizenRights: [
        'Right to challenge decisions of government and public bodies in UK domestic courts without needing to travel to Strasbourg.'
      ],
      remediesOrPenalties: 'Declarations of incompatibility, quashing orders in Judicial Review, and damages awards.',
      practicalAdvice: 'Public authority decisions affecting housing, healthcare, or family life can be challenged by Judicial Review under the HRA 1998 within 3 months.',
      relatedToolTab: 'codex',
      relatedToolLabel: 'Read Public Law & Human Rights Codex',
      tags: ['human rights', 'echr', 'police powers', 'freedom of speech', 'article 8', 'judicial review']
    },

    // WILLS & ESTATES
    {
      id: 'wills-act-1837',
      actTitle: 'Wills Act 1837 (Section 9)',
      year: 1837,
      category: 'Wills & Estates',
      jurisdiction: 'England & Wales',
      citation: '1837 c. 26',
      summary: 'Governs the strict formal execution requirements necessary for a Will to be valid under English law, and enforces the witness forfeiture rule.',
      keySections: [
        { section: 'Section 9', title: 'Formalities of Execution', explanation: 'No will is valid unless: (a) it is in writing and signed by the testator; (b) it appears the testator intended to give effect to the will; (c) the signature is made or acknowledged in the presence of two or more witnesses present at the same time; (d) each witness signs or attests the will in the presence of the testator.' },
        { section: 'Section 15', title: 'Witness Forfeiture Rule', explanation: 'If a person who attests the execution of a will is a beneficiary or the spouse/civil partner of a beneficiary, the will remains valid, but the gift or legacy to that person is entirely void.' }
      ],
      citizenRights: [
        'Testamentary freedom: The legal right to leave your estate to whomever you choose, subject only to the Inheritance Act 1975.'
      ],
      remediesOrPenalties: 'A defectively witnessed will is completely invalid, causing the estate to pass under an earlier will or the intestacy rules.',
      practicalAdvice: 'NEVER allow a family member who inherits under your Will (or their spouse) to be a witness. Use independent neighbours or friends.',
      relatedToolTab: 'codex',
      relatedToolLabel: 'Read Wills, Probate & Estates Codex',
      tags: ['wills', 'probate', 'inheritance', 'witnesses', 'executor', 'estate', 'intestacy']
    },

    // MOTORING & TRANSPORT
    {
      id: 'rta-1988',
      actTitle: 'Road Traffic Act 1988',
      year: 1988,
      category: 'Motoring & Transport',
      jurisdiction: 'Great Britain',
      citation: '1988 c. 52',
      summary: 'The principal road safety statute governing motoring offences, driving standards, breathalyzer tests, licensing, and insurance requirements.',
      keySections: [
        { section: 'Section 2 & 3', title: 'Dangerous & Careless Driving', explanation: 'Section 2: Driving that falls far below the standard of a competent driver and carries obvious danger. Section 3: Driving without due care and attention or without reasonable consideration for other road users.' },
        { section: 'Section 4 & 5', title: 'Drink and Drug Driving', explanation: 'Driving or attempting to drive with alcohol or specified controlled drugs above the legal prescribed limit. Mandatory minimum 12-month driving ban.' },
        { section: 'Section 170', title: 'Duty to Stop and Report Accidents', explanation: 'If an accident occurs causing injury or damage to property/animals, the driver must stop and give details, or report to a police station within 24 hours.' }
      ],
      citizenRights: [
        'Right to be given a warning of intended prosecution (NIP) within 14 days of an alleged speeding or careless driving offence.',
        'Right to challenge speed camera calibration and road signage compliance.'
      ],
      remediesOrPenalties: 'Penalty points, heavy fines, mandatory driving bans (minimum 12 months for drink driving), and up to Life Imprisonment for causing death by dangerous driving.',
      practicalAdvice: 'If you receive a Notice of Intended Prosecution (NIP), you have a strict legal duty under Section 172 to identify the driver within 28 days. Failing to do so carries 6 penalty points.',
      relatedToolTab: 'finedisputes',
      relatedToolLabel: 'Open Fine & PCN Disputes Suite',
      tags: ['motoring', 'driving', 'speeding', 'drink driving', 'nip', 'careless driving', 'traffic accident']
    },
    {
      id: 'pofa-2012',
      actTitle: 'Protection of Freedoms Act 2012 (Schedule 4)',
      year: 2012,
      category: 'Motoring & Transport',
      jurisdiction: 'England & Wales',
      citation: '2012 c. 9',
      summary: 'Outlawed wheel clamping on private land and established the strict statutory rules under which private parking companies can claim unpaid parking charges from the registered keeper.',
      keySections: [
        { section: 'Section 54', title: 'Ban on Wheel Clamping', explanation: 'Made it a criminal offence to clamp, immobilise, or tow a vehicle on private land without lawful authority (e.g. court order or statutory bailiff power).' },
        { section: 'Schedule 4', title: 'Recovery of Unpaid Parking Charges (Keeper Liability)', explanation: 'Private operators can only hold the registered keeper liable for an unpaid charge if they strictly follow statutory timelines: Notice to Keeper must arrive within 14 days if ANPR was used, or within 56 days if a windscreen ticket was issued.' }
      ],
      citizenRights: [
        'No legal requirement to name the driver to a private parking operator.',
        'If the operator breaches Schedule 4 timescales or wording, keeper liability is defeated.'
      ],
      remediesOrPenalties: 'Inability for the operator to enforce charges against the vehicle owner; cancellation via POPLA / IAS independent appeal.',
      practicalAdvice: 'Always appeal as the "Registered Keeper", never as the "Driver". Challenge on PoFA Schedule 4 compliance and the BPA 10-minute grace period.',
      relatedToolTab: 'finedisputes',
      relatedToolLabel: 'Generate Private Parking Appeal (PoFA)',
      tags: ['parking ticket', 'private parking', 'pcn', 'clamping', 'keeper liability', 'popla', 'parkingeye']
    }
  ];

  // Filtering logic
  const filteredStatutes = useMemo(() => {
    return statutes.filter((item) => {
      // Category filter
      if (selectedCategory === 'Bookmarks') {
        if (!savedBookmarks.includes(item.id)) return false;
      } else if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Query filter
      if (!query) return true;

      const titleMatch = item.actTitle.toLowerCase().includes(query);
      const summaryMatch = item.summary.toLowerCase().includes(query);
      const tagMatch = item.tags.some(t => t.toLowerCase().includes(query));
      const sectionMatch = item.keySections.some(s => 
        s.section.toLowerCase().includes(query) || 
        s.title.toLowerCase().includes(query) || 
        s.explanation.toLowerCase().includes(query)
      );

      return titleMatch || summaryMatch || tagMatch || sectionMatch;
    });
  }, [statutes, selectedCategory, query, savedBookmarks]);

  const toggleExpand = (id: string) => {
    setExpandedActId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/40 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-400/30">
              <Database className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">UK Statutory & Common Law Database</h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500 text-white font-black uppercase tracking-wider">
                  Complete Reference
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Search primary Acts of Parliament, statutory instruments, key legal sections, citizen protections, and court precedents.
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-5 flex items-center sm:flex-col justify-between sm:justify-center">
            <span className="text-xs text-slate-400">Database Index</span>
            <div className="text-base font-bold text-amber-400 mt-0.5">
              {statutes.length} Core Statutes Indexed
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={internalSearch}
            onChange={(e) => setInternalSearch(e.target.value)}
            placeholder="Search all UK laws by topic, Act name, section, or keyword (e.g. arrest, deposit, unfair dismissal, speed camera, mould, divorce)..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 transition"
          />
          {internalSearch && (
            <button
              onClick={() => setInternalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills Carousel */}
        <div className="flex overflow-x-auto gap-1.5 pb-1 scrollbar-none text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat === 'Bookmarks' && <Bookmark className="w-3.5 h-3.5 fill-current" />}
                <span>{cat}</span>
                {cat === 'Bookmarks' && <span className="text-[10px] ml-1 opacity-80">({savedBookmarks.length})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Quick Tags */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong>{filteredStatutes.length}</strong> UK Statutes matching your criteria
        </span>
        <span className="hidden sm:inline">
          Click any Act to inspect key sections & citizen rights
        </span>
      </div>

      {/* Statute Accordion Cards List */}
      <div className="space-y-4">
        {filteredStatutes.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No matching UK statutes found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try searching for general keywords like "police", "landlord", "eviction", "wages", "refund", "divorce", or reset category filters.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setInternalSearch(''); }}
              className="py-1.5 px-4 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredStatutes.map((act) => {
            const isExpanded = expandedActId === act.id;
            const isBookmarked = savedBookmarks.includes(act.id);

            return (
              <div
                key={act.id}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition shadow-lg hover:border-slate-700"
              >
                {/* Header Bar */}
                <div className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer" onClick={() => toggleExpand(act.id)}>
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-extrabold text-white hover:text-amber-300 transition">
                        {act.actTitle}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30 font-semibold">
                        {act.jurisdiction}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 font-mono">
                        {act.citation}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      {act.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(act.id);
                      }}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark this statute'}
                      className={`p-2 rounded-xl transition ${
                        isBookmarked 
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                    </button>

                    <button
                      className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Pane */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-800/80 space-y-5 text-xs text-slate-200">
                    
                    {/* Key Sections Breakdown */}
                    <div className="space-y-2.5 pt-4">
                      <div className="font-bold text-amber-400 flex items-center gap-2 text-xs uppercase tracking-wider">
                        <BookOpen className="w-4 h-4" />
                        <span>Key Sections & Legal Effect</span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {act.keySections.map((sec, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white text-xs">{sec.section}</span>
                              <span className="text-[10px] text-amber-400 font-medium">{sec.title}</span>
                            </div>
                            <p className="text-slate-300 text-[11px] leading-relaxed">
                              {sec.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Citizen Protections & Remedies */}
                    <div className="grid md:grid-cols-2 gap-3">
                      {/* Left: Rights */}
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/20 space-y-2">
                        <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 shrink-0" />
                          <span>Citizen Rights & Protections</span>
                        </div>
                        <ul className="space-y-1.5 text-slate-300 text-[11px]">
                          {act.citizenRights.map((r, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 font-bold">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right: Remedies / Penalties */}
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-red-500/20 space-y-2">
                        <div className="font-bold text-red-400 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>Statutory Remedies & Penalties</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {act.remediesOrPenalties}
                        </p>
                      </div>
                    </div>

                    {/* Practical Advice & Next Steps */}
                    <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-1.5">
                      <div className="font-bold text-blue-300 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>How to Use This Law (Practical Guidance)</span>
                      </div>
                      <p className="text-slate-200 text-xs leading-relaxed">
                        {act.practicalAdvice}
                      </p>
                    </div>

                    {/* Actionable Link to Tools if applicable */}
                    {act.relatedToolTab && (
                      <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-amber-500/30">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="text-xs text-slate-300 font-medium">
                            Generate court-compliant documents or run diagnostics for this statute:
                          </span>
                        </div>

                        {onNavigateToTab && (
                          <button
                            onClick={() => onNavigateToTab(act.relatedToolTab!)}
                            className="py-1.5 px-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
                          >
                            <span>{act.relatedToolLabel || 'Open Generator'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Search Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {act.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                          #{t}
                        </span>
                      ))}
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
