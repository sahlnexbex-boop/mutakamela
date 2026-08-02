"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { DisplayStory, SectionDisplayCopy } from "@/lib/home/utils";

type Props = {
  copy?: SectionDisplayCopy;
  /** CMS-managed stories; falls back to i18n defaults when empty */
  stories?: DisplayStory[];
};

export default function Testimonials({ copy, stories: storiesProp }: Props) {
  const { t } = useTranslation();

  const testimonials = useMemo(() => {
    if (storiesProp && storiesProp.length > 0) return storiesProp;
    return [
      {
        id: "1",
        name: t("test1Name"),
        role: t("test1Role"),
        rating: 5,
        avatar: "/images/user_01.png",
        quote: t("test1Text"),
      },
      {
        id: "2",
        name: t("test2Name"),
        role: t("test2Role"),
        rating: 5,
        avatar: "/images/user_02.png",
        quote: t("test2Text"),
      },
      {
        id: "3",
        name: t("test3Name"),
        role: t("test3Role"),
        rating: 5,
        avatar: "/images/user_03.png",
        quote: t("test3Text"),
      },
    ] satisfies DisplayStory[];
  }, [storiesProp, t]);

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
      setActiveDot(Math.min(Math.max(index, 0), Math.max(testimonials.length - 1, 0)));
    }
  };

  if (testimonials.length === 0) return null;

  const gridClass =
    testimonials.length === 1
      ? "md:grid-cols-1 max-w-md mx-auto"
      : testimonials.length === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-3";

  return (
    <section className="py-16 lg:py-24 bg-white relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12" data-gsap="fade-up">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#3B25B0] mb-2">
              {copy?.badge || t("customerStories")}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {copy?.title || t("whatClientsSay")}
            </h2>
          </div>

          {testimonials.length > 1 && (
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
          )}
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className={`flex md:grid overflow-x-auto md:overflow-x-visible snap-x snap-mandatory ${gridClass} gap-6 pb-4 md:pb-0 scrollbar-none`}
          data-gsap="stagger"
        >
          {testimonials.map((item) => {
            const rating = typeof item.rating === "number" ? item.rating : 5;
            const filled = Math.round(rating);
            const ratingLabel = Number.isInteger(rating) ? `${rating}.0` : String(rating);
            const remoteAvatar =
              item.avatar.startsWith("http") || item.avatar.startsWith("/uploads/");

            return (
              <div
                key={item.id}
                data-gsap-item
                data-gsap-hover
                className="shrink-0 w-full md:w-auto snap-center bg-white rounded-3xl p-6 border border-slate-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
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
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < filled
                              ? "fill-amber-400 text-amber-400"
                              : "fill-transparent text-slate-200"
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-slate-700 ml-1">
                        {ratingLabel}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-100 relative shrink-0 bg-slate-100">
                      <Image
                        src={item.avatar || "/images/user_01.png"}
                        alt={item.name}
                        width={48}
                        height={48}
                        unoptimized={remoteAvatar}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{item.name}</h3>
                      {item.role ? (
                        <p className="text-xs text-[#3B25B0] font-medium">{item.role}</p>
                      ) : null}
                    </div>
                  </div>

                  {item.quote ? (
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-2">
                      {item.quote}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {testimonials.length > 1 && (
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
        )}
      </div>
    </section>
  );
}
