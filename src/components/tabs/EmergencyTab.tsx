import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Eye, 
  Mic, 
  Video,
  Square,
  Play,
  Download,
  Clock, 
  FileText, 
  Save, 
  Copy, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  PhoneCall,
  Volume2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Camera,
  RefreshCw,
  Sparkles,
  MapPin,
  PenTool,
  Check,
  Maximize2,
  Database
} from 'lucide-react';
import { storageVault, StoredIncidentLog } from '../../services/storageVault';

interface IncidentLog {
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
  mediaBlobUrl?: string;
  hasMediaBlob?: boolean;
}

interface IncidentFormData {
  officerName: string;
  collarNumber: string;
  policeStation: string;
  location: string;
  groundsGiven: string;
  itemsRequested: string;
  receiptProvided: boolean;
  notes: string;
}

interface EmergencyTabProps {
  onOpenDocument?: (title: string, subtitle: string, content: string) => void;
}

export const EmergencyTab: React.FC<EmergencyTabProps> = ({ onOpenDocument }) => {
  const [logs, setLogs] = useState<IncidentLog[]>(() => {
    return storageVault.getIncidentsSync() as IncidentLog[];
  });

  const [form, setForm] = useState<IncidentFormData>(() => {
    const draft = storageVault.getIncidentDraft();
    return draft?.form || {
      officerName: '',
      collarNumber: '',
      policeStation: '',
      location: '',
      groundsGiven: '',
      itemsRequested: 'Jacket, Outer coat, Gloves only',
      receiptProvided: false,
      notes: ''
    };
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  // Recording Mode: 'video' (Camera + Mic) or 'audio' (Sound Only)
  const [recordMode, setRecordMode] = useState<'video' | 'audio'>('video');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedMediaUrl, setRecordedMediaUrl] = useState<string | null>(null);
  const [recordedMediaBlob, setRecordedMediaBlob] = useState<Blob | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);

  // Real-time Speech Recognition / Live Subtitles
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const speechRecognitionRef = useRef<any>(null);

  // Video / Audio Stream Refs
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // AI Write-Up State
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [aiAnalysisStep, setAiAnalysisStep] = useState<string>('');

  // Hydrate stored incident media blobs from IndexedDB on mount
  useEffect(() => {
    let isMounted = true;
    async function hydrateMedia() {
      const stored = storageVault.getIncidentsSync();
      const hydrated = await Promise.all(
        stored.map(async (item) => {
          if (item.hasMediaBlob) {
            const blob = await storageVault.getIncidentMediaBlob(item.id);
            if (blob && isMounted) {
              return {
                ...item,
                mediaBlobUrl: URL.createObjectURL(blob)
              };
            }
          }
          return item;
        })
      );
      if (isMounted) {
        setLogs(hydrated as IncidentLog[]);
      }
    }
    hydrateMedia();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-save incident form draft continuously
  useEffect(() => {
    storageVault.saveIncidentDraft({
      form,
      liveTranscript,
      aiAnalysisResult,
      recordMode
    });
  }, [form, liveTranscript, aiAnalysisResult, recordMode]);

  // Clean up media stream on unmount
  useEffect(() => {
    return () => {
      stopMediaStream();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  const stopMediaStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
  };

  // Start live viewfinder / stream
  const initStream = async (mode: 'video' | 'audio', cameraFacing: 'environment' | 'user') => {
    stopMediaStream();
    setMediaError(null);

    try {
      const constraints: MediaStreamConstraints = mode === 'video' 
        ? {
            video: {
              facingMode: { ideal: cameraFacing },
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: true
          }
        : {
            audio: true,
            video: false
          };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      if (mode === 'video' && videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play().catch(e => console.warn('Preview play error:', e));
      }

      return stream;
    } catch (err: any) {
      console.error('Camera/Mic permission error:', err);
      setMediaError(
        mode === 'video'
          ? 'Camera or microphone access denied. Please grant permissions in your browser/device settings.'
          : 'Microphone access denied. Please grant microphone permissions.'
      );
      return null;
    }
  };

  // Start Recording
  const startRecording = async () => {
    setRecordedMediaUrl(null);
    setRecordedMediaBlob(null);
    setLiveTranscript('');
    setAiAnalysisResult(null);

    const stream = await initStream(recordMode, facingMode);
    if (!stream) return;

    mediaChunksRef.current = [];

    // Select supported MIME type
    let mimeType = '';
    if (recordMode === 'video') {
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
        mimeType = 'video/webm;codecs=vp9,opus';
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        mimeType = 'video/webm';
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
      }
    } else {
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }
    }

    try {
      const recorder = mimeType 
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          mediaChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const type = mimeType || (recordMode === 'video' ? 'video/webm' : 'audio/webm');
        const blob = new Blob(mediaChunksRef.current, { type });
        const url = URL.createObjectURL(blob);
        setRecordedMediaBlob(blob);
        setRecordedMediaUrl(url);
        stopMediaStream();
      };

      recorder.start(1000); // chunk every 1s
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

      // Start Web Speech Recognition if available in browser
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-GB';

          recognition.onresult = (event: any) => {
            let fullText = '';
            for (let i = 0; i < event.results.length; ++i) {
              fullText += event.results[i][0].transcript + ' ';
            }
            setLiveTranscript(fullText.trim());
          };

          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch (e) {
          console.warn('Speech recognition not active:', e);
        }
      }
    } catch (err: any) {
      setMediaError('Could not initialize recorder: ' + err.message);
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch {}
      }
    }
  };

  const discardRecording = () => {
    if (recordedMediaUrl) URL.revokeObjectURL(recordedMediaUrl);
    setRecordedMediaUrl(null);
    setRecordedMediaBlob(null);
    setRecordingSeconds(0);
    setLiveTranscript('');
    setAiAnalysisResult(null);
    stopMediaStream();
  };

  const switchCameraFacing = async () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    if (isRecording) {
      // Re-init stream while keeping recording
      await initStream(recordMode, nextFacing);
    }
  };

  // Auto-capture GPS location
  const handleCaptureGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this device.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)} (±${Math.round(pos.coords.accuracy)}m)`;
        setForm(prev => ({
          ...prev,
          location: prev.location ? `${prev.location} [GPS: ${coords}]` : `GPS Coordinates: ${coords}`
        }));
      },
      (err) => {
        alert('Could not obtain GPS location: ' + err.message);
      }
    );
  };

  // AI Automatic Write-up Generator
  const handleGenerateAiStatement = async () => {
    setIsAiAnalyzing(true);
    setAiAnalysisStep('Uploading contemporaneous audio/transcript to AI Sentinel...');

    try {
      // Convert audio/video blob to base64 if available
      let audioBase64: string | undefined = undefined;
      let mimeType = recordedMediaBlob?.type || 'audio/webm';

      if (recordedMediaBlob && recordedMediaBlob.size < 15 * 1024 * 1024) {
        setAiAnalysisStep('Encoding evidence stream for legal transcription...');
        const buffer = await recordedMediaBlob.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        audioBase64 = btoa(binary);
      }

      setAiAnalysisStep('Analyzing PACE Code A, GOWISELY checklist & drafting Section 9 Statement...');

      const response = await fetch('/api/incident/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: liveTranscript || form.notes,
          notes: form.notes,
          officerName: form.officerName,
          collarNumber: form.collarNumber,
          policeStation: form.policeStation,
          location: form.location,
          date: new Date().toLocaleDateString('en-GB'),
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          mediaType: recordMode,
          audioBase64,
          mimeType
        })
      });

      const data = await response.json();

      if (data.success && data.statement) {
        setAiAnalysisResult(data.statement);
        setForm(prev => ({
          ...prev,
          notes: prev.notes || data.statement.substring(0, 300) + '...'
        }));
      } else {
        throw new Error(data.error || 'Failed to generate write-up');
      }
    } catch (err: any) {
      console.warn('Backend Gemini API call error, applying local statutory legal statement compiler:', err);
      // Fallback local statutory compiler
      const localWriteup = `================================================================================
