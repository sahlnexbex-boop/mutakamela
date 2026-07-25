"use client";

import { Zap, Globe2, ShieldCheck, HeartHandshake, Users } from "lucide-react";

export default function WhyUs() {
  const pillars = [
    {
      title: "Fast Claims",
      desc: "Quick and hassle-free claim settlement",
      icon: Zap,
    },
    {
      title: "Wide Network",
      desc: "Access to 1,200+ hospitals across Saudi Arabia",
      icon: Globe2,
    },
    {
      title: "Digital First",
      desc: "Simple and secure digital experience",
      icon: ShieldCheck,
    },
    {
      title: "Trusted Insurer",
      desc: "Backed by strong financial strength",
      icon: HeartHandshake,
    },
    {
      title: "Customer First",
      desc: "24/7 support and dedicated care",
      icon: Users,
    },
  ];

  return (
    <section id="why-us" className="py-8 lg:py-12 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

        {/* Banner Container matching Image 1 */}
        <div
          className="bg-[#2821A6] rounded-3xl p-8 sm:p-12 text-white shadow-soft-lg relative overflow-hidden"
          data-gsap="fade-up"
        >
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="mb-10 text-left">
            <div className="text-xs font-bold uppercase tracking-widest text-indigo-200/90 mb-2">
              WHY MUTAKAMELA
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Insurance you can <span className="text-sky-300">trust</span>
            </h2>
          </div>

          {/* 5 Pillars Row (Clean Circular Blue Icon Badges matching Image 1) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8" data-gsap="stagger">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  data-gsap-item
                  className="flex items-start space-x-3.5 group"
                >
                  {/* Circular Blue Icon Badge */}
                  <div className="w-12 h-12 rounded-full bg-[#1A82FF] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white mb-1">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-indigo-100/90 leading-normal font-normal">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
