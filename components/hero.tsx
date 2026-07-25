"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Car,
  Plane,
  HeartHandshake,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  Clock,
  Users,
  Headphones,
} from "lucide-react";
import { ShadcnSelect } from "@/components/ui/select";
import { ShadcnDatePicker } from "@/components/ui/date-picker";

interface HeroProps {
  onOpenQuoteModal?: (productType?: string, data?: any) => void;
}

export default function Hero({ onOpenQuoteModal }: HeroProps) {
  const [activeTab, setActiveTab] = useState<"motor" | "travel" | "life" | "visa">("motor");

  // State for all tab forms
  const [regNumber, setRegNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [iqamaNumber, setIqamaNumber] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [visaNumber, setVisaNumber] = useState("");

  const destinationOptions = [
    { value: "Worldwide", label: "Worldwide" },
    { value: "Europe / Schengen", label: "Europe / Schengen" },
    { value: "GCC Countries", label: "GCC Countries" },
    { value: "USA & Canada", label: "USA & Canada" },
    { value: "Asia Pacific", label: "Asia Pacific" },
  ];

  const handleGetQuote = (e: React.FormEvent) => {
    e.preventDefault();
    let productType = "Motor Insurance";
    let data: any = {};

    if (activeTab === "motor") {
      productType = "Motor Insurance";
      data = { regNumber, mobileNumber };
    } else if (activeTab === "travel") {
      productType = "Travel Insurance";
      data = { destination, travelDate };
    } else if (activeTab === "life") {
      productType = "Life Insurance";
      data = { iqamaNumber, mobileNumber };
    } else if (activeTab === "visa") {
      productType = "Visit Visa Insurance";
      data = { passportNumber, visaNumber };
    }

    onOpenQuoteModal?.(productType, data);
  };

  return (
    <section className="relative overflow-x-clip bg-hero-gradient pt-6 pb-10 sm:pb-12 lg:pt-10 lg:pb-16">

      {/* Background Subtle Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-100/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Hero Graphic Column (order-1 on mobile screen = COMES FIRST) */}
          <div className="w-full lg:col-span-6 relative flex justify-center items-center order-1 lg:order-2 mb-6 sm:mb-8 lg:mb-0" data-gsap="scale">

            {/* Main Hero Image */}
            <div className="relative w-[88%] sm:w-[80%] lg:w-[84%] max-w-md lg:max-w-lg mx-auto pb-4">
              <Image
                src="/images/home.png"
                alt="Mutakamela Family & Vehicle Protection"
                width={560}
                height={500}
                priority
                className="w-full h-auto max-h-[460px] object-contain mx-auto"
              />

              {/* Floating App Badge Overlay - Centered on X-axis & positioned at bottom outer model */}
              <div className="absolute -bottom-5 sm:-bottom-6 lg:-bottom-7 left-1/2 -translate-x-1/2 w-[92%] sm:w-[88%] max-w-[340px] sm:max-w-sm bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 shadow-soft-xl border border-slate-100/90 flex items-center justify-between space-x-2.5 sm:space-x-3 transition-transform hover:scale-[1.02] duration-300 z-20">
                <div className="w-10 h-10 sm:w-11 sm:h-11 relative shrink-0">
                  <Image
                    src="/images/small_mobile.png"
                    alt="Mutakamela App"
                    width={44}
                    height={44}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 truncate leading-tight">
                    Get the mutakamela App
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-2 leading-tight mt-0.5">
                    manage your policy, claims and more on the go.
                  </div>
                </div>

                <div className="w-10 h-10 sm:w-11 sm:h-11 relative shrink-0">
                  <Image
                    src="/images/scanner.png"
                    alt="QR Scanner"
                    width={44}
                    height={44}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Heading Text & Form Column (order-2 on mobile screen = COMES SECOND) */}
          <div className="w-full lg:col-span-6 space-y-5 order-2 lg:order-1" data-gsap="fade-up">

            {/* Trusted Protection Tag */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>TRUSTED PROTECTION</span>
            </div>

            {/* Hero Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-slate-900 leading-[1.2] tracking-tight">
              Protection for today, peace of mind for <span className="text-[#3B25B0]">tomorrow</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-500 max-w-lg font-normal leading-relaxed">
              Comprehensive insurance solutions for you, your family and your business.
            </p>

            {/* Interactive Tabbed Form Card - z-30 for popover overlay */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-soft-lg border border-slate-100/80 transition-all duration-300 relative z-30">

              {/* Product Tabs Navigation - Tab radius removed */}
              <div className="flex overflow-x-auto sm:grid sm:grid-cols-4 gap-1.5 border-b border-slate-100 pb-3 scrollbar-none">

                <button
                  type="button"
                  onClick={() => setActiveTab("motor")}
                  className={`flex items-center justify-center space-x-1.5 px-2 py-2 font-bold text-xs transition-all shrink-0 sm:shrink border-b-2 -mb-[13px] ${activeTab === "motor"
                    ? "text-[#3B25B0] border-[#3B25B0]"
                    : "text-slate-500 hover:text-slate-900 border-transparent"
                    }`}
                >
                  <Car className={`w-4 h-4 shrink-0 ${activeTab === "motor" ? "text-[#3B25B0]" : "text-slate-400"}`} />
                  <span className="truncate">Motor insurance</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("travel")}
                  className={`flex items-center justify-center space-x-1.5 px-2 py-2 font-bold text-xs transition-all shrink-0 sm:shrink border-b-2 -mb-[13px] ${activeTab === "travel"
                    ? "text-[#3B25B0] border-[#3B25B0]"
                    : "text-slate-500 hover:text-slate-900 border-transparent"
                    }`}
                >
                  <Plane className={`w-4 h-4 shrink-0 ${activeTab === "travel" ? "text-[#3B25B0]" : "text-slate-400"}`} />
                  <span className="truncate">Travel Insurance</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("life")}
                  className={`flex items-center justify-center space-x-1.5 px-2 py-2 font-bold text-xs transition-all shrink-0 sm:shrink border-b-2 -mb-[13px] ${activeTab === "life"
                    ? "text-[#3B25B0] border-[#3B25B0]"
                    : "text-slate-500 hover:text-slate-900 border-transparent"
                    }`}
                >
                  <HeartHandshake className={`w-4 h-4 shrink-0 ${activeTab === "life" ? "text-[#3B25B0]" : "text-slate-400"}`} />
                  <span className="truncate">Life Insurance</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("visa")}
                  className={`flex items-center justify-center space-x-1.5 px-2 py-2 font-bold text-xs transition-all shrink-0 sm:shrink border-b-2 -mb-[13px] ${activeTab === "visa"
                    ? "text-[#3B25B0] border-[#3B25B0]"
                    : "text-slate-500 hover:text-slate-900 border-transparent"
                    }`}
                >
                  <FileCheck className={`w-4 h-4 shrink-0 ${activeTab === "visa" ? "text-[#3B25B0]" : "text-slate-400"}`} />
                  <span className="truncate">Visit Visa Insurance</span>
                </button>
              </div>

              {/* Dynamic Form Inputs based on selected Tab */}
              <form onSubmit={handleGetQuote} className="mt-4">

                {/* Motor Insurance Tab Fields */}
                {activeTab === "motor" && (
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-5 space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Registration Number</label>
                      <input
                        type="text"
                        placeholder="E.G SAD8337"
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value)}
                        className="w-full bg-slate-50/60 border border-slate-200/90 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B25B0]/30 focus:border-[#3B25B0] transition-all"
                      />
                    </div>

                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Mobile Number</label>
                      <div className="flex items-center bg-slate-50/60 border border-slate-200/90 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#3B25B0]/30 focus-within:border-[#3B25B0] transition-all">
                        <span className="px-2.5 text-[11px] font-bold text-slate-700 bg-slate-100/70 border-r border-slate-200 py-2 flex items-center shrink-0">
                          +966
                        </span>
                        <input
                          type="tel"
                          placeholder="Enter Mobile Number"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          className="w-full bg-transparent px-2.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <button
                        type="submit"
                        className="w-full bg-[#3B25B0] hover:bg-[#2F1F99] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1 shadow-md hover:shadow-indigo-300/50 transition-all duration-200 transform active:scale-95"
                      >
                        <span>Get Quote</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Travel Insurance Tab Fields - Using Shadcn Select & Shadcn DatePicker */}
                {activeTab === "travel" && (
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-5 space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Destination</label>
                      <ShadcnSelect
                        value={destination}
                        onChange={setDestination}
                        options={destinationOptions}
                        placeholder="Select Destination"
                      />
                    </div>

                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Travel Date</label>
                      <ShadcnDatePicker
                        value={travelDate}
                        onChange={setTravelDate}
                        placeholder="Select Travel Date"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <button
                        type="submit"
                        className="w-full bg-[#3B25B0] hover:bg-[#2F1F99] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1 shadow-md hover:shadow-indigo-300/50 transition-all duration-200 transform active:scale-95"
                      >
                        <span>Get Quote</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Life Insurance Tab Fields */}
                {activeTab === "life" && (
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-5 space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">ID / Iqama Number</label>
                      <input
                        type="text"
                        placeholder="Enter ID / Iqama Number"
                        value={iqamaNumber}
                        onChange={(e) => setIqamaNumber(e.target.value)}
                        className="w-full bg-slate-50/60 border border-slate-200/90 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B25B0]/30 focus:border-[#3B25B0] transition-all"
                      />
                    </div>

                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Mobile Number</label>
                      <div className="flex items-center bg-slate-50/60 border border-slate-200/90 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#3B25B0]/30 focus-within:border-[#3B25B0] transition-all">
                        <span className="px-2.5 text-[11px] font-bold text-slate-700 bg-slate-100/70 border-r border-slate-200 py-2 flex items-center shrink-0">
                          +966
                        </span>
                        <input
                          type="tel"
                          placeholder="Enter Mobile Number"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          className="w-full bg-transparent px-2.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <button
                        type="submit"
                        className="w-full bg-[#3B25B0] hover:bg-[#2F1F99] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1 shadow-md hover:shadow-indigo-300/50 transition-all duration-200 transform active:scale-95"
                      >
                        <span>Get Quote</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Visit Visa Insurance Tab Fields */}
                {activeTab === "visa" && (
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-5 space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Passport Number</label>
                      <input
                        type="text"
                        placeholder="Enter Passport Number"
                        value={passportNumber}
                        onChange={(e) => setPassportNumber(e.target.value)}
                        className="w-full bg-slate-50/60 border border-slate-200/90 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B25B0]/30 focus:border-[#3B25B0] transition-all"
                      />
                    </div>

                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Visa Number</label>
                      <input
                        type="text"
                        placeholder="Enter Visa Number"
                        value={visaNumber}
                        onChange={(e) => setVisaNumber(e.target.value)}
                        className="w-full bg-slate-50/60 border border-slate-200/90 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B25B0]/30 focus:border-[#3B25B0] transition-all"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <button
                        type="submit"
                        className="w-full bg-[#3B25B0] hover:bg-[#2F1F99] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1 shadow-md hover:shadow-indigo-300/50 transition-all duration-200 transform active:scale-95"
                      >
                        <span>Get Quote</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

              </form>

            </div>

            {/* Feature Badges Bar */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-slate-100 shadow-soft grid grid-cols-2 md:grid-cols-4 gap-2.5">

              <div className="flex items-center space-x-2.5 p-0.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#3B25B0]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-900 leading-tight">Fast & Easy</div>
                  <div className="text-[10px] text-slate-500 font-medium">100% Online</div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 p-0.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#3B25B0]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-900 leading-tight">Secure & Reliable</div>
                  <div className="text-[10px] text-slate-500 font-medium">Your data is protected</div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 p-0.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-[#3B25B0]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-900 leading-tight">Trusted by Thousands</div>
                  <div className="text-[10px] text-slate-500 font-medium">Across Saudi Arabia</div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 p-0.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <Headphones className="w-4 h-4 text-[#3B25B0]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-900 leading-tight">24/7 Support</div>
                  <div className="text-[10px] text-slate-500 font-medium">We're here to help</div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
