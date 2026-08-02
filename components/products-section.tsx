"use client";

import Image from "next/image";
import { Car, Plane, HeartHandshake, FileCheck, Building2, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { SectionDisplayCopy } from "@/lib/home/utils";

interface ProductsSectionProps {
  onOpenQuoteModal?: (productTitle: string) => void;
  copy?: SectionDisplayCopy;
}

export default function ProductsSection({ onOpenQuoteModal, copy }: ProductsSectionProps) {
  const { t } = useTranslation();

  const products = [
    {
      id: "motor",
      title: t("motorInsurance"),
      description: t("motorBody"),
      image: "/images/products_01.png",
      icon: Car,
    },
    {
      id: "travel",
      title: t("travelInsurance"),
      description: t("travelBody"),
      image: "/images/products_02.png",
      icon: Plane,
    },
    {
      id: "life",
      title: t("lifeInsurance"),
      description: t("lifeBody"),
      image: "/images/products_03.png",
      icon: HeartHandshake,
    },
    {
      id: "visa",
      title: t("visitVisaInsurance"),
      description: t("visitVisaBody"),
      image: "/images/products_04.png",
      icon: FileCheck,
    },
    {
      id: "general",
      title: t("generalProperty"),
      description: t("tailoredForNeeds"),
      image: "/images/products_05.png",
      icon: Building2,
    },
  ];

  return (
    <section id="products" className="py-12 lg:py-16 bg-white relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

        <div className="grid grid-cols-1 lg:grid-cols-14 gap-8 items-start">

          {/* Left Column: Heading Stack & Link */}
          <div className="lg:col-span-3 space-y-6 pt-2" data-gsap="fade-up">
            <div>
              <div className="text-xs md:text-md font-extrabold uppercase tracking-wider text-[#3B25B0] mb-2">
                {copy?.title || t("ourInsuranceProducts")}
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
                {copy?.title || t("ourInsuranceProducts")}
              </h2>

              <p className="text-slate-600 text-sm sm:text-sm mt-3 font-normal leading-relaxed">
                {copy?.subtitle || t("tailoredForNeeds")}
              </p>
            </div>

            <div>
              <a
                href="#products"
                className="inline-flex items-center gap-1 text-sm sm:text-xs font-bold text-[#3B25B0] hover:text-[#2F1F99] transition-colors"
              >
                <span>{t("ourInsuranceProducts")}</span>
                <ChevronRight className="w-4 h-4 sm:w-3.5 sm:h-3.5 rtl:rotate-180" />
              </a>
            </div>
          </div>

          {/* Right Column: 5 Product Cards */}
          <div className="lg:col-span-11" data-gsap="stagger">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {products.map((product) => {
                const Icon = product.icon;
                return (
                  <div
                    key={product.id}
                    data-gsap-item
                    data-gsap-hover
                    className="group bg-white rounded-3xl border border-slate-100/90 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden relative min-h-[220px] sm:min-h-0"
                  >
                    {/* Card Content Info - Layered in FRONT on Z-axis (z-10) */}
                    <div className="p-5 sm:p-4 space-y-3.5 sm:space-y-2.5 relative z-10">
                      <div className="w-11 h-11 sm:w-9 sm:h-9 rounded-xl bg-[#3B25B0] text-white flex items-center justify-center shadow-md">
                        <Icon className="w-5.5 h-5.5 sm:w-4 sm:h-4" />
                      </div>

                      <h3 className="text-base sm:text-xs font-bold text-slate-900 group-hover:text-[#3B25B0] transition-colors leading-snug">
                        {product.title}
                      </h3>

                      <p className="text-sm sm:text-[11px] text-slate-600 leading-relaxed font-normal line-clamp-3 max-w-[80%] sm:max-w-none">
                        {product.description}
                      </p>

                      <button
                        onClick={() => onOpenQuoteModal?.(product.title)}
                        className="inline-flex items-center gap-1 text-sm sm:text-[11px] font-bold text-[#3B25B0] hover:underline pt-0.5"
                      >
                        <span>{t("getQuoteNow")}</span>
                        <ChevronRight className="w-4 h-4 sm:w-3 sm:h-3 rtl:rotate-180" />
                      </button>
                    </div>

                    {/* Image Graphic - Card background model on Z-axis for mobile screens (z-0) */}
                    <div className="absolute bottom-0 right-0 sm:relative sm:bottom-auto sm:right-auto z-0 w-48 sm:w-full h-36 sm:h-32 lg:h-36 bg-transparent sm:bg-slate-50/40 overflow-hidden flex items-end justify-end sm:justify-center p-2 sm:p-1.5 pointer-events-none sm:pointer-events-auto">
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={280}
                        height={180}
                        className="w-full h-full object-contain object-bottom transition-transform duration-500 group-hover:scale-105 opacity-80 sm:opacity-100"
                      />
                    </div>
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
