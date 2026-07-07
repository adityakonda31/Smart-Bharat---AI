import React, { useState } from "react";
import { Mail, Phone, Lock, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Login: React.FC = () => {
  const { loginWithEmail, loginWithOTP, loginWithGoogle, loading } = useAuth();
  const [loginMethod, setLoginMethod] = useState<"email" | "otp">("email");
  
  // Form values
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === "email") {
      if (!email) return;
      await loginWithEmail(email);
    } else {
      if (!phone) return;
      if (!otpSent) {
        // Trigger simulated OTP dispatch
        setOtpSent(true);
      } else {
        if (!otpCode) return;
        await loginWithOTP(phone, otpCode);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background aurora lights - Soft Light pastels */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-secondary/5 blur-[90px] pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl glass-panel border border-slate-200/80 p-8 shadow-xl relative flex flex-col items-center space-y-6">
        
        {/* Logo and title */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center shadow-md shadow-primary/20 mx-auto">
            <span className="text-white font-space font-extrabold text-xl">SB</span>
          </div>
          <h1 className="text-2xl font-bold font-space text-slate-800 tracking-wider">
            SMART BHARAT
          </h1>
          <p className="text-xs text-slate-500 font-poppins">
            AI Powered Civic Companion Portal
          </p>
        </div>

        {/* Tab selector */}
        <div className="grid grid-cols-2 gap-1.5 w-full bg-slate-100 p-1.5 rounded-2xl border border-slate-200/40 shrink-0">
          <button
            onClick={() => {
              setLoginMethod("email");
              setOtpSent(false);
            }}
            className={`
              py-2 text-[10px] font-bold font-poppins rounded-xl uppercase tracking-wider transition-all
              ${loginMethod === "email" 
                ? "bg-white text-slate-800 shadow-sm border border-slate-200/50" 
                : "text-slate-500 hover:text-slate-800"}
            `}
          >
            Email Login
          </button>
          <button
            onClick={() => setLoginMethod("otp")}
            className={`
              py-2 text-[10px] font-bold font-poppins rounded-xl uppercase tracking-wider transition-all
              ${loginMethod === "otp" 
                ? "bg-white text-slate-800 shadow-sm border border-slate-200/50" 
                : "text-slate-500 hover:text-slate-800"}
            `}
          >
            OTP Login
          </button>
        </div>

        {/* Form panel */}
        <form onSubmit={handleAuthSubmit} className="w-full space-y-4">
          {loginMethod === "email" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="flex items-center space-x-3 bg-white border border-slate-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 rounded-2xl px-4 py-3 transition-all">
                  <Mail className="text-slate-400" size={16} />
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-400 focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="flex items-center space-x-3 bg-white border border-slate-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 rounded-2xl px-4 py-3 transition-all">
                  <Lock className="text-slate-400" size={16} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="flex-1 bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-400 focus:ring-0"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {!otpSent ? (
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <div className="flex items-center space-x-3 bg-white border border-slate-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 rounded-2xl px-4 py-3 transition-all">
                    <Phone className="text-slate-400" size={16} />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-400 focus:ring-0"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Enter 6-Digit OTP Code
                  </label>
                  <div className="flex items-center space-x-3 bg-white border border-slate-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 rounded-2xl px-4 py-3 transition-all">
                    <Lock className="text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Enter 123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-400 focus:ring-0 tracking-[0.3em] text-center"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 font-poppins">
                    OTP dispatched to {phone}. Type <strong className="text-slate-800">123456</strong> to proceed.
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-poppins font-semibold py-3.5 px-4 rounded-2xl text-xs transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                Authenticating...
              </>
            ) : (
              <>
                {loginMethod === "otp" && !otpSent ? "Request OTP code" : "Sign In to companion"}
              </>
            )}
          </button>
        </form>

        {/* Separator line */}
        <div className="w-full flex items-center justify-between text-[10px] text-slate-400 font-mono tracking-widest uppercase">
          <span className="h-[1px] bg-slate-200 flex-1" />
          <span className="px-3">or credentials</span>
          <span className="h-[1px] bg-slate-200 flex-1" />
        </div>

        {/* Google Authentication federated button - FIX: Added type="button" */}
        <button
          type="button"
          onClick={loginWithGoogle}
          disabled={loading}
          className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-poppins font-medium py-3 px-4 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#ea4335"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34a853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#fbbc05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#4285f4"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Footer advisory */}
        <div className="flex items-center space-x-2 text-[9px] text-slate-500 font-poppins">
          <Shield size={12} className="text-secondary" />
          <span>Secured by National Identity Single Sign-On (SSO)</span>
        </div>

      </div>
    </div>
  );
};
