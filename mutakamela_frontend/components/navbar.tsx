"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp, Globe, Menu, X, ArrowRight, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface NavbarProps {
  onOpenAuthModal?: () => void;
  onOpenQuoteModal?: (productType?: string) => void;
}

export default function Navbar({ onOpenAuthModal, onOpenQuoteModal }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(true);
  const [mobileCorporateOpen, setMobileCorporateOpen] = useState(false);
  const [mobileServiceOpen, setMobileServiceOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const currentLang = i18n.language || "en";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang);
    setLangDropdownOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm"
          : "bg-transparent border-b border-transparent shadow-none"
          }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 transition-all duration-300">

            {/* Brand Logo & Spacing */}
            <div className="flex items-center gap-3 lg:gap-4 xl:gap-8 shrink-0">
              <Link href="/" className="flex items-center shrink-0 transition-transform hover:scale-[1.02]">
                <Image
                  src="/images/logo_navbar.png"
                  alt="Mutakamela Insurance Logo"
                  width={190}
                  height={48}
                  priority
                  className="h-6 sm:h-7 lg:h-9 xl:h-10 w-auto object-contain"
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1 xl:gap-2.5 text-xs xl:text-sm font-medium text-slate-700">
                <Link
                  href="/"
                  className="px-2.5 xl:px-3 py-2 text-[#3B25B0] font-bold rounded-lg hover:bg-indigo-50/60 transition-colors whitespace-nowrap"
                >
                  {t("home")}
                </Link>

                {/* Individual Products Dropdown */}
                <div className="relative group shrink-0">
                  <button className="flex items-center gap-1 px-2.5 xl:px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors whitespace-nowrap">
                    <span>{t("individualProducts")}</span>
                    <ChevronDown className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 group-hover:rotate-180 shrink-0" />
                  </button>
                  <div className="absolute top-full ltr:left-0 rtl:right-0 w-64 mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <button
                      onClick={() => onOpenQuoteModal?.("Motor Insurance")}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors text-left rtl:text-right"
                    >
                      <div>
                        <div className="font-semibold text-sm">{t("motorInsurance")}</div>
                        <div className="text-xs text-slate-500">{t("motorDesc")}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 rtl:rotate-180" />
                    </button>
                    <button
                      onClick={() => onOpenQuoteModal?.("Travel Insurance")}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors text-left rtl:text-right"
                    >
                      <div>
                        <div className="font-semibold text-sm">{t("travelInsurance")}</div>
                        <div className="text-xs text-slate-500">{t("travelDesc")}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 rtl:rotate-180" />
                    </button>
                    <button
                      onClick={() => onOpenQuoteModal?.("Life Insurance")}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors text-left rtl:text-right"
                    >
                      <div>
                        <div className="font-semibold text-sm">{t("lifeInsurance")}</div>
                        <div className="text-xs text-slate-500">{t("lifeDesc")}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 rtl:rotate-180" />
                    </button>
                    <button
                      onClick={() => onOpenQuoteModal?.("Visit Visa Insurance")}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors text-left rtl:text-right"
                    >
                      <div>
                        <div className="font-semibold text-sm">{t("visitVisaInsurance")}</div>
                        <div className="text-xs text-slate-500">{t("visitVisaDesc")}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 rtl:rotate-180" />
                    </button>
                  </div>
                </div>

                {/* Corporate Products Dropdown */}
                <div className="relative group shrink-0">
                  <button className="flex items-center gap-1 px-2.5 xl:px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors whitespace-nowrap">
                    <span>{t("corporateProducts")}</span>
                    <ChevronDown className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 group-hover:rotate-180 shrink-0" />
                  </button>
                  <div className="absolute top-full ltr:left-0 rtl:right-0 w-60 mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <a href="#products" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors font-medium">{t("generalProperty")}</a>
                    <a href="#products" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors font-medium">{t("corporateFleet")}</a>
                    <a href="#products" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors font-medium">{t("marineLogistics")}</a>
                  </div>
                </div>

                {/* About Dropdown */}
                <div className="relative group shrink-0">
                  <button className="flex items-center gap-1 px-2.5 xl:px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors whitespace-nowrap">
                    <span>{t("about")}</span>
                    <ChevronDown className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 group-hover:rotate-180 shrink-0" />
                  </button>
                  <div className="absolute top-full ltr:left-0 rtl:right-0 w-52 mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <a href="#why-us" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors font-medium">{t("whyMutakamela")}</a>
                    <a href="#app" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors font-medium">{t("appExperienceNav")}</a>
                  </div>
                </div>

                {/* Customer Service Dropdown */}
                <div className="relative group shrink-0">
                  <button className="flex items-center gap-1 px-2.5 xl:px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors whitespace-nowrap">
                    <span>{t("customerService")}</span>
                    <ChevronDown className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 group-hover:rotate-180 shrink-0" />
                  </button>
                  <div className="absolute top-full ltr:left-0 rtl:right-0 w-56 mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <a href="#claims" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors font-medium">{t("submitTrackClaim")}</a>
                    <a href="#faq" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors font-medium">{t("faqs")}</a>
                  </div>
                </div>

                {/* Careers */}
                <div className="relative group shrink-0">
                  <button className="flex items-center gap-1 px-2.5 xl:px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors whitespace-nowrap">
                    <span>{t("careers")}</span>
                    <ChevronDown className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 group-hover:rotate-180 shrink-0" />
                  </button>
                </div>
              </nav>
            </div>

            {/* Right Action Buttons */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-4 shrink-0">
              {/* Language Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1.5 text-xs xl:text-sm font-medium text-slate-700 hover:text-indigo-700 px-2.5 xl:px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="font-bold">{currentLang === "ar" ? "AR" : "EN"}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {langDropdownOpen && (
                  <div className="absolute top-full ltr:right-0 rtl:left-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in duration-150">
                    <button
                      onClick={() => changeLang("en")}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${currentLang === "en" ? "bg-indigo-50 text-[#3B25B0]" : "text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                      <span>EN - English</span>
                      {currentLang === "en" && <Check className="w-3.5 h-3.5 text-[#3B25B0]" />}
                    </button>
                    <button
                      onClick={() => changeLang("ar")}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${currentLang === "ar" ? "bg-indigo-50 text-[#3B25B0]" : "text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                      <span>AR - العربية</span>
                      {currentLang === "ar" && <Check className="w-3.5 h-3.5 text-[#3B25B0]" />}
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (isLoggedIn) {
                    router.push("/user-portal/dashboard");
                  } else {
                    router.push("/user-portal/login");
                  }
                }}
                className="bg-[#3B25B0] hover:bg-[#2F1F99] text-white px-4 xl:px-5 py-2.5 rounded-xl font-semibold text-xs xl:text-sm shadow-md hover:shadow-indigo-300/40 transition-all duration-200 transform active:scale-95 whitespace-nowrap"
              >
                {isLoggedIn ? "My Account" : t("login")}
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100/80 focus:outline-none transition-colors"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Side-Drawer Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-[9999] flex justify-end transition-all duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Backdrop Click to Close */}
        <div
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Side Drawer Panel */}
        <div
          className={`relative z-[10000] w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out transform ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="space-y-6 overflow-y-auto">

            {/* Drawer Header: Logo + Close X */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <Image
                src="/images/logo_navbar.png"
                alt="Mutakamela Logo"
                width={150}
                height={38}
                className="h-7 w-auto object-contain"
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Links List */}
            <div className="space-y-3">

              {/* Home Active Highlight Badge */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full px-4 py-3 rounded-xl font-bold text-sm text-[#3B25B0] bg-indigo-50/80 hover:bg-indigo-100/70 transition-colors"
              >
                Home
              </Link>

              {/* Collapsible PRODUCTS Accordion */}
              <div className="border-b border-slate-100/80 pb-2">
                <button
                  onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-700"
                >
                  <span>PRODUCTS</span>
                  {mobileProductsOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {mobileProductsOpen && (
                  <div className="mt-1 space-y-1 pl-3 border-l-2 border-indigo-100 animate-in fade-in slide-in-from-top-1 duration-200">
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenQuoteModal?.("Motor Insurance"); }}
                      className="block w-full text-left px-3 py-2 text-sm text-slate-700 font-medium hover:text-[#3B25B0] hover:bg-slate-50 rounded-lg"
                    >
                      Motor Insurance
                    </button>
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenQuoteModal?.("Travel Insurance"); }}
                      className="block w-full text-left px-3 py-2 text-sm text-slate-700 font-medium hover:text-[#3B25B0] hover:bg-slate-50 rounded-lg"
                    >
                      Travel Insurance
                    </button>
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenQuoteModal?.("Life Insurance"); }}
                      className="block w-full text-left px-3 py-2 text-sm text-slate-700 font-medium hover:text-[#3B25B0] hover:bg-slate-50 rounded-lg"
                    >
                      Life Insurance
                    </button>
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenQuoteModal?.("Visit Visa Insurance"); }}
                      className="block w-full text-left px-3 py-2 text-sm text-slate-700 font-medium hover:text-[#3B25B0] hover:bg-slate-50 rounded-lg"
                    >
                      Visit Visa Insurance
                    </button>
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenQuoteModal?.("General Insurance"); }}
                      className="block w-full text-left px-3 py-2 text-sm text-slate-700 font-medium hover:text-[#3B25B0] hover:bg-slate-50 rounded-lg"
                    >
                      General Insurance
                    </button>
                  </div>
                )}
              </div>

              {/* Collapsible CORPORATE PRODUCTS Accordion */}
              <div className="border-b border-slate-100/80 pb-2">
                <button
                  onClick={() => setMobileCorporateOpen(!mobileCorporateOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-700"
                >
                  <span>CORPORATE PRODUCTS</span>
                  {mobileCorporateOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {mobileCorporateOpen && (
                  <div className="mt-1 space-y-1 pl-3 border-l-2 border-indigo-100 animate-in fade-in slide-in-from-top-1 duration-200">
                    <a href="#products" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-700 font-medium hover:text-[#3B25B0]">General & Property</a>
                    <a href="#products" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-700 font-medium hover:text-[#3B25B0]">Corporate Fleet</a>
                    <a href="#products" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-700 font-medium hover:text-[#3B25B0]">Marine & Logistics</a>
                  </div>
                )}
              </div>

              {/* Collapsible CUSTOMER SERVICE Accordion */}
              <div className="pb-2">
                <button
                  onClick={() => setMobileServiceOpen(!mobileServiceOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-700"
                >
                  <span>CUSTOMER SERVICE</span>
                  {mobileServiceOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {mobileServiceOpen && (
                  <div className="mt-1 space-y-1 pl-3 border-l-2 border-indigo-100 animate-in fade-in slide-in-from-top-1 duration-200">
                    <a href="#claims" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-700 font-medium hover:text-[#3B25B0]">Submit / Track Claim</a>
                    <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-700 font-medium hover:text-[#3B25B0]">Frequently Asked Questions</a>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Bottom Drawer Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => changeLang(currentLang === "en" ? "ar" : "en")}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span>{currentLang === "ar" ? "English (EN)" : "العربية (AR)"}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (isLoggedIn) {
                  router.push("/dashboard");
                } else {
                  router.push("/user-portal/login");
                }
              }}
              className="bg-[#3B25B0] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-[#2F1F99] transition-colors whitespace-nowrap"
            >
              {isLoggedIn ? "My Account" : t("login")}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
