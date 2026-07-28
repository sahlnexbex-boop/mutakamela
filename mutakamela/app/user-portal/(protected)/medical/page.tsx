"use client";

import { useState } from "react";
import {
  ChevronDown,
  Check,
  MapPin,
  Building,
  Building2,
  Stethoscope,
  Pill,
  Headphones
} from "lucide-react";

export default function MedicalNetworkRoutePage() {
  const [selectedCity, setSelectedCity] = useState("Riyadh");

  const featuredProviders = [
    {
      id: 1,
      name: "Saudi German Hospital",
      city: "Riyadh",
      badge: "Mutakamela Gold",
      tags: ["Cardiology", "Orthopedics", "Pediatrics"],
      rating: 4.8,
      distance: "2.5 km",
      address: "Riyadh, Olaya Street",
      image: "/images/products_05.png",
      mapQuery: "Saudi+German+Hospital+Riyadh",
    },
    {
      id: 2,
      name: "King Faisal Specialist Hospital",
      city: "Riyadh",
      badge: "Mutakamela Gold",
      tags: ["Oncology", "Neurology", "Cardiology"],
      rating: 4.9,
      distance: "4.1 km",
      address: "Riyadh, Al Maather",
      image: "/images/products_05.png",
      mapQuery: "King+Faisal+Specialist+Hospital+Riyadh",
    },
    {
      id: 3,
      name: "Al Noor Medical Complex",
      city: "Jeddah",
      badge: "Mutakamela Gold",
      tags: ["Dermatology", "Pediatrics", "Dental"],
      rating: 4.7,
      distance: "6.0 km",
      address: "Jeddah, Al Hamra",
      image: "/images/products_05.png",
      mapQuery: "Al+Noor+Medical+Complex+Jeddah",
    },
    {
      id: 4,
      name: "Capital Medical Center",
      city: "Riyadh",
      badge: "Mutakamela Gold",
      tags: ["Orthopedics", "Sports medicine"],
      rating: 4.6,
      distance: "3.2 km",
      address: "Riyadh, Al Malaz",
      image: "/images/products_05.png",
      mapQuery: "Capital+Medical+Center+Riyadh",
    },
    {
      id: 5,
      name: "Smile Dental Center",
      city: "Dammam",
      badge: "Mutakamela Gold",
      tags: ["General dental", "Orthodontics"],
      rating: 4.8,
      distance: "1.8 km",
      address: "Dammam, Corniche",
      image: "/images/products_05.png",
      mapQuery: "Smile+Dental+Center+Dammam",
    },
    {
      id: 6,
      name: "Al Noor Medical Complex",
      city: "Jeddah",
      badge: "Mutakamela Gold",
      tags: ["Ophthalmology", "LASIK", "Optical"],
      rating: 4.7,
      distance: "5.4 km",
      address: "Jeddah, Al Rawdah",
      image: "/images/products_05.png",
      mapQuery: "Al+Noor+Medical+Complex+Jeddah",
    },
  ];

  const [activeProvider, setActiveProvider] = useState(featuredProviders[0]);

  return (
    <div className="space-y-8">

      {/* 1. TOP BANNER HERO & SEARCH CARD (40% Content & 60% Form Model) */}
      <div className="bg-gradient-to-br from-[#2e289e] to-[#6F66F4] rounded-3xl p-6 sm:p-8 text-white flex flex-col lg:flex-row items-stretch justify-between gap-8 shadow-xl relative overflow-hidden">
        
        {/* Left Side Content (40% Width) */}
        <div className="w-full lg:w-[40%] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="bg-white/15 backdrop-blur-md text-white text-xs font-normal px-3.5 py-1.5 rounded-full inline-block">
                Mutakamela healthcare network
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
              Find a healthcare provider near you
            </h1>
            <p className="text-xs sm:text-sm text-white/80 font-normal leading-relaxed">
              Search hospitals, clinics, pharmacies and medical centers within your insurance network.
            </p>
          </div>

          {/* Bottom Specs Row (Clean Spaced Text) */}
          <div className="flex items-center gap-6 text-xs font-semibold text-white/90 pt-4">
            <span>1,200+ providers</span>
            <span>Direct billing</span>
            <span>24/7 support</span>
          </div>
        </div>

        {/* Right Side White Search Card (60% Width Model) */}
        <div className="w-full lg:w-[60%] bg-white text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 border border-slate-100 flex flex-col justify-between shrink-0">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-2">Search</label>
              <input
                type="text"
                placeholder="Search hospitals, doctors, or specialties"
                className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <ShadcnSelect
              value={selectedCity}
              onChange={setSelectedCity}
              options={["Riyadh", "Jeddah", "Dammam", "Al Khobar", "Makkah", "Madinah"]}
            />
          </div>

          {/* Search Button (Right-Aligned in Image 1 Model) */}
          <div className="flex justify-end pt-2">
            <button className="bg-[#1E65FF] hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer">
              Search Providers
            </button>
          </div>
        </div>
      </div>

      {/* 2. FEATURED HEALTHCARE PROVIDERS */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-[#1C2541]">Featured healthcare providers</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredProviders.map((provider) => (
            <div
              key={provider.id}
              onClick={() => setActiveProvider(provider)}
              className={`bg-white rounded-3xl p-5 border shadow-xs hover:shadow-md transition-all duration-200 space-y-4 cursor-pointer group ${
                activeProvider.id === provider.id ? "border-[#2563EB] ring-2 ring-blue-500/20" : "border-slate-100"
              }`}
            >
              <div className="space-y-1.5">
                <h3 className="font-semibold text-base text-[#1C2541] tracking-tight group-hover:text-[#2563EB] transition-colors">
                  {provider.name}
                </h3>
                <p className="text-xs text-[#8C94A6] font-normal">{provider.city}</p>
                <div>
                  <span className="bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7] text-[11px] font-semibold px-2.5 py-0.5 rounded-md inline-block">
                    {provider.badge}
                  </span>
                </div>
              </div>

              {/* Specialty Tag Pills */}
              <div className="flex flex-wrap gap-1.5">
                {provider.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                  View details
                </button>
                <button className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Directions</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CLEAN GOOGLE MAPS */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-[#1C2541]">Network map</h2>

        <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-md h-[480px] sm:h-[540px] bg-slate-100">
          <iframe
            title="Google Maps Healthcare Network"
            src={`https://maps.google.com/maps?q=${activeProvider.mapQuery || 'Saudi+German+Hospital+Riyadh'}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>

      {/* 4. BOTTOM NETWORK STATS BAR */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs grid grid-cols-2 sm:grid-cols-5 gap-6 text-center">
        <div className="space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-[#1C2541]">1,200+</div>
          <p className="text-xs text-slate-500 font-normal">Network Providers</p>
        </div>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
            <Building className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-[#1C2541]">250+</div>
          <p className="text-xs text-slate-500 font-normal">Hospitals</p>
        </div>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-[#1C2541]">700+</div>
          <p className="text-xs text-slate-500 font-normal">Clinics</p>
        </div>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
            <Pill className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-[#1C2541]">150+</div>
          <p className="text-xs text-slate-500 font-normal">Pharmacies</p>
        </div>

        <div className="space-y-1 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
            <Headphones className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-[#1C2541]">24/7</div>
          <p className="text-xs text-slate-500 font-normal">Support Available</p>
        </div>
      </div>

    </div>
  );
}

{/* CUSTOM SHADCN-STYLE SELECT DROPDOWN COMPONENT */}
function ShadcnSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-xs sm:text-sm font-semibold text-slate-800 flex items-center justify-between hover:bg-slate-50/80 transition-colors focus:outline-none focus:ring-1 focus:ring-[#2563EB] cursor-pointer"
      >
        <span>{value}</span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-2xl shadow-xl p-1 z-40 animate-in fade-in zoom-in-95 duration-150 max-h-56 overflow-y-auto">
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
                  value === opt ? "bg-blue-50 text-[#2563EB]" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{opt}</span>
                {value === opt && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
