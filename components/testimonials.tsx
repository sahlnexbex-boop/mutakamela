"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Faisal Al-Qtaibi",
      location: "Riyadh",
      rating: 5.0,
      avatar: "/images/user_01.png",
      quote: `"The claims process was incredibly fast and hassle-free. I received full support from start to finish. Highly recommended!"`,
    },
    {
      id: 2,
      name: "Noura Al-Harbi",
      location: "Jeddah",
      rating: 5.0,
      avatar: "/images/user_02.png",
      quote: `"Renewing my policy took less than 5 minutes. The app is so easy to use and makes everything simple."`,
    },
    {
      id: 3,
      name: "Khalid Al-Shammari",
      location: "Dammam",
      rating: 5.0,
      avatar: "/images/user_03.png",
      quote: `"Excellent customer service and clear communication. I always feel secure with Mutakamela by my side."`,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-16 lg:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header with Navigation Controls */}
        <div className="flex items-end justify-between mb-12" data-gsap="fade-up">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#3B25B0] mb-2">
              TESTIMONIALS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Trusted by families and businesses across Saudi Arabia
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 font-normal">
              Real stories from real customers who trust Mutakamela.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-slate-200 hover:border-[#3B25B0] hover:bg-indigo-50 text-slate-600 hover:text-[#3B25B0] flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-slate-200 hover:border-[#3B25B0] hover:bg-indigo-50 text-slate-600 hover:text-[#3B25B0] flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3 Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-gsap="stagger">
          {testimonials.map((item) => (
            <div
              key={item.id}
              data-gsap-item
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">

                {/* Quote Icon & Rating */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 text-[#3B25B0] font-serif text-4xl leading-none">
                    “
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

      </div>
    </section>
  );
}
