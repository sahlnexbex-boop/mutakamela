"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface ClaimServicesProps {
  onOpenClaimModal?: () => void;
  onOpenTrackModal?: () => void;
}

export default function ClaimServices({ onOpenClaimModal, onOpenTrackModal }: ClaimServicesProps) {
  return (
    <section id="claims" className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

        <div
          className="bg-purple-card-gradient rounded-3xl p-8 sm:p-12 border border-indigo-100 shadow-soft-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden"
          data-gsap="fade-up"
        >

          {/* Left Column: Text & Buttons */}
          <div className="lg:col-span-6 space-y-6">

            <div className="text-xs font-extrabold uppercase tracking-widest text-[#3B25B0]">
              CLAIM SERVICES
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              We’re here when you need us most.
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg font-normal">
              Transparent, fast, and fair claims support — so you can focus on what matters while we take care of the rest.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onOpenClaimModal}
                className="bg-[#3B25B0] hover:bg-[#2F1F99] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md hover:shadow-indigo-300/40 transition-all flex items-center space-x-2 transform active:scale-95"
              >
                <span>Submit a claim</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenTrackModal}
                className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm px-6 py-3.5 rounded-xl border border-slate-200 shadow-sm transition-all flex items-center space-x-2"
              >
                <span>Track a claim</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

          </div>

          {/* Right Column: 3D Graphic */}
          <div className="lg:col-span-6 flex justify-center items-center" data-gsap="scale">
            <div className="relative w-full max-w-md lg:max-w-none">
              <Image
                src="/images/claim_services.png"
                alt="Mutakamela Claim Services Support"
                width={650}
                height={450}
                className="w-full h-auto object-contain drop-shadow-xl"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
