"use client";

import Image from "next/image";

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Choose Your Insurance",
      description: "Select the insurance type that suits your needs – Motor, Travel, Life or Visit Visa Insurance.",
      image: "/images/works_01.png",
    },
    {
      step: 2,
      title: "Fill in Your Details",
      description: "Provide a few basic details about yourself and your requirements.",
      image: "/images/works_02.png",
    },
    {
      step: 3,
      title: "Get Instant Quote",
      description: "We'll instantly show you the best plan options and price that match your needs.",
      image: "/images/works_03.png",
    },
    {
      step: 4,
      title: "Buy & Get Protected",
      description: "Choose your plan, make payment securely and get your policy instantly.",
      image: "/images/works_04.png",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16" data-gsap="fade-up">
          <div className="text-xs font-extrabold uppercase tracking-widest text-[#3B25B0] mb-2">
            HOW IT WORKS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Simple steps to get protected
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 font-normal">
            Insurance made simple, fast and reliable.
          </p>
        </div>

        {/* 4 Steps Timeline */}
        <div className="relative">

          {/* Desktop Connecting Dotted Line */}
          <div className="hidden lg:block absolute top-24 left-1/8 right-1/8 h-0.5 border-t-2 border-dashed border-indigo-200 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10" data-gsap="stagger">
            {steps.map((item) => (
              <div
                key={item.step}
                data-gsap-item
                className="flex flex-col items-center text-center space-y-4 group"
              >

                {/* Circular Graphic & Number Badge */}
                <div className="relative">
                  <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-white  group-hover:scale-105 transition-all duration-300 bg-slate-50 flex items-center justify-center">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={180}
                      height={180}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Step Number Circle */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#3B25B0] text-white font-black text-sm flex items-center justify-center border-4 border-white shadow-md">
                    {item.step}
                  </div>
                </div>

                {/* Step Text Info */}
                <div className="pt-2 max-w-xs">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#3B25B0] transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
