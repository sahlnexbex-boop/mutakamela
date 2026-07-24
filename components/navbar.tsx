"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Globe, Menu, X, Shield, Phone, FileText, ArrowRight } from "lucide-react";

interface NavbarProps {
  onOpenAuthModal?: () => void;
  onOpenQuoteModal?: (productType?: string) => void;
}

export default function Navbar({ onOpenAuthModal, onOpenQuoteModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-[1.02]">
            <Image
              src="/images/logo_navbar.png"
              alt="Mutakamela Insurance Logo"
              width={190}
              height={48}
              priority
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-sm font-medium text-slate-700">
            <Link
              href="/"
              className="px-3 py-2 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50/60 transition-colors"
            >
              Home
            </Link>

            {/* Individual Products Dropdown */}
            <div className="relative group">
              <button
                onClick={() => toggleDropdown("individual")}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors"
              >
                <span>Individual Products</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 w-64 mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <button
                  onClick={() => onOpenQuoteModal?.("Motor")}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-700 transition-colors text-left"
                >
                  <div>
                    <div className="font-semibold text-sm">Motor Insurance</div>
                    <div className="text-xs text-slate-500">Coverage for your vehicle</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => onOpenQuoteModal?.("Travel")}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-700 transition-colors text-left"
                >
                  <div>
                    <div className="font-semibold text-sm">Travel Insurance</div>
                    <div className="text-xs text-slate-500">Protection while traveling</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => onOpenQuoteModal?.("Life")}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-700 transition-colors text-left"
                >
                  <div>
                    <div className="font-semibold text-sm">Life Insurance</div>
                    <div className="text-xs text-slate-500">Family protection plan</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => onOpenQuoteModal?.("Visit Visa")}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-700 transition-colors text-left"
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
                <a href="#products" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-700 transition-colors font-medium">General & Property Insurance</a>
                <a href="#products" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-700 transition-colors font-medium">Corporate Fleet Policy</a>
                <a href="#products" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-700 transition-colors font-medium">Marine & Logistics</a>
              </div>
            </div>

            {/* About Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                <span>About</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 w-52 mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <a href="#why-us" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-700 transition-colors font-medium">Why Mutakamela</a>
                <a href="#app" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-700 transition-colors font-medium">App Experience</a>
              </div>
            </div>

            {/* Customer Service Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                <span>Customer Service</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 w-56 mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <a href="#claims" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-700 transition-colors font-medium">Submit / Track Claim</a>
                <a href="#faq" className="block p-2.5 rounded-xl hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-700 transition-colors font-medium">FAQs</a>
              </div>
            </div>

            {/* Careers Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                <span>Careers</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 group-hover:rotate-180" />
              </button>
            </div>
          </nav>

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

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"

            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-indigo-700 bg-indigo-50"
          >
            Home
          </Link>

          <div className="space-y-1 pl-3 border-l-2 border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider py-1">Products</div>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenQuoteModal?.("Motor"); }}
              className="block w-full text-left px-2 py-1.5 text-sm text-slate-700 font-medium hover:text-indigo-600"
            >
              Motor Insurance
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenQuoteModal?.("Travel"); }}
              className="block w-full text-left px-2 py-1.5 text-sm text-slate-700 font-medium hover:text-indigo-600"
            >
              Travel Insurance
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenQuoteModal?.("Life"); }}
              className="block w-full text-left px-2 py-1.5 text-sm text-slate-700 font-medium hover:text-indigo-600"
            >
              Life Insurance
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenQuoteModal?.("Visit Visa"); }}
              className="block w-full text-left px-2 py-1.5 text-sm text-slate-700 font-medium hover:text-indigo-600"
            >
              Visit Visa Insurance
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button className="flex items-center space-x-1.5 text-sm font-medium text-slate-700">
              <Globe className="w-4 h-4 text-slate-500" />
              <span>English (EN)</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAuthModal?.(); }}
              className="bg-[#3B25B0] text-white px-4 py-2 rounded-xl text-sm font-semibold"
            >
              Login / Register
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
