import React, { useState } from 'react';
import { ShieldCheck, RotateCcw, Check, Sparkles } from 'lucide-react';

export const FeeCalculator: React.FC = () => {
  const [roleType, setRoleType] = useState<'bde' | 'bdm' | 'entry'>('bde');
  const [headcount, setHeadcount] = useState<number>(2);

  const rates: Record<string, { title: string; fee: number; typicalCtc: string; agencyFee: number }> = {
    entry: {
      title: 'Junior / Entry-Level Sales',
      fee: 8000,
      typicalCtc: '₹2.5L – ₹3.5L',
      agencyFee: 25000,
    },
    bde: {
      title: 'Business Development Executive (BDE)',
      fee: 10000,
      typicalCtc: '₹3.5L – ₹5.5L',
      agencyFee: 38000,
    },
    bdm: {
      title: 'BDM / Senior Sales Representative',
      fee: 12000,
      typicalCtc: '₹6.0L – ₹9.0L',
      agencyFee: 65000,
    },
  };

  const current = rates[roleType];
  const totalPitchReady = current.fee * headcount;
  const totalAgency = current.agencyFee * headcount;
  const savings = totalAgency - totalPitchReady;

  return (
    <div className="rounded-2xl border border-[#d9d5c9] bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between gap-2 border-b border-[#d9d5c9]/60 pb-3.5 mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#b48643]">
            Transparent Pricing
          </span>
          <h3 className="font-serif text-lg font-medium text-[#173d34]">
            Fee & Guarantee Explorer
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#39735a]/10 text-[#39735a] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Pay after joining</span>
        </div>
      </div>

      {/* Role Picker Pills */}
      <div className="space-y-1.5 mb-4">
        <label className="text-[11px] font-semibold text-[#68736e] uppercase tracking-wider block">
          Select Hiring Profile
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(['entry', 'bde', 'bdm'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setRoleType(key)}
              className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition border ${
                roleType === key
                  ? 'bg-[#173d34] text-white border-[#173d34] shadow-xs'
                  : 'bg-[#f7f4ec] text-[#68736e] border-[#d9d5c9] hover:bg-[#eee9dc]'
              }`}
            >
              {key === 'entry' ? 'Junior' : key.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Openings count slider */}
      <div className="mb-5 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="font-semibold text-[#68736e]">Planned Hires:</span>
          <span className="font-bold text-[#173d34]">{headcount} {headcount === 1 ? 'hire' : 'hires'}</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={headcount}
          onChange={(e) => setHeadcount(Number(e.target.value))}
          className="w-full accent-[#173d34] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#68736e]">
          <span>1 person</span>
          <span>5 hires</span>
          <span>10+ hires</span>
        </div>
      </div>

      {/* Cost Comparison Card */}
      <div className="rounded-xl bg-[#f7f4ec] border border-[#d9d5c9] p-4 space-y-3">
        <div className="flex justify-between items-baseline">
          <div>
            <p className="text-xs text-[#68736e]">PitchReady Placement Fee</p>
            <p className="text-[11px] text-[#39735a] font-medium flex items-center gap-1">
              <Check className="w-3 h-3" /> Due only after joining date
            </p>
          </div>
          <p className="font-serif text-2xl font-semibold text-[#173d34]">
            ₹{(totalPitchReady).toLocaleString('en-IN')}
          </p>
        </div>

        <div className="pt-2 border-t border-[#d9d5c9]/70 flex justify-between items-center text-xs text-[#68736e]">
          <span>Traditional agency (8.33%):</span>
          <span className="line-through">₹{totalAgency.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex items-center justify-between text-xs font-semibold text-[#39735a] bg-[#39735a]/10 p-2 rounded-lg">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Est. Savings:
          </span>
          <span>₹{savings.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Guarantee badge */}
      <div className="mt-3.5 flex items-start gap-2.5 text-[11px] text-[#68736e] bg-white p-2.5 rounded-lg border border-[#d9d5c9]/60">
        <RotateCcw className="w-4 h-4 text-[#b48643] shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#15211d]">Replace × 2 Guarantee:</strong> If a placed candidate leaves within 45 days, we provide up to two replacements, or issue a refund according to policy.
        </p>
      </div>
    </div>
  );
};
