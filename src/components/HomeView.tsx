import React from "react";
import { Observation, ObserverStats } from "../types";
import { 
  Shield, 
  AlertTriangle, 
  GraduationCap, 
  ClipboardCheck, 
  PlusCircle, 
  Radio, 
  CloudLightning, 
  Play, 
  Star,
  CheckCircle2,
  Bell
} from "lucide-react";

interface HomeViewProps {
  observations: Observation[];
  leaderboard: ObserverStats[];
  onNavigate: (tab: string, extra?: any) => void;
  safetyScore?: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  observations,
  leaderboard,
  onNavigate,
  safetyScore = 92
}) => {
  // Compute safety metrics in real-time based on active observations list
  const totalObs = observations.length;
  const openObs = observations.filter(o => o.status === "open").length;
  const inProgressObs = observations.filter(o => o.status === "in_progress").length;
  const closedObs = observations.filter(o => o.status === "closed").length;

  const activeObsCount = openObs + inProgressObs;

  // Let's count some near misses, LTI days etc.
  const nearMissesCount = observations.filter(o => o.category === "near_miss").length;

  // Calculate PPE compliance based on closed observations
  const ppeObservations = observations.filter(o => o.category === "unsafe_act" && o.description.toLowerCase().includes("ppe"));
  const ppeCompliantCount = ppeObservations.filter(o => o.status === "closed").length;
  const ppeComplianceRate = ppeObservations.length > 0 
    ? Math.round((ppeCompliantCount / ppeObservations.length) * 100)
    : 96; // fallback high baseline

  return (
    <div className="space-y-6 pb-24">
      {/* Welcome Banner */}
      <div className="flex justify-between items-start animate-fade-in">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            Good Morning, Raja <span className="animate-bounce">👋</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Site Supervisor <span className="mx-2 text-slate-300">|</span> <span className="font-extrabold text-[#3B82F6] uppercase tracking-wider text-xs">Site #402-B</span>
          </p>
        </div>
      </div>

      {/* TODAY'S SAFETY STATUS Card */}
      <div id="safety-status-card" className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          Today's Safety Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Accidents Stat */}
          <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="w-1 bg-red-500 h-12 rounded-full absolute left-0 top-1/2 -translate-y-1/2" />
            <div className="pl-2">
              <div className="text-4xl font-black text-slate-950">0</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Accidents</div>
            </div>
          </div>

          {/* Open Observations Stat */}
          <div 
            onClick={() => onNavigate("dashboard")}
            className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="w-1 bg-amber-500 h-12 rounded-full absolute left-0 top-1/2 -translate-y-1/2" />
            <div className="pl-2">
              <div className="text-4xl font-black text-slate-950">{activeObsCount}</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Open Obs.</div>
            </div>
          </div>

          {/* PPE Compliance Stat */}
          <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="w-1 bg-[#10B981] h-12 rounded-full absolute left-0 top-1/2 -translate-y-1/2" />
            <div className="pl-2">
              <div className="text-4xl font-black text-slate-950">{ppeComplianceRate}%</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">PPE Compliance</div>
            </div>
          </div>
        </div>
      </div>

      {/* SAFETY SCORE BANNER (Professional Dark Slate Variant) */}
      <div id="safety-score-card" className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white rounded-2xl p-6 relative overflow-hidden shadow-md group hover:shadow-lg transition-all border border-slate-800">
        {/* Shield watermark background */}
        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 pointer-events-none transition-transform group-hover:scale-110 duration-500 text-slate-400">
          <Shield size={180} />
        </div>
        
        <div className="text-center relative z-10 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Safety Score Rating
          </span>
          <div className="text-5xl font-black tracking-tight text-white">
            {safetyScore}%
          </div>
          
          {/* Animated Stars */}
          <div className="flex justify-center gap-1.5 py-1">
            {[1, 2, 3, 4].map(idx => (
              <Star key={idx} size={18} className="fill-[#3B82F6] text-[#3B82F6]" />
            ))}
            <Star size={18} className="text-[#3B82F6] opacity-40 fill-transparent" />
          </div>
          
          <p className="text-[10px] font-extrabold text-[#3B82F6] uppercase tracking-widest">
            Elite Safety Tier
          </p>
        </div>
      </div>

      {/* Bento Grid secondary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <span className="text-xs font-semibold text-slate-500">LTI (Days)</span>
          <div className="flex items-center gap-2 mt-2">
            <CheckCircle2 size={18} className="text-[#10B981]" />
            <span className="text-xl font-bold text-slate-950">0</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <span className="text-xs font-semibold text-slate-500">Near Miss</span>
          <div className="flex items-center gap-2 mt-2">
            <AlertTriangle size={18} className="text-rose-500" />
            <span className="text-xl font-bold text-slate-950">{nearMissesCount}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl flex flex-col justify-between hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onNavigate("learning")}>
          <span className="text-xs font-semibold text-slate-500">Training Tasks</span>
          <div className="flex items-center gap-2 mt-2">
            <GraduationCap size={18} className="text-[#3B82F6]" />
            <span className="text-xl font-bold text-slate-950">18</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl flex flex-col justify-between hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onNavigate("dashboard")}>
          <span className="text-xs font-semibold text-slate-500">Open Actions</span>
          <div className="flex items-center gap-2 mt-2">
            <ClipboardCheck size={18} className="text-emerald-600" />
            <span className="text-xl font-bold text-slate-950">{activeObsCount}</span>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS SECTION */}
      <div className="space-y-3">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Add Observation Button */}
          <button 
            id="qa-add-observation"
            onClick={() => onNavigate("add")}
            className="bg-[#3B82F6] text-white p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer h-28"
          >
            <PlusCircle size={24} />
            <span className="text-xs font-extrabold leading-tight uppercase tracking-wider">Add Observation</span>
          </button>

          {/* Report Incident */}
          <button 
            id="qa-report-incident"
            onClick={() => onNavigate("add", { initialCategory: "near_miss", initialRisk: "critical" })}
            className="bg-rose-600 text-white p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer h-28"
          >
            <Radio size={24} className="animate-pulse text-rose-100" />
            <span className="text-xs font-extrabold leading-tight uppercase tracking-wider">Report Incident</span>
          </button>

          {/* Upload Hazard */}
          <button 
            id="qa-upload-hazard"
            onClick={() => onNavigate("add", { initialCategory: "unsafe_condition" })}
            className="bg-white text-slate-800 border border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer h-28 shadow-sm"
          >
            <CloudLightning size={24} className="text-[#3B82F6]" />
            <span className="text-xs font-extrabold leading-tight uppercase tracking-wider">Upload Hazard</span>
          </button>

          {/* Start Training */}
          <button 
            id="qa-start-training"
            onClick={() => onNavigate("learning")}
            className="bg-white text-slate-800 border border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer h-28 shadow-sm"
          >
            <Play size={24} className="text-[#3B82F6] fill-[#3B82F6]/10" />
            <span className="text-xs font-extrabold leading-tight uppercase tracking-wider">Start Training</span>
          </button>
        </div>
      </div>

      {/* DAILY SAFETY MESSAGE */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Daily Safety Message</h3>
        <div className="relative rounded-2xl overflow-hidden shadow-sm aspect-[16/9] md:aspect-[21/9] bg-slate-950 group">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdURNwIH-u5cCLABzgRlgv6iTDVCOGAltDHYG8a-M9Ye7HgYFzejWKTTR6Y1Y9EfugFV4zOxRYxRG9nvwnyW9snI4CxOI1CYn9phtd54p0Gsyik_b92p-1pHPW-i_86CgDTsPsXManvfqCVGrnRIZi2KSCaxmjRhnQaQzW6UNm8XE9C2MhklhsIjSign4WFlJhJ1-XADTTSFlRuRTaleqRHNA0sfOuxeyredQSZDAbag9fc1pnFnA" 
            alt="Safety Helmet and Warehouse"
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end">
            <h4 className="text-white font-extrabold text-xl md:text-2xl tracking-tight mb-2">
              Think Before You Act.
            </h4>
            <p className="text-slate-200 text-xs md:text-sm font-medium max-w-xl leading-relaxed">
              Your decisions today impact everyone's tomorrow. Safety is a choice you make.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
