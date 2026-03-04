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

/* js/text.js */


window.initLiquidText = function() {
    const textEl = document.getElementById('dynamic-text');
    const svgDefs = document.getElementById('svg-defs');
    
    if (!textEl || !svgDefs) return;


    const textContent = textEl.textContent.trim();
    textEl.innerHTML = '';
    const charElements = [];
    const words = textContent.split(' ');


    words.forEach((word, wIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'pre';


        word.split('').forEach((char, cIndex) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char;
            wordSpan.appendChild(span);


            const index = wIndex * 100 + cIndex;
            const filterId = `blur-${index}`;


            const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            filter.setAttribute('id', filterId);
            filter.setAttribute('color-interpolation-filters', 'linearRGB');
            filter.setAttribute('x', '-50%');
            filter.setAttribute('y', '-50%');
            filter.setAttribute('width', '200%');
            filter.setAttribute('height', '200%');
            filter.innerHTML = `<feGaussianBlur in="SourceGraphic" stdDeviation="0"/>`;
            svgDefs.appendChild(filter);


            charElements.push({
                el: span,
                filter: filter.querySelector('feGaussianBlur'),
                targetBlur: 0, currentBlur: 0,
                targetX: 0, currentX: 0,
                targetY: 0, currentY: 0,
                targetScale: 1, currentScale: 1
            });


            span.style.filter = `url(#${filterId})`;
        });


        textEl.appendChild(wordSpan);
        textEl.appendChild(document.createTextNode(' '));
    });


    let mouseX = 0, mouseY = 0;


    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;


        charElements.forEach(char => {
            const rect = char.el.getBoundingClientRect();
            const charCenterX = rect.left + rect.width / 2;
            const charCenterY = rect.top + rect.height / 2;
            const dx = mouseX - charCenterX;
            const dy = mouseY - charCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 220;


            if (distance < maxDistance) {
                const influence = Math.pow(1 - (distance / maxDistance), 4);
                char.targetBlur = influence * 8;
                const pushStrength = influence * 25;
                const angle = Math.atan2(dy, dx);
                char.targetX = -Math.cos(angle) * pushStrength;
                char.targetY = -Math.sin(angle) * pushStrength;
                char.targetScale = 1 + (influence * 0.1);
            } else {
                char.targetBlur = 0;
                char.targetX = 0;
                char.targetY = 0;
                char.targetScale = 1;
            }
        });
    });


    function animateLoop() {
        charElements.forEach(char => {
            char.currentBlur += (char.targetBlur - char.currentBlur) * 0.18;
            char.currentX += (char.targetX - char.currentX) * 0.18;
            char.currentY += (char.targetY - char.currentY) * 0.18;
            char.currentScale += (char.targetScale - char.currentScale) * 0.18;


            if (Math.abs(char.currentBlur) > 0.05) {
                char.filter.setAttribute('stdDeviation', char.currentBlur);
            } else {
                char.filter.setAttribute('stdDeviation', '0');
            }


            char.el.style.transform = `translate(${char.currentX}px, ${char.currentY}px) scale(${char.currentScale})`;
        });
        requestAnimationFrame(animateLoop);
    }


    animateLoop();


    setTimeout(() => {
        charElements.forEach((c, i) => {
            setTimeout(() => c.el.classList.add('visible'), i * 30);
        });
    }, 100);


    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio >= 0.5) {
                triggerColumnAnimation();
                textObserver.unobserve(entry.target);
            }
        });
    }, { threshold: [0, 0.5, 1] });


    textObserver.observe(textEl);
};


function triggerColumnAnimation() {
    const columns = document.querySelectorAll('.sub-text .col');
    
    columns.forEach((col, colIndex) => {
        const lines = col.querySelectorAll('p, h4');
        
        lines.forEach((line, lineIndex) => {
            line.style.opacity = '0';
            line.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                line.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, (colIndex * 200) + (lineIndex * 80));
        });
    });
}


window.addEventListener('load', () => {
    const gradientBg = document.querySelector('.gradient-bg');
    if (gradientBg) {
        setTimeout(() => {
            gradientBg.classList.add('visible');
        }, 300);
    }
});

// FADE OUT GRADIENT BLOBS ON SCROLL
window.addEventListener('scroll', () => {
    const gradientBg = document.querySelector('.gradient-bg');
    if (!gradientBg) return;
    
    const workSection = document.getElementById('work');
    if (!workSection) return;
    
    const workRect = workSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Start fading when work section enters bottom half of screen
    // Fully faded when work section reaches 30% from top
    if (workRect.top < windowHeight * 0.7) {
        const fadeStart = windowHeight * 0.7;
        const fadeEnd = windowHeight * 0.3;
        const fadeRange = fadeStart - fadeEnd;
        const currentPos = workRect.top;
        
        if (currentPos <= fadeEnd) {
            gradientBg.style.opacity = 0;
        } else {
            const fadeProgress = (currentPos - fadeEnd) / fadeRange;
            gradientBg.style.opacity = fadeProgress;
        }
    } else {
        gradientBg.style.opacity = 1;
    }
    
    gradientBg.style.transition = 'opacity 0.4s ease';
});
/* js/work.js - Simplified video playback */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 work.js loaded');
    
    const projectItems = document.querySelectorAll('.project-item');
    console.log(`Found ${projectItems.length} projects`);
    
    projectItems.forEach((item, i) => {
        const video = item.querySelector('video');
        
        if (!video) {
            console.warn(`No video in project ${i}`);
            return;
        }
        
        console.log(`Setup video ${i}: ${video.src}`);
        
        // Set video properties
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'metadata';
        
        // Pause initially
        video.pause();
        
        // Play on hover
        item.addEventListener('mouseenter', () => {
            console.log(`▶ Play ${i}`);
            video.play().catch(err => console.warn(`Play blocked ${i}:`, err));
        });
        
        // Pause on leave
        item.addEventListener('mouseleave', () => {
            console.log(`⏸ Pause ${i}`);
            video.pause();
            video.currentTime = 0;
        });
    });
});
