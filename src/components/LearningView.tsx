import React, { useState } from "react";
import { TrainingModule } from "../types";
import { 
  Play, 
  GraduationCap, 
  Award, 
  BookOpen, 
  CheckCircle, 
  HelpCircle, 
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw
} from "lucide-react";

interface LearningViewProps {
  trainingModules: TrainingModule[];
  onCompleteTraining: (moduleId: string) => void;
}

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What is the maximum speed limit for forklifts in pedestrian zones at TVS warehouses?",
    options: ["5 km/h (Walking Speed)", "15 km/h", "25 km/h", "No specific limit"],
    correctIdx: 0,
    explanation: "Forklifts must slow down to a maximum of 5 km/h in shared pedestrian areas to allow sufficient stopping distance."
  },
  {
    id: 2,
    question: "What should a forklift operator do when approaching a blind aisle intersection?",
    options: [
      "Keep driving at constant speed",
      "Flash the headlights only",
      "Sound the horn and slow down completely",
      "Decline the right-of-way and reverse"
    ],
    correctIdx: 2,
    explanation: "Sounding the horn alert is mandatory at all blind intersections and crossings to warn pedestrians."
  },
  {
    id: 3,
    question: "Who has the absolute legal right-of-way in industrial warehouse lanes?",
    options: [
      "Forklifts carrying heavy loads",
      "All pedestrians",
      "Maintenance technicians only",
      "Vehicles returning to charger stations"
    ],
    correctIdx: 1,
    explanation: "Pedestrians ALWAYS have the absolute right of way in all industrial facilities."
  }
];

