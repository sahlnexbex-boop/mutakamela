"use client";

import Image from "next/image";
import Link from "next/link";
import { useCustomerAuth } from "@/lib/customer-auth-context";
import { useTranslation } from "react-i18next";
import {
  Plus,
  ChevronRight,
  Car,
  Plane,
  Shield,
  FileText,
  CreditCard,
  Star,
  Download,
  Award
} from "lucide-react";

export default function UserPortalDashboardPage() {
  const { user } = useCustomerAuth();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <div className="space-y-8">
      {/* 1. TOP WELCOME BANNER BOX WITH DARK NAVY OVERLAY & GLASS STAT CARDS */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 text-white shadow-xl bg-gradient-to-r from-[#180E5E] via-[#1F147C] to-[#2B1F95] group">
        {/* Background Skyscraper Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('/images/dashboard_box.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#180E5E]/40 to-[#180E5E]/80 pointer-events-none" />

        {/* Top Header Row */}
        <div className="relative z-10 flex flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{t("goodMorning")}, {user?.name || (isAr ? "أحمد" : "Ahmed")}</span>
              <span>👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 mt-1 font-medium">
              {isAr ? "الأربعاء، 10 يونيو 2026 · الرياض، المملكة العربية السعودية" : "Wednesday, 10 June 2026 · Riyadh, KSA"}
            </p>
          </div>

          <Link
            href="/user-portal/buy"
            className="inline-flex items-center gap-2 bg-[#1E65FF] hover:bg-blue-600 text-white font-bold px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl text-xs sm:text-sm shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer shrink-0 transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="sm:hidden">{isAr ? "جديد" : "New"}</span>
            <span className="hidden sm:inline">{t("addNewPolicy")}</span>
          </Link>
        </div>

        {/* 4 Glass Stat Cards Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mt-6 sm:mt-8">
          {/* Card 1: Active Policies */}
          <Link
            href="/user-portal/policies"
            className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-white transition-all shadow-sm flex items-start gap-3.5 group/card cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EA580C] text-white flex items-center justify-center shrink-0 shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">6</div>
              <div className="text-xs sm:text-sm font-bold text-white/95">{t("activePolicies")}</div>
              <div className="text-[11px] text-indigo-200/80 font-normal truncate">{t("motorRenewalDue")}</div>
            </div>
          </Link>

          {/* Card 2: Open Claims */}
          <Link
            href="/user-portal/claims"
            className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-white transition-all shadow-sm flex items-start gap-3.5 group/card cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">2</div>
              <div className="text-xs sm:text-sm font-bold text-white/95">{t("openClaims")}</div>
              <div className="text-[11px] text-indigo-200/80 font-normal truncate">{t("underReview1Approved")}</div>
            </div>
          </Link>

          {/* Card 3: Next Payment */}
          <Link
            href="/user-portal/payments"
            className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-white transition-all shadow-sm flex items-start gap-3.5 group/card cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#16A34A] text-white flex items-center justify-center shrink-0 shadow-md">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-white truncate">{isAr ? "1,240 ر.س" : "SAR 1,240"}</div>
              <div className="text-xs sm:text-sm font-bold text-white/95">{t("nextPayment")}</div>
              <div className="text-[11px] text-indigo-200/80 font-normal truncate">{t("dueIn7Days")}</div>
            </div>
          </Link>

          {/* Card 4: CSAT Score */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-white transition-all shadow-sm flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#D97706] text-white flex items-center justify-center shrink-0 shadow-md">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">4.8 / 5</div>
              <div className="text-xs sm:text-sm font-bold text-white/95">{t("csatScore")}</div>
              <div className="text-[11px] text-indigo-200/80 font-normal truncate">{t("lastClaimRated")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. POLICIES ABOUT TO RENEW SECTION (EXACT MATCH FOR IMAGE 1) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-[#1C2541]">{t("policiesAboutToRenew")}</h2>
          <Link
            href="/user-portal/renewals"
            className="text-xs sm:text-sm font-semibold text-[#2563EB] hover:text-[#1a1071] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{t("viewAll")}</span>
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Motor */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group overflow-hidden">
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Car className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-[#1C2541] truncate">{t("motorInsurance")}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">POL-MTR-2024-00881</p>
                </div>
              </div>

              <div className="pt-1">
                <span className="bg-[#DC2626] text-white text-[11px] font-bold px-3 py-1 rounded-full inline-block">
                  {isAr ? "متبقي 7 أيام" : "7 days left"}
                </span>
              </div>

              <p className="text-xs text-[#1C2541] font-bold">{isAr ? "الانتهاء: 25 يونيو 2026" : "Exp: 25 Jun 2026"}</p>
            </div>

            <div className="border-t border-slate-100 py-3 text-center">
              <Link
                href="/user-portal/renewals"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#2563EB] hover:underline"
              >
                <span>{t("renewNow")}</span>
                <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </Link>
            </div>
          </div>

          {/* Card 2: Travel */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group overflow-hidden">
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EA580C] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Plane className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-[#1C2541] truncate">{t("travelInsurance")}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">POL-TRV-2025-00234</p>
                </div>
              </div>

              <div className="pt-1">
                <span className="bg-[#EA580C] text-white text-[11px] font-bold px-3 py-1 rounded-full inline-block">
                  {isAr ? "متبقي 15 يوماً" : "15 days left"}
                </span>
              </div>

              <p className="text-xs text-[#1C2541] font-bold">{isAr ? "الانتهاء: 3 يوليو 2026" : "Exp: 3 Jul 2026"}</p>
            </div>

            <div className="border-t border-slate-100 py-3 text-center">
              <Link
                href="/user-portal/renewals"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#2563EB] hover:underline"
              >
                <span>{t("renewNow")}</span>
                <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </Link>
            </div>
          </div>

          {/* Card 3: Life */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group overflow-hidden">
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-[#1C2541] truncate">{t("lifeInsurance")}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">POL-LFE-2025-00201</p>
                </div>
              </div>

              <div className="pt-1">
                <span className="bg-[#2563EB] text-white text-[11px] font-bold px-3 py-1 rounded-full inline-block">
                  {isAr ? "متبقي 30 يوماً" : "30 days left"}
                </span>
              </div>

              <p className="text-xs text-[#1C2541] font-bold">{isAr ? "الانتهاء: 18 يوليو 2026" : "Exp: 18 Jul 2026"}</p>
            </div>

            <div className="border-t border-slate-100 py-3 text-center">
              <Link
                href="/user-portal/renewals"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#2563EB] hover:underline"
              >
                <span>{t("renewNow")}</span>
                <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </Link>
            </div>
          </div>

          {/* Card 4: Visit Visa */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group overflow-hidden">
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D97706] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-[#1C2541] truncate">{isAr ? "تأمين تأشيرة الزيارة" : "Visit Visa Insurance"}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">POL-LFE-2024-00112</p>
                </div>
              </div>

              <div className="pt-1">
                <span className="bg-[#2563EB] text-white text-[11px] font-bold px-3 py-1 rounded-full inline-block">
                  {isAr ? "متبقي 30 يوماً" : "30 days left"}
                </span>
              </div>

              <p className="text-xs text-[#1C2541] font-bold">{isAr ? "الانتهاء: 18 يوليو 2026" : "Exp: 18 Jul 2026"}</p>
            </div>

            <div className="border-t border-slate-100 py-3 text-center">
              <Link
                href="/user-portal/renewals"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#2563EB] hover:underline"
              >
                <span>{t("renewNow")}</span>
                <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. YOUR ACTIVE POLICIES SECTION (EXACT MATCH FOR IMAGE 2) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-[#1C2541]">{t("yourActivePolicies")}</h2>
          <Link
            href="/user-portal/policies"
            className="text-xs sm:text-sm font-semibold text-[#2563EB] hover:text-[#1a1071] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{t("viewAll")}</span>
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Active Card 1: Motor */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group relative overflow-hidden">
            <div>
              <div className="flex items-start justify-between min-h-[125px] relative">
                <div className="space-y-1 z-10 max-w-[55%]">
                  <h3 className="font-bold text-base sm:text-lg text-[#1C2541] tracking-tight">{t("motorInsurance")}</h3>
                  <p className="text-xs text-slate-400 font-mono font-normal">POL-MTR-2024-00881</p>
                  <div className="pt-1.5">
                    <span className="bg-[#DDF5E6] text-[#16A34A] text-xs font-bold px-2.5 py-0.5 rounded-md inline-block">
                      {t("activeStatus")}
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-400 block font-normal">{t("coverage")}</span>
                    <span className="text-xs sm:text-sm font-bold text-[#1C2541]">{isAr ? "100,000 ر.س" : "SAR 100,000"}</span>
                  </div>
                </div>

                <div className="absolute ltr:right-0 rtl:left-0 top-0 w-48 h-36 flex items-center ltr:justify-end rtl:justify-start overflow-hidden pointer-events-none">
                  {/* <div className="absolute w-28 h-28 bg-[#EEF5FF] rounded-full ltr:translate-x-4 rtl:-translate-x-4 -translate-y-2" /> */}
                  <Image
                    src="/images/products_01.png"
                    alt="Motor Insurance"
                    width={160}
                    height={90}
                    className="relative z-10 w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Full-width horizontal divider line */}
              <div className="my-4 border-t border-slate-100" />

              {/* Bottom Row: Premium (Amber), Expiry Date (Amber), Circle Arrow Button */}
              <div className="flex items-center justify-between text-start">
                <div>
                  <div className="text-[11px] font-bold text-[#D97706]">{t("premium")}</div>
                  <div className="text-xs sm:text-sm font-bold text-[#1C2541] mt-0.5">{isAr ? "1,240 ر.س" : "SAR 1,240"}</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#D97706]">{t("expiryDate")}</div>
                  <div className="text-xs sm:text-sm font-bold text-[#1C2541] mt-0.5">{isAr ? "25 يونيو 2026" : "25 Jun 2026"}</div>
                </div>
                <Link
                  href="/user-portal/policies"
                  className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs flex items-center justify-center transition-colors group-hover:border-[#2563EB] group-hover:text-[#2563EB]"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          </div>

          {/* Active Card 2: Travel */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group relative overflow-hidden">
            <div>
              <div className="flex items-start justify-between min-h-[125px] relative">
                <div className="space-y-1 z-10 max-w-[55%]">
                  <h3 className="font-bold text-base sm:text-lg text-[#1C2541] tracking-tight">{t("travelInsurance")}</h3>
                  <p className="text-xs text-slate-400 font-mono font-normal">POL-TRV-2025-00234</p>
                  <div className="pt-1.5">
                    <span className="bg-[#DDF5E6] text-[#16A34A] text-xs font-bold px-2.5 py-0.5 rounded-md inline-block">
                      {t("activeStatus")}
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-400 block font-normal">{t("coverage")}</span>
                    <span className="text-xs sm:text-sm font-bold text-[#1C2541]">{t("worldwide")}</span>
                  </div>
                </div>

                <div className="absolute ltr:right-0 rtl:left-0 top-0 w-48 h-36 flex items-center ltr:justify-end rtl:justify-start overflow-hidden pointer-events-none">
                  {/* <div className="absolute w-28 h-28 bg-[#EEF5FF] rounded-full ltr:translate-x-4 rtl:-translate-x-4 -translate-y-2" /> */}
                  <Image
                    src="/images/products_02.png"
                    alt="Travel Insurance"
                    width={160}
                    height={90}
                    className="relative z-10 w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="my-4 border-t border-slate-100" />

              <div className="flex items-center justify-between text-start">
                <div>
                  <div className="text-[11px] font-bold text-[#D97706]">{t("premium")}</div>
                  <div className="text-xs sm:text-sm font-bold text-[#1C2541] mt-0.5">{isAr ? "450 ر.س" : "SAR 450"}</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#D97706]">{t("expiryDate")}</div>
                  <div className="text-xs sm:text-sm font-bold text-[#1C2541] mt-0.5">{isAr ? "3 يوليو 2026" : "3 Jul 2026"}</div>
                </div>
                <Link
                  href="/user-portal/policies"
                  className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs flex items-center justify-center transition-colors group-hover:border-[#2563EB] group-hover:text-[#2563EB]"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          </div>

          {/* Active Card 3: Life */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group relative overflow-hidden">
            <div>
              <div className="flex items-start justify-between min-h-[125px] relative">
                <div className="space-y-1 z-10 max-w-[55%]">
                  <h3 className="font-bold text-base sm:text-lg text-[#1C2541] tracking-tight">{t("lifeInsurance")}</h3>
                  <p className="text-xs text-slate-400 font-mono font-normal">POL-LFE-2025-00201</p>
                  <div className="pt-1.5">
                    <span className="bg-[#DDF5E6] text-[#16A34A] text-xs font-bold px-2.5 py-0.5 rounded-md inline-block">
                      {t("activeStatus")}
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-400 block font-normal">{t("coverage")}</span>
                    <span className="text-xs sm:text-sm font-bold text-[#1C2541]">{isAr ? "500,000 ر.س" : "SAR 500,000"}</span>
                  </div>
                </div>

                <div className="absolute ltr:right-0 rtl:left-0 top-0 w-48 h-36 flex items-center ltr:justify-end rtl:justify-start overflow-hidden pointer-events-none">
                  {/* <div className="absolute w-28 h-28 bg-[#EEF5FF] rounded-full ltr:translate-x-4 rtl:-translate-x-4 -translate-y-2" /> */}
                  <Image
                    src="/images/products_03.png"
                    alt="Life Insurance"
                    width={160}
                    height={90}
                    className="relative z-10 w-full h-auto object-contain rounded-xl transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="my-4 border-t border-slate-100" />

              <div className="flex items-center justify-between text-start">
                <div>
                  <div className="text-[11px] font-bold text-[#D97706]">{t("premium")}</div>
                  <div className="text-xs sm:text-sm font-bold text-[#1C2541] mt-0.5">{isAr ? "780 ر.س" : "SAR 780"}</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#D97706]">{t("expiryDate")}</div>
                  <div className="text-xs sm:text-sm font-bold text-[#1C2541] mt-0.5">{isAr ? "18 يوليو 2026" : "18 Jul 2026"}</div>
                </div>
                <Link
                  href="/user-portal/policies"
                  className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs flex items-center justify-center transition-colors group-hover:border-[#2563EB] group-hover:text-[#2563EB]"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. RECENT CLAIMS SECTION (MATCHING DESIGN MOCK 2) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-[#1C2541]">{t("recentClaims")}</h2>
          <Link
            href="/user-portal/claims"
            className="text-xs sm:text-sm font-semibold text-[#2563EB] hover:text-[#1a1071] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{isAr ? "عرض جميع المطالبات" : "View all Claims"}</span>
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* Claim Card 1: Third Party Liability (Settled) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-base text-[#1C2541]">{t("thirdPartyLiabilityTitle")}</h3>
                <p className="text-xs text-slate-400 font-normal mt-0.5">{isAr ? "رقم المطالبة: CLM-2026-0041" : "Claim ID: CLM-2026-0041"}</p>
              </div>
              <span className="bg-[#22C55E] text-white text-xs font-bold px-3 py-1 rounded-md shrink-0">
                {t("settledStatus")}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-end text-xs font-bold text-[#22C55E]">
                <span>100%</span>
              </div>
              <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#22C55E] rounded-full w-full" />
              </div>
              <p className="text-xs text-[#16A34A] font-semibold pt-1">{t("settlementCompleted3Days")}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <Link
                href="/user-portal/claims"
                className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t("downloadLetterBtn")}</span>
              </Link>
              <span className="text-xs text-slate-400 font-medium">
                {isAr ? "إجمالي اتفاقية مستوى الخدمة: 5 أيام" : "Total SLA: 5 Days"}
              </span>
            </div>
          </div>

          {/* Claim Card 2: Comprehensive Motor Claim (Under Review) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-base text-[#1C2541]">{t("compMotorClaimTitle")}</h3>
                <p className="text-xs text-slate-400 font-normal mt-0.5">{isAr ? "رقم المطالبة: CLM-2026-0065" : "Claim ID: CLM-2026-0065"}</p>
              </div>
              <span className="bg-[#EA580C] text-white text-xs font-bold px-3 py-1 rounded-md shrink-0">
                {t("underReviewStatus")}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-end text-xs font-bold text-[#EA580C]">
                <span>60%</span>
              </div>
              <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#EA580C] rounded-full w-[60%]" />
              </div>
              <p className="text-xs text-slate-500 font-medium pt-1">{t("workshopStepText")}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <Link
                href="/user-portal/claims"
                className="text-xs font-bold text-[#2563EB] hover:underline"
              >
                {t("viewDetails")}
              </Link>
              <span className="text-xs text-slate-400 font-medium">
                {isAr ? "الإنجاز المتوقع خلال 15 يوماً (SLA)" : "Expected completion within 15 Days (SLA)"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. TRANSACTION HISTORY SECTION */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#1C2541]">{t("transactionHistoryTitle")}</h2>

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
