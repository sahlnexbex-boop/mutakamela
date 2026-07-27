"use client";

import { useState } from "react";
import { RefreshCw, FileSearch, CreditCard, Stethoscope, ChevronRight, Bot, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface QuickActionsProps {
  onSelectAction?: (action: string) => void;
}

export default function QuickActions({ onSelectAction }: QuickActionsProps) {
  const { t } = useTranslation();
  const [showAiChat, setShowAiChat] = useState(false);

  const actions = [
    {
      id: "renew",
      title: t("renewPolicy"),
      subtitle: t("renewSub"),
      icon: RefreshCw,
    },
    {
      id: "track",
      title: t("trackClaims"),
      subtitle: t("trackSub"),
      icon: FileSearch,
    },
    {
      id: "payment",
      title: t("payBills"),
      subtitle: t("paySub"),
      icon: CreditCard,
    },
    {
      id: "medical",
      title: t("medicalApproval"),
      subtitle: t("medicalSub"),
      icon: Stethoscope,
    },
  ];

  return (
    <section className="relative -mt-6 sm:-mt-8 lg:-mt-10 mb-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 md:mt-10 mt-5">

        {/* Quick Action Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-slate-100" data-gsap="fade-up">

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
            {t("whatWouldYouLikeToDo")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-gsap="stagger">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  data-gsap-item
                  onClick={() => onSelectAction?.(action.id)}
                  className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 bg-slate-50/50 hover:bg-indigo-50/40 transition-all duration-300 text-left rtl:text-right hover:shadow-md"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#3B25B0] group-hover:bg-[#3B25B0] group-hover:text-white flex items-center justify-center transition-colors duration-300 shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#3B25B0] transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {action.subtitle}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#3B25B0] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-all" />
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* Floating Customer Floating Badges (WhatsApp & AI Assistant) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/966118213000"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white flex items-center justify-center shadow-lg hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-110"
          title="Chat on WhatsApp"
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-white" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-0.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>

        {/* AI Assistant Floating Trigger - Same size as WhatsApp button (w-12 h-12 sm:w-13 sm:h-13) */}
        <button
          onClick={() => setShowAiChat(!showAiChat)}
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full relative group shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 transform hover:scale-110 flex items-center justify-center bg-white"
          title="Mutakamela AI Assistant"
        >
          {/* Rotating 75% Gradient Arc Ring */}
          <svg className="absolute -inset-[3px] w-[calc(100%+6px)] h-[calc(100%+6px)] animate-[spin_3.5s_linear_infinite] pointer-events-none" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="aiRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
              stroke="url(#aiRingGradient)"
              strokeWidth="4.5"
              strokeDasharray="212 71"
              strokeLinecap="round"
            />
          </svg>

          {/* Inner White Button */}
          <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center z-10">
            {/* AI Sparkle Icon matching 2nd image */}
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
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-[#3B25B0] text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm">Mutakamela AI Assistant</div>
                <div className="text-xs text-indigo-200">Online 24/7 Support</div>
              </div>
            </div>
            <button
              onClick={() => setShowAiChat(false)}
              className="text-indigo-200 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-3 h-64 overflow-y-auto bg-slate-50 text-xs text-slate-700">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 max-w-[85%]">
              Hello! 👋 How can I help you with your insurance today? You can ask about policies, claims, or instant quotes.
            </div>
          </div>

          <div className="p-3 border-t border-slate-100 bg-white flex gap-2">
            <input
              type="text"
              placeholder="Ask anything about insurance..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#3B25B0]"
            />
            <button className="bg-[#3B25B0] text-white px-3 py-2 rounded-xl font-semibold text-xs hover:bg-[#2F1F99]">
              Send
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
