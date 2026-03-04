(function () {
  "use strict";

  // Current year in footer
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Mobile nav toggle
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !expanded);
      navLinks.classList.toggle("is-open", !expanded);
    });

    // Close menu when a link is clicked (single-page)
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("is-open");
      });
    });
  }

  // Optional: subtle fade-in on scroll (if IntersectionObserver is supported)
  if ("IntersectionObserver" in window) {
    var sections = document.querySelectorAll(".section, .hero");

    // Mark sections already in view so they don’t start hidden
    sections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        section.classList.add("is-visible");
      }
      section.style.opacity = section.classList.contains("is-visible") ? "1" : "0";
      section.style.transform = section.classList.contains("is-visible") ? "translateY(0)" : "translateY(12px)";
      section.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    });

    var style = document.createElement("style");
    style.textContent =
      ".section.is-visible, .hero.is-visible { opacity: 1 !important; transform: translateY(0) !important; }";
    document.head.appendChild(style);

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.05 }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
})();
