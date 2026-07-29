"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

type ProductType = "motor" | "travel" | "visa" | "life" | "general";

export default function BuyInsuranceRoutePage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductType>("motor");
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  // Motor Form State
  const [vehicleMake, setVehicleMake] = useState("Toyota");
  const [vehicleModel, setVehicleModel] = useState("Camry");
  const [manufactureYear, setManufactureYear] = useState("2024");
  const [plateNumber, setPlateNumber] = useState("");
  const [vinNumber, setVinNumber] = useState("");
  const [registrationCity, setRegistrationCity] = useState("Riyadh");
  const [coverageType, setCoverageType] = useState<"comprehensive" | "third-party" | "collision">("comprehensive");

  // Travel Form State
  const [destination, setDestination] = useState("GCC countries");
  const [tripType, setTripType] = useState("Annual multi-trip");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travellers, setTravellers] = useState("1");
  const [travelNationality, setTravelNationality] = useState("Saudi");

  // Visit Visa Form State
  const [visitorNationality, setVisitorNationality] = useState("");
  const [visaType, setVisaType] = useState("Tourist");
  const [arrivalDate, setArrivalDate] = useState("");
  const [visaDuration, setVisaDuration] = useState("30 days");

  // Life Form State
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Male");
  const [lifeCoverage, setLifeCoverage] = useState("100,000");
  const [policyTerm, setPolicyTerm] = useState("10 years");
  const [smokerStatus, setSmokerStatus] = useState("Non-smoker");
  const [occupation, setOccupation] = useState("Engineer");

  // General Form State
  const [generalCategory, setGeneralCategory] = useState("Home & property");
  const [propertyValue, setPropertyValue] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [buildYear, setBuildYear] = useState("2020-2024");

  return (
    <div className="space-y-6 mx-auto">

      {/* 1. TOP HEADER & 4-STEP STEPPER ON THE SAME ROW (Middle/Center Aligned) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#1C2541]">{t("getAQuoteTitle")}</h1>
          <p className="text-xs sm:text-sm text-[#8C94A6] font-normal mt-0.5">{t("selectProductToBegin")}</p>
        </div>

        {/* 4-Step Stepper Bar on the SAME ROW (Middle/Center Aligned) */}
        <div className="flex items-center justify-between relative w-full lg:w-[480px] xl:w-[520px]">
          {/* Visible Middle Connector Line */}
          <div className="absolute top-4 left-6 right-6 h-[2px] bg-slate-300 z-0" />

          {/* Step 1 */}
          <div className="flex flex-col items-center gap-1 z-10 bg-[#F8F9FE] px-2">
            <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white font-semibold text-xs flex items-center justify-center shadow-md">
              1
            </div>
            <span className="text-[11px] font-semibold text-[#1C2541] whitespace-nowrap">{t("selectProduct")}</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-1 z-10 bg-[#F8F9FE] px-2">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-500 font-semibold text-xs flex items-center justify-center">
              2
            </div>
            <span className="text-[11px] font-normal text-slate-500 whitespace-nowrap">{t("yourDetails")}</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-1 z-10 bg-[#F8F9FE] px-2">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-500 font-semibold text-xs flex items-center justify-center">
              3
            </div>
            <span className="text-[11px] font-normal text-slate-500 whitespace-nowrap">{t("reviewQuote")}</span>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center gap-1 z-10 bg-[#F8F9FE] px-2">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-500 font-semibold text-xs flex items-center justify-center">
              4
            </div>
            <span className="text-[11px] font-normal text-slate-500 whitespace-nowrap">{t("paymentStep")}</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN LAYOUT: Left Cards Column + Right Form Column */}
      <div className="flex flex-col lg:flex-row items-start gap-8">

        {/* Left Side: Product Selector Cards (Horizontal Carousel on Mobile, Vertical Stack on Desktop) */}
        <div className="w-full lg:w-[340px] flex flex-row lg:flex-col gap-3 overflow-x-auto scrollbar-none snap-x py-1 shrink-0">

          {/* Card 1: Motor Insurance */}
          <div
            onClick={() => setSelectedProduct("motor")}
            className={`rounded-2xl p-3 sm:p-5 transition-all duration-200 cursor-pointer relative overflow-hidden flex items-center justify-between min-w-[210px] sm:min-w-0 lg:w-full min-h-[75px] sm:min-h-[105px] shrink-0 snap-start border ${selectedProduct === "motor"
                ? "bg-white border-2 border-[#2563EB] shadow-md"
                : "bg-white border-slate-100 shadow-2xs hover:shadow-xs"
              }`}
          >
            <div className="space-y-0.5 sm:space-y-1 max-w-[62%]">
              <h3 className="font-semibold text-xs sm:text-base text-[#1C2541] truncate">{t("motorInsuranceProductTitle")}</h3>
              <p className="hidden sm:block text-xs text-slate-500 leading-snug font-normal">
                {t("motorInsuranceProductDesc")}
              </p>
              <p className="text-[11px] sm:text-xs font-semibold text-[#16A34A] pt-0.5">{t("fromMotorPrice")}</p>
            </div>
            <div className="w-16 h-12 sm:w-24 sm:h-16 relative shrink-0">
              <Image src="/images/products_01.png" alt="Motor Insurance" fill className="object-contain" />
            </div>
          </div>

          {/* Card 2: Travel Insurance */}
          <div
            onClick={() => setSelectedProduct("travel")}
            className={`rounded-2xl p-3 sm:p-5 transition-all duration-200 cursor-pointer relative overflow-hidden flex items-center justify-between min-w-[210px] sm:min-w-0 lg:w-full min-h-[75px] sm:min-h-[105px] shrink-0 snap-start border ${selectedProduct === "travel"
                ? "bg-white border-2 border-[#2563EB] shadow-md"
                : "bg-white border-slate-100 shadow-2xs hover:shadow-xs"
              }`}
          >
            <div className="space-y-0.5 sm:space-y-1 max-w-[62%]">
              <h3 className="font-semibold text-xs sm:text-base text-[#1C2541] truncate">{t("travelInsuranceProductTitle")}</h3>
              <p className="hidden sm:block text-xs text-slate-500 leading-snug font-normal">
                {t("travelInsuranceProductDesc")}
              </p>
              <p className="text-[11px] sm:text-xs font-semibold text-[#16A34A] pt-0.5">{t("fromTravelPrice")}</p>
            </div>
            <div className="w-16 h-12 sm:w-24 sm:h-16 relative shrink-0">
              <Image src="/images/products_02.png" alt="Travel Insurance" fill className="object-contain" />
            </div>
          </div>

          {/* Card 3: Visit Visa Insurance */}
          <div
            onClick={() => setSelectedProduct("visa")}
            className={`rounded-2xl p-3 sm:p-5 transition-all duration-200 cursor-pointer relative overflow-hidden flex items-center justify-between min-w-[210px] sm:min-w-0 lg:w-full min-h-[75px] sm:min-h-[105px] shrink-0 snap-start border ${selectedProduct === "visa"
                ? "bg-white border-2 border-[#2563EB] shadow-md"
                : "bg-white border-slate-100 shadow-2xs hover:shadow-xs"
              }`}
          >
            <div className="space-y-0.5 sm:space-y-1 max-w-[62%]">
              <h3 className="font-semibold text-xs sm:text-base text-[#1C2541] truncate">{t("visitVisaInsuranceProductTitle")}</h3>
              <p className="hidden sm:block text-xs text-slate-500 leading-snug font-normal">
                {t("visitVisaInsuranceProductDesc")}
              </p>
              <p className="text-[11px] sm:text-xs font-semibold text-[#16A34A] pt-0.5">{t("fromVisaPrice")}</p>
            </div>
            <div className="w-16 h-12 sm:w-24 sm:h-16 relative shrink-0">
              <Image src="/images/products_04.png" alt="Visit Visa Insurance" fill className="object-contain rounded-md" />
            </div>
          </div>

          {/* Card 4: Life Insurance */}
          <div
            onClick={() => setSelectedProduct("life")}
            className={`rounded-2xl p-3 sm:p-5 transition-all duration-200 cursor-pointer relative overflow-hidden flex items-center justify-between min-w-[210px] sm:min-w-0 lg:w-full min-h-[75px] sm:min-h-[105px] shrink-0 snap-start border ${selectedProduct === "life"
                ? "bg-white border-2 border-[#2563EB] shadow-md"
                : "bg-white border-slate-100 shadow-2xs hover:shadow-xs"
              }`}
          >
            <div className="space-y-0.5 sm:space-y-1 max-w-[62%]">
              <h3 className="font-semibold text-xs sm:text-base text-[#1C2541] truncate">{t("lifeInsuranceProductTitle")}</h3>
              <p className="hidden sm:block text-xs text-slate-500 leading-snug font-normal">
                {t("lifeInsuranceProductDesc")}
              </p>
              <p className="text-[11px] sm:text-xs font-semibold text-[#16A34A] pt-0.5">{t("fromLifePrice")}</p>
            </div>
            <div className="w-16 h-12 sm:w-24 sm:h-16 relative shrink-0">
              <Image src="/images/products_03.png" alt="Life Insurance" fill className="object-contain rounded-md" />
            </div>
          </div>

          {/* Card 5: General Insurance */}
          <div
            onClick={() => setSelectedProduct("general")}
            className={`rounded-2xl p-3 sm:p-5 transition-all duration-200 cursor-pointer relative overflow-hidden flex items-center justify-between min-w-[210px] sm:min-w-0 lg:w-full min-h-[75px] sm:min-h-[105px] shrink-0 snap-start border ${selectedProduct === "general"
                ? "bg-white border-2 border-[#2563EB] shadow-md"
                : "bg-white border-slate-100 shadow-2xs hover:shadow-xs"
              }`}
          >
            <div className="space-y-0.5 sm:space-y-1 max-w-[62%]">
              <h3 className="font-semibold text-xs sm:text-base text-[#1C2541] truncate">{t("generalInsuranceProductTitle")}</h3>
              <p className="hidden sm:block text-xs text-slate-500 leading-snug font-normal">
                {t("generalInsuranceProductDesc")}
              </p>
              <p className="text-[11px] sm:text-xs font-semibold text-[#16A34A] pt-0.5">{t("fromGeneralPrice")}</p>
            </div>
            <div className="w-16 h-12 sm:w-24 sm:h-16 relative shrink-0">
              <Image src="/images/products_05.png" alt="General Insurance" fill className="object-contain" />
            </div>
          </div>

        </div>

        {/* Right Side Column: Dynamic Form Card */}
        <div className="flex-1 w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6 animate-in fade-in duration-150">

          {/* FORM 1: MOTOR INSURANCE */}
          {selectedProduct === "motor" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[#1C2541]">{t("motorVehicleDetailsHeader")}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Vehicle Make */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{t("vehicleMakeLabel")}</label>
                  <ShadcnSelect
                    value={vehicleMake}
                    onChange={setVehicleMake}
                    options={["Toyota", "Hyundai", "Ford", "Nissan", "Chevrolet", "BMW"]}
                  />
                </div>

                {/* Vehicle Model */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{t("vehicleModelLabel")}</label>
                  <ShadcnSelect
                    value={vehicleModel}
                    onChange={setVehicleModel}
                    options={["Camry", "Corolla", "Elantra", "Patrol", "Explorer", "Accord"]}
                  />
                </div>

                {/* Year of Manufacture */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{t("yearOfManufactureLabel")}</label>
                  <ShadcnSelect
                    value={manufactureYear}
                    onChange={setManufactureYear}
                    options={["2024", "2023", "2022", "2021", "2020", "2019"]}
                  />
                </div>

                {/* Plate Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{t("plateNumberLabel")}</label>
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder={isAr ? "مثال: 1234 أ ب ج" : "e.g 1234 ABC"}
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                {/* Chassis Number (VIN) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{t("chassisNumberVinLabel")}</label>
                  <input
                    type="text"
                    value={vinNumber}
                    onChange={(e) => setVinNumber(e.target.value)}
                    placeholder={isAr ? "رقم الهيكل من 17 حرفاً" : "17 Character VIN"}
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                {/* City of Registration */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{t("cityOfRegistrationLabel")}</label>
                  <ShadcnSelect
                    value={registrationCity}
                    onChange={setRegistrationCity}
                    options={isAr ? ["الرياض", "جدة", "الدمام", "الخبر", "مكة المكرمة", "المدينة المنورة"] : ["Riyadh", "Jeddah", "Dammam", "Khobar", "Makkah", "Madinah"]}
                  />
                </div>
              </div>

              {/* Select Coverage Type Cards */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-700 block">{t("selectCoverageTypeLabel")}</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setCoverageType("comprehensive")}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1 ${coverageType === "comprehensive"
                        ? "border-2 border-slate-800 bg-white shadow-xs"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                  >
                    <div className="font-semibold text-xs text-[#1C2541]">{t("comprehensiveCoverage")}</div>
                    <div className="text-[11px] text-slate-500">{isAr ? "من 1,200 ر.س/سنوياً" : "From SAR 1,200/yr"}</div>
                  </div>

                  <div
                    onClick={() => setCoverageType("third-party")}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1 ${coverageType === "third-party"
                        ? "border-2 border-slate-800 bg-white shadow-xs"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                  >
                    <div className="font-semibold text-xs text-[#1C2541]">{t("thirdPartyCoverage")}</div>
                    <div className="text-[11px] text-slate-500">{isAr ? "من 600 ر.س/سنوياً" : "From SAR 600/yr"}</div>
                  </div>

                  <div
                    onClick={() => setCoverageType("collision")}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1 ${coverageType === "collision"
                        ? "border-2 border-slate-800 bg-white shadow-xs"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                  >
                    <div className="font-semibold text-xs text-[#1C2541]">{t("collisionOnlyCoverage")}</div>
                    <div className="text-[11px] text-slate-500">{isAr ? "من 900 ر.س/سنوياً" : "From SAR 900/yr"}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer">
                  {t("getInstantQuoteBtn")}
                </button>
                <button className="border border-slate-700 hover:bg-slate-50 text-slate-800 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer">
                  {t("saveContinueLaterBtn")}
                </button>
              </div>
            </div>
          )}

          {/* FORM 2: TRAVEL INSURANCE */}
          {selectedProduct === "travel" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[#1C2541]">{isAr ? "تأمين السفر — تفاصيل الرحلة" : "Travel insurance — trip details"}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{isAr ? "الوجهة" : "Destination"}</label>
                  <ShadcnSelect
                    value={destination}
                    onChange={setDestination}
                    options={isAr ? ["دول الخليج", "عالمي", "أوروبا والشنغن", "أمريكا وكندا"] : ["GCC countries", "Worldwide", "Europe & Schengen", "USA & Canada"]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{isAr ? "نوع الرحلة" : "Trip type"}</label>
                  <ShadcnSelect
                    value={tripType}
                    onChange={setTripType}
                    options={isAr ? ["رحلات متعددة سنوية", "رحلة واحدة"] : ["Annual multi-trip", "Single trip"]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{isAr ? "تاريخ المغادرة" : "Departure date"}</label>
                  <input
                    type="text"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{isAr ? "تاريخ العودة" : "Return date"}</label>
                  <input
                    type="text"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{isAr ? "عدد المسافرين" : "Travellers"}</label>
                  <ShadcnSelect
                    value={travellers}
                    onChange={setTravellers}
                    options={["1", "2", "3", "4", "5+"]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{isAr ? "الجنسية" : "Nationality"}</label>
                  <ShadcnSelect
                    value={travelNationality}
                    onChange={setTravelNationality}
                    options={isAr ? ["سعودي", "مواطن خليجي", "مقيم", "أخرى"] : ["Saudi", "GCC Citizen", "Resident", "Other"]}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer">
                  {t("getInstantQuoteBtn")}
                </button>
                <button className="border border-slate-700 hover:bg-slate-50 text-slate-800 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer">
                  {t("saveContinueLaterBtn")}
                </button>
              </div>
            </div>
          )}

          {/* FORM 3: VISIT VISA INSURANCE */}
          {selectedProduct === "visa" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[#1C2541]">{isAr ? "تأمين تأشيرة الزيارة — تفاصيل الزائر" : "Visit visa insurance — visitor details"}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{isAr ? "جنسية الزائر" : "Visitor nationality"}</label>
                  <input
                    type="text"
                    value={visitorNationality}
                    onChange={(e) => setVisitorNationality(e.target.value)}
                    placeholder={isAr ? "مثال: مصري" : "e.g. Egyptian"}
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{isAr ? "نوع التأشيرة" : "Visa type"}</label>
                  <ShadcnSelect
                    value={visaType}
                    onChange={setVisaType}
                    options={isAr ? ["سياحية", "أعمال", "زيارة عائلية", "زيارة شخصية"] : ["Tourist", "Business", "Family Visit", "Personal Visit"]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{isAr ? "تاريخ الوصول" : "Arrival date"}</label>
                  <input
                    type="text"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{isAr ? "المدة" : "Duration"}</label>
                  <ShadcnSelect
                    value={visaDuration}
                    onChange={setVisaDuration}
                    options={isAr ? ["30 يوماً", "60 يوماً", "90 يوماً", "180 يوماً"] : ["30 days", "60 days", "90 days", "180 days"]}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer">
                  {t("getInstantQuoteBtn")}
                </button>
                <button className="border border-slate-700 hover:bg-slate-50 text-slate-800 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer">
                  {t("saveContinueLaterBtn")}
                </button>
              </div>
            </div>
          )}

          {/* FORM 4: LIFE INSURANCE */}
          {selectedProduct === "life" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[#1C2541]">{isAr ? "تأمين الحياة — البيانات الشخصية" : "Life insurance — personal details"}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{isAr ? "تاريخ الميلاد" : "Date of birth"}</label>
                  <input
                    type="text"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    placeholder="15/05/1990"
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{isAr ? "الجنس" : "Gender"}</label>
                  <ShadcnSelect
                    value={gender}
                    onChange={setGender}
                    options={isAr ? ["ذكر", "أنثى"] : ["Male", "Female"]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{isAr ? "مبلغ التغطية (ر.س)" : "Coverage amount (SAR)"}</label>
                  <ShadcnSelect
                    value={lifeCoverage}
                    onChange={setLifeCoverage}
                    options={["100,000", "250,000", "500,000", "1,000,000"]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{isAr ? "مدة الوثيقة" : "Policy term"}</label>
                  <ShadcnSelect
                    value={policyTerm}
                    onChange={setPolicyTerm}
                    options={isAr ? ["10 سنوات", "15 سنة", "20 سنة", "25 سنة"] : ["10 years", "15 years", "20 years", "25 years"]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{isAr ? "حالة التدخين" : "Smoker status"}</label>
                  <ShadcnSelect
                    value={smokerStatus}
                    onChange={setSmokerStatus}
                    options={isAr ? ["غير مدخن", "مدخن"] : ["Non-smoker", "Smoker"]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{isAr ? "المهنة" : "Occupation"}</label>
                  <ShadcnSelect
                    value={occupation}
                    onChange={setOccupation}
                    options={isAr ? ["مهندس", "طبيب", "مدير", "معلم", "صاحب عمل", "أخرى"] : ["Engineer", "Doctor", "Manager", "Teacher", "Business Owner", "Other"]}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer">
                  {t("getInstantQuoteBtn")}
                </button>
                <button className="border border-slate-700 hover:bg-slate-50 text-slate-800 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer">
                  {t("saveContinueLaterBtn")}
                </button>
              </div>
            </div>
          )}

          {/* FORM 5: GENERAL INSURANCE */}
          {selectedProduct === "general" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[#1C2541]">{isAr ? "التأمين العام — تفاصيل العقار" : "General insurance — property details"}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{isAr ? "فئة التأمين" : "Insurance category"}</label>
                  <ShadcnSelect
                    value={generalCategory}
                    onChange={setGeneralCategory}
                    options={isAr ? ["المنازل والممتلكات", "المباني التجارية", "المسؤولية التجارية", "البحري والشحن"] : ["Home & property", "Commercial building", "Business liability", "Marine & cargo"]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{isAr ? "قيمة العقار (ر.س)" : "Property value (SAR)"}</label>
                  <input
                    type="text"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(e.target.value)}
                    placeholder="500,000"
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{isAr ? "عنوان العقار" : "Property address"}</label>
                  <input
                    type="text"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    placeholder={isAr ? "المدينة، الحي، الشارع" : "City, district, street"}
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">{isAr ? "سنة البناء" : "Build year"}</label>
                  <ShadcnSelect
                    value={buildYear}
                    onChange={setBuildYear}
                    options={["2020-2024", "2015-2019", "2010-2014", "Pre-2010"]}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer">
                  {t("getInstantQuoteBtn")}
                </button>
                <button className="border border-slate-700 hover:bg-slate-50 text-slate-800 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer">
                  {t("saveContinueLaterBtn")}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

{/* CUSTOM SHADCN-STYLE SELECT DROPDOWN COMPONENT */ }
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
        className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm font-semibold text-slate-800 flex items-center justify-between hover:bg-slate-50/80 transition-colors focus:outline-none focus:ring-1 focus:ring-[#2563EB] cursor-pointer"
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
                className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${value === opt ? "bg-blue-50 text-[#2563EB]" : "text-slate-700 hover:bg-slate-50"
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
