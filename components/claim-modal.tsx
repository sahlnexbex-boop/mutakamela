"use client";

import { useState } from "react";
import { X, FileText, Search, CheckCircle, Upload, ArrowRight } from "lucide-react";

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "submit" | "track";
}

export default function ClaimModal({ isOpen, onClose, defaultMode = "submit" }: ClaimModalProps) {
  const [mode, setMode] = useState<"submit" | "track">(defaultMode);
  const [claimId, setClaimId] = useState("");
  const [policyId, setPolicyId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [trackedData, setTrackedData] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleTrackClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackedData({
      id: claimId || "CLM-2026-8941",
      status: "In Assessment",
      type: "Motor Claim",
      date: "2026-07-22",
      estimatedResolution: "24-48 Hours",
    });
  };

  const resetModal = () => {
    setSubmitted(false);
    setTrackedData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        
        {/* Close Button */}
        <button
          onClick={resetModal}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          
          {/* Mode Switcher Header */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => { setMode("submit"); setSubmitted(false); setTrackedData(null); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === "submit" ? "bg-white text-[#3B25B0] shadow-sm" : "hover:text-slate-900"
              }`}
            >
              Submit a Claim
            </button>
            <button
              onClick={() => { setMode("track"); setSubmitted(false); setTrackedData(null); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === "track" ? "bg-white text-[#3B25B0] shadow-sm" : "hover:text-slate-900"
              }`}
            >
              Track a Claim
            </button>
          </div>

          {mode === "submit" && !submitted && (
            <form onSubmit={handleSubmitClaim} className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Submit New Claim</h3>
                <p className="text-xs text-slate-500">Provide incident details and supporting documentation.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Policy Number / Civil ID</label>
                <input
                  type="text"
                  required
                  value={policyId}
                  onChange={(e) => setPolicyId(e.target.value)}
                  placeholder="e.g. POL-992384 or 1092837465"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#3B25B0]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Incident Category</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#3B25B0]/30">
                  <option>Motor Collision / Accident</option>
                  <option>Travel Emergency Medical</option>
                  <option>Medical Reimbursement</option>
                  <option>Property Damage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Upload Incident Report / Photos</label>
                <div className="border-2 border-dashed border-slate-200 hover:border-[#3B25B0] rounded-xl p-4 text-center bg-slate-50 hover:bg-indigo-50/40 transition-all cursor-pointer">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <div className="text-xs font-semibold text-slate-700">Click to upload files</div>
                  <div className="text-[10px] text-slate-400">PDF, JPG, PNG up to 10MB</div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#3B25B0] hover:bg-[#2F1F99] text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Submit Claim</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {mode === "submit" && submitted && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Claim Received!</h3>
              <p className="text-xs text-slate-600">Your claim has been registered with ID <span className="font-bold text-slate-900">CLM-2026-8941</span>. We will review it shortly.</p>
              <button onClick={resetModal} className="w-full bg-[#3B25B0] text-white font-bold text-sm py-2.5 rounded-xl">
                Done
              </button>
            </div>
          )}

          {mode === "track" && (
            <form onSubmit={handleTrackClaim} className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Track Claim Status</h3>
                <p className="text-xs text-slate-500">Enter your Claim Reference Number to check status.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Claim ID / Reference Number</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={claimId}
                    onChange={(e) => setClaimId(e.target.value)}
                    placeholder="e.g. CLM-2026-8941"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#3B25B0]/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#3B25B0] hover:bg-[#2F1F99] text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Track Status</span>
                <Search className="w-4 h-4" />
              </button>

              {trackedData && (
                <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 space-y-2 text-xs text-slate-700 animate-in fade-in">
                  <div className="flex justify-between font-bold text-slate-900 border-b border-indigo-100 pb-2">
                    <span>Claim ID: {trackedData.id}</span>
                    <span className="text-[#3B25B0]">{trackedData.status}</span>
                  </div>
                  <div className="flex justify-between"><span>Category:</span><span>{trackedData.type}</span></div>
                  <div className="flex justify-between"><span>Submitted Date:</span><span>{trackedData.date}</span></div>
                  <div className="flex justify-between"><span>Est. Resolution:</span><span className="font-semibold text-emerald-600">{trackedData.estimatedResolution}</span></div>
                </div>
              )}
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
