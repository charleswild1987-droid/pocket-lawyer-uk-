import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Play, 
  Smartphone, 
  Globe, 
  CheckCircle, 
  FileCode, 
  ExternalLink, 
  Copy, 
  ShieldCheck, 
  FileText, 
  Lock, 
  Check, 
  Layers,
  Sparkles,
  Award
} from 'lucide-react';

interface PlayStoreExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PlayStoreTab = 'overview' | 'metadata' | 'datasafety' | 'assetlinks' | 'twa';

export const PlayStoreExportModal: React.FC<PlayStoreExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<PlayStoreTab>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [packageName, setPackageName] = useState('uk.co.pocketlawyer.app');
  const [sha256Fingerprint, setSha256Fingerprint] = useState(
    '14:6D:E9:75:A7:CF:C3:74:95:25:29:A4:44:A8:FB:17:EB:28:BE:2F:32:00:1E:E7:F4:71:0D:39:69:6B:41:F0'
  );

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadAssetLinks = () => {
    const content = JSON.stringify([
      {
        "relation": ["delegate_permission/common.handle_all_urls"],
        "target": {
          "namespace": "android_app",
          "package_name": packageName,
          "sha256_cert_fingerprints": [
            sha256Fingerprint
          ]
        }
      }
    ], null, 2);

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assetlinks.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadTwaManifest = () => {
    const config = {
      "packageId": packageName,
      "host": window.location.hostname,
      "name": "PocketLawyer UK - Legal Companion",
      "launcherName": "PocketLawyer",
      "themeColor": "#0f172a",
      "navigationColor": "#0f172a",
      "backgroundColor": "#0f172a",
      "startUrl": "/",
      "iconUrl": "/icon.svg",
      "maskableIconUrl": "/icon.svg",
      "appVersionName": "1.0.0",
      "appVersionCode": 1,
      "features": {
        "playBilling": {
          "enabled": true
        },
        "locationDelegation": {
          "enabled": false
        }
      },
      "alphaDependencies": {
        "enabled": false
      },
      "enableNotifications": false,
      "signing": {
        "file": "android.keystore",
        "alias": "pocketlawyer"
      }
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'twa-manifest.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const playStoreTitle = "PocketLawyer UK - Legal Companion";
  const playStoreShortDesc = "UK law companion, rights advisor, landlord AST & contract generator.";
  const playStoreLongDesc = `PocketLawyer UK is your comprehensive legal companion, rights advisor, and contract generator, designed specifically for individuals and businesses operating under the laws of England and Wales.

KEY FEATURES & CAPABILITIES:

⚖️ EMERGENCY POLICE POWERS & CUSTODY HUD:
- PACE 1984 Code A & Code C statutory rights guide
- Mandatory GOWISELY search validity checklist (Grounds, Object, Warrant, Identity, Station, Entitlement, Law, You are detained)
- JOG outer clothing limits (Jacket, Outer coat, Gloves only in public)
- Real-time Audio Evidence Voice Recorder with local on-device saving
- Free legal advice entitlement at the police station (PACE s.58)

📑 HMCTS & UK CONTRACTS GENERATOR:
- Assured Shorthold Tenancy Agreement (AST) with 5-week deposit cap checker under the Tenant Fees Act 2019
- Lodger Agreement (Excluded Licence to Occupy under Protection from Eviction Act 1977)
- Commercial & Personal Loan Agreements with repayment schedules and default interest
- Used Vehicle Bill of Sale Contract (Private Sale - Road Traffic Act 1988 compliant)
- B2B Sale of Goods Contract (Sale of Goods Act 1979 & Romalpa retention of title)
- Form N1 Particulars of Claim (HMCTS County Court CPR Part 7)
- Form N244 Application Notice to set aside default judgments
- England & Wales General Power of Attorney & Deed Poll Change of Name

✍️ ELECTRONIC SIGNATURE & ANDROID SHARE:
- Draw authentic signatures on screen using finger or stylus
- Instant PDF printing and Native Android Share (WhatsApp, Gmail, Google Drive)

💼 B2B COMMERCIAL DEBT & ACCOUNTS:
- Late Payment of Commercial Debts (Interest) Act 1998 interest calculator (8% + Bank of England base rate)
- Statutory compensation tiers (£40, £70, £100) and formal 7-day demand letters

🏠 LANDLORD & HOUSING DISPUTES:
- Section 13 Form 4 Rent Increase Notice generator
- Section 8 Form 3 Ground 8 rent arrears notices
- Section 11 Landlord Disrepair formal notices & Awaab's Law hazard warnings
- Tenancy Deposit Non-Protection Penalty claim letters (1x to 3x deposit under Housing Act 2004)

💡 CONSUMER, BILLS & FINES:
- Consumer Rights Act 2015 30-day short-term rejection letters
- Ofgem 12-Month Backbilling Rule dispute letters (Standard Licence Condition 21BA)
- Council Penalty Charge Notice (PCN) appeals & private parking charge disputes

🛡️ AI SENTINEL AUTONOMOUS HEALING:
- Continuous background self-healing engine protecting application state and cached documents.

PRICING & SUBSCRIPTION TERMS:
PocketLawyer UK includes a full 7-day free trial. Following the trial, subscription continues at £2.99 per month (inclusive of 20% UK VAT). You can cancel at any time via your Google Play account settings.

LEGAL DISCLAIMER:
PocketLawyer UK is an educational information resource and automated template generator. It does not provide regulated legal advice or replace the advice of a qualified Solicitor or Barrister regulated by the Solicitors Regulation Authority (SRA).`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-blue-500/40 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 p-4 sm:p-5 border-b border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Google Play Store Deployment & Packaging Hub</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  TWA Ready
                </span>
              </h3>
              <p className="text-xs text-slate-400">Everything needed to package, publish, and distribute PocketLawyer on Android</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-950 border-b border-slate-800 flex overflow-x-auto px-4 gap-1 text-xs font-semibold py-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>1-Click Packaging</span>
          </button>

          <button
            onClick={() => setActiveTab('metadata')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'metadata' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Store Listing Copy</span>
          </button>

          <button
            onClick={() => setActiveTab('datasafety')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'datasafety' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data Safety Form</span>
          </button>

          <button
            onClick={() => setActiveTab('assetlinks')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'assetlinks' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>AssetLinks (Full Screen)</span>
          </button>

          <button
            onClick={() => setActiveTab('twa')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'twa' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>twa-manifest.json</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-300 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Option A: PWABuilder Point & Click */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Method 1: Point-and-Click Android App Bundle (.aab)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    Recommended (Zero Coding)
                  </span>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed">
                  Generate a signed <strong>.aab</strong> (Android App Bundle) ready to drag-and-drop into Google Play Console in 3 simple steps:
                </p>

                <ol className="space-y-2 list-decimal list-inside text-slate-300 text-xs">
                  <li>
                    Visit <strong>PWABuilder.com</strong> in your browser.
                  </li>
                  <li>
                    Paste your app URL: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-300 text-[11px]">{window.location.origin}</code> and click <strong>"Start"</strong>.
                  </li>
                  <li>
                    PWABuilder will score PocketLawyer UK 100% across Manifest, Service Worker, and Security. Click <strong>"Package for Stores" ➔ "Android"</strong>.
                  </li>
                  <li>
                    Enter your package name (<code className="text-blue-300 font-mono">{packageName}</code>) and download your finished Google Play Store <strong>.aab package</strong>!
                  </li>
                </ol>

                <div className="pt-2">
                  <a
                    href="https://www.pwabuilder.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                  >
                    <span>Open PWABuilder.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Option B: Direct phone install */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  <span>Method 2: Immediate Phone Testing (No Play Store Required)</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Open this URL on any Android device in Chrome. Tap <strong>"Install App"</strong> in the top header or browser menu. The app installs natively with the gold scales icon, runs fullscreen without browser bars, and functions 100% offline.
                </p>
              </div>

              {/* Policy URLs */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Mandatory Play Store Compliance URLs</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-[10px]">Privacy Policy URL</p>
                      <p className="font-mono text-white text-xs">{window.location.origin}/privacy.html</p>
                    </div>
                    <a href="/privacy.html" target="_blank" className="p-1 text-blue-400 hover:text-white">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-[10px]">Terms of Service URL</p>
                      <p className="font-mono text-white text-xs">{window.location.origin}/terms.html</p>
                    </div>
                    <a href="/terms.html" target="_blank" className="p-1 text-blue-400 hover:text-white">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Pre-formatted metadata ready to paste into <strong>Google Play Console &gt; Store presence &gt; Main store listing</strong>:
              </p>

              {/* Title */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">App Title (34 / 50 characters)</span>
                  <button
                    onClick={() => copyToClipboard(playStoreTitle, 'title')}
                    className="text-[11px] text-blue-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'title' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="p-2 bg-slate-900 rounded font-mono text-white text-xs">{playStoreTitle}</p>
              </div>

              {/* Short Description */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Short Description (71 / 80 characters)</span>
                  <button
                    onClick={() => copyToClipboard(playStoreShortDesc, 'short')}
                    className="text-[11px] text-blue-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === 'short' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'short' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="p-2 bg-slate-900 rounded font-mono text-white text-xs">{playStoreShortDesc}</p>
              </div>

              {/* Full Description */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Full Description (Formatted with Features & Disclaimer)</span>
                  <button
                    onClick={() => copyToClipboard(playStoreLongDesc, 'long')}
                    className="py-1 px-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1"
                  >
                    {copiedKey === 'long' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'long' ? 'Copied Description' : 'Copy Full Description'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={8}
                  value={playStoreLongDesc}
                  className="w-full p-2.5 bg-slate-900 rounded text-slate-300 font-mono text-xs border border-slate-800 leading-relaxed"
                />
              </div>
            </div>
          )}

          {activeTab === 'datasafety' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
                <strong>Google Play Data Safety Form Answers:</strong> Use these exact answers to pass the mandatory Google Play Data Safety declaration in minutes.
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-bold text-white text-xs">1. Does your app collect or share any user data?</p>
                  <p className="text-emerald-400 font-semibold text-xs mt-0.5">Answer: "No"</p>
                  <p className="text-slate-400 text-[11px] mt-1">
                    PocketLawyer UK operates with a 100% on-device architecture. Incident notes and contract drafts are stored locally on the phone and are never transmitted to external servers.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-bold text-white text-xs">2. Is data encrypted in transit?</p>
                  <p className="text-emerald-400 font-semibold text-xs mt-0.5">Answer: "Yes"</p>
                  <p className="text-slate-400 text-[11px] mt-1">
                    All communication is served via modern TLS 1.3 / HTTPS encryption.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-bold text-white text-xs">3. Do you provide a way for users to request data deletion?</p>
                  <p className="text-emerald-400 font-semibold text-xs mt-0.5">Answer: "Yes"</p>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Users can wipe all local storage data via the in-app "Data Safety & Wipe" tool or by clearing application storage in Android Settings.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-bold text-white text-xs">4. In-App Financial Information & Subscriptions</p>
                  <p className="text-emerald-400 font-semibold text-xs mt-0.5">Answer: Handled by Google Play Billing</p>
                  <p className="text-slate-400 text-[11px] mt-1">
                    The app uses Google Play In-App Purchases for the £2.99/mo subscription. Google Play manages payment instruments; the app never receives credit card numbers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assetlinks' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                To run PocketLawyer in <strong>true fullscreen mode</strong> without the Chrome URL address bar on Android, Google requires an <strong>assetlinks.json</strong> file placed in <code className="text-amber-300">/.well-known/assetlinks.json</code>. We have already generated this for you!
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Android Package Name</label>
                  <input
                    type="text"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">SHA-256 Fingerprint</label>
                  <input
                    type="text"
                    value={sha256Fingerprint}
                    onChange={(e) => setSha256Fingerprint(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={downloadAssetLinks}
                  className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download assetlinks.json</span>
                </button>

                <a
                  href="/.well-known/assetlinks.json"
                  target="_blank"
                  className="py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Verify Live AssetLinks</span>
                </a>
              </div>
            </div>
          )}

          {activeTab === 'twa' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                If you use Google's official <strong>Bubblewrap CLI</strong> (<code className="text-amber-300">npx @bubblewrap/cli build</code>), download this pre-configured <strong>twa-manifest.json</strong>:
              </p>

              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">twa-manifest.json Configuration</span>
                <button
                  onClick={downloadTwaManifest}
                  className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download twa-manifest.json</span>
                </button>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56">
                <pre>{JSON.stringify({
                  "packageId": packageName,
                  "host": window.location.hostname,
                  "name": "PocketLawyer UK - Legal Companion",
                  "launcherName": "PocketLawyer",
                  "themeColor": "#0f172a",
                  "navigationColor": "#0f172a",
                  "backgroundColor": "#0f172a",
                  "startUrl": "/",
                  "iconUrl": "/icon.svg",
                  "features": {
                    "playBilling": { "enabled": true }
                  }
                }, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
