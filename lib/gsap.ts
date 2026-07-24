"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useGsapAnimations() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    // Refresh ScrollTrigger after DOM load
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    // Animate all elements with data-gsap="fade-up"
    const fadeUpElements = document.querySelectorAll('[data-gsap="fade-up"]');
    fadeUpElements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Stagger containers with data-gsap="stagger"
    const staggerContainers = document.querySelectorAll('[data-gsap="stagger"]');
    staggerContainers.forEach((container) => {
      const children = container.querySelectorAll('[data-gsap-item]');
      if (children.length > 0) {
        gsap.fromTo(
          children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    // Scale up elements with data-gsap="scale"
    const scaleElements = document.querySelectorAll('[data-gsap="scale"]');
    scaleElements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      clearTimeout(timer);
    };
  }, []);
}
