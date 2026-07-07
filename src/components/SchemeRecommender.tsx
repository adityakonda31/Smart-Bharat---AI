import React, { useState, useEffect } from "react";
import { Award, Sparkles, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { schemesData, type Scheme } from "../data/schemes";

interface RecommendationResult {
  scheme: Scheme;
  matchPercentage: number;
  isEligible: boolean;
  reasons: string[];
  missingDocs: string[];
}

export const SchemeRecommender: React.FC = () => {
  const { user } = useAuth();
  const { t, translateDynamic } = useLanguage();
  
  // Form State initialized with logged-in user profile parameters
  const [params, setParams] = useState({
    age: 21,
    income: 180000,
    gender: "Male",
    occupation: "Student",
    state: "Delhi",
    category: "General",
    isStudent: true,
    isFarmer: false,
    isBusiness: false,
    isSeniorCitizen: false,
    isDisabled: false
  });

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<RecommendationResult | null>(null);

  // Sync profile data on initial mount if available
  useEffect(() => {
    if (user && user.profile) {
      setParams({
        age: user.profile.age || 21,
        income: user.profile.income || 180000,
        gender: user.profile.gender || "Male",
        occupation: user.profile.occupation || "Student",
        state: user.profile.state || "Delhi",
        category: user.profile.category || "General",
        isStudent: user.profile.isStudent,
        isFarmer: user.profile.isFarmer,
        isBusiness: user.profile.isBusiness,
        isSeniorCitizen: user.profile.isSeniorCitizen,
        isDisabled: user.profile.isDisabled
      });
    }
  }, [user]);

  const handleRecommend = async () => {
    setLoading(true);
    setSelectedResult(null);

    // Simulate AI matcher calculations latency
    await new Promise((resolve) => setTimeout(resolve, 1800));

    const results: RecommendationResult[] = schemesData.map((scheme) => {
      let matchPercentage = 100;
      const reasons: string[] = [];
      const missingDocs: string[] = [];

      // 1. Age check
      if (scheme.eligibility.minAge && params.age < scheme.eligibility.minAge) {
        matchPercentage -= 20;
        reasons.push(`Minimum age required is ${scheme.eligibility.minAge} (Applicant is ${params.age}).`);
      }
      if (scheme.eligibility.maxAge && params.age > scheme.eligibility.maxAge) {
        matchPercentage -= 20;
        reasons.push(`Maximum age limit is ${scheme.eligibility.maxAge} (Applicant is ${params.age}).`);
      }

      // 2. Income check
      if (scheme.eligibility.maxIncome && params.income > scheme.eligibility.maxIncome) {
        matchPercentage -= 25;
        reasons.push(`Maximum family annual income threshold is ₹${scheme.eligibility.maxIncome.toLocaleString()} (Applicant's is ₹${params.income.toLocaleString()}).`);
      }

      // 3. Gender check
      if (scheme.eligibility.genders && !scheme.eligibility.genders.includes(params.gender)) {
        matchPercentage -= 30;
        reasons.push(`Scheme is restricted only to ${scheme.eligibility.genders.join(", ")} applicants.`);
      }

      // 4. Role toggles
      if (scheme.eligibility.isFarmer && !params.isFarmer) {
        matchPercentage -= 30;
        reasons.push("Applicant profile does not indicate land-owning agricultural farmer status.");
        missingDocs.push("Land registration titles (RoR/Khatauni)");
      }
      if (scheme.eligibility.isStudent && !params.isStudent) {
        matchPercentage -= 30;
        reasons.push("Applicant profile does not indicate active student status.");
        missingDocs.push("School/College Marksheets & Bonafide Certificate");
      }
      if (scheme.eligibility.isBusiness && !params.isBusiness) {
        matchPercentage -= 30;
        reasons.push("Applicant profile does not indicate micro-enterprise business owner status.");
        missingDocs.push("Business registration certificate or expansion project layout");
      }
      if (scheme.eligibility.isSeniorCitizen && !params.isSeniorCitizen) {
        matchPercentage -= 30;
        reasons.push("Applicant must be senior citizen (60+ years).");
      }
      if (scheme.eligibility.isDisabled && !params.isDisabled) {
        matchPercentage -= 40;
        reasons.push("Disability rehabilitation benefits require certified disability UDID profile status.");
        missingDocs.push("UDID Disability Certificate");
      }

      // 5. Category filter
      if (scheme.eligibility.categories && !scheme.eligibility.categories.includes(params.category)) {
        matchPercentage -= 15;
        reasons.push(`Scheme lists targets in categories: ${scheme.eligibility.categories.join(", ")} (Applicant category is ${params.category}).`);
        missingDocs.push("Category Caste Certificate (SC/ST/OBC)");
      }

      matchPercentage = Math.max(0, matchPercentage);
      const isEligible = matchPercentage >= 75;

      return {
        scheme,
        matchPercentage,
        isEligible,
        reasons,
        missingDocs
      };
    });

    // Sort by matching score descending
    results.sort((a, b) => b.matchPercentage - a.matchPercentage);
    setRecommendations(results);
    setSelectedResult(results[0]);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/15 via-accent/10 to-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-space text-slate-800 tracking-wider flex items-center gap-2">
              <Award className="text-primary animate-pulse" />
              {translateDynamic("AI GOVERNMENT SCHEME FINDER")}
            </h2>
            <p className="text-sm text-slate-650 leading-relaxed">
              {translateDynamic("Input age, income, and occupation details. The AI cross-analyzes eligibility guidelines across central databases to calculate approval odds and outline documentation gaps.")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Demographic Input Form */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 flex flex-col space-y-4 shadow-sm bg-white">
          <h3 className="text-sm font-bold font-space text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex justify-between items-center">
            <span>{t("headDemographics")}</span>
            <span className="text-[10px] text-slate-400 font-mono">{translateDynamic("STEP 1: DETAILS")}</span>
          </h3>

          <div className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  {translateDynamic("Age (Years)")}
                </label>
                <input
                  type="number"
                  value={params.age}
                  onChange={(e) => setParams({ ...params, age: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-200 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none transition-all focus:ring-1 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  {translateDynamic("Gender")}
                </label>
                <select
                  value={params.gender}
                  onChange={(e) => setParams({ ...params, gender: e.target.value })}
                  className="w-full bg-white border border-slate-200 focus:border-primary rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none transition-all focus:ring-1 focus:ring-primary/20"
                >
                  <option value="Male">{translateDynamic("Male")}</option>
                  <option value="Female">{translateDynamic("Female")}</option>
                  <option value="Other">{translateDynamic("Other")}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  {t("labelIncome")}
                </label>
                <input
                  type="number"
                  value={params.income}
                  onChange={(e) => setParams({ ...params, income: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-200 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none transition-all focus:ring-1 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  {t("labelCategory")}
                </label>
                <select
                  value={params.category}
                  onChange={(e) => setParams({ ...params, category: e.target.value })}
                  className="w-full bg-white border border-slate-200 focus:border-primary rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none transition-all focus:ring-1 focus:ring-primary/20"
                >
                  <option value="General">{translateDynamic("General")}</option>
                  <option value="OBC">{translateDynamic("OBC")}</option>
                  <option value="SC">{translateDynamic("SC")}</option>
                  <option value="ST">{translateDynamic("ST")}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                {t("labelOccupation")}
              </label>
              <input
                type="text"
                value={params.occupation}
                onChange={(e) => setParams({ ...params, occupation: e.target.value })}
                className="w-full bg-white border border-slate-200 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none transition-all focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {/* Profile Flags Checklist */}
            <div className="space-y-3 pt-2">
              <label className="block text-[10px] font-semibold text-slate-555 uppercase tracking-wider">
                {translateDynamic("Profile Classifications")}
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer bg-slate-50 border border-slate-200 p-2.5 rounded-lg hover:border-slate-350 transition-all shadow-sm">
                  <input
                    type="checkbox"
                    checked={params.isStudent}
                    onChange={(e) => setParams({ ...params, isStudent: e.target.checked })}
                    className="rounded border-slate-350 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <span>{translateDynamic("Student")}</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer bg-slate-50 border border-slate-200 p-2.5 rounded-lg hover:border-slate-350 transition-all shadow-sm">
                  <input
                    type="checkbox"
                    checked={params.isFarmer}
                    onChange={(e) => setParams({ ...params, isFarmer: e.target.checked })}
                    className="rounded border-slate-350 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <span>{translateDynamic("Farmer")}</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer bg-slate-50 border border-slate-200 p-2.5 rounded-lg hover:border-slate-350 transition-all shadow-sm">
                  <input
                    type="checkbox"
                    checked={params.isBusiness}
                    onChange={(e) => setParams({ ...params, isBusiness: e.target.checked })}
                    className="rounded border-slate-350 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <span>{translateDynamic("Business Owner")}</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer bg-slate-50 border border-slate-200 p-2.5 rounded-lg hover:border-slate-350 transition-all shadow-sm">
                  <input
                    type="checkbox"
                    checked={params.isDisabled}
                    onChange={(e) => setParams({ ...params, isDisabled: e.target.checked })}
                    className="rounded border-slate-350 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <span>{translateDynamic("Disabled (UDID)")}</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleRecommend}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-poppins font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-primary/10 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                  {translateDynamic("Evaluating government catalogs")}
                </>
              ) : (
                <>
                  <Sparkles size={14} /> {translateDynamic("Calculate Eligible Schemes")}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: recommendations output list & single recommendation details */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="glass-panel p-8 rounded-2xl border border-slate-200 flex flex-col items-center justify-center h-full min-h-[380px] relative overflow-hidden bg-white shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-100/5 to-slate-100/10 skeleton-shimmer" />
              <div className="relative space-y-4 text-center">
                <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <h4 className="text-sm font-semibold text-slate-800 font-space uppercase">{translateDynamic("Evaluating government catalogs")}</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  {translateDynamic("Checking land indices, credit parameters, age caps, and tax records...")}
                </p>
              </div>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* List grid */}
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                <p className="text-[10px] text-slate-400 font-poppins uppercase tracking-wider">{translateDynamic("Matched active schemes")}</p>
                {recommendations.map((res, idx) => {
                  const isSelected = selectedResult?.scheme.id === res.scheme.id;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedResult(res)}
                      className={`
                        w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-2.5
                        ${isSelected 
                          ? "bg-primary/10 border-primary/30 shadow-sm text-slate-800" 
                          : "bg-white border-slate-150 hover:bg-slate-50 text-slate-700"}
                      `}
                    >
                      <div className="flex justify-between items-start gap-3 w-full">
                        <h4 className="text-xs font-bold font-space truncate flex-1 leading-snug">
                          {translateDynamic(res.scheme.name)}
                        </h4>
                        <span className={`
                          px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase shrink-0
                          ${res.isEligible 
                            ? "bg-success/15 text-success border border-success/30" 
                            : "bg-danger/15 text-danger border border-danger/30"}
                        `}>
                          {res.matchPercentage}% Odds
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {translateDynamic(res.scheme.description)}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Selected Scheme Detail panel */}
              <div>
                {selectedResult ? (
                  <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 space-y-4 animate-in fade-in duration-200 bg-white shadow-sm">
                    
                    {/* Header */}
                    <div className="border-b border-slate-100 pb-3.5 space-y-2">
                      <span className="text-[9px] bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-md font-poppins uppercase font-bold tracking-wider">
                        {translateDynamic(selectedResult.scheme.category)}
                      </span>
                      <h3 className="text-sm font-bold font-space text-slate-800 leading-snug">
                        {translateDynamic(selectedResult.scheme.name)}
                      </h3>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-poppins">{translateDynamic("Scheme Description")}</h4>
                      <p className="text-xs text-slate-655 leading-relaxed">
                        {translateDynamic(selectedResult.scheme.description)}
                      </p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-poppins">{translateDynamic("Entitled Benefits")}</h4>
                      <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                        {translateDynamic(selectedResult.scheme.benefits)}
                      </p>
                    </div>

                    {/* Document compliance check */}
                    <div className="space-y-1.5">
                      <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-poppins">{t("headRequiredDocs")}</h4>
                      <ul className="grid grid-cols-1 gap-1">
                        {selectedResult.scheme.docsRequired.map((doc, idx) => {
                          const isMissing = selectedResult.missingDocs.includes(doc);
                          return (
                            <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                              {isMissing ? (
                                <AlertCircle size={12} className="text-danger shrink-0" />
                              ) : (
                                <CheckCircle2 size={12} className="text-success shrink-0" />
                              )}
                              <span className={isMissing ? "text-danger" : "text-slate-650"}>{translateDynamic(doc)}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Eligibility check checklist reason */}
                    {selectedResult.reasons.length > 0 && (
                      <div className="bg-danger/5 border border-danger/10 p-3 rounded-xl space-y-1">
                        <span className="text-[9px] font-bold text-danger uppercase tracking-wider">{translateDynamic("Gaps to become eligible")}</span>
                        <ul className="space-y-1 text-[11px] text-slate-500">
                          {selectedResult.reasons.map((r, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-danger mt-1.5 shrink-0" />
                              <span>{translateDynamic(r)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Apply actions */}
                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                      <a
                        href={selectedResult.scheme.officialLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        {translateDynamic("Official Portal")} <ArrowUpRight size={12} />
                      </a>
                      <button
                        onClick={() => alert(`Redirecting application flow simulation for ${selectedResult.scheme.name}`)}
                        className="flex-1 bg-primary hover:bg-primary/95 text-white py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-primary/10"
                      >
                        {t("btnApply")}
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="text-center p-8 text-slate-400">
                    {translateDynamic("Select a scheme on the left to inspect detailed specifications.")}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-slate-200 flex flex-col items-center justify-center h-full min-h-[380px] text-center text-slate-400 bg-white shadow-sm">
              <Award className="text-slate-450 mb-2 animate-bounce" size={32} />
              <h4 className="text-sm font-semibold text-slate-800 font-space">{translateDynamic("Audit calculations waiting")}</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                {translateDynamic("Confirm your demographic profile details on the left, and run the calculation checklist analyzer.")}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
