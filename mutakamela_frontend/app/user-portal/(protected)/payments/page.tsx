"use client";

import { Car, Shield, Plane } from "lucide-react";

export default function PaymentsRoutePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#1C2541]">Payments</h1>

      {/* Section 1: Upcoming Payments */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-[#1C2541]">Upcoming payments</h2>
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs divide-y divide-slate-100">
          <div className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-[#1C2541] truncate">Motor Insurance renewal</h3>
                <p className="text-xs text-[#EA580C] font-semibold mt-0.5">Due 24 Jul 2026</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-1 sm:pt-0 border-t border-slate-100 sm:border-t-0">
              <span className="text-sm sm:text-base font-semibold text-[#1C2541]">SAR 4,200</span>
              <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-sm">
                Pay Now
              </button>
            </div>
          </div>

          <div className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 sm:border-t-0">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-[#1C2541] truncate">Life Insurance – annual premium</h3>
                <p className="text-xs text-[#EA580C] font-semibold mt-0.5">Due 10 Aug 2026</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-1 sm:pt-0 border-t border-slate-100 sm:border-t-0">
              <span className="text-sm sm:text-base font-semibold text-[#1C2541]">SAR 1,800</span>
              <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-sm">
                Pay Now
              </button>
            </div>
          </div>

          <div className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 sm:border-t-0">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <Plane className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-[#1C2541] truncate">Travel Insurance Multi-Trip Plan</h3>
                <p className="text-xs text-[#EA580C] font-semibold mt-0.5">Due 03 Oct 2026</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-1 sm:pt-0 border-t border-slate-100 sm:border-t-0">
              <span className="text-sm sm:text-base font-semibold text-[#1C2541]">SAR 1,600</span>
              <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-sm">
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Transaction History */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs space-y-4">
        <h2 className="text-lg font-semibold text-[#1C2541]">Transaction history</h2>

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
