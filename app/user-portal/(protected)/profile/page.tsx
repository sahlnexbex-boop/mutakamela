"use client";

import { useState } from "react";
import { useCustomerAuth } from "@/lib/customer-auth-context";
import { useTranslation } from "react-i18next";
import {
  Lock,
  Key,
  Bell,
  MessageSquare,
  Mail,
  ShieldCheck,
  Pencil,
  CheckCircle2
} from "lucide-react";

export default function ProfileAndKYCRoutePage() {
  const { user } = useCustomerAuth();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [otpToggle, setOtpToggle] = useState(false);
  const [pushToggle, setPushToggle] = useState(true);
  const [smsToggle, setSmsToggle] = useState(false);
  const [whatsappToggle, setWhatsappToggle] = useState(false);
  const [emailToggle, setEmailToggle] = useState(false);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-row items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-[#1C2541]">{t("profileHeading")}</h1>
          <p className="text-[11px] sm:text-sm text-slate-500 font-medium mt-0.5">
            {t("manageIdentitySec")}
          </p>
        </div>
        <button className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-2xs transition-colors cursor-pointer shrink-0 flex items-center gap-1.5">
          <Pencil className="w-3.5 h-3.5 text-slate-600" />
          <span>{t("editProfile")}</span>
        </button>
      </div>

      {/* Top 2 Columns: Gradient Identity Card (Left) + Personal Info Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Identity Card (Left - MATCHING ATTACHED IMAGE 2) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between overflow-hidden">
          {/* Top Gradient Banner Box */}
          <div className="bg-gradient-to-r from-[#180E5E] via-[#201382] to-[#3429A8] p-6 text-white space-y-4 relative">
            <div className="flex items-center gap-4">
              {/* Large Letter Avatar 'A' */}
              <div className="w-14 h-14 rounded-full bg-white text-[#180E5E] font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-md">
                A
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">{user?.name || (isAr ? "أحمد" : "Ahmed")}</h2>
                <p className="text-xs text-indigo-200 font-normal">{isAr ? "الهوية الوطنية: 1098***12" : "National ID: 1098***12"}</p>

                {/* Verification Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="bg-white/20 text-white backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-cyan-300" />
                    <span>{t("ekycVerified")}</span>
                  </span>
                  <span className="bg-[#10B981] text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span>{t("nafathConnected")}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card White Details */}
          <div className="bg-white p-5 space-y-2 text-xs sm:text-sm text-slate-600 border-t border-slate-100 flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-normal">{t("registeredDate")}:</span>
              <span className="font-bold text-[#1C2541]">{isAr ? "15 يناير 2024" : "15 Jan 2024"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-normal">{t("customerId")}:</span>
              <span className="font-bold text-[#1C2541] font-mono">MIC-CUST-00418</span>
            </div>
          </div>
        </div>

        {/* Personal Information Table (Right - MATCHING ATTACHED IMAGE 2) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-[#1C2541]">{t("personalInfo")}</h2>

          <div className="divide-y divide-slate-100 text-xs sm:text-sm">
            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-400 font-normal">{t("fullName")}</span>
              <span className="font-bold text-[#1C2541]">{user?.name || (isAr ? "أحمد" : "Ahmed")}</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-400 font-normal">{t("mobile")}</span>
              <span className="font-bold text-[#1C2541]">{isAr ? "9665-1001+" : "+966 5- 1001"}</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-400 font-normal">{t("email")}</span>
              <span className="font-bold text-[#1C2541]">{isAr ? "ahmed@-.com" : "ahmed@-.com"}</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-400 font-normal">{t("nationality")}</span>
              <span className="font-bold text-[#1C2541]">{t("saudiArabia")}</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-400 font-normal">{t("preferredLanguage")}</span>
              <span className="font-bold text-[#1C2541]">{isAr ? t("arabicLang") : t("englishLang")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Authentication Section (MATCHING ATTACHED IMAGE 2) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-[#1C2541]">{t("securityAuthentication")}</h2>

        <div className="divide-y divide-slate-100 space-y-2">
          {/* OTP for transactions */}
          <div className="pt-2 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-[#1C2541]">{t("otpForTransactions")}</h3>
                <p className="text-xs text-slate-400 font-normal mt-0.5">{t("requiredForAllPayments")}</p>
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

          {/* App PIN (6-digit fallback access) */}
          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-[#1C2541]">{t("appPin")}</h3>
                <p className="text-xs text-slate-400 font-normal mt-0.5">{isAr ? "وصول احتياطي من 6 أرقام" : "6-digit fallback access"}</p>
              </div>
            </div>

            <button className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs shadow-2xs transition-colors cursor-pointer">
              {t("changePin")}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Preferences Section (MATCHING ATTACHED IMAGE 2) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-[#1C2541]">{isAr ? "تفضيلات الإشعارات" : "Notification preferences"}</h2>

        <div className="divide-y divide-slate-100 space-y-2">
          {/* Push Notifications */}
          <div className="pt-2 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs sm:text-sm text-[#1C2541]">{isAr ? "الإشعارات المنبثقة" : "Push notifications"}</span>
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
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs sm:text-sm text-[#1C2541]">{isAr ? "إشعارات SMS" : "SMS notifications"}</span>
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
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-[#25D366]" />
              </div>
              <span className="font-bold text-xs sm:text-sm text-[#1C2541]">{isAr ? "إشعارات الواتساب" : "WhatsApp notifications"}</span>
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
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs sm:text-sm text-[#1C2541]">{isAr ? "إشعارات البريد الإلكتروني" : "Email notifications"}</span>
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

      {/* Bottom Nafath Verified Banner (MATCHING ATTACHED IMAGE 2) */}
      <div className="bg-[#EAFBF1] border border-emerald-200/70 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-white border border-emerald-300 text-[#10B981] flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-6 h-6 text-[#10B981]" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-emerald-900">Identity fully verified via Nafath</h3>
            <p className="text-xs text-emerald-700 font-normal mt-0.5">
              Your eKYC is complete and up to date. No further action needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
