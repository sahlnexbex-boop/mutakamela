"use client";

import Link from "next/link";
import { Clock } from "lucide-react";

export default function RenewalsRoutePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#1C2541]">Renewals</h1>
        <p className="text-xs sm:text-sm text-[#8C94A6] font-normal mt-1">1 policy requiring attention</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-[#1C2541]">Motor Insurance – Comprehensive</h2>
            <p className="text-xs sm:text-sm text-[#8C94A6] font-normal mt-0.5">
              POL-MTR-2024-00881 · Toyota Camry 2022 · Expires 24 Jun 2026
            </p>
          </div>
          <span className="bg-[#FFEDD5] text-[#EA580C] text-xs font-semibold px-3 py-1 rounded-md flex items-center gap-1.5 self-start">
            <Clock className="w-3.5 h-3.5" />
            <span>Expires in 14 days</span>
          </span>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="flex justify-between text-xs text-[#64748B]">
            <span>Policy period</span>
            <span className="font-semibold text-[#EA580C]">14 days remaining</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#EA580C] rounded-full w-[85%]" />
          </div>
          <div className="flex justify-between text-[11px] text-[#8C94A6]">
            <span>24 Jun 2025</span>
            <span>24 Jun 2026</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100 text-xs sm:text-sm">
          <div>
            <span className="text-[#8C94A6] text-xs block">Vehicle</span>
            <strong className="font-semibold text-[#1C2541]">Toyota Camry 2022</strong>
          </div>
          <div>
            <span className="text-[#8C94A6] text-xs block">Coverage type</span>
            <strong className="font-semibold text-[#1C2541]">Comprehensive</strong>
          </div>
          <div>
            <span className="text-[#8C94A6] text-xs block">Renewal premium</span>
            <strong className="font-semibold text-[#2563EB]">SAR 4,200</strong>
          </div>
          <div>
            <span className="text-[#8C94A6] text-xs block">Expiry date</span>
            <strong className="font-semibold text-[#1C2541]">24 Jun 2026</strong>
          </div>
          <div>
            <span className="text-[#8C94A6] text-xs block">Policy number</span>
            <strong className="font-semibold text-[#1C2541]">POL-MTR-2024-00881</strong>
          </div>
          <div>
            <span className="text-[#8C94A6] text-xs block">vs last year</span>
            <strong className="font-semibold text-[#16A34A]">- Same price</strong>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
          <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl text-xs sm:text-sm cursor-pointer shadow-md transition-colors">
            Renew now – SAR 4,200
          </button>
          <Link
            href="/user-portal/policies"
            className="border border-[#1C2541] hover:bg-slate-50 text-[#1C2541] font-semibold px-5 py-3 rounded-xl text-xs sm:text-sm cursor-pointer shadow-2xs transition-colors block"
          >
            View policy details
          </Link>
        </div>
      </div>
    </div>
  );
}
