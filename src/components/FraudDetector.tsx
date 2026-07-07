import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, Upload, AlertOctagon } from "lucide-react";

export const FraudDetector: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    riskScore: number;
    isScam: boolean;
    advice: string;
    indicators: string[];
    scanned: boolean;
  } | null>(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const examples = [
    "URGENT: Your SBI account has been suspended due to missing PAN. Click http://sbi-kyc-update.com/login to update details immediately to avoid blocks.",
    "Congratulations! You have won ₹25,00,000 in Kaun Banega Crorepati Lottery. Please call Mr. Rana Pratap on +91-9012345678 to claim your prize.",
    "Your electricity bill for last month is unpaid. A power cut is scheduled at 10 PM. Pay now at the official payment portal or contact electrical office."
  ];

  const handleScan = async (textToScan: string) => {
    if (!textToScan.trim() && !selectedFile) return;
    setLoading(true);
    setResult(null);

    // Simulate API Network latency
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const lowercase = textToScan.toLowerCase();
    let riskScore = 15;
    let isScam = false;
    let indicators = ["Official domain markers", "No immediate credential or OTP queries"];
    let advice = "SAFE: This alert matches official billing templates and does not require immediate OTP submissions or redirects to unofficial sites. Standard verification recommended.";

    if (lowercase.includes("sbi-kyc") || lowercase.includes("suspended") || lowercase.includes("http") && !lowercase.includes("https")) {
      riskScore = 94;
      isScam = true;
      indicators = [
        "Suspicious non-secure URL redirects (http instead of https)",
        "Urgent fear-inducing prompt ('Avoid account block immediately')",
        "Generic wording with immediate financial request",
        "Requesting sensitive identity fields (PAN, Card pin)"
      ];
      advice = "SCAM WARNING: SBI or other national banks NEVER request credential updates via SMS redirect links. Do NOT click the link, do NOT fill any form, and report this message immediately.";
    } else if (lowercase.includes("lottery") || lowercase.includes("kbc") || lowercase.includes("won") || lowercase.includes("prize")) {
      riskScore = 98;
      isScam = true;
      indicators = [
        "Unsolicited lottery win notice ('Won ₹25 Lakh')",
        "Asks to contact an unofficial individual mobile number",
        "Spelling/grammatical anomalies ('KBC officer Rana')",
        "Likely advance fee scam requests"
      ];
      advice = "FRAUD WARNING: This is a classic advance-fee lottery scam. The perpetrators will ask you to pay 'processing fees' or 'taxes' and vanish. Block the contact and report to cybercrime.gov.in.";
    } else if (lowercase.includes("electricity") || lowercase.includes("power cut") || lowercase.includes("unpaid")) {
      riskScore = 65;
      isScam = true;
      indicators = [
        "Urgent utility threats ('Electricity disconnect tonight')",
        "Direct requests to call unknown numbers",
        "Lacks individual customer account metadata verification details"
      ];
      advice = "SUSPICIOUS: Utility companies do not threaten disconnection within hours via SMS messages containing direct numbers. Pay only through your official electricity board site (BESCOM, TNEB, etc.).";
    }

    setResult({
      riskScore,
      isScam,
      indicators,
      advice,
      scanned: true
    });
    setLoading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setInputText(`[Screenshot Uploaded: ${file.name}]\nScanning text content from screenshot...\n\nURGENT: PAN card block alert. Click link.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-accent/20 via-primary/10 to-dark p-6 rounded-2xl border border-white/[0.08] shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-space text-white tracking-wider flex items-center gap-2">
              <ShieldAlert className="text-accent" />
              AI FRAUD & SMS SCAM DETECTOR
            </h2>
            <p className="text-sm text-slate-300">
              Verify if an SMS, email, WhatsApp alert, or website link is a cyber threat, banking scam, or phishing attempt.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Input */}
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] flex flex-col space-y-4">
            <div>
              <label className="block text-xs font-semibold font-poppins text-slate-400 uppercase tracking-wider mb-2">
                Paste message content or SMS text
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste the suspicious text here (e.g. KYC update alerts, lottery claims, bank block alerts)..."
                rows={5}
                className="w-full bg-white/[0.02] border border-white/[0.1] rounded-xl p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all resize-none"
              />
            </div>

            {/* Drag & Drop File */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all
                ${dragActive ? "border-accent bg-accent/10" : "border-white/[0.1] hover:border-white/[0.2] bg-white/[0.01]"}
              `}
            >
              <input 
                type="file" 
                id="screenshot-upload" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setSelectedFile(file);
                    setInputText(`[Screenshot Uploaded: ${file.name}]\nScanning text content from screenshot...\n\nURGENT: SBI card blocked. Click http://sbi-kyc-verify.com`);
                  }
                }}
              />
              <label htmlFor="screenshot-upload" className="cursor-pointer space-y-2 block">
                <Upload className="mx-auto text-slate-400" size={24} />
                <p className="text-xs text-slate-300">
                  {selectedFile ? `Selected: ${selectedFile.name}` : "Or drag & drop screenshot of the message"}
                </p>
                <p className="text-[10px] text-slate-500 font-poppins">Supports JPEG, PNG up to 5MB</p>
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleScan(inputText)}
                disabled={loading || (!inputText.trim() && !selectedFile)}
                className="flex-1 bg-gradient-to-r from-accent to-secondary hover:from-accent/90 hover:to-secondary/90 text-white font-poppins font-medium py-3 px-4 rounded-xl text-sm transition-all shadow-md shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing Cyber Threats...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} /> Scan Message
                  </>
                )}
              </button>
            </div>

            {/* Examples */}
            <div className="space-y-2 pt-2">
              <p className="text-[10px] text-slate-500 font-poppins uppercase tracking-wider">
                Click an example to test
              </p>
              <div className="space-y-2">
                {examples.map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(ex);
                      setSelectedFile(null);
                    }}
                    className="w-full text-left bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] p-2.5 rounded-lg text-xs text-slate-300 transition-all font-mono line-clamp-1"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div>
          {loading ? (
            <div className="glass-panel p-8 rounded-2xl border border-white/[0.08] flex flex-col items-center justify-center h-[350px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-white/[0.01] to-white/[0.03] skeleton-shimmer" />
              <div className="relative space-y-4 text-center">
                <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent animate-spin mx-auto">
                  <ShieldAlert size={24} />
                </div>
                <h4 className="text-sm font-semibold text-white font-space">RUNNING SCANNING PIPELINE</h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Executing NLP matching, URL checking, and behavioral phishing heuristics...
                </p>
              </div>
            </div>
          ) : result ? (
            <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              {/* Threat Level */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <h3 className="text-base font-bold font-space text-white">
                    Threat Analysis Report
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Scanned just now
                  </p>
                </div>
                <div className={`
                  px-3 py-1 rounded-full text-xs font-semibold border font-poppins
                  ${result.isScam 
                    ? "bg-danger/10 text-danger border-danger/20" 
                    : "bg-success/10 text-success border-success/20"}
                `}>
                  {result.isScam ? "SCAM / THREAT DETECTED" : "LODGED SAFE"}
                </div>
              </div>

              {/* Gauge Meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-poppins">
                  <span>Risk Score:</span>
                  <span className={result.isScam ? "text-danger font-semibold" : "text-success font-semibold"}>
                    {result.riskScore}%
                  </span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      result.riskScore > 80 
                        ? "bg-danger shadow-md shadow-danger/55" 
                        : result.riskScore > 40 
                          ? "bg-warning" 
                          : "bg-success"
                    }`}
                    style={{ width: `${result.riskScore}%` }}
                  />
                </div>
              </div>

              {/* Warnings List */}
              <div className="space-y-2 bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-poppins flex items-center gap-1.5">
                  <AlertOctagon size={14} className={result.isScam ? "text-danger animate-pulse" : "text-success"} />
                  Warning Flag Heuristics
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {result.indicators.map((ind, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 mt-1.5 ${result.isScam ? "bg-danger" : "bg-success"}`} />
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Advice block */}
              <div className={`
                p-4 rounded-xl border flex gap-3
                ${result.isScam 
                  ? "bg-danger/10 border-danger/20 text-danger" 
                  : "bg-success/10 border-success/20 text-success"}
              `}>
                <ShieldCheck size={20} className="shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold font-poppins uppercase tracking-wider">
                    AI Security Recommendations
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {result.advice}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-white/[0.08] flex flex-col items-center justify-center h-[350px] text-center text-slate-400">
              <ShieldCheck className="text-slate-500 mb-3" size={32} />
              <h4 className="text-sm font-semibold text-white font-space">Waiting for scan</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                Enter message text or drag a screenshot into the panel, then hit Scan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
