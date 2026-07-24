"use client";

import Image from "next/image";
import { Car, Plane, HeartHandshake, FileCheck, Building2, ChevronRight } from "lucide-react";

interface ProductsSectionProps {
  onOpenQuoteModal?: (productTitle: string) => void;
}

export default function ProductsSection({ onOpenQuoteModal }: ProductsSectionProps) {
  const products = [
    {
      id: "motor",
      title: "Motor Insurance",
      description: "Protect your family's future with flexible vehicle coverage.",
      image: "/images/products_01.png",
      icon: Car,
    },
    {
      id: "travel",
      title: "Travel Insurance",
      description: "Mandatory medical coverage for visitors entering Saudi Arabia.",
      image: "/images/products_02.png",
      icon: Plane,
    },
    {
      id: "life",
      title: "Life Insurance",
      description: "Secure your family's future today. Give your loved ones lasting protection.",
      image: "/images/products_03.png",
      icon: HeartHandshake,
    },
    {
      id: "visa",
      title: "Visit Visa Insurance",
      description: "Mandatory cover for Saudi visit visa. Simple, fast and trusted protection.",
      image: "/images/products_04.png",
      icon: FileCheck,
    },
    {
      id: "general",
      title: "General Insurance",
      description: "Property and business protection. Simple coverage for every need.",
      image: "/images/products_05.png",
      icon: Building2,
    },
  ];

  return (
    <section id="products" className="py-12 lg:py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

        <div className="grid grid-cols-1 lg:grid-cols-14 gap-8 items-start">

          {/* Left Column: Heading Stack & Link */}
          <div className="lg:col-span-3 space-y-6 pt-2" data-gsap="fade-up">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#3B25B0] mb-2">
                OUR PRODUCTS
              </div>

              <h2 className="text-2xl sm:text-2.5xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
                Comprehensive protection for every need
              </h2>

              <p className="text-slate-500 text-xs sm:text-sm mt-3 font-normal leading-relaxed">
                Flexible protection across every life stage and need
              </p>
            </div>

            <div>
              <a
                href="#products"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#3B25B0] hover:text-[#2F1F99] transition-colors"
              >
                <span>View all products</span>
                <ChevronRight className="w-3.5 h-3.5" />
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
                    className="group bg-white rounded-3xl border border-slate-100/90 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Top Card Info */}
                    <div className="p-4 space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#3B25B0] text-white flex items-center justify-center shadow-md">
                        <Icon className="w-4 h-4" />
                      </div>

                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#3B25B0] transition-colors leading-tight">
                        {product.title}
                      </h3>

                      <p className="text-[11px] text-slate-400 leading-normal font-normal line-clamp-3">
                        {product.description}
                      </p>

                      <button
                        onClick={() => onOpenQuoteModal?.(product.title)}
                        className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#3B25B0] hover:underline pt-0.5"
                      >
                        <span>Get a Quote</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Bottom Image Graphic - Set object-contain & flexible height for 100% full view on mobile & desktop */}
                    <div className="relative w-full h-44 sm:h-36 mt-1 bg-slate-50/40 overflow-hidden flex items-end justify-center p-1">
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={280}
                        height={180}
                        className="w-full h-full object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
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
