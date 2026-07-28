"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useGsapAnimations() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const timer = setTimeout(() => {
      const vh = window.innerHeight;

      // Animate all elements with data-gsap="fade-up"
      const fadeUpElements = document.querySelectorAll('[data-gsap="fade-up"]');
      fadeUpElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh * 1.4) {
          // Immediately animate elements in initial viewport on page load
          gsap.fromTo(
            el,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
          );
        } else {
          // Animate elements further down the page on scroll
          gsap.fromTo(
            el,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 98%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });

      // Stagger containers with data-gsap="stagger"
      const staggerContainers = document.querySelectorAll('[data-gsap="stagger"]');
      staggerContainers.forEach((container) => {
        const children = container.querySelectorAll('[data-gsap-item]');
        if (children.length > 0) {
          const rect = container.getBoundingClientRect();
          if (rect.top < vh * 1.4) {
            gsap.fromTo(
              children,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
            );
          } else {
            gsap.fromTo(
              children,
              { opacity: 0, y: 25 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: container,
                  start: "top 95%",
                  toggleActions: "play none none none",
                },
              }
            );
          }
        }
      });

      // Scale up elements with data-gsap="scale"
      const scaleElements = document.querySelectorAll('[data-gsap="scale"]');
      scaleElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh * 1.4) {
          gsap.fromTo(
            el,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" }
          );
        } else {
          gsap.fromTo(
            el,
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 98%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });

      ScrollTrigger.refresh();
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, []);
}
