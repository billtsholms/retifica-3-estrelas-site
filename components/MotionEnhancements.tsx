"use client";

import { useEffect } from "react";

const addMotionClass = (
  elements: NodeListOf<Element>,
  classNames: string[],
  delayStep = 0,
) => {
  elements.forEach((element, index) => {
    if (!(element instanceof HTMLElement)) return;
    element.classList.add(...classNames);
    if (delayStep > 0) {
      element.style.setProperty(
        "--motion-delay",
        `${Math.min(index * delayStep, 420)}ms`,
      );
    }
  });
};

export function MotionEnhancements() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("motion-enhanced");

    addMotionClass(
      document.querySelectorAll(".section-heading"),
      ["motion-reveal", "motion-reveal--heading"],
    );
    addMotionClass(
      document.querySelectorAll(".trust-grid .trust-item"),
      ["motion-reveal", "motion-reveal--soft"],
      55,
    );
    addMotionClass(
      document.querySelectorAll(".problem-grid .problem-card"),
      ["motion-reveal", "motion-reveal--card"],
      65,
    );
    addMotionClass(
      document.querySelectorAll(".vehicle-grid .image-card"),
      ["motion-reveal", "motion-reveal--card"],
      75,
    );
    addMotionClass(
      document.querySelectorAll(".service-grid .image-card"),
      ["motion-reveal", "motion-reveal--card"],
      70,
    );
    addMotionClass(
      document.querySelectorAll(".differentials-grid .differential-item"),
      ["motion-reveal", "motion-reveal--soft"],
      60,
    );
    addMotionClass(
      document.querySelectorAll(".section-footer-action"),
      ["motion-reveal", "motion-reveal--soft"],
    );
    addMotionClass(
      document.querySelectorAll(".final-banner"),
      ["motion-reveal", "motion-reveal--zoom"],
    );

    const revealElements = document.querySelectorAll(".motion-reveal");
    const revealAll = () => {
      revealElements.forEach((element) => element.classList.add("is-visible"));
    };

    if (!("IntersectionObserver" in window)) {
      revealAll();
      return () => {
        document.documentElement.classList.remove("motion-enhanced");
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    revealElements.forEach((element) => observer.observe(element));
    window.addEventListener("pageshow", revealAll, { once: true });

    // Motion is progressive enhancement: never leave content hidden if a
    // browser delays or suppresses an IntersectionObserver callback.
    const revealFallback = window.setTimeout(revealAll, 2400);

    const heroBanners = document.querySelectorAll(".hero-banner");
    heroBanners.forEach((element) => element.classList.add("motion-hero"));
    const heroFrame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        heroBanners.forEach((element) => element.classList.add("is-visible"));
      });
    });

    return () => {
      observer.disconnect();
      window.clearTimeout(revealFallback);
      window.removeEventListener("pageshow", revealAll);
      window.cancelAnimationFrame(heroFrame);
      document.documentElement.classList.remove("motion-enhanced");
    };
  }, []);

  return null;
}
