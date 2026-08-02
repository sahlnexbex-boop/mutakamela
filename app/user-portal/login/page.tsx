"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCustomerAuth } from "@/lib/customer-auth-context";
import I18nProvider from "@/components/i18n-provider";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Lock, CheckCircle2, Globe, ArrowLeft } from "lucide-react";

export default function UserPortalLoginPage() {
  return (
    <I18nProvider>
      <LoginContent />
    </I18nProvider>
  );
}

function LoginContent() {
  const router = useRouter();
  const { login } = useCustomerAuth();
  const { i18n } = useTranslation();

  // Current language state ("en" | "ar")
  const currentLang = i18n.language === "ar" ? "ar" : "en";

  const toggleLanguage = () => {
    const nextLang = currentLang === "en" ? "ar" : "en";
    i18n.changeLanguage(nextLang);
    document.documentElement.dir = nextLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = nextLang;
  };

  // Translations dictionary for Login page
  const t = (key: string): string => {
    const dict: Record<string, { en: string; ar: string }> = {
      backToWebsite: { en: "Back to website", ar: "العودة إلى الموقع الرئيسي" },
      heroTitle: { en: "Your insurance, one secure sign-in away.", ar: "تأمينك على بُعد تسجيل دخول آمن واحد." },
      heroSub: {
        en: "Manage policies, file claims, and track approvals — protected by Saudi national digital identity.",
        ar: "إدارة وثائقك، تقديم المطالبات، ومتابعة الموافقات — بمواصفات الهوية الرقمية الوطنية السعودية."
      },
      iaRegulated: { en: "IA-regulated", ar: "خاضع لتنظيم هيئة التأمين" },
      encryption: { en: "256-bit encryption", ar: "تشفير 256 بت" },
      nafathVerifiedBadge: { en: "Nafath verified", ar: "موثق عبر نفاذ" },
      signIn: { en: "Sign in", ar: "تسجيل الدخول" },
      signInSubtitle: { en: "Access your Mutakamela customer portal", ar: "الوصول إلى بوابة عملاء متكاملة" },
      nafathTab: { en: "Nafath (National ID)", ar: "نفاذ (الهوية الوطنية)" },
      emailTab: { en: "Email & Password", ar: "البريد الإلكتروني وكلمة المرور" },
      nationalIdLabel: { en: "National ID / Iqama number", ar: "رقم الهوية الوطنية / الإقامة" },
      nationalIdPlaceholder: { en: "1XXXXXXXXX", ar: "١XXXXXXXXX" },
      nationalIdHelper: {
        en: "10 digits, starting with 1 (Saudi) or 2 (Iqama)",
        ar: "١٠ أرقام تبدأ بـ ١ (سعودي) أو ٢ (مقيم)"
      },
      continueNafath: { en: "Continue with Nafath", ar: "المتابعة عبر نفاذ" },
      orText: { en: "or", ar: "أو" },
      useEmailInstead: {
        en: "User email and password instead",
        ar: "استخدام البريد الإلكتروني وكلمة المرور بدلاً من ذلك"
      },
      emailLabel: { en: "Email address", ar: "عنوان البريد الإلكتروني" },
      emailPlaceholder: { en: "name@example.com", ar: "name@example.com" },
      passwordLabel: { en: "Password", ar: "كلمة المرور" },
      rememberMe: { en: "Remember me", ar: "تذكرني" },
      forgotPassword: { en: "Forgot password?", ar: "نسيت كلمة المرور؟" },
      waitingNafath: { en: "Waiting for Nafath approval", ar: "بانتظار الموافقة من تطبيق نفاذ" },
      nafathInstruction: {
        en: "Open the Nafath app on your phone and tap the number shown above to approve this sign-in.",
        ar: "افتح تطبيق نفاذ على هاتفك واضغط على الرقم الظاهر أعلاه للموافقة على تسجيل الدخول."
      },
      requestExpires: { en: "Request expires in", ar: "تنتهي صلاحية الطلب خلال" },
      cancelGoBack: { en: "Cancel and go back", ar: "إلغاء والعودة" },
      identityVerified: { en: "Identity verified", ar: "تم التحقق من الهوية بنجاح" },
      identityVerifiedDesc: {
        en: "You've been securely authenticated through Nafath. Redirecting to your dashboard...",
        ar: "تم توثيق دخولك بنجاح عبر نفاذ. جاري توجيهك إلى لوحة التحكم..."
      },
      goToDashboard: { en: "Go to dashboard", ar: "الانتقال إلى لوحة التحكم" },
      termsNotice: {
        en: "By signing in you agree to the Terms of Use and Privacy Policy. Sessions auto-expire after 15 minutes of inactivity.",
        ar: "بتسجيل الدخول أنت توافق على شروط الاستخدام وسياسة الخصوصية. تنتهي الجلسة تلقائياً بعد 15 دقيقة من عدم النشاط."
      }
    };
    return dict[key]?.[currentLang] || dict[key]?.en || key;
  };

  // Step state: "nafath" (1) | "email" (2) | "nafath_pending" (3) | "nafath_verified" (4)
  const [step, setStep] = useState<"nafath" | "email" | "nafath_pending" | "nafath_verified">("nafath");

  // Form states
  const [nationalId, setNationalId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Countdown timer for Nafath pending step
  const [timer, setTimer] = useState(27);

  useEffect(() => {
    let interval: any = null;
    if (step === "nafath_pending") {
      setTimer(27);
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Auto-advance to verified step after 3.5s simulation
      const autoAdvance = setTimeout(() => {
        setStep("nafath_verified");
      }, 3500);

      return () => {
        clearInterval(interval);
        clearTimeout(autoAdvance);
      };
    }
  }, [step]);

  // Handle direct navigation to dashboard on verified step
  useEffect(() => {
    if (step === "nafath_verified") {
      const redirectTimer = setTimeout(() => {
        login(nationalId || email || "1029384756");
        router.push("/user-portal/dashboard");
      }, 2500);
      return () => clearTimeout(redirectTimer);
    }
  }, [step, login, router, nationalId, email]);

  const handleNafathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("nafath_pending");
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Static credentials allow fast log in
    login(email || "ahmed@mutakamela.sa");
    router.push("/user-portal/dashboard");
  };

  const handleManualGoToDashboard = () => {
    login(nationalId || email || "1029384756");
    router.push("/user-portal/dashboard");
  };

  return (
    <div
      dir={currentLang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-[#1b1173] lg:bg-[#F8F9FE] text-slate-900 font-sans selection:bg-[#3B25B0] selection:text-white"
    >
      {/* Main Grid Wrapper */}
      <div className="min-h-screen lg:h-full grid grid-cols-1 lg:grid-cols-12 relative z-10 bg-gradient-to-r from-[#1b1173] to-[#3328a5] lg:bg-none">

        {/* Left Column - Deep Blue Gradient Branding Banner (Desktop Only lg:flex) */}
        <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 bg-gradient-to-r from-[#1b1173] to-[#3328a5] text-white p-5 lg:p-5 xl:p-12 flex-col justify-between relative overflow-hidden min-h-80 lg:min-h-0 lg:h-full">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10 shrink-0">
            <Link href="/" className="flex items-center shrink-0 transition-transform hover:scale-[1.02]">
              <Image
                src="/images/logo_footer.png"
                alt="Mutakamela Insurance Logo"
                width={190}
                height={48}
                priority
                className="h-6 lg:h-6 xl:h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Center Main Text */}
          <div className="relative z-10 my-auto py-3 lg:py-3 xl:py-10 max-w-md">
            <h1 className="text-xl lg:text-2xl xl:text-4xl font-extrabold tracking-tight leading-[1.18] text-white mb-2 xl:mb-6">
              {currentLang === "ar" ? (
                <>
                  تأمينك، على بُعد <span className="text-cyan-400">تسجيل دخول آمن</span> واحد.
                </>
              ) : (
                <>
                  Your insurance, <span className="text-cyan-400">one secure sign-in</span> away.
                </>
              )}
            </h1>
            <p className="text-xs xl:text-base text-indigo-100/90 leading-relaxed font-normal">
              {t("heroSub")}
            </p>
          </div>

          {/* Bottom Feature Badges */}
          <div className="relative z-10 flex flex-wrap gap-1.5 xl:gap-2.5 text-xs font-medium text-white/90 pt-1.5 shrink-0">
            <div className="flex items-center gap-1.5 xl:gap-2 bg-white/10 backdrop-blur-md px-2.5 xl:px-4 py-1 xl:py-2 rounded-full border border-white/15 shadow-sm text-[10px] xl:text-xs">
              <ShieldCheck className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-cyan-300 shrink-0" />
              <span>{t("iaRegulated")}</span>
            </div>
            <div className="flex items-center gap-1.5 xl:gap-2 bg-white/10 backdrop-blur-md px-2.5 xl:px-4 py-1 xl:py-2 rounded-full border border-white/15 shadow-sm text-[10px] xl:text-xs">
              <Lock className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-cyan-300 shrink-0" />
              <span>{t("encryption")}</span>
            </div>
            <div className="flex items-center gap-1.5 xl:gap-2 bg-white/10 backdrop-blur-md px-2.5 xl:px-4 py-1 xl:py-2 rounded-full border border-white/15 shadow-sm text-[10px] xl:text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-cyan-300 shrink-0" />
              <span>{t("nafathVerifiedBadge")}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Form Container Area */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between p-4 sm:p-6 lg:py-2.5 lg:px-6 xl:p-10 relative bg-transparent lg:bg-[#F8F9FE] lg:h-full lg:overflow-y-auto min-h-screen lg:min-h-0">

          {/* Top Header Row (Mobile & Desktop) */}
          <div className="w-full max-w-xl mx-auto mb-4 lg:mb-2 xl:mb-6 shrink-0">
            {/* Logo & Language Switcher Row */}
            <div className="flex items-center justify-between w-full mb-3 lg:mb-0">
              {/* Mobile Only Brand Logo */}
              <div className="block lg:hidden">
                <Link href="/" className="flex items-center shrink-0">
                  <Image
                    src="/images/logo_footer.png"
                    alt="Mutakamela Insurance Logo"
                    width={170}
                    height={44}
                    priority
                    className="h-7 sm:h-8 w-auto object-contain"
                  />
                </Link>
              </div>

              {/* Desktop Only Back Link */}
              <div className="hidden lg:block">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#3B25B0] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 xl:w-4 xl:h-4 rtl:rotate-180" />
                  <span>{t("backToWebsite")}</span>
                </Link>
              </div>

              {/* Language Switcher Button */}
              <button
                onClick={toggleLanguage}
                className="inline-flex items-center gap-1.5 xl:gap-2 bg-white/15 lg:bg-white border border-white/20 lg:border-slate-200 text-white lg:text-slate-700 hover:bg-white/25 lg:hover:border-indigo-300 backdrop-blur-md lg:backdrop-blur-none text-xs font-bold px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-xl transition-all shadow-xs"
              >
                <Globe className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-cyan-300 lg:text-slate-500" />
                <span className="font-extrabold">{currentLang === "en" ? "العربية (AR)" : "English (EN)"}</span>
              </button>
            </div>

            {/* Mobile Only Back Link */}
            <div className="block lg:hidden pt-1">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-200 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                <span>{t("backToWebsite")}</span>
              </Link>
            </div>
          </div>

          {/* Main Sign In Form Card */}
          <div className="w-full max-w-xl mx-auto bg-white rounded-3xl p-6 lg:p-4 xl:p-8 shadow-2xl lg:shadow-xl border border-white/20 lg:border-slate-100 my-auto relative shrink-0">

          {/* SECTION 1: NAFATH LOGIN */}
          {step === "nafath" && (
            <div className="animate-in fade-in duration-300">
              {/* Card Header */}
              <div className="mb-2.5 lg:mb-2.5 xl:mb-6">
                <h2 className="text-lg lg:text-xl xl:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {t("signIn")}
                </h2>
                <p className="text-[11px] lg:text-xs xl:text-sm text-slate-500 mt-0.5">
                  {t("signInSubtitle")}
                </p>
              </div>

              {/* Segmented Tabs */}
              <div className="bg-slate-100/80 p-1 rounded-xl xl:rounded-2xl grid grid-cols-2 text-xs xl:text-sm font-semibold mb-2.5 lg:mb-2.5 xl:mb-6">
                <button
                  type="button"
                  className="py-1.5 lg:py-1.5 xl:py-2.5 rounded-lg xl:rounded-xl bg-white text-[#3B25B0] shadow-sm text-center transition-all"
                >
                  {t("nafathTab")}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="py-1.5 lg:py-1.5 xl:py-2.5 rounded-lg xl:rounded-xl text-slate-500 hover:text-slate-900 text-center transition-all"
                >
                  {t("emailTab")}
                </button>
              </div>

              <form onSubmit={handleNafathSubmit} className="space-y-3 lg:space-y-2.5 xl:space-y-5">
                <div>
                  <label className="block text-[11px] lg:text-[11px] xl:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 xl:mb-2">
                    {t("nationalIdLabel")}
                  </label>
                  <input
                    type="text"
                    required
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder={t("nationalIdPlaceholder")}
                    className="w-full px-3.5 xl:px-4 py-2.5 lg:py-2 xl:py-3.5 rounded-xl border border-slate-200 text-xs xl:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B25B0] focus:border-transparent transition-all placeholder:text-slate-400"
                  />
                  <p className="text-[10px] xl:text-[11px] text-slate-400 mt-1 xl:mt-1">{t("nationalIdHelper")}</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0D9488] hover:bg-[#0B8479] text-white py-3 lg:py-2.5 xl:py-3.5 rounded-xl font-semibold text-xs xl:text-sm shadow-md hover:shadow-emerald-200/50 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99]"
                >
                  {/* Nafath Arabic Icon Box */}
                  <span className="w-4 h-4 xl:w-5 xl:h-5 rounded-md bg-white/20 text-white flex items-center justify-center font-bold text-[10px] xl:text-xs">
                    ن
                  </span>
                  <span>{t("continueNafath")}</span>
                </button>
              </form>

              <div className="relative my-3 lg:my-2 xl:my-5 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <span className="relative bg-white px-3 text-[11px] lg:text-xs text-slate-400 font-medium">{t("orText")}</span>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-xs xl:text-sm font-bold text-[#3B25B0] hover:text-[#2F1F99] transition-colors"
                >
                  {t("useEmailInstead")}
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2: EMAIL & PASSWORD LOGIN */}
          {step === "email" && (
            <div className="animate-in fade-in duration-300">
              {/* Card Header */}
              <div className="mb-2.5 lg:mb-2.5 xl:mb-6">
                <h2 className="text-lg lg:text-xl xl:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {t("signIn")}
                </h2>
                <p className="text-[11px] lg:text-xs xl:text-sm text-slate-500 mt-0.5">
                  {t("signInSubtitle")}
                </p>
              </div>

              {/* Segmented Tabs */}
              <div className="bg-slate-100/80 p-1 rounded-xl xl:rounded-2xl grid grid-cols-2 text-xs xl:text-sm font-semibold mb-2.5 lg:mb-2.5 xl:mb-6">
                <button
                  type="button"
                  onClick={() => setStep("nafath")}
                  className="py-1.5 lg:py-1.5 xl:py-2.5 rounded-lg xl:rounded-xl text-slate-500 hover:text-slate-900 text-center transition-all"
                >
                  {t("nafathTab")}
                </button>
                <button
                  type="button"
                  className="py-1.5 lg:py-1.5 xl:py-2.5 rounded-lg xl:rounded-xl bg-white text-[#3B25B0] shadow-sm text-center transition-all"
                >
                  {t("emailTab")}
                </button>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-3 lg:space-y-2.5 xl:space-y-4">
                <div>
                  <label className="block text-[11px] lg:text-[11px] xl:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t("emailLabel")}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    className="w-full px-3.5 xl:px-4 py-2.5 lg:py-2 xl:py-3.5 rounded-xl border border-slate-200 text-xs xl:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B25B0] focus:border-transparent transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] lg:text-[11px] xl:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t("passwordLabel")}
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 xl:px-4 py-2.5 lg:py-2 xl:py-3.5 rounded-xl border border-slate-200 text-xs xl:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B25B0] focus:border-transparent transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] lg:text-xs pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-[#3B25B0] focus:ring-[#3B25B0]"
                    />
                    <span>{t("rememberMe")}</span>
                  </label>
                  <a href="#" className="font-semibold text-[#3B25B0] hover:underline">
                    {t("forgotPassword")}
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#3B25B0] hover:bg-[#2F1F99] text-white py-3 lg:py-2.5 xl:py-3.5 rounded-xl font-semibold text-xs xl:text-sm shadow-md hover:shadow-indigo-300/50 transition-all text-center mt-1 transform active:scale-[0.99]"
                >
                  {t("signIn")}
                </button>
              </form>
            </div>
          )}

          {/* SECTION 3: WAITING FOR NAFATH APPROVAL */}
          {step === "nafath_pending" && (
            <div className="text-center py-2 xl:py-4 animate-in fade-in duration-300">
              <div className="text-center mb-3 xl:mb-6">
                <h2 className="text-lg lg:text-xl xl:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {t("signIn")}
                </h2>
                <p className="text-[11px] lg:text-xs xl:text-sm text-slate-500 mt-0.5">
                  {t("signInSubtitle")}
                </p>
              </div>

              {/* Status Pill Badge */}
              <div className="inline-flex items-center gap-1.5 bg-emerald-100/80 text-emerald-800 border border-emerald-200/80 text-[11px] lg:text-xs font-bold px-3 py-1 rounded-full mb-3 xl:mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{t("waitingNafath")}</span>
              </div>

              {/* Big Verification Code Number */}
              <div className="my-3 xl:my-6">
                <span className="text-4xl lg:text-4xl xl:text-7xl font-extrabold tracking-tight text-[#3B25B0] inline-block font-mono">
                  32
                </span>
              </div>

              {/* Subtext */}
              <p className="text-xs xl:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed mb-3 xl:mb-6">
                {t("nafathInstruction")}
              </p>

              {/* Countdown Timer */}
              <p className="text-xs text-slate-500 font-medium mb-3 xl:mb-6">
                {t("requestExpires")} <span className="font-bold text-slate-900">{timer}s</span>
              </p>

              <button
                type="button"
                onClick={() => setStep("nafath")}
                className="text-xs xl:text-sm font-bold text-[#3B25B0] hover:text-[#2F1F99] transition-colors"
              >
                {t("cancelGoBack")}
              </button>
            </div>
          )}

          {/* SECTION 4: IDENTITY VERIFIED */}
          {step === "nafath_verified" && (
            <div className="text-center py-2 xl:py-4 animate-in fade-in duration-300">
              <div className="text-center mb-3 xl:mb-4">
                <h2 className="text-lg lg:text-xl xl:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {t("signIn")}
                </h2>
                <p className="text-[11px] lg:text-xs xl:text-sm text-slate-500 mt-0.5">
                  {t("signInSubtitle")}
                </p>
              </div>

              {/* Success Image */}
              <div className="my-3 xl:my-6 flex justify-center">
                <Image
                  src="/images/success.png"
                  alt="Success Verified"
                  width={96}
                  height={96}
                  className="w-16 h-16 lg:w-14 lg:h-14 xl:w-28 xl:h-28 object-contain mx-auto"
                  priority
                />
              </div>

              {/* Title & Description */}
              <h3 className="text-base lg:text-lg xl:text-xl font-extrabold text-slate-900 mb-1 xl:mb-2">
                {t("identityVerified")}
              </h3>
              <p className="text-xs xl:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed mb-3 xl:mb-6">
                {t("identityVerifiedDesc")}
              </p>

              <button
                type="button"
                onClick={handleManualGoToDashboard}
                className="w-full bg-[#3B25B0] hover:bg-[#2F1F99] text-white py-3 lg:py-2.5 xl:py-3.5 rounded-xl font-semibold text-xs xl:text-sm shadow-md hover:shadow-indigo-300/50 transition-all text-center"
              >
                {t("goToDashboard")}
              </button>
            </div>
          )}

          {/* Card Footer (Shared terms & acronyms) */}
          <div className="mt-4 lg:mt-3 xl:mt-8 pt-3 lg:pt-3.5 xl:pt-5 border-t border-slate-100 text-center">
            <p className="text-[10px] xl:text-[11px] text-slate-400 leading-tight mb-2 xl:mb-2.5">
              {t("termsNotice")}
            </p>
            <div className="flex items-center justify-center gap-3 xl:gap-4 text-[9px] xl:text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              <span>IA</span>
              <span>NCA ECC</span>
              <span>PDPL</span>
            </div>
          </div>

        </div>

        {/* Bottom Spacer */}
        <div className="hidden xl:block shrink-0 h-2" />
      </div>

    </div>
  </div>
  );
}
