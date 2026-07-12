import React, { useState, useEffect } from "react";
import { Observation, ObservationCategory, RiskLevel } from "../types";
import { 
  Mic, 
  MicOff, 
  AlertTriangle, 
  Info, 
  MapPin, 
  Building2, 
  Camera, 
  Upload, 
  Send, 
  Sparkles,
  CheckCircle,
  HelpCircle,
  Plus
} from "lucide-react";

interface ObservationViewProps {
  onSubmit: (observation: Omit<Observation, "id" | "date" | "reporter" | "status">) => void;
  initialParams?: {
    initialCategory?: ObservationCategory;
    initialRisk?: RiskLevel;
  };
}

const PRESET_VOICE_TRANSCRIPTS = [
  {
    label: "Oil Spill / Walkway (Condition)",
    text: "There is a massive oil spill on the central walkway of Main Warehouse A. It is very slippery and poses an immediate slip hazard for the forklift operators and staff."
  },
  {
    label: "No PPE / Hardhat (Act)",
    text: "One of the workers was spotted operating the heavy forklift in Assembly Line 2 without wearing his helmet and reflective vest, which is a clear violation of safety protocols."
  },
  {
    label: "Almost Tripped (Near Miss)",
    text: "I was carrying boxes through Loading Dock 4 and almost fell over a bundle of loose packing wire left right in front of the door. A close call!"
  },
  {
    label: "Organized Workspace (Good Practice)",
    text: "The Chemical Storage zone is beautifully organized today. All hazardous chemicals are correctly labeled, and safety binders are fully accessible. Terrific work!"
  },
  {
    label: "BBS Dialogue (BBS Coaching)",
    text: "I conducted a brief peer coaching dialogue with Azimuddin regarding correct posture during pallet stacking. He acknowledged the tips and adjusted his lifting posture."
  }
];

