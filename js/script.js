/* js/script.js */

document.addEventListener("DOMContentLoaded", function () {
  console.log("SCRIPT READY");

  // 0. EMAIL PROTECTION – minimal & robust
  document.querySelectorAll(".email-protect").forEach((el) => {
    const u = el.dataset.user;
    const d = el.dataset.domain;
    if (!u || !d) return;

    const real = `${u}@${d}`;

    // Fallback, falls JS aus ist: wird im HTML schon als mailto stehen,
    // hier setzen wir es nur sicherheitshalber nochmal.
    el.setAttribute("href", `mailto:${real}`);

    el.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = `mailto:${real}`;
    });
  });

  // 0b. NAV SCROLL WITH HEADER OFFSET
  const header = document.getElementById("siteHeader");
  const headerHeight = header ? header.offsetHeight : 0;

  function scrollToId(id) {
    const target = document.getElementById(id);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const y = rect.top + window.scrollY - headerHeight - 20; // Puffer
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  // Navigation oben im Header
  document.querySelectorAll(".nav-work").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToId("work");
    });
  });

  document.querySelectorAll(".nav-about").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToId("about");
    });
  });

  document.querySelectorAll(".nav-contact").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToId("footer-snap-point");
    });
  });

  // 1. SMOOTH SCROLL SNAP TO ABOUT
  let scrollCount = 0;
  let scrollTimeout;
  const heroSection = document.querySelector("section:first-of-type");
  const aboutSection = document.getElementById("about");

  if (heroSection && aboutSection) {
    let hasSnapped = false;

    window.addEventListener(
      "scroll",
      () => {
        if (hasSnapped) return;

        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const currentScroll = window.scrollY;

        if (currentScroll > 50 && currentScroll < heroBottom - 200) {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            scrollCount++;
            if (scrollCount >= 3 && !hasSnapped) {
              hasSnapped = true;
              aboutSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }, 150);
        }

        if (currentScroll < 100) {
          scrollCount = 0;
          hasSnapped = false;
        }
      },
      { passive: true }
    );
  }

  // 2. START BLUR EFFECT
  if (typeof window.initLiquidText === "function") {
    window.initLiquidText();
  }

  // 3. FADE-IN OBSERVER
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("animate");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  const aboutSec = document.getElementById("about");
  if (aboutSec) observer.observe(aboutSec);

  // 4. HEADER SCROLL LOGIC (Throttled)
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking && header) {
        window.requestAnimationFrame(() => {
          header.classList.toggle("collapsed", window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  // 5. LOTTIE ANIMATION – nach load starten, damit Lottie-Bibliothek sicher da ist
  function initLottieLogo() {
    const c = document.getElementById("lottieLogoContainer");
    if (!c) return;
    if (typeof lottie === "undefined") {
      showLogoFallback(c);
      return;
    }
    const anim = lottie.loadAnimation({
      container: c,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "logo.json",
    });
    anim.addEventListener("DOMLoaded", () => {
      c.classList.add("lottie-loaded");
    });
    // Fallback: wenn nach 2,5 s kein SVG gerendert wurde (z. B. data.json fehlt)
    const fallbackTimer = setTimeout(() => {
      if (!c.querySelector("svg")) showLogoFallback(c);
    }, 2500);
    anim.addEventListener("DOMLoaded", () => clearTimeout(fallbackTimer), { once: true });
  }
  function showLogoFallback(container) {
    if (container.querySelector(".logo-fallback")) return;
    const a = document.createElement("a");
    a.href = "#";
    a.className = "logo-fallback";
    a.setAttribute("aria-label", "Startseite");
    a.textContent = "TB";
    a.style.cssText = "font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 1.75rem; color: #0c0c0c; text-decoration: none; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;";
    a.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    container.appendChild(a);
  }
  initLottieLogo();

  // 6. FOOTER OVERLAYS - FIXED
  setTimeout(() => {
    bindOverlay("imprintLink", "imprintOverlay", "imprint.json");
    bindOverlay("privacyLink", "privacyOverlay", "privacy.json");
  }, 500);
});

// PROJECT NAV – pro7 (Mercedes) → project.html?id=project_01, Rest → project.html?id=…
function openProject(projectId) {
  const transition = document.querySelector('.page-transition');
  const id = projectId === 'pro7' ? 'project_01' : projectId;
  const url = 'project.html?id=' + encodeURIComponent(id);
  if (transition) {
    transition.classList.add('active');
    setTimeout(function () { window.location.href = url; }, 300);
  } else {
    window.location.href = url;
  }
}

// OVERLAY LOGIC - COMPLETELY FIXED
function bindOverlay(btnId, overlayId, jsonFile) {
  const btn = document.getElementById(btnId);
  const ov = document.getElementById(overlayId);

  if (!btn || !ov) {
    console.error(`Missing elements: ${btnId} or ${overlayId}`);
    return;
  }

  const content = ov.querySelector(".overlay-content");
  const close = ov.querySelector(".close-btn");

  if (!content) {
    console.error("Missing .overlay-content in", overlayId);
    return;
  }

  // Open overlay
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    ov.classList.add("active");
    document.body.style.overflow = "hidden";
    document.body.classList.add("overlay-open");

    // Nur laden, wenn noch leer
    if (content.innerHTML.trim() === "") {
      fetch(jsonFile)
        .then((r) => {
          if (!r.ok) throw new Error("Network response was not ok");
          return r.json();
        })
        .then((data) => {
          let html = "";

          // Haupttitel (z.B. "Impressum" / "Datenschutzerklärung")
          if (data.title) {
            html += `<h1>${data.title}</h1>`;
          }

          if (Array.isArray(data.sections)) {
            data.sections.forEach((section) => {
              if (section.headline) {
                html += `<h2>${section.headline}</h2>`;
              }
              if (section.body) {
                html += `<p>${section.body}</p>`;
              }
            });
          }

          content.innerHTML = html;
        })
        .catch((err) => {
          console.error("JSON Error:", err);
          content.innerHTML = "Fehler beim Laden des Inhalts.";
        });
    }
  });

  const hide = () => {
    ov.classList.remove("active");
    document.body.style.overflow = "";
    document.body.classList.remove("overlay-open");
  };

  if (close) close.onclick = hide;
  ov.onclick = (e) => {
    if (e.target === ov) hide();
  };
}

