"use client";

import Image from "next/image";
import {
  ShieldCheck,
  RefreshCw,
  FileCheck,
  CreditCard,
  Download,
  Apple,
  Play
} from "lucide-react";

export default function AppExperience() {
  const features = [
    {
      title: "View policies",
      desc: "Access all your policies in one place",
      icon: ShieldCheck,
    },
    {
      title: "Renew insurance",
      desc: "Renew your policies quickly and easily",
      icon: RefreshCw,
    },
    {
      title: "Track claims",
      desc: "Track your claims in real time",
      icon: FileCheck,
    },
    {
      title: "Make payments",
      desc: "Pay securely using multiple methods",
      icon: CreditCard,
    },
    {
      title: "Download documents",
      desc: "Download policy documents anytime you need",
      icon: Download,
    },
  ];

  return (
    <section id="app" className="py-16 lg:py-24 bg-[#F0EFFD] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left Column: Heading, 5 Feature Items Row & Download Button (Matches Image 1) */}
          <div className="lg:col-span-7 space-y-6" data-gsap="fade-up">

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest text-[#3B25B0]">
                APP EXPERIENCE
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-slate-900 leading-[1.18] tracking-tight">
                Manage your insurance anytime, anywhere
              </h2>

              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-normal max-w-xl">
                The Mutakamela Insurance app puts complete control of your policies in your hands. Simple, secure and designed for you.
              </p>
            </div>

            {/* 5 Features Grid (Single Row of 5 Cards in Desktop matching Image 1) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2" data-gsap="stagger">
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    data-gsap-item
                    className="bg-white p-3.5 rounded-2xl border border-indigo-100/70 shadow-soft flex flex-col justify-between space-y-2.5 hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 min-h-[120px]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#3B25B0] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 leading-snug">{item.title}</div>
                      <div className="text-[10px] text-slate-400 font-normal leading-tight mt-1 line-clamp-2">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Download CTA Button */}
            <div className="pt-2">
              <a
                href="#app"
                className="inline-flex items-center space-x-2 bg-[#3B25B0] hover:bg-[#2F1F99] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md hover:shadow-indigo-300/40 transition-all transform active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download App</span>
              </a>
            </div>

          </div>

          {/* Right Column: App Graphic & Overlay Scan Card (Matches Image 1) */}
          <div className="lg:col-span-5 relative flex justify-center items-center" data-gsap="scale">
            <div className="relative w-full max-w-md lg:max-w-none">

              <Image
                src="/images/app_exp.png"
                alt="Mutakamela Mobile App Experience"
                width={650}
                height={580}
                priority
                className="w-full h-auto object-contain"
              />

              {/* Floating Scan Card Overlay at bottom matching Image 1 */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-11/12 sm:w-10/12 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl border border-slate-100 text-center space-y-2">
                <div className="text-xs font-bold text-slate-900">Scan to Download Mutakamela App</div>
                <div className="text-[10px] text-slate-500 font-medium">Available on</div>

                <div className="flex items-center justify-center space-x-2.5 pt-0.5">
                  <a
                    href="#app"
                    className="flex items-center space-x-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <Apple className="w-4 h-4 shrink-0" />
                    <div className="text-left leading-tight">
                      <div className="text-[8px] uppercase text-slate-400">Download on the</div>
                      <div className="text-[11px] font-bold">App Store</div>
                    </div>
                  </a>

                  <a
                    href="#app"
                    className="flex items-center space-x-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current shrink-0" />
                    <div className="text-left leading-tight">
                      <div className="text-[8px] uppercase text-slate-400">GET IT ON</div>
                      <div className="text-[11px] font-bold">Google Play</div>
                    </div>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
