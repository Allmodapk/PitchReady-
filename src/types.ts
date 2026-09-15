export type AppMode = 'employer' | 'candidate';
export type AppTab = 'overview' | 'employer-portal' | 'candidate-portal' | 'guarantee';

export interface EmployerFormData {
  companyName: string;
  contactPerson: string;
  empPhone: string;
  empEmail: string;
  empCity: string;
  roleNeeded: string;
  openings: string;
  hiringTimeline: string;
}

export interface CandidateFormData {
  name: string;
  candPhone: string;
  candEmail: string;
  candCity: string;
  experienceLevel: string;
  currentRole: string;
  whySales: string;
  availability: string;
}

export interface SubmissionRecord {
  id: string;
  type: AppMode;
  timestamp: string;
  isOffline: boolean;
  status?: string;
  data: EmployerFormData | CandidateFormData;
}

export interface VettedCandidate {
  id: string;
  name: string;
  role: string;
  experience: string;
  city: string;
  overallScore: number;
  assessmentScores: {
    coldOutreach: number;
    objectionHandling: number;
    clarityAndDiction: number;
    coachability: number;
  };
  skills: string[];
  languages: string[];
  availability: string;
  expectedCtc: string;
  audioPitchUrl?: string;
  audioPitchDuration?: string;
  evaluatorNotes: string;
  status: string;
}

export interface PlacementRecord {
  id: string;
  company: string;
  candidateName: string;
  role: string;
  joinedDate: string;
  guaranteeDaysTotal: number;
  daysElapsed: number;
  daysRemaining: number;
  replacementsUsed: number;
  maxReplacements: number;
  status: string;
  feePaid: string;
}

export interface ScheduledInterview {
  id: string;
  candidateId: string;
  candidateName: string;
  companyName: string;
  date: string;
  time: string;
  format: string;
  status: string;
}

export interface CalibratedBriefResult {
  calibratedTitle: string;
  dailyTargetOutreach: string;
  idealSalesPersona: string;
  topObjectionsToTest: string[];
  criticalAssessmentCriteria: string[];
  recommendedCtcBand: string;
  rampUpTimelineDays: number;
  suggestedInterviewQuestions: {
    question: string;
    goodAnswerIndicator: string;
  }[];
}

export interface CandidateScorecardResult {
  fitScore: number;
  summary: string;
  strengths: string[];
  watchpoints: string[];
  expectedQuotaAttainmentRate: string;
  hiringRecommendation: 'Strongly Recommended' | 'Recommended' | 'Moderate Fit';
}

export interface RetentionRiskResult {
  riskLevel: 'Low' | 'Moderate' | 'Elevated';
  probabilityOfGuaranteeTrigger: string;
  retentionScore: number;
  primaryRiskFactors: string[];
  mitigationStrategies: string[];
  pitchReadyGuaranteeCoverage: string;
}

export interface ProcessStep {
  num: string;
  title: string;
  desc: string;
}
