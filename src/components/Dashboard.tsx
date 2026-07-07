import React from "react";
import { Sparkles, Calendar, Bell, FileText, CheckCircle2, ChevronRight, ShieldAlert, Award, FileCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

interface DashboardProps {
  onNavigateTab: (tabId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { t, translateDynamic } = useLanguage();

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return t("greetingMorning");
    if (hrs < 17) return t("greetingAfternoon");
    return t("greetingEvening");
  };

  const tasks = [
    { id: "t-1", title: "Passport Seva Kendra Appointment", date: "Tomorrow, 10:00 AM", status: "upcoming", type: "appointment" },
    { id: "t-2", title: "Scholarship E-KYC Verification Deadline", date: "July 31, 2026", status: "critical", type: "deadline" },
    { id: "t-3", title: "Grievance Ticket #comp-4589 Status Update", date: "Road repairs assigned to ground officer", status: "resolved", type: "update" }
  ];

  const quickActions = [
    { id: "ai-chat", title: "Ask AI Assistant", desc: "Access 24/7 civic help desk support.", icon: Sparkles, color: "from-accent to-secondary" },
    { id: "schemes", title: "Find Eligible Schemes", desc: "Cross-check eligibility factors.", icon: Award, color: "from-secondary to-primary" },
    { id: "complaints", title: "Lodge Grievance", desc: "Report pothole or electrical faults.", icon: FileCheck, color: "from-primary to-accent" },
    { id: "documents", title: "Verify Documents", desc: "Run OCR quality validation checks.", icon: FileText, color: "from-purple-600 to-accent" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Greeting Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-secondary/5 to-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.06),transparent_40%)]" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative">
          <div>
            <h2 className="text-xl font-bold font-space text-slate-800 tracking-wider">
              {getGreeting()}, {user?.fullName || "Rahul"}!
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-lg">
              {translateDynamic("Here is your personalized civic overview. Your documents are verified, and you have one upcoming appointment.")}
            </p>
          </div>
          <button 
            onClick={() => onNavigateTab("ai-chat")}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold font-poppins text-slate-700 transition-all hover:scale-[1.02] shadow-sm"
          >
            <Sparkles size={14} className="text-primary animate-pulse" />
            <span>{translateDynamic("Consult Civic Companion")}</span>
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Quick Actions & Notifications */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Actions Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-space">
              {t("quickActions")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.id}
                    onClick={() => onNavigateTab(act.id)}
                    className="group glass-panel p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 text-left transition-all duration-300 flex items-start gap-4 relative overflow-hidden shadow-sm"
                  >
                    <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-slate-100/30 to-transparent rounded-bl-full pointer-events-none" />
                    <div className={`
                      h-10 w-10 rounded-xl bg-gradient-to-tr ${act.color} flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-110 transition-transform
                    `}>
                      <Icon size={18} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold font-poppins text-slate-800 group-hover:text-primary transition-colors">
                        {translateDynamic(act.title)}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        {translateDynamic(act.desc)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Today's notifications/reminders */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-space flex items-center gap-2">
              <Bell size={14} className="text-primary" />
              {translateDynamic("Grievance and Appointment Alerts")}
            </h3>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  className="flex items-start justify-between p-3.5 bg-white border border-slate-150 rounded-xl hover:border-slate-300 transition-all shadow-sm"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className={`
                      mt-0.5 p-2 rounded-lg shrink-0
                      ${task.status === "upcoming" 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : task.status === "critical" 
                          ? "bg-danger/10 text-danger border border-danger/20" 
                          : "bg-success/10 text-success border border-success/20"}
                    `}>
                      {task.status === "critical" ? <ShieldAlert size={14} /> : <Calendar size={14} />}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-semibold text-slate-800">
                        {translateDynamic(task.title)}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-poppins">
                        {translateDynamic(task.date)}
                      </p>
                    </div>
                  </div>
                  
                  <span className={`
                    text-[9px] px-2 py-0.5 rounded-full font-bold font-poppins shrink-0 uppercase tracking-wider
                    ${task.status === "upcoming" 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : task.status === "critical" 
                        ? "bg-danger/25 text-danger border border-danger/35" 
                        : "bg-success/10 text-success border border-success/20"}
                  `}>
                    {translateDynamic(task.status)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Recommendations & Profile metrics */}
        <div className="space-y-6">
          
          {/* AI suggestions */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-space flex items-center gap-2">
              <Sparkles size={14} className="text-primary animate-pulse" />
              {t("aiRecommendations")}
            </h3>

            <div className="space-y-3">
              <div 
                className="bg-white border border-slate-150 hover:border-primary/45 p-4 rounded-xl space-y-2 cursor-pointer transition-all group shadow-sm"
                onClick={() => onNavigateTab("schemes")}
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors leading-snug">
                    {translateDynamic("Central Sector Scheme of Scholarship")}
                  </h4>
                  <span className="text-[9px] bg-success/10 text-success border border-success/30 px-1.5 py-0.2 rounded font-mono font-bold">
                    90% MATCH
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Provides ₹12,000 yearly allowance. Fully matches undergraduate student parameters.
                </p>
                <span className="text-[9px] text-primary flex items-center gap-1 font-poppins font-medium mt-1">
                  Check eligibility details <ChevronRight size={10} />
                </span>
              </div>

              <div 
                className="bg-white border border-slate-150 hover:border-primary/45 p-4 rounded-xl space-y-2 cursor-pointer transition-all group shadow-sm"
                onClick={() => onNavigateTab("schemes")}
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors leading-snug">
                    {translateDynamic("PM Awas Yojana (PMAY-G)")}
                  </h4>
                  <span className="text-[9px] bg-success/10 text-success border border-success/30 px-1.5 py-0.2 rounded font-mono font-bold">
                    85% MATCH
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Housing subsidy benefit up to ₹1.2 Lakh. Matches household income profiles.
                </p>
                <span className="text-[9px] text-primary flex items-center gap-1 font-poppins font-medium mt-1">
                  Check eligibility details <ChevronRight size={10} />
                </span>
              </div>
            </div>
          </div>

          {/* Verification status card summary */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 space-y-3.5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-space">
              {translateDynamic("Active Documents Audit")}
            </h3>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-white border border-slate-150 rounded-xl shadow-sm">
                <span className="text-slate-700 font-poppins">{translateDynamic("Aadhaar Card Scan")}</span>
                <span className="flex items-center gap-1 text-[10px] text-success font-semibold font-mono">
                  <CheckCircle2 size={12} /> {translateDynamic("VERIFIED")}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white border border-slate-150 rounded-xl shadow-sm">
                <span className="text-slate-700 font-poppins">{translateDynamic("PAN Card Scan")}</span>
                <span className="flex items-center gap-1 text-[10px] text-danger font-semibold font-mono">
                  <ShieldAlert size={12} /> {translateDynamic("NEEDS RE-UPLOAD")}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab("documents")}
              className="w-full text-center py-2 text-[10px] font-bold text-primary hover:text-primary-hover border border-dashed border-slate-200 hover:border-slate-350 rounded-xl transition-all"
            >
              {translateDynamic("Manage Document Vault &rarr;")}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
