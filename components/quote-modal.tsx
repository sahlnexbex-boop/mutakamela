"use client";

import { useState } from "react";
import { X, CheckCircle, Shield, Car, Plane, Heart, Building, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: string;
  initialData?: any;
}

export default function QuoteModal({ isOpen, onClose, initialProduct = "Motor Insurance", initialData }: QuoteModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<"form" | "plans" | "success">("form");
  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const [formData, setFormData] = useState({
    idNumber: initialData?.regNumber || "SAD8337",
    mobileNumber: initialData?.mobileNumber || "551234567",
    coverageType: "Comprehensive",
  });
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("plans");
  };

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    setStep("success");
  };

  const resetModal = () => {
    setStep("form");
    setSelectedPlan(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={resetModal}
          className="absolute top-5 ltr:right-5 rtl:left-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === "form" && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-[#3B25B0] text-xs font-bold uppercase tracking-wider mb-2">
                <Shield className="w-3.5 h-3.5" />
                <span>{t("instantQuoteForm")}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                {t("getQuoteFor")} {selectedProduct}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter your details below to receive competitive insurance plans instantly.
              </p>
            </div>

            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Insurance Type</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#3B25B0]/30"
                >
                  <option value="Motor Insurance">Motor Insurance</option>
                  <option value="Travel Insurance">Travel Insurance</option>
                  <option value="Life Insurance">Life Insurance</option>
                  <option value="Visit Visa Insurance">Visit Visa Insurance</option>
                  <option value="General Insurance">General Insurance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Registration / ID / Passport Number</label>
                <input
                  type="text"
                  required
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  placeholder="e.g. 1092837465 or SAD8337"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#3B25B0]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (+966)</label>
                <input
                  type="tel"
                  required
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  placeholder="55 123 4567"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#3B25B0]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Coverage Plan Preference</label>
                <select
                  value={formData.coverageType}
                  onChange={(e) => setFormData({ ...formData, coverageType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#3B25B0]/30"
                >
                  <option value="Third Party">Third Party Only (TPL)</option>
                  <option value="Comprehensive">Comprehensive Protection</option>
                  <option value="Premium VIP">Executive Premium VIP</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#3B25B0] hover:bg-[#2F1F99] text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Calculate Best Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {step === "plans" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Select Your Plan</h3>
              <p className="text-xs text-slate-500">Quotes generated for ID #{formData.idNumber}</p>
            </div>

            <div className="space-y-3">
              <div
                onClick={() => handleSelectPlan("Third Party Basic")}
                className="p-4 rounded-2xl border border-slate-200 hover:border-[#3B25B0] bg-slate-50 hover:bg-indigo-50/50 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900">Third Party Protection</div>
                  <div className="text-xs text-slate-500">Standard legal liability coverage</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-[#3B25B0]">SAR 850</div>
                  <div className="text-[10px] text-slate-400">per year</div>
                </div>
              </div>

              <div
                onClick={() => handleSelectPlan("Comprehensive Gold")}
                className="p-4 rounded-2xl border-2 border-[#3B25B0] bg-indigo-50/70 cursor-pointer transition-all flex items-center justify-between relative shadow-sm"
              >
                <span className="absolute -top-2.5 right-4 bg-[#3B25B0] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                  POPULAR CHOICE
                </span>
                <div>
                  <div className="font-bold text-sm text-slate-900">Comprehensive Gold</div>
                  <div className="text-xs text-slate-500">Full vehicle repair + roadside assistance</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-[#3B25B0]">SAR 1,890</div>
                  <div className="text-[10px] text-slate-400">per year</div>
                </div>
              </div>

              <div
                onClick={() => handleSelectPlan("Executive VIP Platinum")}
                className="p-4 rounded-2xl border border-slate-200 hover:border-[#3B25B0] bg-slate-50 hover:bg-indigo-50/50 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900">Executive VIP Platinum</div>
                  <div className="text-xs text-slate-500">Zero deductible + rental car + agency repair</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-[#3B25B0]">SAR 2,450</div>
                  <div className="text-[10px] text-slate-400">per year</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep("form")}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition-colors"
            >
              ← Back to Quote Form
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900">Quote Issued Successfully!</h3>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Your policy quote for <span className="font-bold text-slate-900">{selectedPlan}</span> has been created. A copy has been sent to +966 {formData.mobileNumber}.
            </p>

            <div className="bg-indigo-50/60 rounded-2xl p-4 text-xs space-y-1 text-slate-700 text-left border border-indigo-100">
              <div className="flex justify-between"><span>Policy Reference:</span><span className="font-bold">MTK-2026-{Math.floor(100000 + Math.random() * 900000)}</span></div>
              <div className="flex justify-between"><span>Status:</span><span className="font-bold text-emerald-600">Ready to Activate</span></div>
            </div>

            <button
              onClick={resetModal}
              className="w-full bg-[#3B25B0] hover:bg-[#2F1F99] text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all"
            >
              Proceed to Instant Purchase
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
