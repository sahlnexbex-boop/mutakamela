"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  placement?: "top" | "bottom";
}

export function ShadcnSelect({
  value,
  onChange,
  options,
  placeholder = "Select option",
  className = "",
  placement = "bottom",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-50/70 border rounded-xl px-3 py-2 text-xs font-medium text-left flex items-center justify-between transition-all duration-200 shadow-sm ${
          isOpen
            ? "border-[#3B25B0] ring-2 ring-[#3B25B0]/20 bg-white"
            : "border-slate-200/90 hover:border-slate-300"
        }`}
      >
        <span className={selectedOption ? "text-slate-800 font-semibold" : "text-slate-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#3B25B0]" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 right-0 ${
            placement === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5"
          } bg-white border border-slate-100/90 rounded-2xl shadow-2xl p-1.5 z-50 max-h-48 overflow-y-auto animate-in fade-in-50 zoom-in-95 scrollbar-none`}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2 text-xs rounded-xl cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? "bg-indigo-50 text-[#3B25B0] font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#3B25B0]" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
