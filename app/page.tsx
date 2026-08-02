"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import I18nProvider from "@/components/i18n-provider";
import { useGsapAnimations } from "@/lib/gsap";
import { pagesApi } from "@/lib/api/pages.api";
import { toBuilderLocale } from "@/lib/builder/i18n";
import type { PageSettings } from "@/lib/builder/types";
import { defaultHomePageContent } from "@/lib/home/defaults";
import { applyPageSeo } from "@/lib/home/seo";
import {
  enabledOrderedSections,
  normalizeHomeContent,
  normalizeHomeSettings,
  resolveFaqs,
  resolveSectionCopy,
  resolveStories,
  type SectionDisplayCopy,
} from "@/lib/home/utils";
import type { HomePageContent, HomeSectionKey } from "@/lib/home/types";
import { useTranslation } from "react-i18next";

export default function Home() {
  return (
    <I18nProvider>
      <HomeInner />
    </I18nProvider>
  );
}

function HomeInner() {
  const { i18n } = useTranslation();
  const locale = toBuilderLocale(i18n.language);

  const [homeContent, setHomeContent] = useState<HomePageContent>(
    defaultHomePageContent(),
  );
  const [homeSettings, setHomeSettings] = useState<PageSettings | null>(null);
  const [cmsLoaded, setCmsLoaded] = useState(false);

  // Re-bind only when section order/visibility changes (avoids re-animating on same CMS payload)
  const sectionAnimKey = useMemo(
    () =>
      homeContent.sections
        .map((s) => `${s.key}:${s.enabled === false ? "0" : "1"}`)
        .join(","),
    [homeContent.sections],
  );
  useGsapAnimations([sectionAnimKey]);

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState("Motor Insurance");
  const [quoteData, setQuoteData] = useState<any>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimModalMode, setClaimModalMode] = useState<"submit" | "track">(
    "submit",
  );

  useEffect(() => {
    let cancelled = false;
    ;(async () => {
      try {
        const page = await pagesApi.getPublic("home");
        if (cancelled) return;
        setHomeContent(normalizeHomeContent(page.content));
        setHomeSettings(normalizeHomeSettings(page.settings));
      } catch {
        // Draft / unpublished / offline → keep built-in defaults
        if (!cancelled) {
          setHomeContent(defaultHomePageContent());
          setHomeSettings(null);
        }
      } finally {
        if (!cancelled) setCmsLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!cmsLoaded) return;
    applyPageSeo(
      "Mutakamela Insurance",
      "/",
      homeSettings,
      locale,
    );
  }, [cmsLoaded, homeSettings, locale]);

  const sections = useMemo(
    () => enabledOrderedSections(homeContent),
    [homeContent],
  );

  const copyFor = useCallback(
    (key: HomeSectionKey): SectionDisplayCopy => {
      const section = homeContent.sections.find((s) => s.key === key);
      return section ? resolveSectionCopy(section, locale) : {};
    },
    [homeContent, locale],
  );

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

  const renderSection = (key: HomeSectionKey) => {
    const copy = copyFor(key);
    switch (key) {
      case "hero":
        return (
          <Hero
            key={key}
            onOpenQuoteModal={handleOpenQuoteModal}
            copy={copy}
          />
        );
      case "quick-actions":
        return (
          <QuickActions
            key={key}
            onSelectAction={handleSelectQuickAction}
            copy={copy}
          />
        );
      case "products":
        return (
          <ProductsSection
            key={key}
            onOpenQuoteModal={handleOpenQuoteModal}
            copy={copy}
          />
        );
      case "why-us":
        return <WhyUs key={key} copy={copy} />;
      case "claim-services":
        return (
          <ClaimServices
            key={key}
            onOpenClaimModal={() => {
              setClaimModalMode("submit");
              setClaimModalOpen(true);
            }}
            onOpenTrackModal={() => {
              setClaimModalMode("track");
              setClaimModalOpen(true);
            }}
            copy={copy}
          />
        );
      case "how-it-works":
        return <HowItWorks key={key} copy={copy} />;
      case "app-experience":
        return <AppExperience key={key} copy={copy} />;
      case "testimonials": {
        const section = homeContent.sections.find((s) => s.key === "testimonials");
        return (
          <Testimonials
            key={key}
            copy={copy}
            stories={resolveStories(section, locale)}
          />
        );
      }
      case "faq": {
        const section = homeContent.sections.find((s) => s.key === "faq");
        return (
          <FaqSection
            key={key}
            copy={copy}
            items={resolveFaqs(section, locale)}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#F8F9FE] text-slate-900 selection:bg-[#3B25B0] selection:text-white">
      <Navbar
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      {sections.map((s) => renderSection(s.key))}

      <Footer />

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
  );
}
