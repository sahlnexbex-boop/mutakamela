"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp, Globe, Menu, X, ArrowRight } from "lucide-react";

interface NavbarProps {
  onOpenAuthModal?: () => void;
  onOpenQuoteModal?: (productType?: string) => void;
}

export default function Navbar({ onOpenAuthModal, onOpenQuoteModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(true);
  const [mobileCorporateOpen, setMobileCorporateOpen] = useState(false);
  const [mobileServiceOpen, setMobileServiceOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-20">

            {/* Brand Logo & Spacing */}
            <div className="flex items-center space-x-6 sm:space-x-8 lg:space-x-12">
              <Link href="/" className="flex items-center transition-transform hover:scale-[1.02]">
                <Image
                  src="/images/logo_navbar.png"
                  alt="Mutakamela Insurance Logo"
                  width={190}
                  height={48}
                  priority
                  className="h-7 sm:h-8 lg:h-10 w-auto object-contain"
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4 text-sm font-medium text-slate-700">
                <Link
                  href="/"
                  className="px-3 py-2 text-[#3B25B0] font-bold rounded-lg hover:bg-indigo-50/60 transition-colors"
                >
                  Home
                </Link>

                {/* Individual Products Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                    <span>Individual Products</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-0 w-64 mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={() => onOpenQuoteModal?.("Motor Insurance")}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors text-left"
                    >
                      <div>
                        <div className="font-semibold text-sm">Motor Insurance</div>
                        <div className="text-xs text-slate-500">Coverage for your vehicle</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => onOpenQuoteModal?.("Travel Insurance")}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors text-left"
                    >
                      <div>
                        <div className="font-semibold text-sm">Travel Insurance</div>
                        <div className="text-xs text-slate-500">Protection while traveling</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => onOpenQuoteModal?.("Life Insurance")}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors text-left"
                    >
                      <div>
                        <div className="font-semibold text-sm">Life Insurance</div>
                        <div className="text-xs text-slate-500">Family protection plan</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => onOpenQuoteModal?.("Visit Visa Insurance")}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors text-left"
                    >
                      <div>
                        <div className="font-semibold text-sm">Visit Visa Insurance</div>
                        <div className="text-xs text-slate-500">Medical cover for visitors</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Corporate Products Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                    <span>Corporate Products</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-0 w-60 mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <a href="#products" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors font-medium">General & Property Insurance</a>
                    <a href="#products" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors font-medium">Corporate Fleet Policy</a>
                    <a href="#products" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors font-medium">Marine & Logistics</a>
                  </div>
                </div>

                {/* About Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                    <span>About</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-0 w-52 mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <a href="#why-us" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors font-medium">Why Mutakamela</a>
                    <a href="#app" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors font-medium">App Experience</a>
                  </div>
                </div>

                {/* Customer Service Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                    <span>Customer Service</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-0 w-56 mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <a href="#claims" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors font-medium">Submit / Track Claim</a>
                    <a href="#faq" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-[#3B25B0] transition-colors font-medium">FAQs</a>
                  </div>
                </div>

                {/* Careers */}
                <div className="relative group">
                  <button className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                    <span>Careers</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                </div>
              </nav>
            </div>

            {/* Right Action Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <button className="flex items-center space-x-1.5 text-sm font-medium text-slate-700 hover:text-indigo-700 px-3 py-2 rounded-lg transition-colors">
                <Globe className="w-4 h-4 text-slate-500" />
                <span>EN</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={onOpenAuthModal}
                className="bg-[#3B25B0] hover:bg-[#2F1F99] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-indigo-300/40 transition-all duration-200 transform active:scale-95"
              >
                Login / Register
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Side-Drawer Mobile Sidebar (Smooth 300ms Slide-in from right & Slide-out back to right) */}
      <div
        className={`fixed inset-0 z-[9999] flex justify-end transition-all duration-300 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop Click to Close */}
        <div
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Side Drawer Panel */}
        <div
          className={`relative z-[10000] w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out transform ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
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
            <button className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
              <Globe className="w-4 h-4 text-slate-400" />
              <span>English (EN)</span>
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAuthModal?.(); }}
              className="bg-[#3B25B0] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-[#2F1F99] transition-colors"
            >
              Login / Register
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
