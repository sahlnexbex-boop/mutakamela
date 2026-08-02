"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function RenewalsRoutePage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-xl sm:text-3xl font-extrabold text-[#1C2541]">{t("renewalsTitle")}</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">{t("policyRequiringAttention")}</p>
      </div>

      {/* Main Renewal Card (MATCHING ATTACHED IMAGE 1 EXACTLY) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1C2541]">
              {isAr ? "تأمين المركبات — شامل" : "Motor Insurance – Comprehensive"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
              {isAr ? "POL-MTR-2024-00881 · تويوتا كامري 2022 · ينتهي 24 يونيو 2026" : "POL-MTR-2024-00881 · Toyota Camry 2022 · Expires 24 Jun 2026"}
            </p>
          </div>
          <span className="bg-[#FFEDD5] text-[#EA580C] text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 self-start">
            <Clock className="w-3.5 h-3.5" />
            <span>{t("expiresIn14Days")}</span>
          </span>
        </div>

        {/* Progress Bar Row */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span>{t("policyPeriod")}</span>
            <span className="text-[#EA580C]">{t("daysRemaining14")}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#EA580C] rounded-full w-[85%]" />
          </div>
        </div>

        <div className="my-4 border-t border-slate-100" />

        {/* 3 Column Grid Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-5 gap-x-6 text-xs sm:text-sm">
          {/* Row 1 Col 1 */}
          <div>
            <span className="text-slate-400 text-xs block font-medium">{t("vehicle")}</span>
            <strong className="font-bold text-[#1C2541] mt-0.5 block">{isAr ? "تويوتا كامري 2022" : "Toyota Camry 2022"}</strong>
          </div>

          {/* Row 1 Col 2 */}
          <div>
            <span className="text-slate-400 text-xs block font-medium">{t("coverageType")}</span>
            <strong className="font-bold text-[#1C2541] mt-0.5 block">{t("comprehensiveCoverage")}</strong>
          </div>

          {/* Row 1 Col 3 */}
          <div>
            <span className="text-slate-400 text-xs block font-medium">{t("renewalPremium")}</span>
            <strong className="font-bold text-[#2563EB] mt-0.5 block">{isAr ? "4,200 ر.س" : "SAR 4,200"}</strong>
          </div>

          {/* Row 2 Col 1 */}
          <div>
            <span className="text-slate-400 text-xs block font-medium">{t("expiryDate")}</span>
            <strong className="font-bold text-[#1C2541] mt-0.5 block">{isAr ? "24 يونيو 2026" : "24 Jun 2026"}</strong>
          </div>

          {/* Row 2 Col 2 */}
          <div>
            <span className="text-slate-400 text-xs block font-medium">{isAr ? "رقم الوثيقة" : "Policy number"}</span>
            <strong className="font-bold text-[#1C2541] mt-0.5 block font-mono">POL-MTR-2024-00881</strong>
          </div>

          {/* Row 2 Col 3 */}
          <div>
            <span className="text-slate-400 text-xs block font-medium">{t("vsLastYear")}</span>
            <strong className="font-bold text-[#16A34A] mt-0.5 block">{isAr ? "- نفس السعر" : "- Same price"}</strong>
          </div>
        </div>

        <div className="my-4 border-t border-slate-100" />

        {/* Bottom Buttons (Aligned Right matching Attached Image 1) */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer">
            {t("renewNow4200")}
          </button>
          <Link
            href="/user-portal/policies"
            className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-2xs transition-colors block"
          >
            {t("viewPolicyDetails")}
          </Link>
        </div>
      </div>
    </div>
  );
}
