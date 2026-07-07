import React, { useState, useEffect, useRef } from "react";
import { Search, Sparkles, ArrowRight, X, ShieldAlert, Award, FileText } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface SmartSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Monitor shortcut Cmd+K / Ctrl+K and Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Search indexing
  const items = [
    { title: "Passport Application Guidance", category: "explainer", icon: FileText, desc: "Step-by-step documentation, fees and deadlines for fresh passport." },
    { title: "PM-KISAN Scheme Portal", category: "schemes", icon: Award, desc: "Verify eligibility and apply for farmer income support of ₹6,000." },
    { title: "Road Damage & Infrastructure Complaint", category: "complaints", icon: Sparkles, desc: "AI-assisted filing with image upload and auto-department tagging." },
    { title: "Aadhaar Card Form Autofill", category: "documents", icon: FileText, desc: "Upload Aadhaar to auto-extract details and pre-fill form fields." },
    { title: "Check Scam SMS / Risk Score", category: "ai-chat", icon: ShieldAlert, desc: "Fraud detector helper to inspect suspicious links, SMS or emails." }
  ];

  const filteredItems = query
    ? items.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.desc.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Smart search directory overlay"
    >
      <div 
        className="fixed inset-0 -z-10" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="w-full max-w-xl rounded-2xl glass-panel border border-white/[0.12] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Search Input Bar */}
        <div className="flex items-center space-x-3 px-4 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
          <Search className="text-slate-400" size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder={t("searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 outline-none text-white text-base placeholder-slate-400 focus:ring-0"
            aria-label="Search inputs query field"
          />
          {query && (
            <button 
              onClick={() => setQuery("")} 
              className="p-1 rounded-md hover:bg-white/10 text-slate-400 focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none"
              aria-label="Clear query text"
            >
              <X size={16} />
            </button>
          )}
          <span className="text-[10px] bg-white/10 text-slate-300 font-poppins px-1.5 py-0.5 rounded border border-white/10 shadow-inner">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[350px] overflow-y-auto p-2">
          {filteredItems.length > 0 ? (
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 font-poppins px-3 py-1 uppercase tracking-wider">
                {query ? "Matching Results" : "Quick Actions & Shortcuts"}
              </p>
              {filteredItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onNavigateTab(item.category);
                      onClose();
                    }}
                    className="w-full flex items-start text-left space-x-3 p-3 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    aria-label={`Open page link: ${item.title}`}
                  >
                    <div className="p-2 rounded-lg bg-white/[0.04] text-secondary group-hover:bg-primary/20 group-hover:text-white transition-colors">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-poppins font-medium text-white group-hover:text-secondary transition-colors">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-poppins capitalize px-2 py-0.5 rounded-full bg-white/[0.02]">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        {item.desc}
                      </p>
                    </div>
                    <ArrowRight 
                      size={14} 
                      className="text-slate-500 group-hover:text-white self-center transform translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" 
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Sparkles className="mx-auto text-accent mb-2 animate-bounce" size={24} />
              <p className="text-sm text-slate-400">No direct matches found.</p>
              <button 
                onClick={() => {
                  onNavigateTab("ai-chat");
                  onClose();
                }}
                className="mt-3 text-xs text-secondary hover:underline focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none"
                aria-label="Ask Smart Bharat AI assistant instead"
              >
                Ask Smart Bharat AI Assistant instead &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-white/[0.08] bg-white/[0.01] flex items-center justify-between text-[10px] text-slate-500">
          <span>Use shortcuts or escape key to close</span>
          <span>Press Enter to select</span>
        </div>

      </div>
    </div>
  );
};
