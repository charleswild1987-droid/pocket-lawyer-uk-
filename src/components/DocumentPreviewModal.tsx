import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Printer, 
  CheckCircle, 
  FileText, 
  Download, 
  Share2, 
  PenTool, 
  Check, 
  Star,
  ShieldCheck,
  Smartphone,
  Database
} from 'lucide-react';
import { DigitalSignaturePad } from './DigitalSignaturePad';
import { storageVault } from '../services/storageVault';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  content: string;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  content,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signatureInfo, setSignatureInfo] = useState<{
    dataUrl: string;
    name: string;
    role: string;
    date: string;
  } | null>(null);

  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [isVaultSaved, setIsVaultSaved] = useState(true);

  // Auto-save document into local storageVault on open
  useEffect(() => {
    if (isOpen && title && content) {
      const lower = title.toLowerCase();
      const cat = lower.includes('hmrc') || lower.includes('sa105') ? 'hmrc'
        : lower.includes('building') || lower.includes('contractor') ? 'building'
        : lower.includes('tenancy') || lower.includes('ast') || lower.includes('landlord') ? 'landlord'
        : lower.includes('notice') ? 'notices'
        : lower.includes('dispute') || lower.includes('fine') || lower.includes('pcn') ? 'disputes'
        : 'contracts';

      storageVault.saveDocument({
        title,
        subtitle,
        category: cat as any,
        content,
        isSigned: Boolean(signatureInfo),
        signatureInfo: signatureInfo ? {
          name: signatureInfo.name,
          role: signatureInfo.role,
          date: signatureInfo.date,
          dataUrl: signatureInfo.dataUrl
        } : undefined
      }).then(() => setIsVaultSaved(true));
    }
  }, [isOpen, title, content, signatureInfo]);

  if (!isOpen) return null;

  const handleCopy = () => {
    let finalContent = content;
    if (signatureInfo) {
      finalContent += `\n\n======================================================
ELECTRONIC SIGNATURE & EXECUTION CERTIFICATE
Signatory: ${signatureInfo.name}
Role/Capacity: ${signatureInfo.role}
Date Executed: ${signatureInfo.date}
Legal Standard: Electronic Communications Act 2000 & UK eIDAS Regulations
Status: Digitally Signed & Sealed via PocketLawyer UK
======================================================`;
    }

    navigator.clipboard.writeText(finalContent);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowReviewPrompt(true);
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    let finalContent = content;
    if (signatureInfo) {
      finalContent += `\n\n======================================================
ELECTRONIC SIGNATURE & EXECUTION CERTIFICATE
Signatory: ${signatureInfo.name}
Role/Capacity: ${signatureInfo.role}
Date Executed: ${signatureInfo.date}
Legal Standard: Electronic Communications Act 2000 & UK eIDAS Regulations
Status: Digitally Signed & Sealed via PocketLawyer UK
======================================================`;
    }

    const blob = new Blob([finalContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setShowReviewPrompt(true), 2000);
  };

  const handleNativeShare = async () => {
    let finalContent = content;
    if (signatureInfo) {
      finalContent += `\n\n[Digitally signed by ${signatureInfo.name} (${signatureInfo.role}) on ${signatureInfo.date} via PocketLawyer UK]`;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: `PocketLawyer UK - ${title}`,
          text: finalContent,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        setShowReviewPrompt(true);
      } catch (err) {
        // User cancelled share or failed
      }
    } else {
      // Fallback
      handleCopy();
    }
  };

  const handleApplySignature = (dataUrl: string, name: string, role: string, date: string) => {
    setSignatureInfo({
      dataUrl,
      name,
      role,
      date,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh]">
          {/* Header (hidden in print) */}
          <div className="no-print bg-slate-950 p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white">{title}</h3>
                  {isVaultSaved && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <Database className="w-2.5 h-2.5" />
                      <span>Vault Saved</span>
                    </span>
                  )}
                </div>
                {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {/* Electronic Signature Button */}
              <button
                onClick={() => setIsSignatureModalOpen(true)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  signatureInfo 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>{signatureInfo ? 'Signature Attached ✓' : '✍️ Sign Document'}</span>
              </button>

              {/* Native Android Share */}
              <button
                onClick={handleNativeShare}
                className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                title="Share to WhatsApp, Gmail, Drive or Bluetooth"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-400" />
                <span>{shared ? 'Shared!' : 'Android Share'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownloadTxt}
                className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>Download</span>
              </button>

              <button
                onClick={handlePrint}
                className="py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Electronic Signature Confirmation Bar if present */}
          {signatureInfo && (
            <div className="no-print bg-emerald-950/60 border-b border-emerald-500/30 px-4 py-2 text-xs text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>
                  <strong>Digitally Signed by:</strong> {signatureInfo.name} ({signatureInfo.role}) on {signatureInfo.date}
                </span>
              </div>
              <button
                onClick={() => setSignatureInfo(null)}
                className="text-[11px] text-emerald-400 underline hover:text-white"
              >
                Remove
              </button>
            </div>
          )}

          {/* Printable Document Body */}
          <div className="printable-document p-6 sm:p-8 bg-slate-950/60 overflow-y-auto flex-1 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-amber-500 selection:text-slate-950">
            {content}

            {/* Rendered signature in document preview */}
            {signatureInfo && (
              <div className="mt-8 pt-6 border-t-2 border-slate-700 text-slate-300 font-sans">
                <div className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Digital Execution Certificate (England & Wales)</span>
                </div>
                <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Applied Electronic Signature:</p>
                    <img 
                      src={signatureInfo.dataUrl} 
                      alt="Digital Signature" 
                      className="h-16 w-auto max-w-[200px] mt-1 bg-white p-1 rounded border border-slate-300"
                    />
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong className="text-white">Signatory:</strong> {signatureInfo.name}</p>
                    <p><strong className="text-white">Capacity / Role:</strong> {signatureInfo.role}</p>
                    <p><strong className="text-white">Date of Execution:</strong> {signatureInfo.date}</p>
                    <p className="text-[11px] text-slate-400">Electronic Communications Act 2000 & eIDAS Regulation</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Legal Disclaimer Footer (hidden in print) */}
          <div className="no-print p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
            <span>Prepared pursuant to English & Welsh Law • CPR / HMCTS Compliant Format</span>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">PocketLawyer UK Pro</span>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Pad Modal */}
      <DigitalSignaturePad
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSaveSignature={handleApplySignature}
        defaultName=""
        defaultRole="Signatory"
      />

      {/* Google Play Review Prompt Simulator Modal */}
      {showReviewPrompt && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-sm w-full p-5 text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Star className="w-6 h-6 fill-current text-amber-400" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">Enjoying PocketLawyer UK?</h4>
              <p className="text-xs text-slate-300 mt-1">
                Your generated legal document is ready. If you find PocketLawyer helpful, please consider leaving a 5-star rating on Google Play!
              </p>
            </div>

            <div className="flex justify-center gap-1.5 py-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-6 h-6 text-amber-400 fill-current cursor-pointer hover:scale-110 transition" />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowReviewPrompt(false)}
                className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setShowReviewPrompt(false);
                  window.open('https://play.google.com/store/apps', '_blank');
                }}
                className="flex-1 py-2 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400"
              >
                Rate on Play Store
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
