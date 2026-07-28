"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Testimonials() {
  const { t } = useTranslation();

  const testimonials = [
    {
      id: 1,
      name: t("test1Name"),
      location: t("test1Role"),
      rating: 5.0,
      avatar: "/images/user_01.png",
      quote: t("test1Text"),
    },
    {
      id: 2,
      name: t("test2Name"),
      location: t("test2Role"),
      rating: 5.0,
      avatar: "/images/user_02.png",
      quote: t("test2Text"),
    },
    {
      id: 3,
      name: t("test3Name"),
      location: t("test3Role"),
      rating: 5.0,
      avatar: "/images/user_03.png",
      quote: t("test3Text"),
    },
  ];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  const handlePrev = () => {
    if (scrollContainerRef.current) {
      const step = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollBy({ left: -step, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (scrollContainerRef.current) {
      const step = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollBy({ left: step, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = scrollContainerRef.current.offsetWidth || 1;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveDot(Math.min(Math.max(index, 0), testimonials.length - 1));
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-white relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12" data-gsap="fade-up">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#3B25B0] mb-2">
              {t("customerStories")}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t("whatClientsSay")}
            </h2>
          </div>

          {/* Carousel Arrows */}
          <div className="hidden sm:flex items-center space-x-3 shrink-0">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border border-slate-200 hover:border-[#3B25B0] hover:bg-indigo-50 text-slate-600 hover:text-[#3B25B0] flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-slate-200 hover:border-[#3B25B0] hover:bg-indigo-50 text-slate-600 hover:text-[#3B25B0] flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3 Testimonials Side-Scrolling on Mobile (Full View), Grid on Desktop */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex md:grid overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:grid-cols-3 gap-6 pb-4 md:pb-0 scrollbar-none"
          data-gsap="stagger"
        >
          {testimonials.map((item) => (
            <div
              key={item.id}
              data-gsap-item
              className="shrink-0 w-full md:w-auto snap-center bg-white rounded-3xl p-6 border border-slate-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">

                {/* Quote Icon Graphic & Rating */}
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 relative shrink-0">
                    <Image
                      src="/images/testi_quates.png"
                      alt="Quote"
                      width={32}
                      height={32}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1">5.0</span>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-3 pt-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-100 relative shrink-0">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{item.name}</h3>
                    <p className="text-xs text-[#3B25B0] font-medium">{item.location}</p>
                  </div>
                </div>

                {/* Quote Body */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-2">
                  {item.quote}
                </p>

              </div>
            </div>
          ))}
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex md:hidden items-center justify-center space-x-2 mt-4">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (scrollContainerRef.current) {
                  const width = scrollContainerRef.current.offsetWidth;
                  scrollContainerRef.current.scrollTo({
                    left: idx * width,
                    behavior: "smooth",
                  });
                }
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeDot === idx ? "w-7 bg-[#3B25B0]" : "w-2.5 bg-slate-200"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
