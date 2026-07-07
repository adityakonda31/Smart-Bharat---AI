import React, { useState } from "react";
import { Sparkles, ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export const Onboarding: React.FC = () => {
  const { completeOnboarding } = useAuth();
  const { t, translateDynamic } = useLanguage();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Demographic attributes state
  const [profile, setProfile] = useState({
    age: 21,
    gender: "Male",
    income: 180000,
    category: "General",
    state: "Delhi",
    isStudent: true,
    isFarmer: false,
    isBusiness: false,
    isSeniorCitizen: false,
    isDisabled: false
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    await completeOnboarding(profile);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial pastel overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.05),transparent_50%)]" />

      {/* Onboarding Glass Card */}
      <div className="w-full max-w-lg rounded-3xl glass-panel border border-slate-200/80 p-8 shadow-xl relative flex flex-col bg-white">
        
        {/* Progress indicator */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles size={12} className="animate-spin" />
            </div>
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase font-bold">
              {translateDynamic("Onboarding Profile Setup")}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 font-semibold">
            {translateDynamic("Step")} {step} {translateDynamic("of")} 4
          </span>
        </div>

        {/* Step Content */}
        <div className="flex-1 min-h-[220px]">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold font-space text-slate-800 leading-tight">
                {translateDynamic("Let's configure your profile base.")}
              </h2>
              <p className="text-xs text-slate-655 font-poppins">
                {translateDynamic("This helps our AI system matching algorithms rank regional schemes and checks eligibility rules dynamically.")}
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-555 uppercase tracking-wider mb-1.5">
                    {t("labelAge")}
                  </label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white border border-slate-200 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none transition-all focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-555 uppercase tracking-wider mb-1.5">
                    {t("labelGender")}
                  </label>
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    className="w-full bg-white border border-slate-200 focus:border-primary rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none transition-all focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="Male" className="bg-white text-slate-800">{translateDynamic("Male")}</option>
                    <option value="Female" className="bg-white text-slate-800">{translateDynamic("Female")}</option>
                    <option value="Other" className="bg-white text-slate-800">{translateDynamic("Other")}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold font-space text-slate-800 leading-tight">
                {translateDynamic("Income and region parameters.")}
              </h2>
              <p className="text-xs text-slate-655 font-poppins">
                {translateDynamic("Government benefits criteria are strictly tied to family income limits and state jurisdictions.")}
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-555 uppercase tracking-wider mb-1.5">
                    {t("labelIncome")}
                  </label>
                  <input
                    type="number"
                    value={profile.income}
                    onChange={(e) => setProfile({ ...profile, income: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white border border-slate-200 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none transition-all focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-555 uppercase tracking-wider mb-1.5">
                    {t("labelCategory")}
                  </label>
                  <select
                    value={profile.category}
                    onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                    className="w-full bg-white border border-slate-200 focus:border-primary rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none transition-all focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="General" className="bg-white text-slate-800">{translateDynamic("General")}</option>
                    <option value="OBC" className="bg-white text-slate-800">{translateDynamic("OBC")}</option>
                    <option value="SC" className="bg-white text-slate-800">{translateDynamic("SC")}</option>
                    <option value="ST" className="bg-white text-slate-800">{translateDynamic("ST")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-555 uppercase tracking-wider mb-1.5">
                  {t("labelState")}
                </label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  placeholder="e.g. Delhi, Maharashtra, Tamil Nadu"
                  className="w-full bg-white border border-slate-200 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none transition-all placeholder-slate-400 focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold font-space text-slate-800 leading-tight">
                {translateDynamic("Activity & classifications.")}
              </h2>
              <p className="text-xs text-slate-655 font-poppins">
                {translateDynamic("Select category criteria that fit your background to unlock targeted scheme lists.")}
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center space-x-2.5 text-xs text-slate-700 cursor-pointer bg-slate-50 border border-slate-200 p-3 rounded-xl hover:border-slate-350 transition-all shadow-sm">
                  <input
                    type="checkbox"
                    checked={profile.isStudent}
                    onChange={(e) => setProfile({ ...profile, isStudent: e.target.checked })}
                    className="rounded border-slate-300 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <span>{translateDynamic("Student")}</span>
                </label>

                <label className="flex items-center space-x-2.5 text-xs text-slate-700 cursor-pointer bg-slate-50 border border-slate-200 p-3 rounded-xl hover:border-slate-350 transition-all shadow-sm">
                  <input
                    type="checkbox"
                    checked={profile.isFarmer}
                    onChange={(e) => setProfile({ ...profile, isFarmer: e.target.checked })}
                    className="rounded border-slate-300 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <span>{translateDynamic("Farmer")}</span>
                </label>

                <label className="flex items-center space-x-2.5 text-xs text-slate-700 cursor-pointer bg-slate-50 border border-slate-200 p-3 rounded-xl hover:border-slate-350 transition-all shadow-sm">
                  <input
                    type="checkbox"
                    checked={profile.isBusiness}
                    onChange={(e) => setProfile({ ...profile, isBusiness: e.target.checked })}
                    className="rounded border-slate-300 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <span>{translateDynamic("Business Owner")}</span>
                </label>

                <label className="flex items-center space-x-2.5 text-xs text-slate-700 cursor-pointer bg-slate-50 border border-slate-200 p-3 rounded-xl hover:border-slate-350 transition-all shadow-sm">
                  <input
                    type="checkbox"
                    checked={profile.isDisabled}
                    onChange={(e) => setProfile({ ...profile, isDisabled: e.target.checked })}
                    className="rounded border-slate-300 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <span>{translateDynamic("Disabled (UDID)")}</span>
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-center py-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="h-14 w-14 rounded-full bg-success/10 text-success border border-success/30 flex items-center justify-center mx-auto mb-4 animate-[bounce_1s_infinite]">
                <ShieldCheck size={28} />
              </div>
              <h2 className="text-xl font-bold font-space text-slate-800 leading-tight">
                {translateDynamic("Profile config ready!")}
              </h2>
              <p className="text-xs text-slate-655 font-poppins max-w-sm mx-auto leading-relaxed">
                {translateDynamic("Smart Bharat AI dashboard will prioritize scholarships, public service updates, and PWD local centers coordinates matches based on this configuration.")}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-8">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="flex items-center space-x-2 text-xs font-semibold font-poppins text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowLeft size={14} />
            <span>{t("btnBack")}</span>
          </button>

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs font-semibold font-poppins text-slate-700 transition-all shadow-sm"
            >
              <span>{t("btnContinue")}</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-xs font-semibold font-poppins text-white transition-all shadow-md shadow-primary/20"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                  Building Dashboard...
                </>
              ) : (
                <>
                  <span>{translateDynamic("Enter Smart Bharat Platform")}</span>
                  <CheckCircle2 size={14} />
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
