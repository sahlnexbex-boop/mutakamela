"use client";

import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ComplaintsRoutePage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-3xl font-semibold text-[#1C2541]">{t("complaints")}</h1>
          <p className="text-[11px] sm:text-sm text-[#8C94A6] font-normal mt-0.5">{t("trackSubmitComplaints")}</p>
        </div>
        <button className="inline-flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-blue-600 text-white font-semibold px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0">
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-3" />
          <span className="sm:hidden">{isAr ? "جديد" : "New"}</span>
          <span className="hidden sm:inline">{t("newComplaint")}</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
          <div>
            <span className="text-[#8C94A6] text-xs block">{t("complaintId")}</span>
            <strong className="font-semibold text-[#1C2541]">CMP-2026-0031</strong>
          </div>
          <div>
            <span className="text-[#8C94A6] text-xs block">{t("category")}</span>
            <strong className="font-semibold text-[#1C2541]">{t("paymentRefundDelay")}</strong>
          </div>
          <div>
            <span className="text-[#8C94A6] text-xs block">{t("submittedOn")}</span>
            <strong className="font-semibold text-[#1C2541]">{isAr ? "14 يونيو 2026" : "14 Jun 2026"}</strong>
          </div>
          <div>
            <span className="text-[#8C94A6] text-xs block mb-1">{t("status")}</span>
            <span className="bg-[#FFEDD5] text-[#EA580C] text-xs font-semibold px-3 py-1 rounded-md inline-block">
              {t("waitingForResponse")}
            </span>
          </div>
        </div>

        <div className="my-4 border-t border-slate-100" />

        <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
          {t("complaintDesc1")}
        </p>
      </div>
    </div>
  );
}
