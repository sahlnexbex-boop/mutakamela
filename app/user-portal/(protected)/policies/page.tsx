"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, ChevronRight, Tag, Calendar, FileText, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MyPoliciesRoutePage() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "motor" | "travel" | "life" | "visa" | "general">("all");
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <div className="space-y-6 relative">
      {/* Page Header */}
      <div className="flex flex-row items-center justify-between gap-2 pt-1">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-[#1C2541]">{t("myPolicies")}</h1>
          <p className="text-[11px] sm:text-sm text-slate-500 font-medium mt-0.5">
            {isAr ? "4 وثائق نشطة عبر جميع القطاعات" : "4 active policies across all lines"}
          </p>
        </div>
        <Link
          href="/user-portal/buy"
          className="inline-flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-blue-600 text-white font-bold px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
          <span className="sm:hidden">{isAr ? "جديد" : "New"}</span>
          <span className="hidden sm:inline">{t("buyNewPolicy")}</span>
        </Link>
      </div>

      {/* Sticky Filter Sub-Tabs Bar */}
      <div className="sticky top-16 sm:top-20 z-20 bg-[#F8F9FE]/95 backdrop-blur-md py-2.5 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-slate-200/80">
        <div className="flex items-center gap-6 overflow-x-auto text-xs sm:text-sm font-semibold scrollbar-none">
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

      {/* Filtered Policy Cards Stack (EXACT MATCH FOR ATTACHED IMAGE 1) */}
      <div className="space-y-4 pt-1">
        {/* Card 1: Motor Insurance */}
        {(selectedCategory === "all" || selectedCategory === "motor") && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-xs relative overflow-hidden group hover:shadow-md transition-all duration-200 animate-in fade-in duration-150">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
              <div className="space-y-4 max-w-xl flex-1">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1C2541]">{isAr ? "تأمين المركبات الشامل" : "Motor Insurance – Comprehensive"}</h2>
                  <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
                    {isAr ? "POL-MTR-2024-00881 · تويوتا كامري 2022 · لوحة: 1234 أ ب ج" : "POL-MTR-2024-00881 · Toyota Camry 2022 · Plate: 1234 ABC"}
                  </p>
                  <div className="pt-2">
                    <span className="bg-[#DDF5E6] text-[#16A34A] text-xs font-bold px-3 py-1 rounded-md inline-block">
                      {t("activeStatus")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100 items-end">
                  <div>
                    <div className="flex items-center gap-1.5 text-[#D97706] font-semibold text-xs">
                      <Tag className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{t("premium")}</span>
                    </div>
                    <p className="font-bold text-[#1C2541] mt-1 text-xs sm:text-sm">{isAr ? "4,200 ر.س/سنوياً" : "SAR 4,200/yr"}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[#D97706] font-semibold text-xs">
                      <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{isAr ? "الانتهاء" : "Expires"}</span>
                    </div>
                    <p className="font-bold text-[#1C2541] mt-1 text-xs sm:text-sm">{isAr ? "24 يونيو 2026" : "24 Jun 2026"}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[#D97706] font-semibold text-xs">
                      <FileText className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{t("navClaims")}</span>
                    </div>
                    <p className="font-bold text-[#1C2541] mt-1 text-xs sm:text-sm">{isAr ? "1 مفتوحة" : "1 Open"}</p>
                  </div>
                  <div className="sm:ml-auto">
                    <Link
                      href="/user-portal/policies"
                      className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#2563EB] hover:underline"
                    >
                      <span>{t("viewDetails")}</span>
                      <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Side Product Graphic */}
              <div className="relative w-full lg:w-78 h-32 sm:h-40 flex items-center justify-center shrink-0 overflow-hidden pointer-events-none">
                {/* <div className="absolute inset-0 bg-[#EEF5FF] rounded-3xl transform -skew-x-6" /> */}
                <Image
                  src="/images/products_01.png"
                  alt="Motor Insurance"
                  width={260}
                  height={130}
                  className="relative z-10 w-auto h-28 sm:h-36 lg:h-40 object-contain transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* Card 2: Travel Insurance */}
        {(selectedCategory === "all" || selectedCategory === "travel") && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-xs relative overflow-hidden group hover:shadow-md transition-all duration-200 animate-in fade-in duration-150">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
              <div className="space-y-4 max-w-xl flex-1">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1C2541]">{isAr ? "تأمين السفر - رحلات متعددة" : "Travel Insurance – Multi-trip"}</h2>
                  <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
                    POL-TRV-2025-00234 · {t("gccInternational")} · {isAr ? "تم استخدام 10 رحلات" : "10 trips used"}
                  </p>
                  <div className="pt-2">
                    <span className="bg-[#FFEDD5] text-[#EA580C] text-xs font-bold px-3 py-1 rounded-md inline-block">
                      {isAr ? "وشك الانتهاء" : "About to renew"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100 items-end">
                  <div>
                    <div className="flex items-center gap-1.5 text-[#D97706] font-semibold text-xs">
                      <Tag className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{t("premium")}</span>
                    </div>
                    <p className="font-bold text-[#1C2541] mt-1 text-xs sm:text-sm">{isAr ? "980 ر.س/سنوياً" : "SAR 980/yr"}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[#D97706] font-semibold text-xs">
                      <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{isAr ? "الانتهاء" : "Expires"}</span>
                    </div>
                    <p className="font-bold text-[#1C2541] mt-1 text-xs sm:text-sm">{isAr ? "15 يناير 2027" : "15 Jan 2027"}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[#D97706] font-semibold text-xs">
                      <FileText className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{t("navClaims")}</span>
                    </div>
                    <p className="font-bold text-[#1C2541] mt-1 text-xs sm:text-sm">{isAr ? "1 مقبول" : "1 approved"}</p>
                  </div>
                  <div className="sm:ml-auto">
                    <Link
                      href="/user-portal/renewals"
                      className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#2563EB] hover:underline"
                    >
                      <span>{t("renewNow")}</span>
                      <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Side Product Graphic */}
              <div className="relative w-full lg:w-78 h-32 sm:h-40 flex items-center justify-center shrink-0 overflow-hidden pointer-events-none">
                {/* <div className="absolute inset-0 bg-[#EEF5FF] rounded-3xl transform -skew-x-6" /> */}
                <Image
                  src="/images/products_02.png"
                  alt="Travel Insurance"
                  width={260}
                  height={130}
                  className="relative z-10 w-auto h-28 sm:h-36 lg:h-40 object-contain transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* Card 3: Life Insurance */}
        {(selectedCategory === "all" || selectedCategory === "life") && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-xs relative overflow-hidden group hover:shadow-md transition-all duration-200 animate-in fade-in duration-150">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
              <div className="space-y-4 max-w-xl flex-1">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1C2541]">{isAr ? "تأمين الحياة - خيار 20 سنة" : "Life insurance – 20yr term plan"}</h2>
                  <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">POL-LFE-2024-00112</p>
                  <div className="pt-2">
                    <span className="bg-[#E0F2FE] text-[#0284C7] text-xs font-bold px-3 py-1 rounded-md inline-block">
                      {isAr ? "بانتظار التفعيل" : "Pending activation"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100 items-end">
                  <div>
                    <div className="flex items-center gap-1.5 text-[#D97706] font-semibold text-xs">
                      <Tag className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{t("premium")}</span>
                    </div>
                    <p className="font-bold text-[#1C2541] mt-1 text-xs sm:text-sm">{isAr ? "1,800 ر.س/سنوياً" : "SAR 1,800/yr"}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[#D97706] font-semibold text-xs">
                      <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{isAr ? "الانتهاء" : "Expires"}</span>
                    </div>
                    <p className="font-bold text-[#1C2541] mt-1 text-xs sm:text-sm">{isAr ? "10 مارس 2044" : "10 Mar 2044"}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[#D97706] font-semibold text-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{isAr ? "مبلغ الاستحقاق" : "Payment due"}</span>
                    </div>
                    <p className="font-bold text-[#1C2541] mt-1 text-xs sm:text-sm">{isAr ? "500,000 ر.س" : "SAR 500,000"}</p>
                  </div>
                  <div className="sm:ml-auto">
                    <Link
                      href="/user-portal/payments"
                      className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#2563EB] hover:underline"
                    >
                      <span>{isAr ? "استكمال الدفع" : "Complete payment"}</span>
                      <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Side Product Graphic */}
              <div className="relative w-full lg:w-78 h-32 sm:h-40 flex items-center justify-center shrink-0 overflow-hidden pointer-events-none">
                {/* <div className="absolute inset-0 bg-[#EEF5FF] rounded-3xl transform -skew-x-6" /> */}
                <Image
                  src="/images/products_03.png"
                  alt="Life Insurance"
                  width={260}
                  height={130}
                  className="relative z-10 w-auto h-28 sm:h-36 lg:h-40 object-contain rounded-xl transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* Card 4: Visit Visa Insurance */}
        {(selectedCategory === "all" || selectedCategory === "visa") && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-xs relative overflow-hidden group hover:shadow-md transition-all duration-200 animate-in fade-in duration-150">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
              <div className="space-y-4 max-w-xl flex-1">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1C2541]">{isAr ? "تأمين تأشيرة الزيارة" : "Visit visa insurance"}</h2>
                  <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">POL-LFE-2024-00112</p>
                  <div className="pt-2">
                    <span className="bg-[#FFE4E6] text-[#E11D48] text-xs font-bold px-3 py-1 rounded-md inline-block">
                      {isAr ? "منتهية الصلاحية" : "Lapsed"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100 items-end">
                  <div>
                    <div className="flex items-center gap-1.5 text-[#D97706] font-semibold text-xs">
                      <Tag className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{t("premium")}</span>
                    </div>
                    <p className="font-bold text-[#1C2541] mt-1 text-xs sm:text-sm">{isAr ? "3,200 ر.س/سنوياً" : "SAR 3,200/yr"}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[#D97706] font-semibold text-xs">
                      <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{isAr ? "الانتهاء" : "Expires"}</span>
                    </div>
                    <p className="font-bold text-[#1C2541] mt-1 text-xs sm:text-sm">{isAr ? "1 يوليو 2026" : "1 Jul 2026"}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[#D97706] font-semibold text-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{t("coverage")}</span>
                    </div>
                    <p className="font-bold text-[#1C2541] mt-1 text-xs sm:text-sm">{isAr ? "3,200 ر.س" : "SAR 3,200"}</p>
                  </div>
                  <div className="sm:ml-auto">
                    <Link
                      href="/user-portal/buy"
                      className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#2563EB] hover:underline"
                    >
                      <span>{isAr ? "إعادة التفعيل الآن" : "Reactivate now"}</span>
                      <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Side Product Graphic */}
              <div className="relative w-full lg:w-78 h-32 sm:h-40 flex items-center justify-center shrink-0 overflow-hidden pointer-events-none">
                {/* <div className="absolute inset-0 bg-[#EEF5FF] rounded-3xl transform -skew-x-6" /> */}
                <Image
                  src="/images/products_04.png"
                  alt="Visit Visa Insurance"
                  width={260}
                  height={130}
                  className="relative z-10 w-auto h-28 sm:h-36 lg:h-40 object-contain transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* Empty State for General */}
        {selectedCategory === "general" && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs space-y-3">
            <p className="text-[#1C2541] font-bold text-base">No General Policies Found</p>
            <p className="text-slate-400 text-xs">You currently do not have any active general or property insurance policies.</p>
            <Link
              href="/user-portal/buy"
              className="inline-block bg-[#2563EB] hover:bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-colors mt-2"
            >
              Explore General Policies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
