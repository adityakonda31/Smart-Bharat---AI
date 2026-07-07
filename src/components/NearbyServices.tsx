import React, { useState } from "react";
import { MapPin, Phone, Clock, Search, Navigation, Building } from "lucide-react";
import { serviceLocations, type ServiceLocation } from "../data/locations";

export const NearbyServices: React.FC = () => {
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedLoc, setSelectedLoc] = useState<ServiceLocation | null>(serviceLocations[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLocations = serviceLocations.filter((loc) => {
    const matchesFilter = filterType === "all" || loc.type === filterType;
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          loc.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = [
    { id: "all", label: "All Services" },
    { id: "hospital", label: "Hospitals" },
    { id: "police", label: "Police" },
    { id: "csc", label: "CSC Centers" },
    { id: "passport", label: "Passport Offices" },
    { id: "municipality", label: "Municipality" }
  ];

  return (
    <div className="space-y-6">
      {/* Intro header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-secondary/15 via-primary/10 to-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-space text-slate-800 tracking-wider flex items-center gap-2">
              <MapPin className="text-primary" />
              NEARBY GOVERNMENT SERVICES MAP
            </h2>
            <p className="text-sm text-slate-600">
              Interactive local positioning map for civic infrastructure, hospitals, police assistance, RTO, and digital service centers (CSC).
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Interactive Map Canvas */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-slate-200/80 p-4 flex flex-col h-[480px] shadow-sm bg-white">
          
          {/* Map canvas screen */}
          <div className="flex-1 bg-slate-50 rounded-xl relative overflow-hidden border border-slate-150 shadow-inner flex items-center justify-center">
            
            {/* Visual background grid pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            {/* SVG Interactive Plotter */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* User Center Coordinate */}
              <circle cx="50" cy="50" r="1.5" className="fill-primary animate-pulse" />
              <circle cx="50" cy="50" r="4" className="stroke-primary/30 fill-transparent stroke-[0.3] animate-ping" />
              
              {/* Radial boundaries */}
              <circle cx="50" cy="50" r="15" className="stroke-slate-900/[0.04] fill-transparent stroke-[0.2]" />
              <circle cx="50" cy="50" r="30" className="stroke-slate-900/[0.04] fill-transparent stroke-[0.2]" />
              <circle cx="50" cy="50" r="45" className="stroke-slate-900/[0.04] fill-transparent stroke-[0.2]" />

              {/* Connect lines */}
              {selectedLoc && (
                <line 
                  x1="50" 
                  y1="50" 
                  x2={selectedLoc.lng} 
                  y2={selectedLoc.lat} 
                  className="stroke-primary/30 stroke-[0.2] style-dasharray-[1,1]"
                  style={{ strokeDasharray: "1, 1" }}
                />
              )}

              {/* Location Marker nodes */}
              {filteredLocations.map((loc) => {
                const isSelected = selectedLoc?.id === loc.id;
                let fillVal = "#2563EB"; // primary
                if (loc.type === "hospital") fillVal = "#EF4444"; // danger red
                else if (loc.type === "police") fillVal = "#F59E0B"; // warning orange
                else if (loc.type === "csc") fillVal = "#14B8A6"; // teal

                return (
                  <g key={loc.id} className="cursor-pointer" onClick={() => setSelectedLoc(loc)}>
                    <circle 
                      cx={loc.lng} 
                      cy={loc.lat} 
                      r={isSelected ? "1.8" : "1.2"} 
                      fill={fillVal} 
                      className="transition-all hover:scale-150"
                    />
                    {isSelected && (
                      <circle 
                        cx={loc.lng} 
                        cy={loc.lat} 
                        r="3.5" 
                        fill="none" 
                        stroke={fillVal} 
                        strokeWidth="0.2" 
                        className="animate-ping" 
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Map Overlay HUD HUD */}
            <div className="absolute top-4 left-4 bg-white/95 border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-mono text-slate-500 shadow-sm">
              LOCATOR GRID: NEW DELHI - SECTOR 5 AREA
            </div>

            <div className="absolute bottom-4 right-4 bg-white/95 border border-slate-200 p-3 rounded-lg flex items-center gap-3 text-[10px] font-mono text-slate-500 shadow-sm">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-danger" /> Hospital
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-warning" /> Police
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-accent" /> CSC
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary" /> Others
              </div>
            </div>

            {/* Center User tag */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-3 bg-primary/10 border border-primary/25 text-primary text-[9px] font-bold font-poppins px-1.5 py-0.5 rounded shadow">
              YOU (Rahul)
            </div>

          </div>
          
        </div>

        {/* Right Directory list */}
        <div className="glass-panel rounded-2xl border border-slate-200/80 p-4 flex flex-col h-[480px] shadow-sm bg-white">
          
          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search centers or roads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-primary transition-all"
            />
          </div>

          {/* Type filters */}
          <div className="flex overflow-x-auto gap-1.5 pb-3 scrollbar-none shrink-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterType(cat.id)}
                className={`
                  px-3 py-1.5 rounded-lg text-[10px] font-semibold font-poppins uppercase tracking-wider whitespace-nowrap border transition-all
                  ${filterType === cat.id 
                    ? "bg-primary/10 text-primary border-primary/30 shadow-sm" 
                    : "text-slate-500 hover:text-slate-800 bg-slate-50 border-slate-200/60"}
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Directory list scroll */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredLocations.map((loc) => {
              const isSelected = selectedLoc?.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLoc(loc)}
                  className={`
                    w-full text-left p-3 rounded-xl border transition-all flex items-start space-x-3
                    ${isSelected 
                      ? "bg-primary/5 border-primary/20 shadow-sm" 
                      : "bg-slate-50/50 border-slate-150 hover:bg-slate-50"}
                  `}
                >
                  <div className={`
                    p-2 rounded-lg bg-white border border-slate-200 text-slate-400 self-center
                    ${isSelected && "text-primary bg-primary/10 border-primary/20"}
                  `}>
                    <Building size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-800 truncate">
                      {loc.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {loc.address}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[9px] text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Navigation size={9} className="text-primary animate-pulse" />
                        {loc.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={9} className="text-slate-400" />
                        {loc.workingHours.split("(")[0]}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selection detail footer drawer */}
          {selectedLoc && (
            <div className="mt-4 pt-4 border-t border-slate-200 bg-slate-50/50 rounded-lg p-3 space-y-3 animate-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-start justify-between">
                <h4 className="text-xs font-bold text-slate-800 font-space">
                  {selectedLoc.name}
                </h4>
                <span className="text-[9px] bg-primary/15 border border-primary/25 text-primary px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                  {selectedLoc.type}
                </span>
              </div>
              <div className="space-y-1.5 text-[10px] text-slate-650">
                <p className="flex items-center gap-2">
                  <MapPin size={12} className="text-slate-400 shrink-0" />
                  <span className="truncate">{selectedLoc.address}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={12} className="text-slate-400 shrink-0" />
                  <span>{selectedLoc.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={12} className="text-slate-400 shrink-0" />
                  <span className="truncate">{selectedLoc.workingHours}</span>
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
