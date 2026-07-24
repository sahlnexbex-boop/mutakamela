"use client";

import { useState } from "react";
import { X, Lock, Phone, User, ArrowRight, Shield } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Successfully logged in with mobile: +966 ${mobile}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#3B25B0] flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {mode === "login"
                ? "Login to manage your policies, claims, and quotes"
                : "Register for seamless insurance coverage management"}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === "login" ? "bg-white text-[#3B25B0] shadow-sm" : "hover:text-slate-900"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === "register" ? "bg-white text-[#3B25B0] shadow-sm" : "hover:text-slate-900"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Saudi Mobile Number (+966)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="55 123 4567"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#3B25B0]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password / OTP</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#3B25B0]/30"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#3B25B0] hover:bg-[#2F1F99] text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <span>{mode === "login" ? "Login to Portal" : "Complete Registration"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
