"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import QuickActions from "@/components/quick-actions";
import ProductsSection from "@/components/products-section";
import WhyUs from "@/components/why-us";
import ClaimServices from "@/components/claim-services";
import HowItWorks from "@/components/how-it-works";
import AppExperience from "@/components/app-experience";
import Testimonials from "@/components/testimonials";
import FaqSection from "@/components/faq-section";
import Footer from "@/components/footer";
import QuoteModal from "@/components/quote-modal";
import AuthModal from "@/components/auth-modal";
import ClaimModal from "@/components/claim-modal";
import { useGsapAnimations } from "@/lib/gsap";
import I18nProvider from "@/components/i18n-provider";

export default function Home() {
  // Activate GSAP scroll-triggered animations
  useGsapAnimations();

  // Interactive Modal States
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState("Motor Insurance");
  const [quoteData, setQuoteData] = useState<any>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimModalMode, setClaimModalMode] = useState<"submit" | "track">("submit");

  const handleOpenQuoteModal = (productType?: string, data?: any) => {
    if (productType) setQuoteProduct(productType);
    if (data) setQuoteData(data);
    setQuoteModalOpen(true);
  };

  const handleSelectQuickAction = (actionId: string) => {
    if (actionId === "renew") {
      handleOpenQuoteModal("Motor Insurance");
    } else if (actionId === "track") {
      setClaimModalMode("track");
      setClaimModalOpen(true);
    } else if (actionId === "payment") {
      setAuthModalOpen(true);
    } else if (actionId === "medical") {
      const el = document.getElementById("why-us");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <I18nProvider>
      <main className="min-h-screen flex flex-col bg-[#F8F9FE] text-slate-900 selection:bg-[#3B25B0] selection:text-white">
      
      {/* Header / Navbar */}
      <Navbar
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      {/* Hero Section */}
      <Hero onOpenQuoteModal={handleOpenQuoteModal} />

      {/* Quick Action Tiles & Floating Widgets */}
      <QuickActions onSelectAction={handleSelectQuickAction} />

      {/* Products Showcase Section */}
      <ProductsSection onOpenQuoteModal={handleOpenQuoteModal} />

      {/* Why Mutakamela Trust Banner */}
      <WhyUs />

      {/* Claim Services Support Section */}
      <ClaimServices
        onOpenClaimModal={() => { setClaimModalMode("submit"); setClaimModalOpen(true); }}
        onOpenTrackModal={() => { setClaimModalMode("track"); setClaimModalOpen(true); }}
      />

      {/* How It Works - 4 Steps Process */}
      <HowItWorks />

      {/* App Experience & Download Section */}
      <AppExperience />

      {/* Testimonials Slider Section */}
      <Testimonials />

      {/* Frequently Asked Questions */}
      <FaqSection />

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialProduct={quoteProduct}
        initialData={quoteData}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <ClaimModal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        defaultMode={claimModalMode}
      />

    </main>
    </I18nProvider>
  );
}
