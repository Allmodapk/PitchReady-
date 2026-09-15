import {
  VettedCandidate,
  SubmissionRecord,
  PlacementRecord,
  ScheduledInterview,
  CalibratedBriefResult,
  CandidateScorecardResult,
  RetentionRiskResult,
  AppMode,
} from '../types';

export async function getVettedCandidates(
  role: string = 'all',
  city: string = 'all'
): Promise<VettedCandidate[]> {
  try {
    const res = await fetch(`/api/candidates/vetted?role=${encodeURIComponent(role)}&city=${encodeURIComponent(city)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.warn('API error fetching vetted candidates, using fallback cache:', err);
    return [];
  }
}

export async function submitInquiry(payload: {
  id?: string;
  type: AppMode;
  data: any;
  isOffline?: boolean;
}): Promise<{ success: boolean; record?: SubmissionRecord; error?: string }> {
  try {
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json;
  } catch (err: any) {
    console.warn('Network error during submission:', err);
    return { success: false, error: err.message || 'Offline' };
  }
}

export async function getSubmissions(): Promise<SubmissionRecord[]> {
  try {
    const res = await fetch('/api/submissions');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.warn('Could not fetch submissions from server:', err);
    return [];
  }
}

export async function bookInterview(payload: {
  candidateId: string;
  candidateName: string;
  companyName: string;
  date: string;
  time: string;
  format?: string;
}): Promise<{ success: boolean; interview?: ScheduledInterview; error?: string }> {
  try {
    const res = await fetch('/api/interviews/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getPlacements(): Promise<PlacementRecord[]> {
  try {
    const res = await fetch('/api/placements');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.warn('Could not fetch placements:', err);
    return [];
  }
}

export async function calibrateBriefWithAI(payload: {
  roleNeeded: string;
  targetIndustry: string;
  companyDetails: string;
  targetVolume: string;
  city: string;
}): Promise<{ success: boolean; isFallback?: boolean; data?: CalibratedBriefResult; error?: string }> {
  try {
    const res = await fetch('/api/ai/calibrate-brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getCandidateScorecardWithAI(
  candidateId: string,
  employerRequirement: string
): Promise<{ success: boolean; isFallback?: boolean; data?: CandidateScorecardResult; error?: string }> {
  try {
    const res = await fetch('/api/ai/candidate-scorecard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateId, employerRequirement }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getRetentionRiskWithAI(payload: {
  roleType: string;
  city: string;
  fixedPay: string;
  variablePercentage: string;
  expectedCallsPerDay: string;
}): Promise<{ success: boolean; isFallback?: boolean; data?: RetentionRiskResult; error?: string }> {
  try {
    const res = await fetch('/api/ai/retention-risk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// Background offline sync service
export async function syncOfflineQueue(): Promise<number> {
  try {
    const raw = localStorage.getItem('pitchready_submissions');
    if (!raw) return 0;
    const items: SubmissionRecord[] = JSON.parse(raw);
    const offlineItems = items.filter((item) => item.isOffline);

    let syncedCount = 0;
    for (const item of offlineItems) {
      const res = await submitInquiry({
        id: item.id,
        type: item.type,
        data: item.data,
        isOffline: false,
      });
      if (res.success) {
        item.isOffline = false;
        syncedCount++;
      }
    }

    localStorage.setItem('pitchready_submissions', JSON.stringify(items));
    return syncedCount;
  } catch (err) {
    console.warn('Offline sync error:', err);
    return 0;
  }
}