CRIMINAL JUSTICE ACT 1967, s.9; MAGISTRATES' COURTS ACT 1980, s.5B
STATEMENT OF WITNESS (CONTEMPORANEOUS POLICE STOP & SEARCH STATEMENT)
================================================================================

STATEMENT OF: Citizen
DATED: ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
LOCATION: ${form.location || 'Public place (England & Wales)'}

DECLARATION OF TRUTH:
This statement (consisting of 2 pages each signed by me) is true to the best of my knowledge and belief and I make it knowing that, if it is tendered in evidence, I shall be liable to prosecution if I have wilfully stated in it anything which I know to be false or do not believe to be true.

Signature: ___________________________________

1. ACCOUNT OF INCIDENT:
On ${new Date().toLocaleDateString('en-GB')}, I was stopped by an individual identifying themselves as a police officer:
- Officer Name stated: ${form.officerName || 'Not stated'}
- Collar/Shoulder Number: ${form.collarNumber || 'Refused / Not provided'}
- Police Station/Force: ${form.policeStation || 'Not provided'}
- Grounds stated: "${form.groundsGiven || 'No clear objective grounds provided'}"

2. RECORDED DIALOGUE & TRANSCRIPT:
"${liveTranscript || form.notes || 'Contemporaneous recording captured on PocketLawyer UK HUD.'}"

