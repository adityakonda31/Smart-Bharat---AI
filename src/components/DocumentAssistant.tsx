import React, { useState } from "react";
import { FileText, ShieldCheck, ShieldAlert, Upload, ScanLine, Check, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface OCRData {
  documentId: string;
  name: string;
  dob: string;
  address: string;
  expiry?: string;
}

interface ValidationReport {
  isValid: boolean;
  blurLevel: string;
  contrast: string;
  signatureFound: boolean;
  expired: boolean;
  ocrData: OCRData;
  warnings: string[];
}

export const DocumentAssistant: React.FC = () => {
  const { t, translateDynamic } = useLanguage();
  const [selectedDocType, setSelectedDocType] = useState<"aadhaar" | "pan" | "passport" | null>(null);
  const [scanning, setScanning] = useState(false);
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string | null>(null);

  // Form Auto Fill State
  const [formFilled, setFormFilled] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    identityNo: "",
    birthDate: "",
    residenceAddress: "",
    bankAccount: "987654321012",
    occupation: "Agricultural Worker",
    income: "150000"
  });

  const mockTemplates: Record<"aadhaar" | "pan" | "passport", ValidationReport> = {
    aadhaar: {
      isValid: true,
      blurLevel: "low (0.05)",
      contrast: "excellent (0.94)",
      signatureFound: true,
      expired: false,
      ocrData: {
        documentId: "9823 4567 8901",
        name: "RAHUL SHARMA",
        dob: "15/08/2005",
        address: "H-45, Connaught Place, New Delhi - 110001"
      },
      warnings: []
    },
    pan: {
      isValid: false,
      blurLevel: "medium (0.32)",
      contrast: "fair (0.68)",
      signatureFound: false,
      expired: false,
      ocrData: {
        documentId: "APOPS 7891 K",
        name: "RAHUL SHARMA",
        dob: "15/08/2005",
        address: "Not Applicable on PAN Cards"
      },
      warnings: ["Missing Signature: Ensure physical signature is signed in the white box.", "Blur Alert: The card edges are slightly blurred."]
    },
    passport: {
      isValid: true,
      blurLevel: "low (0.09)",
      contrast: "good (0.87)",
      signatureFound: true,
      expired: false,
      ocrData: {
        documentId: "Z 8901234",
        name: "RAHUL SHARMA",
        dob: "15/08/2005",
        address: "Connaught Place, New Delhi",
        expiry: "12/10/2034"
      },
      warnings: []
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const type = file.name.toLowerCase().includes("pan") 
        ? "pan" 
        : file.name.toLowerCase().includes("passport") 
          ? "passport" 
          : "aadhaar";
          
      setSelectedDocType(type);
      setScanning(true);
      setReport(null);
      setFormFilled(false);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImgUrl(event.target.result as string);
          
          // Simulate scanning delay
          setTimeout(() => {
            setReport(mockTemplates[type]);
            setScanning(false);
          }, 2500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentSelect = (type: "aadhaar" | "pan" | "passport") => {
    setSelectedDocType(type);
    setScanning(true);
    setReport(null);
    setFormFilled(false);
    setUploadedImgUrl(null);

    // Simulate scanning pipeline
    setTimeout(() => {
      setReport(mockTemplates[type]);
      setScanning(false);
    }, 2200);
  };

  const handleAutoFill = () => {
    if (!report) return;
    
    // Auto fill form states from OCR Report
    setFormData((prev) => ({
      ...prev,
      fullName: report.ocrData.name,
      identityNo: report.ocrData.documentId,
      birthDate: report.ocrData.dob,
      residenceAddress: report.ocrData.address
    }));
    setFormFilled(true);
  };

  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-accent/15 via-primary/10 to-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-space text-slate-800 tracking-wider flex items-center gap-2">
              <FileText className="text-primary" />
              {t("navDocuments").toUpperCase()}
            </h2>
            <p className="text-sm text-slate-655 leading-relaxed">
              {translateDynamic("Upload Aadhaar, PAN or Passports to scan for clarity, signature compliance, validation alerts, and instantly auto-populate application forms.")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Scanner Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold font-space text-slate-800 uppercase tracking-wider">
              {t("headAudit")}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              STAGE 1: OCR VALIDATION
            </span>
          </div>

          {/* Selector options */}
          <div className="grid grid-cols-3 gap-2">
            {(["aadhaar", "pan", "passport"] as const).map((type) => (
              <button
                key={type}
                onClick={() => handleDocumentSelect(type)}
                className={`
                  p-3 rounded-xl border text-xs font-semibold font-poppins uppercase tracking-wider transition-all flex flex-col items-center gap-2
                  ${selectedDocType === type && !uploadedImgUrl
                    ? "bg-primary/10 border-primary/40 text-primary" 
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100"}
                `}
              >
                <FileText size={18} />
                {type}
              </button>
            ))}
          </div>

          {/* File Upload Area */}
          <div className="border-2 border-dashed border-slate-200 hover:border-primary/40 rounded-xl p-6 text-center cursor-pointer transition-all bg-slate-50 relative">
            <input
              type="file"
              id="real-doc-upload"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleFileUpload}
            />
            <Upload className="mx-auto text-slate-400 mb-1" size={24} />
            <span className="text-xs text-slate-600 block font-medium">{translateDynamic("Upload Real Document Image")}</span>
            <span className="text-[10px] text-slate-400 font-poppins mt-0.5 block">{translateDynamic("Drag/drop Aadhaar or PAN photo to scan")}</span>
          </div>

          {/* Scanner details output */}
          {scanning ? (
            <div className="p-8 border border-slate-200 rounded-xl flex flex-col items-center justify-center relative overflow-hidden bg-slate-50/50 min-h-[160px]">
              
              {/* Laser scan animation overlay */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-primary shadow-lg shadow-primary animate-[scan_2s_linear_infinite]" />
              
              {/* If real document image exists, render it under scanning overlay */}
              {uploadedImgUrl && (
                <img 
                  src={uploadedImgUrl} 
                  alt="Scanning user upload"
                  className="max-h-[150px] object-contain opacity-40 rounded mb-4"
                />
              )}
              
              <ScanLine className="text-primary animate-pulse mb-2" size={24} />
              <p className="text-xs text-slate-800 font-space font-semibold uppercase tracking-wider">Extracting Layout fields</p>
              <p className="text-[10px] text-slate-500 font-poppins mt-0.5">Reading document text and checking contrast index...</p>
            </div>
          ) : report ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* If real document uploaded, show it here */}
              {uploadedImgUrl && (
                <div className="border border-slate-200 p-2 rounded-xl bg-slate-50 relative overflow-hidden">
                  <div className="absolute top-2 left-2 bg-success/90 text-white font-mono text-[9px] px-2 py-0.5 rounded shadow">
                    OCR COMPLETED
                  </div>
                  <img 
                    src={uploadedImgUrl} 
                    alt="Uploaded Aadhaar/PAN Doc" 
                    className="max-h-[140px] w-full object-contain rounded-lg mx-auto"
                  />
                </div>
              )}

              {/* Validation indicators */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center justify-between text-xs">
                  <span className="text-slate-550 font-poppins">Legibility Contrast</span>
                  <span className="text-success font-semibold font-mono">{report.contrast}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center justify-between text-xs">
                  <span className="text-slate-555 font-poppins">Blur Score</span>
                  <span className="text-success font-semibold font-mono">{report.blurLevel}</span>
                </div>
              </div>

              {/* Status banner */}
              <div className={`
                p-3.5 rounded-xl border flex gap-2.5 text-xs font-poppins
                ${report.isValid 
                  ? "bg-success/5 border-success/20 text-success" 
                  : "bg-danger/5 border-danger/20 text-danger"}
              `}>
                {report.isValid ? <ShieldCheck size={18} className="shrink-0" /> : <ShieldAlert size={18} className="shrink-0" />}
                <div>
                  <h4 className="font-bold uppercase tracking-wide">
                    {translateDynamic(report.isValid ? "Audit Success: Passed Verification" : "Audit Alert: Action Needed")}
                  </h4>
                  <p className="text-slate-655 mt-0.5 leading-relaxed text-[11px]">
                    {translateDynamic(report.isValid 
                      ? "Document meets legal guidelines, text is readable, and layout structures match."
                      : "We identified missing details or contrast issues. Re-upload is recommended.")}
                  </p>
                </div>
              </div>

              {/* Warnings List */}
              {report.warnings.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] text-danger font-semibold uppercase tracking-wider">Scanning Warnings</p>
                  <ul className="space-y-1 bg-danger/5 border border-danger/10 p-3 rounded-xl">
                    {report.warnings.map((w, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <span className="h-1.5 w-1.5 bg-danger rounded-full mt-1.5 shrink-0" />
                        <span>{translateDynamic(w)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* OCR Details (Editable for Hackathon simulation validation) */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                <h4 className="text-[10px] font-bold font-poppins text-slate-450 uppercase tracking-widest">
                  {translateDynamic("Parsed OCR Details (Verify & Edit)")}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-555 font-poppins">{translateDynamic("Document ID")}</span>
                    <input
                      type="text"
                      value={report.ocrData.documentId}
                      onChange={(e) => {
                        const updated = { ...report, ocrData: { ...report.ocrData, documentId: e.target.value } };
                        setReport(updated);
                      }}
                      className="bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800 font-mono mt-0.5 w-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-slate-555 font-poppins">{t("labelFullName")}</span>
                    <input
                      type="text"
                      value={report.ocrData.name}
                      onChange={(e) => {
                        const updated = { ...report, ocrData: { ...report.ocrData, name: e.target.value } };
                        setReport(updated);
                      }}
                      className="bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800 font-mono mt-0.5 w-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-slate-555 font-poppins">{t("labelDOB")}</span>
                    <input
                      type="text"
                      value={report.ocrData.dob}
                      onChange={(e) => {
                        const updated = { ...report, ocrData: { ...report.ocrData, dob: e.target.value } };
                        setReport(updated);
                      }}
                      className="bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800 font-mono mt-0.5 w-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-slate-555 font-poppins">{translateDynamic("Address Details")}</span>
                    <input
                      type="text"
                      value={report.ocrData.address}
                      onChange={(e) => {
                        const updated = { ...report, ocrData: { ...report.ocrData, address: e.target.value } };
                        setReport(updated);
                      }}
                      className="bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800 font-mono mt-0.5 w-full focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Autofill CTA */}
              <button
                onClick={handleAutoFill}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/95 hover:to-secondary/95 text-white font-poppins font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-primary/10"
              >
                <span>{t("btnAutofill")}</span>
                <ArrowRight size={14} />
              </button>

            </div>
          ) : (
            <div className="p-8 text-center text-slate-450">
              {translateDynamic("Please select a document type above or upload an image file to trigger scanning.")}
            </div>
          )}

        </div>

        {/* Right Column: Pre-filled Form Interface */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold font-space text-slate-800 uppercase tracking-wider">
                {t("headForm")}
              </h3>
              <p className="text-[10px] text-slate-500 font-poppins mt-0.5">
                Scheme: PM Awas Yojana (PMAY-G)
              </p>
            </div>
            {formFilled && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-success/15 text-success text-[10px] border border-success/30 font-semibold font-poppins">
                <Check size={10} /> Auto-Filled
              </span>
            )}
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  {t("labelFullName")}
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter full name"
                  className={`
                    w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all
                    ${formFilled ? "border-primary/30 bg-primary/[0.02] ring-1 ring-primary/20 font-medium text-slate-800" : "border-slate-200"}
                  `}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  {t("labelDocId")}
                </label>
                <input
                  type="text"
                  value={formData.identityNo}
                  onChange={(e) => setFormData({ ...formData, identityNo: e.target.value })}
                  placeholder="Enter Document number"
                  className={`
                    w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all
                    ${formFilled ? "border-primary/30 bg-primary/[0.02] ring-1 ring-primary/20 font-medium text-slate-800" : "border-slate-200"}
                  `}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  {t("labelDOB")}
                </label>
                <input
                  type="text"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  placeholder="DD/MM/YYYY"
                  className={`
                    w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all
                    ${formFilled ? "border-primary/30 bg-primary/[0.02] ring-1 ring-primary/20 font-medium text-slate-800" : "border-slate-200"}
                  `}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  {t("labelIncome")}
                </label>
                <input
                  type="text"
                  value={formData.income}
                  onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  placeholder="Enter annual income"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                {t("labelAddress")}
              </label>
              <textarea
                value={formData.residenceAddress}
                onChange={(e) => setFormData({ ...formData, residenceAddress: e.target.value })}
                placeholder="Enter complete house address"
                rows={3}
                className={`
                  w-full bg-slate-50 border rounded-xl p-4 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all resize-none
                  ${formFilled ? "border-primary/30 bg-primary/[0.02] ring-1 ring-primary/20 font-medium text-slate-800" : "border-slate-200"}
                `}
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                disabled={!formFilled}
                onClick={() => {
                  alert("Application submitted successfully through auto-filled portal data!");
                }}
                className="flex-1 bg-primary text-white hover:bg-primary/90 font-poppins font-semibold py-3 px-4 rounded-xl text-xs transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("btnSubmit")}
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* CSS Keyframes injected inline */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
};
