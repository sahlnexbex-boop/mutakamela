"use client";

import { useState } from "react";
import { RefreshCw, FileSearch, CreditCard, Stethoscope, ChevronRight, MessageCircle, Bot, X } from "lucide-react";

interface QuickActionsProps {
  onSelectAction?: (action: string) => void;
}

export default function QuickActions({ onSelectAction }: QuickActionsProps) {
  const [showAiChat, setShowAiChat] = useState(false);

  const actions = [
    {
      id: "renew",
      title: "Renew Policy",
      subtitle: "Renew your policy",
      icon: RefreshCw,
    },
    {
      id: "track",
      title: "Track a Claim",
      subtitle: "Check claim status",
      icon: FileSearch,
    },
    {
      id: "payment",
      title: "Make a Payment",
      subtitle: "Pay your premium",
      icon: CreditCard,
    },
    {
      id: "medical",
      title: "Find Medical Provider",
      subtitle: "Search hospitals & clinics",
      icon: Stethoscope,
    },
  ];

  return (
    <section className="relative z-20 -mt-16 sm:-mt-20 lg:-mt-24 mb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

        {/* Quick Action Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-slate-100" data-gsap="fade-up">

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
            What would you like to do today?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-gsap="stagger">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  data-gsap-item
                  onClick={() => onSelectAction?.(action.id)}
                  className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 bg-slate-50/50 hover:bg-indigo-50/40 transition-all duration-300 text-left hover:shadow-md"
                >
                  <div className="flex items-center space-x-3.5">
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

                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#3B25B0] group-hover:translate-x-1 transition-all" />
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
          className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-110"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
        </a>

        {/* AI Assistant Floating Trigger */}
        <button
          onClick={() => setShowAiChat(!showAiChat)}
          className="w-12 h-12 rounded-full bg-[#3B25B0] hover:bg-[#2F1F99] text-white flex items-center justify-center shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 transform hover:scale-110 relative"
          title="Mutakamela AI Assistant"
        >
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-sky-400 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-full border-2 border-white">
            AI
          </span>
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
