import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // Health check API
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      hasGeminiApiKey: Boolean(apiKey),
      timestamp: new Date().toISOString()
    });
  });

  // AI Live Incident Automated Transcription & Section 9 Witness Statement Analysis
  app.post('/api/incident/analyze', async (req, res) => {
    try {
      const {
        transcript,
        notes,
        officerName,
        collarNumber,
        policeStation,
        location,
        date,
        time,
        audioBase64,
        mimeType,
        mediaType // 'video' | 'audio'
      } = req.body;

      const incidentDate = date || new Date().toLocaleDateString('en-GB');
      const incidentTime = time || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      const incidentLocation = location || 'Public Highway / Street location (England & Wales)';

      if (!ai) {
        // Fallback generator when Gemini API Key is pending or in offline test mode
        const fallbackWriteup = `================================================================================
CRIMINAL JUSTICE ACT 1967, s.9; MAGISTRATES' COURTS ACT 1980, s.5B
CRIMINAL PROCEDURE RULES, PART 16.2
STATEMENT OF WITNESS (CONTEMPORANEOUS INCIDENT RECORD)
================================================================================

STATEMENT OF: Citizen / Subject
AGE OF WITNESS: Over 18
OCCUPATION: Private Citizen

This statement (consisting of 2 pages each signed by me) is true to the best of my knowledge and belief and I make it knowing that, if it is tendered in evidence, I shall be liable to prosecution if I have wilfully stated in it anything which I know to be false or do not believe to be true.

Dated the ${incidentDate}

Signature: ___________________________________

1. FACTUAL NARRATIVE & INCIDENT ACCOUNT:
On ${incidentDate} at approximately ${incidentTime}, I was present at or near ${incidentLocation}.
At this time, I was approached by a police officer who identified themselves as ${officerName || '[Officer Name Refused/Not Stated]'} displaying Collar/Shoulder Number ${collarNumber || '[Not Stated]'}${policeStation ? ` attached to ${policeStation}` : ''}.

The officer stated they were exercising powers under PACE 1984 / Misuse of Drugs Act 1971.
The grounds stated by the officer were: "${notes || transcript || 'Stop and search initiated without clear objective grounds stated'}".

2. RECORDED DIALOGUE & CONTEMPORANEOUS TRANSCRIPTION:
${transcript ? `[Audio/Speech Transcript Captured on Device]:\n"${transcript}"` : `[Contemporaneous Notes Recorded at Scene]:\n${notes || 'Encounter recorded via PocketLawyer UK Live Incident Recorder.'}`}

3. PROCEDURAL AUDIT UNDER PACE CODE A (GOWISELY CHECKLIST):
- G (Grounds): ${notes ? 'Grounds stated verbally as recorded above.' : 'No clear objective reasonable grounds articulated prior to detention.'}
- O (Object of Search): Stated as stolen articles / prohibited items.
- W (Warrant Card): ${officerName ? 'Identified by officer.' : 'Not verified.'}
- I (Identity): Officer Collar: ${collarNumber || 'Refused / Not given'}.
- S (Station): ${policeStation || 'Not provided at scene'}.
- E (Entitlement): Entitled to copy of search record within 12 months under PACE s.2.
- L (Legal Power): PACE 1984 Section 1 / Misuse of Drugs Act Section 23.
- Y (You are Detained): Citizen informed they were detained for the purpose of a search.

4. IDENTIFIED STATUTORY BREACHES & CONCERNS:
- If clothing removal beyond Jacket, Outer coat, or Gloves (JOG) was demanded in public view, this violates PACE Code A paragraph 3.5.
- Failure to provide an immediate written search record or reference number breaches PACE s.2.

5. RECOMMENDED IMMEDIATE ACTIONS:
- Issue formal Subject Access Request (SAR) and Body-Worn Video (BWV) preservation notice to the Chief Constable of ${policeStation || 'the relevant police force'} within 31 days before automated video deletion.
- Provide this contemporaneous Section 9 statement to your duty solicitor or the Independent Office for Police Conduct (IOPC).

Statement taken and generated contemporaneously via PocketLawyer UK.`;

        return res.json({
          success: true,
          isAiGenerated: false,
          statement: fallbackWriteup,
          extractedSummary: `Incident on ${incidentDate} at ${incidentLocation} involving Officer ${collarNumber || 'Unknown'}.`,
          paceBreaches: [
            'Failure to contemporaneously provide written search record receipt under PACE s.2',
            'Potential lack of objective reasonable suspicion under Code A'
          ],
          dialogueTranscript: transcript || notes || 'Encounter recorded via PocketLawyer HUD'
        });
      }

      // Call Gemini 3.8 Flash to analyze and write up the incident
      const systemPrompt = `You are a senior criminal defense solicitor and legal expert in the law of England and Wales, specializing in the Police and Criminal Evidence Act 1984 (PACE), Code A (Stop and Search), Code C (Detention), and the Criminal Justice Act 1967.
Your task is to take recorded incident evidence (audio, speech transcription, video notes, and incident parameters) and generate a comprehensive, court-admissible legal write-up.`;

      const userPrompt = `INCIDENT DETAILS:
- Date: ${incidentDate}
- Time: ${incidentTime}
- Location: ${incidentLocation}
- Officer Name: ${officerName || 'Unknown / Not stated'}
- Collar/Shoulder Number: ${collarNumber || 'Refused / Not noted'}
- Police Station/Force: ${policeStation || 'Unknown'}
- MediaType: ${mediaType || 'audio/video'}
- Spoken words / Raw Speech transcript captured: "${transcript || 'None available'}"
- Field notes / citizen statement of facts: "${notes || 'Police encounter recorded live on device'}"

GENERATE THE FOLLOWING SECTIONS:
1. EXECUTIVE SUMMARY: Clear overview of the encounter and chronology.
2. RECONSTRUCTED DIALOGUE TRANSCRIPT: Chronological speaker-by-speaker transcript ("Citizen:", "Officer:").
3. PACE 1984 CODE A LEGAL COMPLIANCE AUDIT:
   - Evaluate GOWISELY duties (Grounds, Object, Warrant, Identity, Station, Entitlement to copy, Legal power, You are detained).
   - Evaluate JOG rule (Jacket, Outer coat, Gloves clothing limits in public).
   - Flag any suspected civil liberties violations, unlawful search issues, or unreasonable use of force.
4. FORMAL SECTION 9 WITNESS STATEMENT (Criminal Justice Act 1967, s.9):
   - Include standard court-ready header and declaration of truth:
     "STATEMENT OF WITNESS (Criminal Justice Act 1967, s.9; Magistrates' Courts Act 1980, s.5B; Criminal Procedure Rules, r.16.2)"
     "This statement (consisting of 2 pages each signed by me) is true to the best of my knowledge and belief and I make it knowing that, if it is tendered in evidence, I shall be liable to prosecution if I have wilfully stated in it anything which I know to be false or do not believe to be true."
   - Detailed first-person formal testimony ready for Crown Court / Magistrates' Court / IOPC complaint.
5. RECOMMENDED LEGAL ACTION & PRESERVATION:
   - Body-Worn Video (BWV) 31-day spoliation warning letter wording
   - IOPC / Police Professional Standards Department complaint grounds
   - Civil claim for unlawful imprisonment / trespass to the person if detention lacked reasonable grounds.`;

      let parts: any[] = [];
      if (audioBase64) {
        parts = [
          {
            inlineData: {
              mimeType: mimeType || 'audio/webm',
              data: audioBase64
            }
          },
          { text: userPrompt }
        ];
      } else {
        parts = [{ text: userPrompt }];
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2
        }
      });

      const writeupText = response.text || 'Unable to generate analysis.';

      return res.json({
        success: true,
        isAiGenerated: true,
        statement: writeupText,
        dialogueTranscript: transcript || notes,
        officer: {
          name: officerName,
          collarNumber: collarNumber,
          station: policeStation
        }
      });
    } catch (error: any) {
      console.error('Gemini Incident Analysis Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal server error during incident analysis'
      });
    }
  });

  // AI HMRC Tax Forms & Statutory Appeal Guidance API
  app.post('/api/hmrc/assist', async (req, res) => {
    try {
      const { formType, formData, taxYear, queryType, userQuery } = req.body;

      if (!ai) {
        // Fallback statutory tax guidance when offline or no Gemini API Key
        let guidance = '';
        if (formType === 'PENALTY_APPEAL') {
          guidance = `STATUTORY GROUNDS OF APPEAL UNDER TAXES MANAGEMENT ACT 1970, s.31A & FINANCE ACT 2009, SCH 55:
1. Reasonable Excuse: The taxpayer was prevented from meeting the deadline due to circumstances beyond their control.
2. In accordance with HMRC Compliance Handbook (CH160600) and the Upper Tribunal precedent in Perrin v HMRC [2018] UKUT 156 (TCC), the excuse continued throughout the duration of the default.
3. Once the impediment ceased, the return/payment was remedied without unreasonable delay.
4. HMRC is respectfully requested to cancel the £100 late filing penalty and any daily penalty notices under FA 2009 Sch 55 para 23.`;
        } else if (formType === 'SA105') {
          guidance = `HMRC PROPERTY INCOME MANUAL (PIM) COMPLIANCE AUDIT:
1. Wholly and Exclusively Rule (ITTOIA 2005 s.272): Ensure repair costs represent genuine maintenance/restoration to original condition rather than capital improvement.
2. Section 24 Restriction (Finance (No. 2) Act 2015): Mortgage finance interest for residential lets is restricted to a 20% basic rate tax reducer in Box 44, not deducted against gross rental profits.
3. Property Allowance (£1,000): If total rental turnover is under £1,000, consider the trading and property allowance exemption (ITTOIA 2005 s.783A).`;
        } else {
          guidance = `HMRC STATUTORY COMPLIANCE CHECK FOR ${formType || 'TAX SUBMISSION'}:
1. All figures must reconcile to primary business records and bank statements.
2. Ensure Unique Taxpayer Reference (UTR) and National Insurance numbers match HMRC government gateway records.
3. Keep complete records for a minimum of 5 years after 31 January following the relevant tax year (TMA 1970 s.12B).`;
        }

        return res.json({
          success: true,
          isAiGenerated: false,
          guidance,
          statutoryNotes: ['Taxes Management Act 1970', 'Income Tax (Trading and Other Income) Act 2005']
        });
      }

      const systemPrompt = `You are a Senior Chartered Tax Advisor (CTA) and specialist in UK direct and indirect taxes (HM Revenue & Customs rules, England & Wales, Scotland, and Northern Ireland).
Your expertise spans the Taxes Management Act 1970 (TMA 1970), Income Tax Act 2007 (ITA 2007), ITTOIA 2005, ITEPA 2003, Finance Act 2009, and HMRC Manuals (PIM, BIM, EIM, CH).
Provide precise, court-tested, statutory advice, allowable deduction classifications, and formal appeal wording against HMRC penalty notices.`;

      const prompt = `Form Type: ${formType}
Tax Year: ${taxYear || '2023/24 - 2024/25'}
Request Type: ${queryType || 'compliance_check'}
Form Data / User Details:
${JSON.stringify(formData, null, 2)}
Specific Query / Scenario:
${userQuery || 'Review for statutory compliance, allowable expenses, and legal validity.'}

Provide:
1. STATUTORY COMPLIANCE ASSESSMENT (Cite relevant UK Acts and HMRC manuals).
2. ALLOWABLE DEDUCTIONS & OPTIMISATIONS (distinguishing revenue vs capital expenditure).
3. FORMAL APPEAL OR SUBMISSION DRAFTING (precise wording for HMRC inspectors).
4. CRITICAL TIMELINES & WARNINGS (statutory 30-day appeal limit under TMA 1970 s.31A, etc.).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2
        }
      });

      return res.json({
        success: true,
        isAiGenerated: true,
        guidance: response.text || 'Unable to generate tax review.',
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('HMRC Assist API Error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Tax advisor assistance failed'
      });
    }
  });

  // Serve static files in production or Vite in dev
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PocketLawyer UK server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
