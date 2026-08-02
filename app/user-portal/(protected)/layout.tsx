"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCustomerAuth } from "@/lib/customer-auth-context";
import I18nProvider from "@/components/i18n-provider";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  MessageSquare,
  CreditCard,
  ShoppingBag,
  RefreshCw,
  Building2,
  LogOut,
  Bell,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Bot,
  User,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

export default function ProtectedUserPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      <UserPortalShell>{children}</UserPortalShell>
    </I18nProvider>
  );
}

function UserPortalShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isLoggedIn, isReady } = useCustomerAuth();
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language || "en";

  useEffect(() => {
    if (isReady && !isLoggedIn) {
      router.replace("/user-portal/login");
    }
  }, [isReady, isLoggedIn, router]);

  const toggleLanguage = () => {
    const nextLang = currentLang === "en" ? "ar" : "en";
    i18n.changeLanguage(nextLang);
  };

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/user-portal/login");
  };

  if (!isReady || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center text-slate-500 text-sm font-medium">
        Loading portal…
      </div>
    );
  }

  const navItems = [
    { href: "/user-portal/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/user-portal/policies", label: t("myPolicies"), icon: FileText },
    { href: "/user-portal/claims", label: t("navClaims"), icon: ClipboardList },
    { href: "/user-portal/complaints", label: t("complaints"), icon: MessageSquare },
    { href: "/user-portal/payments", label: t("payments"), icon: CreditCard },
    { href: "/user-portal/buy", label: t("buyInsurance"), icon: ShoppingBag },
    { href: "/user-portal/renewals", label: t("renewals"), icon: RefreshCw },
    { href: "/user-portal/medical", label: t("medicalNetwork"), icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FE] text-slate-900 font-sans flex flex-col selection:bg-[#2563EB] selection:text-white">

      {/* Top Navbar Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/" className="flex items-center shrink-0 cursor-pointer">
            <Image
              src="/images/logo_navbar.png"
              alt="Mutakamela Insurance Logo"
              width={160}
              height={40}
              priority
              className="h-6 sm:h-8 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right Side Header Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/#products"
            className="hidden lg:inline-flex items-center justify-center border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
          >
            {t("getAQuote")}
          </Link>

          <button
            onClick={toggleLanguage}
            className="hidden md:flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
            title={currentLang === "en" ? "تغيير للغة العربية" : "Switch to English"}
          >
            <Globe className="w-4 h-4 text-slate-500" />
            <span>{currentLang === "en" ? "AR" : "EN"}</span>
          </button>

          <div className="relative">
            <button className="relative p-2 sm:p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer">
              <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-600" />
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                14
              </span>
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden relative shadow-sm border border-slate-200 shrink-0 bg-slate-100">
                <Image
                  src="/images/user_02.png"
                  alt={user?.name || "Ahmed"}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="hidden md:inline-block font-semibold text-xs sm:text-sm text-slate-800">
                {t("myAccount")}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-2.5 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden relative shadow-xs border border-slate-200 shrink-0 bg-slate-100">
                      <Image
                        src="/images/user_02.png"
                        alt={user?.name || "Ahmed"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{user?.name || "Ahmed"}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email || "ahmed@mutakamela.sa"}</p>
                    </div>
                  </div>

                  <div className="py-1 border-b border-slate-100">
                    <Link
                      href="/user-portal/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#2563EB]" />
                      <span>{t("profileKyc")}</span>
                    </Link>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t("logout")}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Body Layout: Sidebar + Route Children */}
      <div className="flex-1 flex items-start relative max-w-[1920px] mx-auto w-full">

        {/* Desktop Sticky Sidebar */}
        <aside
          className={`hidden lg:flex flex-col bg-white border-r border-slate-100 p-4 transition-all duration-300 ease-in-out sticky top-16 sm:top-20 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] overflow-y-auto shrink-0 z-30 ${isCollapsed ? "w-20" : "w-64"
            }`}
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? t("expandSidebar") : t("collapseSidebar")}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-5 h-5 text-slate-600" />
              ) : (
                <>
                  <PanelLeftClose className="w-5 h-5 text-slate-600" />
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400 rtl:rotate-180" />
                </>
              )}
            </button>
          </div>

          <div className="space-y-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/user-portal/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${isActive
                      ? "bg-gradient-to-r from-[#1a1071] to-[#3429a8] text-white shadow-md shadow-indigo-900/20"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    } ${isCollapsed ? "justify-center px-0" : ""}`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                  {!isCollapsed && (
                    <span className="whitespace-nowrap overflow-hidden transition-all duration-300">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-2">
            <button
              onClick={handleLogout}
              title={isCollapsed ? t("logout") : undefined}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-semibold text-xs sm:text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ${isCollapsed ? "justify-center px-0" : ""
                }`}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!isCollapsed && (
                <span className="whitespace-nowrap overflow-hidden transition-all duration-300">
                  {t("logout")}
                </span>
              )}
            </button>
          </div>
        </aside>

        {/* Mobile Slide-over Drawer Sidebar with Smooth Slide CSS Animation */}
        <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${mobileSidebarOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
          <div
            className={`fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${mobileSidebarOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className={`fixed inset-y-0 left-0 rtl:left-auto rtl:right-0 w-72 bg-white h-full shadow-2xl p-5 flex flex-col justify-between z-10 transition-transform duration-300 ease-in-out transform ${mobileSidebarOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"}`}>
            <div>
              {/* Drawer Header: Logo + Language Switcher + Close X */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Image src="/images/logo_navbar.png" alt="Mutakamela Logo" width={150} height={38} className="h-7 w-auto object-contain" />
                <div className="flex items-center gap-2">
                  {/* AR/EN language change option before closing button */}
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-2.5 py-1 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    <Globe className="w-4 h-4 text-slate-500" />
                    <span>{currentLang === "en" ? "AR" : "EN"}</span>
                  </button>
                  <button onClick={() => setMobileSidebarOpen(false)} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/user-portal/dashboard" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all cursor-pointer ${isActive ? "bg-gradient-to-r from-[#1a1071] to-[#3429a8] text-white shadow-md" : "text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => { setMobileSidebarOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>{t("logout")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 overflow-x-hidden min-w-0">
          {children}
        </main>
      </div>

      {/* Floating Support Triggers (WhatsApp & AI Assistant) */}
      <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 flex flex-col gap-3">
        <a
          href="https://wa.me/966500000000"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full relative group shadow-lg hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-110 flex items-center justify-center bg-[#25D366] cursor-pointer"
          title="Chat with WhatsApp Support"
        >
          <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>

        <button
          onClick={() => setShowAiChat(!showAiChat)}
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full relative group shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 transform hover:scale-110 flex items-center justify-center bg-white cursor-pointer"
          title={t("aiAssistantTitle")}
        >
          <svg className="absolute -inset-[3px] w-[calc(100%+6px)] h-[calc(100%+6px)] animate-[spin_3.5s_linear_infinite] pointer-events-none" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="aiRingGradientProtectedLayout" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#aiRingGradientProtectedLayout)"
              strokeWidth="4.5"
              strokeDasharray="212 71"
              strokeLinecap="round"
            />
          </svg>

          <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center z-10">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#1E65FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3.5" y="3.5" width="13" height="13" rx="3.5" />
              <text x="5.5" y="13" fontSize="8" fontWeight="800" fill="currentColor" stroke="none">AI</text>
              <path d="M18 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" fill="currentColor" stroke="none" />
            </svg>
          </div>
        </button>
      </div>

      {/* AI Assistant Chat Box Popup */}
      {showAiChat && (
        <div className="fixed bottom-24 right-6 rtl:right-auto rtl:left-6 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-[#3B25B0] text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm">{t("aiAssistantTitle")}</div>
                <div className="text-xs text-indigo-200">{t("onlineSupport")}</div>
              </div>
            </div>
            <button
              onClick={() => setShowAiChat(false)}
              className="text-indigo-200 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-3 h-64 overflow-y-auto bg-slate-50 text-xs text-slate-700">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 max-w-[85%]">
              {currentLang === "ar"
                ? `مرحباً ${user?.name || "أحمد"}! 👋 كيف يمكنني مساعدتك في وثائق التأمين أو المطالبات اليوم؟`
                : `Hello ${user?.name || "Ahmed"}! 👋 How can I help you with your insurance policies or claims today?`}
            </div>
          </div>

          <div className="p-3 border-t border-slate-100 bg-white flex gap-2">
            <input
              type="text"
              placeholder={t("askAnythingPlaceholder")}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#3B25B0]"
            />
            <button className="bg-[#3B25B0] text-white px-3.5 py-2 rounded-xl font-semibold text-xs hover:bg-[#2F1F99] cursor-pointer">
              {t("sendBtn")}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

