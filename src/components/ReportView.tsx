import React, { useState } from "react";
import { MonthlyReport } from "../types";
import { 
  FileText, 
  UserCheck, 
  Award, 
  Sliders, 
  Plus, 
  History, 
  Send, 
  Lock, 
  Sparkles,
  ClipboardList,
  FolderOpen
} from "lucide-react";

interface ReportViewProps {
  reports: MonthlyReport[];
  onSubmitReport: (report: MonthlyReport) => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  reports,
  onSubmitReport
}) => {
  const [activeTab, setActiveTab] = useState<"form" | "history">("history");

  // Form State
  const [serviceProvider, setServiceProvider] = useState("Advanced Logistics Corp");
  const [reportingMonth, setReportingMonth] = useState("2024-10");
  const [avgWorkforce, setAvgWorkforce] = useState(100);
  const [totalManHours, setTotalManHours] = useState(20800);
  const [overtimeHours, setOvertimeHours] = useState(1250);
  const [employeesTrained, setEmployeesTrained] = useState(351);
  const [totalTrainingHours, setTotalTrainingHours] = useState(1404);
  const [ppeCompliance, setPpeCompliance] = useState(100);
  const [inspectionsCount, setInspectionsCount] = useState(42);
  const [toolboxTalksCount, setToolboxTalksCount] = useState(19);
  const [nearMissesCount, setNearMissesCount] = useState(0);
  const [accidentsCount, setAccidentsCount] = useState(0);
  const [incidentDetails, setIncidentDetails] = useState("No safety incidents or accidents reported during this period. PPE compliance maintained at 100% across all shifts.");
  const [safetyKaizen, setSafetyKaizen] = useState("Implemented color-coded walkways in Main Warehouse A to separate pedestrian paths from forklift traffic.");
  const [violationsIssued, setViolationsIssued] = useState(4);
  const [generalRemarks, setGeneralRemarks] = useState("Excellent overall performance with perfect safety sheet and zero recordable injuries. Keep up the safety focus.");
  
  const [preparedBy, setPreparedBy] = useState("James Wilson (Safety Supervisor)");
  const [reviewedBy, setReviewedBy] = useState("Sarah Jenkins (HSE Manager)");
  const [approvedBy, setApprovedBy] = useState("Robert Taylor (Site Director)");

  const [notification, setNotification] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent, status: "draft" | "submitted") => {
    e.preventDefault();
    
    const newReport: MonthlyReport = {
      id: `rep-${reportingMonth}-${Date.now()}`,
      serviceProvider,
      reportingMonth,
      avgWorkforce,
      totalManHours,
      overtimeHours,
      employeesTrained,
      totalTrainingHours,
      ppeCompliance,
      inspectionsCount,
      toolboxTalksCount,
      nearMissesCount,
      accidentsCount,
      incidentDetails,
      safetyKaizen,
      violationsIssued,
      generalRemarks,
      preparedBy,
      reviewedBy,
      approvedBy,
      status,
      createdAt: new Date().toISOString()
    };

    onSubmitReport(newReport);
    setNotification(`Monthly report for ${reportingMonth} successfully saved as ${status.toUpperCase()}!`);
    setActiveTab("history");
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // Clear warning banner after 4 seconds
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-4xl mx-auto">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("history")}
          className={`px-5 py-3 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "history" 
              ? "border-[#3B82F6] text-[#3B82F6]" 
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FolderOpen size={16} />
          Report Ledger History
        </button>
        <button
          onClick={() => setActiveTab("form")}
          className={`px-5 py-3 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "form" 
              ? "border-[#3B82F6] text-[#3B82F6]" 
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText size={16} />
          New Report Entry
        </button>
      </div>

      {notification && (
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-slate-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Sparkles size={16} className="text-[#3B82F6] animate-spin" />
          {notification}
        </div>
      )}

      {activeTab === "history" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">Safety Ledgers</h3>
              <p className="text-xs text-slate-400">View and audit previously filed monthly compliance reports</p>
            </div>
          </div>

          <div className="space-y-4">
            {reports.map((rep) => (
              <div 
                key={rep.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold bg-slate-50 text-slate-450 border border-slate-200/80 px-2 py-0.5 rounded">
                      ID: {rep.id}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-950">
                      {rep.serviceProvider} <span className="text-slate-400 font-medium">({rep.reportingMonth})</span>
                    </h4>
                  </div>
                  <span className={`self-start sm:self-center text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${
                    rep.status === "submitted" 
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-100" 
                      : "bg-amber-50 text-amber-800 border border-amber-100"
                  }`}>
                    {rep.status}
                  </span>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block">Avg Workforce</span>
                    <span className="text-slate-900 font-bold text-sm">{rep.avgWorkforce} workers</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Man-Hours</span>
                    <span className="text-slate-900 font-bold text-sm">{rep.totalManHours.toLocaleString()}h</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">PPE Compliance</span>
                    <span className="text-[#3B82F6] font-extrabold text-sm">{rep.ppeCompliance}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Incident Sheet</span>
                    <span className={`font-extrabold text-sm ${rep.accidentsCount > 0 ? "text-red-600" : "text-emerald-700"}`}>
                      {rep.accidentsCount === 0 ? "Perfect (0 Accidents)" : `${rep.accidentsCount} Accidents`}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-2 bg-slate-50/50 p-4 rounded-xl text-xs text-slate-600">
                  <div>
                    <span className="font-bold text-slate-800 block">Incident Commentary</span>
                    <p className="mt-1 leading-relaxed text-slate-700">{rep.incidentDetails}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/40">
                    <span className="font-bold text-slate-800 block">Safety Kaizen Implementation</span>
                    <p className="mt-1 leading-relaxed text-slate-700">{rep.safetyKaizen}</p>
                  </div>
                </div>

                {/* Signatories */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px] font-medium text-slate-400">
                  <div>
                    Prepared By: <span className="text-slate-700 font-bold">{rep.preparedBy}</span>
                  </div>
                  <div>
                    Reviewed By: <span className="text-slate-700 font-bold">{rep.reviewedBy}</span>
                  </div>
                  <div>
                    Approved By: <span className="text-[#3B82F6] font-extrabold">{rep.approvedBy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={(e) => handleSubmit(e, "submitted")} className="space-y-6">
          {/* Security Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4 text-amber-900 shadow-sm">
            <Lock className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800 block">
                Authorized HSE Personnel Only
              </span>
              <p className="text-xs text-amber-900/80 leading-relaxed font-medium">
                Please verify all data entries carefully before submitting. Once filed, monthly records are compiled directly into the parent corporation audit registry.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
            <h4 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <ClipboardList size={18} className="text-[#3B82F6]" />
              General Administration details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Service Provider
                </label>
                <input 
                  type="text"
                  value={serviceProvider}
                  onChange={(e) => setServiceProvider(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Reporting Month
                </label>
                <input 
                  type="month"
                  value={reportingMonth}
                  onChange={(e) => setReportingMonth(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white cursor-pointer focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Avg Workforce size
                </label>
                <input 
                  type="number"
                  value={avgWorkforce}
                  onChange={(e) => setAvgWorkforce(parseInt(e.target.value) || 0)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Total Man-Hours Worked
                </label>
                <input 
                  type="number"
                  value={totalManHours}
                  onChange={(e) => setTotalManHours(parseInt(e.target.value) || 0)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Overtime Man-Hours
                </label>
                <input 
                  type="number"
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(parseInt(e.target.value) || 0)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
            <h4 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Sliders size={18} className="text-[#3B82F6]" />
              Safety & Training Performance indicators
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Employees Trained
                </label>
                <input 
                  type="number"
                  value={employeesTrained}
                  onChange={(e) => setEmployeesTrained(parseInt(e.target.value) || 0)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Total Training Man-Hours
                </label>
                <input 
                  type="number"
                  value={totalTrainingHours}
                  onChange={(e) => setTotalTrainingHours(parseInt(e.target.value) || 0)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
                />
              </div>
            </div>

            {/* PPE slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  PPE Compliance Score
                </label>
                <span className="text-sm font-extrabold text-[#3B82F6]">{ppeCompliance}%</span>
              </div>
              <input 
                type="range"
                min="0"
                max="100"
                value={ppeCompliance}
                onChange={(e) => setPpeCompliance(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Inspections
                </label>
                <input 
                  type="number"
                  value={inspectionsCount}
                  onChange={(e) => setInspectionsCount(parseInt(e.target.value) || 0)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Toolbox Talks
                </label>
                <input 
                  type="number"
                  value={toolboxTalksCount}
                  onChange={(e) => setToolboxTalksCount(parseInt(e.target.value) || 0)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Near Misses
                </label>
                <input 
                  type="number"
                  value={nearMissesCount}
                  onChange={(e) => setNearMissesCount(parseInt(e.target.value) || 0)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Accidents
                </label>
                <input 
                  type="number"
                  value={accidentsCount}
                  onChange={(e) => setAccidentsCount(parseInt(e.target.value) || 0)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
            <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
              Safety commentary & continuous improvement (Kaizen)
            </h4>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                Incident details / Commentary
              </label>
              <textarea 
                value={incidentDetails}
                onChange={(e) => setIncidentDetails(e.target.value)}
                rows={3}
                className="w-full p-4 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                Continuous Safety improvement (Kaizen)
              </label>
              <textarea 
                value={safetyKaizen}
                onChange={(e) => setSafetyKaizen(e.target.value)}
                rows={3}
                className="w-full p-4 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Violations Issued
                </label>
                <input 
                  type="number"
                  value={violationsIssued}
                  onChange={(e) => setViolationsIssued(parseInt(e.target.value) || 0)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  General Remarks / Summary
                </label>
                <input 
                  type="text"
                  value={generalRemarks}
                  onChange={(e) => setGeneralRemarks(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
            <h4 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <UserCheck size={18} className="text-[#3B82F6]" />
              Required Approvals & Verification signatures
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Prepared By (HSE lead)
                </label>
                <input 
                  type="text"
                  value={preparedBy}
                  onChange={(e) => setPreparedBy(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Reviewed By (Operations lead)
                </label>
                <input 
                  type="text"
                  value={reviewedBy}
                  onChange={(e) => setReviewedBy(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Approved By (General Director)
                </label>
                <input 
                  type="text"
                  value={approvedBy}
                  onChange={(e) => setApprovedBy(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "draft")}
              className="flex-1 h-14 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
            >
              Save Draft Ledger
            </button>
            <button
              type="submit"
              className="flex-1 h-14 bg-[#3B82F6] text-white font-bold rounded-xl shadow-lg hover:bg-[#3B82F6]/90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send size={16} />
              Submit Official Ledger
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
