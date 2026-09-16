import fs from 'fs';
import path from 'path';

// ==========================================
// SEED DATA
// Clean, empty starting state — no demo/placeholder records.
// Real data is created through the app (submissions, interviews)
// or added by you via the admin panel (vetted candidates, placements).
// ==========================================
export const DEMO_SEED_DATA = {
  submissions: [] as any[],
  vettedCandidates: [] as any[],
  placements: [] as any[],
  scheduledInterviews: [] as any[],
};

// In-memory active store initialized with clean seed data
let memoryStore = JSON.parse(JSON.stringify(DEMO_SEED_DATA));

// Environment detection
export function getGoogleSheetsWebhookUrl(): string | null {
  return (
    process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
    process.env.GOOGLE_SHEET_WEBHOOK_URL ||
    process.env.SHEETS_SYNC_URL ||
    null
  );
}

export function isServerlessEnvironment(): boolean {
  return !!process.env.VERCEL || process.env.NODE_ENV === 'production';
}

const localDbPath = path.resolve('data', 'db.json');

// Local-dev fallback initialization
function initLocalDevFallback() {
  if (isServerlessEnvironment()) {
    // In serverless / Vercel, root filesystem writes are not supported
    return;
  }
  try {
    const dataDir = path.resolve('data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(localDbPath)) {
      fs.writeFileSync(localDbPath, JSON.stringify(DEMO_SEED_DATA, null, 2), 'utf-8');
    } else {
      const raw = fs.readFileSync(localDbPath, 'utf-8');
      const parsed = JSON.parse(raw);
      memoryStore = { ...DEMO_SEED_DATA, ...parsed };
    }
  } catch (err) {
    console.warn('[Storage] Local file read warning, using memory seed:', err);
  }
}

initLocalDevFallback();

/**
 * Persists a payload to the external Google Sheets sync webhook.
 * Standard form-to-Sheets lead capture pattern used by Google Apps Script / webhooks.
 */
