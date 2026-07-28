"use client";

import Image from "next/image";
import { useState } from "react";
import { useAuth } from "../../../../lib/auth-context";
import {
  UserCheck,
  Lock,
  Key,
  Bell,
  MessageSquare,
  Mail,
  ShieldCheck,
  Pencil
} from "lucide-react";

export default function ProfileAndKYCRoutePage() {
  const { user } = useAuth();

  const [otpToggle, setOtpToggle] = useState(true);
  const [pushToggle, setPushToggle] = useState(true);
  const [smsToggle, setSmsToggle] = useState(false);
  const [whatsappToggle, setWhatsappToggle] = useState(false);
  const [emailToggle, setEmailToggle] = useState(false);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page Header (Same Top Row on Mobile Screens) */}
      <div className="flex flex-row items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-3xl font-semibold text-[#1C2541]">Profile & KYC</h1>
          <p className="text-[11px] sm:text-sm text-[#8C94A6] font-normal mt-0.5">
            Manage your identity, security, and preferences
          </p>
        </div>
        <button className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm shadow-2xs transition-colors cursor-pointer shrink-0 flex items-center gap-1.5">
          <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
          <span className="hidden sm:inline">Edit Profile</span>
        </button>
      </div>

      {/* Top 2 Columns: Identity Card + Personal Info Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Identity Card (Left) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden relative border border-slate-200 shrink-0 bg-slate-100 shadow-sm">
              <Image
                src="/images/user_02.png"
                alt={user?.name || "Ahmed"}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-[#1C2541]">{user?.name || "Ahmed"}</h2>
              <p className="text-xs text-[#8C94A6] font-normal">National ID: 1098****12</p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                  eKYC Verified
                </span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                  Nafath Connected
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-[#8C94A6] font-normal">Registered:</span>
              <span className="font-semibold text-[#1C2541]">15 Jan 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8C94A6] font-normal">Customer ID:</span>
              <span className="font-semibold text-[#1C2541]">MIC-CUST-00418</span>
            </div>
          </div>
        </div>

        {/* Personal Information Grid (Right) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-[#1C2541]">Personal information</h2>

          <div className="divide-y divide-slate-100 text-xs sm:text-sm">
            <div className="py-3 flex justify-between items-center">
              <span className="text-[#8C94A6] font-normal">Full name</span>
              <span className="font-semibold text-[#1C2541]">{user?.name || "Ahmed"}</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-[#8C94A6] font-normal">Mobile</span>
              <span className="font-semibold text-[#1C2541]">+966 5****1001</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-[#8C94A6] font-normal">Email</span>
              <span className="font-semibold text-[#1C2541]">{user?.email || "ahmed@****.com"}</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-[#8C94A6] font-normal">Nationality</span>
              <span className="font-semibold text-[#1C2541]">Saudi Arabia</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-[#8C94A6] font-normal">Preferred language</span>
              <span className="font-semibold text-[#1C2541]">English</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Authentication Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-[#1C2541]">Security & authentication</h2>

        <div className="divide-y divide-slate-100 space-y-2">
          <div className="pt-2 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-xs sm:text-sm text-[#1C2541]">OTP for transactions</h3>
                <p className="text-xs text-[#8C94A6] font-normal mt-0.5">Required for all payments</p>
              </div>
            </div>

            <button
              onClick={() => setOtpToggle(!otpToggle)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                otpToggle ? "bg-[#10B981]" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 left-0.5 ${
                  otpToggle ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-xs sm:text-sm text-[#1C2541]">App PIN</h3>
                <p className="text-xs text-[#8C94A6] font-normal mt-0.5">6-digit fallback access</p>
              </div>
            </div>

            <button className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs shadow-2xs transition-colors cursor-pointer">
              Change PIN
            </button>
          </div>
        </div>
      </div>

      {/* Notification Preferences Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-[#1C2541]">Notification preferences</h2>

        <div className="divide-y divide-slate-100 space-y-2">
          {/* Push Notifications */}
          <div className="pt-2 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <span className="font-semibold text-xs sm:text-sm text-[#1C2541]">Push notifications</span>
            </div>
            <button
              onClick={() => setPushToggle(!pushToggle)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                pushToggle ? "bg-[#10B981]" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 left-0.5 ${
                  pushToggle ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* SMS Notifications */}
          <div className="pt-3 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="font-semibold text-xs sm:text-sm text-[#1C2541]">SMS notifications</span>
            </div>
            <button
              onClick={() => setSmsToggle(!smsToggle)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                smsToggle ? "bg-[#10B981]" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 left-0.5 ${
                  smsToggle ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* WhatsApp Notifications */}
          <div className="pt-3 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="font-semibold text-xs sm:text-sm text-[#1C2541]">WhatsApp notifications</span>
            </div>
            <button
              onClick={() => setWhatsappToggle(!whatsappToggle)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                whatsappToggle ? "bg-[#10B981]" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 left-0.5 ${
                  whatsappToggle ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Email Notifications */}
          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <span className="font-semibold text-xs sm:text-sm text-[#1C2541]">Email notifications</span>
            </div>
            <button
              onClick={() => setEmailToggle(!emailToggle)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                emailToggle ? "bg-[#10B981]" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 left-0.5 ${
                  emailToggle ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Nafath Verified Banner (Matching Image 2 Model) */}
      <div className="bg-[#E2F7E5] border border-[#A7F3D0] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-emerald-900">Identity fully verified via Nafath</h3>
            <p className="text-xs text-emerald-700 font-normal mt-0.5">
              Your eKYC is complete and up to date. No further action needed.
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-emerald-800 self-end sm:self-auto whitespace-nowrap">
          Verified 10 Jun 2026
        </span>
      </div>
    </div>
  );
}
