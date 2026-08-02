"use client";

import Image from "next/image";
import {
  ShieldCheck,
  RefreshCw,
  FileCheck,
  CreditCard,
  Download,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { SectionDisplayCopy } from "@/lib/home/utils";

export default function AppExperience({ copy }: { copy?: SectionDisplayCopy }) {
  const { t } = useTranslation();

  const features = [
    {
      title: t("policyManagement"),
      desc: t("instantPolicy"),
      icon: ShieldCheck,
    },
    {
      title: t("renewPolicy"),
      desc: t("renewSub"),
      icon: RefreshCw,
    },
    {
      title: t("trackClaims"),
      desc: t("trackSub"),
      icon: FileCheck,
    },
    {
      title: t("payBills"),
      desc: t("paySub"),
      icon: CreditCard,
    },
    {
      title: t("digitalCard"),
      desc: t("instantPolicy"),
      icon: Download,
    },
  ];

  const ctaUrl = copy?.ctaUrl || "#app";
  const appStoreUrl = copy?.appStoreUrl || "#app";
  const playStoreUrl = copy?.playStoreUrl || "#app";
  const imageSrc = copy?.imageUrl || "/images/app_exp.png";
  const externalCta = ctaUrl.startsWith("http");
  const externalAppStore = appStoreUrl.startsWith("http");
  const externalPlayStore = playStoreUrl.startsWith("http");

  return (
    <section id="app" className="py-16 lg:py-24 bg-[#eeebfc] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left Column: Heading, 5 Feature Items Row & Download Button */}
          <div className="lg:col-span-7 space-y-6" data-gsap="fade-up">

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest text-[#3B25B0]">
                {copy?.badge || t("mobileApp")}
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-slate-900 leading-[1.18] tracking-tight">
                {copy?.title || t("appHeading")}
              </h2>

              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-normal max-w-xl">
                {copy?.subtitle || t("appExperienceDesc")}
              </p>
            </div>

            {/* 5 Features Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2" data-gsap="stagger">
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    data-gsap-item
                    data-gsap-hover
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
                href={ctaUrl}
                target={externalCta ? "_blank" : undefined}
                rel={externalCta ? "noopener noreferrer" : undefined}
                className="home-btn-shine inline-flex items-center gap-2 bg-[#3B25B0] hover:bg-[#2F1F99] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md hover:shadow-indigo-300/40 transition-all transform active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>{copy?.ctaLabel || t("downloadApp")}</span>
              </a>
            </div>

          </div>

          {/* Right Column: App Graphic & Overlay Scan Card */}
          <div className="lg:col-span-5 relative flex justify-center items-center" data-gsap="scale">
            <div className="relative w-full max-w-md lg:max-w-none home-float">

              <Image
                src={imageSrc}
                alt="Mutakamela Mobile App Experience"
                width={650}
                height={580}
                priority
                unoptimized={Boolean(copy?.imageUrl && !copy.imageUrl.startsWith("/images/"))}
                className="w-full h-auto object-contain"
              />

              {/* Floating Scan Card Overlay (outer keeps centering; inner floats) */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-11/12 sm:w-10/12">
              <div className="home-float-soft home-float-delay bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl border border-slate-100 text-center space-y-2">
                <div className="text-xs font-bold text-slate-900">
                  {copy?.scanTitle || t("scanToDownload")}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {copy?.availableOnLabel || t("availableOn")}
                </div>

                <div className="flex items-center justify-center space-x-3 pt-1">
                  <a
                    href={appStoreUrl}
                    target={externalAppStore ? "_blank" : undefined}
                    rel={externalAppStore ? "noopener noreferrer" : undefined}
                    className="inline-block transition-transform hover:scale-105"
                    aria-label={t("downloadOnAppStore")}
                  >
                    <Image
                      src="/images/appstore.png"
                      alt="Download on the App Store"
                      width={140}
                      height={42}
                      className="h-9 sm:h-10 w-auto object-contain"
                    />
                  </a>

                  <a
                    href={playStoreUrl}
                    target={externalPlayStore ? "_blank" : undefined}
                    rel={externalPlayStore ? "noopener noreferrer" : undefined}
                    className="inline-block transition-transform hover:scale-105"
                    aria-label={t("getItOnGooglePlay")}
                  >
                    <Image
                      src="/images/playstore.png"
                      alt="Get it on Google Play"
                      width={140}
                      height={42}
                      className="h-9 sm:h-10 w-auto object-contain"
                    />
                  </a>
                </div>
              </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
