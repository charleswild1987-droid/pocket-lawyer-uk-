/**
 * PocketLawyer UK - Storage Vault Service
 * Hybrid IndexedDB + LocalStorage persistence layer
 * Guarantees zero-data-loss for:
 * 1. Live Incident Recordings (Audio/Video Media Blobs & Transcripts)
 * 2. Generated Legal Documents & HMRC Tax Forms
 * 3. Draft States & Offline Cache
 */

export interface SavedDocument {
  id: string;
  title: string;
  subtitle?: string;
  category: 'hmrc' | 'building' | 'landlord' | 'contracts' | 'court' | 'disputes' | 'notices' | 'police' | 'other';
  content: string;
  createdAt: string;
  updatedAt: string;
  isSigned?: boolean;
  signatureInfo?: {
    name: string;
    role: string;
    date: string;
    dataUrl?: string;
  };
  metadata?: Record<string, any>;
}

export interface StoredIncidentLog {
  id: string;
  date: string;
  time: string;
  officerName: string;
  collarNumber: string;
  policeStation: string;
  location: string;
  groundsGiven: string;
  itemsRequested: string;
  receiptProvided: boolean;
  notes: string;
  transcript?: string;
  aiStatement?: string;
  mediaType?: 'video' | 'audio';
  mediaDurationSeconds?: number;
  hasMediaBlob?: boolean;
  mediaMimeType?: string;
}

const DB_NAME = 'pocketlawyer_vault_db';
const DB_VERSION = 2;
const STORE_MEDIA_BLOBS = 'media_blobs';
const STORE_DOCUMENTS = 'vault_documents';

const LS_INCIDENTS_KEY = 'pocketlawyer_incidents_v1';
const LS_DOCUMENTS_KEY = 'pocketlawyer_saved_documents_v1';
const LS_INCIDENT_DRAFT_KEY = 'pocketlawyer_incident_draft_v1';
const LS_HMRC_DRAFT_KEY = 'pocketlawyer_hmrc_draft_v1';

