import React, { useState } from "react";
import { AlertTriangle, Phone, MapPin, Info, ShieldAlert, HeartHandshake } from "lucide-react";

interface Contact {
  name: string;
  number: string;
  desc: string;
}

interface Shelter {
  name: string;
  location: string;
  distance: string;
  capacity: string;
  phone: string;
}

export const EmergencyMode: React.FC = () => {
  const [activeDisaster, setActiveDisaster] = useState<"flood" | "earthquake" | "fire" | "heatwave">("flood");

  const contacts: Contact[] = [
    { name: "National Emergency Number", number: "112", desc: "Single emergency number for police, fire, health." },
    { name: "Disaster Management Authority", number: "1078", desc: "NDMA control room for emergency coordination." },
    { name: "Police Helpline", number: "100", desc: "Direct command to local law enforcement offices." },
    { name: "Fire Department", number: "101", desc: "Direct fire hazard reporting station." },
    { name: "Ambulance Services", number: "102", desc: "Local public healthcare emergency services." },
    { name: "NDRF Helpline", number: "011-24363260", desc: "National Disaster Response Force control room." }
  ];

  const shelters: Shelter[] = [
    { name: "Government High School Relief Camp", location: "Sector 14, Community Hall grounds", distance: "0.9 km", capacity: "350 people", phone: "+91 99880 12345" },
    { name: "Red Cross Disaster Shelter Site", location: "Plot 12, Vikas Nagar, Main Marg", distance: "2.4 km", capacity: "500 people", phone: "+91 11 2345 6711" },
    { name: "Municipal Indoor Stadium", location: "Stadium Chowk, City Center", distance: "3.8 km", capacity: "1200 people", phone: "+91 11 2345 9912" }
  ];

  const advisories = {
    flood: {
      alert: "Heavy Rainfall alert active. Water logging levels rising near Canal Road.",
      guidelines: [
        "Move to higher ground immediately. Do not walk or drive through flooded areas.",
        "Keep electrical appliances unplugged to prevent short circuits.",
        "Store drinking water in sealed plastic containers and pack dry food items.",
        "Boil water before drinking to avoid water-borne contamination."
      ]
    },
    earthquake: {
      alert: "Tectonic warning reports. Minor tremors recorded in regional zones.",
      guidelines: [
        "DROP to the ground, COVER your head, and HOLD ON under sturdy furniture.",
        "Stay away from glass windows, exterior walls, and high structures.",
        "If outdoors, move to an open space away from electrical cables and trees.",
        "Do not use elevators during evacuations."
      ]
    },
    fire: {
      alert: "Dry summer heat hazard. Stay alert to structural electric fire warnings.",
      guidelines: [
        "Crawl low under smoke to stay below toxic gases.",
        "Touch doors with the back of your hand before opening. If hot, use alternative exits.",
        "If your clothes catch fire: Stop, Drop, and Roll.",
        "Call 101 immediately and evacuate in a calm, orderly line."
      ]
    },
    heatwave: {
      alert: "Red warning active: Regional temperatures exceeding 45°C.",
      guidelines: [
        "Avoid direct exposure to sunlight between 12:00 PM and 04:00 PM.",
        "Drink high amounts of water, ORS fluids, buttermilk, or lemon water.",
        "Wear lightweight, light-colored, and loose cotton garments.",
        "Never leave children or pets inside parked closed vehicles."
      ]
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-danger/30 via-danger/20 to-dark p-6 rounded-2xl border border-danger/30 shadow-xl shadow-danger/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.15),transparent_50%)] animate-pulse" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-danger/20 rounded-xl text-danger animate-bounce">
              <ShieldAlert size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-space text-white tracking-wider flex items-center gap-2">
                EMERGENCY SERVICES DESK
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-danger/25 text-[10px] text-danger border border-danger/40 uppercase tracking-widest animate-pulse">
                  Active Warning
                </span>
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Immediate response panel for weather anomalies, disaster reports, and civic evacuation procedures.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Contacts column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
            <h3 className="text-base font-bold font-space text-white mb-4 flex items-center gap-2">
              <Phone size={16} className="text-danger" />
              National Emergency Help Desks
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contacts.map((contact, idx) => (
                <div 
                  key={idx}
                  className="bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl flex items-start justify-between group hover:border-danger/30 hover:bg-danger/[0.02] transition-all"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-poppins uppercase tracking-wider">
                      {contact.name}
                    </span>
                    <h4 className="text-xl font-bold font-space text-white group-hover:text-danger transition-colors">
                      {contact.number}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {contact.desc}
                    </p>
                  </div>
                  <a
                    href={`tel:${contact.number}`}
                    className="p-2 rounded-lg bg-white/[0.04] text-slate-400 group-hover:bg-danger/20 group-hover:text-white transition-colors"
                  >
                    <Phone size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Shelters Section */}
          <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
            <h3 className="text-base font-bold font-space text-white mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-secondary" />
              Evacuation Centers & Relief Shelters
            </h3>

            <div className="space-y-3">
              {shelters.map((shelter, idx) => (
                <div 
                  key={idx}
                  className="bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-secondary/30 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white">
                        {shelter.name}
                      </h4>
                      <span className="text-[10px] bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full font-poppins">
                        {shelter.distance}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <MapPin size={12} className="text-slate-500" />
                      {shelter.location}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 text-xs font-poppins">
                    <span className="text-slate-400">
                      Capacity: <strong className="text-white">{shelter.capacity}</strong>
                    </span>
                    <a 
                      href={`tel:${shelter.phone}`} 
                      className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] text-white flex items-center gap-1.5 transition-all"
                    >
                      <Phone size={12} /> Call Manager
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advisory column */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] flex flex-col h-full">
            <h3 className="text-base font-bold font-space text-white mb-4 flex items-center gap-2">
              <HeartHandshake size={16} className="text-accent" />
              Advisory Board & Manuals
            </h3>

            {/* Selection Toggles */}
            <div className="grid grid-cols-4 gap-2 mb-4 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
              {(["flood", "earthquake", "fire", "heatwave"] as const).map((dis) => (
                <button
                  key={dis}
                  onClick={() => setActiveDisaster(dis)}
                  className={`
                    py-1.5 text-[10px] font-semibold font-poppins rounded-lg uppercase tracking-wider transition-all
                    ${activeDisaster === dis 
                      ? "bg-danger text-white shadow-md shadow-danger/25" 
                      : "text-slate-400 hover:text-white"}
                  `}
                >
                  {dis}
                </button>
              ))}
            </div>

            {/* Advisory details */}
            <div className="flex-1 bg-white/[0.02] border border-white/[0.04] p-4 rounded-xl space-y-4">
              <div className="flex items-start space-x-2.5 p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <p className="text-xs font-semibold font-poppins">
                  {advisories[activeDisaster].alert}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-500 font-poppins uppercase tracking-wider flex items-center gap-1">
                  <Info size={12} /> Safety Guidelines
                </p>
                <ul className="space-y-3">
                  {advisories[activeDisaster].guidelines.map((line, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-white/[0.04] text-[10px] font-bold text-slate-300 border border-white/[0.08] shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {line}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
