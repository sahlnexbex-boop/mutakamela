"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const [selectedCity, setSelectedCity] = useState(isAr ? "الرياض" : "Riyadh");

  const featuredProviders = [
    {
      id: 1,
      name: isAr ? "مستشفى السعودي الألماني" : "Saudi German Hospital",
      city: isAr ? "الرياض" : "Riyadh",
      badge: t("goldNetwork"),
      tags: [isAr ? "أمراض القلب" : "Cardiology", isAr ? "عظام" : "Orthopedics", isAr ? "أطفال" : "Pediatrics"],
      rating: 4.8,
      distance: "2.5 km",
      address: isAr ? "الرياض، شارع العليا" : "Riyadh, Olaya Street",
      image: "/images/products_05.png",
      mapQuery: "Saudi+German+Hospital+Riyadh",
    },
    {
      id: 2,
      name: isAr ? "مستشفى الملك فيصل التخصصي" : "King Faisal Specialist Hospital",
      city: isAr ? "الرياض" : "Riyadh",
      badge: t("goldNetwork"),
      tags: [isAr ? "أورام" : "Oncology", isAr ? "أعصاب" : "Neurology", isAr ? "أمراض القلب" : "Cardiology"],
      rating: 4.9,
      distance: "4.1 km",
      address: isAr ? "الرياض، المعذر" : "Riyadh, Al Maather",
      image: "/images/products_05.png",
      mapQuery: "King+Faisal+Specialist+Hospital+Riyadh",
    },
    {
      id: 3,
      name: isAr ? "مجمع النور الطبي" : "Al Noor Medical Complex",
      city: isAr ? "جدة" : "Jeddah",
      badge: t("goldNetwork"),
      tags: [isAr ? "جلدية" : "Dermatology", isAr ? "أطفال" : "Pediatrics", isAr ? "أسنان" : "Dental"],
      rating: 4.7,
      distance: "6.0 km",
      address: isAr ? "جدة، الحمراء" : "Jeddah, Al Hamra",
      image: "/images/products_05.png",
      mapQuery: "Al+Noor+Medical+Complex+Jeddah",
    },
    {
      id: 4,
      name: isAr ? "مركز كابيتال الطبي" : "Capital Medical Center",
      city: isAr ? "الرياض" : "Riyadh",
      badge: t("goldNetwork"),
      tags: [isAr ? "عظام" : "Orthopedics", isAr ? "طب رياضي" : "Sports medicine"],
      rating: 4.6,
      distance: "3.2 km",
      address: isAr ? "الرياض، الملز" : "Riyadh, Al Malaz",
      image: "/images/products_05.png",
      mapQuery: "Capital+Medical+Center+Riyadh",
    },
    {
      id: 5,
      name: isAr ? "مركز ابتسامة لطب الأسنان" : "Smile Dental Center",
      city: isAr ? "الدمام" : "Dammam",
      badge: t("goldNetwork"),
      tags: [isAr ? "أسنان عام" : "General dental", isAr ? "تقويم الأسنان" : "Orthodontics"],
      rating: 4.8,
      distance: "1.8 km",
      address: isAr ? "الدمام، الكورنيش" : "Dammam, Corniche",
      image: "/images/products_05.png",
      mapQuery: "Smile+Dental+Center+Dammam",
    },
    {
      id: 6,
      name: isAr ? "مجمع النور للعيون" : "Al Noor Medical Complex",
      city: isAr ? "جدة" : "Jeddah",
      badge: t("goldNetwork"),
      tags: [isAr ? "طب العيون" : "Ophthalmology", isAr ? "تصحيح النظر" : "LASIK", isAr ? "عيون" : "Optical"],
      rating: 4.7,
      distance: "5.4 km",
      address: isAr ? "جدة، الروضة" : "Jeddah, Al Rawdah",
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
                {t("mutakamelaNetworkBadge")}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
              {t("findHealthcareProvider")}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 font-normal leading-relaxed">
              {t("searchMedicalSub")}
            </p>
          </div>

          {/* Bottom Specs Row (Clean Spaced Text) */}
          <div className="flex items-center gap-6 text-xs font-semibold text-white/90 pt-4">
            <span>{isAr ? "+1,200 مزود خدمة" : "1,200+ providers"}</span>
            <span>{t("directBillingBadge")}</span>
            <span>{t("support247Badge")}</span>
          </div>
        </div>

        {/* Right Side White Search Card (60% Width Model) */}
        <div className="w-full lg:w-[60%] bg-white text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 border border-slate-100 flex flex-col justify-between shrink-0">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-2">{t("searchLabel")}</label>
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <ShadcnSelect
              value={selectedCity}
              onChange={setSelectedCity}
              options={isAr ? ["الرياض", "جدة", "الدمام", "الخبر", "مكة المكرمة", "المدينة المنورة"] : ["Riyadh", "Jeddah", "Dammam", "Al Khobar", "Makkah", "Madinah"]}
            />
          </div>

          {/* Search Button (Right-Aligned in Image 1 Model) */}
          <div className="flex justify-end pt-2">
            <button className="bg-[#1E65FF] hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer">
              {t("searchProvidersBtn")}
            </button>
          </div>
        </div>
      </div>

      {/* 2. FEATURED HEALTHCARE PROVIDERS */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-[#1C2541]">{t("featuredProvidersHeader")}</h2>

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
                  {t("viewDetails")}
                </button>
                <button className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t("directionsBtn")}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CLEAN GOOGLE MAPS */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-[#1C2541]">{isAr ? "خريطة الشبكة الطبية" : "Network map"}</h2>

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
          <div className="text-xl sm:text-2xl font-semibold text-[#1C2541]">+1,200</div>
          <p className="text-xs text-slate-500 font-normal">{isAr ? "مزود خدمة في الشبكة" : "Network Providers"}</p>
        </div>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
            <Building className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-[#1C2541]">+250</div>
          <p className="text-xs text-slate-500 font-normal">{isAr ? "مستشفى" : "Hospitals"}</p>
        </div>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-[#1C2541]">+700</div>
          <p className="text-xs text-slate-500 font-normal">{isAr ? "عيادة ومجمع طبي" : "Clinics"}</p>
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
