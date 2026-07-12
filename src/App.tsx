import React, { useState, useEffect } from "react";
import { 
  getInitialObservations, 
  INITIAL_LEADERBOARD, 
  INITIAL_TRAINING_MODULES, 
  INITIAL_MONTHLY_REPORTS 
} from "./initialData";
import { Observation, MonthlyReport, TrainingModule, ObserverStats, ObservationCategory, RiskLevel } from "./types";
import { HomeView } from "./components/HomeView";
import { ObservationView } from "./components/ObservationView";
import { DashboardView } from "./components/DashboardView";
import { LearningView } from "./components/LearningView";
import { ReportView } from "./components/ReportView";
import { 
  Home, 
  BarChart3, 
  Plus, 
  GraduationCap, 
  FileText, 
  Shield, 
  Bell, 
  ChevronRight,
  Info
} from "lucide-react";

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>("home");
  
  // Custom navigation parameters (e.g. category and risk defaults)
  const [navParams, setNavParams] = useState<{
    initialCategory?: ObservationCategory;
    initialRisk?: RiskLevel;
  }>({});

  // Core Persistent State
  const [observations, setObservations] = useState<Observation[]>([]);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([]);
  const [leaderboard, setLeaderboard] = useState<ObserverStats[]>([]);

  // Notifications bell alert
  const [notificationsCount, setNotificationsCount] = useState(2);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // Initialize data from localStorage or default seed lists
  useEffect(() => {
    try {
      const storedObs = localStorage.getItem("tvs_safety_observations");
      if (storedObs) {
        setObservations(JSON.parse(storedObs));
      } else {
        const seedObs = getInitialObservations();
        setObservations(seedObs);
        localStorage.setItem("tvs_safety_observations", JSON.stringify(seedObs));
      }

      const storedRep = localStorage.getItem("tvs_safety_reports");
      if (storedRep) {
        setMonthlyReports(JSON.parse(storedRep));
      } else {
        setMonthlyReports(INITIAL_MONTHLY_REPORTS);
        localStorage.setItem("tvs_safety_reports", JSON.stringify(INITIAL_MONTHLY_REPORTS));
      }

      const storedTrain = localStorage.getItem("tvs_safety_training");
      if (storedTrain) {
        setTrainingModules(JSON.parse(storedTrain));
      } else {
        setTrainingModules(INITIAL_TRAINING_MODULES);
        localStorage.setItem("tvs_safety_training", JSON.stringify(INITIAL_TRAINING_MODULES));
      }

      const storedLeader = localStorage.getItem("tvs_safety_leaderboard");
      if (storedLeader) {
        setLeaderboard(JSON.parse(storedLeader));
      } else {
        setLeaderboard(INITIAL_LEADERBOARD);
        localStorage.setItem("tvs_safety_leaderboard", JSON.stringify(INITIAL_LEADERBOARD));
      }
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
    }
  }, []);

  // Update persistent store helper
  const updateObservations = (newObs: Observation[]) => {
    setObservations(newObs);
    localStorage.setItem("tvs_safety_observations", JSON.stringify(newObs));
  };

  // Add Observation callback
  const handleAddObservation = (obsData: Omit<Observation, "id" | "date" | "reporter" | "status">) => {
    const newRecord: Observation = {
      ...obsData,
      id: `obs-custom-${Date.now()}`,
      status: "open",
      date: new Date().toISOString(),
      reporter: "Raja" // Greets the current user
    };

    const updated = [newRecord, ...observations];
    updateObservations(updated);

    // Increment personal observation count in leaderboard
    const updatedLeaderboard = leaderboard.map(user => {
      if (user.name === "Raja" || (user.name === "Azimuddin" && obsData.title.toLowerCase().includes("azimuddin"))) {
        return { ...user, observationsCount: user.observationsCount + 1 };
      }
      return user;
    });

    // If Raja is not yet in the leaderboard, let's append him!
    const rajaExists = leaderboard.some(u => u.name === "Raja");
    if (!rajaExists) {
      updatedLeaderboard.push({
        name: "Raja",
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRYtZV2HS_rN58yJp0KxYS3Fv8IkTxdfKPW_Mr7p2nhx9P_dipqlLRJiaGrZ-1ziw4CO56HMLx5wD1Jb-t2qLQ0zX0mpCwMwOX3AiJsCPrnttgYYJvB75vWUCqFTba1aV3g5ns4DS-W1ap9aQCyTTqQp3hjtx4zv4Xk_kAC3xYtnN7BjbXGMzYBOlKQuGJBhlr6TuUU_-dGDXqRMUAk0BgtJ21RHm4y56CNBOo9VIT5Lkd8nXuMLg",
        department: "Site Supervisor",
        observationsCount: 1,
        badges: ["workspace_premium"],
        rank: 4
      });
    }

    setLeaderboard(updatedLeaderboard);
    localStorage.setItem("tvs_safety_leaderboard", JSON.stringify(updatedLeaderboard));

    // Redirect to home or dashboard after reporting!
    setActiveTab("home");
  };

  // Add monthly report callback
  const handleAddMonthlyReport = (newReport: MonthlyReport) => {
    const updated = [newReport, ...monthlyReports];
    setMonthlyReports(updated);
    localStorage.setItem("tvs_safety_reports", JSON.stringify(updated));
  };

  // Resume or Complete educational training module callback
  const handleCompleteTraining = (moduleId: string) => {
    const updated = trainingModules.map(module => {
      if (module.id === moduleId) {
        return { ...module, progress: 100, timeLeft: "0m left" };
      }
      return module;
    });
    setTrainingModules(updated);
    localStorage.setItem("tvs_safety_training", JSON.stringify(updated));
  };

  // Custom navigation parameters handler (e.g. from Home actions)
  const handleCustomNavigate = (tab: string, extra?: any) => {
    if (extra) {
      setNavParams({
        initialCategory: extra.initialCategory,
        initialRisk: extra.initialRisk
      });
    } else {
      setNavParams({});
    }
    setActiveTab(tab);
  };

  // Calculate safety score dynamically based on total open vs resolved counts
  const openCount = observations.filter(o => o.status === "open").length;
  const closedCount = observations.filter(o => o.status === "closed").length;
  const computedSafetyScore = observations.length > 0
    ? Math.min(100, Math.max(70, Math.round((closedCount / observations.length) * 100)))
    : 92;

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#1E293B] flex font-sans">
      
      {/* Sidebar - Visible on Desktop only */}
      <aside className="hidden md:flex w-64 bg-[#0F172A] text-[#94A3B8] flex-col py-8 px-5 shrink-0 fixed top-0 bottom-0 left-0 border-r border-[#1E293B] z-40">
        {/* Brand Header */}
        <div 
          onClick={() => { setActiveTab("home"); setNavParams({}); }}
          className="flex items-center gap-3 pb-8 px-2 border-b border-[#1E293B] cursor-pointer select-none mb-6"
        >
          <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center text-white shadow-md">
            <Shield size={18} className="fill-white/10" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider text-white uppercase leading-none">
              TVS VMS
            </h1>
            <span className="text-[10px] font-bold text-slate-400 block mt-1 tracking-widest uppercase">
              Safety Portal
            </span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 space-y-1">
          {[
            { id: "home", label: "Overview", icon: <Home size={18} /> },
            { id: "dashboard", label: "Safety Dashboard", icon: <BarChart3 size={18} /> },
            { id: "add", label: "Add Observation", icon: <Plus size={18} /> },
            { id: "learning", label: "Learning Center", icon: <GraduationCap size={18} /> },
            { id: "profile", label: "Monthly Reports", icon: <FileText size={18} /> }
          ].map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setNavParams({}); }}
                className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-extrabold tracking-wide transition-all cursor-pointer text-left ${
                  active 
                    ? "bg-[#1E293B] text-white border-l-4 border-[#3B82F6] pl-3 shadow-inner" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]/40"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* System Statusoperational card */}
        <div className="mt-auto px-2">
          <div className="bg-[#1E293B] p-4 rounded-xl text-[11px] text-[#94A3B8] border border-slate-800">
            <div className="text-white font-bold mb-1 tracking-wide">System Status</div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
              Operational
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        
        {/* Top Header - Unified Bar */}
        <header className="sticky top-0 z-30 w-full bg-white border-b border-[#E2E8F0] h-[72px] flex items-center px-4 md:px-8 justify-between shadow-sm">
          
          {/* Left area: Search box on Desktop, Branding on Mobile */}
          <div className="flex items-center gap-4">
            {/* Mobile Branding */}
            <div 
              onClick={() => { setActiveTab("home"); setNavParams({}); }}
              className="flex md:hidden items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="p-1.5 bg-[#3B82F6] text-white rounded-lg shadow-sm">
                <Shield size={16} />
              </div>
              <span className="text-xs font-black tracking-tight text-slate-900 uppercase">
                TVS VMS
              </span>
            </div>

            {/* Desktop Search-bar placeholder */}
            <div className="hidden md:flex items-center relative">
              <input 
                type="text" 
                placeholder="Search safety files, checklists, audits..." 
                className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 pl-9 w-80 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400 font-medium"
              />
              <svg className="absolute left-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>

          {/* Right Area: Alerts & Active User profile */}
          <div className="flex items-center gap-3.5 relative">
            
            {/* Notifications Bell */}
            <button
              onClick={() => {
                setShowNotificationsDropdown(!showNotificationsDropdown);
                setNotificationsCount(0);
              }}
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 flex items-center justify-center relative transition-all cursor-pointer"
            >
              <Bell size={18} />
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {notificationsCount}
                </span>
              )}
            </button>

            {/* User Profile */}
            <div 
              onClick={() => setActiveTab("profile")}
              className="flex items-center gap-3 cursor-pointer border border-transparent hover:border-slate-100 p-1 rounded-xl transition-all"
              title="View Safety Reports & Audits"
            >
              <div className="text-right hidden sm:block">
                <div className="font-extrabold text-xs text-slate-900 leading-none">Raja</div>
                <div className="text-[10px] text-slate-400 font-bold mt-1">Site Supervisor</div>
              </div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRYtZV2HS_rN58yJp0KxYS3Fv8IkTxdfKPW_Mr7p2nhx9P_dipqlLRJiaGrZ-1ziw4CO56HMLx5wD1Jb-t2qLQ0zX0mpCwMwOX3AiJsCPrnttgYYJvB75vWUCqFTba1aV3g5ns4DS-W1ap9aQCyTTqQp3hjtx4zv4Xk_kAC3xYtnN7BjbXGMzYBOlKQuGJBhlr6TuUU_-dGDXqRMUAk0BgtJ21RHm4y56CNBOo9VIT5Lkd8nXuMLg"
                alt="Raja Profile"
                className="w-9 h-9 rounded-full border-2 border-[#3B82F6] object-cover shadow-sm"
              />
            </div>

            {/* Notifications dropdown menu */}
            {showNotificationsDropdown && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-150 py-3 z-50 animate-fade-in space-y-2">
                <div className="px-4 pb-2 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">Safety Alerts</span>
                  <span className="text-[10px] font-semibold text-[#3B82F6] hover:underline cursor-pointer">Mark all read</span>
                </div>
                <div className="divide-y divide-slate-50 text-xs">
                  <div className="px-4 py-2.5 hover:bg-slate-50 space-y-1">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Incident Closed</span>
                      <span className="text-[9px] text-slate-400">10m ago</span>
                    </div>
                    <p className="text-slate-500 leading-normal">Azimuddin resolved the blocked walkway on Loading Dock 4.</p>
                  </div>
                  <div className="px-4 py-2.5 hover:bg-slate-50 space-y-1">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Quiz Unlocked</span>
                      <span className="text-[9px] text-slate-400">1h ago</span>
                    </div>
                    <p className="text-slate-500 leading-normal">Complete the review checklist to attempt the July Forklift assessment.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Viewport content area */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-8 overflow-x-hidden">
          {activeTab === "home" && (
            <HomeView 
              observations={observations} 
              leaderboard={leaderboard} 
              onNavigate={handleCustomNavigate}
              safetyScore={computedSafetyScore}
            />
          )}
          {activeTab === "dashboard" && (
            <DashboardView 
              observations={observations} 
              leaderboard={leaderboard} 
            />
          )}
          {activeTab === "add" && (
            <ObservationView 
              onSubmit={handleAddObservation} 
              initialParams={navParams}
            />
          )}
          {activeTab === "learning" && (
            <LearningView 
              trainingModules={trainingModules} 
              onCompleteTraining={handleCompleteTraining} 
            />
          )}
          {activeTab === "profile" && (
            <ReportView 
              reports={monthlyReports} 
              onSubmitReport={handleAddMonthlyReport} 
            />
          )}
        </main>
      </div>

      {/* Bottom Sticky Tab Navigation Bar - Visible on Mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A] border-t border-slate-850 h-16 flex items-center justify-around shadow-2xl px-2">
        {/* Home */}
        <button
          onClick={() => { setActiveTab("home"); setNavParams({}); }}
          className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all cursor-pointer ${
            activeTab === "home" ? "text-white scale-105 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Home size={20} className={activeTab === "home" ? "text-[#3B82F6]" : "text-slate-400"} />
          <span className="text-[9px] mt-1 font-bold tracking-wide">Home</span>
        </button>

        {/* Dashboard */}
        <button
          onClick={() => { setActiveTab("dashboard"); setNavParams({}); }}
          className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all cursor-pointer ${
            activeTab === "dashboard" ? "text-white scale-105 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <BarChart3 size={20} className={activeTab === "dashboard" ? "text-[#3B82F6]" : "text-slate-400"} />
          <span className="text-[9px] mt-1 font-bold tracking-wide">Analytics</span>
        </button>

        {/* Styled Plus button */}
        <button
          onClick={() => { setActiveTab("add"); setNavParams({}); }}
          className={`w-11 h-11 rounded-full bg-[#3B82F6] text-white flex items-center justify-center shadow-lg active:scale-90 transition-all -translate-y-2 cursor-pointer ${
            activeTab === "add" ? "ring-4 ring-[#3B82F6]/30" : ""
          }`}
        >
          <Plus size={22} />
        </button>

        {/* Learning */}
        <button
          onClick={() => { setActiveTab("learning"); setNavParams({}); }}
          className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all cursor-pointer ${
            activeTab === "learning" ? "text-white scale-105 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <GraduationCap size={20} className={activeTab === "learning" ? "text-[#3B82F6]" : "text-slate-400"} />
          <span className="text-[9px] mt-1 font-bold tracking-wide">Learning</span>
        </button>

        {/* Reports */}
        <button
          onClick={() => { setActiveTab("profile"); setNavParams({}); }}
          className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all cursor-pointer ${
            activeTab === "profile" ? "text-white scale-105 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileText size={20} className={activeTab === "profile" ? "text-[#3B82F6]" : "text-slate-400"} />
          <span className="text-[9px] mt-1 font-bold tracking-wide">Reports</span>
        </button>
      </nav>
    </div>
  );
}
