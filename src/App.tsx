import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { AIChat } from "./components/AIChat";
import { SchemeRecommender } from "./components/SchemeRecommender";
import { DocumentAssistant } from "./components/DocumentAssistant";
import { GovDocExplainer } from "./components/GovDocExplainer";
import { ComplaintDesk } from "./components/ComplaintDesk";
import { NearbyServices } from "./components/NearbyServices";
import { EmergencyMode } from "./components/EmergencyMode";
import { LandingPage } from "./components/LandingPage";
import { Login } from "./components/Login";
import { Onboarding } from "./components/Onboarding";
import { SmartSearch } from "./components/SmartSearch";
import { Menu, Search, Sparkles } from "lucide-react";

function App() {
  const { isAuthenticated, isOnboarding } = useAuth();
  
  // Navigation states
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Landing / Login toggles
  const [showLogin, setShowLogin] = useState(false);

  // If not authenticated, show landing page or login flow
  if (!isAuthenticated) {
    if (showLogin) {
      return <Login />;
    }
    return (
      <LandingPage 
        onStartAuth={() => setShowLogin(true)}
        onExploreWithoutAuth={() => {
          // Direct guest access simulation
          setShowLogin(true);
        }}
      />
    );
  }

  // If authenticated but profile is not completed, trigger onboarding slides
  if (isOnboarding) {
    return <Onboarding />;
  }

  // Render tab component
  const renderTabContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <Dashboard onNavigateTab={(tab) => setCurrentTab(tab)} />;
      case "ai-chat":
        return <AIChat />;
      case "schemes":
        return <SchemeRecommender />;
      case "documents":
        return <DocumentAssistant />;
      case "explainer":
        return <GovDocExplainer />;
      case "complaints":
        return <ComplaintDesk />;
      case "services":
        return <NearbyServices />;
      case "emergency":
        return <EmergencyMode />;
      default:
        return <Dashboard onNavigateTab={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-700">
      
      {/* Background aurora gradients */}
      <div className="aurora-bg">
        <div className="aurora-glow-1" />
        <div className="aurora-glow-2" />
        <div className="aurora-glow-3" />
      </div>

      {/* Navigation Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        setSearchOpen={setSearchOpen}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-200/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 bg-white/60">
          
          {/* Mobile menu toggle & greeting */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-950 transition-all"
            >
              <Menu size={18} />
            </button>
            
            <div className="hidden md:flex items-center space-x-2 text-xs font-poppins text-slate-500">
              <span>National Single Portal</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="text-primary flex items-center gap-1">
                <Sparkles size={12} className="animate-pulse" /> AI Agent Core Online
              </span>
            </div>
          </div>

          {/* Search trigger & alerts */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-950 transition-all"
              title="Global Search (Cmd+K)"
            >
              <Search size={16} />
            </button>

            <button
              onClick={() => setCurrentTab("emergency")}
              className="px-3.5 py-2 rounded-xl bg-danger/10 border border-danger/25 text-danger text-[10px] font-bold tracking-wider font-poppins uppercase hover:bg-danger/20 hover:scale-[1.02] transition-all flex items-center gap-1.5 animate-pulse"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-danger animate-ping" />
              Emergency Panel
            </button>
          </div>

        </header>

        {/* Tab Viewport */}
        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto overflow-y-auto">
          {renderTabContent()}
        </main>

      </div>

      {/* Global CMD+K search panel */}
      <SmartSearch 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
        onNavigateTab={(tab) => setCurrentTab(tab)} 
      />

    </div>
  );
}

export default App;