export async function syncToGoogleSheets(payload: {
  action: 'submission' | 'schedule_interview' | 'update_status';
  sheet: 'Submissions' | 'Interviews' | 'Placements';
  [key: string]: any;
}): Promise<{ success: boolean; error?: string; externalResponse?: any }> {
  const webhookUrl = getGoogleSheetsWebhookUrl();
  if (!webhookUrl) {
    return {
      success: false,
      error: 'GOOGLE_SHEETS_WEBHOOK_URL not configured in environment',
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    let externalResponse: any = null;
    try {
      const text = await res.text();
      try {
        externalResponse = JSON.parse(text);
      } catch {
        externalResponse = { raw: text };
      }
    } catch {
      // Ignored
    }

    if (!res.ok && res.status !== 302) {
      console.warn(`[Google Sheets Sync] Webhook responded with HTTP ${res.status}`);
      return {
        success: false,
        error: `HTTP ${res.status} from Google Sheets webhook`,
        externalResponse,
      };
    }

    console.log(`[Google Sheets Sync] Successfully synced record (${payload.sheet}:${payload.id || payload.action})`);
    return { success: true, externalResponse };
  } catch (err: any) {
    console.warn('[Google Sheets Sync] Network error syncing to Google Sheets webhook:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Save a new submission (Employer intake brief or Candidate registration).
 * Persists immediately to Google Sheets when configured, with local file fallback in dev.
 */
export async function saveSubmission(submission: {
  id?: string;
  type: string;
  data: any;
  isOffline?: boolean;
}): Promise<{ record: any; googleSheetsSync: { success: boolean; error?: string } }> {
  const id = submission.id || `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record = {
    id,
    type: submission.type,
    timestamp: new Date().toISOString(),
    isOffline: !!submission.isOffline,
    data: submission.data,
    status: submission.type === 'employer' ? 'Shortlisting' : 'Assessment Scheduled',
  };

  // 1. Update in-memory state
  const existingIdx = memoryStore.submissions.findIndex((s: any) => s.id === id);
  if (existingIdx >= 0) {
    memoryStore.submissions[existingIdx] = record;
  } else {
    memoryStore.submissions.unshift(record);
  }

  // 2. Local-dev fallback file persistence (only active in non-production, non-serverless dev)
  const webhookUrl = getGoogleSheetsWebhookUrl();
  if (!isServerlessEnvironment() && !webhookUrl) {
    try {
      fs.writeFileSync(localDbPath, JSON.stringify(memoryStore, null, 2), 'utf-8');
      console.log(`[Storage] Saved submission ${id} to local-dev fallback file (${localDbPath})`);
    } catch (err) {
      console.warn('[Storage] Local dev file write warning:', err);
    }
  }

  // 3. Persistent External Google Sheets sync
  // Flatten columns so standard Google Sheets / Google Apps Script lead capture can insert directly into columns
  const flatFields: Record<string, any> = {};
  if (record.type === 'employer' && record.data) {
    flatFields.companyName = record.data.companyName || '';
    flatFields.contactPerson = record.data.contactPerson || '';
    flatFields.phone = record.data.empPhone || '';
    flatFields.email = record.data.empEmail || '';
    flatFields.city = record.data.empCity || '';
    flatFields.roleNeeded = record.data.roleNeeded || '';
    flatFields.openings = record.data.openings || '';
    flatFields.hiringTimeline = record.data.hiringTimeline || '';
  } else if (record.type === 'candidate' && record.data) {
    flatFields.candidateName = record.data.candName || '';
    flatFields.phone = record.data.candPhone || '';
    flatFields.email = record.data.candEmail || '';
    flatFields.city = record.data.candCity || '';
    flatFields.targetRole = record.data.candRole || '';
    flatFields.experience = record.data.experience || '';
    flatFields.skills = Array.isArray(record.data.skills) ? record.data.skills.join(', ') : record.data.skills || '';
  }

  const sheetsPayload = {
    action: 'submission' as const,
    sheet: 'Submissions' as const,
    id: record.id,
    type: record.type,
    timestamp: record.timestamp,
    status: record.status,
    isOffline: record.isOffline,
    ...flatFields,
    rawJson: JSON.stringify(record.data),
    source: 'PitchReady Web App',
  };

  const syncResult = await syncToGoogleSheets(sheetsPayload);

  return {
    record,
    googleSheetsSync: syncResult,
  };
}

/**
 * Retrieve all submissions.
 */
export function getSubmissions(): any[] {
  return memoryStore.submissions || [];
}

/**
 * Schedule an interview.
 * Persists immediately to Google Sheets when configured, with local file fallback in dev.
 */
export async function saveInterview(interview: {
  candidateId: string;
  candidateName: string;
  companyName: string;
  date: string;
  time?: string;
  format?: string;
}): Promise<{ interview: any; googleSheetsSync: { success: boolean; error?: string } }> {
  const id = `int_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const record = {
    id,
    candidateId: interview.candidateId,
    candidateName: interview.candidateName || 'Candidate',
    companyName: interview.companyName,
    date: interview.date,
    time: interview.time || '11:00 AM IST',
    format: interview.format || 'Google Meet / Video',
    status: 'Confirmed',
    created: new Date().toISOString(),
  };

  // 1. Update in-memory state
  if (!memoryStore.scheduledInterviews) {
    memoryStore.scheduledInterviews = [];
  }
  memoryStore.scheduledInterviews.unshift(record);

  // 2. Local-dev fallback file persistence
  const webhookUrl = getGoogleSheetsWebhookUrl();
  if (!isServerlessEnvironment() && !webhookUrl) {
    try {
      fs.writeFileSync(localDbPath, JSON.stringify(memoryStore, null, 2), 'utf-8');
      console.log(`[Storage] Saved interview ${id} to local-dev fallback file (${localDbPath})`);
    } catch (err) {
      console.warn('[Storage] Local dev file write warning:', err);
    }
  }

  // 3. Persistent External Google Sheets sync
  const sheetsPayload = {
    action: 'schedule_interview' as const,
    sheet: 'Interviews' as const,
    id: record.id,
    candidateId: record.candidateId,
    candidateName: record.candidateName,
    companyName: record.companyName,
    interviewDate: record.date,
    interviewTime: record.time,
    meetingFormat: record.format,
    status: record.status,
    timestamp: record.created,
    source: 'PitchReady Web App',
  };

  const syncResult = await syncToGoogleSheets(sheetsPayload);

  return {
    interview: record,
    googleSheetsSync: syncResult,
  };
}

/**
 * Retrieve all scheduled interviews.
 */
export function getInterviews(): any[] {
  return memoryStore.scheduledInterviews || [];
}

/**
 * Retrieve vetted candidates with optional filtering.
 */
export function getVettedCandidates(filterRole?: string, filterCity?: string): any[] {
  let list = memoryStore.vettedCandidates || [];
  if (filterRole && filterRole !== 'all') {
    list = list.filter((c: any) =>
      c.role?.toLowerCase().includes(filterRole.toLowerCase())
    );
  }
  if (filterCity && filterCity !== 'all') {
    list = list.filter((c: any) =>
      c.city?.toLowerCase().includes(filterCity.toLowerCase())
    );
  }
  return list;
}

/**
 * Retrieve active placements and guarantee statuses.
 */
export function getPlacements(): any[] {
  return memoryStore.placements || [];
}

/**
 * Returns current storage diagnostic status.
 */
export function getStorageStatus() {
  const webhookConfigured = !!getGoogleSheetsWebhookUrl();
  const serverless = isServerlessEnvironment();

  return {
    storageType: webhookConfigured
      ? 'Google Sheets Persistent Sync'
      : serverless
      ? 'Serverless Ephemeral Memory (Awaiting GOOGLE_SHEETS_WEBHOOK_URL)'
      : 'Local Dev File Fallback (data/db.json)',
    isGoogleSheetsConfigured: webhookConfigured,
    isServerless: serverless,
    recordsSummary: {
      submissionsCount: memoryStore.submissions?.length || 0,
      interviewsCount: memoryStore.scheduledInterviews?.length || 0,
      candidatesCount: memoryStore.vettedCandidates?.length || 0,
      placementsCount: memoryStore.placements?.length || 0,
    },
    webhookDocumentation:
      'Set GOOGLE_SHEETS_WEBHOOK_URL in environment variables to persist all submissions and interview bookings to your Google Sheet.',
  };
}
