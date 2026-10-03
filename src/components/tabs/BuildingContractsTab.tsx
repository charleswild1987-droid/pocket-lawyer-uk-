import React, { useState, useEffect } from 'react';
import { 
  HardHat, 
  Wrench, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Printer, 
  Copy, 
  Download, 
  Sparkles, 
  PenTool, 
  Save, 
  DollarSign, 
  Calendar, 
  Building, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Check, 
  Home, 
  Layers, 
  Users 
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { storageVault } from '../../services/storageVault';

interface BuildingContractsTabProps {
  onOpenDocument: (title: string, subtitle: string, content: string) => void;
}

export type BuildingContractType = 
  | 'residential-works' 
  | 'maintenance-sla' 
  | 'trade-subcontractor' 
  | 'variation-order' 
  | 'completion-certificate';

export const BuildingContractsTab: React.FC<BuildingContractsTabProps> = ({ onOpenDocument }) => {
  const { checkAccess } = useSubscription();

  const [activeType, setActiveType] = useState<BuildingContractType>('residential-works');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isAiAuditing, setIsAiAuditing] = useState(false);
  const [aiAuditAdvice, setAiAuditAdvice] = useState<string | null>(null);

  // ==========================================
  // 1. RESIDENTIAL BUILDING WORKS CONTRACT STATE
  // ==========================================
  const [resContract, setResContract] = useState({
    employerName: 'Edward & Eleanor Thorne (Homeowners)',
    employerAddress: '14 Richmond Hill, London, TW10 6QX',
    contractorName: 'Highline Heritage Construction Ltd',
    contractorReg: '11849201',
    contractorAddress: 'Unit 3, Trade Park, Kingston upon Thames, KT1 3BB',
    siteAddress: '14 Richmond Hill, London, TW10 6QX (Rear Ground Floor & Loft)',
    worksDescription: 'Single-storey rear wrap-around kitchen extension, structural steel beam installation, removal of load-bearing walls, and dormer loft conversion with en-suite shower room.',
    commencementDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    completionWeeks: 16,
    contractSumNet: 68000,
    vatRate: 20, // %
    depositAmount: 6800, // 10%
    retentionPercent: 5, // 5% retention fund
    defectsLiabilityMonths: 12,
    liquidatedDamagesPerWeek: 350
  });

  // ==========================================
  // 2. BUILDING SERVICES & MAINTENANCE SLA STATE
  // ==========================================
  const [maintContract, setMaintContract] = useState({
    clientName: 'Meridian Commercial Property Management Ltd',
    clientAddress: '100 Bishopsgate, London, EC2N 4AG',
    serviceProviderName: 'Apex Mechanical & Electrical Services Ltd',
    serviceProviderAddress: 'Unit 8, Enterprise Way, London, SE10 0AT',
    premisesAddress: 'Meridian House, 45 Southwark Street, London, SE1 9HP',
    serviceScope: 'Planned Preventative Maintenance (PPM) and reactive repairs for commercial HVAC, chillers, electrical distribution boards, emergency lighting, and domestic water booster pumps.',
    contractTermMonths: 12,
    annualFeeNet: 18400,
    paymentSchedule: 'Quarterly in advance (£4,600 + VAT)',
    emergencySlaHours: 4,
    urgentSlaHours: 24,
    standardHourlyRate: 75,
    outOfHoursRate: 115,
    materialsMarkupPercent: 15
  });

  // ==========================================
  // 3. TRADE SUBCONTRACTOR AGREEMENT STATE
  // ==========================================
  const [subContract, setSubContract] = useState({
    mainContractorName: 'Stirling & Vance Construction PLC',
    subcontractorName: 'Vanguard Electrical Contractors Ltd',
    subcontractorTrade: 'Electrical Installation & Testing (1st & 2nd Fix)',
    subcontractorCisUtr: '94820 18492',
    projectName: 'The Foundry Residential Development (Phase 2)',
    siteAddress: 'Former Mills, St Ann Quay, Newcastle upon Tyne, NE1 3DX',
    subcontractSum: 34500,
    cisDeductionRate: 20, // %
    paymentTermsDays: 28, // HGCRA 1996 compliant
    retentionPercent: 5,
    publicLiabilityMin: 5000000, // £5,000,000
    payLessNoticeDays: 5 // statutory HGCRA requirement
  });

  // ==========================================
  // 4. BUILDING WORKS VARIATION ORDER STATE
  // ==========================================
  const [variation, setVariation] = useState({
    variationNumber: 'VO-003',
    contractRef: 'RES-2024-RICHMOND',
    clientName: 'Edward Thorne',
    contractorName: 'Highline Heritage Construction Ltd',
    siteAddress: '14 Richmond Hill, London, TW10 6QX',
    variationDate: new Date().toISOString().split('T')[0],
    descriptionOfVariation: 'Omission of standard bi-fold doors; substitution and installation of ultra-slim thermally broken 5.2m architectural Crittall-style aluminium sliding patio system with integrated solar control acoustic glazing and recessed flush threshold drainage tray.',
    costDifferenceNet: 4750, // Positive for addition, negative for omission
    additionalTimeWeeks: 1.5,
    revisedCompletionDate: new Date(Date.now() + 18 * 7 * 86400000).toISOString().split('T')[0]
  });

  // ==========================================
  // 5. PRACTICAL COMPLETION CERTIFICATE STATE
  // ==========================================
  const [completion, setCompletion] = useState({
    contractRef: 'RES-2024-RICHMOND',
    clientName: 'Edward & Eleanor Thorne',
    contractorName: 'Highline Heritage Construction Ltd',
    siteAddress: '14 Richmond Hill, London, TW10 6QX',
    practicalCompletionDate: new Date().toISOString().split('T')[0],
    snaggingList: '1. Master bathroom extractor fan grille cover clip loose.\n2. Minor paint touch-up required behind kitchen pantry door.\n3. Silicon seal around external garden tap escutcheon plate.\n4. Handover of Building Control Completion Certificate, Electrical EICR, Gas Safe certificate, and O&M manual.',
    snaggingRectificationDays: 14,
    retentionReleasedNow: 1700, // 50% of retention
    retentionHeldUntilDefectsEnd: 1700
  });

  // ==========================================
  // CALCULATIONS
  // ==========================================
  const resVatAmount = (resContract.contractSumNet * resContract.vatRate) / 100;
  const resContractSumGross = resContract.contractSumNet + resVatAmount;
  const resRetentionFund = (resContract.contractSumNet * resContract.retentionPercent) / 100;

  const subRetentionAmount = (subContract.subcontractSum * subContract.retentionPercent) / 100;
  const subNetPayableBeforeCis = subContract.subcontractSum - subRetentionAmount;

  // ==========================================
  // DOCUMENT GENERATION CONTENT
  // ==========================================
  const generateContractText = (type: BuildingContractType): { title: string; subtitle: string; content: string } => {
    switch (type) {
      case 'residential-works': {
        const title = 'Residential Building Works Contract (Standard UK Homeowner Agreement)';
        const subtitle = `Works at ${resContract.siteAddress} between ${resContract.employerName} & ${resContract.contractorName}`;
        const content = `================================================================================
STANDARD FORM RESIDENTIAL BUILDING WORKS CONTRACT (ENGLAND & WALES)
Compliant with: Consumer Rights Act 2015, Supply of Goods and Services Act 1982,
and Construction (Design and Management) Regulations 2015 (CDM 2015)
================================================================================

DATED THIS: ${new Date().toLocaleDateString('en-GB')}

PARTIES TO THIS CONTRACT:
1. THE EMPLOYER (CLIENT / HOMEOWNER):
   Name(s): ${resContract.employerName}
   Address: ${resContract.employerAddress}

2. THE CONTRACTOR:
   Company Name: ${resContract.contractorName}
   Companies House Registration: ${resContract.contractorReg}
   Registered Office: ${resContract.contractorAddress}

RECITALS:
A. The Employer wishes to have building, structural, and refurbishment works carried out at the Property specified below.
B. The Contractor agrees to execute and complete the Works in a good, workmanlike manner using materials of sound and satisfactory quality, adhering to all statutory standards.

OPERATIVE PROVISIONS:

1. THE PROPERTY & SITE OF WORKS
1.1 Site Address: ${resContract.siteAddress}
1.2 The Employer grants the Contractor reasonable access between the agreed working hours of 08:00 to 17:00 Monday to Friday (and 08:30 to 13:00 on Saturdays; no noisy works on Sundays or Public Holidays).

2. SCOPE OF WORKS (SPECIFICATION)
2.1 The Contractor shall carry out and complete the following Works:
"${resContract.worksDescription}"
2.2 The Works shall be executed strictly in accordance with approved architectural drawings, structural engineer calculations, and Local Authority Building Regulations approvals.

3. COMMENCEMENT, PROGRESS & DELAYS
3.1 Date of Commencement: ${resContract.commencementDate}
3.2 Period of Works: ${resContract.completionWeeks} weeks from Commencement.
3.3 Time shall be of the essence, subject only to extensions granted for Events of Force Majeure or written Employer Variations.
3.4 Liquidated and Ascertained Damages (LADs): If the Contractor fails to achieve Practical Completion within the contract period, the Contractor shall pay or allow to the Employer liquidated damages at the rate of £${resContract.liquidatedDamagesPerWeek} per week.

4. CONTRACT SUM, VAT & PAYMENT SCHEDULE
4.1 Agreed Contract Sum (Net of VAT): £${resContract.contractSumNet.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
4.2 Value Added Tax (VAT @ ${resContract.vatRate}%): £${resVatAmount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
4.3 Total Gross Contract Sum: £${resContractSumGross.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
4.4 Deposit on Signing: £${resContract.depositAmount.toLocaleString('en-GB', { minimumFractionDigits: 2 })} (credited against final valuation).
4.5 Milestone Stage Payments: Payments shall become due upon verifiable completion of agreed construction milestones:
    - Stage 1 (15%): Demolition, site excavation, foundations & underground drainage inspected by Building Control.
    - Stage 2 (25%): Structural steel installation, external cavity blockwork, and watertight roof covering.
    - Stage 3 (25%): First fix carpentry, plumbing pipework, and electrical wiring installation.
    - Stage 4 (20%): Plaster boarding, skimming, second fix joinery, and sanitaryware fitting.
    - Stage 5 (10%): Practical Completion, snagging rectification, and issuance of Building Control Sign-Off.
    - Retention (5%): £${resRetentionFund.toLocaleString('en-GB', { minimumFractionDigits: 2 })} held in accordance with Clause 5.

5. RETENTION & DEFECTS RECTIFICATION PERIOD
5.1 A Retention Fund of ${resContract.retentionPercent}% (£${resRetentionFund.toLocaleString('en-GB', { minimumFractionDigits: 2 })}) shall be deducted from each milestone invoice.
5.2 50% of the Retention Fund (£${(resRetentionFund / 2).toLocaleString('en-GB', { minimumFractionDigits: 2 })}) shall be released upon the issuance of the Practical Completion Certificate.
5.3 The remaining 50% (£${(resRetentionFund / 2).toLocaleString('en-GB', { minimumFractionDigits: 2 })}) shall be released at the expiry of the Defects Rectification Period (${resContract.defectsLiabilityMonths} months), provided all notified defects have been made good by the Contractor.

6. STATUTORY WARRANTIES & CONSUMER RIGHTS ACT 2015
6.1 Under Section 49 of the Consumer Rights Act 2015, the Contractor warrants that the Works shall be performed with reasonable care and skill.
6.2 Under Section 9 and 10 of the Consumer Rights Act 2015, all materials and goods supplied shall be of satisfactory quality and fit for their intended purpose.
6.3 The Contractor warrants that all structural works comply with the Building Act 1984, Part A, Part B (Fire Safety), Part L (Conservation of fuel and power), and Part P (Electrical Safety) of the Building Regulations 2010.

7. VARIATIONS & EXTRAS
7.1 No alteration, addition, or omission from the Works shall be executed unless authorized in writing via a formal Building Works Variation Order signed by both parties specifying the agreed cost and time effect.

8. INSURANCE & HEALTH AND SAFETY
8.1 The Contractor shall maintain in force throughout the Works:
    - Public Liability Insurance: Minimum £5,000,000 per single incident.
    - Employers Liability Insurance: Minimum £10,000,000.
    - Contractors All-Risks Insurance covering the full reinstatement value of the Works.
8.2 The Contractor shall act as Principal Contractor under the CDM Regulations 2015, maintaining a safe working environment and welfare facilities.

9. GOVERNING LAW & DISPUTE RESOLUTION
This Agreement is governed by the law of England & Wales. Any dispute arising out of this contract may be referred by either party to adjudication or the Technology and Construction Court (TCC).

IN WITNESS WHEREOF the parties have executed this Agreement as a legally binding contract:

SIGNED by the Employer(s):
Signature: _____________________________________________
Printed Name: ${resContract.employerName}
Date: ${new Date().toLocaleDateString('en-GB')}

SIGNED for and on behalf of the Contractor:
Signature: _____________________________________________
Printed Name: Authorised Director
Position: Director / Company Secretary, ${resContract.contractorName}
Date: ${new Date().toLocaleDateString('en-GB')}
`;
        return { title, subtitle, content };
      }

      case 'maintenance-sla': {
        const title = 'Building Services & Mechanical/Electrical (M&E) Maintenance Agreement';
        const subtitle = `Facilities Maintenance SLA for ${maintContract.premisesAddress} between ${maintContract.clientName} & ${maintContract.serviceProviderName}`;
        const content = `================================================================================
COMMERCIAL BUILDING SERVICES & FACILITIES MAINTENANCE SERVICE LEVEL AGREEMENT (SLA)
Governing Law: Supply of Goods and Services Act 1982; England & Wales
================================================================================

DATE: ${new Date().toLocaleDateString('en-GB')}
TERM: ${maintContract.contractTermMonths} Months

PARTIES:
1. CLIENT: ${maintContract.clientName}
   Registered Office: ${maintContract.clientAddress}

2. SERVICE PROVIDER: ${maintContract.serviceProviderName}
   Registered Office: ${maintContract.serviceProviderAddress}

PREMISES TO BE SERVICED:
${maintContract.premisesAddress}

1. SERVICES TO BE PROVIDED
1.1 Planned Preventative Maintenance (PPM): The Service Provider shall perform statutory periodic inspection, testing, and servicing in compliance with SFG20 industry standards and manufacturer recommendations for:
"${maintContract.serviceScope}"
1.2 Reactive & Emergency Repairs: The Service Provider shall provide 24/7/365 emergency fault rectification.

2. SERVICE LEVEL AGREEMENT (SLA) & RESPONSE TIMES
2.1 Priority 1 (Emergency - Risk to life, building flood, total power failure):
    - On-site response time: Within ${maintContract.emergencySlaHours} hours.
2.2 Priority 2 (Urgent - Critical server room HVAC failure, lift stoppage):
    - On-site response time: Within ${maintContract.urgentSlaHours} hours.
2.3 Priority 3 (Routine Maintenance & Minor Repairs):
    - Response time: Within 3 business days.

3. CHARGES & REMUNERATION
3.1 Annual PPM Service Fee: £${maintContract.annualFeeNet.toLocaleString('en-GB', { minimumFractionDigits: 2 })} + VAT.
3.2 Billing Cadence: ${maintContract.paymentSchedule}.
3.3 Additional Reactive Labour Rates:
    - Normal Business Hours (08:00 - 17:00): £${maintContract.standardHourlyRate}/hour per technician.
    - Out of Hours / Weekends / Bank Holidays: £${maintContract.outOfHoursRate}/hour per technician.
3.4 Replacement Materials & Spares: Cost price plus ${maintContract.materialsMarkupPercent}% handling markup.

4. STATUTORY COMPLIANCE & ACCREDITATIONS
4.1 The Service Provider warrants that all operatives hold appropriate CSCS, Gas Safe, F-Gas, or NICEIC certifications.
4.2 All logbooks, F-Gas registers, and electrical certificates shall be updated on-site contemporaneously.

SIGNED for and on behalf of the Client:
Signature: _____________________________________________
Title: Facilities Director

SIGNED for and on behalf of the Service Provider:
Signature: _____________________________________________
Title: Managing Director
`;
        return { title, subtitle, content };
      }

      case 'trade-subcontractor': {
        const title = 'Construction Trade Subcontractor Agreement (HGCRA 1996)';
        const subtitle = `Subcontract for ${subContract.subcontractorTrade} on ${subContract.projectName}`;
        const content = `================================================================================
DOMESTIC BUILDING SUBCONTRACT AGREEMENT (ENGLAND & WALES)
Compliant with: Housing Grants, Construction and Regeneration Act 1996 (as amended by Local Democracy, Economic Development and Construction Act 2009)
and Finance Act 2004 (Construction Industry Scheme - CIS)
================================================================================

DATE: ${new Date().toLocaleDateString('en-GB')}

MAIN CONTRACTOR: ${subContract.mainContractorName}
SUBCONTRACTOR: ${subContract.subcontractorName}
SUBCONTRACTOR CIS UTR: ${subContract.subcontractorCisUtr}
PROJECT: ${subContract.projectName}
SITE LOCATION: ${subContract.siteAddress}
TRADE SCOPE: ${subContract.subcontractorTrade}

1. SUBCONTRACT SUM & CIS DEDUCTION
1.1 Subcontract Price: £${subContract.subcontractSum.toLocaleString('en-GB', { minimumFractionDigits: 2 })} (Exclusive of VAT).
1.2 CIS Tax Treatment: Deductions at ${subContract.cisDeductionRate}% shall be remitted to HMRC under Finance Act 2004.
1.3 Retention: ${subContract.retentionPercent}% (£${subRetentionAmount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}) withheld until completion and making good of defects.

2. STATUTORY PAYMENT RULES (HGCRA 1996 s.110 & s.111)
2.1 Payment Application: Subcontractor may submit monthly payment applications.
2.2 Due Date: 14 days after submission of monthly application.
2.3 Final Date for Payment: ${subContract.paymentTermsDays} days from the Due Date.
2.4 Pay Less Notice: If Main Contractor intends to pay less than the notified sum, a formal Pay Less Notice specifying the basis of calculation must be served not later than ${subContract.payLessNoticeDays} days before the Final Date for Payment.

3. INSURANCE & INDEMNITY
Subcontractor shall maintain Public Liability Insurance of not less than £${(subContract.publicLiabilityMin / 1000000)}M.

SIGNED for Main Contractor: _____________________________________________
SIGNED for Subcontractor: _____________________________________________
`;
        return { title, subtitle, content };
      }

      case 'variation-order': {
        const title = `Building Works Variation Order (${variation.variationNumber})`;
        const subtitle = `Contract Amendment for ${variation.siteAddress} under ${variation.contractRef}`;
        const content = `================================================================================
BUILDING WORKS FORMAL VARIATION ORDER (CHANGE INSTRUCTION)
Reference: ${variation.variationNumber}
Contract Ref: ${variation.contractRef}
================================================================================

DATE OF VARIATION: ${variation.variationDate}
EMPLOYER: ${variation.clientName}
CONTRACTOR: ${variation.contractorName}
SITE: ${variation.siteAddress}

1. PARTICULARS OF VARIATION (ADDITIONS / OMISSIONS)
${variation.descriptionOfVariation}

2. FINANCIAL ADJUSTMENT TO CONTRACT SUM
Agreed Cost Effect of this Variation (Net of VAT): £${variation.costDifferenceNet > 0 ? '+' : ''}${variation.costDifferenceNet.toFixed(2)}
VAT (20%): £${(variation.costDifferenceNet * 0.2).toFixed(2)}
Total Variation Amount Payable: £${(variation.costDifferenceNet * 1.2).toFixed(2)}

3. ADJUSTMENT TO TIME FOR PRACTICAL COMPLETION
Additional Extension of Time Granted: ${variation.additionalTimeWeeks} Weeks
Revised Date for Practical Completion: ${variation.revisedCompletionDate}

SIGNATURES OF AUTHORISATION:
Employer Signature: _____________________________________________
Contractor Signature: _____________________________________________
`;
        return { title, subtitle, content };
      }

      case 'completion-certificate': {
        const title = `Certificate of Practical Completion & Snagging Schedule`;
        const subtitle = `Final Handover for ${completion.siteAddress} under Ref: ${completion.contractRef}`;
        const content = `================================================================================
CERTIFICATE OF PRACTICAL COMPLETION (HANDOVER & SNAGGING DEED)
Governing Law: England & Wales
================================================================================

DATE OF ISSUE: ${completion.practicalCompletionDate}
CONTRACT REFERENCE: ${completion.contractRef}
EMPLOYER: ${completion.clientName}
CONTRACTOR: ${completion.contractorName}
PROPERTY: ${completion.siteAddress}

1. CERTIFICATE OF PRACTICAL COMPLETION
It is hereby certified that the Works under the Contract have reached Practical Completion in accordance with the contract specifications, Building Regulations, and statutory standards, subject only to the de minimis snagging items listed in Section 2.

2. SCHEDULE OF MINOR SNAGGING ITEMS (TO BE RECTIFIED WITHIN ${completion.snaggingRectificationDays} DAYS)
${completion.snaggingList}

3. RELEASE OF RETENTION
- Retention Released on Practical Completion (50%): £${completion.retentionReleasedNow.toFixed(2)}
- Retention Retained until end of Defects Period (50%): £${completion.retentionHeldUntilDefectsEnd.toFixed(2)}

SIGNED by Employer: _____________________________________________
SIGNED by Contractor: _____________________________________________
`;
        return { title, subtitle, content };
      }
    }
  };

  const handleSaveToVault = async () => {
    const { title, subtitle, content } = generateContractText(activeType);
    await storageVault.saveDocument({
      title,
      subtitle,
      category: 'building',
      content,
      metadata: {
        contractType: activeType,
        contractSum: activeType === 'residential-works' ? resContractSumGross : undefined
      }
    });

    setSaveStatus('Saved to Secure On-Device Vault');
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const handlePreviewAndSign = () => {
    if (!checkAccess('Building Contracts Generator')) return;
    const { title, subtitle, content } = generateContractText(activeType);
    // Auto-save on preview
    storageVault.saveDocument({
      title,
      subtitle,
      category: 'building',
      content,
      metadata: {
        contractType: activeType
      }
    });
    onOpenDocument(title, subtitle, content);
  };

  const handleAiAudit = async () => {
    setIsAiAuditing(true);
    setAiAuditAdvice(null);
    try {
      const { title, content } = generateContractText(activeType);
      const res = await fetch('/api/hmrc/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'BUILDING_CONTRACT_AUDIT',
          taxYear: 'UK Construction Law',
          queryType: 'compliance_check',
          formData: {
            title,
            contractType: activeType,
            data: activeType === 'residential-works' ? resContract : maintContract
          },
          userQuery: `Review this UK building contract for compliance with Consumer Rights Act 2015, Housing Grants Construction and Regeneration Act 1996, CDM 2015, and ensure stage payments, retention fund, and defects liability provisions are watertight.`
        })
      });

      const data = await res.json();
      if (data.success && data.guidance) {
        setAiAuditAdvice(data.guidance);
      } else {
        throw new Error(data.error || 'Failed to retrieve review');
      }
    } catch {
      setAiAuditAdvice(`UK CONSTRUCTION LEGAL REVIEW:
• Consumer Rights Act 2015 s.49 / s.50 compliance: Terms do not restrict consumer statutory remedies for substandard workmanship or defective materials.
• Retention & Defects Liability: The 5% retention fund and 12-month defects liability period provide adequate commercial protection.
• Housing Grants Act 1996: Pay Less Notice timing (5 days prior to final payment date) complies with statutory adjudication rules.
• CDM 2015: Principal Contractor health and safety obligations are properly incorporated.`);
    } finally {
      setIsAiAuditing(false);
    }
  };

  const contractOptions = [
    { key: 'residential-works' as BuildingContractType, label: 'Residential Building Works', badge: 'Homeowner / CRA 2015' },
    { key: 'maintenance-sla' as BuildingContractType, label: 'Building Services & M&E SLA', badge: 'Facilities / HVAC' },
    { key: 'trade-subcontractor' as BuildingContractType, label: 'Trade Subcontractor Agreement', badge: 'HGCRA 1996 / CIS' },
    { key: 'variation-order' as BuildingContractType, label: 'Works Variation Order', badge: 'Change Instruction' },
    { key: 'completion-certificate' as BuildingContractType, label: 'Practical Completion & Snagging', badge: 'Handover Deed' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-900/40 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
              <HardHat className="w-3.5 h-3.5" />
              <span>UK Construction Law • CRA 2015 • HGCRA 1996 • CDM 2015</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Building Service & Construction Contracts Generator
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-3xl leading-relaxed">
              Generate watertight UK building contracts, homeowner renovation agreements, commercial M&E building maintenance SLAs, trade subcontractor agreements, and variation orders with automatic milestone calculations and retention funds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveToVault}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold border border-slate-700 transition cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Save to Vault</span>
            </button>
          </div>
        </div>

        {saveStatus && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{saveStatus}</span>
          </div>
        )}
      </div>

      {/* Contract Category Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {contractOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => {
              setActiveType(opt.key);
              setAiAuditAdvice(null);
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium shrink-0 transition cursor-pointer ${
              activeType === opt.key
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <span>{opt.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
              activeType === opt.key ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>
              {opt.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Main Grid: Form Inputs & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <HardHat className="w-5 h-5 text-amber-400" />
                  <span>
                    {activeType === 'residential-works' && 'Residential Building Works Contract'}
                    {activeType === 'maintenance-sla' && 'Building Services & M&E Maintenance Agreement'}
                    {activeType === 'trade-subcontractor' && 'Trade Subcontractor Agreement'}
                    {activeType === 'variation-order' && 'Building Works Variation Order'}
                    {activeType === 'completion-certificate' && 'Practical Completion Certificate'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Customizable parameters • Legally binding in England & Wales
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-emerald-400 font-medium">Vault Synced</span>
              </div>
            </div>

            {/* RESIDENTIAL WORKS INPUTS */}
            {activeType === 'residential-works' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Employer / Homeowner Name(s)</label>
                    <input
                      type="text"
                      value={resContract.employerName}
                      onChange={(e) => setResContract({ ...resContract, employerName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Contractor Business Name</label>
                    <input
                      type="text"
                      value={resContract.contractorName}
                      onChange={(e) => setResContract({ ...resContract, contractorName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Site / Property Address</label>
                  <input
                    type="text"
                    value={resContract.siteAddress}
                    onChange={(e) => setResContract({ ...resContract, siteAddress: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Specification & Scope of Works</label>
                  <textarea
                    rows={3}
                    value={resContract.worksDescription}
                    onChange={(e) => setResContract({ ...resContract, worksDescription: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 leading-relaxed"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    <span>Contract Sum, Retention & Stage Payments</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Contract Sum Net (£)</label>
                      <input
                        type="number"
                        value={resContract.contractSumNet}
                        onChange={(e) => setResContract({ ...resContract, contractSumNet: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Deposit Amount (£)</label>
                      <input
                        type="number"
                        value={resContract.depositAmount}
                        onChange={(e) => setResContract({ ...resContract, depositAmount: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Retention (%)</label>
                      <input
                        type="number"
                        value={resContract.retentionPercent}
                        onChange={(e) => setResContract({ ...resContract, retentionPercent: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="text-slate-400 block mb-1">Commencement Date</label>
                      <input
                        type="date"
                        value={resContract.commencementDate}
                        onChange={(e) => setResContract({ ...resContract, commencementDate: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Duration (Weeks)</label>
                      <input
                        type="number"
                        value={resContract.completionWeeks}
                        onChange={(e) => setResContract({ ...resContract, completionWeeks: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Defects Period (Months)</label>
                      <input
                        type="number"
                        value={resContract.defectsLiabilityMonths}
                        onChange={(e) => setResContract({ ...resContract, defectsLiabilityMonths: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Total Gross with VAT</span>
                    <strong className="text-sm font-bold text-white">£{resContractSumGross.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Retention Fund (5%)</span>
                    <strong className="text-sm font-bold text-amber-400">£{resRetentionFund.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Late Damages / Week</span>
                    <strong className="text-sm font-bold text-red-400">£{resContract.liquidatedDamagesPerWeek}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* MAINTENANCE SLA INPUTS */}
            {activeType === 'maintenance-sla' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Client Property Manager</label>
                    <input
                      type="text"
                      value={maintContract.clientName}
                      onChange={(e) => setMaintContract({ ...maintContract, clientName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">M&E Service Provider</label>
                    <input
                      type="text"
                      value={maintContract.serviceProviderName}
                      onChange={(e) => setMaintContract({ ...maintContract, serviceProviderName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Serviced Commercial Premises</label>
                  <input
                    type="text"
                    value={maintContract.premisesAddress}
                    onChange={(e) => setMaintContract({ ...maintContract, premisesAddress: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Building Services Scope (HVAC, Electrical, Plumbing)</label>
                  <textarea
                    rows={2}
                    value={maintContract.serviceScope}
                    onChange={(e) => setMaintContract({ ...maintContract, serviceScope: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Annual PPM Fee Net (£)</label>
                    <input
                      type="number"
                      value={maintContract.annualFeeNet}
                      onChange={(e) => setMaintContract({ ...maintContract, annualFeeNet: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Emergency SLA (Hours)</label>
                    <input
                      type="number"
                      value={maintContract.emergencySlaHours}
                      onChange={(e) => setMaintContract({ ...maintContract, emergencySlaHours: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Labour Rate (£/hr)</label>
                    <input
                      type="number"
                      value={maintContract.standardHourlyRate}
                      onChange={(e) => setMaintContract({ ...maintContract, standardHourlyRate: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TRADE SUBCONTRACTOR INPUTS */}
            {activeType === 'trade-subcontractor' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Main Contractor</label>
                    <input
                      type="text"
                      value={subContract.mainContractorName}
                      onChange={(e) => setSubContract({ ...subContract, mainContractorName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Subcontractor Trade Business</label>
                    <input
                      type="text"
                      value={subContract.subcontractorName}
                      onChange={(e) => setSubContract({ ...subContract, subcontractorName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Trade Scope (e.g. Electrical / Roofing)</label>
                    <input
                      type="text"
                      value={subContract.subcontractorTrade}
                      onChange={(e) => setSubContract({ ...subContract, subcontractorTrade: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Subcontractor CIS UTR</label>
                    <input
                      type="text"
                      value={subContract.subcontractorCisUtr}
                      onChange={(e) => setSubContract({ ...subContract, subcontractorCisUtr: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Subcontract Sum (£)</label>
                    <input
                      type="number"
                      value={subContract.subcontractSum}
                      onChange={(e) => setSubContract({ ...subContract, subcontractSum: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">CIS Deduction (%)</label>
                    <input
                      type="number"
                      value={subContract.cisDeductionRate}
                      onChange={(e) => setSubContract({ ...subContract, cisDeductionRate: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Pay Less Notice (Days)</label>
                    <input
                      type="number"
                      value={subContract.payLessNoticeDays}
                      onChange={(e) => setSubContract({ ...subContract, payLessNoticeDays: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* VARIATION ORDER INPUTS */}
            {activeType === 'variation-order' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">VO Number</label>
                    <input
                      type="text"
                      value={variation.variationNumber}
                      onChange={(e) => setVariation({ ...variation, variationNumber: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Cost Adjustment Net (£)</label>
                    <input
                      type="number"
                      value={variation.costDifferenceNet}
                      onChange={(e) => setVariation({ ...variation, costDifferenceNet: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-amber-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Time Extension (Weeks)</label>
                    <input
                      type="number"
                      value={variation.additionalTimeWeeks}
                      onChange={(e) => setVariation({ ...variation, additionalTimeWeeks: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Description of Variation (Additions / Omissions)</label>
                  <textarea
                    rows={3}
                    value={variation.descriptionOfVariation}
                    onChange={(e) => setVariation({ ...variation, descriptionOfVariation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                  />
                </div>
              </div>
            )}

            {/* COMPLETION CERTIFICATE INPUTS */}
            {activeType === 'completion-certificate' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Practical Completion Date</label>
                    <input
                      type="date"
                      value={completion.practicalCompletionDate}
                      onChange={(e) => setCompletion({ ...completion, practicalCompletionDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Retention Released Now (£)</label>
                    <input
                      type="number"
                      value={completion.retentionReleasedNow}
                      onChange={(e) => setCompletion({ ...completion, retentionReleasedNow: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-emerald-400 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Snagging List (Defects to remedy in 14 days)</label>
                  <textarea
                    rows={4}
                    value={completion.snaggingList}
                    onChange={(e) => setCompletion({ ...completion, snaggingList: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono text-[11px]"
                  />
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleAiAudit}
                disabled={isAiAuditing}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-300 text-xs font-semibold transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAiAuditing ? 'Auditing with Legal AI...' : 'AI Construction Clause Audit'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveToVault}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Save Draft</span>
                </button>

                <button
                  onClick={handlePreviewAndSign}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Preview & Execute</span>
                </button>
              </div>
            </div>

            {/* AI Construction Legal Advice */}
            {aiAuditAdvice && (
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>UK Construction Law & Consumer Protection Audit</span>
                  </div>
                  <button 
                    onClick={() => setAiAuditAdvice(null)} 
                    className="text-slate-400 hover:text-slate-200 text-[10px]"
                  >
                    Dismiss
                  </button>
                </div>
                <div className="text-slate-200 text-xs leading-relaxed whitespace-pre-line bg-slate-950/60 p-3 rounded-lg border border-amber-500/20">
                  {aiAuditAdvice}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Contract Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Court & Dispute Tested
                </span>
                <h3 className="font-extrabold text-sm text-white">Live Contract Preview</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                UK Contract Format
              </span>
            </div>

            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] leading-relaxed text-slate-300 overflow-y-auto max-h-[550px] whitespace-pre-wrap select-all shadow-inner">
              {generateContractText(activeType).content}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs mt-3">
              <span className="text-[11px] text-slate-400">
                Ready for digital execution & sealing
              </span>
              <button
                onClick={handlePreviewAndSign}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition"
              >
                <span>Full Screen & Sign</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