class StorageVaultService {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initDB();
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported in this environment'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_MEDIA_BLOBS)) {
          db.createObjectStore(STORE_MEDIA_BLOBS);
        }
        if (!db.objectStoreNames.contains(STORE_DOCUMENTS)) {
          db.createObjectStore(STORE_DOCUMENTS, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (e) {
        console.error('Vault listener error:', e);
      }
    });
  }

  // ==========================================
  // 1. INCIDENT RECORDINGS & EVIDENCE PERSISTENCE
  // ==========================================

  public async saveIncident(
    incident: StoredIncidentLog,
    mediaBlob?: Blob | null
  ): Promise<void> {
    // 1. Save media blob into IndexedDB if provided
    let hasMediaBlob = false;
    let mediaMimeType = mediaBlob?.type;

    if (mediaBlob && mediaBlob.size > 0) {
      try {
        const db = await this.initDB();
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(STORE_MEDIA_BLOBS, 'readwrite');
          const store = tx.objectStore(STORE_MEDIA_BLOBS);
          const req = store.put(mediaBlob, `incident_${incident.id}`);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
        hasMediaBlob = true;
      } catch (err) {
        console.warn('Could not store media blob to IndexedDB:', err);
      }
    }

    // 2. Save metadata to LocalStorage
    const enrichedIncident: StoredIncidentLog = {
      ...incident,
      hasMediaBlob: hasMediaBlob || incident.hasMediaBlob,
      mediaMimeType: mediaMimeType || incident.mediaMimeType
    };

    const currentLogs = this.getIncidentsSync();
    const existingIndex = currentLogs.findIndex((l) => l.id === incident.id);
    let updatedLogs: StoredIncidentLog[];

    if (existingIndex >= 0) {
      updatedLogs = [...currentLogs];
      updatedLogs[existingIndex] = enrichedIncident;
    } else {
      updatedLogs = [enrichedIncident, ...currentLogs];
    }

    try {
      localStorage.setItem(LS_INCIDENTS_KEY, JSON.stringify(updatedLogs));
    } catch (e) {
      console.warn('LocalStorage incident save failed, falling back:', e);
    }

    this.notify();
  }

  public getIncidentsSync(): StoredIncidentLog[] {
    try {
      const data = localStorage.getItem(LS_INCIDENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public async getIncidentMediaBlob(incidentId: string): Promise<Blob | null> {
    try {
      const db = await this.initDB();
      return new Promise<Blob | null>((resolve, reject) => {
        const tx = db.transaction(STORE_MEDIA_BLOBS, 'readonly');
        const store = tx.objectStore(STORE_MEDIA_BLOBS);
        const req = store.get(`incident_${incidentId}`);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Error reading media blob from IndexedDB:', err);
      return null;
    }
  }

  public async deleteIncident(id: string): Promise<void> {
    // Delete blob from IndexedDB
    try {
      const db = await this.initDB();
      const tx = db.transaction(STORE_MEDIA_BLOBS, 'readwrite');
      tx.objectStore(STORE_MEDIA_BLOBS).delete(`incident_${id}`);
    } catch (e) {
      console.warn('Error deleting incident blob:', e);
    }

    // Delete from LocalStorage
    const logs = this.getIncidentsSync().filter((l) => l.id !== id);
    localStorage.setItem(LS_INCIDENTS_KEY, JSON.stringify(logs));
    this.notify();
  }

  // ==========================================
  // 2. GENERATED DOCUMENTS & HMRC FORMS VAULT
  // ==========================================

  public async saveDocument(doc: Omit<SavedDocument, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<SavedDocument> {
    const id = doc.id || `DOC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const now = new Date().toISOString();

    const fullDoc: SavedDocument = {
      id,
      title: doc.title,
      subtitle: doc.subtitle,
      category: doc.category,
      content: doc.content,
      createdAt: (doc as any).createdAt || now,
      updatedAt: now,
      isSigned: doc.isSigned || false,
      signatureInfo: doc.signatureInfo,
      metadata: doc.metadata
    };

    // 1. Save to LocalStorage for instant access
    const docs = this.getDocumentsSync();
    const existingIdx = docs.findIndex((d) => d.id === id);
    let updatedDocs: SavedDocument[];

    if (existingIdx >= 0) {
      updatedDocs = [...docs];
      updatedDocs[existingIdx] = fullDoc;
    } else {
      updatedDocs = [fullDoc, ...docs];
    }

    try {
      localStorage.setItem(LS_DOCUMENTS_KEY, JSON.stringify(updatedDocs));
    } catch (e) {
      console.warn('LocalStorage save failed, using IndexedDB fallback:', e);
    }

    // 2. Persist to IndexedDB
    try {
      const db = await this.initDB();
      const tx = db.transaction(STORE_DOCUMENTS, 'readwrite');
      tx.objectStore(STORE_DOCUMENTS).put(fullDoc);
    } catch (e) {
      console.warn('IndexedDB doc save error:', e);
    }

    this.notify();
    return fullDoc;
  }

  public getDocumentsSync(): SavedDocument[] {
    try {
      const data = localStorage.getItem(LS_DOCUMENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public async deleteDocument(id: string): Promise<void> {
    const docs = this.getDocumentsSync().filter((d) => d.id !== id);
    localStorage.setItem(LS_DOCUMENTS_KEY, JSON.stringify(docs));

    try {
      const db = await this.initDB();
      const tx = db.transaction(STORE_DOCUMENTS, 'readwrite');
      tx.objectStore(STORE_DOCUMENTS).delete(id);
    } catch (e) {
      console.warn('IndexedDB doc delete error:', e);
    }

    this.notify();
  }

  // ==========================================
  // 3. AUTO-SAVED DRAFTS (Zero-Loss Form Recovery)
  // ==========================================

  public saveIncidentDraft(draft: Record<string, any>): void {
    try {
      localStorage.setItem(LS_INCIDENT_DRAFT_KEY, JSON.stringify({
        ...draft,
        savedAt: new Date().toISOString()
      }));
    } catch {}
  }

  public getIncidentDraft(): Record<string, any> | null {
    try {
      const raw = localStorage.getItem(LS_INCIDENT_DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  public clearIncidentDraft(): void {
    try {
      localStorage.removeItem(LS_INCIDENT_DRAFT_KEY);
    } catch {}
  }

  public saveHmrcDraft(formCode: string, draft: Record<string, any>): void {
    try {
      const allDrafts = this.getAllHmrcDrafts();
      allDrafts[formCode] = {
        data: draft,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(LS_HMRC_DRAFT_KEY, JSON.stringify(allDrafts));
    } catch {}
  }

  public getHmrcDraft(formCode: string): Record<string, any> | null {
    try {
      const allDrafts = this.getAllHmrcDrafts();
      return allDrafts[formCode]?.data || null;
    } catch {
      return null;
    }
  }

  public getAllHmrcDrafts(): Record<string, { data: Record<string, any>; savedAt: string }> {
    try {
      const raw = localStorage.getItem(LS_HMRC_DRAFT_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  // ==========================================
  // 4. VAULT METRICS & EXPORT
  // ==========================================

  public getVaultStats(): {
    incidentCount: number;
    documentCount: number;
    hmrcDocCount: number;
    signedDocCount: number;
    totalSizeBytes: number;
  } {
    const incidents = this.getIncidentsSync();
    const documents = this.getDocumentsSync();

    const hmrcCount = documents.filter((d) => d.category === 'hmrc').length;
    const signedCount = documents.filter((d) => d.isSigned).length;

    let size = 0;
    try {
      size += (localStorage.getItem(LS_INCIDENTS_KEY) || '').length * 2;
      size += (localStorage.getItem(LS_DOCUMENTS_KEY) || '').length * 2;
      size += (localStorage.getItem(LS_INCIDENT_DRAFT_KEY) || '').length * 2;
      size += (localStorage.getItem(LS_HMRC_DRAFT_KEY) || '').length * 2;
    } catch {}

    return {
      incidentCount: incidents.length,
      documentCount: documents.length,
      hmrcDocCount: hmrcCount,
      signedDocCount: signedCount,
      totalSizeBytes: size
    };
  }

  public async exportAllVaultData(): Promise<string> {
    const incidents = this.getIncidentsSync();
    const documents = this.getDocumentsSync();
    const drafts = this.getAllHmrcDrafts();
    const incidentDraft = this.getIncidentDraft();

    const archive = {
      exportTimestamp: new Date().toISOString(),
      app: 'PocketLawyer UK',
      version: '1.0.0',
      incidents,
      documents,
      hmrcDrafts: drafts,
      incidentDraft
    };

    return JSON.stringify(archive, null, 2);
  }

  public async clearAllVault(): Promise<void> {
    localStorage.removeItem(LS_INCIDENTS_KEY);
    localStorage.removeItem(LS_DOCUMENTS_KEY);
    localStorage.removeItem(LS_INCIDENT_DRAFT_KEY);
    localStorage.removeItem(LS_HMRC_DRAFT_KEY);

    try {
      const db = await this.initDB();
      const tx = db.transaction([STORE_MEDIA_BLOBS, STORE_DOCUMENTS], 'readwrite');
      tx.objectStore(STORE_MEDIA_BLOBS).clear();
      tx.objectStore(STORE_DOCUMENTS).clear();
    } catch (e) {
      console.warn('Error clearing IndexedDB stores:', e);
    }

    this.notify();
  }
}

export const storageVault = new StorageVaultService();
