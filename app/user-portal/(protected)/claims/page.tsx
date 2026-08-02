"use client";

import { Plus, Upload, Mail, Download } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ClaimsRoutePage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-row items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-[#1C2541]">{t("claimsCenter")}</h1>
          <p className="text-[11px] sm:text-sm text-slate-500 font-medium mt-0.5">{t("trackManageClaims")}</p>
        </div>
        <button className="inline-flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-blue-600 text-white font-bold px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0">
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
          <span className="sm:hidden">{isAr ? "جديد" : "New"}</span>
          <span className="hidden sm:inline">{t("newClaim")}</span>
        </button>
      </div>

      {/* 3 Summary Stat Cards (CLEAN WHITE CARDS WITH COLORED TITLES MATCHING DESIGN MOCK 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Stat Card 1: Open Claims */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-1 hover:shadow-md transition-all">
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2563EB]">2</div>
          <div className="text-sm font-bold text-[#2563EB] pt-1">{t("openClaims")}</div>
          <p className="text-xs text-slate-400 font-normal">{t("claimsUnderReview")}</p>
        </div>

        {/* Stat Card 2: Settled this year */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-1 hover:shadow-md transition-all">
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#EA580C]">3</div>
          <div className="text-sm font-bold text-[#EA580C] pt-1">{t("settledThisYear")}</div>
          <p className="text-xs text-slate-400 font-normal">{t("claimsSettledSucc")}</p>
        </div>

        {/* Stat Card 3: Avg. settlement */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-1 hover:shadow-md transition-all">
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#16A34A]">{isAr ? "8 أيام" : "8 days"}</div>
          <div className="text-sm font-bold text-[#16A34A] pt-1">{t("avgSettlement")}</div>
          <p className="text-xs text-slate-400 font-normal">{t("avgProcessingTime")}</p>
        </div>
      </div>

      {/* Detailed Claims List with Refined Timeline Steppers */}
      <div className="space-y-6">
        {/* Claim Card 1: Comprehensive Motor Claim (Under Review) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1C2541]">{t("compMotorClaimTitle")}</h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{isAr ? "رقم المطالبة: CLM-2026-0041" : "Claim ID: CLM-2026-0041"}</p>
            </div>
            <span className="bg-[#FFEDD5] text-[#EA580C] text-xs font-bold px-3 py-1 rounded-md">
              {t("underReviewStatus")}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 border-t border-slate-100 pt-6">
            {/* Left Column Metadata Box */}
            <div className="lg:col-span-4 bg-slate-50/70 rounded-2xl p-5 border border-slate-100 space-y-3.5 text-xs sm:text-sm text-slate-600">
              <div>
                <span className="text-slate-400 block text-xs font-normal">{t("tablePolicy")}</span>
                <strong className="font-bold text-[#1C2541]">POL-MTR-2024-00881</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-xs font-normal">{t("incident")}</span>
                <strong className="font-bold text-[#1C2541]">{isAr ? "02 يونيو 2026، الرياض" : "02 Jun 2026, Riyadh"}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-xs font-normal">{t("estimatedLoss")}</span>
                <strong className="font-bold text-[#1C2541]">{isAr ? "12,400 ر.س" : "SAR 12,400"}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-xs font-normal">{t("expectedCompletion")}</span>
                <strong className="font-bold text-[#1C2541]">{t("within15DaysSla")}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-xs font-normal">{t("assignedSurveyor")}</span>
                <strong className="font-bold text-[#1C2541]">{isAr ? "أحمد الحربي" : "Ahmed Al Harbi"}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-xs font-normal">{t("lastUpdated")}</span>
                <strong className="font-bold text-[#1C2541]">{isAr ? "10 يونيو 2026" : "10 June 2026"}</strong>
              </div>
            </div>

            {/* Right Column Timeline Stepper */}
            <div className="lg:col-span-8 space-y-6 relative pl-6 rtl:pl-0 rtl:pr-6 border-l rtl:border-l-0 rtl:border-r border-orange-300 ml-2 rtl:ml-0 rtl:mr-2">
              {/* Step 1 */}
              <div className="relative pl-2 rtl:pl-0 rtl:pr-2">
                <div className="w-3 h-3 rounded-full bg-[#EA580C] absolute -left-[30px] rtl:left-auto rtl:-right-[30px] top-1 ring-4 ring-orange-100" />
                <p className="font-bold text-xs sm:text-sm text-[#1C2541]">{t("claimSubmittedOnline")}</p>
                <p className="text-xs text-slate-400 font-normal mt-0.5">{isAr ? "02 يونيو 2026، 11:34" : "02 Jun 2026, 11:34"}</p>
              </div>

              {/* Step 2 */}
              <div className="relative pl-2 rtl:pl-0 rtl:pr-2">
                <div className="w-3 h-3 rounded-full bg-[#EA580C] absolute -left-[30px] rtl:left-auto rtl:-right-[30px] top-1 ring-4 ring-orange-100" />
                <p className="font-bold text-xs sm:text-sm text-[#1C2541]">{t("docsVerifiedClaimRegistered")}</p>
                <p className="text-xs text-slate-400 font-normal mt-0.5">{isAr ? "03 يونيو 2026، 09:15" : "03 Jun 2026, 09:15"}</p>
              </div>

              {/* Step 3 */}
              <div className="relative pl-2 rtl:pl-0 rtl:pr-2">
                <div className="w-3 h-3 rounded-full bg-[#EA580C] absolute -left-[30px] rtl:left-auto rtl:-right-[30px] top-1 ring-4 ring-orange-100" />
                <p className="font-bold text-xs sm:text-sm text-[#1C2541]">{t("surveyorAssignedAhmed")}</p>
                <p className="text-xs text-slate-400 font-normal mt-0.5">{isAr ? "04 يونيو 2026، 14:02" : "04 Jun 2026, 14:02"}</p>
              </div>

              {/* Step 4 */}
              <div className="relative pl-2 rtl:pl-0 rtl:pr-2">
                <div className="w-3 h-3 rounded-full bg-white border-2 border-slate-300 absolute -left-[30px] rtl:left-auto rtl:-right-[30px] top-1" />
                <p className="font-semibold text-xs sm:text-sm text-slate-400">{t("workshopAssessmentPending")}</p>
                <p className="text-xs text-slate-400 font-normal mt-0.5">{isAr ? "المتوقع: 12 يونيو 2026" : "Expected: 12 Jun 2026"}</p>
              </div>

              {/* Step 5 */}
              <div className="relative pl-2 rtl:pl-0 rtl:pr-2">
                <div className="w-3 h-3 rounded-full bg-white border-2 border-slate-300 absolute -left-[30px] rtl:left-auto rtl:-right-[30px] top-1" />
                <p className="font-semibold text-xs sm:text-sm text-slate-400">{t("settlementAndPayment")}</p>
                <p className="text-xs text-slate-400 font-normal mt-0.5">{isAr ? "المتوقع: 18 يونيو 2026" : "Expected: 18 Jun 2026"}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
            <button className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-xs">
              <Upload className="w-4 h-4 text-slate-500" />
              <span>{t("uploadDocument")}</span>
            </button>
            <button className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-xs">
              <Mail className="w-4 h-4 text-slate-500" />
              <span>{t("messageSurveyor")}</span>
            </button>
          </div>
        </div>

        {/* Claim Card 2: Third Party Liability (TPL - Settled) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1C2541]">{t("thirdPartyLiabilityTitle")}</h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{isAr ? "رقم المطالبة: CLM-2026-0041" : "Claim ID: CLM-2026-0041"}</p>
            </div>
            <span className="bg-[#DCFCE7] text-[#16A34A] text-xs font-bold px-3 py-1 rounded-md">
              {t("settledStatus")}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 border-t border-slate-100 pt-6">
            {/* Left Column Metadata Box */}
            <div className="lg:col-span-4 bg-slate-50/70 rounded-2xl p-5 border border-slate-100 space-y-3.5 text-xs sm:text-sm text-slate-600">
              <div>
                <span className="text-slate-400 block text-xs font-normal">{t("totalSlaLabel")}:</span>
                <strong className="font-bold text-[#1C2541]">{isAr ? "5 أيام" : "5 Days"}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-xs font-normal">{t("settlementAmountLabel")}:</span>
                <strong className="font-bold text-[#1C2541]">{isAr ? "8,500 ر.س" : "SAR 8,500"}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-xs font-normal">{t("settlementDateLabel")}:</span>
                <strong className="font-bold text-[#1C2541]">{isAr ? "05 يونيو 2026" : "05 June 2026"}</strong>
              </div>
            </div>

            {/* Right Column Timeline Stepper */}
            <div className="lg:col-span-8 space-y-6 relative pl-6 rtl:pl-0 rtl:pr-6 border-l rtl:border-l-0 rtl:border-r border-emerald-400 ml-2 rtl:ml-0 rtl:mr-2">
              {/* Step 1 */}
              <div className="relative pl-2 rtl:pl-0 rtl:pr-2">
                <div className="w-3 h-3 rounded-full bg-[#16A34A] absolute -left-[30px] rtl:left-auto rtl:-right-[30px] top-1 ring-4 ring-emerald-100" />
                <p className="font-bold text-xs sm:text-sm text-[#1C2541]">{t("claimSubmittedOnline")}</p>
                <p className="text-xs text-slate-400 font-normal mt-0.5">{isAr ? "02 يونيو 2026، 11:34" : "02 Jun 2026, 11:34"}</p>
              </div>

              {/* Step 2 */}
              <div className="relative pl-2 rtl:pl-0 rtl:pr-2">
                <div className="w-3 h-3 rounded-full bg-[#16A34A] absolute -left-[30px] rtl:left-auto rtl:-right-[30px] top-1 ring-4 ring-emerald-100" />
                <p className="font-bold text-xs sm:text-sm text-[#1C2541]">{t("docsVerifiedClaimRegistered")}</p>
                <p className="text-xs text-slate-400 font-normal mt-0.5">{isAr ? "03 يونيو 2026، 09:15" : "03 Jun 2026, 09:15"}</p>
              </div>

              {/* Step 3 */}
              <div className="relative pl-2 rtl:pl-0 rtl:pr-2">
                <div className="w-3 h-3 rounded-full bg-[#16A34A] absolute -left-[30px] rtl:left-auto rtl:-right-[30px] top-1 ring-4 ring-emerald-100" />
                <p className="font-bold text-xs sm:text-sm text-[#1C2541]">{t("surveyorAssignedAhmed")}</p>
                <p className="text-xs text-slate-400 font-normal mt-0.5">{isAr ? "04 يونيو 2026، 14:02" : "04 Jun 2026, 14:02"}</p>
              </div>

              {/* Step 4 */}
              <div className="relative pl-2 rtl:pl-0 rtl:pr-2">
                <div className="w-3 h-3 rounded-full bg-[#16A34A] absolute -left-[30px] rtl:left-auto rtl:-right-[30px] top-1 ring-4 ring-emerald-100" />
                <p className="font-bold text-xs sm:text-sm text-[#1C2541]">{t("workshopAssessmentPending")}</p>
                <p className="text-xs text-slate-400 font-normal mt-0.5">{isAr ? "المتوقع: 12 يونيو 2026" : "Expected: 12 Jun 2026"}</p>
              </div>

              {/* Step 5 */}
              <div className="relative pl-2 rtl:pl-0 rtl:pr-2">
                <div className="w-3 h-3 rounded-full bg-[#16A34A] absolute -left-[30px] rtl:left-auto rtl:-right-[30px] top-1 ring-4 ring-emerald-100" />
                <p className="font-bold text-xs sm:text-sm text-[#1C2541]">{t("settlementAndPayment")}</p>
                <p className="text-xs text-slate-400 font-normal mt-0.5">{isAr ? "المتوقع: 18 يونيو 2026" : "Expected: 18 Jun 2026"}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
            <button className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-xs">
              <Download className="w-4 h-4 text-slate-500" />
              <span>{t("downloadLetterBtn")}</span>
            </button>
            <button className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-xs">
              <Mail className="w-4 h-4 text-slate-500" />
              <span>{t("messageSurveyor")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
