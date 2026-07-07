import React, { useState, useEffect } from "react";
import { Sparkles, Upload, Clock, ShieldAlert, CheckCircle2, ChevronRight, History } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "SUBMITTED" | "VERIFIED" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED";
  estimatedDays: number;
  imageUrl?: string;
  createdAt: string;
}

export const ComplaintDesk: React.FC = () => {
  const { t, translateDynamic } = useLanguage();
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [complaintsHistory, setComplaintsHistory] = useState<Complaint[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("smart_bharat_complaints");
    if (saved) {
      const parsed = JSON.parse(saved);
      setComplaintsHistory(parsed);
      if (parsed.length > 0) {
        setActiveComplaint(parsed[parsed.length - 1]);
      }
    } else {
      // Load initial mock complaint
      const initial: Complaint = {
        id: "comp-4589",
        title: "Potholes on Sector 5 Main Road",
        description: "Large potholes causing traffic gridlocks and minor accidents near the main crossing.",
        category: "Infrastructure",
        department: "PWD (Public Works Department)",
        priority: "HIGH",
        status: "IN_PROGRESS",
        estimatedDays: 5,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=256&auto=format&fit=crop"
      };
      setComplaintsHistory([initial]);
      setActiveComplaint(initial);
      localStorage.setItem("smart_bharat_complaints", JSON.stringify([initial]));
    }
  }, []);

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      if (!description) {
        setDescription(`Civic issue screenshot uploaded: ${e.target.files[0].name}. Broken facilities need urgent repair.`);
      }
    }
  };

  const handleLodgeComplaint = async () => {
    if (!description.trim()) return;
    setLoading(true);

    // Simulate AI vision/text parsing
    await new Promise((resolve) => setTimeout(resolve, 2200));

    const lowercase = description.toLowerCase();
    let title = "Civic Facility Report";
    let department = "Municipal Corporation";
    let priority: Complaint["priority"] = "MEDIUM";
    let category = "General Services";
    let estimatedDays = 7;

    if (lowercase.includes("road") || lowercase.includes("pothole") || lowercase.includes("highway")) {
      title = "Road Damage & Potholes near Colony Crossing";
      department = "Public Works Department (PWD)";
      priority = "HIGH";
      category = "Roads & Highways";
      estimatedDays = 5;
    } else if (lowercase.includes("light") || lowercase.includes("electricity") || lowercase.includes("street light")) {
      title = "Street Light Malfunction & Dark Alley Hazard";
      department = "State Electricity Board / Municipal Lighting Div";
      priority = "MEDIUM";
      category = "Electrical Grid Services";
      estimatedDays = 3;
    } else if (lowercase.includes("garbage") || lowercase.includes("trash") || lowercase.includes("waste")) {
      title = "Garbage Accumulation & Unchecked Waste Disposal";
      department = "Municipal Solid Waste Management Office";
      priority = "HIGH";
      category = "Sanitation & Waste Management";
      estimatedDays = 2;
    } else if (lowercase.includes("water") || lowercase.includes("leak") || lowercase.includes("pipeline")) {
      title = "Broken Water Pipeline & Minor Flooding";
      department = "Jal Board / Municipal Water Distribution Desk";
      priority = "CRITICAL";
      category = "Water Supply Services";
      estimatedDays = 1;
    }

    const newComplaint: Complaint = {
      id: `comp-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      description,
      category,
      department,
      priority,
      status: "SUBMITTED",
      estimatedDays,
      createdAt: new Date().toLocaleDateString(),
      imageUrl: selectedFile 
        ? "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=256&auto=format&fit=crop" 
        : undefined
    };

    const updated = [...complaintsHistory, newComplaint];
    setComplaintsHistory(updated);
    setActiveComplaint(newComplaint);
    localStorage.setItem("smart_bharat_complaints", JSON.stringify(updated));
    
    // Reset Form
    setDescription("");
    setSelectedFile(null);
    setLoading(false);
  };

  // Timeline Step calculation helpers
  const steps = [
    { label: "Submitted", status: "SUBMITTED", desc: "Complaint successfully registered on our portal." },
    { label: "Verified", status: "VERIFIED", desc: "AI audit confirmed coordinate location details and description." },
    { label: "Assigned", status: "ASSIGNED", desc: "Ticket routed to the designated officer." },
    { label: "In Progress", status: "IN_PROGRESS", desc: "Ground-level inspection or repair works underway." },
    { label: "Resolved", status: "RESOLVED", desc: "Task resolved. Verification image submitted by department." }
  ];

  const getStepIndex = (status: Complaint["status"]) => {
    return steps.findIndex(step => step.status === status);
  };

  const currentStepIdx = activeComplaint ? getStepIndex(activeComplaint.status) : 0;

  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/15 via-accent/10 to-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-space text-slate-800 tracking-wider flex items-center gap-2">
              <Sparkles className="text-primary animate-pulse" />
              {t("navComplaints").toUpperCase()} & TIMELINE
            </h2>
            <p className="text-sm text-slate-650 leading-relaxed">
              {translateDynamic("Lodge a grievance with natural language description or photo. The AI automatically registers the department, sets priority, estimates resolution hours, and tracks updates on an interactive timeline.")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Create / Lodge Complaint */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 flex flex-col space-y-4 shadow-sm bg-white">
          <h3 className="text-sm font-bold font-space text-slate-800 uppercase tracking-wider">
            {t("headGrievance")}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {translateDynamic("Describe the problem")}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example: The street light outside house 45 in Sector 5 is not working for 3 days and it's dangerous at night..."
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
              />
            </div>

            {/* Photo upload mock */}
            <div className="border-2 border-dashed border-slate-200 hover:border-primary/45 rounded-xl p-6 text-center cursor-pointer transition-all bg-slate-50">
              <input
                type="file"
                id="complaint-photo"
                className="hidden"
                accept="image/*"
                onChange={handleUploadChange}
              />
              <label htmlFor="complaint-photo" className="cursor-pointer space-y-1.5 block">
                <Upload className="mx-auto text-slate-400" size={20} />
                <p className="text-xs text-slate-600 font-medium">
                  {selectedFile ? `Selected: ${selectedFile.name}` : translateDynamic("Attach photos of potholes, leakage, street light, etc.")}
                </p>
                <p className="text-[10px] text-slate-450 font-poppins">Supports PNG, JPG up to 10MB</p>
              </label>
            </div>

            <button
              onClick={handleLodgeComplaint}
              disabled={loading || !description.trim()}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-poppins font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                  Generating Ticket with AI Heuristics...
                </>
              ) : (
                <>
                  <Sparkles size={14} /> {translateDynamic("Submit Civic Grievance")}
                </>
              )}
            </button>
          </div>

          {/* User complaints history log */}
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <History size={12} className="text-primary" /> {translateDynamic("Grievance Submission Log")}
            </h4>
            <div className="max-h-[120px] overflow-y-auto space-y-2 pr-1">
              {complaintsHistory.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => setActiveComplaint(comp)}
                  className={`
                    w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between
                    ${activeComplaint?.id === comp.id 
                      ? "bg-slate-100 border-slate-200 text-slate-800" 
                      : "bg-slate-50/50 border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"}
                  `}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold truncate">{translateDynamic(comp.title)}</span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">{comp.id} • {comp.createdAt}</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-450" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Tracking Timeline */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 flex flex-col space-y-5 shadow-sm bg-white">
          {activeComplaint ? (
            <>
              {/* Ticket metadata header */}
              <div className="border-b border-slate-200 pb-4 flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-primary tracking-widest font-bold uppercase">
                    TICKET ID: {activeComplaint.id}
                  </span>
                  <h3 className="text-base font-bold font-space text-slate-800 leading-snug">
                    {translateDynamic(activeComplaint.title)}
                  </h3>
                  <p className="text-xs text-slate-550 font-poppins">
                    Department: <strong className="text-slate-650 font-medium">{translateDynamic(activeComplaint.department)}</strong>
                  </p>
                </div>
                
                <span className={`
                  px-2.5 py-0.5 rounded-full text-[10px] border font-bold font-poppins shrink-0
                  ${activeComplaint.priority === "CRITICAL" 
                    ? "bg-danger/20 text-danger border-danger/30 animate-pulse" 
                    : activeComplaint.priority === "HIGH" 
                      ? "bg-danger/10 text-danger border-danger/20" 
                      : "bg-warning/10 text-warning border-warning/20"}
                `}>
                  {activeComplaint.priority} PRIORITY
                </span>
              </div>

              {/* Status Tracker Description */}
              <p className="text-xs text-slate-600 font-poppins bg-slate-50 border border-slate-200/60 p-3 rounded-lg leading-relaxed">
                {translateDynamic(activeComplaint.description)}
              </p>

              {/* Estimated days info */}
              <div className="flex items-center space-x-3 text-xs bg-slate-50 border border-slate-200/60 p-3 rounded-xl">
                <Clock size={16} className="text-primary shrink-0" />
                <span className="text-slate-600 font-poppins">
                  {translateDynamic("Estimated resolution time:")} <strong className="text-slate-800">{activeComplaint.estimatedDays} Days</strong>
                </span>
              </div>

              {/* Steps timeline layout */}
              <div className="relative pl-6 space-y-5 border-l border-slate-200/60 ml-3 py-1 flex-1">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  
                  return (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <span className={`
                        absolute -left-[30px] top-1 h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center transition-all duration-300
                        ${isCompleted 
                          ? "bg-success border-success text-white scale-110 shadow-sm shadow-success/20" 
                          : "bg-white border-slate-300 text-transparent"}
                      `}>
                        {isCompleted && <CheckCircle2 size={10} className="stroke-[3]" />}
                      </span>

                      <div className="space-y-0.5">
                        <h4 className={`
                          text-xs font-semibold font-poppins
                          ${isCurrent ? "text-primary" : isCompleted ? "text-slate-800" : "text-slate-400"}
                        `}>
                          {translateDynamic(step.label)}
                          {isCurrent && (
                            <span className="ml-2 inline-block px-1.5 py-0.2 rounded bg-primary/10 text-[8px] text-primary tracking-widest uppercase">
                              {translateDynamic("Active Stage")}
                            </span>
                          )}
                        </h4>
                        <p className="text-[10px] text-slate-500 leading-normal">
                          {translateDynamic(step.desc)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-450 text-center py-10">
              <ShieldAlert className="text-slate-400 mb-2 animate-pulse" size={28} />
              <h4 className="text-sm font-semibold text-slate-800 font-space">{translateDynamic("No Complaint Active")}</h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                {translateDynamic("Select a grievance entry from the log history or file a new report to trigger interactive timeline progress updates.")}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
