import React from "react";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Award, 
  FileText, 
  Search, 
  AlertTriangle, 
  MapPin, 
  FileCheck, 
  LogOut,
  Globe,
  X,
  Compass
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage, languages } from "../context/LanguageContext";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setSearchOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  isOpen, 
  setIsOpen,
  setSearchOpen
}) => {
  const { user, logout } = useAuth();
  const { currentLanguage, setLanguage, t } = useLanguage();

  const menuItems = [
    { id: "dashboard", label: t("navDashboard"), icon: LayoutDashboard },
    { id: "ai-chat", label: t("navAIAssistant"), icon: MessageSquare, glow: true },
    { id: "schemes", label: t("navSchemes"), icon: Award },
    { id: "documents", label: t("navDocuments"), icon: FileText },
    { id: "explainer", label: t("navExplainer"), icon: Compass },
    { id: "complaints", label: t("navComplaints"), icon: FileCheck },
    { id: "services", label: t("navServices"), icon: MapPin },
    { id: "emergency", label: t("navEmergency"), icon: AlertTriangle, danger: true }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={`
          fixed md:sticky top-0 left-0 z-50
          h-screen w-72 flex flex-col
          glass-panel border-r border-slate-200/60
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        aria-label="Smart Bharat Portal Navigation Sidebar"
      >
        {/* Header Logo */}
        <div className="p-6 border-b border-slate-200/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center shadow-md shadow-primary/20">
              <span className="text-white font-space font-bold text-lg">SB</span>
            </div>
            <div>
              <h1 className="font-space font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600">
                {t("title")}
              </h1>
              <p className="text-[10px] font-poppins text-primary tracking-widest uppercase">
                {t("subtitle")}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
            aria-label="Close sidebar panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Action */}
        <div className="px-4 pt-4">
          <button
            onClick={() => {
              setSearchOpen(true);
              setIsOpen(false);
            }}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/60 hover:bg-slate-100 hover:border-slate-300 transition-all text-left text-slate-500 text-xs focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            aria-label="Open global directory search (Cmd+K)"
          >
            <Search size={16} />
            <span>Search... (Cmd+K)</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5" aria-label="Portal section navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-xl
                  font-poppins text-xs transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none
                  ${isActive 
                    ? item.danger 
                      ? "bg-danger/10 text-danger border border-danger/20 shadow-sm shadow-danger/5 font-semibold" 
                      : "bg-primary/8 text-primary border border-primary/20 shadow-sm shadow-primary/5 font-semibold" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"}
                `}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Go to ${item.label} section`}
              >
                <div className="flex items-center space-x-3.5">
                  <Icon size={18} className={
                    isActive 
                      ? item.danger ? "text-danger" : "text-primary" 
                      : item.glow ? "text-accent animate-pulse" : "text-slate-500"
                  } />
                  <span>{item.label}</span>
                </div>
                {item.glow && !isActive && (
                  <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Language Selection Footer Section */}
        <div className="p-4 border-t border-slate-200/60 space-y-4 bg-slate-50/50">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center space-x-2">
              <Globe size={14} className="text-primary" />
              <span>Language / भाषा</span>
            </div>
            <select
              value={currentLanguage}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-white text-slate-800 border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
              aria-label="Select website language"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </option>
              ))}
            </select>
          </div>

          {/* User Profile Card */}
          {user && (
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
              <div className="flex items-center space-x-3">
                <img 
                  src={user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80&auto=format&fit=crop"} 
                  alt={user.fullName}
                  className="h-9 w-9 rounded-lg object-cover ring-1 ring-slate-100"
                />
                <div className="overflow-hidden">
                  <h4 className="text-xs font-semibold text-slate-800 font-poppins truncate">
                    {user.fullName}
                  </h4>
                  <p className="text-[10px] text-slate-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={logout}
                className="p-1.5 rounded-lg hover:bg-danger/10 text-slate-500 hover:text-danger transition-colors focus-visible:ring-2 focus-visible:ring-danger focus-visible:outline-none"
                aria-label="Log out of application"
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
