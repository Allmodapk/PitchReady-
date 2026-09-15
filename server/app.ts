import express, { Request, Response, Router } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  saveSubmission,
  getSubmissions,
  saveInterview,
  getInterviews,
  getVettedCandidates,
  getPlacements,
  getStorageStatus,
} from './storage.js';

dotenv.config();

const app = express();
app.use(express.json());

// ==========================================
// GEMINI AI LAZY CLIENT (Strictly Server-Side)
// GEMINI_API_KEY is only ever accessed in this server code.
// Never exposed to client bundles or browser responses.
// ==========================================
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[Gemini] GEMINI_API_KEY not found in environment. Fallback heuristics active.');
    return null;
  }
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build-pitchready',
        },
      },
    });
    return aiClient;
  } catch (err) {
    console.error('[Gemini] Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

// ==========================================
// API ROUTER
// ==========================================
const apiRouter = Router();

// Health & System Status
apiRouter.get('/health', (req: Request, res: Response) => {
  const storageStatus = getStorageStatus();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    pwaReady: true,
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    storage: storageStatus,
  });
});

// Storage Diagnostics endpoint
apiRouter.get('/storage/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    ...getStorageStatus(),
  });
});

// Vetted Candidates Directory
apiRouter.get('/candidates/vetted', (req: Request, res: Response) => {
  try {
    const role = req.query.role as string;
    const city = req.query.city as string;
    const candidates = getVettedCandidates(role, city);
    res.json({ success: true, count: candidates.length, data: candidates });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Submissions (Employer briefs or Candidate registrations)
// Every write persists to external Google Sheets when configured, with local fallback in dev
apiRouter.post('/submissions', async (req: Request, res: Response) => {
  try {
    const { id, type, data, isOffline } = req.body;

    if (!type || !data) {
      return res.status(400).json({ success: false, error: 'Type and data payload are required.' });
    }

    const { record, googleSheetsSync } = await saveSubmission({ id, type, data, isOffline });

    res.status(201).json({
      success: true,
      message: 'Submission successfully recorded.',
      record,
      googleSheetsSync,
    });
  } catch (err: any) {
    console.error('Error in /api/submissions:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get submissions list
apiRouter.get('/submissions', (req: Request, res: Response) => {
  try {
    const data = getSubmissions();
    res.json({ success: true, count: data.length, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Schedule an interview
// Every write persists to external Google Sheets when configured, with local fallback in dev
apiRouter.post('/interviews/schedule', async (req: Request, res: Response) => {
  try {
    const { candidateId, candidateName, companyName, date, time, format } = req.body;

    if (!candidateId || !companyName || !date) {
      return res.status(400).json({
        success: false,
        error: 'candidateId, companyName, and date are required.',
      });
    }

    const { interview, googleSheetsSync } = await saveInterview({
      candidateId,
      candidateName,
      companyName,
      date,
      time,
      format,
    });

    res.status(201).json({
      success: true,
      message: 'Interview booked successfully.',
      interview,
      googleSheetsSync,
    });
  } catch (err: any) {
    console.error('Error in /api/interviews/schedule:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get scheduled interviews
apiRouter.get('/interviews', (req: Request, res: Response) => {
  try {
    const data = getInterviews();
    res.json({ success: true, count: data.length, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Placements list with 45-day guarantee counters
apiRouter.get('/placements', (req: Request, res: Response) => {
  try {
    const data = getPlacements();
    res.json({ success: true, count: data.length, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// GEMINI AI FEATURES (Server-Side Only)
// ==========================================

// 1. AI Job Brief & Competency Calibrator
apiRouter.post('/ai/calibrate-brief', async (req: Request, res: Response) => {
  const { roleNeeded, targetIndustry, companyDetails, targetVolume, city } = req.body;

  const prompt = `You are the Chief Sales Talent Assessor at PitchReady, specializing in hiring high-performing sales professionals (BDE, BDM, Junior Sales) in India.
Calibrate this hiring brief into a structured sales competency framework:
- Role: ${roleNeeded || 'BDE'}
- Target Industry: ${targetIndustry || 'Technology / Services'}
- Company Details: ${companyDetails || 'Fast growing enterprise'}
- Hiring Volume: ${targetVolume || '2-3'}
- Location: ${city || 'Kochi / Regional hub'}

Return a clean JSON object with this exact structure:
{
  "calibratedTitle": string,
  "dailyTargetOutreach": string,
  "idealSalesPersona": string,
  "topObjectionsToTest": [string, string, string],
  "criticalAssessmentCriteria": [string, string, string],
  "recommendedCtcBand": string,
  "rampUpTimelineDays": number,
  "suggestedInterviewQuestions": [
    { "question": string, "goodAnswerIndicator": string }
  ]
}
Output only valid JSON.`;

  try {
    const ai = getAI();
    if (!ai) {
      return res.json({
        success: true,
        isFallback: true,
        data: {
          calibratedTitle: `${roleNeeded || 'BDE'} - ${targetIndustry || 'Tech/SaaS'} Outbound Specialist`,
          dailyTargetOutreach: '45–60 cold dials or 20 qualified LinkedIn/Email touches',
          idealSalesPersona: 'High grit, high coachability, comfortable with consultative rejection and immediate value pivot.',
          topObjectionsToTest: [
            '"We already have an existing vendor for this."',
            '"Just email your proposal and brochure."',
            '"We have zero budget approved for this quarter."',
          ],
          criticalAssessmentCriteria: [
            'Verbal pacing & tone control under immediate pushback',
            'Structured discovery questioning vs feature dumping',
            'Closing with a definitive next calendar step',
          ],
          recommendedCtcBand: roleNeeded?.includes('BDM') ? '₹6.0L – ₹8.5L' : '₹3.6L – ₹4.8L',
          rampUpTimelineDays: 14,
          suggestedInterviewQuestions: [
            {
              question: 'In your first 30 seconds of a cold call, how do you earn the prospect's permission to speak?',
              goodAnswerIndicator: 'States relevant industry context or common bottleneck rather than launching straight into a pitch.',
            },
            {
              question: 'When a prospect says "Send me an email", what is your immediate reply?',
              goodAnswerIndicator: 'Validates their time, asks 1 qualifying question about what specific metric they care about before agreeing to send.',
            },
          ],
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, isFallback: false, data: parsed });
  } catch (err: any) {
    console.warn('Gemini brief calibration warning (using calibrated fallback):', err.message);
    res.json({
      success: true,
      isFallback: true,
      data: {
        calibratedTitle: `${roleNeeded || 'BDE'} - ${targetIndustry || 'Tech/SaaS'} Outbound Specialist`,
        dailyTargetOutreach: '45–60 cold dials or 20 qualified LinkedIn/Email touches',
        idealSalesPersona: 'High grit, high coachability, comfortable with consultative rejection and immediate value pivot.',
        topObjectionsToTest: [
          '"We already have an existing vendor for this."',
          '"Just email your proposal and brochure."',
          '"We have zero budget approved for this quarter."',
        ],
        criticalAssessmentCriteria: [
          'Verbal pacing & tone control under immediate pushback',
          'Structured discovery questioning vs feature dumping',
          'Closing with a definitive next calendar step',
        ],
        recommendedCtcBand: roleNeeded?.includes('BDM') ? '₹6.0L – ₹8.5L' : '₹3.6L – ₹4.8L',
        rampUpTimelineDays: 14,
        suggestedInterviewQuestions: [
          {
            question: 'In your first 30 seconds of a cold call, how do you earn the prospect's permission to speak?',
            goodAnswerIndicator: 'States relevant industry context or common bottleneck rather than launching straight into a pitch.',
          },
          {
            question: 'When a prospect says "Send me an email", what is your immediate reply?',
            goodAnswerIndicator: 'Validates their time, asks 1 qualifying question about what specific metric they care about before agreeing to send.',
          },
        ],
      },
    });
  }
});

// 2. Predictive Fit & Readiness Scorecard
apiRouter.post('/ai/candidate-scorecard', async (req: Request, res: Response) => {
  const { candidateId, employerRequirement } = req.body;

  const candidates = getVettedCandidates();
  const candidate = candidates.find((c: any) => c.id === candidateId) || candidates[0];

  const prompt = `You are PitchReady's Lead Evaluator. Analyze candidate fit for an employer's requirement:
Candidate:
- Name: ${candidate?.name}
- Role: ${candidate?.role}
- Experience: ${candidate?.experience}
- Evaluated Skills: ${candidate?.skills?.join(', ')}
- Assessment Scores: ${JSON.stringify(candidate?.assessmentScores)}
- Evaluator Notes: ${candidate?.evaluatorNotes}

Employer Need:
"${employerRequirement || 'High growth B2B sales development representative for outbound cold calling in South India'}"

Provide a JSON object with:
{
  "fitScore": number (0-100),
  "summary": string,
  "strengths": [string, string],
  "watchpoints": [string],
  "expectedQuotaAttainmentRate": string,
  "hiringRecommendation": "Strongly Recommended" | "Recommended" | "Moderate Fit"
}
Output only valid JSON.`;

  try {
    const ai = getAI();
    if (!ai) {
      return res.json({
        success: true,
        isFallback: true,
        data: {
          fitScore: candidate?.overallScore || 93,
          summary: `${candidate?.name || 'Candidate'} shows high alignment with outbound velocity requirements, scoring exceptionally in structured objection handling.`,
          strengths: [
            'Demonstrated 95%+ proficiency in handling "already have a vendor" pivots',
            'Strong verbal clarity and assertive closing rhythm',
          ],
          watchpoints: [
            'May require 1-2 days of training on specialized company pricing matrix',
          ],
          expectedQuotaAttainmentRate: '85%–115% by month 2',
          hiringRecommendation: 'Strongly Recommended',
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, isFallback: false, data: parsed });
  } catch (err: any) {
    console.warn('Gemini candidate scorecard warning (using evaluated fallback):', err.message);
    res.json({
      success: true,
      isFallback: true,
      data: {
        fitScore: candidate?.overallScore || 93,
        summary: `${candidate?.name || 'Candidate'} shows high alignment with outbound velocity requirements, scoring exceptionally in structured objection handling.`,
        strengths: [
          'Demonstrated 95%+ proficiency in handling "already have a vendor" pivots',
          'Strong verbal clarity and assertive closing rhythm',
        ],
        watchpoints: [
          'May require 1-2 days of training on specialized company pricing matrix',
        ],
        expectedQuotaAttainmentRate: '85%–115% by month 2',
        hiringRecommendation: 'Strongly Recommended',
      },
    });
  }
});

// 3. Retention & Replacement Risk Modeling
apiRouter.post('/ai/retention-risk', async (req: Request, res: Response) => {
  const { roleType, city, fixedPay, variablePercentage, expectedCallsPerDay } = req.body;

  const prompt = `Analyze the retention and replacement risk for a sales placement under PitchReady's 45-day 2x replacement guarantee:
Role: ${roleType || 'BDE'}
City: ${city || 'Kochi'}
Fixed Pay: ${fixedPay || '₹25,000/mo'}
Variable Component: ${variablePercentage || '30%'}
Expected Daily Outbound Volume: ${expectedCallsPerDay || '50 dials'}

Evaluate probability of candidate turnover within 45 days and calculate risk under the 2x replacement guarantee.
Output JSON:
{
  "riskLevel": "Low" | "Moderate" | "Elevated",
  "probabilityOfGuaranteeTrigger": string,
  "retentionScore": number (0-100),
  "primaryRiskFactors": [string, string],
  "mitigationStrategies": [string, string],
  "pitchReadyGuaranteeCoverage": "Full 45-Day 2x Replacement Guaranteed"
}`;

  try {
    const ai = getAI();
    if (!ai) {
      return res.json({
        success: true,
        isFallback: true,
        data: {
          riskLevel: 'Low',
          probabilityOfGuaranteeTrigger: '< 4.2%',
          retentionScore: 92,
          primaryRiskFactors: [
            'Slight variance between fixed pay expectations in metro vs non-metro',
            'High target volume requires clear day-1 lead lists to prevent early burnout',
          ],
          mitigationStrategies: [
            'Provide structured ramp-up targets: 25 calls week 1, 40 calls week 2, 50 calls week 3',
            'Schedule weekly 15-minute pitch coaching check-ins during first month',
          ],
          pitchReadyGuaranteeCoverage: 'Full 45-Day 2x Replacement Guaranteed',
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, isFallback: false, data: parsed });
  } catch (err: any) {
    console.warn('Gemini retention risk warning (using modeled fallback):', err.message);
    res.json({
      success: true,
      isFallback: true,
      data: {
        riskLevel: 'Low',
        probabilityOfGuaranteeTrigger: '< 4.2%',
        retentionScore: 92,
        primaryRiskFactors: [
          'Slight variance between fixed pay expectations in metro vs non-metro',
          'High target volume requires clear day-1 lead lists to prevent early burnout',
        ],
        mitigationStrategies: [
          'Provide structured ramp-up targets: 25 calls week 1, 40 calls week 2, 50 calls week 3',
          'Schedule weekly 15-minute pitch coaching check-ins during first month',
        ],
        pitchReadyGuaranteeCoverage: 'Full 45-Day 2x Replacement Guaranteed',
      },
    });
  }
});

// Mount router on both /api and / so it functions seamlessly whether path is /api/submissions or rewritten
app.use('/api', apiRouter);
app.use(apiRouter);

// Explicit PWA file endpoints
app.get(['/manifest.json', '/manifest.webmanifest'], (req: Request, res: Response) => {
  const manifestPath = path.resolve('public', 'manifest.webmanifest');
  if (fs.existsSync(manifestPath)) {
    res.setHeader('Content-Type', 'application/manifest+json');
    res.setHeader('Cache-Control', 'no-cache');
    return res.sendFile(manifestPath);
  }
  res.status(404).send('Manifest not found');
});

app.get('/sw.js', (req: Request, res: Response) => {
  const swPath = path.resolve('public', 'sw.js');
  if (fs.existsSync(swPath)) {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Service-Worker-Allowed', '/');
    return res.sendFile(swPath);
  }
  res.status(404).send('Service worker not found');
});

export default app;
