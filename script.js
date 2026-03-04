(function () {
  "use strict";

  // ----- Theme -----
  var THEME_KEY = "portfolio-theme";
  var themeToggle = document.querySelector(".theme-toggle");

  function getPreferredTheme() {
    var stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") return stored;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
    return "dark";
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    setTheme(getPreferredTheme());
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme") || getPreferredTheme();
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
      if (!localStorage.getItem(THEME_KEY)) setTheme(e.matches ? "dark" : "light");
    });
  }

  initTheme();

  // ----- Scroll progress -----
  var scrollProgress = document.querySelector(".scroll-progress");
  if (scrollProgress) {
    function updateScrollProgress() {
      var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var pct = height > 0 ? Math.round((winScroll / height) * 100) : 0;
      scrollProgress.style.width = pct + "%";
      scrollProgress.setAttribute("aria-valuenow", pct);
    }
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();
  }

  // ----- Active section (nav highlight) -----
  var navLinks = document.querySelectorAll(".nav-link");
  var sections = document.querySelectorAll("#about, #experience, #skills, #projects, #education, #contact");

  if ("IntersectionObserver" in window && navLinks.length && sections.length) {
    var observerOpts = { rootMargin: "-20% 0px -70% 0px", threshold: 0 };
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            var href = link.getAttribute("href") || "";
            if (href === "#" + id) {
              link.setAttribute("aria-current", "page");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      observerOpts
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // ----- Back to top -----
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    function toggleBackToTop() {
      var show = window.scrollY > 400;
      backToTop.classList.toggle("is-visible", show);
    }
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ----- Copy email -----
  var emailBtn = document.querySelector(".contact-link-email");
  if (emailBtn && navigator.clipboard && navigator.clipboard.writeText) {
    emailBtn.addEventListener("click", function () {
      var email = emailBtn.getAttribute("data-copy") || "";
      navigator.clipboard.writeText(email).then(
        function () {
          emailBtn.classList.add("copied");
          setTimeout(function () {
            emailBtn.classList.remove("copied");
          }, 2000);
        },
        function () {
          window.location.href = "mailto:" + email;
        }
      );
    });
  } else if (emailBtn) {
    emailBtn.addEventListener("click", function () {
      var email = emailBtn.getAttribute("data-copy") || "";
      window.location.href = "mailto:" + email;
    });
  }

  // ----- Stagger index for animations -----
  function setStaggerIndex(selector, prop) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      el.style.setProperty(prop, String(i));
    });
  }
  setStaggerIndex(".timeline-item", "--i");
  setStaggerIndex(".project-card", "--i");
  setStaggerIndex(".skill-group", "--i");

  // ----- Current year in footer -----
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ----- Mobile nav toggle -----
  var navToggle = document.querySelector(".nav-toggle");
  var navLinksContainer = document.querySelector(".nav-links");
  if (navToggle && navLinksContainer) {
    navToggle.addEventListener("click", function () {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !expanded);
      navLinksContainer.classList.toggle("is-open", !expanded);
    });

    navLinksContainer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        navLinksContainer.classList.remove("is-open");
      });
    });
  }

  // ----- Scroll reveal (sections) -----
  if ("IntersectionObserver" in window) {
    var sectionEls = document.querySelectorAll(".section, .hero");

    sectionEls.forEach(function (section) {
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

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.05 }
    );
    sectionEls.forEach(function (section) {
      revealObserver.observe(section);
    });
  }
})();
