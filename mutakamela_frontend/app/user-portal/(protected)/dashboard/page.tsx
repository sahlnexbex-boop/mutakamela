"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Plus,
  ChevronRight,
  Car,
  Plane,
  Shield,
  Download
} from "lucide-react";

export default function UserPortalDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* 1. TOP WELCOME BANNER BOX (Compact Padding & 2-Column Mobile Stat Cards Grid) */}
      <div className="relative rounded-3xl overflow-hidden p-4 sm:p-8 min-h-[300px] flex flex-col justify-between group">
        {/* Background Skyscraper Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('/images/dashboard_box.png')` }}
        />
        {/* Subtle 10% Light White Layer */}
        <div className="absolute inset-0 bg-white/10 pointer-events-none" />

        {/* Top Header Row with Dark Navy Text & Same-Row Action Button */}
        <div className="relative z-10 flex flex-row items-center justify-between gap-2">
          <div>
            <h1 className="text-lg sm:text-3xl lg:text-4xl font-semibold text-[#1C2541] tracking-tight">
              Good Morning, {user?.name || "Ahmed"} 👋
            </h1>
            <p className="text-[11px] sm:text-sm text-slate-700 mt-0.5 font-normal">
              Wednesday, 10 June 2026 · Riyadh, KSA
            </p>
          </div>

          <Link
            href="/user-portal/buy"
            className="inline-flex items-center gap-1.5 bg-[#1E65FF] hover:bg-blue-700 text-white font-semibold px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-3" />
            <span className="sm:hidden">New</span>
            <span className="hidden sm:inline">Add New policy</span>
          </Link>
        </div>

        {/* 4 Stat Cards: 2 Columns Per Row on Mobile Screens */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          {/* Card 1: Active Policies */}
          <Link
            href="/user-portal/policies"
            className="relative overflow-hidden bg-gradient-to-br from-[#FF6565]/85 via-[#FF7575]/80 to-[#FF8575]/85 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 text-white shadow-md transition-all hover:-translate-y-0.5 border border-white/20 cursor-pointer"
          >
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/20 rounded-full blur-lg pointer-events-none" />
            <div className="relative z-10 space-y-0.5 sm:space-y-1">
              <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">6</div>
              <div className="text-xs sm:text-sm font-semibold text-white pt-1">Active Policies</div>
              <div className="text-[10px] sm:text-[11px] text-white/90 font-normal truncate">Motor renewal due in 14d</div>
            </div>
          </Link>

          {/* Card 2: Open Claims */}
          <Link
            href="/user-portal/claims"
            className="relative overflow-hidden bg-gradient-to-br from-[#7C6AF7]/85 via-[#8C7BF9]/80 to-[#9D8EFA]/85 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 text-white shadow-md transition-all hover:-translate-y-0.5 border border-white/20 cursor-pointer"
          >
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/20 rounded-full blur-lg pointer-events-none" />
            <div className="relative z-10 space-y-0.5 sm:space-y-1">
              <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">2</div>
              <div className="text-xs sm:text-sm font-semibold text-white pt-1">Open Claims</div>
              <div className="text-[10px] sm:text-[11px] text-white/90 font-normal truncate">1 under review · 1 approved</div>
            </div>
          </Link>

          {/* Card 3: Next Payment */}
          <Link
            href="/user-portal/payments"
            className="relative overflow-hidden bg-gradient-to-br from-[#26B2C8]/85 via-[#2FBDD3]/80 to-[#3AC9DE]/85 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 text-white shadow-md transition-all hover:-translate-y-0.5 border border-white/20 cursor-pointer"
          >
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/20 rounded-full blur-lg pointer-events-none" />
            <div className="relative z-10 space-y-0.5 sm:space-y-1">
              <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">SAR 1,240</div>
              <div className="text-xs sm:text-sm font-semibold text-white pt-1">Next Payment</div>
              <div className="text-[10px] sm:text-[11px] text-white/90 font-normal truncate">Due in 7 days</div>
            </div>
          </Link>

          {/* Card 4: CSAT Score */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#626DF6]/85 via-[#717CFA]/80 to-[#828CFB]/85 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 text-white shadow-md border border-white/20">
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/20 rounded-full blur-lg pointer-events-none" />
            <div className="relative z-10 space-y-0.5 sm:space-y-1">
              <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">4.8 / 5</div>
              <div className="text-xs sm:text-sm font-semibold text-white pt-1">CSAT Score</div>
              <div className="text-[10px] sm:text-[11px] text-white/90 font-normal truncate">Last claim rated</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. POLICIES ABOUT TO RENEW SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-[#1C2541]">Policies About to Renew</h2>
          <Link
            href="/user-portal/renewals"
            className="text-xs sm:text-sm font-lighter text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View all</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#FFF5F5] rounded-3xl p-5 border border-rose-100 flex flex-col justify-between shadow-xs hover:shadow-md transition-all cursor-pointer">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <span className="bg-rose-100 text-rose-700 text-[11px] font-semibold px-3 py-1 rounded-full">
                  7 days left
                </span>
              </div>
              <h3 className="font-sembold text-sm text-[#1C2541]">Motor Insurance</h3>
              <p className="text-xs text-[#8C94A6] font-mono font-normal">POL-MTR-2024-00881</p>
              <p className="text-xs text-slate-500 font-normal mt-3">Exp: 25 Jun 2026</p>
            </div>
            <Link
              href="/user-portal/renewals"
              className="mt-5 w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-xs text-center shadow-md transition-colors block"
            >
              Renew now
            </Link>
          </div>

          <div className="bg-[#FFF8F0] rounded-3xl p-5 border border-orange-100 flex flex-col justify-between shadow-xs hover:shadow-md transition-all cursor-pointer">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Plane className="w-5 h-5" />
                </div>
                <span className="bg-orange-100 text-orange-700 text-[11px] font-semibold px-3 py-1 rounded-full">
                  15 days left
                </span>
              </div>
              <h3 className="font-semibold text-sm text-[#1C2541]">Travel Insurance</h3>
              <p className="text-xs text-[#8C94A6] font-mono font-normal">POL-TRV-2025-00234</p>
              <p className="text-xs text-slate-500 font-normal mt-3">Exp: 3 Jul 2026</p>
            </div>
            <Link
              href="/user-portal/renewals"
              className="mt-5 w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-xs text-center shadow-md transition-colors block"
            >
              Renew now
            </Link>
          </div>

          <div className="bg-[#F0F7FF] rounded-3xl p-5 border border-blue-100 flex flex-col justify-between shadow-xs hover:shadow-md transition-all cursor-pointer">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="bg-blue-100 text-blue-700 text-[11px] font-semibold px-3 py-1 rounded-full">
                  30 days left
                </span>
              </div>
              <h3 className="font-semibold text-sm text-[#1C2541]">Life Insurance</h3>
              <p className="text-xs text-[#8C94A6] font-mono font-normal">POL-LFE-2025-00201</p>
              <p className="text-xs text-slate-500 font-normal mt-3">Exp: 18 Jul 2026</p>
            </div>
            <Link
              href="/user-portal/renewals"
              className="mt-5 w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-xs text-center shadow-md transition-colors block"
            >
              Renew now
            </Link>
          </div>
        </div>
      </div>

      {/* 3. YOUR ACTIVE POLICIES SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-[#1C2541]">Your Active Policies</h2>
          <Link
            href="/user-portal/policies"
            className="text-xs sm:text-sm font-lighter text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View all</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Active Card 1: Motor */}
          <div className="bg-[#EEF5FF] rounded-3xl p-5 sm:p-6 border border-[#DAE8FB] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group">
            <div>
              <div className="flex items-start justify-between min-h-[105px] relative">
                <div className="space-y-1 z-10 max-w-[55%]">
                  <h3 className="font-semibold text-base sm:text-lg text-[#1C2541] tracking-tight">Motor Insurance</h3>
                  <p className="text-xs text-[#8C94A6] font-normal">POL-MTR-2024-00881</p>
                  <div className="pt-2">
                    <span className="bg-[#DDF5E6] text-[#16A34A] text-xs font-semibold px-2.5 py-1 rounded-md inline-block">
                      Active
                    </span>
                  </div>
                </div>

                <div className="absolute right-0 top-0 w-36 h-28 flex items-center justify-end overflow-hidden">
                  <div className="absolute w-28 h-28 bg-[#D8E6FA] rounded-full translate-x-4 -translate-y-2 opacity-80" />
                  <Image
                    src="/images/products_01.png"
                    alt="Motor Insurance"
                    width={160}
                    height={90}
                    className="relative z-10 w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="my-4 border-t border-[#D0E1F9]" />

              <div className="grid grid-cols-3 gap-2 text-left">
                <div>
                  <div className="text-xs font-normal text-[#64748B]">Coverage</div>
                  <div className="text-xs sm:text-sm font-bold text-[#1C2541] mt-0.5">SAR 100,000</div>
                </div>
                <div>
                  <div className="text-xs font-normal text-[#64748B]">Premium</div>
                  <div className="text-xs sm:text-sm font-bold text-[#1C2541] mt-0.5">SAR 1,240</div>
                </div>
                <div>
                  <div className="text-xs font-normal text-[#64748B]">Expiry Date</div>
                  <div className="text-xs sm:text-sm font-bold text-[#1C2541] mt-0.5">25 Jun 2026</div>
                </div>
              </div>
            </div>

            <Link
              href="/user-portal/policies"
              className="mt-5 w-full border border-[#1C2541] hover:bg-white/80 text-[#1C2541] font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm text-center block transition-all shadow-2xs"
            >
              View Details
            </Link>
          </div>

          {/* Active Card 2: Travel */}
          <div className="bg-[#EEF5FF] rounded-3xl p-5 sm:p-6 border border-[#DAE8FB] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group">
            <div>
              <div className="flex items-start justify-between min-h-[105px] relative">
                <div className="space-y-1 z-10 max-w-[55%]">
                  <h3 className="font-semibold text-base sm:text-lg text-[#1C2541] tracking-tight">Travel Insurance</h3>
                  <p className="text-xs text-[#8C94A6] font-normal">POL-TRV-2025-00234</p>
                  <div className="pt-2">
                    <span className="bg-[#DDF5E6] text-[#16A34A] text-xs font-semibold px-2.5 py-1 rounded-md inline-block">
                      Active
                    </span>
                  </div>
                </div>

                <div className="absolute right-0 top-0 w-36 h-28 flex items-center justify-end overflow-hidden">
                  <div className="absolute w-28 h-28 bg-[#D8E6FA] rounded-full translate-x-4 -translate-y-2 opacity-80" />
                  <Image
                    src="/images/products_02.png"
                    alt="Travel Insurance"
                    width={160}
                    height={90}
                    className="relative z-10 w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="my-4 border-t border-[#D0E1F9]" />

              <div className="grid grid-cols-3 gap-2 text-left">
                <div>
                  <div className="text-xs font-normal text-[#64748B]">Coverage</div>
                  <div className="text-xs sm:text-sm font-bold text-[#1C2541] mt-0.5">Worldwide</div>
                </div>
                <div>
                  <div className="text-xs font-normal text-[#64748B]">Premium</div>
                  <div className="text-xs sm:text-sm font-bold text-[#1C2541] mt-0.5">SAR 450</div>
                </div>
                <div>
                  <div className="text-xs font-normal text-[#64748B]">Expiry Date</div>
                  <div className="text-xs sm:text-sm font-bold text-[#1C2541] mt-0.5">3 Jul 2026</div>
                </div>
              </div>
            </div>

            <Link
              href="/user-portal/policies"
              className="mt-5 w-full border border-[#1C2541] hover:bg-white/80 text-[#1C2541] font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm text-center block transition-all shadow-2xs"
            >
              View Details
            </Link>
          </div>

          {/* Active Card 3: Life */}
          <div className="bg-[#EEF5FF] rounded-3xl p-5 sm:p-6 border border-[#DAE8FB] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group">
            <div>
              <div className="flex items-start justify-between min-h-[105px] relative">
                <div className="space-y-1 z-10 max-w-[55%]">
                  <h3 className="font-semibold text-base sm:text-lg text-[#1C2541] tracking-tight">Life Insurance</h3>
                  <p className="text-xs text-[#8C94A6] font-normal">POL-LFE-2025-00201</p>
                  <div className="pt-2">
                    <span className="bg-[#DDF5E6] text-[#16A34A] text-xs font-semibold px-2.5 py-1 rounded-md inline-block">
                      Active
                    </span>
                  </div>
                </div>

                <div className="absolute right-0 top-0 w-36 h-28 flex items-center justify-end overflow-hidden">
                  <div className="absolute w-28 h-28 bg-[#D8E6FA] rounded-full translate-x-4 -translate-y-2 opacity-80" />
                  <Image
                    src="/images/products_03.png"
                    alt="Life Insurance"
                    width={160}
                    height={90}
                    className="relative z-10 w-full h-auto object-contain rounded-xl transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="my-4 border-t border-[#D0E1F9]" />

              <div className="grid grid-cols-3 gap-2 text-left">
                <div>
                  <div className="text-xs font-normal text-[#64748B]">Coverage</div>
                  <div className="text-xs sm:text-sm font-bold text-[#1C2541] mt-0.5">SAR 500,000</div>
                </div>
                <div>
                  <div className="text-xs font-normal text-[#64748B]">Premium</div>
                  <div className="text-xs sm:text-sm font-bold text-[#1C2541] mt-0.5">SAR 780</div>
                </div>
                <div>
                  <div className="text-xs font-normal text-[#64748B]">Expiry Date</div>
                  <div className="text-xs sm:text-sm font-bold text-[#1C2541] mt-0.5">18 Jul 2026</div>
                </div>
              </div>
            </div>

            <Link
              href="/user-portal/policies"
              className="mt-5 w-full border border-[#1C2541] hover:bg-white/80 text-[#1C2541] font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm text-center block transition-all shadow-2xs"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>

      {/* 4. RECENT CLAIMS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-[#1C2541]">Recent Claims</h2>
          <Link
            href="/user-portal/claims"
            className="text-xs sm:text-sm font-lighter text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View all</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* Claim Card 1: Third Party Liability (Settled) */}
          <Link
            href="/user-portal/claims"
            className="bg-[#F0FDF4] rounded-3xl p-5 sm:p-6 border border-[#DCFCE7] shadow-xs flex flex-col justify-between space-y-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-base text-[#1C2541]">Third Party Liability (TPL)</h3>
                <p className="text-xs text-[#8C94A6] font-normal mt-0.5">Claim ID: CLM-2026-0041</p>
              </div>
              <span className="bg-[#DCFCE7] text-[#16A34A] text-xs font-semibold px-2.5 py-1 rounded-md shrink-0">
                Settled
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-end text-xs font-semibold text-[#16A34A]">
                <span>100%</span>
              </div>
              <div className="w-full h-2 bg-emerald-200/60 rounded-full overflow-hidden">
                <div className="h-full bg-[#16A34A] rounded-full w-full" />
              </div>
              <p className="text-xs text-[#16A34A] font-semibold pt-1">Settlement completed within 3 days</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-emerald-100/60">
              <div className="border border-[#1C2541] bg-transparent hover:bg-white text-[#1C2541] font-semibold px-4 py-2 sm:py-1.5 rounded-xl text-xs text-center transition-colors shadow-2xs whitespace-nowrap shrink-0">
                Download letter
              </div>
              <span className="text-xs text-[#64748B] font-normal">
                Total SLA: <strong className="font-semibold text-[#1C2541]">5 Days</strong>
              </span>
            </div>
          </Link>

          {/* Claim Card 2: Comprehensive Motor Claim (Under Review) */}
          <Link
            href="/user-portal/claims"
            className="bg-[#FFF6F4] rounded-3xl p-5 sm:p-6 border border-[#FFEDD5] shadow-xs flex flex-col justify-between space-y-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-base text-[#1C2541]">Comprehensive Motor Claim</h3>
                <p className="text-xs text-[#8C94A6] font-normal mt-0.5">Claim ID: CLM-2026-0065</p>
              </div>
              <span className="bg-[#FFEDD5] text-[#EA580C] text-xs font-semibold px-2.5 py-1 rounded-md shrink-0">
                Under Review
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-end text-xs font-semibold text-[#EA580C]">
                <span>60%</span>
              </div>
              <div className="w-full h-2 bg-orange-200/60 rounded-full overflow-hidden">
                <div className="h-full bg-[#EA580C] rounded-full w-[60%]" />
              </div>
              <p className="text-xs text-[#64748B] font-normal pt-1">Step 3 of 5 Workshop assessment in progress</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-orange-100/60">
              <div className="border border-[#1C2541] bg-transparent hover:bg-white text-[#1C2541] font-semibold px-4 py-2 sm:py-1.5 rounded-xl text-xs text-center transition-colors shadow-2xs whitespace-nowrap shrink-0">
                View Details
              </div>
              <span className="text-xs text-[#64748B] font-normal">
                Expected completion within <strong className="font-semibold text-[#1C2541]">15 Days (SLA)</strong>
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* 5. TRANSACTION HISTORY SECTION */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-[#1C2541]">Transaction history</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-1.5 min-w-[600px]">
            <thead>
              <tr className="bg-[#EFEFEF] text-xs sm:text-sm font-semibold text-[#1C2541]">
                <th className="py-3 px-4 rounded-l-xl">Date</th>
                <th className="py-3 px-4">Policy</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm font-normal text-slate-700">
              <tr className="hover:bg-slate-50/70 transition-colors cursor-pointer">
                <td className="py-3.5 px-4 font-semibold text-[#1C2541]">10 Mar 2026</td>
                <td className="py-3.5 px-4 font-medium text-slate-800">Life Insurance</td>
                <td className="py-3.5 px-4 text-[#64748B]">Annual premium</td>
                <td className="py-3.5 px-4 font-semibold text-[#1C2541]">SAR 1,800</td>
                <td className="py-3.5 px-4">
                  <span className="bg-white border border-[#22C55E] text-[#16A34A] font-semibold text-xs px-3 py-0.5 rounded-md inline-block">
                    Paid
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/70 transition-colors cursor-pointer">
                <td className="py-3.5 px-4 font-semibold text-[#1C2541]">15 Jan 2026</td>
                <td className="py-3.5 px-4 font-medium text-slate-800">Travel Insurance</td>
                <td className="py-3.5 px-4 text-[#64748B]">Annual multi-trip</td>
                <td className="py-3.5 px-4 font-semibold text-[#1C2541]">SAR 980</td>
                <td className="py-3.5 px-4">
                  <span className="bg-white border border-[#22C55E] text-[#16A34A] font-semibold text-xs px-3 py-0.5 rounded-md inline-block">
                    Paid
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/70 transition-colors cursor-pointer">
                <td className="py-3.5 px-4 font-semibold text-[#1C2541]">24 Jun 2025</td>
                <td className="py-3.5 px-4 font-medium text-slate-800">Motor Insurance</td>
                <td className="py-3.5 px-4 text-[#64748B]">Renewal premium</td>
                <td className="py-3.5 px-4 font-semibold text-[#1C2541]">SAR 4,200</td>
                <td className="py-3.5 px-4">
                  <span className="bg-white border border-[#22C55E] text-[#16A34A] font-semibold text-xs px-3 py-0.5 rounded-md inline-block">
                    Paid
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/70 transition-colors cursor-pointer">
                <td className="py-3.5 px-4 font-semibold text-[#1C2541]">22 Jun 2025</td>
                <td className="py-3.5 px-4 font-medium text-slate-800">Life Insurance</td>
                <td className="py-3.5 px-4 text-[#64748B]">Annual premium</td>
                <td className="py-3.5 px-4 font-semibold text-[#1C2541]">SAR 1,300</td>
                <td className="py-3.5 px-4">
                  <span className="bg-white border border-[#22C55E] text-[#16A34A] font-semibold text-xs px-3 py-0.5 rounded-md inline-block">
                    Paid
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
