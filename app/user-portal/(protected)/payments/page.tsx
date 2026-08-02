"use client";

import { Car, Shield, Plane } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PaymentsRoutePage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-3xl font-extrabold text-[#1C2541]">{t("payments")}</h1>

      {/* Section 1: Upcoming Payments (MATCHING ATTACHED IMAGE 4) */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[#1C2541]">{t("upcomingPayments")}</h2>
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs divide-y divide-slate-100 space-y-3 divide-y-0">
          {/* Card 1 */}
          <div className="p-4 rounded-2xl bg-white border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Car className="w-5 h-5 fill-white/10" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-[#1C2541] truncate">{t("motorInsuranceRenewal")}</h3>
                <p className="text-xs text-[#D97706] font-bold mt-0.5">{isAr ? "استحقاق 24 يوليو 2026" : "Due 24 Jul 2026"}</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t border-slate-100 sm:border-t-0">
              <span className="text-sm sm:text-base font-bold text-[#1C2541]">{isAr ? "4,200 ر.س" : "SAR 4,200"}</span>
              <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-bold px-5 py-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-sm">
                {t("payNow")}
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-2xl bg-white border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Shield className="w-5 h-5 fill-white/10" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-[#1C2541] truncate">{t("lifeInsuranceAnnualPremium")}</h3>
                <p className="text-xs text-[#D97706] font-bold mt-0.5">{isAr ? "استحقاق 10 أغسطس 2026" : "Due 10 Aug 2026"}</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t border-slate-100 sm:border-t-0">
              <span className="text-sm sm:text-base font-bold text-[#1C2541]">{isAr ? "1,800 ر.س" : "SAR 1,800"}</span>
              <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-bold px-5 py-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-sm">
                {t("payNow")}
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-2xl bg-white border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Plane className="w-5 h-5 fill-white/10" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-[#1C2541] truncate">{t("travelInsuranceMultiTripPlan")}</h3>
                <p className="text-xs text-[#D97706] font-bold mt-0.5">{isAr ? "استحقاق 03 أكتوبر 2026" : "Due 03 Oct 2026"}</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t border-slate-100 sm:border-t-0">
              <span className="text-sm sm:text-base font-bold text-[#1C2541]">{isAr ? "1,600 ر.س" : "SAR 1,600"}</span>
              <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-bold px-5 py-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-sm">
                {t("payNow")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Transaction History (EXACT MATCH FOR ATTACHED IMAGE 4) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-[#1C2541]">{t("transactionHistoryTitle")}</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-start min-w-[600px] border-separate border-spacing-y-0">
            <thead>
              <tr className="bg-[#DCEBFE] text-xs sm:text-sm font-bold text-[#1C2541]">
                <th className="py-3.5 px-4 ltr:rounded-l-xl rtl:rounded-r-xl text-start">{t("tableDate")}</th>
                <th className="py-3.5 px-4 text-start">{t("tablePolicy")}</th>
                <th className="py-3.5 px-4 text-start">{t("tableDescription")}</th>
                <th className="py-3.5 px-4 text-start">{t("tableAmount")}</th>
                <th className="py-3.5 px-4 ltr:rounded-r-xl rtl:rounded-l-xl text-start">{t("tableStatus")}</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm text-[#1C2541]">
              <tr className="bg-white hover:bg-slate-50/80 transition-colors cursor-pointer">
                <td className="py-3.5 px-4 font-bold text-[#1C2541] ltr:rounded-l-lg rtl:rounded-r-lg">{isAr ? "10 مارس 2026" : "10 Mar 2026"}</td>
                <td className="py-3.5 px-4 font-bold text-[#1C2541]">{t("lifeInsurance")}</td>
                <td className="py-3.5 px-4 font-medium text-[#64748B]">{t("annualPremiumDesc")}</td>
                <td className="py-3.5 px-4 font-bold text-[#1C2541]">{isAr ? "1,800 ر.س" : "SAR 1,800"}</td>
                <td className="py-3.5 px-4 ltr:rounded-r-lg rtl:rounded-l-lg">
                  <span className="bg-[#22C55E] text-white font-bold text-xs px-3 py-1 rounded-md inline-block">
                    {t("paidTag")}
                  </span>
                </td>
              </tr>
              <tr className="bg-[#F0F7FF] hover:bg-[#E5F1FF] transition-colors cursor-pointer">
                <td className="py-3.5 px-4 font-bold text-[#1C2541] ltr:rounded-l-lg rtl:rounded-r-lg">{isAr ? "15 يناير 2026" : "15 Jan 2026"}</td>
                <td className="py-3.5 px-4 font-bold text-[#1C2541]">{t("travelInsurance")}</td>
                <td className="py-3.5 px-4 font-medium text-[#64748B]">{isAr ? "اشتراك سنوي رحلات متعددة" : "Annual multi-trip"}</td>
                <td className="py-3.5 px-4 font-bold text-[#1C2541]">{isAr ? "980 ر.س" : "SAR 980"}</td>
                <td className="py-3.5 px-4 ltr:rounded-r-lg rtl:rounded-l-lg">
                  <span className="bg-[#22C55E] text-white font-bold text-xs px-3 py-1 rounded-md inline-block">
                    {t("paidTag")}
                  </span>
                </td>
              </tr>
              <tr className="bg-white hover:bg-slate-50/80 transition-colors cursor-pointer">
                <td className="py-3.5 px-4 font-bold text-[#1C2541] ltr:rounded-l-lg rtl:rounded-r-lg">{isAr ? "24 يونيو 2025" : "24 Jun 2025"}</td>
                <td className="py-3.5 px-4 font-bold text-[#1C2541]">{t("motorInsurance")}</td>
                <td className="py-3.5 px-4 font-medium text-[#64748B]">{t("renewalPremiumDesc")}</td>
                <td className="py-3.5 px-4 font-bold text-[#1C2541]">{isAr ? "4,200 ر.س" : "SAR 4,200"}</td>
                <td className="py-3.5 px-4 ltr:rounded-r-lg rtl:rounded-l-lg">
                  <span className="bg-[#22C55E] text-white font-bold text-xs px-3 py-1 rounded-md inline-block">
                    {t("paidTag")}
                  </span>
                </td>
              </tr>
              <tr className="bg-[#F0F7FF] hover:bg-[#E5F1FF] transition-colors cursor-pointer">
                <td className="py-3.5 px-4 font-bold text-[#1C2541] ltr:rounded-l-lg rtl:rounded-r-lg">{isAr ? "22 يونيو 2025" : "22 Jun 2025"}</td>
                <td className="py-3.5 px-4 font-bold text-[#1C2541]">{t("lifeInsurance")}</td>
                <td className="py-3.5 px-4 font-medium text-[#64748B]">{t("annualPremiumDesc")}</td>
                <td className="py-3.5 px-4 font-bold text-[#1C2541]">{isAr ? "1,300 ر.س" : "SAR 1,300"}</td>
                <td className="py-3.5 px-4 ltr:rounded-r-lg rtl:rounded-l-lg">
                  <span className="bg-[#22C55E] text-white font-bold text-xs px-3 py-1 rounded-md inline-block">
                    {t("paidTag")}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
