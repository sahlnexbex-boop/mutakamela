"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  placement?: "top" | "bottom";
}

export function ShadcnDatePicker({
  value,
  onChange,
  placeholder = "Select Travel Date",
  className = "",
  placement = "bottom",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => (value ? new Date(value) : new Date()));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDateObj = value ? new Date(value) : null;

  const formattedDisplay = selectedDateObj
    ? selectedDateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : placeholder;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(year, month + 1, 1));
  };

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysGrid = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysGrid.push(d);
  }

  const handleSelectDay = (day: number) => {
    const selected = new Date(year, month, day);
    const isoString = selected.toISOString().split("T")[0];
    onChange(isoString);
    setIsOpen(false);
  };

  const isSelectedDay = (day: number) => {
    if (!selectedDateObj) return false;
    return (
      selectedDateObj.getFullYear() === year &&
      selectedDateObj.getMonth() === month &&
      selectedDateObj.getDate() === day
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-50/70 border rounded-xl px-3 py-2 text-xs font-medium text-left flex items-center justify-between transition-all duration-200 shadow-sm ${
          isOpen
            ? "border-[#3B25B0] ring-2 ring-[#3B25B0]/20 bg-[#3B25B0]/5"
            : "border-slate-200/90 hover:border-slate-300"
        }`}
      >
        <span className={selectedDateObj ? "text-slate-800 font-semibold" : "text-slate-400"}>
          {formattedDisplay}
        </span>
        <CalendarIcon className={`w-4 h-4 text-slate-400 ${isOpen ? "text-[#3B25B0]" : ""}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 sm:left-0 ${
            placement === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5"
          } bg-white border border-slate-100/90 rounded-2xl shadow-2xl p-2.5 z-50 w-56 sm:w-60 animate-in fade-in-50 zoom-in-95`}
        >
          {/* Header Month/Year Nav */}
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-50">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold text-slate-800">
              {monthNames[month]} {year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <span key={day} className="text-[10px] font-bold text-slate-400 uppercase">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {daysGrid.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-6" />;
              }
              const selected = isSelectedDay(day);
              const today = isToday(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-6 w-6 sm:h-6.5 sm:w-6.5 mx-auto rounded-md text-[11px] font-semibold flex items-center justify-center transition-all ${
                    selected
                      ? "bg-[#3B25B0] text-white shadow-sm font-bold"
                      : today
                      ? "bg-indigo-50 text-[#3B25B0] font-extrabold border border-indigo-200"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
