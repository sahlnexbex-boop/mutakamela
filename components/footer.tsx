"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#12162B] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8" data-gsap="fade-up">

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">

          {/* Brand Info & Socials */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo_footer.png"
                alt="Mutakamela Insurance Footer Logo"
                width={200}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal max-w-sm">
              {t("footerDesc")}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-slate-700 hover:border-indigo-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-slate-700 hover:border-indigo-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-slate-700 hover:border-indigo-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-slate-700 hover:border-indigo-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Products Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t("products")}</h3>
            <ul className="space-y-2 text-xs font-normal text-slate-400">
              <li><a href="#products" className="hover:text-white transition-colors">{t("motorInsurance")}</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">{t("travelInsurance")}</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">{t("lifeInsurance")}</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">{t("visitVisaInsurance")}</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t("support")}</h3>
            <ul className="space-y-2 text-xs font-normal text-slate-400">
              <li><a href="#claims" className="hover:text-white transition-colors">{t("claims")}</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">{t("customerService")}</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t("legal")}</h3>
            <ul className="space-y-2 text-xs font-normal text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">{t("privacyPolicy")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("termsConditions")}</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t("contact")}</h3>
            <ul className="space-y-2.5 text-xs font-normal text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+966 11 8213000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>customerservice@mutakamela.sa</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>{t("sunThu")}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            {t("rights")}
          </div>
          <div className="flex items-center gap-1">
            <span>{t("designedBy")}</span>
            <span className="text-white font-bold tracking-tight">nexbex</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
