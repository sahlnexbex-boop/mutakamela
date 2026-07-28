"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, Shield, ArrowRight, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ShadcnSelect } from "@/components/ui/select";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: string;
  initialData?: any;
}

export default function QuoteModal({
  isOpen,
  onClose,
  initialProduct = "Motor Insurance",
  initialData,
}: QuoteModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<"form" | "plans" | "success">("form");
  const [selectedProduct, setSelectedProduct] = useState(initialProduct);

  const [formData, setFormData] = useState({
    // Motor
    idNumber: "SAD8337",
    mobileNumber: "551234567",
    coverageType: "Comprehensive Protection",

    // Travel
    destination: "Worldwide",
    tripType: "Single Trip",
    travelEndDate: "",
    numTravelers: "1 Traveler",

    // Life
    dob: "",
    gender: "Male",
    occupation: "Private Sector Employee",
    coverageAmount: "SAR 250,000",

    // Visit Visa
    visaType: "Single Entry Tourist Visa",
    countryOfOrigin: "Egypt",
    entryDate: "",
    exitDate: "",
  });

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Sync state when modal opens or initialProduct/initialData changes
  useEffect(() => {
    if (isOpen) {
      setStep("form");
      if (initialProduct) {
        setSelectedProduct(initialProduct);
      }
      if (initialData) {
        setFormData((prev) => ({
          ...prev,
          idNumber: initialData.regNumber || initialData.iqamaNumber || initialData.passportNumber || prev.idNumber,
          mobileNumber: initialData.mobileNumber || prev.mobileNumber,
          destination: initialData.destination || prev.destination,
          travelEndDate: initialData.travelDate || prev.travelEndDate,
          visaType: initialData.visaNumber ? "Single Entry Tourist Visa" : prev.visaType,
        }));
      }
    }
  }, [isOpen, initialProduct, initialData]);

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

  const toOptions = (arr: string[]) => arr.map((item) => ({ value: item, label: item }));

  const destinationOptions = [
    "Worldwide",
    "Europe / Schengen",
    "GCC Countries",
    "USA & Canada",
    "Asia Pacific",
  ];

  const tripTypeOptions = [
    "Single Trip",
    "Annual Multi-Trip",
    "Family Trip",
    "Student Travel",
  ];

  const travelerOptions = [
    "1 Traveler",
    "2 Travelers",
    "3-5 Travelers",
    "6+ Travelers / Family",
  ];

  const genderOptions = ["Male", "Female"];

  const occupationOptions = [
    "Private Sector Employee",
    "Government Employee",
    "Self Employed / Business",
    "Student",
    "Retired",
    "Other",
  ];

  const coverageAmountOptions = [
    "SAR 100,000",
    "SAR 250,000",
    "SAR 500,000",
    "SAR 1,000,000+",
  ];

  const visaTypeOptions = [
    "Single Entry Tourist Visa",
    "Multiple Entry Tourist Visa",
    "Family Visit Visa",
    "Business Visit Visa",
  ];

  const countryOptions = [
    "Egypt",
    "India",
    "Pakistan",
    "Philippines",
    "United Kingdom",
    "United States",
    "Other",
  ];

  const getCoverageTypeOptions = () => {
    if (selectedProduct === "Motor Insurance") {
      return [
        "Comprehensive Protection",
        "Third Party Only (TPL)",
        "Executive Premium VIP",
      ];
    } else if (selectedProduct === "Travel Insurance") {
      return [
        "Comprehensive Protection",
        "Basic Medical Only",
        "Executive Travel Plus",
      ];
    } else if (selectedProduct === "Life Insurance") {
      return [
        "Comprehensive Protection",
        "Term Life",
        "Whole Life",
        "Critical Illness Rider",
      ];
    } else if (selectedProduct === "Visit Visa Insurance") {
      return [
        "Comprehensive Protection",
        "Standard Visa Care",
        "Medical & Evacuation",
      ];
    }
    return ["Comprehensive Protection", "Standard Protection", "VIP Protection"];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full max-h-[90vh] sm:max-h-[88vh] flex flex-col shadow-2xl border border-slate-100 relative overflow-hidden my-auto">
        
        {/* Close Button */}
        <button
          onClick={resetModal}
          className="absolute top-4 ltr:right-4 rtl:left-4 sm:top-5 sm:ltr:right-5 sm:rtl:left-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors z-20 bg-white/80 backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Inner Scrollable Container */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">

          {step === "form" && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-[#3B25B0] text-xs font-bold uppercase tracking-wider mb-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{t("instantQuoteForm")}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Get Quote for {selectedProduct}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Enter your details below to receive competitive insurance plans instantly.
                </p>
              </div>

              <form onSubmit={handleNext} className="space-y-4">
                
                {/* MOTOR INSURANCE FIELDS */}
                {selectedProduct === "Motor Insurance" && (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Insurance Type</label>
                      <ShadcnSelect
                        value={selectedProduct}
                        onChange={() => {}}
                        options={toOptions([selectedProduct])}
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Registration / ID / Passport Number</label>
                      <input
                        type="text"
                        required
                        value={formData.idNumber}
                        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                        placeholder="e.g. SAD8337"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#3B25B0]/30 focus:border-[#3B25B0] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (+966)</label>
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#3B25B0]/30 focus-within:border-[#3B25B0]">
                        <span className="px-3 text-xs font-bold text-slate-700 bg-slate-100 border-r border-slate-200 py-2.5 shrink-0 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          +966
                        </span>
                        <input
                          type="tel"
                          required
                          value={formData.mobileNumber}
                          onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                          placeholder="551234567"
                          className="w-full bg-transparent px-3 py-2.5 text-xs font-medium text-slate-800 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Coverage Plan Preference</label>
                      <ShadcnSelect
                        value={formData.coverageType}
                        onChange={(val) => setFormData({ ...formData, coverageType: val })}
                        options={toOptions(getCoverageTypeOptions())}
                        placeholder="Select Coverage Plan"
                      />
                    </div>
                  </div>
                )}

                {/* TRAVEL INSURANCE FIELDS */}
                {selectedProduct === "Travel Insurance" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Insurance Type</label>
                      <ShadcnSelect
                        value={selectedProduct}
                        onChange={() => {}}
                        options={toOptions([selectedProduct])}
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Travel Destination</label>
                      <ShadcnSelect
                        value={formData.destination}
                        onChange={(val) => setFormData({ ...formData, destination: val })}
                        options={toOptions(destinationOptions)}
                        placeholder="Select Destination"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Trip Type</label>
                      <ShadcnSelect
                        value={formData.tripType}
                        onChange={(val) => setFormData({ ...formData, tripType: val })}
                        options={toOptions(tripTypeOptions)}
                        placeholder="Select Trip Type"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Travel End Date</label>
                      <input
                        type="date"
                        required
                        value={formData.travelEndDate}
                        onChange={(e) => setFormData({ ...formData, travelEndDate: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#3B25B0]/30 focus:border-[#3B25B0] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Number of Travelers</label>
                      <ShadcnSelect
                        value={formData.numTravelers}
                        onChange={(val) => setFormData({ ...formData, numTravelers: val })}
                        options={toOptions(travelerOptions)}
                        placeholder="Select Number of Travelers"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (+966)</label>
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#3B25B0]/30 focus-within:border-[#3B25B0]">
                        <span className="px-2.5 text-xs font-bold text-slate-700 bg-slate-100 border-r border-slate-200 py-2.5 shrink-0 flex items-center gap-1">
                          +966
                        </span>
                        <input
                          type="tel"
                          required
                          value={formData.mobileNumber}
                          onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                          placeholder="551234567"
                          className="w-full bg-transparent px-2.5 py-2.5 text-xs font-medium text-slate-800 outline-none"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Coverage Plan Preference</label>
                      <ShadcnSelect
                        value={formData.coverageType}
                        onChange={(val) => setFormData({ ...formData, coverageType: val })}
                        options={toOptions(getCoverageTypeOptions())}
                        placeholder="Select Coverage Plan"
                      />
                    </div>
                  </div>
                )}

                {/* LIFE INSURANCE FIELDS */}
                {selectedProduct === "Life Insurance" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Insurance Type</label>
                      <ShadcnSelect
                        value={selectedProduct}
                        onChange={() => {}}
                        options={toOptions([selectedProduct])}
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        required
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#3B25B0]/30 focus:border-[#3B25B0] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                      <ShadcnSelect
                        value={formData.gender}
                        onChange={(val) => setFormData({ ...formData, gender: val })}
                        options={toOptions(genderOptions)}
                        placeholder="Select Gender"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Occupation</label>
                      <ShadcnSelect
                        value={formData.occupation}
                        onChange={(val) => setFormData({ ...formData, occupation: val })}
                        options={toOptions(occupationOptions)}
                        placeholder="Select Occupation"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Coverage Amount</label>
                      <ShadcnSelect
                        value={formData.coverageAmount}
                        onChange={(val) => setFormData({ ...formData, coverageAmount: val })}
                        options={toOptions(coverageAmountOptions)}
                        placeholder="Select Coverage Amount"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (+966)</label>
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#3B25B0]/30 focus-within:border-[#3B25B0]">
                        <span className="px-2.5 text-xs font-bold text-slate-700 bg-slate-100 border-r border-slate-200 py-2.5 shrink-0 flex items-center gap-1">
                          +966
                        </span>
                        <input
                          type="tel"
                          required
                          value={formData.mobileNumber}
                          onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                          placeholder="551234567"
                          className="w-full bg-transparent px-2.5 py-2.5 text-xs font-medium text-slate-800 outline-none"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Coverage Plan Preference</label>
                      <ShadcnSelect
                        value={formData.coverageType}
                        onChange={(val) => setFormData({ ...formData, coverageType: val })}
                        options={toOptions(getCoverageTypeOptions())}
                        placeholder="Select Coverage Plan"
                      />
                    </div>
                  </div>
                )}

                {/* VISIT VISA INSURANCE FIELDS */}
                {selectedProduct === "Visit Visa Insurance" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Insurance Type</label>
                      <ShadcnSelect
                        value={selectedProduct}
                        onChange={() => {}}
                        options={toOptions([selectedProduct])}
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Visa Type</label>
                      <ShadcnSelect
                        value={formData.visaType}
                        onChange={(val) => setFormData({ ...formData, visaType: val })}
                        options={toOptions(visaTypeOptions)}
                        placeholder="Select Visa Type"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Country of Origin</label>
                      <ShadcnSelect
                        value={formData.countryOfOrigin}
                        onChange={(val) => setFormData({ ...formData, countryOfOrigin: val })}
                        options={toOptions(countryOptions)}
                        placeholder="Select Country"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Entry Date</label>
                      <input
                        type="date"
                        required
                        value={formData.entryDate}
                        onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#3B25B0]/30 focus:border-[#3B25B0] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Exit Date</label>
                      <input
                        type="date"
                        required
                        value={formData.exitDate}
                        onChange={(e) => setFormData({ ...formData, exitDate: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#3B25B0]/30 focus:border-[#3B25B0] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (+966)</label>
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#3B25B0]/30 focus-within:border-[#3B25B0]">
                        <span className="px-2.5 text-xs font-bold text-slate-700 bg-slate-100 border-r border-slate-200 py-2.5 shrink-0 flex items-center gap-1">
                          +966
                        </span>
                        <input
                          type="tel"
                          required
                          value={formData.mobileNumber}
                          onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                          placeholder="551234567"
                          className="w-full bg-transparent px-2.5 py-2.5 text-xs font-medium text-slate-800 outline-none"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Coverage Plan Preference</label>
                      <ShadcnSelect
                        value={formData.coverageType}
                        onChange={(val) => setFormData({ ...formData, coverageType: val })}
                        options={toOptions(getCoverageTypeOptions())}
                        placeholder="Select Coverage Plan"
                      />
                    </div>
                  </div>
                )}

                {/* GENERAL / FALLBACK INSURANCE FIELDS */}
                {selectedProduct !== "Motor Insurance" &&
                  selectedProduct !== "Travel Insurance" &&
                  selectedProduct !== "Life Insurance" &&
                  selectedProduct !== "Visit Visa Insurance" && (
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Insurance Type</label>
                        <ShadcnSelect
                          value={selectedProduct}
                          onChange={() => {}}
                          options={toOptions([selectedProduct])}
                          disabled
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Registration / ID / Passport Number</label>
                        <input
                          type="text"
                          required
                          value={formData.idNumber}
                          onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                          placeholder="e.g. SAD8337"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#3B25B0]/30 focus:border-[#3B25B0] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (+966)</label>
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#3B25B0]/30 focus-within:border-[#3B25B0]">
                          <span className="px-3 text-xs font-bold text-slate-700 bg-slate-100 border-r border-slate-200 py-2.5 shrink-0 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            +966
                          </span>
                          <input
                            type="tel"
                            required
                            value={formData.mobileNumber}
                            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                            placeholder="551234567"
                            className="w-full bg-transparent px-3 py-2.5 text-xs font-medium text-slate-800 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Coverage Plan Preference</label>
                        <ShadcnSelect
                          value={formData.coverageType}
                          onChange={(val) => setFormData({ ...formData, coverageType: val })}
                          options={toOptions(getCoverageTypeOptions())}
                          placeholder="Select Coverage Plan"
                        />
                      </div>
                    </div>
                  )}

                <button
                  type="submit"
                  className="w-full bg-[#3B25B0] hover:bg-[#2F1F99] text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 mt-2"
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
                <p className="text-xs text-slate-500">Quotes generated for {selectedProduct}</p>
              </div>

              <div className="space-y-3">
                <div
                  onClick={() => handleSelectPlan("Standard Coverage")}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-[#3B25B0] bg-slate-50 hover:bg-indigo-50/50 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900">Standard Protection</div>
                    <div className="text-xs text-slate-500">Essential policy coverage</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-[#3B25B0]">SAR 850</div>
                    <div className="text-[10px] text-slate-400">per policy</div>
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
                    <div className="text-xs text-slate-500">Full medical & extra protection package</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-[#3B25B0]">SAR 1,890</div>
                    <div className="text-[10px] text-slate-400">per policy</div>
                  </div>
                </div>

                <div
                  onClick={() => handleSelectPlan("Executive VIP Platinum")}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-[#3B25B0] bg-slate-50 hover:bg-indigo-50/50 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900">Executive VIP Platinum</div>
                    <div className="text-xs text-slate-500">Zero deductible + global concierge</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-[#3B25B0]">SAR 2,450</div>
                    <div className="text-[10px] text-slate-400">per policy</div>
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
                Your quote for <span className="font-bold text-slate-900">{selectedProduct} - {selectedPlan}</span> has been created. A copy has been sent to +966 {formData.mobileNumber}.
              </p>

              <div className="bg-indigo-50/60 rounded-2xl p-4 text-xs space-y-1 text-slate-700 text-left border border-indigo-100">
                <div className="flex justify-between"><span>Policy Type:</span><span className="font-bold">{selectedProduct}</span></div>
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
    </div>
  );
}