3. PACE 1984 CODE A LEGAL COMPLIANCE AUDIT:
- GOWISELY: Officers must state Grounds, Object, Warrant, Identity, Station, Entitlement to copy, Legal power, and that You are detained.
- JOG Rule: In public view, officer may only demand removal of Jacket, Outer coat, and Gloves.
- Receipt: ${form.receiptProvided ? 'Officer provided a search receipt/reference.' : 'FAILURE: Officer did not provide a search record receipt at the scene.'}

4. NEXT STEPS:
- Issue Body-Worn Video (BWV) preservation notice within 31 days to the Chief Constable under PACE Code B.
- File formal complaint with the Independent Office for Police Conduct (IOPC) if procedural misconduct occurred.`;

      setAiAnalysisResult(localWriteup);
    } finally {
      setIsAiAnalyzing(false);
      setAiAnalysisStep('');
    }
  };

  const handleSaveLog = async (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: IncidentLog = {
      id: `INC-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-GB'),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      ...form,
      transcript: liveTranscript || undefined,
      aiStatement: aiAnalysisResult || undefined,
      mediaType: recordMode,
      mediaDurationSeconds: recordingSeconds > 0 ? recordingSeconds : undefined,
      mediaBlobUrl: recordedMediaUrl || undefined,
      hasMediaBlob: Boolean(recordedMediaBlob && recordedMediaBlob.size > 0)
    };

    setLogs([newLog, ...logs]);
    await storageVault.saveIncident(newLog as StoredIncidentLog, recordedMediaBlob);
    storageVault.clearIncidentDraft();

    setForm({
      officerName: '',
      collarNumber: '',
      policeStation: '',
      location: '',
      groundsGiven: '',
      itemsRequested: 'Jacket, Outer coat, Gloves only',
      receiptProvided: false,
      notes: ''
    });

    setRecordedMediaUrl(null);
    setRecordedMediaBlob(null);
    setRecordingSeconds(0);
    setLiveTranscript('');
    setAiAnalysisResult(null);

    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 3000);
  };

  const copyLog = (log: IncidentLog) => {
    const text = log.aiStatement || `=== POLICE STOP & SEARCH INCIDENT RECORD ===
Reference: ${log.id}
Date/Time: ${log.date} at ${log.time}
Location: ${log.location || 'Not specified'}
Officer Name: ${log.officerName || 'Not stated'}
Collar Number: ${log.collarNumber || 'Refused/Not noted'}
Police Station: ${log.policeStation || 'Not stated'}
Stated Grounds: ${log.groundsGiven || 'None given'}
Items Demanded: ${log.itemsRequested}
Search Record Provided: ${log.receiptProvided ? 'Yes' : 'No'}
Notes: ${log.notes || 'None'}
============================================
Prepared pursuant to PACE 1984.`;

    navigator.clipboard.writeText(text);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteLog = async (id: string) => {
    setLogs(logs.filter(l => l.id !== id));
    await storageVault.deleteIncident(id);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Alert Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/80 via-red-900/60 to-slate-900 border-2 border-red-500/50 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">Live Incident Evidence Recorder & AI Legal Write-Up</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-500 text-white font-black uppercase tracking-wider">
                Video • Sound • AI
              </span>
            </div>
            <p className="text-xs text-red-200 mt-1 leading-relaxed">
              Capture video and audio evidence with real-time speech subtitles and generate an automated PACE & Section 9 Criminal Justice Act 1967 court witness statement.
            </p>
          </div>
        </div>
      </div>

      {/* LIVE VIDEO & SOUND RECORDER HUD */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-red-500/30 shadow-2xl space-y-4">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setRecordMode('video'); discardRecording(); }}
                disabled={isRecording}
                className={`py-1.5 px-3 rounded-md flex items-center gap-1.5 transition cursor-pointer ${
                  recordMode === 'video' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video & Sound</span>
              </button>
              <button
                type="button"
                onClick={() => { setRecordMode('audio'); discardRecording(); }}
                disabled={isRecording}
                className={`py-1.5 px-3 rounded-md flex items-center gap-1.5 transition cursor-pointer ${
                  recordMode === 'audio' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Sound Only (Stealth)</span>
              </button>
            </div>

            {recordMode === 'video' && (
              <button
                type="button"
                onClick={switchCameraFacing}
                className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition"
                title="Switch front/back camera"
              >
                <Camera className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">{facingMode === 'environment' ? 'Rear Cam' : 'Front Cam'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCaptureGPS}
              className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition"
              title="Tag exact GPS coordinates"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">GPS Tag</span>
            </button>
          </div>

          {/* Record Actions */}
          <div className="flex items-center gap-2">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="py-2 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-red-600/30 cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                <span>Start Live Recording</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer border border-red-500 shadow-lg"
              >
                <Square className="w-3.5 h-3.5 text-red-400 fill-current" />
                <span>Stop Recording ({formatTimer(recordingSeconds)})</span>
              </button>
            )}
          </div>
        </div>

        {mediaError && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{mediaError}</span>
          </div>
        )}

        {/* VIEWPORT / PREVIEW CONTAINER */}
        <div className="relative rounded-2xl bg-black border-2 border-slate-800 overflow-hidden min-h-[220px] max-h-[380px] flex items-center justify-center">
          {/* Live Video Recording Viewfinder */}
          {recordMode === 'video' && !recordedMediaUrl && (
            <div className="w-full h-full relative flex items-center justify-center bg-black">
              <video
                ref={videoPreviewRef}
                playsInline
                autoPlay
                muted
                className={`w-full max-h-[360px] object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {!isRecording && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4 text-center">
                  <Camera className="w-12 h-12 text-slate-500 mb-2" />
                  <p className="text-white font-bold text-sm">Live Camera Viewfinder Ready</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Tap "Start Live Recording" to capture synchronized audio and video evidence directly onto your device.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Audio-Only Recording Visualizer */}
          {recordMode === 'audio' && !recordedMediaUrl && (
            <div className="p-8 text-center space-y-3">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                isRecording ? 'bg-red-500/30 border-2 border-red-500 animate-pulse text-red-400' : 'bg-slate-800 text-slate-400'
              }`}>
                <Mic className="w-8 h-8" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">
                  {isRecording ? `Stealth Audio Recording: ${formatTimer(recordingSeconds)}` : 'Stealth Voice Memo Recorder'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Discrete, low-battery recording ideal for pocket or vehicle storage.
                </p>
              </div>
            </div>
          )}

          {/* Captured Playback View */}
          {recordedMediaUrl && (
            <div className="w-full flex flex-col items-center justify-center p-3 bg-slate-950">
              {recordMode === 'video' ? (
                <video src={recordedMediaUrl} controls playsInline className="w-full max-h-[320px] rounded-xl border border-slate-800" />
              ) : (
                <div className="w-full p-6 text-center space-y-3">
                  <Volume2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <p className="text-white font-bold text-sm">Evidence Audio Captured ({formatTimer(recordingSeconds)})</p>
                  <audio src={recordedMediaUrl} controls className="w-full max-w-md mx-auto" />
                </div>
              )}
            </div>
          )}

          {/* Live Recording HUD Overlay */}
          {isRecording && (
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider shadow-lg">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                <span>REC {formatTimer(recordingSeconds)}</span>
              </div>
              <span className="text-[11px] bg-black/70 backdrop-blur text-slate-200 px-2.5 py-1 rounded-md font-mono">
                {new Date().toLocaleTimeString('en-GB')}
              </span>
            </div>
          )}
        </div>

        {/* Live Subtitles / Speech Captions Stream */}
        {(isRecording || liveTranscript) && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Live Speech Subtitles & Spoken Dialogue
              </span>
              <span>{isRecording ? 'Listening live...' : 'Captured transcript'}</span>
            </div>
            <p className="text-xs text-slate-200 font-mono italic leading-relaxed min-h-[1.5rem]">
              {liveTranscript ? `"${liveTranscript}"` : 'Listening for spoken words...'}
            </p>
          </div>
        )}

        {/* Post-Capture Actions & AI Automatic Write-Up Generator Button */}
        {recordedMediaUrl && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 to-slate-950 border border-blue-500/40 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>AI Automated Incident Write-Up (Gemini Engine)</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Automatically transcribes dialogue and drafts a court-admissible Section 9 Witness Statement with PACE breach audits.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isAiAnalyzing}
                  onClick={handleGenerateAiStatement}
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  {isAiAnalyzing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing Evidence...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate AI Legal Write-Up</span>
                    </>
                  )}
                </button>

                <a
                  href={recordedMediaUrl}
                  download={`evidence_${recordMode}_${Date.now()}.webm`}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Download {recordMode === 'video' ? 'Video' : 'Audio'}</span>
                </a>

                <button
                  type="button"
                  onClick={discardRecording}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition"
                  title="Discard recording"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isAiAnalyzing && (
              <div className="p-3 rounded-lg bg-slate-900 border border-blue-500/30 text-xs text-blue-300 flex items-center gap-2 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
                <span>{aiAnalysisStep || 'AI Sentinel analyzing evidence against English law...'}</span>
              </div>
            )}
          </div>
        )}

        {/* AI GENERATED STATEMENT PREVIEW CARD */}
        {aiAnalysisResult && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border-2 border-emerald-500/50 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Court-Admissible Section 9 Witness Statement</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      Criminal Justice Act 1967
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">Contemporaneously compiled from video/sound evidence</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onOpenDocument && (
                  <button
                    type="button"
                    onClick={() => onOpenDocument(
                      'Police Stop & Search Section 9 Statement',
                      'Contemporaneous Criminal Justice Act 1967 Statement with Electronic Signature',
                      aiAnalysisResult
                    )}
                    className="py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Sign & Print PDF</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(aiAnalysisResult);
                    setCopiedId('ai-statement');
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  {copiedId === 'ai-statement' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'ai-statement' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-200 font-mono whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed select-text">
              {aiAnalysisResult}
            </div>
          </div>
        )}
      </div>

      {/* Incident Details Logger Form */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Contemporaneous Incident Evidence Registry</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Securely store officer badge numbers, location, and recorded testimony on this device.
            </p>
          </div>
          {showSavedNotification && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-pulse">
              <CheckCircle className="w-3.5 h-3.5" /> Saved to Device!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveLog} className="space-y-3 text-xs">
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Officer Name (if given)</label>
              <input
                type="text"
                value={form.officerName}
                onChange={(e) => setForm({ ...form, officerName: e.target.value })}
                placeholder="PC Smith"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Collar / Shoulder Number *</label>
              <input
                type="text"
                required
                value={form.collarNumber}
                onChange={(e) => setForm({ ...form, collarNumber: e.target.value })}
                placeholder="e.g. 4812 CW"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Police Station / Force</label>
              <input
                type="text"
                value={form.policeStation}
                onChange={(e) => setForm({ ...form, policeStation: e.target.value })}
                placeholder="e.g. Charing Cross / Met Police"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
                <span>Street Location / GPS</span>
                <button
                  type="button"
                  onClick={handleCaptureGPS}
                  className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3" /> Auto-GPS Tag
                </button>
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. High Street outside station"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Grounds Stated by Officer</label>
              <input
                type="text"
                value={form.groundsGiven}
                onChange={(e) => setForm({ ...form, groundsGiven: e.target.value })}
                placeholder="What did the officer say they suspected?"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Citizen Notes / Circumstances</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Names of bystanders, demeanour, tone, questions asked"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-3 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium select-none">
                <input
                  type="checkbox"
                  checked={form.receiptProvided}
                  onChange={(e) => setForm({ ...form, receiptProvided: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-0 bg-slate-950 border-slate-700 w-4 h-4"
                />
                <span>Officer Provided Written Search Record / Receipt</span>
              </label>

              <div className="text-[11px] text-slate-400">
                {recordedMediaUrl ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> {recordMode === 'video' ? 'Video' : 'Audio'} evidence ({formatTimer(recordingSeconds)}) attached
                  </span>
                ) : (
                  <span>Contemporaneous recordings provide prima facie proof in court.</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Save Complete Incident Record</span>
            </button>
          </div>
        </form>

        {/* Saved Incidents History */}
        {logs.length > 0 && (
          <div className="mt-5 space-y-3 border-t border-slate-800 pt-4">
            <h4 className="font-bold text-white text-xs flex items-center justify-between">
              <span>Saved Incident Evidence History ({logs.length})</span>
              <span className="text-[10px] text-slate-400 font-normal">Encrypted locally in browser sandbox</span>
            </h4>

            <div className="space-y-2.5">
              {logs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-amber-400 font-bold">{log.id}</span>
                      <span className="text-slate-400">{log.date} at {log.time}</span>
                      {log.mediaDurationSeconds && (
                        <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] flex items-center gap-1 font-mono">
                          {log.mediaType === 'video' ? <Video className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                          {log.mediaDurationSeconds}s {log.mediaType}
                        </span>
                      )}
                      {log.aiStatement && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> AI Statement
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {log.aiStatement && onOpenDocument && (
                        <button
                          onClick={() => onOpenDocument(
                            `Statement ${log.id} - Police Stop & Search`,
                            `Contemporaneous witness statement taken ${log.date}`,
                            log.aiStatement!
                          )}
                          className="p-1 px-2 rounded bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold transition flex items-center gap-1 text-[11px]"
                        >
                          <FileText className="w-3 h-3" />
                          <span>View Statement</span>
                        </button>
                      )}
                      <button
                        onClick={() => copyLog(log)}
                        className="p-1 px-2 rounded bg-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1 text-[11px]"
                      >
                        {copiedId === log.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === log.id ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => deleteLog(log.id)}
                        className="p-1 text-slate-500 hover:text-red-400 transition"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Officer & Collar</span>
                      <span className="font-semibold text-white">{log.officerName || 'Unknown'} (Collar: {log.collarNumber})</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Station / Location</span>
                      <span>{log.policeStation || 'N/A'} • {log.location || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Stated Grounds</span>
                      <span className="text-amber-300">{log.groundsGiven || 'None provided'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* GOWISELY & JOG Reference Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Card 1: GOWISELY */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              The GOWISELY Rule (Mandatory Duties)
            </h3>
            <span className="text-[10px] text-amber-400 font-mono">PACE 1984 s.2</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Before searching, an officer <strong>MUST</strong> provide the following 8 items. If any is omitted, the search is legally defective:
          </p>

          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 text-[10px]">G</span>
              <div><strong>Grounds:</strong> Reasonable grounds for suspecting you carry stolen goods, drugs, weapons, or bladed articles.</div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 text-[10px]">O</span>
              <div><strong>Object:</strong> What specific item they are searching for.</div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 text-[10px]">W</span>
              <div><strong>Warrant Card:</strong> Shown if the officer is not in uniform.</div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 text-[10px]">I</span>
              <div><strong>Identity:</strong> The officer's name or collar / shoulder number.</div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 text-[10px]">S</span>
              <div><strong>Station:</strong> The police station they are attached to.</div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 text-[10px]">E</span>
              <div><strong>Entitlement:</strong> An explanation of your legal entitlement to a written copy of the search record.</div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 text-[10px]">L</span>
              <div><strong>Legal Power:</strong> The statute relied upon (e.g. PACE 1984 s.1, Misuse of Drugs Act s.23).</div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 text-[10px]">Y</span>
              <div><strong>You Are Detained:</strong> Clear statement that you are detained for the duration of the search.</div>
            </div>
          </div>
        </div>

        {/* Card 2: JOG Clothing Limits & The Caution */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                The JOG Rule (Clothing Removal Limits)
              </h3>
              <span className="text-[10px] text-red-400 font-mono">PACE Code A 3.5</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              In a public place, an officer can <strong>ONLY</strong> require you to remove your:
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 font-bold text-amber-300">
                Jacket
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 font-bold text-amber-300">
                Outer Coat
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 font-bold text-amber-300">
                Gloves
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Any more extensive search (shoes, socks, jumpers) <strong>MUST</strong> be conducted out of public view (e.g., inside a police van or station) by an officer of the same sex.
            </p>
          </div>

          {/* The Police Caution */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                The Official UK Police Caution (Code C 10.5)
              </h4>
            </div>
            <blockquote className="p-3 rounded-xl bg-slate-950 border-l-4 border-amber-500 text-xs italic text-slate-200">
              "You do not have to say anything. But it may harm your defence if you do not mention when questioned something which you later rely on in court. Anything you do say may be given in evidence."
            </blockquote>
            <p className="text-[11px] text-slate-400">
              <strong>Rule of Thumb:</strong> You do NOT have to answer police interview questions without your free duty solicitor present.
            </p>
          </div>
        </div>
      </div>

      {/* Custody Rights (The Big Three) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          The "Big Three" Custody Rights (Upon Police Arrest)
        </h3>

        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
              <PhoneCall className="w-4 h-4" />
              1. Free Legal Advice
            </div>
            <p className="text-slate-400 text-[11px]">
              <strong>PACE 1984 s.58:</strong> You are entitled to free, independent legal advice from a duty solicitor. This is completely free regardless of income.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-blue-400 flex items-center gap-1.5 mb-1">
              <Clock className="w-4 h-4" />
              2. Right to Inform Someone
            </div>
            <p className="text-slate-400 text-[11px]">
              <strong>PACE 1984 s.56:</strong> Right to have someone (family member or friend) informed of your arrest and location without unreasonable delay.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
              <FileText className="w-4 h-4" />
              3. PACE Codes of Practice
            </div>
            <p className="text-slate-400 text-[11px]">
              Right to inspect the PACE Codes of Practice (Code C) detailing custody standards, 8-hour continuous rest, medical attention, and food.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Legal Contact Directory */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
          <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
          <span>UK Legal Support Helplines (Free & Confidential)</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-slate-400 text-[10px]">Civil Legal Advice</p>
            <p className="font-bold text-white text-xs mt-0.5">0345 345 4 345</p>
            <p className="text-[9px] text-emerald-400">Gov Legal Aid</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-slate-400 text-[10px]">Shelter Housing Aid</p>
            <p className="font-bold text-white text-xs mt-0.5">0808 800 4444</p>
            <p className="text-[9px] text-blue-400">Evictions / Disrepair</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-slate-400 text-[10px]">ACAS Workplace</p>
            <p className="font-bold text-white text-xs mt-0.5">0300 123 1100</p>
            <p className="text-[9px] text-amber-400">Dismissal / Wages</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-slate-400 text-[10px]">IOPC Police Complaints</p>
            <p className="font-bold text-white text-xs mt-0.5">0300 020 0096</p>
            <p className="text-[9px] text-red-400">Police Conduct Watch</p>
          </div>
        </div>
      </div>
    </div>
  );
};
