import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Send, Check, Sparkles, Building2, UserCircle, ArrowRight } from 'lucide-react';
import { AppMode, EmployerFormData, CandidateFormData, SubmissionRecord } from '../types';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { submitInquiry, syncOfflineQueue } from '../lib/api';

interface InteractiveFormProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onNavigateToPortal?: (tab: 'employer-portal' | 'candidate-portal') => void;
}

const initialEmployer: EmployerFormData = {
  companyName: '',
  contactPerson: '',
  empPhone: '',
  empEmail: '',
  empCity: 'Kochi',
  roleNeeded: 'BDE',
  openings: '2',
  hiringTimeline: 'Within 2 weeks',
};

const initialCandidate: CandidateFormData = {
  name: '',
  candPhone: '',
  candEmail: '',
  candCity: 'Kochi',
  experienceLevel: 'Fresher',
  currentRole: '',
  whySales: '',
  availability: 'Immediately',
};

export const InteractiveForm: React.FC<InteractiveFormProps> = ({ mode, onModeChange, onNavigateToPortal }) => {
  const isOnline = useOnlineStatus();
  const [empForm, setEmpForm] = useState<EmployerFormData>(() => {
    const saved = localStorage.getItem('pitchready_draft_emp');
    return saved ? JSON.parse(saved) : initialEmployer;
  });

  const [candForm, setCandForm] = useState<CandidateFormData>(() => {
    const saved = localStorage.getItem('pitchready_draft_cand');
    return saved ? JSON.parse(saved) : initialCandidate;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedType, setSubmittedType] = useState<AppMode>(mode);
  const [savedOffline, setSavedOffline] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-save drafts
  useEffect(() => {
    localStorage.setItem('pitchready_draft_emp', JSON.stringify(empForm));
  }, [empForm]);

  useEffect(() => {
    localStorage.setItem('pitchready_draft_cand', JSON.stringify(candForm));
  }, [candForm]);

  // Sync offline queue when coming back online, and once on initial load if online
  useEffect(() => {
    if (isOnline) {
      syncOfflineQueue().catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (mode === 'employer') {
      if (!empForm.companyName.trim() || !empForm.contactPerson.trim() || !empForm.empPhone.trim()) {
        setErrorMessage('Please fill in Company name, Contact name, and Phone number.');
        return;
      }
    } else {
      if (!candForm.name.trim() || !candForm.candPhone.trim() || !candForm.candCity.trim()) {
        setErrorMessage('Please provide your Name, Phone number, and City.');
        return;
      }
    }

    setIsSubmitting(true);
    const submissionId = 'sub_' + Date.now();
    const dataPayload = mode === 'employer' ? empForm : candForm;

    try {
      const res = await submitInquiry({
        id: submissionId,
        type: mode,
        data: dataPayload,
        isOffline: !isOnline,
      });

      // Also persist to local cache for resilient history
      const trulyOffline = !isOnline;
      const failedButOnline = isOnline && !res.success;

      const existing = JSON.parse(localStorage.getItem('pitchready_submissions') || '[]');
      existing.unshift({
        id: submissionId,
        type: mode,
        timestamp: new Date().toISOString(),
        // Only the real "device is offline" case counts as an offline queue item
        // that we expect syncOfflineQueue to pick up on the next online transition.
        isOffline: trulyOffline || failedButOnline,
        data: dataPayload,
      });
      localStorage.setItem('pitchready_submissions', JSON.stringify(existing));

      setSavedOffline(trulyOffline);
      setServerError(failedButOnline);
      setSubmittedType(mode);
      setIsSuccess(true);
      setIsSubmitting(false);

      // Clear draft
      if (mode === 'employer') {
        localStorage.removeItem('pitchready_draft_emp');
      } else {
        localStorage.removeItem('pitchready_draft_cand');
      }
    } catch (err: any) {
      console.warn('Submission fallback triggered:', err);
      // An exception here (vs. a handled non-2xx response) means the request
      // itself couldn't be made — treat that as offline only if we actually are.
      setSavedOffline(!isOnline);
      setServerError(isOnline);
      setSubmittedType(mode);
      setIsSuccess(true);
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setSavedOffline(false);
    setServerError(false);
    setErrorMessage(null);
    if (mode === 'employer') {
      setEmpForm(initialEmployer);
    } else {
      setCandForm(initialCandidate);
    }
  };

  return (
    <div id="start" className="w-full">
      {/* Mode Switcher Buttons */}
      <div className="flex bg-[#eee9dc] p-1.5 rounded-full border border-[#d9d5c9] max-w-md mx-auto mb-6 shadow-inner">
        <button
          type="button"
          id="btn-switch-employer"
          onClick={() => {
            onModeChange('employer');
            setIsSuccess(false);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            mode === 'employer'
              ? 'bg-[#173d34] text-white shadow-sm'
              : 'text-[#68736e] hover:text-[#173d34]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Hire Talent
        </button>
        <button
          type="button"
          id="btn-switch-candidate"
          onClick={() => {
            onModeChange('candidate');
            setIsSuccess(false);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            mode === 'candidate'
              ? 'bg-[#173d34] text-white shadow-sm'
              : 'text-[#68736e] hover:text-[#173d34]'
          }`}
        >
          <UserCircle className="w-4 h-4" />
          Find a Role
        </button>
      </div>

      {isSuccess ? (
        <div
          id="submission-success-card"
          className="rounded-3xl border border-[#d9d5c9] bg-white p-6 sm:p-8 text-center shadow-lg animate-in zoom-in-95 duration-200"
        >
          <div className="w-14 h-14 rounded-full bg-[#39735a]/10 text-[#39735a] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="font-serif text-2xl font-medium text-[#173d34]">
            {submittedType === 'employer' ? 'Hiring Brief Received' : 'Application Submitted'}
          </h3>

          <p className="mt-2.5 text-sm text-[#68736e] max-w-md mx-auto leading-relaxed">
            {savedOffline
              ? 'You are currently offline. Your request has been safely saved to your device storage and will automatically sync to our server once connection returns.'
              : serverError
              ? "We couldn't reach our server just now, so your request has been saved on this device. We'll keep retrying automatically — you can also try again shortly."
              : submittedType === 'employer'
              ? 'Your brief is recorded in our verified backend! You can now explore vetted sales profiles in the Employer Portal, calibrate competencies with AI, or schedule candidate interviews.'
              : 'Your application is registered in our candidate pipeline! Explore the practical Sales Preparation & Objection battlecards in the Candidate Hub.'}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            {onNavigateToPortal && (
              <button
                onClick={() =>
                  onNavigateToPortal(
                    submittedType === 'employer' ? 'employer-portal' : 'candidate-portal'
                  )
                }
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#173d34] text-white text-xs sm:text-sm font-semibold hover:bg-[#0d2a24] transition active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>
                  {submittedType === 'employer'
                    ? 'Open Employer Dashboard'
                    : 'Open Candidate Hub'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d9b77d]" />
              </button>
            )}

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#d9d5c9] text-[#173d34] text-xs sm:text-sm font-semibold hover:bg-[#eee9dc] transition"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        <form
          id="pitchready-main-form"
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#d9d5c9] bg-white p-5 sm:p-8 shadow-xl"
        >
          <div className="mb-5 pb-4 border-b border-[#d9d5c9]/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#b48643]">
                {mode === 'employer' ? 'Employer Intake' : 'Candidate Registration'}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#173d34]">
                {mode === 'employer' ? 'Tell us what you need' : 'Start your sales career'}
              </h3>
            </div>
            {!isOnline && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
                Offline auto-save
              </span>
            )}
          </div>

          {errorMessage && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Employer Form Fields */}
          {mode === 'employer' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase text-[11px] tracking-wide text-[#68736e] mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Tech Solutions"
                  value={empForm.companyName}
                  onChange={(e) => setEmpForm({ ...empForm, companyName: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d5c9] bg-[#f7f4ec] px-4 py-3 text-sm text-[#15211d] focus:bg-white focus:border-[#173d34] outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[11px] tracking-wide text-[#68736e] mb-1.5">
                  Contact Person &amp; Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Menon, VP Sales"
                  value={empForm.contactPerson}
                  onChange={(e) => setEmpForm({ ...empForm, contactPerson: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d5c9] bg-[#f7f4ec] px-4 py-3 text-sm text-[#15211d] focus:bg-white focus:border-[#173d34] outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[11px] tracking-wide text-[#68736e] mb-1.5">
                  Phone Number (WhatsApp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98470 00000"
                  value={empForm.empPhone}
                  onChange={(e) => setEmpForm({ ...empForm, empPhone: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d5c9] bg-[#f7f4ec] px-4 py-3 text-sm text-[#15211d] focus:bg-white focus:border-[#173d34] outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[11px] tracking-wide text-[#68736e] mb-1.5">
                  Work Email
                </label>
                <input
                  type="email"
                  placeholder="rahul@company.com"
                  value={empForm.empEmail}
                  onChange={(e) => setEmpForm({ ...empForm, empEmail: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d5c9] bg-[#f7f4ec] px-4 py-3 text-sm text-[#15211d] focus:bg-white focus:border-[#173d34] outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[11px] tracking-wide text-[#68736e] mb-1.5">
                  Location / City <span className="text-red-500">*</span>
                </label>
                <select
                  value={empForm.empCity}
                  onChange={(e) => setEmpForm({ ...empForm, empCity: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d5c9] bg-[#f7f4ec] px-4 py-3 text-sm text-[#15211d] focus:bg-white focus:border-[#173d34] outline-none transition"
                >
                  <option value="Kochi">Kochi / Ernakulam</option>
                  <option value="Trivandrum">Trivandrum</option>
                  <option value="Kozhikode">Kozhikode</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Other">Other South India</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[11px] tracking-wide text-[#68736e] mb-1.5">
                  Role Needed
                </label>
                <select
                  value={empForm.roleNeeded}
                  onChange={(e) => setEmpForm({ ...empForm, roleNeeded: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d5c9] bg-[#f7f4ec] px-4 py-3 text-sm text-[#15211d] focus:bg-white focus:border-[#173d34] outline-none transition"
                >
                  <option value="BDE">BDE (Business Development Executive)</option>
                  <option value="BDM">BDM (Senior Closer / AE)</option>
                  <option value="Junior">Junior / Inside Sales</option>
                  <option value="Field Sales">Field Sales Representative</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[11px] tracking-wide text-[#68736e] mb-1.5">
                  Number of Openings
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2 or 5"
                  value={empForm.openings}
                  onChange={(e) => setEmpForm({ ...empForm, openings: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d5c9] bg-[#f7f4ec] px-4 py-3 text-sm text-[#15211d] focus:bg-white focus:border-[#173d34] outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[11px] tracking-wide text-[#68736e] mb-1.5">
                  Hiring Timeline
                </label>
                <select
                  value={empForm.hiringTimeline}
                  onChange={(e) => setEmpForm({ ...empForm, hiringTimeline: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d5c9] bg-[#f7f4ec] px-4 py-3 text-sm text-[#15211d] focus:bg-white focus:border-[#173d34] outline-none transition"
                >
                  <option value="Immediate (Within 7 days)">Immediate (Within 7 days)</option>
                  <option value="Within 2 weeks">Within 2 weeks</option>
                  <option value="Within 1 month">Within 1 month</option>
                  <option value="Just planning">Just exploratory</option>
                </select>
              </div>
            </div>
          ) : (
            /* Candidate Form Fields */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase text-[11px] tracking-wide text-[#68736e] mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Nair"
                  value={candForm.name}
                  onChange={(e) => setCandForm({ ...candForm, name: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d5c9] bg-[#f7f4ec] px-4 py-3 text-sm text-[#15211d] focus:bg-white focus:border-[#173d34] outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[11px] tracking-wide text-[#68736e] mb-1.5">
                  Phone (WhatsApp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98470 00000"
                  value={candForm.candPhone}
                  onChange={(e) => setCandForm({ ...candForm, candPhone: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d5c9] bg-[#f7f4ec] px-4 py-3 text-sm text-[#15211d] focus:bg-white focus:border-[#173d34] outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[11px] tracking-wide text-[#68736e] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="ananya@gmail.com"
                  value={candForm.candEmail}
                  onChange={(e) => setCandForm({ ...candForm, candEmail: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d5c9] bg-[#f7f4ec] px-4 py-3 text-sm text-[#15211d] focus:bg-white focus:border-[#173d34] outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[11px] tracking-wide text-[#68736e] mb-1.5">
                  Current City <span className="text-red-500">*</span>
                </label>
                <select
                  value={candForm.candCity}
                  onChange={(e) => setCandForm({ ...candForm, candCity: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d5c9] bg-[#f7f4ec] px-4 py-3 text-sm text-[#15211d] focus:bg-white focus:border-[#173d34] outline-none transition"
                >
                  <option value="Kochi">Kochi / Ernakulam</option>
                  <option value="Trivandrum">Trivandrum</option>
                  <option value="Kozhikode">Kozhikode</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[11px] tracking-wide text-[#68736e] mb-1.5">
                  Experience Level
                </label>
                <select
                  value={candForm.experienceLevel}
                  onChange={(e) => setCandForm({ ...candForm, experienceLevel: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d5c9] bg-[#f7f4ec] px-4 py-3 text-sm text-[#15211d] focus:bg-white focus:border-[#173d34] outline-none transition"
                >
                  <option value="Fresher">Fresher / Graduate</option>
                  <option value="1–2 years">1–2 years in sales/retail</option>
                  <option value="3+ years">3+ years in B2B / B2C</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[11px] tracking-wide text-[#68736e] mb-1.5">
                  Current Role / Status
                </label>
                <input
                  type="text"
                  placeholder="Student / Sales Executive / Looking"
                  value={candForm.currentRole}
                  onChange={(e) => setCandForm({ ...candForm, currentRole: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d5c9] bg-[#f7f4ec] px-4 py-3 text-sm text-[#15211d] focus:bg-white focus:border-[#173d34] outline-none transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold uppercase text-[11px] tracking-wide text-[#68736e] mb-1.5">
                  Why Sales?
                </label>
                <textarea
                  rows={3}
                  placeholder="What makes sales attractive to you? (e.g., communication, incentives, client interaction)"
                  value={candForm.whySales}
                  onChange={(e) => setCandForm({ ...candForm, whySales: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d5c9] bg-[#f7f4ec] px-4 py-3 text-sm text-[#15211d] focus:bg-white focus:border-[#173d34] outline-none transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold uppercase text-[11px] tracking-wide text-[#68736e] mb-1.5">
                  When Can You Start?
                </label>
                <input
                  type="text"
                  placeholder="Immediately / Within 15–30 days"
                  value={candForm.availability}
                  onChange={(e) => setCandForm({ ...candForm, availability: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d5c9] bg-[#f7f4ec] px-4 py-3 text-sm text-[#15211d] focus:bg-white focus:border-[#173d34] outline-none transition"
                />
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-[#d9d5c9]/70 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-[#68736e] max-w-sm text-center sm:text-left">
              By submitting, you agree that PitchReady may contact you regarding candidate matching and sales placement.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto min-w-[180px] rounded-full bg-[#173d34] hover:bg-[#0d2a24] text-white px-7 py-3.5 text-xs sm:text-sm font-semibold transition active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting…</span>
              ) : (
                <>
                  <span>{mode === 'employer' ? 'Request Candidates' : 'Submit Application'}</span>
                  <Send className="w-3.5 h-3.5 text-[#d9b77d]" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