export const ObservationView: React.FC<ObservationViewProps> = ({
  onSubmit,
  initialParams
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ObservationCategory | "">("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Main Warehouse A");
  const [department, setDepartment] = useState("Logistics");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("low");
  const [evidenceName, setEvidenceName] = useState<string>("");
  const [evidenceType, setEvidenceType] = useState<"photo" | "file" | undefined>(undefined);

  // AI voice-assistant state
  const [isListening, setIsRecording] = useState(false);
  const [customSpokenText, setCustomSpokenText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiActionSuggested, setAiActionSuggested] = useState("");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Apply initial parameters from navigation
  useEffect(() => {
    if (initialParams) {
      if (initialParams.initialCategory) {
        setCategory(initialParams.initialCategory);
      }
      if (initialParams.initialRisk) {
        setRiskLevel(initialParams.initialRisk);
      }
    }
  }, [initialParams]);

  // Handle Mock Speech Transcript Submission
  const handleProcessVoiceInput = async (spokenText: string) => {
    setIsProcessing(true);
    setNotification(null);
    try {
      const response = await fetch("/api/categorize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ description: spokenText })
      });

      if (!response.ok) {
        throw new Error("Server failed to categorize safety observation.");
      }

      const data = await response.json();
      
      // Auto-populate fields dynamically based on Gemini response!
      setTitle(data.title || "Safety Observation");
      setCategory(data.category as ObservationCategory);
      setDescription(data.description || spokenText);
      setRiskLevel(data.riskLevel as RiskLevel || "medium");
      setAiActionSuggested(data.suggestedAction || "");

      // Smart heuristic defaults for demo if locations match
      const textLower = spokenText.toLowerCase();
      if (textLower.includes("warehouse")) setLocation("Main Warehouse A");
      else if (textLower.includes("dock") || textLower.includes("bay")) setLocation("Loading Dock 4");
      else if (textLower.includes("assembly") || textLower.includes("line")) setLocation("Assembly Line 2");
      else if (textLower.includes("chemical")) setLocation("Chemical Storage");
      else if (textLower.includes("office")) setLocation("Office Block");

      if (textLower.includes("logistics")) setDepartment("Logistics");
      else if (textLower.includes("maintenance")) setDepartment("Maintenance");
      else if (textLower.includes("operations")) setDepartment("Operations");
      else if (textLower.includes("hse") || textLower.includes("safety")) setDepartment("HSE Team");
      else if (textLower.includes("quality")) setDepartment("Quality Control");

      setNotification({
        type: "success",
        message: `AI categorized successfully! Category set to: ${data.category.replace("_", " ")}`
      });
    } catch (error: any) {
      console.error(error);
      setNotification({
        type: "error",
        message: "Failed to parse spoken text using AI. Please enter manually."
      });
    } finally {
      setIsProcessing(false);
      setIsRecording(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      // Stop listening and parse what we have
      if (customSpokenText.trim()) {
        handleProcessVoiceInput(customSpokenText);
      } else {
        setIsRecording(false);
      }
    } else {
      setIsRecording(true);
      setCustomSpokenText("");
    }
  };

  const triggerPresetTranscript = (text: string) => {
    setCustomSpokenText(text);
    handleProcessVoiceInput(text);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setNotification({ type: "error", message: "Please provide an observation title." });
      return;
    }
    if (!category) {
      setNotification({ type: "error", message: "Please select an observation category." });
      return;
    }
    if (!description.trim()) {
      setNotification({ type: "error", message: "Please provide a detailed description." });
      return;
    }

    onSubmit({
      title,
      category,
      description,
      location,
      department,
      riskLevel,
      evidenceType,
      evidenceName,
      suggestedAction: aiActionSuggested || undefined
    });

    // Reset fields on success
    setTitle("");
    setCategory("");
    setDescription("");
    setAiActionSuggested("");
    setEvidenceName("");
    setEvidenceType(undefined);
    setNotification({ type: "success", message: "Observation logged successfully!" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Mock taking a photo or uploading a file
  const triggerEvidenceMock = (type: "photo" | "file") => {
    setEvidenceType(type);
    if (type === "photo") {
      setEvidenceName(`IMG_SAFETY_${Math.floor(1000 + Math.random() * 9000)}.JPG`);
    } else {
      setEvidenceName(`DOC_HAZARD_${Math.floor(100 + Math.random() * 900)}.PDF`);
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-3xl mx-auto">
      {/* Header instructions */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-2xl relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-xl">
          <h2 className="text-xl font-black text-slate-900 mb-1">Quick Reporting</h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Capture safety insights instantly. Use voice for hands-free documentation in the field, or select category options manually below.
          </p>
        </div>
        <div className="absolute -right-6 -top-6 text-[#3B82F6]/5 opacity-20 pointer-events-none">
          <Sparkles size={110} />
        </div>
      </div>

      {/* Floating notifications */}
      {notification && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
          notification.type === "success" 
            ? "bg-emerald-50 border-emerald-100 text-emerald-900" 
            : "bg-red-50 border-red-100 text-red-900"
        }`}>
          <CheckCircle size={18} className={notification.type === "success" ? "text-emerald-600" : "text-red-500"} />
          <span className="text-sm font-semibold">{notification.message}</span>
        </div>
      )}

      {/* AI Voice Assist Module */}
      <div className="bg-[#0F172A] border border-slate-800 p-6 rounded-2xl space-y-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-[#3B82F6]" size={18} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              AI Voice Assisted Input
            </span>
          </div>
          <span className="bg-slate-800 text-[10px] font-bold text-[#3B82F6] px-2 py-0.5 rounded border border-slate-700">
            Powered by Gemini
          </span>
        </div>

        <div className="flex flex-col items-center justify-center text-center py-4 space-y-3">
          <button
            type="button"
            id="voice-mic-btn"
            onClick={handleMicClick}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
              isListening 
                ? "bg-rose-600 animate-pulse text-white ring-4 ring-rose-950" 
                : "bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90 active:scale-95 cursor-pointer"
            }`}
          >
            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </button>
          
          <div className="space-y-1">
            <span className={`text-sm font-bold ${isListening ? "text-rose-400" : "text-[#3B82F6]"}`}>
              {isListening ? "Listening..." : "Tap to Speak"}
            </span>
            <p className="text-xs text-slate-400 max-w-[280px]">
              Speak naturally about any hazards, safe behaviors, or issues you witness.
            </p>
          </div>
        </div>

        {/* Listening Input Simulation */}
        {isListening && (
          <div className="space-y-2 animate-fade-in text-slate-300">
            <label className="text-xs font-semibold text-slate-400 block">
              Spoken Transcript (Simulate or type what you said)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSpokenText}
                onChange={(e) => setCustomSpokenText(e.target.value)}
                placeholder="I noticed a pile of pallet wraps blocking the fire exit..."
                className="flex-grow h-11 px-4 rounded-xl border border-slate-700 text-sm bg-slate-900 text-white placeholder-slate-550 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
              />
              <button
                type="button"
                onClick={() => handleProcessVoiceInput(customSpokenText)}
                disabled={isProcessing || !customSpokenText.trim()}
                className="bg-[#3B82F6] text-white px-4 rounded-xl text-xs font-bold hover:brightness-110 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {isProcessing ? "AI Parsing..." : "Analyze"}
                <Sparkles size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Presets for high-fidelity evaluation */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Or select a simulated safety report transcript below to test Gemini AI:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_VOICE_TRANSCRIPTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => triggerPresetTranscript(preset.text)}
                disabled={isProcessing}
                className="bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 shadow-sm transition-colors text-left cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {isProcessing && (
          <div className="flex items-center justify-center gap-2 py-2 text-[#3B82F6] animate-pulse font-medium text-xs">
            <Sparkles size={16} className="animate-spin" />
            <span>Gemini AI is structuring, evaluating risk, and categorizing safety details...</span>
          </div>
        )}
      </div>

      {/* Manual and populated form fields */}
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
            Observation Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Briefly describe what you saw..."
            className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white text-sm focus:outline-none"
          />
        </div>

        {/* Category Radio Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
            Observation Category
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { id: "unsafe_act", label: "Unsafe Act", icon: <AlertTriangle size={18} /> },
              { id: "unsafe_condition", label: "Unsafe Condition", icon: <AlertTriangle size={18} /> },
              { id: "near_miss", label: "Near Miss", icon: <AlertTriangle size={18} /> },
              { id: "good_practice", label: "Good Practice", icon: <CheckCircle size={18} /> },
              { id: "bbs", label: "BBS Coaching", icon: <HelpCircle size={18} /> }
            ].map(catItem => {
              const active = category === catItem.id;
              return (
                <button
                  key={catItem.id}
                  type="button"
                  onClick={() => setCategory(catItem.id as ObservationCategory)}
                  className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer text-left transition-all ${
                    active 
                      ? "border-[#3B82F6] bg-blue-50/30 text-slate-900 shadow-sm font-semibold" 
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className={active ? "text-[#3B82F6]" : "text-slate-400"}>
                    {catItem.icon}
                  </span>
                  <span className="text-xs font-semibold">{catItem.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
            Detailed Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Explain the observation in detail, including immediate actions taken..."
            className="w-full p-4 rounded-xl border border-slate-200 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white text-sm focus:outline-none"
          />
        </div>

        {/* AI suggested actions banner */}
        {aiActionSuggested && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-slate-900 animate-fade-in">
            <Sparkles size={18} className="text-[#3B82F6] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#3B82F6]">
                AI Suggested Immediate Action
              </span>
              <p className="text-xs font-medium mt-1 leading-relaxed text-slate-700">
                {aiActionSuggested}
              </p>
            </div>
          </div>
        )}

        {/* Location & Department dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
              Location / Site
            </label>
            <div className="relative">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 bg-white text-sm appearance-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
              >
                <option>Main Warehouse A</option>
                <option>Loading Dock 4</option>
                <option>Assembly Line 2</option>
                <option>Chemical Storage</option>
                <option>Office Block</option>
              </select>
              <MapPin size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
              Department
            </label>
            <div className="relative">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 bg-white text-sm appearance-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:outline-none"
              >
                <option>Logistics</option>
                <option>Maintenance</option>
                <option>Operations</option>
                <option>HSE Team</option>
                <option>Quality Control</option>
              </select>
              <Building2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Risk Level Segmented Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
            Risk Level
          </label>
          <div className="bg-slate-50 border border-slate-200/60 p-1 rounded-xl flex gap-1 h-12">
            {[
              { id: "low", label: "Low", color: "text-[#10B981] border-emerald-500 bg-white" },
              { id: "medium", label: "Medium", color: "text-[#3B82F6] border-blue-500 bg-white" },
              { id: "high", label: "High", color: "text-rose-600 border-rose-500 bg-white" },
              { id: "critical", label: "Critical", color: "text-red-700 border-red-600 bg-red-50/50" }
            ].map(levelItem => {
              const active = riskLevel === levelItem.id;
              return (
                <button
                  key={levelItem.id}
                  type="button"
                  onClick={() => setRiskLevel(levelItem.id as RiskLevel)}
                  className={`flex-grow rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                    active 
                      ? `${levelItem.color} shadow-sm border` 
                      : "text-slate-500 hover:bg-slate-200/50"
                  }`}
                >
                  {levelItem.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Evidence & Attachments Upload Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
            Evidence & Attachments
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => triggerEvidenceMock("photo")}
              className={`h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${
                evidenceType === "photo" 
                  ? "border-[#3B82F6] bg-blue-50/20 text-[#1E293B]" 
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Camera size={24} className={evidenceType === "photo" ? "text-[#3B82F6] animate-pulse" : "text-slate-400"} />
              <span className="text-xs font-bold">
                {evidenceType === "photo" ? "Photo Attached" : "Take Photo"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => triggerEvidenceMock("file")}
              className={`h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${
                evidenceType === "file" 
                  ? "border-[#3B82F6] bg-blue-50/20 text-[#1E293B]" 
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Upload size={24} className={evidenceType === "file" ? "text-[#3B82F6] animate-pulse" : "text-slate-400"} />
              <span className="text-xs font-bold">
                {evidenceType === "file" ? "File Attached" : "Upload Photos"}
              </span>
            </button>
          </div>
          {evidenceName && (
            <div className="bg-slate-100/80 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 flex items-center justify-between">
              <span>Attached: {evidenceName} ({evidenceType})</span>
              <button 
                type="button" 
                onClick={() => { setEvidenceName(""); setEvidenceType(undefined); }}
                className="text-red-500 font-bold hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Submit Action */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full h-14 bg-[#3B82F6] text-white font-bold rounded-xl shadow-lg hover:bg-[#3B82F6]/90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send size={18} />
            Submit Observation
          </button>
        </div>
      </form>
    </div>
  );
};
