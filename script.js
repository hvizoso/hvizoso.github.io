"use strict";

(function () {
  // Debounce utility
  function debounce(fn, delay) {
    let t;
    return function () {
      clearTimeout(t);
      const args = arguments;
      const ctx = this;
      t = setTimeout(function () {
        fn.apply(ctx, args);
      }, delay);
    };
  }

  // Mobile viewport height fix (100vh issue)
  function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", vh + "px");
    // Ensure body uses the accurate height on mobile
    document.body.style.minHeight = window.innerHeight + "px";
  }

  // Detect touch and adjust UI
  function applyTouchEnhancements() {
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    if (!isTouch) return;

    document.documentElement.classList.add("is-touch");

    // Inject minimal touch-friendly styles
    const style = document.createElement("style");
    style.textContent = `
      .is-touch .btn-add { width: 52px; height: 52px; }
      .is-touch .wishlist-card { -webkit-tap-highlight-color: transparent; }
      .is-touch .wishlist-card:hover .card-image i { transform: none; }
      .is-touch .wishlist-card:hover { box-shadow: 0 20px 60px rgba(102,126,234,0.3); }
    `;
    document.head.appendChild(style);
  }

  // Prefer reduced motion
  function honorReducedMotion() {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    function apply() {
      if (mq.matches) {
        if (!document.documentElement.classList.contains("reduce-motion")) {
          document.documentElement.classList.add("reduce-motion");
          const style = document.createElement("style");
          style.setAttribute("data-reduce-motion", "true");
          style.textContent = `
            .reduce-motion * { animation: none !important; transition: none !important; }
          `;
          document.head.appendChild(style);
        }
      } else {
        document.documentElement.classList.remove("reduce-motion");
        document.querySelectorAll("style[data-reduce-motion]").forEach((el) => el.remove());
      }
    }
    mq.addEventListener("change", apply);
    apply();
  }

  // Improve focus visibility for keyboard users
  function improveFocusVisibility() {
    const style = document.createElement("style");
    style.textContent = `
      :focus-visible { outline: 2px solid #667eea; outline-offset: 3px; }
      .btn-add:focus-visible { box-shadow: 0 0 0 3px rgba(102,126,234,0.35); }
    `;
    document.head.appendChild(style);
  }

  // Lazy-load images and ensure attributes
  function setupLazyImages() {
    const imgs = document.querySelectorAll("img");
    imgs.forEach((img) => {
      if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
      if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
      // Ensure images fit nicely
      img.style.maxWidth = "100%";
      img.style.height = "100%";
      img.style.objectFit = img.style.objectFit || "contain";
    });

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add("lazy-loaded");
            io.unobserve(img);
          }
        });
      }, { rootMargin: "200px" });
      imgs.forEach((img) => io.observe(img));
    }
  }

  // Ensure buttons are easily tappable
  function enhanceButtons() {
    document.querySelectorAll(".btn-add").forEach((btn) => {
      btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", function () {
        const pressed = this.classList.toggle("active");
        this.setAttribute("aria-pressed", pressed ? "true" : "false");
      });
    });
  }

  // Init on load
  function init() {
    setViewportHeight();
    applyTouchEnhancements();
    honorReducedMotion();
    improveFocusVisibility();
    setupLazyImages();
    enhanceButtons();
  }

  document.addEventListener("DOMContentLoaded", init);
  window.addEventListener("resize", debounce(setViewportHeight, 200));
  window.addEventListener("orientationchange", debounce(setViewportHeight, 200));
})();
