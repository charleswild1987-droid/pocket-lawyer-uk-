import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  ShieldCheck, 
  FileText, 
  Video, 
  Mic, 
  Trash2, 
  Download, 
  Copy, 
  Printer, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  Search, 
  AlertTriangle,
  Play,
  RotateCcw,
  Receipt,
  HardHat,
  Home,
  Briefcase
} from 'lucide-react';
import { storageVault, SavedDocument, StoredIncidentLog } from '../services/storageVault';

interface SavedVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDocument: (title: string, subtitle: string, content: string) => void;
}

export const SavedVaultModal: React.FC<SavedVaultModalProps> = ({
  isOpen,
  onClose,
  onOpenDocument
}) => {
  const [activeTab, setActiveTab] = useState<'documents' | 'incidents' | 'backup'>('documents');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [incidents, setIncidents] = useState<StoredIncidentLog[]>([]);
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadData = async () => {
    const docs = storageVault.getDocumentsSync();
    const incs = storageVault.getIncidentsSync();
    setDocuments(docs);
    setIncidents(incs);

    // Resolve media blob URLs for incidents that have stored media
    const urls: Record<string, string> = {};
    for (const inc of incs) {
      if (inc.hasMediaBlob) {
        const blob = await storageVault.getIncidentMediaBlob(inc.id);
        if (blob) {
          urls[inc.id] = URL.createObjectURL(blob);
        }
      }
    }
    setMediaUrls(urls);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
    const unsubscribe = storageVault.subscribe(() => {
      loadData();
    });
    return () => {
      unsubscribe();
      // Revoke any created object URLs on unmount
      Object.values(mediaUrls).forEach((url) => {
        try { URL.revokeObjectURL(url); } catch {}
      });
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredDocuments = documents.filter((doc) => {
    const matchesCat = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.subtitle && doc.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredIncidents = incidents.filter((inc) => {
    return (
      inc.officerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.collarNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inc.transcript && inc.transcript.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleDeleteDocument = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this saved document from your vault?')) {
      await storageVault.deleteDocument(id);
    }
  };

  const handleDeleteIncident = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this incident record and associated media evidence from the on-device vault?')) {
      await storageVault.deleteIncident(id);
    }
  };

  const handleCopyContent = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDownloadDoc = (doc: SavedDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    const blob = new Blob([doc.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAll = async () => {
    const jsonStr = await storageVault.exportAllVaultData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pocketlawyer_vault_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAll = async () => {
    if (confirm('WARNING: This will permanently delete all saved documents, drafts, and incident recordings from this device. Are you sure?')) {
      await storageVault.clearAllVault();
    }
  };

  const stats = storageVault.getVaultStats();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  My Legal & Tax Vault
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>On-Device Encrypted Storage</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                All generated contracts, HMRC tax returns, and live recorded incident evidence
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation & Search */}
        <div className="p-3 sm:px-5 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'documents'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Saved Documents ({documents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('incidents')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'incidents'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Incident Evidence ({incidents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'backup'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Backup & Health</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search vault..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 w-full sm:w-48"
            />
          </div>
        </div>

        {/* Category Filters for Documents */}
        {activeTab === 'documents' && (
          <div className="px-5 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-slate-500 font-medium mr-1">Filter:</span>
            {[
              { key: 'all', label: 'All Documents' },
              { key: 'hmrc', label: 'HMRC Tax' },
              { key: 'building', label: 'Building & Services' },
              { key: 'landlord', label: 'Landlord & Tenancy' },
              { key: 'contracts', label: 'Contracts & Loans' },
              { key: 'notices', label: 'Pre-Action Notices' },
              { key: 'disputes', label: 'Disputes & Fines' },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategoryFilter(cat.key)}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  categoryFilter === cat.key
                    ? 'bg-slate-800 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: SAVED DOCUMENTS */}
          {activeTab === 'documents' && (
            <div>
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-3">
                  <FileText className="w-12 h-12 mx-auto text-slate-600 stroke-[1.5]" />
                  <p className="text-sm font-medium">No saved documents found in this view.</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Any contracts, HMRC tax returns, building contracts, or dispute letters you generate and preview are automatically saved here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => {
                        onOpenDocument(doc.title, doc.subtitle || '', doc.content);
                        onClose();
                      }}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer flex flex-col justify-between group shadow-sm"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            doc.category === 'hmrc'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : doc.category === 'building'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {doc.category.toUpperCase()}
                          </span>

                          <div className="flex items-center gap-1">
                            {doc.isSigned && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-0.5">
                                <ShieldCheck className="w-3 h-3" /> Signed
                              </span>
                            )}
                            <button
                              onClick={(e) => handleDeleteDocument(doc.id, e)}
                              className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-900 transition"
                              title="Delete from vault"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition line-clamp-1">
                          {doc.title}
                        </h3>
                        {doc.subtitle && (
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {doc.subtitle}
                          </p>
                        )}

                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-2 font-mono bg-slate-900/60 p-2 rounded border border-slate-850">
                          {doc.content.slice(0, 140)}...
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-850 text-xs">
                        <span className="text-[10px] text-slate-500">
                          {new Date(doc.updatedAt).toLocaleDateString('en-GB')} {new Date(doc.updatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleCopyContent(doc.content, doc.id, e)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition"
                            title="Copy text"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDownloadDoc(doc, e)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition"
                            title="Download .txt"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INCIDENT RECORDINGS & EVIDENCE */}
          {activeTab === 'incidents' && (
            <div className="space-y-4">
              {filteredIncidents.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-3">
                  <Video className="w-12 h-12 mx-auto text-slate-600 stroke-[1.5]" />
                  <p className="text-sm font-medium">No recorded incident evidence in the vault.</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Live camera, audio evidence, and contemporaneous statements recorded in the Police & Custody tab are stored securely here with zero cloud leakage.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredIncidents.map((inc) => (
                    <div
                      key={inc.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 shadow-md"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                            {inc.id}
                          </span>
                          <span className="text-xs font-semibold text-white">
                            Officer: {inc.officerName || 'Unknown'} (Collar: {inc.collarNumber || 'Not noted'})
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{inc.date} at {inc.time}</span>
                          <button
                            onClick={(e) => handleDeleteIncident(inc.id, e)}
                            className="p-1 text-slate-500 hover:text-red-400 transition"
                            title="Delete incident"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 text-[11px] block">Location</span>
                          <span className="text-slate-300">{inc.location || 'Not recorded'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[11px] block">Stated Grounds</span>
                          <span className="text-slate-300">{inc.groundsGiven || 'None provided'}</span>
                        </div>
                      </div>

                      {/* Video / Audio Playback if stored */}
                      {inc.hasMediaBlob && mediaUrls[inc.id] && (
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                              {inc.mediaType === 'video' ? <Video className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                              <span>Stored {inc.mediaType === 'video' ? 'Video' : 'Audio'} Evidence ({inc.mediaDurationSeconds ? `${inc.mediaDurationSeconds}s` : 'Recorded'})</span>
                            </span>
                            <a
                              href={mediaUrls[inc.id]}
                              download={`incident_${inc.id}_evidence.${inc.mediaType === 'video' ? 'webm' : 'webm'}`}
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[11px]"
                            >
                              <Download className="w-3 h-3" /> Download Media
                            </a>
                          </div>

                          {inc.mediaType === 'video' ? (
                            <video
                              src={mediaUrls[inc.id]}
                              controls
                              className="w-full max-h-56 rounded-lg bg-black object-contain"
                            />
                          ) : (
                            <audio src={mediaUrls[inc.id]} controls className="w-full" />
                          )}
                        </div>
                      )}

                      {/* Section 9 / Transcript summary */}
                      {inc.aiStatement && (
                        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                          <span className="font-bold text-amber-400 text-[11px] block mb-1">
                            Section 9 Witness Statement (Criminal Justice Act 1967)
                          </span>
                          <p className="text-slate-300 font-mono text-[11px] line-clamp-3 leading-relaxed">
                            {inc.aiStatement}
                          </p>
                          <button
                            onClick={() => {
                              onOpenDocument(`Section 9 Statement - ${inc.id}`, `Officer ${inc.collarNumber} - ${inc.date}`, inc.aiStatement || '');
                              onClose();
                            }}
                            className="mt-2 text-amber-400 hover:text-amber-300 font-semibold text-[11px] flex items-center gap-1"
                          >
                            <span>Open Statement for Formal Signing</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BACKUP & STORAGE HEALTH */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-xs block">Documents</span>
                  <strong className="text-xl font-bold text-white">{stats.documentCount}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-xs block">Incidents</span>
                  <strong className="text-xl font-bold text-white">{stats.incidentCount}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-xs block">HMRC Returns</span>
                  <strong className="text-xl font-bold text-indigo-400">{stats.hmrcDocCount}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-xs block">Signed Deeds</span>
                  <strong className="text-xl font-bold text-emerald-400">{stats.signedDocCount}</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="font-bold text-sm text-white">Full On-Device Vault Backup</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Export all your saved agreements, Section 9 statements, and HMRC forms into a portable, standard JSON file. You can keep this on a secure USB key or import into legal proceedings.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleExportAll}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Complete Vault Archive (.JSON)</span>
                  </button>

                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 text-xs font-medium transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>GDPR Data Wipe / Reset Vault</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>PocketLawyer UK • Private on-device IndexedDB vault</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
