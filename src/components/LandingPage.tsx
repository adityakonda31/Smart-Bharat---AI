import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Award, FileText, FileCheck, ArrowRight, MessageSquare, Globe, Users } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface LandingPageProps {
  onStartAuth: () => void;
  onExploreWithoutAuth: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAuth, onExploreWithoutAuth }) => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Typing simulation state
  const typingPrompts = [
    "How to apply for fresh passport?",
    "Which schemes am I eligible for?",
    "Street light near my house is damaged.",
    "Explain Aadhaar card renewal rules."
  ];
  const [typedText, setTypedText] = useState("");
  const [promptIdx, setPromptIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Stats
  const stats = [
    { value: "350+", label: t("schemesActive"), icon: Award },
    { value: "98.4%", label: t("complaintsSolved"), icon: FileCheck },
    { value: "24 Lakh+", label: t("citizensHelped"), icon: Users },
    { value: "12+", label: t("languagesSupported"), icon: Globe }
  ];

  // Features
  const features = [
    { title: "AI Civic Chatbot", desc: "Get real-time answers to passport rules, document issues, or local government rules in 12+ Indian languages.", icon: MessageSquare },
    { title: "Smart Scheme Recommendation", desc: "Cross-checks age, income, state and student/farmer status to calculate eligible central and state schemes.", icon: Award },
    { title: "AI Grievance Tagger", desc: "Upload civic issues photos; AI auto-identifies the municipal department, sets ticket priority and estimated days to solve.", icon: FileCheck },
    { title: "Document OCR Auditing", desc: "Analyzes uploaded Aadhaar or PAN files for blur detection, signature presence, validity, and auto-fills registration forms.", icon: FileText }
  ];

  // Testimonials
  const testimonials = [
    { quote: "Smart Bharat made checking scholarship eligibility incredibly easy. I filled my details, and the AI showed me 3 schemes I qualified for instantly.", author: "Sunita Rao", details: "Student, Karnataka" },
    { quote: "Lodging a complaint about the damaged water pipeline near my clinic took 2 minutes. The Jal Board resolved it within 24 hours. The tracking timeline was very accurate.", author: "Dr. Anand Mehta", details: "Resident, Gujarat" }
  ];

  // Typing effect animation
  useEffect(() => {
    let timer: number;
    const currentPrompt = typingPrompts[promptIdx];
    
    if (isDeleting) {
      timer = window.setTimeout(() => {
        setTypedText(currentPrompt.substring(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      }, 50);
    } else {
      timer = window.setTimeout(() => {
        setTypedText(currentPrompt.substring(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, 100);
    }

    if (!isDeleting && charIdx === currentPrompt.length) {
      timer = window.setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setPromptIdx((idx) => (idx + 1) % typingPrompts.length);
    }

    return () => clearTimeout(timer);
  }, [charIdx, isDeleting, promptIdx]);

  // India Map nodes particle simulation on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    canvas.width = canvas.parentElement?.clientWidth || 500;
    canvas.height = 400;

    // Define approximate points mapping India boundaries
    const baseNodes = [
      { x: 50, y: 15, name: "Srinagar" },
      { x: 45, y: 35, name: "Delhi" },
      { x: 25, y: 55, name: "Ahmedabad" },
      { x: 35, y: 65, name: "Mumbai" },
      { x: 48, y: 88, name: "Kochi" },
      { x: 55, y: 80, name: "Chennai" },
      { x: 62, y: 58, name: "Kolkata" },
      { x: 85, y: 40, name: "Guwahati" },
      { x: 52, y: 50, name: "Bhopal" },
      { x: 54, y: 68, name: "Hyderabad" },
      { x: 48, y: 76, name: "Bengaluru" }
    ];

    // Scale nodes to fit canvas width/height
    const nodes = baseNodes.map((node) => ({
      x: (node.x / 100) * canvas.width,
      y: (node.y / 100) * canvas.height,
      name: node.name,
      pulse: Math.random() * Math.PI,
      speed: 0.02 + Math.random() * 0.03
    }));

    // Draw Loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid (light mode optimized)
      ctx.strokeStyle = "rgba(15, 23, 42, 0.02)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 30) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // Draw connection lines
      ctx.strokeStyle = "rgba(37, 99, 235, 0.1)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw glowing nodes
      nodes.forEach((node) => {
        node.pulse += node.speed;
        const currentRadius = 3 + Math.sin(node.pulse) * 2.5;

        // Outer glow circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(20, 184, 166, 0.08)";
        ctx.fill();

        // Inner solid node
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#14B8A6";
        ctx.fill();

        // Node name text labels (light mode optimized contrast)
        ctx.fillStyle = "rgba(15, 23, 42, 0.45)";
        ctx.font = "8px 'Space Grotesk'";
        ctx.fillText(node.name, node.x + 8, node.y + 3);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800">
      
      {/* Background aurora lights - soft pastel flows */}
      <div className="aurora-bg">
        <div className="aurora-glow-1" />
        <div className="aurora-glow-2" />
        <div className="aurora-glow-3" />
      </div>

      {/* Navigation Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200/60 backdrop-blur-md sticky top-0 z-40 bg-white/70">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-space font-bold shadow-md shadow-primary/20">
            SB
          </div>
          <div>
            <h1 className="font-space font-bold text-base tracking-wider text-slate-800">
              SMART BHARAT
            </h1>
            <p className="text-[9px] font-poppins text-primary tracking-widest uppercase">
              AI Powered Civic Companion
            </p>
          </div>
        </div>

        <button
          onClick={onStartAuth}
          className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/95 text-xs font-semibold font-poppins text-white transition-all shadow-md shadow-primary/20 hover:scale-[1.02]"
        >
          Portal Login
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Hero details */}
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold font-poppins text-primary shadow-sm">
            <Sparkles size={12} className="text-accent animate-pulse" />
            <span>National Level Hackathon Finalist Prototype</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold font-space text-slate-900 leading-[1.1] tracking-tight">
            Empowering Citizens with <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">AI-Powered Governance</span>
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
            Smart Bharat bridges the gap between Indian citizens and complex government catalog rules. Audit files, recommend scholarships, and track municipal complaints instantly.
          </p>

          {/* Typing visual mock terminal */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 font-mono text-xs text-slate-800 flex items-center space-x-2 min-h-[50px] relative overflow-hidden shadow-sm">
            <div className="absolute inset-y-0 left-0 w-1 bg-primary" />
            <span className="text-secondary select-none font-bold">Rahul asks:</span>
            <span className="text-slate-800">{typedText}</span>
            <span className="h-4 w-1 bg-slate-800 animate-pulse" />
          </div>

          {/* CTA Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onStartAuth}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-xs font-semibold font-poppins text-white flex items-center gap-1.5 transition-all shadow-md shadow-primary/25 hover:scale-[1.02]"
            >
              Start AI Chat <ArrowRight size={14} />
            </button>
            <button
              onClick={() => onExploreWithoutAuth("schemes")}
              className="px-6 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold font-poppins text-slate-600 hover:text-slate-950 transition-all shadow-sm"
            >
              Explore Schemes
            </button>
          </div>
        </div>

        {/* Hero Visual: India Map plotter */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 shadow-xl relative flex flex-col items-center justify-center min-h-[400px]">
          <canvas ref={canvasRef} className="w-full h-full block" />
          <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-1.5 rounded-lg border border-slate-200 text-[9px] font-mono text-slate-500 shadow-sm">
            SIMULATED NATIONWIDE CIVIC CONNECTIONS
          </div>
        </div>

      </section>

      {/* STATISTICS SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-y border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="text-center space-y-1">
                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center mx-auto text-primary mb-1 border border-slate-200/50">
                  <Icon size={16} />
                </div>
                <h4 className="text-3xl font-bold font-space text-slate-800 tracking-tight">
                  {stat.value}
                </h4>
                <p className="text-[10px] text-slate-500 font-poppins uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURE CARDS SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-16 space-y-10">
        <div className="text-center space-y-2">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest font-space">
            Platform Capabilities
          </h3>
          <h2 className="text-2xl md:text-3xl font-bold font-space text-slate-800">
            Designed for Instant Civic Accessibility
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div 
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-slate-200 hover:border-slate-350 transition-all flex flex-col space-y-3"
            >
              <h4 className="text-sm font-bold font-space text-slate-800">
                {feat.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-poppins flex-1">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <h3 className="text-xs font-bold text-center text-primary uppercase tracking-widest font-space">
          Impact Testimonials
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-slate-200/80 space-y-4"
            >
              <p className="text-xs italic text-slate-600 leading-relaxed font-poppins">
                "{t.quote}"
              </p>
              <div className="flex flex-col text-[10px] font-poppins">
                <span className="text-slate-800 font-semibold">{t.author}</span>
                <span className="text-slate-500 mt-0.5">{t.details}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-3xl border border-slate-200 shadow-lg text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold font-space text-slate-800 leading-tight">
            Ready to experience frictionless public services?
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Register your demographic profile and consult our AI helper companion to review schemes, document compliance checks and log complaints.
          </p>
          <button
            onClick={onStartAuth}
            className="px-8 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 font-semibold font-poppins text-xs transition-all shadow-md shadow-primary/10 hover:scale-[1.02] inline-block"
          >
            Access Smart Bharat Companion &rarr;
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 px-6 py-8 text-center text-xs text-slate-400 font-poppins bg-white/40">
        <p>© 2026 Smart Bharat. AI-Powered National Hackathon Companion Project.</p>
        <p className="text-[10px] text-slate-500 mt-2 font-mono">Designed using Apple, Linear, Stripe and OpenAI layout philosophies.</p>
      </footer>

    </div>
  );
};
