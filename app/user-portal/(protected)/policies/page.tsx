"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MyPoliciesRoutePage() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "motor" | "travel" | "life" | "visa" | "general">("all");
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <div className="space-y-6 relative">
      {/* Page Header (Same Top Row on Mobile Screens) */}
      <div className="flex flex-row items-center justify-between gap-2 pt-1">
        <div>
          <h1 className="text-xl sm:text-3xl font-semibold text-[#1C2541]">{t("myPolicies")}</h1>
          <p className="text-[11px] sm:text-sm text-[#8C94A6] font-normal mt-0.5">
            {isAr ? "4 وثائق نشطة عبر جميع القطاعات" : "4 active policies across all lines"}
          </p>
        </div>
        <Link
          href="/user-portal/buy"
          className="inline-flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-blue-600 text-white font-semibold px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-3" />
          <span className="sm:hidden">{isAr ? "جديد" : "New"}</span>
          <span className="hidden sm:inline">{t("buyNewPolicy")}</span>
        </Link>
      </div>

      {/* Sticky Filter Sub-Tabs Bar (Sticks cleanly on scroll below navbar) */}
      <div className="sticky top-16 sm:top-20 z-20 bg-[#F8F9FE]/95 backdrop-blur-md py-2.5 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-slate-200/80">
        <div className="flex items-center gap-6 overflow-x-auto text-xs sm:text-sm font-medium scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`pb-1.5 whitespace-nowrap transition-colors cursor-pointer ${selectedCategory === "all"
              ? "text-[#2563EB] font-bold border-b-2 border-[#2563EB]"
              : "text-slate-500 hover:text-slate-900"
              }`}
          >
            {t("allFilter")}
          </button>
          <button
            onClick={() => setSelectedCategory("motor")}
            className={`pb-1.5 whitespace-nowrap transition-colors cursor-pointer ${selectedCategory === "motor"
              ? "text-[#2563EB] font-bold border-b-2 border-[#2563EB]"
              : "text-slate-500 hover:text-slate-900"
              }`}
          >
            {t("motorFilter")}
          </button>
          <button
            onClick={() => setSelectedCategory("travel")}
            className={`pb-1.5 whitespace-nowrap transition-colors cursor-pointer ${selectedCategory === "travel"
              ? "text-[#2563EB] font-bold border-b-2 border-[#2563EB]"
              : "text-slate-500 hover:text-slate-900"
              }`}
          >
            {t("travelFilter")}
          </button>
          <button
            onClick={() => setSelectedCategory("life")}
            className={`pb-1.5 whitespace-nowrap transition-colors cursor-pointer ${selectedCategory === "life"
              ? "text-[#2563EB] font-bold border-b-2 border-[#2563EB]"
              : "text-slate-500 hover:text-slate-900"
              }`}
          >
            {t("lifeFilter")}
          </button>
          <button
            onClick={() => setSelectedCategory("visa")}
            className={`pb-1.5 whitespace-nowrap transition-colors cursor-pointer ${selectedCategory === "visa"
              ? "text-[#2563EB] font-bold border-b-2 border-[#2563EB]"
              : "text-slate-500 hover:text-slate-900"
              }`}
          >
            {t("visaFilter")}
          </button>
          <button
            onClick={() => setSelectedCategory("general")}
            className={`pb-1.5 whitespace-nowrap transition-colors cursor-pointer ${selectedCategory === "general"
              ? "text-[#2563EB] font-bold border-b-2 border-[#2563EB]"
              : "text-slate-500 hover:text-slate-900"
              }`}
          >
            {t("generalFilter")}
          </button>
        </div>
      </div>

      {/* Filtered Policy Cards Stack */}
      <div className="space-y-4 pt-1">
        {/* Card 1: Motor */}
        {(selectedCategory === "all" || selectedCategory === "motor") && (
          <div className="bg-[#EEF5FF] rounded-3xl p-4 sm:p-6 border border-[#DAE8FB] shadow-xs relative overflow-hidden group hover:shadow-md transition-all duration-200 animate-in fade-in duration-150">
            <div className="flex flex-col gap-4 relative z-10">
              {/* Header & Product Image Row */}
              <div className="flex flex-row justify-between items-start gap-3">
                <div className="space-y-1 max-w-xl">
                  <h2 className="text-base sm:text-xl font-semibold text-[#1C2541]">{t("motorCompCardTitle")}</h2>
                  <p className="text-xs sm:text-sm text-[#8C94A6] font-normal">
                    {isAr ? "POL-MTR-2024-00881 · تويوتا كامري 2022 · لوحة: 1234 أ ب ج" : "POL-MTR-2024-00881 · Toyota Camry 2022 · Plate: 1234 ABC"}
                  </p>
                  <div className="pt-1">
                    <span className="bg-[#DDF5E6] text-[#16A34A] text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md inline-block">
                      {t("activeStatus")}
                    </span>
                  </div>
                </div>

                <div className="relative w-24 sm:w-56 h-16 sm:h-28 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-[#D8E6FA] rounded-full transform scale-90 opacity-70" />
                  <Image
                    src="/images/products_01.png"
                    alt="Motor Insurance"
                    width={220}
                    height={110}
                    className="relative z-10 w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Metadata & Button Row */}
              <div className="pt-3 border-t border-[#D0E1F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-[#64748B]">
                <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                  <div>
                    <span className="text-[#8C94A6] text-[11px] block">{t("premium")}</span>
                    <p className="font-semibold text-[#1C2541] mt-0.5 text-xs sm:text-sm">{isAr ? "4,200 ر.س/سنوياً" : "SAR 4,200/yr"}</p>
                  </div>
                  <div>
                    <span className="text-[#8C94A6] text-[11px] block">{isAr ? "الانتهاء" : "Expires"}</span>
                    <p className="font-semibold text-[#1C2541] mt-0.5 text-xs sm:text-sm">{isAr ? "24 يونيو 2026" : "24 Jun 2026"}</p>
                  </div>
                  <div>
                    <span className="text-[#8C94A6] text-[11px] block">{t("navClaims")}</span>
                    <p className="font-semibold text-[#1C2541] mt-0.5 text-xs sm:text-sm">{t("openClaimsOne")}</p>
                  </div>
                </div>

                <button className="w-full sm:w-auto border border-[#1C2541] bg-transparent hover:bg-[#DAE8FB]/60 text-[#1C2541] font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-2xs text-center shrink-0">
                  {t("viewDetails")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Card 2: Travel */}
        {(selectedCategory === "all" || selectedCategory === "travel") && (
          <div className="bg-[#EEF5FF] rounded-3xl p-4 sm:p-6 border border-[#DAE8FB] shadow-xs relative overflow-hidden group hover:shadow-md transition-all duration-200 animate-in fade-in duration-150">
            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex flex-row justify-between items-start gap-3">
                <div className="space-y-1 max-w-xl">
                  <h2 className="text-base sm:text-xl font-semibold text-[#1C2541]">{t("travelMultiCardTitle")}</h2>
                  <p className="text-xs sm:text-sm text-[#8C94A6] font-normal">
                    POL-TRV-2025-00234 · {t("gccInternational")} · {t("tripsLeft10")}
                  </p>
                  <div className="pt-1">
                    <span className="bg-[#DDF5E6] text-[#16A34A] text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md inline-block">
                      {t("activeStatus")}
                    </span>
                  </div>
                </div>

                <div className="relative w-24 sm:w-56 h-16 sm:h-28 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-[#D8E6FA] rounded-full transform scale-90 opacity-70" />
                  <Image
                    src="/images/products_02.png"
                    alt="Travel Insurance"
                    width={220}
                    height={110}
                    className="relative z-10 w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#D0E1F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-[#64748B]">
                <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                  <div>
                    <span className="text-[#8C94A6] text-[11px] block">{t("coverage")}</span>
                    <p className="font-semibold text-[#1C2541] mt-0.5 text-xs sm:text-sm">{t("worldwide")}</p>
                  </div>
                  <div>
                    <span className="text-[#8C94A6] text-[11px] block">{t("premium")}</span>
                    <p className="font-semibold text-[#1C2541] mt-0.5 text-xs sm:text-sm">{isAr ? "450 ر.س" : "SAR 450"}</p>
                  </div>
                  <div>
                    <span className="text-[#8C94A6] text-[11px] block">{isAr ? "الانتهاء" : "Expires"}</span>
                    <p className="font-semibold text-[#1C2541] mt-0.5 text-xs sm:text-sm">{isAr ? "3 يوليو 2026" : "3 Jul 2026"}</p>
                  </div>
                </div>

                <button className="w-full sm:w-auto border border-[#1C2541] bg-transparent hover:bg-[#DAE8FB]/60 text-[#1C2541] font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-2xs text-center shrink-0">
                  {t("viewDetails")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Card 3: Life */}
        {(selectedCategory === "all" || selectedCategory === "life") && (
          <div className="bg-[#EEF5FF] rounded-3xl p-4 sm:p-6 border border-[#DAE8FB] shadow-xs relative overflow-hidden group hover:shadow-md transition-all duration-200 animate-in fade-in duration-150">
            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex flex-row justify-between items-start gap-3">
                <div className="space-y-1 max-w-xl">
                  <h2 className="text-base sm:text-xl font-semibold text-[#1C2541]">{t("lifeFamilyCardTitle")}</h2>
                  <p className="text-xs sm:text-sm text-[#8C94A6] font-normal">POL-LFE-2025-00201</p>
                  <div className="pt-1">
                    <span className="bg-[#DDF5E6] text-[#16A34A] text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md inline-block">
                      {t("activeStatus")}
                    </span>
                  </div>
                </div>

                <div className="relative w-24 sm:w-56 h-16 sm:h-28 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-[#D8E6FA] rounded-full transform scale-90 opacity-70" />
                  <Image
                    src="/images/products_03.png"
                    alt="Life Insurance"
                    width={220}
                    height={110}
                    className="relative z-10 w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#D0E1F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-[#64748B]">
                <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                  <div>
                    <span className="text-[#8C94A6] text-[11px] block">{t("coverage")}</span>
                    <p className="font-semibold text-[#1C2541] mt-0.5 text-xs sm:text-sm">{isAr ? "500,000 ر.س" : "SAR 500k"}</p>
                  </div>
                  <div>
                    <span className="text-[#8C94A6] text-[11px] block">{t("premium")}</span>
                    <p className="font-semibold text-[#1C2541] mt-0.5 text-xs sm:text-sm">{isAr ? "780 ر.س" : "SAR 780"}</p>
                  </div>
                  <div>
                    <span className="text-[#8C94A6] text-[11px] block">{isAr ? "الانتهاء" : "Expires"}</span>
                    <p className="font-semibold text-[#1C2541] mt-0.5 text-xs sm:text-sm">{isAr ? "18 يوليو 2026" : "18 Jul 2026"}</p>
                  </div>
                </div>

                <button className="w-full sm:w-auto border border-[#1C2541] bg-transparent hover:bg-[#DAE8FB]/60 text-[#1C2541] font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-2xs text-center shrink-0">
                  {t("viewDetails")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Card 4: Visit Visa */}
        {(selectedCategory === "all" || selectedCategory === "visa") && (
          <div className="bg-[#EEF5FF] rounded-3xl p-4 sm:p-6 border border-[#DAE8FB] shadow-xs relative overflow-hidden group hover:shadow-md transition-all duration-200 animate-in fade-in duration-150">
            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex flex-row justify-between items-start gap-3">
                <div className="space-y-1 max-w-xl">
                  <h2 className="text-base sm:text-xl font-semibold text-[#1C2541]">{t("visitVisaCardTitle")}</h2>
                  <p className="text-xs sm:text-sm text-[#8C94A6] font-normal">POL-VIS-2025-00109</p>
                  <div className="pt-1">
                    <span className="bg-[#DDF5E6] text-[#16A34A] text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md inline-block">
                      {t("activeStatus")}
                    </span>
                  </div>
                </div>

                <div className="relative w-24 sm:w-56 h-16 sm:h-28 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-[#D8E6FA] rounded-full transform scale-90 opacity-70" />
                  <Image
                    src="/images/products_04.png"
                    alt="Visit Visa Insurance"
                    width={220}
                    height={110}
                    className="relative z-10 w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#D0E1F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-[#64748B]">
                <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                  <div>
                    <span className="text-[#8C94A6] text-[11px] block">{t("coverage")}</span>
                    <p className="font-semibold text-[#1C2541] mt-0.5 text-xs sm:text-sm">{t("mandatoryTag")}</p>
                  </div>
                  <div>
                    <span className="text-[#8C94A6] text-[11px] block">{t("premium")}</span>
                    <p className="font-semibold text-[#1C2541] mt-0.5 text-xs sm:text-sm">{isAr ? "99 ر.س" : "SAR 99"}</p>
                  </div>
                  <div>
                    <span className="text-[#8C94A6] text-[11px] block">{isAr ? "الانتهاء" : "Expires"}</span>
                    <p className="font-semibold text-[#1C2541] mt-0.5 text-xs sm:text-sm">{isAr ? "30 أغسطس 2026" : "30 Aug 2026"}</p>
                  </div>
                </div>

                <button className="w-full sm:w-auto border border-[#1C2541] bg-transparent hover:bg-[#DAE8FB]/60 text-[#1C2541] font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-2xs text-center shrink-0">
                  {t("viewDetails")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State for General */}
        {selectedCategory === "general" && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs space-y-3">
            <p className="text-[#1C2541] font-semibold text-base">No General Policies Found</p>
            <p className="text-slate-400 text-xs">You currently do not have any active general or property insurance policies.</p>
            <Link
              href="/user-portal/buy"
              className="inline-block bg-[#2563EB] hover:bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-colors mt-2"
            >
              Explore General Policies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
