"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How can I get a quote?",
      answer: "You can get a quote by choosing your insurance type, filling in your details, and receiving an instant quote online. It only takes a few minutes.",
    },
    {
      question: "How do I renew my policy?",
      answer: "You can easily renew your policy through our website or mobile app. Simply enter your policy number or Civil ID, review your details, and complete payment in minutes.",
    },
    {
      question: "How can I submit a claim?",
      answer: "Submit claims seamlessly online or via our mobile app by uploading supporting documents and incident photos. Our team reviews and settles claims quickly.",
    },
    {
      question: "Can I track my claim online?",
      answer: "Yes! Use our real-time claim tracker on the website or app using your claim reference number to check every step of the approval and payout process.",
    },
    {
      question: "Is visit visa insurance mandatory?",
      answer: "Yes, medical insurance is mandatory for all visitors entering the Kingdom of Saudi Arabia. It covers emergency medical care and hospital stays.",
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
              FAQ
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Frequently asked questions
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              Find quick answers to the most common questions about our insurance services.
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
