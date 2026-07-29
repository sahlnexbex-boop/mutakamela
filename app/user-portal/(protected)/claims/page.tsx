"use client";

import { Plus, Upload, Mail, Download } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ClaimsRoutePage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <div className="space-y-6">
      {/* Page Header (Same Top Row on Mobile Screens) */}
      <div className="flex flex-row items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-3xl font-semibold text-[#1C2541]">{t("claimsCenter")}</h1>
          <p className="text-[11px] sm:text-sm text-[#8C94A6] font-normal mt-0.5">{t("trackManageClaims")}</p>
        </div>
        <button className="inline-flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-blue-600 text-white font-semibold px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0">
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-3" />
          <span className="sm:hidden">{isAr ? "جديد" : "New"}</span>
          <span className="hidden sm:inline">{t("newClaim")}</span>
        </button>
      </div>

      {/* 3 Summary Stat Cards: Single 3-Column Row on Mobile Screens */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-6">
        {/* Stat Box 1: Open Claims */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#FFA244] via-[#FF7E63] to-[#FF6A87] p-3 sm:p-7 rounded-2xl sm:rounded-3xl text-white shadow-md transition-transform hover:-translate-y-0.5">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10 pointer-events-none" />
          <div className="relative z-10">
            <div className="text-2xl sm:text-4xl font-semibold tracking-tight text-white mb-1 sm:mb-3">2</div>
            <div className="text-xs sm:text-base font-semibold text-white">{t("openClaims")}</div>
            <p className="hidden sm:block text-xs text-white/85 font-normal mt-0.5">{t("claimsUnderReview")}</p>
          </div>
        </div>

        {/* Stat Box 2: Settled this year */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#6B78F8] via-[#5289F7] to-[#48C3FF] p-3 sm:p-7 rounded-2xl sm:rounded-3xl text-white shadow-md transition-transform hover:-translate-y-0.5">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10 pointer-events-none" />
          <div className="relative z-10">
            <div className="text-2xl sm:text-4xl font-semibold tracking-tight text-white mb-1 sm:mb-3">3</div>
            <div className="text-xs sm:text-base font-semibold text-white">{t("settledThisYear")}</div>
            <p className="hidden sm:block text-xs text-white/85 font-normal mt-0.5">{t("claimsSettledSucc")}</p>
          </div>
        </div>

        {/* Stat Box 3: Avg. settlement */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#32C496] via-[#37D3AB] to-[#4EE4BA] p-3 sm:p-7 rounded-2xl sm:rounded-3xl text-white shadow-md transition-transform hover:-translate-y-0.5">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10 pointer-events-none" />
          <div className="relative z-10">
            <div className="text-xl sm:text-4xl font-semibold tracking-tight text-white mb-1 sm:mb-3">{isAr ? "8 أيام" : "8 days"}</div>
            <div className="text-xs sm:text-base font-semibold text-white">{t("avgSettlement")}</div>
            <p className="hidden sm:block text-xs text-white/85 font-normal mt-0.5">{t("avgProcessingTime")}</p>
          </div>
        </div>
      </div>

      {/* Detailed Claims List with Refined Timeline Steppers */}
      <div className="space-y-6">
        {/* Claim Card 1: Comprehensive Motor Claim */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-[#1C2541]">{t("compMotorClaimTitle")}</h2>
              <p className="text-xs text-[#8C94A6] font-normal mt-0.5">{isAr ? "رقم المطالبة: CLM-2026-0041" : "Claim ID: CLM-2026-0041"}</p>
            </div>
            <span className="bg-[#FFEDD5] text-[#EA580C] text-xs font-semibold px-3 py-1 rounded-md">
              {t("underReviewStatus")}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-slate-100 pt-6">
            <div className="lg:col-span-4 space-y-3.5 text-xs sm:text-sm text-[#64748B]">
              <div>
                <span className="text-[#8C94A6] block text-xs">{t("tablePolicy")}</span>
                <strong className="font-semibold text-[#1C2541]">POL-MTR-2024-00881</strong>
              </div>
              <div>
                <span className="text-[#8C94A6] block text-xs">{t("incident")}</span>
                <strong className="font-semibold text-[#1C2541]">{isAr ? "02 يونيو 2026، الرياض" : "02 Jun 2026, Riyadh"}</strong>
              </div>
              <div>
                <span className="text-[#8C94A6] block text-xs">{t("estimatedLoss")}</span>
                <strong className="font-semibold text-[#1C2541]">{isAr ? "12,400 ر.س" : "SAR 12,400"}</strong>
              </div>
              <div>
                <span className="text-[#8C94A6] block text-xs">{t("expectedCompletion")}</span>
                <strong className="font-semibold text-[#1C2541]">{t("within15DaysSla")}</strong>
              </div>
              <div>
                <span className="text-[#8C94A6] block text-xs">{t("assignedSurveyor")}</span>
                <strong className="font-semibold text-[#1C2541]">{isAr ? "أحمد الحربي" : "Ahmed Al Harbi"}</strong>
              </div>
              <div>
                <span className="text-[#8C94A6] block text-xs">{t("lastUpdated")}</span>
                <strong className="font-semibold text-[#1C2541]">{isAr ? "10 يونيو 2026" : "10 June 2026"}</strong>
              </div>
            </div>

            {/* Timeline Stepper Container with Refined Dots & Lines */}
            <div className="lg:col-span-8 space-y-6 relative pl-5 rtl:pl-0 rtl:pr-5 border-l rtl:border-l-0 rtl:border-r border-slate-200 ml-2 rtl:ml-0 rtl:mr-2">
              {/* Step 1 */}
              <div className="relative pl-4 rtl:pl-0 rtl:pr-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EA580C] absolute -left-[25.5px] rtl:left-auto rtl:-right-[25.5px] top-1.5" />
                <p className="font-semibold text-xs sm:text-sm text-[#1C2541]">{t("claimSubmittedOnline")}</p>
                <p className="text-xs text-[#8C94A6] font-normal mt-0.5">{isAr ? "02 يونيو 2026، 11:34" : "02 Jun 2026, 11:34"}</p>
              </div>

              {/* Step 2 */}
              <div className="relative pl-4 rtl:pl-0 rtl:pr-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EA580C] absolute -left-[25.5px] rtl:left-auto rtl:-right-[25.5px] top-1.5" />
                <p className="font-semibold text-xs sm:text-sm text-[#1C2541]">{t("docsVerifiedClaimRegistered")}</p>
                <p className="text-xs text-[#8C94A6] font-normal mt-0.5">{isAr ? "03 يونيو 2026، 09:15" : "03 Jun 2026, 09:15"}</p>
              </div>

              {/* Step 3 */}
              <div className="relative pl-4 rtl:pl-0 rtl:pr-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EA580C] absolute -left-[25.5px] rtl:left-auto rtl:-right-[25.5px] top-1.5" />
                <p className="font-semibold text-xs sm:text-sm text-[#1C2541]">{t("surveyorAssignedAhmed")}</p>
                <p className="text-xs text-[#8C94A6] font-normal mt-0.5">{isAr ? "04 يونيو 2026، 14:02" : "04 Jun 2026, 14:02"}</p>
              </div>

              {/* Step 4 */}
              <div className="relative pl-4 rtl:pl-0 rtl:pr-4">
                <div className="w-2.5 h-2.5 rounded-full bg-white border border-slate-300 absolute -left-[25.5px] rtl:left-auto rtl:-right-[25.5px] top-1.5" />
                <p className="font-medium text-xs sm:text-sm text-slate-500">{t("workshopAssessmentPending")}</p>
                <p className="text-xs text-[#8C94A6] font-normal mt-0.5">{isAr ? "المتوقع: 12 يونيو 2026" : "Expected: 12 Jun 2026"}</p>
              </div>

              {/* Step 5 */}
              <div className="relative pl-4 rtl:pl-0 rtl:pr-4">
                <div className="w-2.5 h-2.5 rounded-full bg-white border border-slate-300 absolute -left-[25.5px] rtl:left-auto rtl:-right-[25.5px] top-1.5" />
                <p className="font-medium text-xs sm:text-sm text-slate-500">{t("settlementAndPayment")}</p>
                <p className="text-xs text-[#8C94A6] font-normal mt-0.5">{isAr ? "المتوقع: 18 يونيو 2026" : "Expected: 18 Jun 2026"}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
            <button className="border border-[#1C2541] bg-white hover:bg-slate-50 text-[#1C2541] font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-2xs">
              <Upload className="w-4 h-4" />
              <span>{t("uploadDocument")}</span>
            </button>
            <button className="border border-[#1C2541] bg-white hover:bg-slate-50 text-[#1C2541] font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-2xs">
              <Mail className="w-4 h-4" />
              <span>{t("messageSurveyor")}</span>
            </button>
          </div>
        </div>

        {/* Claim Card 2: Third Party Liability (TPL) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-[#1C2541]">{t("thirdPartyLiabilityTitle")}</h2>
              <p className="text-xs text-[#8C94A6] font-normal mt-0.5">{isAr ? "رقم المطالبة: CLM-2026-0041" : "Claim ID: CLM-2026-0041"}</p>
            </div>
            <span className="bg-[#DCFCE7] text-[#16A34A] text-xs font-semibold px-3 py-1 rounded-md">
              {t("settledStatus")}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-slate-100 pt-6">
            <div className="lg:col-span-4 space-y-3.5 text-xs sm:text-sm text-[#64748B]">
              <div>
                <span className="text-[#8C94A6] block text-xs">{t("totalSlaLabel")}:</span>
                <strong className="font-semibold text-[#1C2541]">{isAr ? "5 أيام" : "5 Days"}</strong>
              </div>
              <div>
                <span className="text-[#8C94A6] block text-xs">{t("settlementAmountLabel")}:</span>
                <strong className="font-semibold text-[#1C2541]">{isAr ? "8,500 ر.س" : "SAR 8,500"}</strong>
              </div>
              <div>
                <span className="text-[#8C94A6] block text-xs">{t("settlementDateLabel")}:</span>
                <strong className="font-semibold text-[#1C2541]">{isAr ? "05 يونيو 2026" : "05 June 2026"}</strong>
              </div>
            </div>

            {/* Timeline Stepper Container for Settled Claim */}
            <div className="lg:col-span-8 space-y-6 relative pl-5 rtl:pl-0 rtl:pr-5 border-l rtl:border-l-0 rtl:border-r border-emerald-300 ml-2 rtl:ml-0 rtl:mr-2">
              {/* Step 1 */}
              <div className="relative pl-4 rtl:pl-0 rtl:pr-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] absolute -left-[25.5px] rtl:left-auto rtl:-right-[25.5px] top-1.5" />
                <p className="font-semibold text-xs sm:text-sm text-[#1C2541]">{t("claimSubmittedOnline")}</p>
                <p className="text-xs text-[#8C94A6] font-normal mt-0.5">{isAr ? "02 يونيو 2026، 11:34" : "02 Jun 2026, 11:34"}</p>
              </div>

              {/* Step 2 */}
              <div className="relative pl-4 rtl:pl-0 rtl:pr-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] absolute -left-[25.5px] rtl:left-auto rtl:-right-[25.5px] top-1.5" />
                <p className="font-semibold text-xs sm:text-sm text-[#1C2541]">{t("docsVerifiedClaimRegistered")}</p>
                <p className="text-xs text-[#8C94A6] font-normal mt-0.5">{isAr ? "03 يونيو 2026، 09:15" : "03 Jun 2026, 09:15"}</p>
              </div>

              {/* Step 3 */}
              <div className="relative pl-4 rtl:pl-0 rtl:pr-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] absolute -left-[25.5px] rtl:left-auto rtl:-right-[25.5px] top-1.5" />
                <p className="font-semibold text-xs sm:text-sm text-[#1C2541]">{t("surveyorAssignedAhmed")}</p>
                <p className="text-xs text-[#8C94A6] font-normal mt-0.5">{isAr ? "04 يونيو 2026، 14:02" : "04 Jun 2026, 14:02"}</p>
              </div>

              {/* Step 4 */}
              <div className="relative pl-4 rtl:pl-0 rtl:pr-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] absolute -left-[25.5px] rtl:left-auto rtl:-right-[25.5px] top-1.5" />
                <p className="font-semibold text-xs sm:text-sm text-[#1C2541]">{t("workshopAssessmentPending")}</p>
                <p className="text-xs text-[#8C94A6] font-normal mt-0.5">{isAr ? "المتوقع: 12 يونيو 2026" : "Expected: 12 Jun 2026"}</p>
              </div>

              {/* Step 5 */}
              <div className="relative pl-4 rtl:pl-0 rtl:pr-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] absolute -left-[25.5px] rtl:left-auto rtl:-right-[25.5px] top-1.5" />
                <p className="font-semibold text-xs sm:text-sm text-[#1C2541]">{t("settlementAndPayment")}</p>
                <p className="text-xs text-[#8C94A6] font-normal mt-0.5">{isAr ? "المتوقع: 18 يونيو 2026" : "Expected: 18 Jun 2026"}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
            <button className="border border-[#1C2541] bg-white hover:bg-slate-50 text-[#1C2541] font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-2xs">
              <Download className="w-4 h-4" />
              <span>{t("downloadLetterBtn")}</span>
            </button>
            <button className="border border-[#1C2541] bg-white hover:bg-slate-50 text-[#1C2541] font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-2xs">
              <Mail className="w-4 h-4" />
              <span>{t("messageSurveyor")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
