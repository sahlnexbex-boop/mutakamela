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
  QrCode,
  Smartphone,
} from "lucide-react";

interface HeroProps {
  onOpenQuoteModal?: (productType?: string, data?: any) => void;
}

export default function Hero({ onOpenQuoteModal }: HeroProps) {
  const [activeTab, setActiveTab] = useState<"motor" | "travel" | "life" | "visa">("motor");
  const [regNumber, setRegNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const handleGetQuote = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenQuoteModal?.(
      activeTab === "motor" ? "Motor Insurance" :
        activeTab === "travel" ? "Travel Insurance" :
          activeTab === "life" ? "Life Insurance" : "Visit Visa Insurance",
      { regNumber, mobileNumber }
    );
  };

  return (
    <section className="relative overflow-hidden bg-hero-gradient pt-6 pb-24 sm:pb-28 lg:pt-10 lg:pb-36">

      {/* Background Subtle Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-100/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Left Column: Text & Tabbed Form */}
          <div className="lg:col-span-6 space-y-5" data-gsap="fade-up">

            {/* Trusted Protection Tag */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>TRUSTED PROTECTION</span>
            </div>

            {/* Hero Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-slate-900 leading-[1.2] tracking-tight">
              Protection for today, peace of mind for <span className="text-[#3B25B0]">tomorrow</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-500 max-w-lg font-normal leading-relaxed">
              Comprehensive insurance solutions for you, your family and your business.
            </p>

            {/* Interactive Tabbed Form Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-soft-lg border border-slate-100/80 transition-all duration-300">

              {/* Product Tabs Navigation (Fits perfectly without overflow scrolling) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 border-b border-slate-100 pb-3">

                <button
                  type="button"
                  onClick={() => setActiveTab("motor")}
                  className={`flex items-center justify-center space-x-1.5 px-2 py-2 rounded-xl font-semibold text-xs transition-all ${activeTab === "motor"
                      ? "text-[#3B25B0] bg-indigo-50/90 border-b-2 border-[#3B25B0]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                >
                  <Car className={`w-3.5 h-3.5 shrink-0 ${activeTab === "motor" ? "text-[#3B25B0]" : "text-slate-400"}`} />
                  <span className="truncate">Motor insurance</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("travel")}
                  className={`flex items-center justify-center space-x-1.5 px-2 py-2 rounded-xl font-semibold text-xs transition-all ${activeTab === "travel"
                      ? "text-[#3B25B0] bg-indigo-50/90 border-b-2 border-[#3B25B0]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                >
                  <Plane className={`w-3.5 h-3.5 shrink-0 ${activeTab === "travel" ? "text-[#3B25B0]" : "text-slate-400"}`} />
                  <span className="truncate">Travel Insurance</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("life")}
                  className={`flex items-center justify-center space-x-1.5 px-2 py-2 rounded-xl font-semibold text-xs transition-all ${activeTab === "life"
                      ? "text-[#3B25B0] bg-indigo-50/90 border-b-2 border-[#3B25B0]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                >
                  <HeartHandshake className={`w-3.5 h-3.5 shrink-0 ${activeTab === "life" ? "text-[#3B25B0]" : "text-slate-400"}`} />
                  <span className="truncate">Life Insurance</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("visa")}
                  className={`flex items-center justify-center space-x-1.5 px-2 py-2 rounded-xl font-semibold text-xs transition-all ${activeTab === "visa"
                      ? "text-[#3B25B0] bg-indigo-50/90 border-b-2 border-[#3B25B0]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                >
                  <FileCheck className={`w-3.5 h-3.5 shrink-0 ${activeTab === "visa" ? "text-[#3B25B0]" : "text-slate-400"}`} />
                  <span className="truncate">Visit Visa Insurance</span>
                </button>
              </div>

              {/* Dynamic Form Inputs */}
              <form onSubmit={handleGetQuote} className="mt-4">
                {activeTab === "motor" && (
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">

                    {/* Registration Number Field */}
                    <div className="sm:col-span-5 space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600">Registration Number</label>
                      <input
                        type="text"
                        placeholder="E.G SAD8337"
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B25B0]/30 focus:border-[#3B25B0] transition-all"
                      />
                    </div>

                    {/* Mobile Number Field */}
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600">Mobile Number</label>
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#3B25B0]/30 focus-within:border-[#3B25B0] transition-all">
                        <span className="px-2 text-[11px] font-bold text-slate-600 bg-slate-100 border-r border-slate-200 py-2 flex items-center shrink-0">
                          +966
                        </span>
                        <input
                          type="tel"
                          placeholder="Enter Mobile Number"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          className="w-full bg-transparent px-2 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Get Quote CTA */}
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

                {activeTab !== "motor" && (
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                    <div className="sm:col-span-9 space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600">National ID / Iqama / Passport Number</label>
                      <input
                        type="text"
                        placeholder="Enter ID or Passport Number"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3B25B0]/30 focus:border-[#3B25B0]"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <button
                        type="submit"
                        className="w-full bg-[#3B25B0] hover:bg-[#2F1F99] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1 shadow-md transition-all duration-200"
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

          {/* Right Column: Scaled Hero Graphic & Floating App Card */}
          <div className="lg:col-span-6 relative flex justify-center items-center" data-gsap="scale">

            {/* Main Hero Image - Scaled down to balance left column */}
            <div className="relative w-[85%] sm:w-[80%] lg:w-[84%] max-w-md lg:max-w-lg mx-auto">
              <Image
                src="/images/home.png"
                alt="Mutakamela Family & Vehicle Protection"
                width={560}
                height={500}
                priority
                className="w-full h-auto max-h-[460px] object-contain drop-shadow-lg mx-auto"
              />

              {/* Floating App Badge Overlay */}
              <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-soft-lg border border-slate-100 flex items-center space-x-2.5 max-w-[260px] sm:max-w-xs transition-transform hover:scale-[1.02] duration-300">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-[#3B25B0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Get the mutakamela App</div>
                  <div className="text-[10px] text-slate-500 line-clamp-2 leading-tight">manage your policy, claims and more on the go.</div>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 relative shrink-0 bg-slate-900 rounded-lg p-1 flex items-center justify-center">
                  <QrCode className="w-7 h-7 text-white" />
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
