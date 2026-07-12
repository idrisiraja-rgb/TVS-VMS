import React, { useState } from "react";
import { Observation, ObserverStats } from "../types";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from "recharts";
import { 
  Users, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  ShieldAlert, 
  CheckCircle2, 
  Award,
  ChevronRight,
  TrendingUp,
  AlertOctagon,
  Target
} from "lucide-react";

interface DashboardViewProps {
  observations: Observation[];
  leaderboard: ObserverStats[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  observations,
  leaderboard
}) => {
  const [selectedMonth, setSelectedMonth] = useState("2024-10");

  // Dynamic status counts based on actual state
  const openCount = observations.filter(o => o.status === "open").length;
  const inProgressCount = observations.filter(o => o.status === "in_progress").length;
  const closedCount = observations.filter(o => o.status === "closed").length;
  const totalCount = observations.length;

  // Donut Chart Data
  const statusData = [
    { name: "Closed", value: closedCount, color: "#10B981" }, // Emerald 500
    { name: "In Progress", value: inProgressCount, color: "#3B82F6" }, // Blue 500
    { name: "Open", value: openCount, color: "#EF4444" }, // Rose 500
  ];

  // Incidents weekly trends data
  const weeklyTrends = [
    { name: "Week 1", "Unsafe Acts": 8, "Conditions": 14, "Near Misses": 1 },
    { name: "Week 2", "Unsafe Acts": 5, "Conditions": 9, "Near Misses": 0 },
    { name: "Week 3", "Unsafe Acts": 2, "Conditions": 5, "Near Misses": 2 },
    { name: "Week 4", "Unsafe Acts": 1, "Conditions": 3, "Near Misses": 0 },
  ];

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Upper sub-header / Month filter */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Live Safe Ops Center
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            October 2024 Safety Performance
          </h3>
          <p className="text-xs text-slate-450 font-medium">
            Safety dashboard & man-hour records for TVS Mobility
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Users size={12} className="text-[#3B82F6]" />
            Workforce: 100
          </span>
          <span className="bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Briefcase size={12} className="text-[#3B82F6]" />
            20,800 Man-Hours
          </span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-[#0F172A] text-white text-xs font-bold px-3.5 py-1.5 pr-8 rounded-lg cursor-pointer border-none focus:outline-none hover:bg-slate-800 transition-colors"
          >
            <option value="2024-10">October 2024</option>
            <option value="2024-09">September 2024</option>
            <option value="2024-08">August 2024</option>
          </select>
        </div>
      </div>

      {/* KPI Stats Panel (Bento Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-550/5 text-[#3B82F6] bg-blue-50 rounded-xl">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-950">351</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Staff Trained</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-sky-50 text-sky-700 rounded-xl">
            <Calendar size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-950">19</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Sessions</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-[#10B981] rounded-xl">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-950">100%</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Compliance</div>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <ShieldAlert size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-950">4</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Violations</div>
          </div>
        </div>
      </div>

      {/* CHARTS CONTAINER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart: Observation Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-base font-black text-slate-900 tracking-tight">
              Observation Status
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Live status breakdown of reported site safety logs
            </p>
          </div>

          <div className="h-64 my-4 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: "#0f172a", borderRadius: "10px", border: "none", color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner text with total count */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-900">{totalCount}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Total Logs
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
            {statusData.map((s, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-650 flex items-center gap-1.5 justify-center">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.name}
                </span>
                <span className="text-lg font-black text-slate-900 mt-1">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Line Chart: October Trends */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              October Trends
              <TrendingUp size={16} className="text-[#3B82F6]" />
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Weekly safety observations by alert category
            </p>
          </div>

          <div className="h-64 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrends}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", pt: 10 }} />
                <Line type="monotone" dataKey="Unsafe Acts" stroke="#3B82F6" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Conditions" stroke="#EF4444" strokeWidth={2} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="Near Misses" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center text-[11px] font-semibold text-slate-400 pt-2 border-t border-slate-100">
            Observation counts decreased significantly from Week 1 to Week 4 due to daily safety briefs.
          </div>
        </div>
      </div>

      {/* LTI Safety Milestone Counter & Progress */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#3B82F6] uppercase tracking-widest block">
              Safety Milestone Goal
            </span>
            <h4 className="text-lg font-black text-slate-900">
              Days without Lost Time Injury (LTI)
            </h4>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-black text-[#10B981]">428</span>
            <span className="text-xs font-bold text-slate-400">/ 500 Days Goal</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/40">
            <div className="bg-[#10B981] h-full rounded-full transition-all duration-500" style={{ width: `${(428 / 500) * 100}%` }} />
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-400">
            <span>Last incident: August 12, 2023</span>
            <span className="text-[#10B981]">85.6% Completed</span>
          </div>
        </div>
      </div>

      {/* Top Observers Leaderboard */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
              Top Observers
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Outstanding personnel contributing to behavioral safety dialogue
            </p>
          </div>
          <span className="text-emerald-700 font-bold text-xs flex items-center gap-1 cursor-pointer hover:underline">
            View Full Leaderboard
            <ChevronRight size={14} />
          </span>
        </div>

        <div className="space-y-3">
          {leaderboard.map((user, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                  />
                  <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                    {user.rank}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900">{user.name}</h5>
                  <p className="text-xs text-slate-400 font-medium">{user.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {user.badges.includes("workspace_premium") && (
                    <span title="Elite Tier Badge" className="p-1 bg-amber-50 text-amber-600 rounded-lg">
                      <Award size={14} />
                    </span>
                  )}
                  {user.badges.includes("military_tech") && (
                    <span title="Military-Grade Safety Precision" className="p-1 bg-emerald-50 text-emerald-600 rounded-lg">
                      <Target size={14} />
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-950 block">{user.observationsCount}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Observations</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
