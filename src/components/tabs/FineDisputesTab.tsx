import React, { useState } from 'react';
import { Car, Plane, Train, AlertCircle, FileText, CheckCircle, Calculator, ShieldCheck } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';

interface FineDisputesTabProps {
  onOpenDocument: (title: string, subtitle: string, content: string) => void;
}

export const FineDisputesTab: React.FC<FineDisputesTabProps> = ({ onOpenDocument }) => {
  const { checkAccess } = useSubscription();

  const [activeSubTab, setActiveSubTab] = useState<'councilpcn' | 'privateparking' | 'flight' | 'railway'>('councilpcn');

  // Council PCN state
  const [councilName, setCouncilName] = useState('Westminster City Council');
  const [pcnNumber, setPcnNumber] = useState('WM84920412');
  const [vehicleReg, setVehicleReg] = useState('AB21 XYZ');
  const [driverName, setDriverName] = useState('David Miller');
  const [councilGround, setCouncilGround] = useState<'signage' | 'loading' | 'medical' | 'sold'>('signage');

  // Private parking state
  const [operatorName, setOperatorName] = useState('ParkingEye Ltd');
  const [parkingRef, setParkingRef] = useState('PE-9482910');
  const [carParkLocation, setCarParkLocation] = useState('Retail Park, Watford');

  // Flight delay state
  const [airlineName, setAirlineName] = useState('British Airways');
  const [flightNumber, setFlightNumber] = useState('BA1482');
  const [flightDate, setFlightDate] = useState('2024-07-15');
  const [delayHours, setDelayHours] = useState(4);
  const [flightDistanceKm, setFlightDistanceKm] = useState(2400); // 1500 - 3500km -> £350
  const [passengerCount, setPassengerCount] = useState(2);

  // Flight calculation
  let compPerPerson = 220;
  if (flightDistanceKm > 3500) {
    compPerPerson = delayHours < 4 ? 260 : 520;
  } else if (flightDistanceKm >= 1500) {
    compPerPerson = 350;
  }
  const totalFlightComp = compPerPerson * passengerCount;

  // Railway state
  const [tocName, setTocName] = useState('Govia Thameslink Railway (GTR)');
  const [railwayCaseRef, setRailwayCaseRef] = useState('GTR-REV-849102');
  const [fareOwed, setFareOwed] = useState(14.50);
  const [adminOffer, setAdminOffer] = useState(50.00);

  const handleGenerateCouncilPCN = () => {
    if (!checkAccess('Council PCN Appeal Generator')) return;

    let groundsDetails = '';
    if (councilGround === 'signage') {
      groundsDetails = `Ground: The contravention did not occur due to defective, obscured, or non-compliant signage under the Traffic Signs Regulations and General Directions (TSRGD 2016). The restriction was not adequately conveyed to the motorist as required by Regulation 18 of the Local Authorities' Traffic Orders Regulations 1996.`;
    } else if (councilGround === 'loading') {
      groundsDetails = `Ground: The vehicle was actively engaged in permitted commercial loading / unloading operations during the observation period, which constitutes a recognised exemption under the relevant Traffic Management Order.`;
    } else if (councilGround === 'medical') {
      groundsDetails = `Ground: Compelling mitigating circumstances involving an urgent medical necessity, during which the vehicle was stopped temporarily. Discretion should be exercised to cancel the penalty in accordance with the Secretary of State's Statutory Guidance.`;
    } else {
      groundsDetails = `Ground: I was not the owner/keeper of the vehicle on the date of the alleged contravention, having sold/transferred the vehicle prior to this date (DVLA confirmation available).`;
    }

    const doc = `FORMAL REPRESENTATIONS AGAINST PENALTY CHARGE NOTICE
PURSUANT TO THE TRAFFIC MANAGEMENT ACT 2004 & THE CIVIL ENFORCEMENT OF PARKING CONTRAVENTIONS REGULATIONS

Date: ${new Date().toLocaleDateString('en-GB')}

To: Parking Services / Appeals Department
${councilName}

PCN Number: ${pcnNumber}
Vehicle Registration Mark: ${vehicleReg}
Registered Keeper: ${driverName}

FORMAL REPRESENTATION: NOTICE OF CHALLENGE

Dear Appeals Officer,

I write as the registered keeper of vehicle ${vehicleReg} to formally challenge Penalty Charge Notice ${pcnNumber}.

STATUTORY GROUNDS OF CHALLENGE:
${groundsDetails}

EVIDENCE & LEGAL PRECEDENT:
Under established London Tribunals / Traffic Penalty Tribunal authorities, the burden of proving that a contravention occurred with fully compliant, unambiguous signage and observation rests entirely upon the enforcement authority.

REMEDY REQUESTED:
In light of the statutory defects and mitigating evidence detailed above, I respectfully request that this Penalty Charge Notice be cancelled forthwith.

Should you reject these representations, please supply:
1. Copies of all Civil Enforcement Officer (CEO) contemporaneous notes and photographic logs;
2. The relevant Traffic Management Order (TMO) and schedule;
3. Official Notice of Rejection accompanied by the statutory appeal forms for the independent Traffic Penalty Tribunal.

Yours sincerely,

___________________________
${driverName}`;

    onOpenDocument('Council PCN Formal Representation', 'Traffic Management Act 2004 Challenge', doc);
  };

  const handleGeneratePrivateParking = () => {
    if (!checkAccess('Private Parking Appeal Generator')) return;

    const doc = `FORMAL APPEAL AGAINST UNLAWFUL PARKING CHARGE NOTICE (PCN)
PURSUANT TO THE PROTECTION OF FREEDOMS ACT 2012 (PoFA 2012) SCHEDULE 4 & BPA/IPC CODE OF PRACTICE

Date: ${new Date().toLocaleDateString('en-GB')}

To: Appeals Department
${operatorName}

Parking Charge Reference: ${parkingRef}
Vehicle Registration Mark: ${vehicleReg}
Location: ${carParkLocation}

FORMAL WRITTEN APPEAL BY REGISTERED KEEPER

Dear Sirs,

I am writing as the registered keeper of vehicle ${vehicleReg} regarding Parking Charge Notice ${parkingRef}. I dispute this speculative invoice in its entirety on the following statutory grounds:

1. BREACH OF POFA 2012 SCHEDULE 4 (NO KEEPER LIABILITY):
You have failed to satisfy the strict statutory conditions precedent under Schedule 4 of the Protection of Freedoms Act 2012 to transfer liability from the driver to the registered keeper. I am under no legal obligation to identify the driver, and I decline to do so.

2. BREACH OF MANDATORY GRACE PERIOD:
Under the British Parking Association (BPA) and International Parking Community (IPC) Approved Codes of Practice, operators are mandated to allow a minimum 10-minute grace period upon entry and exit before issuing an invoice. Any calculation ignoring this mandatory grace period is unlawful and predatory.

3. LACK OF PROPRIETARY AUTHORITY:
You are put to strict proof that you hold sufficient proprietary interest or contemporaneous landowner contract authority entitling you to pursue court proceedings in your own name (*ParkingEye v Beavis [2015] UKSC 67* distinguished).

DEMAND:
I require you to immediately cancel this parking charge. If you refuse, you must provide a valid 10-digit verification code for the independent appeals service (POPLA / IAS) so this matter may be determined by an independent adjudicator.

Yours faithfully,

___________________________
Registered Keeper
(Address on file)`;

    onOpenDocument('Private Parking Charge Notice Appeal', 'PoFA 2012 Schedule 4 / POPLA Appeal', doc);
  };

  const handleGenerateFlightClaim = () => {
    if (!checkAccess('UK261 Flight Delay Claim Generator')) return;

    const doc = `STATUTORY LETTER OF CLAIM: UK261 / EU261 FLIGHT DELAY COMPENSATION
PURSUANT TO THE AIR PASSENGER RIGHTS AND AIR TRAVEL ORGANISERS' LICENSING REGULATIONS 2019

Date: ${new Date().toLocaleDateString('en-GB')}

To: Legal & Customer Relations Department
${airlineName}

Flight Number: ${flightNumber}
Date of Travel: ${flightDate}
Passenger(s): ${driverName} (+ ${passengerCount - 1} companions)
Total Passengers Claiming: ${passengerCount}

FORMAL STATUTORY CLAIM FOR £${totalFlightComp.toFixed(2)} COMPENSATION

Dear Legal Department,

I am writing to make a formal statutory claim under retained Regulation (EC) No 261/2004 (as incorporated into UK law) regarding flight ${flightNumber} scheduled on ${flightDate}.

STATUTORY ENTITLEMENT:
1. The flight arrived at its final destination with a delay of ${delayHours} hours.
2. The great-circle flight distance was calculated at approximately ${flightDistanceKm} km.
3. Under UK261 statutory rules, delays exceeding 3 hours for flights in this distance band entitle each passenger to statutory fixed compensation of £${compPerPerson.toFixed(2)}.

SUMMARY OF CLAIM:
- Statutory Compensation per Passenger: £${compPerPerson.toFixed(2)}
- Number of Eligible Passengers: ${passengerCount}
--------------------------------------------------------------------------------
TOTAL STATUTORY SUM DUE: £${totalFlightComp.toFixed(2)}

Under the Supreme Court authority of *Huzar v Jet2.com* and *Lipton v BA Cityflyer*, technical faults, staff shortages, and standard operational delays do NOT constitute "extraordinary circumstances".

Please remit the sum of £${totalFlightComp.toFixed(2)} to my nominated bank account within fourteen (14) days. Failing payment, I will issue proceedings via Money Claim Online (County Court) without further notice.

Yours faithfully,

___________________________
${driverName}`;

    onOpenDocument('UK261 Flight Delay Compensation Claim', 'Air Passenger Rights Regulations 2019', doc);
  };

  const handleGenerateRailway = () => {
    if (!checkAccess('Railway Byelaw 18 Settlement Offer')) return;

    const totalSettlement = fareOwed + adminOffer;

    const doc = `CONFIDENTIAL & WITHOUT PREJUDICE (SAVE AS TO COSTS)
PROPOSAL FOR OUT-OF-COURT ADMINISTRATIVE SETTLEMENT
IN RESPECT OF ALLEGED CONTRAVENTION OF RAILWAY BYELAW 18 / SJP NOTICE

Date: ${new Date().toLocaleDateString('en-GB')}

To: Prosecutions & Revenue Protection Department
${tocName}

Case Reference: ${railwayCaseRef}
Passenger Name: ${driverName}

RE: FORMAL PROPOSAL TO SETTLE MATTERS ADMINISTRATIVELY WITHOUT COURT PROCEEDINGS

Dear Prosecutions Team,

I write regarding the incident report and correspondence received under reference ${railwayCaseRef}.

STATEMENT OF CIRCUMSTANCES:
I acknowledge that I traveled without holding a validated ticket for the journey in question. This occurred due to confusion / ticketing machine difficulties rather than any dishonest intention to evade payment under Section 5(3) of the Regulation of Railways Act 1889.

I deeply regret this oversight and sincerely apologize for the inconvenience and administrative burden caused to your staff.

SETTLEMENT PROPOSAL:
To prevent the expenditure of court time and disproportionate criminal prosecution costs, I respectfully propose to discharge all potential liability by remitting an administrative settlement consisting of:
1. Full fare due: £${fareOwed.toFixed(2)}
2. Contribution to administrative investigation costs: £${adminOffer.toFixed(2)}
--------------------------------------------------------------------------------
TOTAL SETTLEMENT OFFER: £${totalSettlement.toFixed(2)}

I am prepared to make this payment immediately upon receipt of your confirmation and payment reference details.

In accordance with the Code for Crown Prosecutors (Public Interest Test), proceeding with a criminal prosecution where a repentant passenger offers full compensation is neither proportionate nor in the public interest.

Yours sincerely,

___________________________
${driverName}`;

    onOpenDocument('Railway Byelaw 18 Settlement Proposal', 'Out-of-Court Settlement to Avoid Criminal Record', doc);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border border-red-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Fine & Travel Disputes Suite</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold border border-red-400/30 uppercase">
                TMA 2004 • PoFA 2012 • UK261
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Challenge council PCNs, appeal private parking tickets (PoFA 2012), calculate UK261 flight delays, and settle train fare notices.
            </p>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-semibold overflow-x-auto gap-2">
        <button
          onClick={() => setActiveSubTab('councilpcn')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'councilpcn' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Car className="w-3.5 h-3.5 text-blue-400" />
          Council PCN Appeal
        </button>

        <button
          onClick={() => setActiveSubTab('privateparking')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'privateparking' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          Private Parking Ticket (PoFA 2012)
        </button>

        <button
          onClick={() => setActiveSubTab('flight')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'flight' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Plane className="w-3.5 h-3.5 text-emerald-400" />
          UK261 Flight Delay (£220-£520)
        </button>

        <button
          onClick={() => setActiveSubTab('railway')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'railway' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Train className="w-3.5 h-3.5 text-red-400" />
          Train Fare Byelaw 18 Settlement
        </button>
      </div>

      {/* COUNCIL PCN FORM */}
      {activeSubTab === 'councilpcn' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="font-bold text-white text-sm">Council Penalty Charge Notice (PCN) Appeal Generator</h3>
            <p className="text-xs text-slate-400">Formal representation under Traffic Management Act 2004 for parking, bus lane, or clean air zones</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Local Council Authority</label>
              <input
                type="text"
                value={councilName}
                onChange={(e) => setCouncilName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">PCN Number</label>
              <input
                type="text"
                value={pcnNumber}
                onChange={(e) => setPcnNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Vehicle Registration Mark</label>
              <input
                type="text"
                value={vehicleReg}
                onChange={(e) => setVehicleReg(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Registered Keeper Name</label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-semibold mb-1">Grounds of Appeal</label>
            <select
              value={councilGround}
              onChange={(e) => setCouncilGround(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            >
              <option value="signage">Defective / Obscured / Contradictory Signage (TSRGD 2016)</option>
              <option value="loading">Permitted Commercial Loading / Unloading in Progress</option>
              <option value="medical">Medical Emergency / Urgent Breakdown Assistance</option>
              <option value="sold">Vehicle Sold / Transferred Prior to Contravention Date</option>
            </select>
          </div>

          <button
            onClick={handleGenerateCouncilPCN}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Formal Council PCN Representation</span>
          </button>
        </div>
      )}

      {/* PRIVATE PARKING FORM */}
      {activeSubTab === 'privateparking' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="font-bold text-white text-sm">Private Parking Ticket Appeal (PoFA 2012 / POPLA)</h3>
            <p className="text-xs text-slate-400">Challenge private parking charge notices (ParkingEye, Euro Car Parks, etc.) on statutory grounds</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Parking Operator Name</label>
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Parking Charge Reference</label>
              <input
                type="text"
                value={parkingRef}
                onChange={(e) => setParkingRef(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-semibold mb-1">Car Park Location</label>
            <input
              type="text"
              value={carParkLocation}
              onChange={(e) => setCarParkLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            🛡️ <strong>Keeper Defense Strategy:</strong> Never reveal who was driving. Under PoFA 2012 Schedule 4, operators must comply strictly with statutory Notice to Keeper timescales. If they fail, keeper liability does not attach.
          </div>

          <button
            onClick={handleGeneratePrivateParking}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate PoFA 2012 Schedule 4 Appeal Letter</span>
          </button>
        </div>
      )}

      {/* FLIGHT DELAY FORM */}
      {activeSubTab === 'flight' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">UK261 Flight Delay Compensation Calculator & Claim</h3>
              <p className="text-xs text-slate-400">Statutory compensation under retained Regulation (EC) No 261/2004</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Statutory Payout</span>
              <div className="text-xl font-black text-emerald-400">£{totalFlightComp.toFixed(2)}</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Airline Name</label>
              <input
                type="text"
                value={airlineName}
                onChange={(e) => setAirlineName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Flight Number</label>
              <input
                type="text"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Travel Date</label>
              <input
                type="date"
                value={flightDate}
                onChange={(e) => setFlightDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Delay at Destination (Hours)</label>
              <input
                type="number"
                min={3}
                value={delayHours}
                onChange={(e) => setDelayHours(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Flight Distance (km)</label>
              <input
                type="number"
                value={flightDistanceKm}
                onChange={(e) => setFlightDistanceKm(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Eligible Passengers</label>
              <input
                type="number"
                min={1}
                value={passengerCount}
                onChange={(e) => setPassengerCount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateFlightClaim}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plane className="w-4 h-4" />
            <span>Generate Statutory UK261 Letter of Claim (£{totalFlightComp.toFixed(2)})</span>
          </button>
        </div>
      )}

      {/* RAILWAY FORM */}
      {activeSubTab === 'railway' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="font-bold text-white text-sm">Train Fare & Railway Byelaw 18 Settlement Proposal</h3>
            <p className="text-xs text-slate-400">Offer an out-of-court administrative settlement to avoid criminal court prosecution and Single Justice Procedure</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Train Operating Company (TOC)</label>
              <input
                type="text"
                value={tocName}
                onChange={(e) => setTocName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Case / Revenue Notice Reference</label>
              <input
                type="text"
                value={railwayCaseRef}
                onChange={(e) => setRailwayCaseRef(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Unpaid Fare Amount (£)</label>
              <input
                type="number"
                step="0.01"
                value={fareOwed}
                onChange={(e) => setFareOwed(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Proposed Admin Fee Offer (£)</label>
              <input
                type="number"
                value={adminOffer}
                onChange={(e) => setAdminOffer(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateRailway}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Train className="w-4 h-4" />
            <span>Generate Without-Prejudice Administrative Settlement Letter</span>
          </button>
        </div>
      )}
    </div>
  );
};
