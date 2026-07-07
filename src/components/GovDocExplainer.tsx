import React, { useState } from "react";
import { FileText, Calendar, DollarSign, ListChecks, HelpCircle, Upload, CheckCircle2, ChevronDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface FAQItem {
  q: string;
  a: string;
}

interface ExplainerResult {
  title: string;
  summary: string;
  deadlines: { label: string; date: string }[];
  fees: string;
  requirements: string[];
  faqs: FAQItem[];
}

export const GovDocExplainer: React.FC = () => {
  const { t, translateDynamic } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [result, setResult] = useState<ExplainerResult | null>(null);

  const mockGuides: Record<string, ExplainerResult> = {
    passport: {
      title: "Passport India Official Application Guidelines",
      summary: "This circular outlines the official regulations for applying for a Fresh or Re-issue of an Indian Passport. It specifies that applications must be submitted online, followed by a mandatory in-person biometric appointment at a Passport Seva Kendra (PSK). Verification is subsequently carried out by regional police departments before the passport is issued under Speed Post delivery.",
      deadlines: [
        { label: "PSK Appointment Slot Locking", date: "Within 3 days of fee payment" },
        { label: "Document Re-upload window (if rejected)", date: "Within 90 days of application submission" }
      ],
      fees: "₹1,500 for normal application (36 pages) or ₹2,000 (60 pages). ₹3,500 for Tatkaal application.",
      requirements: [
        "Proof of Present Address (Utility bill, bank statement, or rent agreement)",
        "Proof of Date of Birth (Birth certificate, matriculation marksheet, or Aadhaar)",
        "Non-ECR Category proof (if matriculated or higher education level completed)"
      ],
      faqs: [
        { q: "Is police verification mandatory?", a: "Yes. Police verification is standard for all fresh passport applications. However, under Tatkaal or post-police verification categories, passports are printed first and verified later." },
        { q: "Can minor children apply without parents' presence?", a: "No. For minors, the consent of both parents is required. Parents must sign Annexure 'D' and accompany the minor to the PSK." },
        { q: "How long does standard delivery take?", a: "Under normal processing, passports are dispatched within 15-20 working days. Tatkaal passports are dispatched within 3-5 working days." }
      ]
    },
    pmkisan: {
      title: "Pradhan Mantri Kisan Samman Nidhi Operational Circular",
      summary: "The operational circular defines the administrative framework for direct cash transfers of ₹6,000 per year to small and marginal landholder farmers. It highlights constraints: institutional landowners, taxpayers, and retired government officers are strictly excluded from the beneficiary list to channel resources to active crop growers.",
      deadlines: [
        { label: "E-KYC Completion Threshold", date: "July 31, 2026 (Mandatory for next installment)" },
        { label: "Land Record Mapping updates", date: "Continuous verification rollouts" }
      ],
      fees: "₹0 (The scheme is 100% sponsored by the Government of India. Registration is free).",
      requirements: [
        "Aadhaar card linked with active mobile number",
        "Landholding Ownership Papers (RoR / Khatauni document)",
        "Active savings bank account with DB Direct Benefit Transfer enabled"
      ],
      faqs: [
        { q: "What is e-KYC and is it mandatory?", a: "Yes, e-KYC is mandatory. It verifies your identity via OTP authentication. Installments are blocked for farmers who have not completed e-KYC." },
        { q: "Can two brothers claiming shares in same land register separately?", a: "No. The scheme defines the beneficiary unit as a family (husband, wife, and minor children) holding cultivable land. Separate entries require distinct land registers." }
      ]
    },
    housing: {
      title: "PM Awas Yojana (PMAY-U) Urban Subsidy Rules",
      summary: "This document lists terms for Interest Subsidy under Credit Linked Subsidy Scheme (CLSS) for Urban houses. Housing units must be registered in the name of the female head of the family, or jointly with her spouse, to encourage women empowerment in urban property registry structures.",
      deadlines: [
        { label: "CLSS Scheme Application Submission", date: "March 31, 2026" },
        { label: "Subsidy disbursement by NHB/HUDCO", date: "Quarterly audits post construction verification" }
      ],
      fees: "₹0 (Loan interest subsidy ranges from 3% to 6.50% based on Income slabs).",
      requirements: [
        "Self-declaration certificate stating that no family member owns a brick (pucca) house anywhere in India",
        "PAN Card & Aadhaar details of all family members",
        "Income Certificate issued by municipal revenue officer"
      ],
      faqs: [
        { q: "What is the maximum subsidy amount?", a: "The maximum interest subsidy payable is ₹2.67 Lakh. This is credited upfront to the beneficiary's loan account, reducing the effective EMI." },
        { q: "Is the carpet area of construction restricted?", a: "Yes, it ranges from 60 sq. meters for EWS up to 200 sq. meters for MIG categories." }
      ]
    }
  };

  const handleUploadClick = (key: string) => {
    setLoading(true);
    setSelectedDoc(key);
    setResult(null);

    // Simulate OCR reading and LLM processing
    setTimeout(() => {
      setResult(mockGuides[key]);
      setLoading(false);
    }, 2200);
  };

  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/15 via-accent/10 to-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-space text-slate-800 tracking-wider flex items-center gap-2">
              <FileText className="text-primary animate-pulse" />
              {t("navExplainer").toUpperCase()}
            </h2>
            <p className="text-sm text-slate-650 leading-relaxed">
              {translateDynamic("Upload any complex government circular, application form, or notification PDF. The AI acts as a teacher, translating rules into simple, readable lists.")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Upload Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 flex flex-col space-y-5 shadow-sm bg-white">
          <h3 className="text-sm font-bold font-space text-slate-800 uppercase tracking-wider">
            {translateDynamic("Upload circular / form")}
          </h3>

          {/* Drag file zone */}
          <div className="border-2 border-dashed border-slate-200 hover:border-primary/45 rounded-xl p-8 text-center cursor-pointer transition-all bg-slate-50">
            <Upload className="mx-auto text-slate-400 mb-2" size={24} />
            <p className="text-xs text-slate-655 font-medium">
              {translateDynamic("Select or drop PDF document")}
            </p>
            <p className="text-[10px] text-slate-450 font-poppins mt-1">
              Supports PDF, DOCX up to 10MB
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-slate-450 font-poppins uppercase tracking-wider">
              {translateDynamic("Or simulate with preloaded circulars")}
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleUploadClick("passport")}
                className={`
                  w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center space-x-3
                  ${selectedDoc === "passport" 
                    ? "bg-primary/10 border-primary/30 text-slate-800 font-semibold" 
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-650"}
                `}
              >
                <FileText size={14} className="text-secondary shrink-0" />
                <span className="truncate">Passport_Guidelines_2026.pdf</span>
              </button>

              <button
                onClick={() => handleUploadClick("pmkisan")}
                className={`
                  w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center space-x-3
                  ${selectedDoc === "pmkisan" 
                    ? "bg-primary/10 border-primary/30 text-slate-800 font-semibold" 
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-655"}
                `}
              >
                <FileText size={14} className="text-accent shrink-0" />
                <span className="truncate">PM_Kisan_Registration_Order.pdf</span>
              </button>

              <button
                onClick={() => handleUploadClick("housing")}
                className={`
                  w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center space-x-3
                  ${selectedDoc === "housing" 
                    ? "bg-primary/10 border-primary/30 text-slate-800 font-semibold" 
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-655"}
                `}
              >
                <FileText size={14} className="text-danger shrink-0" />
                <span className="truncate">PMAY_Urban_CLSS_Rules.pdf</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Area */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="glass-panel p-8 rounded-2xl border border-slate-200/80 flex flex-col items-center justify-center h-full min-h-[350px] relative overflow-hidden bg-white shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-100/5 to-slate-100/10 skeleton-shimmer" />
              <div className="relative space-y-4 text-center">
                <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <h4 className="text-sm font-semibold text-slate-800 font-space uppercase">{translateDynamic("Evaluating government catalogs")}</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  {translateDynamic("Checking land indices, credit parameters, age caps, and tax records...")}
                </p>
              </div>
            </div>
          ) : result ? (
            <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 bg-white shadow-sm">
              
              {/* Result Title */}
              <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                <CheckCircle2 className="text-success shrink-0" size={20} />
                <h3 className="text-base font-bold font-space text-slate-800">
                  {translateDynamic(result.title)}
                </h3>
              </div>

              {/* Summary Block */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-poppins flex items-center gap-1.5">
                  <FileText size={14} className="text-primary" />
                  {translateDynamic("Plain English Summary (Simple Teacher Explanation)")}
                </h4>
                <p className="text-xs text-slate-655 leading-relaxed font-poppins">
                  {translateDynamic(result.summary)}
                </p>
              </div>

              {/* Dates & Fees Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Important dates */}
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-3 shadow-sm">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-poppins flex items-center gap-1.5">
                    <Calendar size={14} className="text-warning animate-pulse" />
                    {translateDynamic("Important Deadlines")}
                  </h4>
                  <div className="space-y-2">
                    {result.deadlines.map((dl, idx) => (
                      <div key={idx} className="flex justify-between text-xs border-b border-slate-200/40 pb-1.5">
                        <span className="text-slate-550">{translateDynamic(dl.label)}</span>
                        <span className="text-slate-800 font-mono font-medium">{translateDynamic(dl.date)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fees */}
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-3 shadow-sm">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-poppins flex items-center gap-1.5">
                    <DollarSign size={14} className="text-accent" />
                    {translateDynamic("Applicable Fees & Charges")}
                  </h4>
                  <p className="text-xs text-slate-655 font-mono leading-relaxed">
                    {translateDynamic(result.fees)}
                  </p>
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-poppins flex items-center gap-1.5">
                  <ListChecks size={14} className="text-primary" />
                  {translateDynamic("Mandatory Submission Documents")}
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {result.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-slate-655">
                      <span className="h-1.5 w-1.5 bg-accent rounded-full mt-1.5 shrink-0" />
                      <span>{translateDynamic(req)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQs Accordion */}
              <div className="space-y-3 border-t border-slate-150 pt-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-poppins flex items-center gap-1.5">
                  <HelpCircle size={14} className="text-warning" />
                  {translateDynamic("Frequently Asked Questions")}
                </h4>
                
                <div className="space-y-2">
                  {result.faqs.map((faq, idx) => {
                    const isOpen = activeFaq === idx;
                    return (
                      <div 
                        key={idx}
                        className="bg-slate-50/50 border border-slate-150 rounded-xl overflow-hidden shadow-sm"
                      >
                        <button
                          onClick={() => setActiveFaq(isOpen ? null : idx)}
                          className="w-full px-4 py-3 flex justify-between items-center text-left text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-all"
                        >
                          <span>{translateDynamic(faq.q)}</span>
                          {isOpen ? <ChevronDown size={14} className="transform rotate-180 transition-transform" /> : <ChevronDown size={14} />}
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 text-xs text-slate-500 leading-relaxed border-t border-slate-150 bg-white animate-in fade-in slide-in-from-top-1">
                            {translateDynamic(faq.a)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-slate-200/80 flex flex-col items-center justify-center h-full min-h-[350px] text-center text-slate-400 bg-white shadow-sm">
              <FileText className="text-slate-450 mb-3 animate-pulse" size={36} />
              <h4 className="text-sm font-semibold text-slate-800 font-space">{translateDynamic("Waiting for upload")}</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                {translateDynamic("Choose a preloaded document in the left panel to simulate the AI reading circular processing flow.")}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
