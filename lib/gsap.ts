"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const EASE_OUT = "power3.out";
const EASE_SOFT = "power2.out";
const EASE_BACK = "back.out(1.35)";

type GsapDeps = readonly unknown[];

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isInNearViewport(el: Element, vh: number, factor = 1.35): boolean {
  const rect = el.getBoundingClientRect();
  return rect.top < vh * factor && rect.bottom > -80;
}

function revealNow(
  targets: gsap.TweenTarget,
  from: gsap.TweenVars,
  to: gsap.TweenVars,
) {
  gsap.fromTo(targets, from, { ...to, overwrite: "auto" });
}

function revealOnScroll(
  targets: gsap.TweenTarget,
  from: gsap.TweenVars,
  to: gsap.TweenVars,
  trigger: Element,
  start = "top 90%",
) {
  gsap.fromTo(targets, from, {
    ...to,
    overwrite: "auto",
    scrollTrigger: {
      trigger,
      start,
      toggleActions: "play none none none",
      once: true,
    },
  });
}

/**
 * Home-page scroll & entrance animations.
 * Pass deps (e.g. cmsLoaded) so animations re-bind after content updates.
 */
export function useGsapAnimations(deps: GsapDeps = []) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const hoverCleanups: Array<() => void> = [];
    const ctx = gsap.context(() => {});

    const timer = window.setTimeout(() => {
      ctx.add(() => {
        if (prefersReducedMotion()) {
          gsap.set(
            [
              '[data-gsap="fade-up"]',
              '[data-gsap="fade-left"]',
              '[data-gsap="fade-right"]',
              '[data-gsap="scale"]',
              '[data-gsap="stagger"] [data-gsap-item]',
              '[data-gsap="hero-stagger"] > *',
            ].join(", "),
            { clearProps: "all", opacity: 1, y: 0, x: 0, scale: 1 },
          );
          return;
        }

        const vh = window.innerHeight;

        // ── Fade up ──────────────────────────────────────────
        document.querySelectorAll('[data-gsap="fade-up"]').forEach((el) => {
          const from = { opacity: 0, y: 36 };
          const to = { opacity: 1, y: 0, duration: 0.85, ease: EASE_OUT };
          if (isInNearViewport(el, vh)) {
            revealNow(el, from, { ...to, delay: 0.05 });
          } else {
            revealOnScroll(el, from, to, el);
          }
        });

        // ── Fade from sides ──────────────────────────────────
        document.querySelectorAll('[data-gsap="fade-left"]').forEach((el) => {
          const from = { opacity: 0, x: -40 };
          const to = { opacity: 1, x: 0, duration: 0.85, ease: EASE_OUT };
          if (isInNearViewport(el, vh)) {
            revealNow(el, from, to);
          } else {
            revealOnScroll(el, from, to, el);
          }
        });

        document.querySelectorAll('[data-gsap="fade-right"]').forEach((el) => {
          const from = { opacity: 0, x: 40 };
          const to = { opacity: 1, x: 0, duration: 0.85, ease: EASE_OUT };
          if (isInNearViewport(el, vh)) {
            revealNow(el, from, to);
          } else {
            revealOnScroll(el, from, to, el);
          }
        });

        // ── Scale / pop ──────────────────────────────────────
        document.querySelectorAll('[data-gsap="scale"]').forEach((el) => {
          const from = { opacity: 0, scale: 0.9, y: 16 };
          const to = {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            ease: EASE_BACK,
          };
          if (isInNearViewport(el, vh)) {
            revealNow(el, from, { ...to, delay: 0.08 });
          } else {
            revealOnScroll(el, from, to, el);
          }
        });

        // ── Stagger children ─────────────────────────────────
        document.querySelectorAll('[data-gsap="stagger"]').forEach((container) => {
          const children = container.querySelectorAll("[data-gsap-item]");
          if (!children.length) return;

          const from = { opacity: 0, y: 28, scale: 0.96 };
          const to = {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.09,
            ease: EASE_OUT,
          };

          if (isInNearViewport(container, vh)) {
            revealNow(children, from, { ...to, delay: 0.1 });
          } else {
            revealOnScroll(children, from, to, container, "top 92%");
          }
        });

        // ── Hero text column: staggered children ─────────────
        document.querySelectorAll('[data-gsap="hero-stagger"]').forEach((container) => {
          const children = Array.from(container.children);
          if (!children.length) return;

          gsap.fromTo(
            children,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: EASE_OUT,
              delay: 0.05,
              overwrite: "auto",
            },
          );
        });

        // ── Continuous float (decorative) ────────────────────
        document.querySelectorAll('[data-gsap="float"]').forEach((el, i) => {
          gsap.to(el, {
            y: i % 2 === 0 ? -10 : -14,
            duration: 2.4 + (i % 3) * 0.35,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: i * 0.15,
          });
        });

        // ── Soft parallax on marked layers ───────────────────
        document.querySelectorAll("[data-gsap-parallax]").forEach((el) => {
          const speed =
            Number((el as HTMLElement).dataset.gsapParallax) || 0.12;
          gsap.to(el, {
            yPercent: speed * 40,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement || el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });

        // ── Subtle hover lift ────────────────────────────────
        document.querySelectorAll("[data-gsap-hover]").forEach((el) => {
          const node = el as HTMLElement;
          const onEnter = () => {
            gsap.to(node, {
              y: -6,
              duration: 0.35,
              ease: EASE_SOFT,
              overwrite: "auto",
            });
          };
          const onLeave = () => {
            gsap.to(node, {
              y: 0,
              duration: 0.4,
              ease: EASE_SOFT,
              overwrite: "auto",
            });
          };
          node.addEventListener("mouseenter", onEnter);
          node.addEventListener("mouseleave", onLeave);
          hoverCleanups.push(() => {
            node.removeEventListener("mouseenter", onEnter);
            node.removeEventListener("mouseleave", onLeave);
          });
        });

        ScrollTrigger.refresh();
      });
    }, 80);

    return () => {
      window.clearTimeout(timer);
      hoverCleanups.forEach((fn) => fn());
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
