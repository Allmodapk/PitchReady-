import React, { useState, useEffect } from 'react';
import {
  VettedCandidate,
  CalibratedBriefResult,
  CandidateScorecardResult,
  RetentionRiskResult,
  ScheduledInterview,
  PlacementRecord,
} from '../types';
import {
  getVettedCandidates,
  calibrateBriefWithAI,
  getCandidateScorecardWithAI,
  getRetentionRiskWithAI,
  bookInterview,
  getPlacements,
} from '../lib/api';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Volume2,
  VolumeX,
  Building2,
  PhoneCall,
  Target,
  AlertTriangle,
  Award,
  ChevronRight,
  Filter,
  Check,
  Zap,
} from 'lucide-react';

export const EmployerPortal: React.FC = () => {
  // Tabs within Employer Portal
  const [activeTab, setActiveTab] = useState<'talent' | 'calibrator' | 'guarantee' | 'risk'>('talent');

  // Vetted Talent State
  const [candidates, setCandidates] = useState<VettedCandidate[]>([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState<VettedCandidate | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  // AI Fit Scorecard State
  const [employerRequirementText, setEmployerRequirementText] = useState('Outbound cold-calling BDE for B2B tech/logistics in Kerala');
  const [scorecardLoading, setScorecardLoading] = useState(false);
  const [scorecardResult, setScorecardResult] = useState<CandidateScorecardResult | null>(null);

  // Interview Booking State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingCandidate, setBookingCandidate] = useState<VettedCandidate | null>(null);
  const [companyNameInput, setCompanyNameInput] = useState('My Company');
  const [interviewDate, setInterviewDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [interviewTime, setInterviewTime] = useState('11:00 AM IST');
  const [interviewFormat, setInterviewFormat] = useState('Google Meet (Video)');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // AI Calibrator State
  const [calibratorForm, setCalibratorForm] = useState({
    roleNeeded: 'BDE',
    targetIndustry: 'B2B Logistics & SaaS',
    companyDetails: 'Growing services enterprise in Kochi',
    targetVolume: '2-3 executives',
    city: 'Kochi',
  });
  const [calibratorLoading, setCalibratorLoading] = useState(false);
  const [calibratorResult, setCalibratorResult] = useState<CalibratedBriefResult | null>(null);

  // AI Retention Risk State
  const [riskForm, setRiskForm] = useState({
    roleType: 'BDE',
    city: 'Kochi',
    fixedPay: '₹28,000/mo',
    variablePercentage: '30%',
    expectedCallsPerDay: '50 calls/day',
  });
  const [riskLoading, setRiskLoading] = useState(false);
  const [riskResult, setRiskResult] = useState<RetentionRiskResult | null>(null);

  // Placements & Guarantee State
  const [placements, setPlacements] = useState<PlacementRecord[]>([]);

  useEffect(() => {
    loadCandidates();
    loadPlacements();
  }, [roleFilter, cityFilter]);

  const loadCandidates = async () => {
    const list = await getVettedCandidates(roleFilter, cityFilter);
    setCandidates(list);
    if (list.length > 0 && !selectedCandidate) {
      setSelectedCandidate(list[0]);
    }
  };

  const loadPlacements = async () => {
    const data = await getPlacements();
    setPlacements(data);
  };

  const handleRunScorecard = async (candidate: VettedCandidate) => {
    setScorecardLoading(true);
    setScorecardResult(null);
    const res = await getCandidateScorecardWithAI(candidate.id, employerRequirementText);
    if (res.success && res.data) {
      setScorecardResult(res.data);
    }
    setScorecardLoading(false);
  };

  const handleCalibrateBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalibratorLoading(true);
    const res = await calibrateBriefWithAI(calibratorForm);
    if (res.success && res.data) {
      setCalibratorResult(res.data);
    }
    setCalibratorLoading(false);
  };

  const handleRunRiskModel = async (e: React.FormEvent) => {
    e.preventDefault();
    setRiskLoading(true);
    const res = await getRetentionRiskWithAI(riskForm);
    if (res.success && res.data) {
      setRiskResult(res.data);
    }
    setRiskLoading(false);
  };

  const handleScheduleInterviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingCandidate) return;

    const res = await bookInterview({
      candidateId: bookingCandidate.id,
      candidateName: bookingCandidate.name,
      companyName: companyNameInput,
      date: interviewDate,
      time: interviewTime,
      format: interviewFormat,
    });

    if (res.success) {
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setBookingModalOpen(false);
      }, 1500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#173d34] to-[#1e4e42] rounded-3xl p-6 sm:p-8 text-white shadow-md mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-[#d9b77d] font-medium mb-3">
              <ShieldCheck className="w-4 h-4 text-[#d9b77d]" />
              Enterprise Employer Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
              Pre-Vetted Sales Talent &amp; Guaranteed Placements
            </h1>
            <p className="text-white/80 text-sm mt-2 max-w-2xl leading-relaxed">
              Every candidate below has completed rigorous verbal pitch diagnostics and objection-handling simulations.
              Covered by PitchReady's 45-day 2x replacement guarantee.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <div className="bg-white/10 border border-white/15 px-4 py-2.5 rounded-2xl text-center">
              <div className="text-xs text-white/70">Replacement Guarantee</div>
              <div className="text-lg font-bold text-[#d9b77d]">45 Days (2x)</div>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2.5 rounded-2xl text-center">
              <div className="text-xs text-white/70">Flat Fee on Joining</div>
              <div className="text-lg font-bold text-white">₹8k – ₹12k</div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/15">
          <button
            onClick={() => setActiveTab('talent')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'talent'
                ? 'bg-white text-[#173d34] shadow-sm'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            Vetted Talent Pool ({candidates.length})
          </button>
          <button
            onClick={() => setActiveTab('calibrator')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'calibrator'
                ? 'bg-white text-[#173d34] shadow-sm'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#b48643]" />
            AI Brief Calibrator
          </button>
          <button
            onClick={() => setActiveTab('risk')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'risk'
                ? 'bg-white text-[#173d34] shadow-sm'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#b48643]" />
            AI Retention Risk Modeler
          </button>
          <button
            onClick={() => setActiveTab('guarantee')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'guarantee'
                ? 'bg-white text-[#173d34] shadow-sm'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            Active Placements &amp; Guarantee Tracker ({placements.length})
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: VETTED TALENT POOL & SCORECARD */}
      {/* ======================================================== */}
      {activeTab === 'talent' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-[#f0ece1] border border-[#d9d5c9] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#173d34]">
              <Filter className="w-4 h-4 text-[#b48643]" />
              <span>Filter Verified Candidates:</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-white border border-[#d9d5c9] rounded-xl px-3 py-1.5 text-xs text-[#173d34] font-medium outline-none focus:border-[#173d34]"
              >
                <option value="all">All Roles</option>
                <option value="BDE">BDE / Outbound</option>
                <option value="BDM">BDM / Senior Closer</option>
                <option value="Junior">Entry / Fresher</option>
              </select>

              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="bg-white border border-[#d9d5c9] rounded-xl px-3 py-1.5 text-xs text-[#173d34] font-medium outline-none focus:border-[#173d34]"
              >
                <option value="all">All Locations</option>
                <option value="Kochi">Kochi</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Trivandrum">Trivandrum</option>
                <option value="Kozhikode">Kozhikode</option>
              </select>
            </div>
          </div>

          {/* Candidate Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {candidates.map((cand) => (
              <div
                key={cand.id}
                className="bg-white border border-[#d9d5c9] rounded-2xl p-5 shadow-xs hover:border-[#173d34]/40 transition flex flex-col justify-between"
              >
                <div>
                  {/* Top line: Name, Role, Score */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg font-bold text-[#173d34]">{cand.name}</h3>
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                          Verified
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#b48643] mt-0.5">{cand.role}</p>
                      <p className="text-xs text-[#68736e]">{cand.experience} • {cand.city}</p>
                    </div>

                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 bg-[#173d34] text-white px-2.5 py-1 rounded-xl text-xs font-bold shadow-xs">
                        <Award className="w-3.5 h-3.5 text-[#d9b77d]" />
                        <span>{cand.overallScore}/100</span>
                      </div>
                      <div className="text-[10px] text-[#68736e] mt-1 font-medium">{cand.availability}</div>
                    </div>
                  </div>

                  {/* Verbal Pitch Mock Player */}
                  <div className="mt-4 bg-[#f7f4ec] border border-[#d9d5c9] p-3 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setIsPlayingAudio(isPlayingAudio === cand.id ? null : cand.id)
                        }
                        className="w-8 h-8 rounded-full bg-[#173d34] text-white flex items-center justify-center hover:bg-[#0d2a24] transition shadow-xs shrink-0"
                      >
                        {isPlayingAudio === cand.id ? (
                          <VolumeX className="w-4 h-4 text-[#d9b77d]" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-[#d9b77d]" />
                        )}
                      </button>
                      <div>
                        <div className="text-xs font-bold text-[#173d34]">
                          {isPlayingAudio === cand.id ? 'Simulating Audio Pitch...' : 'Verified Cold Call Audio Pitch'}
                        </div>
                        <div className="text-[11px] text-[#68736e]">
                          {cand.audioPitchDuration} • Assessed on 30s pattern interrupt
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-[#173d34] bg-white px-2 py-0.5 rounded border border-[#d9d5c9]">
                      Expected: {cand.expectedCtc}
                    </span>
                  </div>

                  {/* Diagnostic Scores */}
                  <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#faf8f5] p-2 rounded-lg border border-[#e5e1d5]">
                      <span className="text-[#68736e] text-[11px] block">Cold Outreach:</span>
                      <span className="font-bold text-[#173d34]">
                        {cand.assessmentScores.coldOutreach}%
                      </span>
                    </div>
                    <div className="bg-[#faf8f5] p-2 rounded-lg border border-[#e5e1d5]">
                      <span className="text-[#68736e] text-[11px] block">Objection Pivot:</span>
                      <span className="font-bold text-[#173d34]">
                        {cand.assessmentScores.objectionHandling}%
                      </span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {cand.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium bg-[#eee9dc] text-[#173d34] px-2 py-0.5 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Evaluator notes */}
                  <div className="mt-3 text-xs text-[#525f5a] bg-[#faf8f5] p-2.5 rounded-xl border border-[#e5e1d5] italic">
                    "{cand.evaluatorNotes}"
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-[#d9d5c9] flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedCandidate(cand);
                      handleRunScorecard(cand);
                    }}
                    className="text-xs font-semibold text-[#173d34] hover:text-[#b48643] flex items-center gap-1 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#b48643]" />
                    <span>Run AI Fit Scorecard</span>
                  </button>

                  <button
                    onClick={() => {
                      setBookingCandidate(cand);
                      setBookingModalOpen(true);
                    }}
                    className="bg-[#173d34] hover:bg-[#0d2a24] text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-xs"
                  >
                    Schedule Interview
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* AI Fit Scorecard Modal / Panel */}
          {selectedCandidate && (scorecardLoading || scorecardResult) && (
            <div className="bg-[#fcfaf6] border-2 border-[#b48643]/40 rounded-3xl p-6 shadow-sm mt-6">
              <div className="flex items-center justify-between border-b border-[#d9d5c9] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#b48643]" />
                  <h3 className="font-serif text-lg font-bold text-[#173d34]">
                    AI Fit Scorecard: {selectedCandidate.name}
                  </h3>
                </div>
                <button
                  onClick={() => setScorecardResult(null)}
                  className="text-xs text-[#68736e] hover:text-[#173d34]"
                >
                  Close
                </button>
              </div>

              {scorecardLoading ? (
                <div className="py-8 text-center text-sm text-[#68736e]">
                  <Sparkles className="w-6 h-6 text-[#b48643] animate-spin mx-auto mb-2" />
                  Generating predictive sales fit scorecard using Gemini 3.8 Flash...
                </div>
              ) : scorecardResult ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#d9d5c9]">
                    <div>
                      <div className="text-xs text-[#68736e]">Predicted Team Fit Score</div>
                      <div className="text-3xl font-serif font-bold text-[#173d34]">
                        {scorecardResult.fitScore} / 100
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#68736e]">Expected Quota Attainment</div>
                      <div className="text-sm font-bold text-[#173d34]">
                        {scorecardResult.expectedQuotaAttainmentRate}
                      </div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl">
                      {scorecardResult.hiringRecommendation}
                    </span>
                  </div>

                  <p className="text-sm text-[#173d34] leading-relaxed">
                    {scorecardResult.summary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
                      <div className="text-xs font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        Key Candidate Strengths:
                      </div>
                      <ul className="text-xs text-emerald-800 space-y-1.5">
                        {scorecardResult.strengths.map((str, i) => (
                          <li key={i}>• {str}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
                      <div className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-700" />
                        Targeted Ramp-Up Watchpoints:
                      </div>
                      <ul className="text-xs text-amber-800 space-y-1.5">
                        {scorecardResult.watchpoints.map((wp, i) => (
                          <li key={i}>• {wp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: AI JOB BRIEF CALIBRATOR */}
      {/* ======================================================== */}
      {activeTab === 'calibrator' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#d9d5c9] p-6 rounded-3xl shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#b48643]" />
              <h2 className="font-serif text-xl font-bold text-[#173d34]">
                AI Sales Competency &amp; Brief Calibrator
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#68736e] mb-6">
              Turn unstructured requirements into verified assessment rubrics, target outbound volume benchmarks, and interview battlecards powered by Gemini.
            </p>

            <form onSubmit={handleCalibrateBrief} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#173d34] mb-1">
                  Sales Role Needed
                </label>
                <select
                  value={calibratorForm.roleNeeded}
                  onChange={(e) => setCalibratorForm({ ...calibratorForm, roleNeeded: e.target.value })}
                  className="w-full bg-[#f7f4ec] border border-[#d9d5c9] rounded-xl px-3 py-2 text-xs text-[#173d34] outline-none focus:border-[#173d34]"
                >
                  <option value="BDE">BDE (Business Development Executive)</option>
                  <option value="BDM">BDM (Senior Closer / Account Executive)</option>
                  <option value="Junior Sales">Junior / Inside Sales Rep</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#173d34] mb-1">
                  Target Industry
                </label>
                <input
                  type="text"
                  value={calibratorForm.targetIndustry}
                  onChange={(e) => setCalibratorForm({ ...calibratorForm, targetIndustry: e.target.value })}
                  placeholder="e.g. B2B SaaS, Logistics, EdTech, Real Estate"
                  className="w-full bg-[#f7f4ec] border border-[#d9d5c9] rounded-xl px-3 py-2 text-xs text-[#173d34] outline-none focus:border-[#173d34]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#173d34] mb-1">
                  Company / Product Overview
                </label>
                <input
                  type="text"
                  value={calibratorForm.companyDetails}
                  onChange={(e) => setCalibratorForm({ ...calibratorForm, companyDetails: e.target.value })}
                  placeholder="e.g. Enterprise freight tracking platform in Kerala"
                  className="w-full bg-[#f7f4ec] border border-[#d9d5c9] rounded-xl px-3 py-2 text-xs text-[#173d34] outline-none focus:border-[#173d34]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#173d34] mb-1">
                  Target Openings &amp; City
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={calibratorForm.targetVolume}
                    onChange={(e) => setCalibratorForm({ ...calibratorForm, targetVolume: e.target.value })}
                    placeholder="2-3 roles"
                    className="w-1/2 bg-[#f7f4ec] border border-[#d9d5c9] rounded-xl px-3 py-2 text-xs text-[#173d34] outline-none focus:border-[#173d34]"
                  />
                  <input
                    type="text"
                    value={calibratorForm.city}
                    onChange={(e) => setCalibratorForm({ ...calibratorForm, city: e.target.value })}
                    placeholder="Kochi"
                    className="w-1/2 bg-[#f7f4ec] border border-[#d9d5c9] rounded-xl px-3 py-2 text-xs text-[#173d34] outline-none focus:border-[#173d34]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={calibratorLoading}
                  className="w-full sm:w-auto bg-[#173d34] hover:bg-[#0d2a24] text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#d9b77d]" />
                  <span>{calibratorLoading ? 'Calibrating Competencies...' : 'Generate Calibrated Brief'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Calibrator Output */}
          {calibratorResult && (
            <div className="bg-[#fcfaf6] border border-[#d9d5c9] p-6 rounded-3xl shadow-xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d9d5c9] pb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#b48643] uppercase tracking-wider">
                    Calibrated Role Specification
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#173d34]">
                    {calibratorResult.calibratedTitle}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <div className="bg-white border border-[#d9d5c9] px-3 py-1.5 rounded-xl text-center">
                    <div className="text-[10px] text-[#68736e]">Ramp-up Time</div>
                    <div className="text-xs font-bold text-[#173d34]">
                      {calibratorResult.rampUpTimelineDays} Days
                    </div>
                  </div>
                  <div className="bg-white border border-[#d9d5c9] px-3 py-1.5 rounded-xl text-center">
                    <div className="text-[10px] text-[#68736e]">Recommended CTC</div>
                    <div className="text-xs font-bold text-[#b48643]">
                      {calibratorResult.recommendedCtcBand}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-[#d9d5c9]">
                  <div className="text-xs font-bold text-[#173d34] mb-2 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-[#b48643]" />
                    Outreach Benchmarks &amp; Persona:
                  </div>
                  <p className="text-xs text-[#525f5a] leading-relaxed mb-2">
                    <strong className="text-[#173d34]">Daily Cadence:</strong> {calibratorResult.dailyTargetOutreach}
                  </p>
                  <p className="text-xs text-[#525f5a] leading-relaxed">
                    <strong className="text-[#173d34]">Ideal Persona:</strong> {calibratorResult.idealSalesPersona}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#d9d5c9]">
                  <div className="text-xs font-bold text-[#173d34] mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#173d34]" />
                    Objections Candidate Must Pass:
                  </div>
                  <ul className="text-xs text-[#525f5a] space-y-1.5">
                    {calibratorResult.topObjectionsToTest.map((obj, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#b48643] font-bold">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Interview Questions */}
              <div className="bg-white p-5 rounded-2xl border border-[#d9d5c9]">
                <h4 className="text-xs font-bold text-[#173d34] uppercase tracking-wider mb-3">
                  Tailored Interview Diagnostic Questions
                </h4>
                <div className="space-y-3">
                  {calibratorResult.suggestedInterviewQuestions.map((item, idx) => (
                    <div key={idx} className="bg-[#f7f4ec] p-3 rounded-xl border border-[#e5e1d5]">
                      <div className="text-xs font-bold text-[#173d34] mb-1">
                        Q{idx + 1}: {item.question}
                      </div>
                      <div className="text-[11px] text-emerald-800 bg-emerald-50/80 p-2 rounded border border-emerald-200">
                        <strong>Good Answer Indicator:</strong> {item.goodAnswerIndicator}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: AI RETENTION RISK MODELER */}
      {/* ======================================================== */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#d9d5c9] p-6 rounded-3xl shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-[#b48643]" />
              <h2 className="font-serif text-xl font-bold text-[#173d34]">
                AI Retention &amp; Guarantee Risk Modeler
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#68736e] mb-6">
              Simulate candidate longevity and guarantee trigger risk based on compensation structure, daily call expectations, and location demographics.
            </p>

            <form onSubmit={handleRunRiskModel} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#173d34] mb-1">
                  Fixed Compensation
                </label>
                <input
                  type="text"
                  value={riskForm.fixedPay}
                  onChange={(e) => setRiskForm({ ...riskForm, fixedPay: e.target.value })}
                  placeholder="₹25,000/mo"
                  className="w-full bg-[#f7f4ec] border border-[#d9d5c9] rounded-xl px-3 py-2 text-xs text-[#173d34] outline-none focus:border-[#173d34]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#173d34] mb-1">
                  Variable Percentage
                </label>
                <input
                  type="text"
                  value={riskForm.variablePercentage}
                  onChange={(e) => setRiskForm({ ...riskForm, variablePercentage: e.target.value })}
                  placeholder="30%"
                  className="w-full bg-[#f7f4ec] border border-[#d9d5c9] rounded-xl px-3 py-2 text-xs text-[#173d34] outline-none focus:border-[#173d34]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#173d34] mb-1">
                  Expected Daily Volume
                </label>
                <input
                  type="text"
                  value={riskForm.expectedCallsPerDay}
                  onChange={(e) => setRiskForm({ ...riskForm, expectedCallsPerDay: e.target.value })}
                  placeholder="50 calls/day"
                  className="w-full bg-[#f7f4ec] border border-[#d9d5c9] rounded-xl px-3 py-2 text-xs text-[#173d34] outline-none focus:border-[#173d34]"
                />
              </div>

              <div className="sm:col-span-3 pt-2">
                <button
                  type="submit"
                  disabled={riskLoading}
                  className="bg-[#173d34] hover:bg-[#0d2a24] text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5 text-[#d9b77d]" />
                  <span>{riskLoading ? 'Simulating Longevity Model...' : 'Calculate Retention & Guarantee Risk'}</span>
                </button>
              </div>
            </form>
          </div>

          {riskResult && (
            <div className="bg-[#fcfaf6] border border-[#d9d5c9] p-6 rounded-3xl shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#d9d5c9]">
                <div>
                  <div className="text-xs text-[#68736e]">Predicted Retention Score</div>
                  <div className="text-3xl font-serif font-bold text-[#173d34]">
                    {riskResult.retentionScore} / 100
                  </div>
                </div>

                <div>
                  <div className="text-xs text-[#68736e]">45-Day Guarantee Risk</div>
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded-xl ${
                      riskResult.riskLevel === 'Low'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {riskResult.riskLevel} Risk ({riskResult.probabilityOfGuaranteeTrigger} trigger probability)
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-xs text-[#68736e]">PitchReady Protection</div>
                  <div className="text-xs font-bold text-[#173d34]">
                    {riskResult.pitchReadyGuaranteeCoverage}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-[#d9d5c9]">
                  <div className="text-xs font-bold text-[#173d34] mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Observed Risk Factors:
                  </div>
                  <ul className="text-xs text-[#525f5a] space-y-1.5">
                    {riskResult.primaryRiskFactors.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#d9d5c9]">
                  <div className="text-xs font-bold text-[#173d34] mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Recommended Mitigation Tactics:
                  </div>
                  <ul className="text-xs text-[#525f5a] space-y-1.5">
                    {riskResult.mitigationStrategies.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: ACTIVE PLACEMENTS & GUARANTEE MONITOR */}
      {/* ======================================================== */}
      {activeTab === 'guarantee' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#d9d5c9] p-6 rounded-3xl shadow-xs">
            <h2 className="font-serif text-xl font-bold text-[#173d34] mb-2">
              Active Guarantee &amp; Replacement Ledger
            </h2>
            <p className="text-xs sm:text-sm text-[#68736e] mb-6">
              Track your hired talent during their 45-day performance guarantee window. If a hire resigns or underperforms, request up to 2 replacements at zero additional recruitment fee.
            </p>

            <div className="space-y-4">
              {placements.map((plc) => {
                const percentElapsed = Math.min(
                  100,
                  Math.round((plc.daysElapsed / plc.guaranteeDaysTotal) * 100)
                );
                return (
                  <div
                    key={plc.id}
                    className="border border-[#d9d5c9] rounded-2xl p-4 bg-[#fcfaf6] flex flex-col gap-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-[#173d34] text-sm">
                          {plc.candidateName}
                        </span>
                        <span className="text-xs text-[#68736e] ml-2">
                          ({plc.role} at {plc.company})
                        </span>
                        <div className="text-[11px] text-[#68736e]">
                          Joined: {plc.joinedDate} • Fee Paid: {plc.feePaid}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {plc.status}
                        </span>
                        <span className="text-xs font-semibold text-[#173d34] bg-white border border-[#d9d5c9] px-2.5 py-1 rounded-lg">
                          {plc.daysRemaining} days left
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] text-[#68736e] mb-1">
                        <span>Day {plc.daysElapsed} of {plc.guaranteeDaysTotal}</span>
                        <span>Replacements used: {plc.replacementsUsed} / {plc.maxReplacements}</span>
                      </div>
                      <div className="w-full bg-[#e5e1d5] h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#173d34] h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentElapsed}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* INTERVIEW BOOKING MODAL */}
      {/* ======================================================== */}
      {bookingModalOpen && bookingCandidate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#d9d5c9] shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-[#d9d5c9] pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#173d34]">
                  Schedule Interview
                </h3>
                <p className="text-xs text-[#68736e]">
                  with {bookingCandidate.name} ({bookingCandidate.role})
                </p>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="text-xs text-[#68736e] hover:text-[#173d34]"
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-8 text-center text-emerald-800">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-sm">Interview Scheduled!</h4>
                <p className="text-xs text-emerald-700 mt-1">
                  Candidate calendar invitation &amp; meeting link dispatched.
                </p>
              </div>
            ) : (
              <form onSubmit={handleScheduleInterviewSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#173d34] mb-1">
                    Your Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={companyNameInput}
                    onChange={(e) => setCompanyNameInput(e.target.value)}
                    className="w-full bg-[#f7f4ec] border border-[#d9d5c9] rounded-xl px-3 py-2 text-xs text-[#173d34] outline-none focus:border-[#173d34]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#173d34] mb-1">
                    Interview Date
                  </label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full bg-[#f7f4ec] border border-[#d9d5c9] rounded-xl px-3 py-2 text-xs text-[#173d34] outline-none focus:border-[#173d34]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#173d34] mb-1">
                    Time Slot (IST)
                  </label>
                  <input
                    type="text"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    placeholder="11:00 AM IST"
                    className="w-full bg-[#f7f4ec] border border-[#d9d5c9] rounded-xl px-3 py-2 text-xs text-[#173d34] outline-none focus:border-[#173d34]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#173d34] mb-1">
                    Meeting Format
                  </label>
                  <select
                    value={interviewFormat}
                    onChange={(e) => setInterviewFormat(e.target.value)}
                    className="w-full bg-[#f7f4ec] border border-[#d9d5c9] rounded-xl px-3 py-2 text-xs text-[#173d34] outline-none focus:border-[#173d34]"
                  >
                    <option value="Google Meet (Video)">Google Meet (Video)</option>
                    <option value="Direct Phone Call">Direct Phone Call</option>
                    <option value="In-Person (Office)">In-Person (Office)</option>
                  </select>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full bg-[#173d34] hover:bg-[#0d2a24] text-white text-xs font-semibold py-2.5 rounded-xl transition shadow-xs"
                  >
                    Confirm &amp; Book Interview
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
