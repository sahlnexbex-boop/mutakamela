"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { DisplayFaq, SectionDisplayCopy } from "@/lib/home/utils";

type Props = {
  copy?: SectionDisplayCopy;
  /** CMS-managed FAQ items; falls back to i18n defaults when empty */
  items?: DisplayFaq[];
};

export default function FaqSection({ copy, items }: Props) {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = useMemo(() => {
    if (items && items.length > 0) return items;
    return [
      { id: "1", question: t("q1"), answer: t("a1") },
      { id: "2", question: t("q2"), answer: t("a2") },
      { id: "3", question: t("q3"), answer: t("a3") },
      { id: "4", question: t("q4"), answer: t("a4") },
    ] satisfies DisplayFaq[];
  }, [items, t]);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="py-16 lg:py-24 bg-[#F0EFFD] relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-5 space-y-6" data-gsap="fade-up">
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#3B25B0]">
              {copy?.badge || t("faqs")}
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {copy?.title || t("faqTitle")}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              {copy?.subtitle || t("faqSubtitle")}
            </p>

            <div className="relative pt-4 flex justify-center lg:justify-start" data-gsap="scale">
              <Image
                src={copy?.imageUrl || "/images/faq.png"}
                alt="Frequently Asked Questions"
                width={380}
                height={380}
                unoptimized={Boolean(copy?.imageUrl && !copy.imageUrl.startsWith("/images/"))}
                className="w-72 sm:w-80 h-auto object-contain home-float-soft"
              />
            </div>
          </div>

          <div className="lg:col-span-7" data-gsap="fade-up">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-indigo-50 divide-y divide-slate-100">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={faq.id} className="py-4 first:pt-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between text-left py-2 focus:outline-none group"
                    >
                      <span className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#3B25B0] transition-colors pe-3">
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-[#3B25B0] shrink-0 transition-transform duration-200" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-[#3B25B0] shrink-0 transition-transform duration-200" />
                      )}
                    </button>

                    {isOpen && faq.answer ? (
                      <div className="home-faq-answer pt-2 pb-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {faq.answer}
                      </div>
                    ) : null}
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
