import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Scale, 
  Home, 
  Briefcase, 
  FileSignature, 
  FileText, 
  CheckCircle, 
  Printer, 
  Copy, 
  Download, 
  Sparkles,
  HelpCircle,
  Building,
  User,
  Calendar,
  AlertTriangle,
  Car,
  DollarSign,
  ShoppingBag,
  Users,
  ShieldCheck,
  Tag,
  Receipt,
  HardHat
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { storageVault } from '../../services/storageVault';

interface FormsGeneratorTabProps {
  onOpenDocument: (title: string, subtitle: string, content: string) => void;
  onNavigateToTab?: (tab: any) => void;
}

type FormCategory = 'landlord' | 'loans' | 'buysell' | 'court' | 'business' | 'deeds';

export const FormsGeneratorTab: React.FC<FormsGeneratorTabProps> = ({ onOpenDocument, onNavigateToTab }) => {
  const { checkAccess } = useSubscription();

  const [activeCategory, setActiveCategory] = useState<FormCategory>('landlord');
  const [selectedForm, setSelectedForm] = useState<string>('ast-agreement');

  // ==========================================
  // 1. LANDLORD AGREEMENTS STATE
  // ==========================================
  // AST Agreement
  const [astLandlord, setAstLandlord] = useState('Alexander Vance');
  const [astTenant, setAstTenant] = useState('Oliver Smith & Emily Watson');
  const [astProperty, setAstProperty] = useState('Flat 4, 18 Kensington Gardens, London, W8 4PX');
  const [astTermMonths, setAstTermMonths] = useState(12);
  const [astStartDate, setAstStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [astRentPcm, setAstRentPcm] = useState(1750);
  const [astDeposit, setAstDeposit] = useState(2000); // within 5-week cap

  // Lodger Agreement
  const [lodgerLandlord, setLodgerLandlord] = useState('Sarah Jenkins (Resident Landlord)');
  const [lodgerName, setLodgerName] = useState('Liam Davies');
  const [lodgerAddress, setLodgerAddress] = useState('24 Oakwood Drive, Manchester, M20 2AB');
  const [lodgerRentWeekly, setLodgerRentWeekly] = useState(150);
  const [lodgerNoticeWeeks, setLodgerNoticeWeeks] = useState(4);

  // Form 6A & Surrender
  const [f6aTenant, setF6aTenant] = useState('Michael Brown');
  const [f6aAddress, setF6aAddress] = useState('Flat 3, 55 High Street, Bristol, BS1 2CC');
  const [f6aExpiryDate, setF6aExpiryDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    return d.toISOString().split('T')[0];
  });
  const [f6aLandlord, setF6aLandlord] = useState('Harbour Lettings Ltd');

  const [surrenderTenant, setSurrenderTenant] = useState('Alice Cooper');
  const [surrenderLandlord, setSurrenderLandlord] = useState('Oakwood Properties Ltd');
  const [surrenderAddress, setSurrenderAddress] = useState('18 Green Lane, Leeds, LS2 9DD');
  const [surrenderDate, setSurrenderDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [surrenderDepositReturn, setSurrenderDepositReturn] = useState(1200);

  // ==========================================
  // 2. LOAN & FINANCIAL AGREEMENTS STATE
  // ==========================================
  const [loanLender, setLoanLender] = useState('Victoria Sterling');
  const [loanBorrower, setLoanBorrower] = useState('Marcus Aurelius Blackwood');
  const [loanPrincipal, setLoanPrincipal] = useState(5000);
  const [loanInterestRate, setLoanInterestRate] = useState(5.0); // % per annum
  const [loanRepaymentType, setLoanRepaymentType] = useState<'monthly' | 'lump-sum'>('monthly');
  const [loanTermMonths, setLoanTermMonths] = useState(24);
  const [loanPurpose, setLoanPurpose] = useState('working capital for commercial inventory acquisition');

  // Director's Loan Agreement
  const [directorCompanyName, setDirectorCompanyName] = useState('Apex Technologies Ltd');
  const [directorName, setDirectorName] = useState('Charles Wild (Director)');
  const [directorLoanDirection, setDirectorLoanDirection] = useState<'company-to-director' | 'director-to-company'>('director-to-company');
  const [directorLoanAmount, setDirectorLoanAmount] = useState(15000);

  // ==========================================
  // 3. BUY & SELL CONTRACTS STATE
  // ==========================================
  // Vehicle Sale Contract
  const [vehSeller, setVehSeller] = useState('James Miller');
  const [vehBuyer, setVehBuyer] = useState('Robert Taylor');
  const [vehMakeModel, setVehMakeModel] = useState('Volkswagen Golf 2.0 TDI GTD');
  const [vehReg, setVehReg] = useState('VK21 XRT');
  const [vehVin, setVehVin] = useState('WVWZZZAUZMW194821');
  const [vehMileage, setVehMileage] = useState(48250);
  const [vehPrice, setVehPrice] = useState(13500);

  // Sale of Goods Contract
  const [goodsSeller, setGoodsSeller] = useState('Northern Machinery Supplies Ltd');
  const [goodsBuyer, setGoodsBuyer] = useState('Summit Manufacturing Ltd');
  const [goodsDesc, setGoodsDesc] = useState('Industrial 3-Phase CNC Milling Machine with tooling package');
  const [goodsPrice, setGoodsPrice] = useState(9400);

  // Freelance / Services Contract
  const [contractClient, setContractClient] = useState('Quantum Ventures Ltd');
  const [contractFreelancer, setContractFreelancer] = useState('Digital Edge Consultancy Ltd');
  const [contractServices, setContractServices] = useState('Full stack web application development, cloud database migration, and API integration');
  const [contractFee, setContractFee] = useState(4500);

  // ==========================================
  // 4. COURT & INSOLVENCY STATE
  // ==========================================
  const [n1Claimant, setN1Claimant] = useState('John Doe');
  const [n1ClaimantAddress, setN1ClaimantAddress] = useState('14 Park Road, London, NW1 4AA');
  const [n1Defendant, setN1Defendant] = useState('Apex Digital Services Ltd');
  const [n1DefendantAddress, setN1DefendantAddress] = useState('22 Commercial Street, Manchester, M1 2BB');
  const [n1Amount, setN1Amount] = useState(3450);
  const [n1BriefDescription, setN1BriefDescription] = useState('Breach of contract for unpaid IT software development and consultancy services delivered in March 2024');

  const [n244ClaimNo, setN244ClaimNo] = useState('MC24P0892');
  const [n244Applicant, setN244Applicant] = useState('John Doe');
  const [n244Reason, setN244Reason] = useState('The claim form was served to a previous address where the applicant no longer resided. The applicant has a real prospect of successfully defending the claim on the merits.');

  const [statCreditor, setStatCreditor] = useState('Prime Logistics Ltd');
  const [statDebtor, setStatDebtor] = useState('Metro Construction Ltd');
  const [statDebtAmount, setStatDebtAmount] = useState(8750);
  const [statInvoiceRef, setStatInvoiceRef] = useState('INV-94021');

  // ==========================================
  // 5. DEEDS & POWERS STATE
  // ==========================================
  const [donorName, setDonorName] = useState('Robert Henry Williams');
  const [donorAddress, setDonorAddress] = useState('12 Elm Grove, Oxford, OX1 3EE');
  const [attorneyName, setAttorneyName] = useState('Sarah Jane Williams');
  const [attorneyAddress, setAttorneyAddress] = useState('8 Meadow Way, Cambridge, CB2 1TT');

  const [oldName, setOldName] = useState('Thomas Edward Jones');
  const [newName, setNewName] = useState('Thomas Edward Alexander-Jones');
  const [deedAddress, setDeedAddress] = useState('44 Church Lane, Bath, BA1 1NN');

  // ==========================================
  // GENERATORS
  // ==========================================

  // 1. Assured Shorthold Tenancy Agreement
  const handleGenerateAST = () => {
    if (!checkAccess('Assured Shorthold Tenancy Agreement Generator')) return;

    // Calculate maximum permitted deposit under Tenant Fees Act 2019 (5 weeks rent for rent < £50k/yr)
    const annualRent = astRentPcm * 12;
    const maxPermittedDeposit = (annualRent / 52) * 5;
    const depositWarning = astDeposit > maxPermittedDeposit 
      ? `\n[COMPLIANCE NOTE: The deposit of £${astDeposit} exceeds the 5-week statutory cap of £${maxPermittedDeposit.toFixed(2)} under the Tenant Fees Act 2019. Adjust deposit to £${maxPermittedDeposit.toFixed(2)} or lower.]`
      : '';

    const doc = `ASSURED SHORTHOLD TENANCY AGREEMENT (AST)
GOVERNED BY THE HOUSING ACT 1988 (AS AMENDED) & TENANT FEES ACT 2019
JURISDICTION: ENGLAND AND WALES

THIS AGREEMENT is made on: ${new Date().toLocaleDateString('en-GB')}

PARTIES:
(1) LANDLORD: ${astLandlord}
    Address for Service (pursuant to s.48 Landlord and Tenant Act 1987): [Landlord Service Address]
(2) TENANT(S): ${astTenant}

PROPERTY:
${astProperty} (together with fixtures, fittings, and contents as set out in the Inventory)

1. THE TERM AND RENT:
1.1 The Landlord lets to the Tenant the Property for a fixed term of ${astTermMonths} months commencing on ${astStartDate} ("the Commencement Date").
1.2 The rent is £${astRentPcm.toFixed(2)} per calendar month, payable in advance on the 1st day of each calendar month without deduction or set-off.
1.3 First payment of rent shall be made on or before the Commencement Date.

2. TENANCY DEPOSIT:
2.1 The Tenant shall pay a deposit of £${astDeposit.toFixed(2)} upon signing this Agreement.${depositWarning}
2.2 Under Sections 213 and 214 of the Housing Act 2004, the Landlord shall protect the deposit with a Government-approved Tenancy Deposit Protection Scheme (DPS / TDS / MyDeposits) within 30 days of receipt and provide the Tenant with the statutory Prescribed Information.

3. TENANT'S COVENANTS:
3.1 To pay the rent punctually on the due dates.
3.2 To pay all Council Tax, water rates, gas, electricity, broadband, and television licence charges during the tenancy.
3.3 To use the Property strictly as a single private residential dwelling and not to carry on any trade or profession.
3.4 Not to assign, sublet, or part with possession of the Property or take in lodgers without the prior written consent of the Landlord.
3.5 To keep the interior of the Property and its fixtures in good and clean repair and condition (fair wear and tear excepted).
3.6 To permit the Landlord or their authorized agent, upon giving at least 24 hours' prior written notice (pursuant to s.11(6) Landlord and Tenant Act 1985), to enter and inspect the condition of the Property at reasonable hours.

4. LANDLORD'S COVENANTS:
4.1 Quiet Enjoyment: That the Tenant paying the rent and observing the covenants may quietly possess and enjoy the Property without unlawful interruption by the Landlord.
4.2 Statutory Repair: To comply with Section 11 of the Landlord and Tenant Act 1985 and the Homes (Fitness for Human Habitation) Act 2018 regarding the structure, exterior, installations for sanitation, heating, hot water, gas, and electricity.
4.3 Safety: To maintain annual Gas Safety Certificates (CP12) and Electrical Installation Condition Reports (EICR).

5. DETERMINATION & SECTION 8 RE-ENTRY:
5.1 If rent is unpaid for 14 days after becoming due (whether formally demanded or not), or if any covenant is breached, the Landlord may seek possession under Section 8 of the Housing Act 1988 relying on Schedule 2 grounds (including Mandatory Ground 8 for 2 months' rent arrears).

SIGNED by the Parties on the date first written above:

Signed by the Landlord:
Signature: ___________________________
Print Name: ${astLandlord}

Signed by the Tenant(s):
Signature: ___________________________
Print Name: ${astTenant}`;

    onOpenDocument('Assured Shorthold Tenancy Agreement', 'Full Statutory AST under Housing Act 1988 & Tenant Fees Act 2019', doc);
  };

  // 2. Lodger Agreement (Excluded Licence to Occupy)
  const handleGenerateLodger = () => {
    if (!checkAccess('Lodger Agreement Generator')) return;

    const doc = `LODGER AGREEMENT (LICENCE TO OCCUPY FOR A RESIDENT LANDLORD)
EXCLUDED LICENCE UNDER SECTION 3A OF THE PROTECTION FROM EVICTION ACT 1977
JURISDICTION: ENGLAND AND WALES

THIS LICENCE AGREEMENT is made on: ${new Date().toLocaleDateString('en-GB')}

BETWEEN:
(1) RESIDENT LANDLORD: ${lodgerLandlord}
(2) LODGER: ${lodgerName}

ROOM AND SHARED ACCOMMODATION:
Premises: ${lodgerAddress}
Allocated Room: Single/Double Bedroom (Private to Lodger)
Shared Facilities: Kitchen, bathroom, living room, and garden (shared with Landlord).

1. NATURE OF AGREEMENT:
1.1 This agreement creates an Excluded Licence to Occupy and NOT an Assured Shorthold Tenancy. The Landlord retains legal possession and unrestricted access to all parts of the property.
1.2 The Lodger has a personal licence to occupy the Room and share common facilities.

2. LICENCE FEE & UTILITIES:
2.1 The Lodger shall pay a licence fee of £${lodgerRentWeekly.toFixed(2)} per week, payable in advance on each Monday.
2.2 The licence fee includes reasonable domestic use of gas, electricity, water, Council Tax, and high-speed Wi-Fi broadband.

3. HOUSE RULES:
3.1 The Lodger shall keep the Room in a clean, tidy, and hygienic condition.
3.2 No smoking, vaping, or illegal substances on the premises.
3.3 No overnight guests without prior written consent from the Landlord.
3.4 Consideration: To observe quiet hours between 11:00 PM and 7:00 AM.

4. TERMINATION & NOTICE:
4.1 Either party may terminate this licence at any time by giving ${lodgerNoticeWeeks} weeks' written notice to the other.
4.2 Because the Landlord is resident in the property, court proceedings for eviction are NOT required under Section 3A of the Protection from Eviction Act 1977 upon expiry of reasonable notice.

Signed by the Resident Landlord:
Signature: ___________________________
Date: ${new Date().toLocaleDateString('en-GB')}

Signed by the Lodger:
Signature: ___________________________
Date: ${new Date().toLocaleDateString('en-GB')}`;

    onOpenDocument('Lodger Agreement (Excluded Licence)', 'Resident Landlord Agreement under Protection from Eviction Act 1977', doc);
  };

  // 3. Loan Agreement & Promissory Note
  const handleGenerateLoan = () => {
    if (!checkAccess('Loan Agreement & Promissory Note Generator')) return;

    const monthlyInstalment = loanRepaymentType === 'monthly'
      ? (loanPrincipal / loanTermMonths) * (1 + (loanInterestRate / 100))
      : 0;

    const doc = `FORMAL LOAN AGREEMENT AND PROMISSORY NOTE
GOVERNED BY THE LAWS OF ENGLAND AND WALES

THIS AGREEMENT is dated: ${new Date().toLocaleDateString('en-GB')}

BETWEEN:
(1) LENDER: ${loanLender}
(2) BORROWER: ${loanBorrower}

1. PRINCIPAL LOAN AMOUNT:
1.1 The Lender agrees to advance to the Borrower the principal sum of £${loanPrincipal.toFixed(2)} ("the Loan Amount") for the purpose of ${loanPurpose}.
1.2 The Borrower acknowledges receipt of the Loan Amount in cleared funds.

2. INTEREST:
2.1 The Loan shall accrue simple interest at the rate of ${loanInterestRate.toFixed(2)}% per annum on the outstanding balance until repaid in full.

3. REPAYMENT TERMS:
${loanRepaymentType === 'monthly' 
  ? `3.1 The Borrower covenants to repay the Loan in ${loanTermMonths} consecutive monthly instalments of £${monthlyInstalment.toFixed(2)}, commencing on the 1st day of next month, with the final payment clearing the balance on or before [Maturity Date].`
  : `3.1 The Borrower covenants to repay the entire principal sum of £${loanPrincipal.toFixed(2)} together with accrued interest in one lump sum on or before [Maturity Date].`}

4. DEFAULT & ACCELERATION:
4.1 If the Borrower fails to pay any instalment within fourteen (14) days of its due date, or becomes subject to bankruptcy or insolvency proceedings:
    (a) The entire outstanding balance of principal and interest shall become IMMEDIATELY DUE AND PAYABLE without further notice or demand;
    (b) Default interest shall accrue on the overdue balance at the rate of 4.0% per annum above the Bank of England base rate.

5. COSTS & ENFORCEMENT:
5.1 The Borrower shall indemnify the Lender in full against all legal costs, court issue fees, and tracing agent expenses reasonably incurred in enforcing payment under this Agreement.

6. PROMISSORY NOTE (PROMISE TO PAY):
FOR VALUE RECEIVED, I, ${loanBorrower.toUpperCase()}, HEREBY UNCONDITIONALLY PROMISE TO PAY to ${loanLender} the sum of £${loanPrincipal.toFixed(2)} with interest as set out in this Agreement.

IN WITNESS WHEREOF the parties have executed this Agreement as a Deed:

Signed as a Deed by the Borrower:
Signature: ___________________________
Name: ${loanBorrower}

In the presence of Witness:
Witness Signature: ___________________________
Witness Name: ___________________________
Witness Address: ___________________________

Signed as a Deed by the Lender:
Signature: ___________________________
Name: ${loanLender}`;

    onOpenDocument('Loan Agreement & Promissory Note', 'Legally Enforceable Loan Deed with Acceleration Clause', doc);
  };

  // 4. Used Motor Vehicle Sale Agreement
  const handleGenerateVehicleContract = () => {
    if (!checkAccess('Vehicle Sale Contract Generator')) return;

    const doc = `PRIVATE USED MOTOR VEHICLE SALE AGREEMENT & RECEIPT
FOR SALE OF MOTOR VEHICLES BETWEEN PRIVATE INDIVIDUALS IN ENGLAND AND WALES

Date of Sale: ${new Date().toLocaleDateString('en-GB')}
Time of Transaction: ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}

SELLER DETAILS:
Name: ${vehSeller}
Address: [Seller Residential Address]
Telephone: [Seller Telephone]

BUYER DETAILS:
Name: ${vehBuyer}
Address: [Buyer Residential Address]
Telephone: [Buyer Telephone]

VEHICLE PARTICULARS:
Make & Model: ${vehMakeModel}
Vehicle Registration Mark (VRM): ${vehReg}
VIN / Chassis Number: ${vehVin}
Recorded Odometer Mileage: ${vehMileage.toLocaleString()} miles
Colour / Engine: [Vehicle Colour / Engine Size]

FINANCIAL TERMS:
Agreed Purchase Price: £${vehPrice.toFixed(2)}
Payment Method: Bank Transfer / Cleared Funds
Deposit Paid (if any): £0.00
Outstanding Balance: £0.00 (PAID IN FULL)

DECLARATIONS & TERMS OF CONTRACT:
1. SELLER'S TITLE WARRANTY:
The Seller expressly warrants that:
(a) The Seller is the lawful legal owner of the vehicle and has full authority to sell;
(b) The vehicle is entirely free from any outstanding finance, hire purchase agreements, liens, or encumbrances;
(c) The vehicle has not to the best of the Seller's knowledge been recorded as an insurance write-off (Category A, B, S, or N) unless expressly disclosed.

2. PRIVATE SALE "SOLD AS SEEN" CONDITION:
(a) This transaction is a private sale between individuals and is NOT a sale in the course of a business.
(b) The Buyer has thoroughly inspected the vehicle, conducted a test drive, and verified the mechanical and physical condition.
(c) The vehicle is purchased strictly "AS SEEN, TRIED AND APPROVED", without any warranty, express or implied, as to mechanical condition, roadworthiness, or fitness for purpose, save for the statutory requirements under the Road Traffic Act 1988 s.75 and the Misrepresentation Act 1967.

3. TRANSFER OF RISK & V5C LOGBOOK:
(a) Ownership and risk pass to the Buyer upon signature of this receipt and receipt of cleared funds.
(b) The Seller has handed over the green V5C/2 "New Keeper's Slip" and notified the DVLA of the change of keeper online.
(c) The Buyer is responsible for taxing and insuring the vehicle prior to driving on public highways.

SELLER SIGNATURE:
I confirm that I have sold the vehicle described above for £${vehPrice.toFixed(2)} and received payment in full.
Signature: ___________________________
Date: ${new Date().toLocaleDateString('en-GB')}

BUYER SIGNATURE:
I confirm that I have inspected, test-driven, and purchased the vehicle described above for £${vehPrice.toFixed(2)} on the terms set out.
Signature: ___________________________
Date: ${new Date().toLocaleDateString('en-GB')}`;

    onOpenDocument('Used Vehicle Sale Agreement & Bill of Sale', 'Official Private Car Sale Contract with V5C & Title Warranty', doc);
  };

  // 5. Sale of Goods & Bill of Sale Agreement
  const handleGenerateSaleOfGoods = () => {
    if (!checkAccess('Sale of Goods Contract Generator')) return;

    const doc = `CONTRACT FOR THE SALE OF GOODS (BILL OF SALE)
PURSUANT TO THE SALE OF GOODS ACT 1979 & COMMON LAW OF ENGLAND AND WALES

THIS CONTRACT is dated: ${new Date().toLocaleDateString('en-GB')}

BETWEEN:
(1) SELLER: ${goodsSeller}
(2) BUYER: ${goodsBuyer}

1. SALE OF GOODS:
1.1 The Seller agrees to sell, transfer, and deliver to the Buyer, and the Buyer agrees to purchase:
    ${goodsDesc} ("the Goods").

2. PURCHASE PRICE & PAYMENT:
2.1 The total purchase price for the Goods is £${goodsPrice.toFixed(2)} (exclusive/inclusive of applicable UK VAT).
2.2 Payment shall be made in full in cleared funds upon delivery or collection.

3. PASSING OF TITLE AND RISK:
3.1 Risk of loss or damage to the Goods shall pass to the Buyer upon physical delivery.
3.2 Legal and equitable title to the Goods shall pass to the Buyer ONLY upon receipt of payment in full.

4. SELLER WARRANTIES:
4.1 The Seller warrants that it has good and marketable title to the Goods and that they are free from any third-party charge, lien, or encumbrance.
4.2 The Seller warrants that the Goods correspond with their contractual description.

5. INSPECTION & ACCEPTANCE:
5.1 The Buyer shall have an inspection period of forty-eight (48) hours following delivery to inspect the Goods and notify the Seller of any patent defect or non-conformity.
5.2 Failure to notify within this period shall constitute irrevocable acceptance of the Goods.

6. GOVERNING LAW & DISPUTES:
6.1 This Contract shall be governed by the laws of England and Wales, and the courts of England and Wales shall have exclusive jurisdiction.

Signed for and on behalf of the Seller:
Signature: ___________________________
Name: ${goodsSeller}

Signed for and on behalf of the Buyer:
Signature: ___________________________
Name: ${goodsBuyer}`;

    onOpenDocument('Sale of Goods & Bill of Sale Agreement', 'Commercial / Personal Sale of Goods Agreement', doc);
  };

  // 6. Freelance & Services Contract
  const handleGenerateFreelanceContract = () => {
    if (!checkAccess('Freelance & Services Contract Generator')) return;

    const doc = `INDEPENDENT CONTRACTOR & SERVICES AGREEMENT
GOVERNED BY THE LAWS OF ENGLAND AND WALES

THIS AGREEMENT is made on: ${new Date().toLocaleDateString('en-GB')}

BETWEEN:
(1) CLIENT: ${contractClient}
(2) CONTRACTOR: ${contractFreelancer}

1. SERVICES & DELIVERABLES:
1.1 The Contractor shall provide the following professional services:
    ${contractServices} ("the Services").
1.2 The Contractor shall perform the Services with reasonable care, skill, and diligence in accordance with best industry practice.

2. FEES AND PAYMENT:
2.1 The Client shall pay the Contractor a total fee of £${contractFee.toFixed(2)}.
2.2 Payment shall be made within fourteen (14) days of receipt of invoice upon satisfactory completion of milestone deliverables.

3. INTELLECTUAL PROPERTY RIGHTS (IP ASSIGNMENT):
3.1 Upon receipt of payment in full, the Contractor hereby assigns to the Client with full title guarantee all copyright, design rights, and intellectual property in the Deliverables created specifically for the Client under this Agreement.
3.2 Pre-existing IP and background tools shall remain the proprietary property of the Contractor, subject to a perpetual, royalty-free licence to the Client.

4. INDEPENDENT CONTRACTOR STATUS (IR35 / TAX):
4.1 The parties declare that the Contractor is an independent contractor. Nothing in this Agreement shall render the Contractor an employee, worker, or partner of the Client.
4.2 The Contractor retains full discretion as to the manner and timing of performing the Services.

5. CONFIDENTIALITY:
5.1 Each party covenants to keep strictly secret and confidential all trade secrets, client data, and proprietary technical information disclosed during the engagement.

6. LIMITATION OF LIABILITY:
6.1 The total aggregate liability of either party arising out of or in connection with this Agreement shall be limited to the total fees paid under Clause 2.1.

Signed for and on behalf of the Client:
Signature: ___________________________
Name: ${contractClient}

Signed for and on behalf of the Contractor:
Signature: ___________________________
Name: ${contractFreelancer}`;

    onOpenDocument('Independent Contractor & Services Agreement', 'Professional B2B Services Agreement with IP Assignment', doc);
  };

  // Court N1, N244, 6A, Surrender, StatDemand, GPA, DeedPoll
  const handleGenerateN1 = () => {
    if (!checkAccess('Form N1 Claim Form Generator')) return;

    let courtFee = 115;
    if (n1Amount <= 300) courtFee = 35;
    else if (n1Amount <= 500) courtFee = 50;
    else if (n1Amount <= 1000) courtFee = 70;
    else if (n1Amount <= 1500) courtFee = 80;
    else if (n1Amount <= 3000) courtFee = 115;
    else if (n1Amount <= 5000) courtFee = 205;
    else if (n1Amount <= 10000) courtFee = 455;
    else courtFee = Math.round(n1Amount * 0.05);

    const doc = `HMCTS FORM N1: GENERAL CLAIM FORM
IN THE COUNTY COURT
CIVIL MONEY CLAIMS JURISDICTION

Claim No: [Issued by Court upon Filing]

CLAIMANT:
${n1Claimant}
Address for Service: ${n1ClaimantAddress}

DEFENDANT:
${n1Defendant}
Address: ${n1DefendantAddress}

BRIEF DETAILS OF CLAIM:
The Claimant's claim is for the sum of £${n1Amount.toFixed(2)} in respect of:
${n1BriefDescription}.

PARTICULARS OF CLAIM:
1. The Claimant and the Defendant entered into a legally binding agreement for the supply of goods and/or services.
2. The Claimant performed all contractual obligations.
3. The Defendant has failed, refused, or neglected to make payment of invoices lawfully due.
4. Despite formal Letter Before Action served in compliance with the Pre-Action Protocol for Debt Claims under the Civil Procedure Rules (CPR), the balance remains unpaid.

AND THE CLAIMANT CLAIMS:
1. The principal sum of £${n1Amount.toFixed(2)}.
2. Statutory interest pursuant to Section 69 of the County Courts Act 1984 at the rate of 8.0% per annum from the date payment fell due to judgment.
3. Court issue fees of £${courtFee.toFixed(2)}.

STATEMENT OF VALUE:
- Principal debt: £${n1Amount.toFixed(2)}
- Court issue fee: £${courtFee.toFixed(2)}
Total: £${(n1Amount + courtFee).toFixed(2)}

STATEMENT OF TRUTH:
I believe that the facts stated in this Claim Form and Particulars of Claim are true.

Signed: ___________________________
Full Name: ${n1Claimant} (Claimant in Person)
Date: ${new Date().toLocaleDateString('en-GB')}`;

    onOpenDocument('Form N1: County Court General Claim Form', 'HMCTS CPR Part 7 Civil Money Claim', doc);
  };

  const handleGenerateN244 = () => {
    if (!checkAccess('Form N244 Application Notice Generator')) return;

    const doc = `HMCTS FORM N244: APPLICATION NOTICE
IN THE COUNTY COURT
CIVIL JURISDICTION

Claim No: ${n244ClaimNo}
APPLICANT: ${n244Applicant} (Defendant)

1. What order are you seeking and why?
The Applicant applies pursuant to CPR Rule 13.3 for an order that:
(a) The Default Judgment entered against the Defendant be set aside.
(b) The Defendant be granted 14 days from the date of the order to file and serve a Defence.
(c) Any enforcement action, High Court writ, or County Court bailiff warrant be stayed pending determination of this application.

2. Grounds of Application:
${n244Reason}

WITNESS STATEMENT OF ${n244Applicant.toUpperCase()}:
1. I am the Defendant in these proceedings.
2. I was unaware of the issue of the Claim Form until recently discovering the entry of a County Court Judgment on my credit file.
3. The Claim Form was served to an address where I did not reside at the time of deemed service.
4. I have acted with promptness upon discovering the judgment and have a real prospect of successfully defending the underlying claim.

STATEMENT OF TRUTH:
I believe that the facts stated in this application notice are true.

Signed: ___________________________
Applicant: ${n244Applicant}
Date: ${new Date().toLocaleDateString('en-GB')}`;

    onOpenDocument('Form N244: Application Notice (Set Aside CCJ)', 'Civil Procedure Rules CPR Part 23 & Part 13', doc);
  };

  const handleGenerateForm6A = () => {
    if (!checkAccess('Form 6A Section 21 Notice Generator')) return;

    const doc = `FORM 6A: NOTICE REQUIRING POSSESSION OF A PROPERTY LET ON AN ASSURED SHORTHOLD TENANCY
Housing Act 1988 section 21(1) and (4) as amended by Section 37 of the Deregulation Act 2015

To: ${f6aTenant}
Address of Property: ${f6aAddress}

1. You are required to leave the below address after:
   ${f6aExpiryDate}

2. Name and Address of Landlord:
   ${f6aLandlord}
   Date of this Notice: ${new Date().toLocaleDateString('en-GB')}

NOTES FOR THE TENANT:
- You are entitled to at least two months' notice before the landlord can apply to the court for a possession order.
- The landlord cannot apply to the court before the date specified in paragraph 1 above.

Signed: ___________________________
On behalf of: ${f6aLandlord}
Date: ${new Date().toLocaleDateString('en-GB')}`;

    onOpenDocument('Form 6A: Section 21 Possession Notice', 'Housing Act 1988 s.21 & Deregulation Act 2015', doc);
  };

  const handleGenerateSurrenderDeed = () => {
    if (!checkAccess('Tenancy Surrender Deed Generator')) return;

    const doc = `DEED OF SURRENDER OF ASSURED SHORTHOLD TENANCY
MADE UNDER THE LAWS OF ENGLAND AND WALES

THIS DEED OF SURRENDER is made on: ${new Date().toLocaleDateString('en-GB')}

BETWEEN:
(1) ${surrenderLandlord} ("the Landlord")
(2) ${surrenderTenant} ("the Tenant")

WHEREAS:
A. The Tenant occupies residential premises known as ${surrenderAddress}.
B. The parties have mutually agreed to terminate and surrender the tenancy with effect from ${surrenderDate}.

TERMS:
1. The Tenant surrenders all interest in the Property with effect from ${surrenderDate}.
2. The deposit of £${surrenderDepositReturn.toFixed(2)} shall be released to the Tenant.
3. Both parties mutually release each other from all future liabilities and rental claims.

Signed as a Deed by the Tenant: ___________________________
Signed as a Deed by the Landlord: ___________________________`;

    onOpenDocument('Deed of Tenancy Surrender', 'Binding Legal Deed for Mutual Tenancy Termination', doc);
  };

  const handleGenerateStatDemand = () => {
    if (!checkAccess('Statutory Demand Form Generator')) return;

    const doc = `STATUTORY DEMAND UNDER SECTION 123(1)(a) OF THE INSOLVENCY ACT 1986
FORM 4.1 PRESCRIBED NOTICE

WARNING: If you fail to respond within 21 days, court proceedings for the winding up / compulsory liquidation of your company may be commenced.

To: ${statDebtor}
From: ${statCreditor}

PARTICULARS OF DEBT:
The Creditor claims that the Debtor is indebted in the liquidated sum of £${statDebtAmount.toFixed(2)} in respect of commercial invoice ${statInvoiceRef}.

DEMAND:
The Creditor formally demands that you satisfy the debt within 21 days of service.

Dated: ${new Date().toLocaleDateString('en-GB')}
Signed: ___________________________
Representative of ${statCreditor}`;

    onOpenDocument('Form 4.1: Statutory Demand for Unpaid Debt', 'Insolvency Act 1986 Pre-Liquidation Form', doc);
  };

  const handleGenerateGPA = () => {
    if (!checkAccess('General Power of Attorney Generator')) return;

    const doc = `GENERAL POWER OF ATTORNEY
PURSUANT TO SECTION 10 OF THE POWERS OF ATTORNEY ACT 1971

THIS GENERAL POWER OF ATTORNEY is made on ${new Date().toLocaleDateString('en-GB')}

BY: ${donorName} of ${donorAddress} ("the Donor")
APPOINTING: ${attorneyName} of ${attorneyAddress} ("the Attorney")

TO BE MY ATTORNEY in accordance with Section 10 of the Powers of Attorney Act 1971.

I confer upon my Attorney full general power and authority to do on my behalf anything that I can lawfully do by an attorney, including operating bank accounts, managing property, and signing contracts.

Signed as a Deed by ${donorName}: ___________________________
In the presence of Witness: ___________________________`;

    onOpenDocument('General Power of Attorney Deed', 'Powers of Attorney Act 1971 s.10', doc);
  };

  const handleGenerateDeedPoll = () => {
    if (!checkAccess('Deed Poll Name Change Generator')) return;

    const doc = `DEED OF CHANGE OF NAME (DEED POLL)
GOVERNED BY THE LAWS OF ENGLAND AND WALES

THIS DEED OF CHANGE OF NAME is made this ${new Date().toLocaleDateString('en-GB')}

BY ME the undersigned: ${newName} (formerly known as ${oldName}) of ${deedAddress}.

I absolutely renounce and abandon the use of my former name of ${oldName} and assume the name of ${newName}.

Signed as a Deed:
New Signature: ___________________________
Former Signature: ___________________________
In the presence of Two Independent Witnesses:
Witness 1: ___________________________
Witness 2: ___________________________`;

    onOpenDocument('Deed of Change of Name (Deed Poll)', 'Statutory Adult Name Change Deed (England & Wales)', doc);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/40 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">UK Legal Contracts & Forms Generator</h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black uppercase tracking-wider">
                  Court & Statutory
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Generate court-ready tenancy agreements, loan agreements, vehicle bill of sale contracts, freelance agreements, HMCTS claims, and deeds.
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-5">
            <span className="text-xs text-slate-400">Enforceability Standard</span>
            <div className="text-base font-bold text-amber-400 mt-0.5">
              Laws of England & Wales
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="flex border-b border-slate-800 text-xs font-semibold overflow-x-auto gap-1 pb-1">
        {onNavigateToTab && (
          <>
            <button
              onClick={() => onNavigateToTab('hmrc')}
              className="py-2 px-3 rounded-lg border border-indigo-500/40 bg-indigo-950/60 text-indigo-300 hover:bg-indigo-900 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-sm"
              title="Open HMRC Tax Schedules & Forms Generator"
            >
              <Receipt className="w-3.5 h-3.5 text-indigo-400" />
              <span>HMRC Forms (SA105 / PAYE / CIS)</span>
            </button>

            <button
              onClick={() => onNavigateToTab('building')}
              className="py-2 px-3 rounded-lg border border-amber-500/40 bg-amber-950/60 text-amber-300 hover:bg-amber-900 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-sm"
              title="Open Building Services & Works Contracts Generator"
            >
              <HardHat className="w-3.5 h-3.5 text-amber-400" />
              <span>Building Contracts (Works / SLA / M&E)</span>
            </button>
          </>
        )}

        <button
          onClick={() => { setActiveCategory('landlord'); setSelectedForm('ast-agreement'); }}
          className={`py-2 px-3 rounded-lg border transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeCategory === 'landlord' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          Landlord Agreements (AST / Lodger)
        </button>

        <button
          onClick={() => { setActiveCategory('loans'); setSelectedForm('loan-promissory'); }}
          className={`py-2 px-3 rounded-lg border transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeCategory === 'loans' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          Loan Agreements & Notes
        </button>

        <button
          onClick={() => { setActiveCategory('buysell'); setSelectedForm('vehicle-sale'); }}
          className={`py-2 px-3 rounded-lg border transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeCategory === 'buysell' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Buy & Sell Contracts (Car / Goods)
        </button>

        <button
          onClick={() => { setActiveCategory('court'); setSelectedForm('n1-claim'); }}
          className={`py-2 px-3 rounded-lg border transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeCategory === 'court' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          HMCTS Court Forms (N1 / N244)
        </button>

        <button
          onClick={() => { setActiveCategory('business'); setSelectedForm('stat-demand'); }}
          className={`py-2 px-3 rounded-lg border transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeCategory === 'business' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Insolvency (Form 4.1)
        </button>

        <button
          onClick={() => { setActiveCategory('deeds'); setSelectedForm('power-of-attorney'); }}
          className={`py-2 px-3 rounded-lg border transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeCategory === 'deeds' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <FileSignature className="w-3.5 h-3.5" />
          Deeds & Powers (Deed Poll / GPA)
        </button>
      </div>

      {/* Main Form Workspaces */}
      <div className="space-y-5">
        
        {/* ======================================================== */}
        {/* CATEGORY 1: LANDLORD & TENANCY AGREEMENTS */}
        {/* ======================================================== */}
        {activeCategory === 'landlord' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedForm('ast-agreement')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  selectedForm === 'ast-agreement' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                1. Assured Shorthold Tenancy (AST) Agreement
              </button>
              <button
                onClick={() => setSelectedForm('lodger-agreement')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  selectedForm === 'lodger-agreement' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                2. Lodger Agreement (Resident Landlord)
              </button>
              <button
                onClick={() => setSelectedForm('form-6a')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  selectedForm === 'form-6a' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                3. Form 6A (Section 21 Eviction)
              </button>
              <button
                onClick={() => setSelectedForm('surrender-deed')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  selectedForm === 'surrender-deed' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                4. Deed of Tenancy Surrender
              </button>
            </div>

            {/* AST FORM */}
            {selectedForm === 'ast-agreement' && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-white text-sm">Full Assured Shorthold Tenancy Agreement (AST)</h3>
                  <p className="text-slate-400 text-xs">Complete residential tenancy contract under Housing Act 1988 with 5-week deposit cap compliance</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Landlord Full Name</label>
                    <input
                      type="text"
                      value={astLandlord}
                      onChange={(e) => setAstLandlord(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Tenant(s) Full Name(s)</label>
                    <input
                      type="text"
                      value={astTenant}
                      onChange={(e) => setAstTenant(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-300 font-semibold mb-1">Full Rental Property Address</label>
                  <input
                    type="text"
                    value={astProperty}
                    onChange={(e) => setAstProperty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                  />
                </div>

                <div className="grid sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Monthly Rent (£/mo)</label>
                    <input
                      type="number"
                      value={astRentPcm}
                      onChange={(e) => setAstRentPcm(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Deposit (£, max 5 wks)</label>
                    <input
                      type="number"
                      value={astDeposit}
                      onChange={(e) => setAstDeposit(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Tenancy Term (Months)</label>
                    <select
                      value={astTermMonths}
                      onChange={(e) => setAstTermMonths(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    >
                      <option value={6}>6 Months Fixed</option>
                      <option value={12}>12 Months Fixed</option>
                      <option value={24}>24 Months Fixed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Commencement Date</label>
                    <input
                      type="date"
                      value={astStartDate}
                      onChange={(e) => setAstStartDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  🛡️ <strong>Statutory Deposit Cap Check:</strong> For annual rents under £50,000, the maximum legal deposit under the Tenant Fees Act 2019 is 5 weeks' rent (£{((astRentPcm * 12 / 52) * 5).toFixed(2)}). Landlord must protect deposit in DPS/TDS/MyDeposits within 30 days.
                </div>

                <button
                  onClick={handleGenerateAST}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Complete Assured Shorthold Tenancy Agreement</span>
                </button>
              </div>
            )}

            {/* LODGER AGREEMENT */}
            {selectedForm === 'lodger-agreement' && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-white text-sm">Resident Landlord Lodger Agreement</h3>
                  <p className="text-slate-400 text-xs">Excluded Licence to Occupy under Protection from Eviction Act 1977 s.3A (No court order needed for eviction)</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Resident Landlord Name</label>
                    <input
                      type="text"
                      value={lodgerLandlord}
                      onChange={(e) => setLodgerLandlord(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Lodger Full Name</label>
                    <input
                      type="text"
                      value={lodgerName}
                      onChange={(e) => setLodgerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-300 font-semibold mb-1">Property Address</label>
                  <input
                    type="text"
                    value={lodgerAddress}
                    onChange={(e) => setLodgerAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Weekly Rent (£/week, bills included)</label>
                    <input
                      type="number"
                      value={lodgerRentWeekly}
                      onChange={(e) => setLodgerRentWeekly(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Notice Period to Terminate (Weeks)</label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={lodgerNoticeWeeks}
                      onChange={(e) => setLodgerNoticeWeeks(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerateLodger}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Resident Landlord Lodger Agreement</span>
                </button>
              </div>
            )}

            {/* FORM 6A */}
            {selectedForm === 'form-6a' && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-white text-sm">Form 6A: Section 21 Possession Notice</h3>
                  <p className="text-slate-400 text-xs">Official prescribed statutory form under the Deregulation Act 2015 for England</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Tenant Name(s)</label>
                    <input
                      type="text"
                      value={f6aTenant}
                      onChange={(e) => setF6aTenant(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Landlord / Agency Name</label>
                    <input
                      type="text"
                      value={f6aLandlord}
                      onChange={(e) => setF6aLandlord(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Property Address</label>
                    <input
                      type="text"
                      value={f6aAddress}
                      onChange={(e) => setF6aAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Date Requiring Possession (Min 2 Months)</label>
                    <input
                      type="date"
                      value={f6aExpiryDate}
                      onChange={(e) => setF6aExpiryDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerateForm6A}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Official Statutory Form 6A</span>
                </button>
              </div>
            )}

            {/* SURRENDER DEED */}
            {selectedForm === 'surrender-deed' && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-white text-sm">Deed of Tenancy Surrender</h3>
                  <p className="text-slate-400 text-xs">Legally binding mutual surrender agreement with deposit return and release of liability</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Tenant Name</label>
                    <input
                      type="text"
                      value={surrenderTenant}
                      onChange={(e) => setSurrenderTenant(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Landlord Name</label>
                    <input
                      type="text"
                      value={surrenderLandlord}
                      onChange={(e) => setSurrenderLandlord(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Property Address</label>
                    <input
                      type="text"
                      value={surrenderAddress}
                      onChange={(e) => setSurrenderAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Agreed Surrender Date</label>
                    <input
                      type="date"
                      value={surrenderDate}
                      onChange={(e) => setSurrenderDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Agreed Deposit Sum to Refund to Tenant (£)</label>
                  <input
                    type="number"
                    value={surrenderDepositReturn}
                    onChange={(e) => setSurrenderDepositReturn(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold"
                  />
                </div>

                <button
                  onClick={handleGenerateSurrenderDeed}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileSignature className="w-4 h-4" />
                  <span>Generate Formal Deed of Tenancy Surrender</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* CATEGORY 2: LOAN AGREEMENTS & PROMISSORY NOTES */}
        {/* ======================================================== */}
        {activeCategory === 'loans' && (
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <div>
              <h3 className="font-bold text-white text-sm">Promissory Note & Commercial / Personal Loan Agreement</h3>
              <p className="text-slate-400 text-xs">Court-admissible loan deed under English law with acceleration clause and default interest</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Lender Full Name / Entity</label>
                <input
                  type="text"
                  value={loanLender}
                  onChange={(e) => setLoanLender(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Borrower Full Name / Entity</label>
                <input
                  type="text"
                  value={loanBorrower}
                  onChange={(e) => setLoanBorrower(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Principal Loan Amount (£)</label>
                <input
                  type="number"
                  value={loanPrincipal}
                  onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Annual Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={loanInterestRate}
                  onChange={(e) => setLoanInterestRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Repayment Schedule</label>
                <select
                  value={loanRepaymentType}
                  onChange={(e) => setLoanRepaymentType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                >
                  <option value="monthly">Monthly Equal Instalments</option>
                  <option value="lump-sum">Lump Sum at Maturity</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Loan Term (Months)</label>
                <input
                  type="number"
                  value={loanTermMonths}
                  onChange={(e) => setLoanTermMonths(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Stated Purpose of Loan</label>
                <input
                  type="text"
                  value={loanPurpose}
                  onChange={(e) => setLoanPurpose(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              💡 <strong>Acceleration Clause Included:</strong> If the borrower misses any instalment by 14 days, the entire remaining loan balance immediately becomes due, protecting the lender from protracted recovery actions.
            </div>

            <button
              onClick={handleGenerateLoan}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              <span>Generate Legally Binding Loan Agreement & Promissory Note</span>
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* CATEGORY 3: BUY & SELL CONTRACTS */}
        {/* ======================================================== */}
        {activeCategory === 'buysell' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedForm('vehicle-sale')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  selectedForm === 'vehicle-sale' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                1. Used Motor Vehicle Sale Contract & Bill of Sale
              </button>
              <button
                onClick={() => setSelectedForm('goods-sale')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  selectedForm === 'goods-sale' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                2. Sale of Goods Agreement (Bill of Sale)
              </button>
              <button
                onClick={() => setSelectedForm('freelance-contract')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  selectedForm === 'freelance-contract' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                3. Freelance & Services Contractor Agreement
              </button>
            </div>

            {/* VEHICLE CONTRACT */}
            {selectedForm === 'vehicle-sale' && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-white text-sm">Used Motor Vehicle Sale Agreement & Receipt</h3>
                  <p className="text-slate-400 text-xs">Protects private sellers and buyers with title warranty, V5C acknowledgement, and "sold as seen" clauses</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Seller Name</label>
                    <input
                      type="text"
                      value={vehSeller}
                      onChange={(e) => setVehSeller(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Buyer Name</label>
                    <input
                      type="text"
                      value={vehBuyer}
                      onChange={(e) => setVehBuyer(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Vehicle Make & Model</label>
                    <input
                      type="text"
                      value={vehMakeModel}
                      onChange={(e) => setVehMakeModel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Registration (VRM)</label>
                    <input
                      type="text"
                      value={vehReg}
                      onChange={(e) => setVehReg(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">VIN / Chassis Number</label>
                    <input
                      type="text"
                      value={vehVin}
                      onChange={(e) => setVehVin(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Mileage</label>
                    <input
                      type="number"
                      value={vehMileage}
                      onChange={(e) => setVehMileage(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Agreed Price (£)</label>
                    <input
                      type="number"
                      value={vehPrice}
                      onChange={(e) => setVehPrice(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerateVehicleContract}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Car className="w-4 h-4" />
                  <span>Generate Private Vehicle Sale Agreement & Bill of Sale</span>
                </button>
              </div>
            )}

            {/* GOODS SALE CONTRACT */}
            {selectedForm === 'goods-sale' && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-white text-sm">Contract for Sale of Goods (Bill of Sale)</h3>
                  <p className="text-slate-400 text-xs">Sale of Goods Act 1979 commercial or consumer agreement with title transfer and inspection rights</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Seller Name / Business</label>
                    <input
                      type="text"
                      value={goodsSeller}
                      onChange={(e) => setGoodsSeller(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Buyer Name / Business</label>
                    <input
                      type="text"
                      value={goodsBuyer}
                      onChange={(e) => setGoodsBuyer(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Description of Goods / Equipment</label>
                    <input
                      type="text"
                      value={goodsDesc}
                      onChange={(e) => setGoodsDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Total Agreed Price (£)</label>
                    <input
                      type="number"
                      value={goodsPrice}
                      onChange={(e) => setGoodsPrice(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerateSaleOfGoods}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Generate Contract for Sale of Goods (Bill of Sale)</span>
                </button>
              </div>
            )}

            {/* FREELANCE CONTRACT */}
            {selectedForm === 'freelance-contract' && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-white text-sm">Independent Contractor & Services Agreement</h3>
                  <p className="text-slate-400 text-xs">Professional B2B services contract with Intellectual Property (IP) assignment and IR35 clarity</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Client Entity / Business Name</label>
                    <input
                      type="text"
                      value={contractClient}
                      onChange={(e) => setContractClient(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Contractor / Freelancer Name</label>
                    <input
                      type="text"
                      value={contractFreelancer}
                      onChange={(e) => setContractFreelancer(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Scope of Services & Deliverables</label>
                    <input
                      type="text"
                      value={contractServices}
                      onChange={(e) => setContractServices(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Total Agreed Fee (£)</label>
                    <input
                      type="number"
                      value={contractFee}
                      onChange={(e) => setContractFee(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerateFreelanceContract}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Generate Professional Services & IP Agreement</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* CATEGORY 4: HMCTS COURT FORMS */}
        {/* ======================================================== */}
        {activeCategory === 'court' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedForm('n1-claim')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  selectedForm === 'n1-claim' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                Form N1: County Court General Money Claim
              </button>
              <button
                onClick={() => setSelectedForm('n244-setaside')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  selectedForm === 'n244-setaside' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                Form N244: Application to Set Aside CCJ
              </button>
            </div>

            {selectedForm === 'n1-claim' ? (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-white text-sm">HMCTS Form N1: County Court Claim Form</h3>
                  <p className="text-slate-400 text-xs">Civil Procedure Rules (CPR) Part 7 official general claim form</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Claimant Name (You)</label>
                    <input
                      type="text"
                      value={n1Claimant}
                      onChange={(e) => setN1Claimant(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Claimant Address for Service</label>
                    <input
                      type="text"
                      value={n1ClaimantAddress}
                      onChange={(e) => setN1ClaimantAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Defendant Name (Debtor / Company)</label>
                    <input
                      type="text"
                      value={n1Defendant}
                      onChange={(e) => setN1Defendant(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Defendant Address</label>
                    <input
                      type="text"
                      value={n1DefendantAddress}
                      onChange={(e) => setN1DefendantAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Claim Principal Amount (£)</label>
                    <input
                      type="number"
                      value={n1Amount}
                      onChange={(e) => setN1Amount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Particulars & Cause of Action</label>
                    <input
                      type="text"
                      value={n1BriefDescription}
                      onChange={(e) => setN1BriefDescription(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerateN1}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Official HMCTS Form N1 Claim Form</span>
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-white text-sm">HMCTS Form N244: Application Notice (Set Aside CCJ)</h3>
                  <p className="text-slate-400 text-xs">Apply under CPR Rule 13.3 to cancel a default judgment entered in your absence</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">County Court Claim Number</label>
                    <input
                      type="text"
                      value={n244ClaimNo}
                      onChange={(e) => setN244ClaimNo(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Applicant Name (Defendant)</label>
                    <input
                      type="text"
                      value={n244Applicant}
                      onChange={(e) => setN244Applicant(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Grounds & Factual Reason for Set Aside</label>
                  <textarea
                    rows={3}
                    value={n244Reason}
                    onChange={(e) => setN244Reason(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                  />
                </div>

                <button
                  onClick={handleGenerateN244}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Official HMCTS Form N244 Application Notice</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* CATEGORY 5: BUSINESS & INSOLVENCY */}
        {/* ======================================================== */}
        {activeCategory === 'business' && (
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <div>
              <h3 className="font-bold text-white text-sm">Form 4.1: Statutory Demand for Unpaid Commercial Debt</h3>
              <p className="text-slate-400 text-xs">Insolvency Act 1986 s.123(1)(a) • Triggers compulsory winding-up petition after 21 days</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Creditor Company (You)</label>
                <input
                  type="text"
                  value={statCreditor}
                  onChange={(e) => setStatCreditor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Debtor Company</label>
                <input
                  type="text"
                  value={statDebtor}
                  onChange={(e) => setStatDebtor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Liquidated Debt Amount (£, min £750)</label>
                <input
                  type="number"
                  value={statDebtAmount}
                  onChange={(e) => setStatDebtAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Invoice / Reference Number</label>
                <input
                  type="text"
                  value={statInvoiceRef}
                  onChange={(e) => setStatInvoiceRef(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              ⚠️ <strong>Strict Legal Notice:</strong> Serving a statutory demand carries severe consequences. If the debt is subject to a genuine substantial dispute, the debtor can apply to restrain the winding-up petition with costs against you.
            </div>

            <button
              onClick={handleGenerateStatDemand}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>Generate Official Statutory Demand (Form 4.1)</span>
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* CATEGORY 6: LEGAL DEEDS */}
        {/* ======================================================== */}
        {activeCategory === 'deeds' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedForm('power-of-attorney')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  selectedForm === 'power-of-attorney' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                General Power of Attorney (Powers of Attorney Act 1971)
              </button>
              <button
                onClick={() => setSelectedForm('deed-poll')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  selectedForm === 'deed-poll' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                Adult Deed Poll (Change of Legal Name)
              </button>
            </div>

            {selectedForm === 'power-of-attorney' ? (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-white text-sm">General Power of Attorney</h3>
                  <p className="text-slate-400 text-xs">Section 10 Powers of Attorney Act 1971 • Appoints an attorney to manage financial and property affairs</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Donor Name (Granting the power)</label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Donor Address</label>
                    <input
                      type="text"
                      value={donorAddress}
                      onChange={(e) => setDonorAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Attorney Name (Person appointed)</label>
                    <input
                      type="text"
                      value={attorneyName}
                      onChange={(e) => setAttorneyName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Attorney Address</label>
                    <input
                      type="text"
                      value={attorneyAddress}
                      onChange={(e) => setAttorneyAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerateGPA}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileSignature className="w-4 h-4" />
                  <span>Generate General Power of Attorney Deed</span>
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-white text-sm">Adult Deed Poll (Change of Legal Name Deed)</h3>
                  <p className="text-slate-400 text-xs">Legally recognized deed for changing your name across HM Passport Office, DVLA, banks, and HMRC</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Current / Former Full Legal Name</label>
                    <input
                      type="text"
                      value={oldName}
                      onChange={(e) => setOldName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">New Assumed Full Legal Name</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Full Address</label>
                  <input
                    type="text"
                    value={deedAddress}
                    onChange={(e) => setDeedAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
                  />
                </div>

                <button
                  onClick={handleGenerateDeedPoll}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileSignature className="w-4 h-4" />
                  <span>Generate Official Adult Deed Poll Document</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
