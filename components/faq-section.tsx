"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FaqSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: t("q1"),
      answer: t("a1"),
    },
    {
      question: t("q2"),
      answer: t("a2"),
    },
    {
      question: t("q3"),
      answer: t("a3"),
    },
    {
      question: t("q4"),
      answer: t("a4"),
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 lg:py-24 bg-[#F0EFFD] relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Text & 3D Illustration */}
          <div className="lg:col-span-5 space-y-6" data-gsap="fade-up">
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#3B25B0]">
              {t("faqs")}
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t("faqTitle")}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              {t("faqSubtitle")}
            </p>

            <div className="relative pt-4 flex justify-center lg:justify-start" data-gsap="scale">
              <Image
                src="/images/faq.png"
                alt="Frequently Asked Questions"
                width={380}
                height={380}
                className="w-72 sm:w-80 h-auto object-contain"
              />
            </div>
          </div>

          {/* Right Column: Accordion Card */}
          <div className="lg:col-span-7" data-gsap="fade-up">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-indigo-50 divide-y divide-slate-100">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={index} className="py-4 first:pt-0 last:pb-0">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between text-left py-2 focus:outline-none group"
                    >
                      <span className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#3B25B0] transition-colors">
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-[#3B25B0] shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-[#3B25B0] shrink-0 transition-transform" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="pt-2 pb-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal animate-in fade-in slide-in-from-top-1 duration-200">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
