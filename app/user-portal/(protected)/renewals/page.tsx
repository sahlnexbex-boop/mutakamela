"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function RenewalsRoutePage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#1C2541]">{t("renewalsTitle")}</h1>
        <p className="text-xs sm:text-sm text-[#8C94A6] font-normal mt-1">{t("policyRequiringAttention")}</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-[#1C2541]">
              {isAr ? "تأمين المركبات — شامل" : "Motor Insurance – Comprehensive"}
            </h2>
            <p className="text-xs sm:text-sm text-[#8C94A6] font-normal mt-0.5">
              {isAr ? "POL-MTR-2024-00881 · تويوتا كامري 2022 · ينتهي 24 يونيو 2026" : "POL-MTR-2024-00881 · Toyota Camry 2022 · Expires 24 Jun 2026"}
            </p>
          </div>
          <span className="bg-[#FFEDD5] text-[#EA580C] text-xs font-semibold px-3 py-1 rounded-md flex items-center gap-1.5 self-start">
            <Clock className="w-3.5 h-3.5" />
            <span>{t("expiresIn14Days")}</span>
          </span>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="flex justify-between text-xs text-[#64748B]">
            <span>{t("policyPeriod")}</span>
            <span className="font-semibold text-[#EA580C]">{t("daysRemaining14")}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#EA580C] rounded-full w-[85%]" />
          </div>
          <div className="flex justify-between text-[11px] text-[#8C94A6]">
            <span>{isAr ? "24 يونيو 2025" : "24 Jun 2025"}</span>
            <span>{isAr ? "24 يونيو 2026" : "24 Jun 2026"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100 text-xs sm:text-sm">
          <div>
            <span className="text-[#8C94A6] text-xs block">{t("vehicle")}</span>
            <strong className="font-semibold text-[#1C2541]">{isAr ? "تويوتا كامري 2022" : "Toyota Camry 2022"}</strong>
          </div>
          <div>
            <span className="text-[#8C94A6] text-xs block">{t("coverageType")}</span>
            <strong className="font-semibold text-[#1C2541]">{t("comprehensiveCoverage")}</strong>
          </div>
          <div>
            <span className="text-[#8C94A6] text-xs block">{t("renewalPremium")}</span>
            <strong className="font-semibold text-[#2563EB]">{isAr ? "4,200 ر.س" : "SAR 4,200"}</strong>
          </div>
          <div>
            <span className="text-[#8C94A6] text-xs block">{t("expiryDate")}</span>
            <strong className="font-semibold text-[#1C2541]">{isAr ? "24 يونيو 2026" : "24 Jun 2026"}</strong>
          </div>
          <div>
            <span className="text-[#8C94A6] text-xs block">{t("policyNumber")}</span>
            <strong className="font-semibold text-[#1C2541]">POL-MTR-2024-00881</strong>
          </div>
          <div>
            <span className="text-[#8C94A6] text-xs block">{t("vsLastYear")}</span>
            <strong className="font-semibold text-[#16A34A]">{isAr ? "- نفس السعر" : "- Same price"}</strong>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
          <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl text-xs sm:text-sm cursor-pointer shadow-md transition-colors">
            {t("renewNow4200")}
          </button>
          <Link
            href="/user-portal/policies"
            className="border border-[#1C2541] hover:bg-slate-50 text-[#1C2541] font-semibold px-5 py-3 rounded-xl text-xs sm:text-sm cursor-pointer shadow-2xs transition-colors block"
          >
            {t("viewPolicyDetails")}
          </Link>
        </div>
      </div>
    </div>
  );
}