export const LearningView: React.FC<LearningViewProps> = ({
  trainingModules,
  onCompleteTraining
}) => {
  const [activeTab, setActiveTab] = useState<"assigned" | "certificates">("assigned");
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [checklist, setChecklist] = useState({
    forkStability: false,
    speedLimits: false,
    loadingDock: false,
    hornCrossing: false,
  });

  // Quiz States
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const [activeCertificatesCount, setActiveCertificatesCount] = useState(12);

  const handleQuizAnswer = (optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedOption(optionIdx);
  };

  const handleNextQuestion = () => {
    // Check answer correctness
    if (selectedOption === QUIZ_QUESTIONS[currentQuestionIdx].correctIdx) {
      setQuizScore(prev => prev + 1);
    }
    
    setQuizSubmitted(true);
  };

  const proceedNextOrFinish = () => {
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setQuizSubmitted(false);
    } else {
      setQuizCompleted(true);
      // If perfect score, let's award a certificate!
      if (quizScore + (selectedOption === QUIZ_QUESTIONS[currentQuestionIdx].correctIdx ? 1 : 0) === QUIZ_QUESTIONS.length) {
        setActiveCertificatesCount(prev => prev + 1);
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setQuizScore(0);
    setQuizSubmitted(false);
    setQuizCompleted(false);
    setQuizActive(true);
  };

  // Checklist toggle helper
  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked = Object.values(checklist).every(v => v);

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-4xl mx-auto">
      {/* Monthly Safety Theme Featured Video banner */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-md border border-slate-800 text-white relative">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 max-w-xl">
            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border border-amber-500/30">
              Monthly Theme: Forklift & Pedestrian Safety
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight leading-snug">
              July: MHE Safety Essentials & Collision Prevention
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Forklift operations are high-risk. Watch our 5-minute refresher training module, complete the quick review checklist, and pass the safety quiz to renew your operating license.
            </p>

            {/* Checklist */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Required Review Checklist
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { key: "forkStability", label: "Verify Load Stability" },
                  { key: "speedLimits", label: "Enforce 5 km/h limit" },
                  { key: "loadingDock", label: "Check Loading Dock clear" },
                  { key: "hornCrossing", label: "Sound Horn at Crosswalks" }
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={checklist[item.key as keyof typeof checklist]}
                      onChange={() => toggleCheck(item.key as keyof typeof checklist)}
                      className="rounded text-[#3B82F6] bg-slate-850 border-slate-700 focus:ring-offset-slate-950 focus:ring-[#3B82F6]"
                    />
                    <span className={checklist[item.key as keyof typeof checklist] ? "text-emerald-300 line-through font-semibold" : "text-slate-300"}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            {/* Visual Banner placeholder */}
            <div className="relative rounded-xl overflow-hidden aspect-[16/10] w-full md:w-64 bg-slate-850 group flex items-center justify-center border border-slate-700/60">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=640" 
                alt="Forklift safety theme"
                className="w-full h-full object-cover opacity-50 group-hover:scale-105 duration-300"
              />
              <button 
                onClick={() => setShowVideoPlayer(true)}
                className="absolute w-14 h-14 bg-white/90 text-slate-900 rounded-full flex items-center justify-center hover:bg-white active:scale-95 transition-all shadow-lg"
              >
                <Play size={24} className="fill-slate-900 text-slate-900 ml-1" />
              </button>
            </div>

            <button
              onClick={() => { setQuizActive(true); setQuizCompleted(false); setQuizSubmitted(false); setCurrentQuestionIdx(0); setSelectedOption(null); }}
              disabled={!allChecked}
              className={`w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 tracking-wide transition-all ${
                allChecked 
                  ? "bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white shadow-md" 
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <Award size={14} />
              Take Assessment
            </button>
            {!allChecked && (
              <span className="text-[10px] text-center text-amber-300 font-semibold">
                *Complete all 4 checklist tasks to unlock quiz
              </span>
            )}
          </div>
        </div>

        {/* In-app simulated video player modal overlay */}
        {showVideoPlayer && (
          <div className="absolute inset-0 bg-slate-950 flex flex-col justify-between z-20 p-6 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-[#3B82F6]">Playing: MHE Pedestrian Safety Refresher</span>
              <button 
                onClick={() => setShowVideoPlayer(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close Video
              </button>
            </div>
            <div className="flex-grow flex items-center justify-center relative">
              {/* Simulated video playback progress */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6] flex items-center justify-center mx-auto animate-ping">
                  <Play size={32} className="text-[#3B82F6] fill-[#3B82F6]" />
                </div>
                <p className="text-xs text-slate-400">Refresher Course Video is Playing... (Simulated Stream)</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#3B82F6] h-full w-2/3 animate-pulse" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>01:45</span>
                <span>03:00</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* COMPLIANCE STATUS STATS */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-[#3B82F6] rounded-2xl">
            <Award size={24} />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest">
              My Compliance Status
            </h4>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-950">{activeCertificatesCount}</span>
              <span className="text-xs font-semibold text-slate-500">Active Certificates</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab(activeTab === "certificates" ? "assigned" : "certificates")}
          className="text-xs font-extrabold text-[#3B82F6] border border-[#3B82F6]/25 hover:bg-blue-550/5 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all cursor-pointer"
        >
          {activeTab === "certificates" ? "View Assigned Modules" : "View Active Certificates"}
        </button>
      </div>

      {/* QUIZ INTERACTIVE OVERLAY */}
      {quizActive && (
        <div className="bg-white border-2 border-[#3B82F6]/30 rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden animate-fade-in">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 text-[#3B82F6]/10 opacity-20 pointer-events-none">
            <HelpCircle size={100} />
          </div>

          {!quizCompleted ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-extrabold text-[#3B82F6] uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-md">
                  Question {currentQuestionIdx + 1} of {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  Score: {quizScore}
                </span>
              </div>

              <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                {QUIZ_QUESTIONS[currentQuestionIdx].question}
              </h4>

              <div className="space-y-2 pt-2">
                {QUIZ_QUESTIONS[currentQuestionIdx].options.map((opt, oIdx) => {
                  const isSelected = selectedOption === oIdx;
                  let optStyle = "border-slate-200 hover:bg-slate-50";
                  if (isSelected) {
                    optStyle = "border-[#3B82F6] bg-blue-50/40 text-[#1E293B] font-semibold";
                  }
                  if (quizSubmitted) {
                    const isCorrect = oIdx === QUIZ_QUESTIONS[currentQuestionIdx].correctIdx;
                    if (isCorrect) {
                      optStyle = "border-emerald-600 bg-emerald-100/70 text-emerald-950 font-bold";
                    } else if (isSelected) {
                      optStyle = "border-red-500 bg-red-100/70 text-red-950 font-medium";
                    } else {
                      optStyle = "border-slate-200 opacity-55";
                    }
                  }

                  return (
                    <button
                       key={oIdx}
                      type="button"
                      disabled={quizSubmitted}
                      onClick={() => handleQuizAnswer(oIdx)}
                      className={`w-full text-left p-3.5 border rounded-xl text-xs transition-all ${optStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Explanatory text */}
              {quizSubmitted && (
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs text-slate-600 space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-700" />
                    Explanation
                  </div>
                  <p>{QUIZ_QUESTIONS[currentQuestionIdx].explanation}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuizActive(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>

                {!quizSubmitted ? (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    disabled={selectedOption === null}
                    className="bg-[#3B82F6] text-white px-5 py-2 rounded-xl text-xs font-bold hover:brightness-110 disabled:opacity-50 cursor-pointer"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={proceedNextOrFinish}
                    className="bg-[#3B82F6] text-white px-5 py-2 rounded-xl text-xs font-bold hover:brightness-110 cursor-pointer"
                  >
                    {currentQuestionIdx === QUIZ_QUESTIONS.length - 1 ? "Finish Assessment" : "Next Question"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto text-[#3B82F6] animate-bounce">
                <Award size={36} />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900">
                  Assessment Completed!
                </h4>
                <p className="text-xs text-slate-500">
                  You scored <span className="font-extrabold text-slate-950">{quizScore} out of {QUIZ_QUESTIONS.length}</span> on the Forklift Safety challenge.
                </p>
              </div>

              {quizScore === QUIZ_QUESTIONS.length ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 max-w-sm mx-auto text-[11px] text-emerald-900 font-bold flex items-center gap-2 justify-center">
                  <Sparkles size={14} />
                  Perfect score! Your certificate has been updated.
                </div>
              ) : (
                <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 max-w-sm mx-auto text-[11px] text-slate-700 font-medium flex items-center gap-2 justify-center">
                  <AlertTriangle size={14} className="text-amber-600" />
                  Score of 3/3 required to unlock the gold badge.
                </div>
              )}

              <div className="flex justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={restartQuiz}
                  className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-slate-200 cursor-pointer"
                >
                  <RefreshCw size={12} />
                  Retake Quiz
                </button>
                <button
                  type="button"
                  onClick={() => setQuizActive(false)}
                  className="bg-[#3B82F6] text-white px-5 py-2 rounded-xl text-xs font-bold hover:brightness-110 cursor-pointer"
                >
                  Return to Portal
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ACTIVE CERTIFICATES / ASSIGNED TRAINING TABS */}
      {activeTab === "assigned" ? (
        <div className="space-y-3">
          <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
            Assigned Training Modules
          </h4>

          <div className="space-y-3">
            {trainingModules.map((module) => (
              <div 
                key={module.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in"
              >
                <div className="space-y-1.5 flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                      {module.type.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-bold text-slate-450 flex items-center gap-1">
                      <Clock size={12} />
                      {module.timeLeft}
                    </span>
                  </div>
                  <h5 className="text-sm font-extrabold text-slate-950">{module.title}</h5>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xl">{module.description}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-start">
                  <div className="w-32 space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>Progress</span>
                      <span>{module.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/40">
                      <div className="bg-[#3B82F6] h-full rounded-full" style={{ width: `${module.progress}%` }} />
                    </div>
                  </div>

                  <button
                    onClick={() => onCompleteTraining(module.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      module.progress === 100 
                        ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-100" 
                        : "bg-[#3B82F6] hover:brightness-110 text-white shadow-sm"
                    }`}
                  >
                    {module.progress === 100 ? "Completed" : "Resume"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
            Active Compliance Certificates
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "MHE Forklift Class I-V Operator", code: "CERT-MHE-9832", expiry: "August 2025" },
              { title: "Class A / B Fire Warden Protocol", code: "CERT-FW-1029", expiry: "December 2024" },
              { title: "Chemical Hazard Communication standard", code: "CERT-HAZ-2283", expiry: "March 2026" },
              { title: "Behavioral-Based Safety (BBS) Practitioner", code: "CERT-BBS-7742", expiry: "June 2025" },
              { title: "High-Rise Vertical Fall Arrest Rigging", code: "CERT-RIG-3819", expiry: "July 2025" },
              { title: "Loading Dock Advanced Control", code: "CERT-LDC-4491", expiry: "October 2025" }
            ].map((cert, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 p-4 rounded-xl flex justify-between items-start shadow-sm hover:border-slate-300 transition-all">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 block">{cert.code}</span>
                  <h5 className="text-xs font-bold text-slate-900 leading-snug">{cert.title}</h5>
                  <span className="text-[10px] text-slate-500 block font-medium">Expires: {cert.expiry}</span>
                </div>
                <span className="p-1 bg-emerald-50 text-emerald-700 rounded-lg shrink-0">
                  <CheckCircle size={14} />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Goal Progress */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h5 className="text-sm font-bold text-slate-900">Weekly Training Goal</h5>
          <p className="text-xs text-slate-400 font-medium">Aim for at least 5 hours of safety instruction per week.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-lg font-bold text-slate-950 block">4h Completed</span>
            <span className="text-[10px] font-semibold text-slate-400">1h Remaining</span>
          </div>
          <div className="w-14 h-14 rounded-full border-4 border-[#3B82F6] border-r-slate-100 flex items-center justify-center font-bold text-xs text-[#3B82F6]">
            80%
          </div>
        </div>
      </div>
    </div>
  );
};
