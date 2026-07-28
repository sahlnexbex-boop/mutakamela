"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Check } from "lucide-react";

type ProductType = "motor" | "travel" | "visa" | "life" | "general";

export default function BuyInsuranceRoutePage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductType>("motor");

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
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#1C2541]">Get a quote</h1>
          <p className="text-xs sm:text-sm text-[#8C94A6] font-normal mt-0.5">Select a product to begin</p>
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
            <span className="text-[11px] font-semibold text-[#1C2541] whitespace-nowrap">Select product</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-1 z-10 bg-[#F8F9FE] px-2">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-500 font-semibold text-xs flex items-center justify-center">
              2
            </div>
            <span className="text-[11px] font-normal text-slate-500 whitespace-nowrap">Your details</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-1 z-10 bg-[#F8F9FE] px-2">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-500 font-semibold text-xs flex items-center justify-center">
              3
            </div>
            <span className="text-[11px] font-normal text-slate-500 whitespace-nowrap">Review quote</span>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center gap-1 z-10 bg-[#F8F9FE] px-2">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-500 font-semibold text-xs flex items-center justify-center">
              4
            </div>
            <span className="text-[11px] font-normal text-slate-500 whitespace-nowrap">Payment</span>
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
              <h3 className="font-semibold text-xs sm:text-base text-[#1C2541] truncate">Motor Insurance</h3>
              <p className="hidden sm:block text-xs text-slate-500 leading-snug font-normal">
                Comprehensive, third-party, and collision coverage for your vehicle
              </p>
              <p className="text-[11px] sm:text-xs font-semibold text-[#16A34A] pt-0.5">From SAR 1,200/yr</p>
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
              <h3 className="font-semibold text-xs sm:text-base text-[#1C2541] truncate">Travel Insurance</h3>
              <p className="hidden sm:block text-xs text-slate-500 leading-snug font-normal">
                Single trip and annual multi-trip plans, GCC and international
              </p>
              <p className="text-[11px] sm:text-xs font-semibold text-[#16A34A] pt-0.5">From SAR 99/trip</p>
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
              <h3 className="font-semibold text-xs sm:text-base text-[#1C2541] truncate">Visit Visa Insurance</h3>
              <p className="hidden sm:block text-xs text-slate-500 leading-snug font-normal">
                Mandatory coverage for visitors entering the Kingdom
              </p>
              <p className="text-[11px] sm:text-xs font-semibold text-[#16A34A] pt-0.5">From SAR 99/trip</p>
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
              <h3 className="font-semibold text-xs sm:text-base text-[#1C2541] truncate">Life Insurance</h3>
              <p className="hidden sm:block text-xs text-slate-500 leading-snug font-normal">
                Single trip and annual multi-trip plans, GCC and international
              </p>
              <p className="text-[11px] sm:text-xs font-semibold text-[#16A34A] pt-0.5">From SAR 99/trip</p>
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
              <h3 className="font-semibold text-xs sm:text-base text-[#1C2541] truncate">General Insurance</h3>
              <p className="hidden sm:block text-xs text-slate-500 leading-snug font-normal">
                Home, property, medical, and business insurance solutions
              </p>
              <p className="text-[11px] sm:text-xs font-semibold text-[#16A34A] pt-0.5">From SAR 500/yr</p>
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
              <h2 className="text-lg font-semibold text-[#1C2541]">Motor insurance — vehicle details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Vehicle Make */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Vehicle make</label>
                  <ShadcnSelect
                    value={vehicleMake}
                    onChange={setVehicleMake}
                    options={["Toyota", "Hyundai", "Ford", "Nissan", "Chevrolet", "BMW"]}
                  />
                </div>

                {/* Vehicle Model */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Vehicle model</label>
                  <ShadcnSelect
                    value={vehicleModel}
                    onChange={setVehicleModel}
                    options={["Camry", "Corolla", "Elantra", "Patrol", "Explorer", "Accord"]}
                  />
                </div>

                {/* Year of Manufacture */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Year of manufacture</label>
                  <ShadcnSelect
                    value={manufactureYear}
                    onChange={setManufactureYear}
                    options={["2024", "2023", "2022", "2021", "2020", "2019"]}
                  />
                </div>

                {/* Plate Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Plate number</label>
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="e.g 1234 ABC"
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                {/* Chassis Number (VIN) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Chassis number (VIN)</label>
                  <input
                    type="text"
                    value={vinNumber}
                    onChange={(e) => setVinNumber(e.target.value)}
                    placeholder="17 Character VIN"
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                {/* City of Registration */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">City of registration</label>
                  <ShadcnSelect
                    value={registrationCity}
                    onChange={setRegistrationCity}
                    options={["Riyadh", "Jeddah", "Dammam", "Khobar", "Makkah", "Madinah"]}
                  />
                </div>
              </div>

              {/* Select Coverage Type Cards */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-700 block">Select coverage type</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setCoverageType("comprehensive")}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1 ${coverageType === "comprehensive"
                        ? "border-2 border-slate-800 bg-white shadow-xs"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                  >
                    <div className="font-semibold text-xs text-[#1C2541]">Comprehensive</div>
                    <div className="text-[11px] text-slate-500">From SAR 1,200/yr</div>
                  </div>

                  <div
                    onClick={() => setCoverageType("third-party")}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1 ${coverageType === "third-party"
                        ? "border-2 border-slate-800 bg-white shadow-xs"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                  >
                    <div className="font-semibold text-xs text-[#1C2541]">Third-party</div>
                    <div className="text-[11px] text-slate-500">From SAR 600/yr</div>
                  </div>

                  <div
                    onClick={() => setCoverageType("collision")}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1 ${coverageType === "collision"
                        ? "border-2 border-slate-800 bg-white shadow-xs"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                  >
                    <div className="font-semibold text-xs text-[#1C2541]">Collision only</div>
                    <div className="text-[11px] text-slate-500">From SAR 900/yr</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer">
                  Get instant quote
                </button>
                <button className="border border-slate-700 hover:bg-slate-50 text-slate-800 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer">
                  Save & continue later
                </button>
              </div>
            </div>
          )}

          {/* FORM 2: TRAVEL INSURANCE */}
          {selectedProduct === "travel" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[#1C2541]">Travel insurance — trip details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Destination</label>
                  <ShadcnSelect
                    value={destination}
                    onChange={setDestination}
                    options={["GCC countries", "Worldwide", "Europe & Schengen", "USA & Canada"]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Trip type</label>
                  <ShadcnSelect
                    value={tripType}
                    onChange={setTripType}
                    options={["Annual multi-trip", "Single trip"]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Departure date</label>
                  <input
                    type="text"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Return date</label>
                  <input
                    type="text"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Travellers</label>
                  <ShadcnSelect
                    value={travellers}
                    onChange={setTravellers}
                    options={["1", "2", "3", "4", "5+"]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Nationality</label>
                  <ShadcnSelect
                    value={travelNationality}
                    onChange={setTravelNationality}
                    options={["Saudi", "GCC Citizen", "Resident", "Other"]}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer">
                  Get instant quote
                </button>
                <button className="border border-slate-700 hover:bg-slate-50 text-slate-800 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer">
                  Save & continue later
                </button>
              </div>
            </div>
          )}

          {/* FORM 3: VISIT VISA INSURANCE */}
          {selectedProduct === "visa" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[#1C2541]">Visit visa insurance — visitor details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Visitor nationality</label>
                  <input
                    type="text"
                    value={visitorNationality}
                    onChange={(e) => setVisitorNationality(e.target.value)}
                    placeholder="e.g. Egyptian"
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Visa type</label>
                  <ShadcnSelect
                    value={visaType}
                    onChange={setVisaType}
                    options={["Tourist", "Business", "Family Visit", "Personal Visit"]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Arrival date</label>
                  <input
                    type="text"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Duration</label>
                  <ShadcnSelect
                    value={visaDuration}
                    onChange={setVisaDuration}
                    options={["30 days", "60 days", "90 days", "180 days"]}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer">
                  Get instant quote
                </button>
                <button className="border border-slate-700 hover:bg-slate-50 text-slate-800 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer">
                  Save & continue later
                </button>
              </div>
            </div>
          )}

          {/* FORM 4: LIFE INSURANCE */}
          {selectedProduct === "life" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[#1C2541]">Life insurance — personal details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Date of birth</label>
                  <input
                    type="text"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    placeholder="e.g. 15/05/1990"
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Gender</label>
                  <ShadcnSelect
                    value={gender}
                    onChange={setGender}
                    options={["Male", "Female"]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Coverage amount (SAR)</label>
                  <ShadcnSelect
                    value={lifeCoverage}
                    onChange={setLifeCoverage}
                    options={["100,000", "250,000", "500,000", "1,000,000"]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Policy term</label>
                  <ShadcnSelect
                    value={policyTerm}
                    onChange={setPolicyTerm}
                    options={["10 years", "15 years", "20 years", "25 years"]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Smoker status</label>
                  <ShadcnSelect
                    value={smokerStatus}
                    onChange={setSmokerStatus}
                    options={["Non-smoker", "Smoker"]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Occupation</label>
                  <ShadcnSelect
                    value={occupation}
                    onChange={setOccupation}
                    options={["Engineer", "Doctor", "Manager", "Teacher", "Business Owner", "Other"]}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer">
                  Get instant quote
                </button>
                <button className="border border-slate-700 hover:bg-slate-50 text-slate-800 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer">
                  Save & continue later
                </button>
              </div>
            </div>
          )}

          {/* FORM 5: GENERAL INSURANCE */}
          {selectedProduct === "general" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[#1C2541]">General insurance — property details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Insurance category</label>
                  <ShadcnSelect
                    value={generalCategory}
                    onChange={setGeneralCategory}
                    options={["Home & property", "Commercial building", "Business liability", "Marine & cargo"]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Property value (SAR)</label>
                  <input
                    type="text"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(e.target.value)}
                    placeholder="e.g. 500,000"
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Property address</label>
                  <input
                    type="text"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    placeholder="City, district, street"
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Build year</label>
                  <ShadcnSelect
                    value={buildYear}
                    onChange={setBuildYear}
                    options={["2020-2024", "2015-2019", "2010-2014", "Pre-2010"]}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer">
                  Get instant quote
                </button>
                <button className="border border-slate-700 hover:bg-slate-50 text-slate-800 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer">
                  Save & continue later
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
