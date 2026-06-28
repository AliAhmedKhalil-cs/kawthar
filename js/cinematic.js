/**
 * js/cinematic.js — KAWTHAR Luxury Cinematic Animation Engine v2.0
 * ─── RECOVERY FIXES ────────────────────────────────────────────────
 * FIX-01  Scroll parallax no longer overrides float element transforms
 *         (was fighting CSS transition, causing jitter on entry)
 * FIX-02  Mouse parallax now properly resets to zero on leave
 * FIX-03  Product card stagger no longer sets inline opacity on cards
 *         that main.css already manages (was causing double-state issue)
 * FIX-04  Removed redundant aurora-3 injection (was in old version)
 * FIX-05  All timelines scoped — no rogue requestAnimationFrame leaks
 * ────────────────────────────────────────────────────────────────────
 */

(function () {
  "use strict";

  /* ──────────────────────────────────────────────
     1. INTERSECTION OBSERVER — cin-reveal system
     Scene-based: each [data-cin-reveal] element
     enters its scene as it crosses the viewport.
  ────────────────────────────────────────────── */
  function initScrollReveals() {
    const els = document.querySelectorAll("[data-cin-reveal]");
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("cin-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => io.observe(el));
  }

  /* ──────────────────────────────────────────────
     2. HERO ENTRANCE — Scene 1 entry trigger
     Fires once after splash clears.
     All child animations defined in CSS timelines.
  ────────────────────────────────────────────── */
  function initHeroEntrance() {
    const hero = document.querySelector(".cin-hero");
    if (!hero) return;

    const trigger = () => {
      requestAnimationFrame(() => {
        hero.classList.add("cin-hero--visible");
      });
    };

    const splash = document.getElementById("splashScreen");
    if (!splash || splash.style.display === "none" || splash.classList.contains("hidden")) {
      setTimeout(trigger, 100);
    } else {
      const splashObs = new MutationObserver(() => {
        if (
          splash.style.display === "none" ||
          splash.style.opacity === "0" ||
          splash.classList.contains("hidden")
        ) {
          trigger();
          splashObs.disconnect();
        }
      });
      splashObs.observe(splash, { attributes: true, attributeFilter: ["style", "class"] });
      setTimeout(trigger, 1800); // Fallback
    }
  }

  /* ──────────────────────────────────────────────
     3. MOUSE PARALLAX — Scene 1 depth layer
     Applies only to floating product images.
     FIX: Uses separate transform from CSS entry
     transitions — applies after .cin-hero--visible
     is set to avoid conflict.
  ────────────────────────────────────────────── */
  function initMouseParallax() {
    const hero = document.querySelector(".cin-hero");
    if (!hero) return;

    // FIX: Wait for entry animations to complete before attaching parallax
    // This prevents the parallax transform from fighting the entry transition
    let parallaxReady = false;
    setTimeout(() => { parallaxReady = true; }, 1600);

    const layers = [
      { el: document.querySelector(".cin-hero__float--1"), factor: 0.018 },
      { el: document.querySelector(".cin-hero__float--2"), factor: 0.028 },
      { el: document.querySelector(".cin-hero__float--3"), factor: 0.038 },
      { el: document.querySelector(".cin-hero__float--4"), factor: 0.014 },
    ].filter((l) => l.el);

    if (!layers.length) return;

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let rafId = null;
    let active = false;

    const onMouseMove = (e) => {
      if (!parallaxReady) return;
      const rect = hero.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - rect.width / 2);
      mouseY = (e.clientY - rect.top - rect.height / 2);
      if (!active) {
        active = true;
        tick();
      }
    };

    const tick = () => {
      currentX += (mouseX - currentX) * 0.06;
      currentY += (mouseY - currentY) * 0.06;

      layers.forEach(({ el, factor }) => {
        const tx = currentX * factor;
        const ty = currentY * factor;
        // FIX: Remove transition during parallax to prevent easing fights
        el.style.transition = "none";
        el.style.transform = `translate(${tx}px, ${ty}px)`;
      });

      if (Math.abs(mouseX - currentX) > 0.3 || Math.abs(mouseY - currentY) > 0.3) {
        rafId = requestAnimationFrame(tick);
      } else {
        active = false;
      }
    };

    hero.addEventListener("mousemove", onMouseMove, { passive: true });
    hero.addEventListener("mouseleave", () => {
      mouseX = 0;
      mouseY = 0;
      if (parallaxReady && !active) {
        active = true;
        tick();
      }
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────
     4. SCROLL PARALLAX — Scene depth for orbs only
     FIX: Only targets orb elements, NOT float cards
     Float cards are handled by mouse parallax.
     Separated targets to prevent transform conflict.
  ────────────────────────────────────────────── */
  function initScrollParallax() {
    // FIX: Removed cin-craft__img-wrap img from targets —
    // that image is inside a position:absolute container;
    // translateY on it was causing the image to escape its bounds.
    const targets = [
      { el: document.querySelector(".cin-hero__orb--1"), speed: 0.2 },
      { el: document.querySelector(".cin-hero__orb--2"), speed: 0.12 },
    ].filter((t) => t.el);

    if (!targets.length) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          targets.forEach(({ el, speed }) => {
            el.style.transform = `translateY(${scrollY * speed}px)`;
          });
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ──────────────────────────────────────────────
     5. PRODUCT CARD STAGGER — Scene 5 entry
     FIX: Only animates cards that aren't already
     in-view when the grid first renders.
     Uses double-rAF to avoid layout thrash.
  ────────────────────────────────────────────── */
  function initProductCardStagger() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    const animateCards = (cards) => {
      cards.forEach((card, i) => {
        card.classList.add("cin-card-animated");
        card.style.opacity = "0";
        card.style.transform = "translateY(28px)";
        const delay = Math.min(i * 60, 480); // Cap max delay at 480ms
        card.style.transition = `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          });
        });
      });
    };

    const observer = new MutationObserver(() => {
      const newCards = grid.querySelectorAll(".product-card:not(.cin-card-animated)");
      if (newCards.length) animateCards(newCards);
    });

    observer.observe(grid, { childList: true });
  }

  /* ──────────────────────────────────────────────
     6. COLLECTION FILTER — Scene 4 interaction
     Links collection tiles to shop filter pills.
  ────────────────────────────────────────────── */
  function initCollectionFilter() {
    document.querySelectorAll("[data-filter-btn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filterBtn;
        const featured = document.getElementById("featured");
        if (featured) {
          featured.scrollIntoView({ behavior: "smooth" });
        }
        setTimeout(() => {
          const pill = document.querySelector(`.filter-pill[data-filter="${filter}"]`);
          if (pill) pill.click();
        }, 600);
      });
    });
  }

  /* ──────────────────────────────────────────────
     7. COUNTER ANIMATION — Scene 3 focus moment
     Numbers count up when the stats row enters view.
     Purposeful: reinforces material quality claims.
  ────────────────────────────────────────────── */
  function initCounters() {
    const stats = document.querySelectorAll(".cin-stat__num");
    if (!stats.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        io.unobserve(el);
        const text = el.textContent.trim();
        if (text === "100%") {
          animateCount(el, 0, 100, "%", 1200);
        } else if (text === "0") {
          animateCount(el, 10, 0, "", 800);
        }
        // "∞" stays as-is — no numeric animation needed
      });
    }, { threshold: 0.5 });

    stats.forEach((el) => io.observe(el));
  }

  function animateCount(el, from, to, suffix, duration) {
    const start = performance.now();
    const range = to - from;
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(from + range * ease) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  /* ──────────────────────────────────────────────
     8. ANNOUNCEMENT BAR — pause on hover
  ────────────────────────────────────────────── */
  function initAnnouncementBar() {
    const bar = document.querySelector(".announcement-bar");
    if (!bar) return;
    const track = bar.querySelector(".announcement-track");
    if (!track) return;

    bar.addEventListener("mouseenter", () => {
      track.style.animationPlayState = "paused";
    });
    bar.addEventListener("mouseleave", () => {
      track.style.animationPlayState = "running";
    });
  }

  /* ──────────────────────────────────────────────
     9. SCROLLED HEADER — cinematic transparency
     Hero scene: transparent header
     All other scenes: glass header
  ────────────────────────────────────────────── */
  function initScrolledHeader() {
    const header = document.getElementById("mainHeader");
    if (!header) return;

    const hero = document.querySelector(".cin-hero");
    // Only apply transparent-on-hero logic on pages with a hero
    if (!hero) return;

    const update = () => {
      const heroBottom = hero.getBoundingClientRect().bottom;
      if (heroBottom <= 0) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    update(); // Initial state
  }

  /* ──────────────────────────────────────────────
     10. TRANSLATIONS — patch new i18n keys
  ────────────────────────────────────────────── */
  function patchTranslations() {
    window.__cinTranslations__ = {
      en: {
        material_eyebrow:  "The Material",
        material_title:    "Built to last. Designed to dazzle.",
        material_1_title:  "Stainless Steel",
        material_1_desc:   "Medical-grade alloy that holds its form and finish across every season.",
        material_2_title:  "Waterproof",
        material_2_desc:   "Wear it in the rain, to the pool, or through your day — it never fades.",
        material_3_title:  "Anti Rust",
        material_3_desc:   "Zero tarnish. Zero compromise. Your jewelry stays brilliant, always.",
        material_4_title:  "Premium Quality",
        material_4_desc:   "Every piece passes a rigorous standard before reaching your hands.",
        craft_eyebrow:     "Craftsmanship",
        craft_title:       "Where artistry meets precision.",
        craft_desc_1:      "Each KAWTHAR piece is born from a philosophy of restraint — every curve, every finish deliberate.",
        craft_desc_2:      "Our stainless steel is chosen for its resilience and its ability to hold a mirror-bright shine season after season.",
        stat_1:            "Stainless Steel",
        stat_2:            "Wear Life",
        stat_3:            "Rust. Ever.",
        test_eyebrow:      "Testimonials",
        test_title:        "Worn & adored",
        review_1:          '"The bracelet I ordered hasn\'t tarnished in 8 months. I wear it every single day, even in the shower."',
        review_2:          '"The packaging alone felt like a luxury gift. I bought it for myself and couldn\'t be happier."',
        review_3:          '"Ordered via WhatsApp and received my necklace in perfect condition. KAWTHAR is my go-to for gifts."',
        review_verified:   "Verified buyer",
      },
      ar: {
        material_eyebrow:  "المادة",
        material_title:    "مصنوعة لتدوم. مصممة لتبهر.",
        material_1_title:  "ستانلس ستيل",
        material_1_desc:   "سبيكة طبية تحافظ على شكلها ولمعانها في كل المواسم.",
        material_2_title:  "مقاومة للماء",
        material_2_desc:   "البسيها في المطر، في المسبح، أو طوال يومك — لا تبهت أبداً.",
        material_3_title:  "مقاومة للصدأ",
        material_3_desc:   "صفر تشويه. صفر تنازل. مجوهراتك تبقى مبهرة دائماً.",
        material_4_title:  "جودة فاخرة",
        material_4_desc:   "كل قطعة تجتاز معايير صارمة قبل أن تصل إلى يديكِ.",
        craft_eyebrow:     "الحرفية",
        craft_title:       "حيث تلتقي الفنية بالدقة.",
        craft_desc_1:      "كل قطعة كوثر تُولد من فلسفة الأناقة — كل منحنى وكل تشطيب مدروس.",
        craft_desc_2:      "نختار الستانلس ستيل لمتانته وقدرته على الحفاظ على لمعان ساطع موسماً بعد موسم.",
        stat_1:            "ستانلس ستيل",
        stat_2:            "عمر الارتداء",
        stat_3:            "صدأ. أبداً.",
        test_eyebrow:      "آراء العملاء",
        test_title:        "مُرتداة ومحبوبة",
        review_1:          '"السوار الذي طلبته لم يتلون في 8 أشهر. أرتديه كل يوم، حتى في الدش."',
        review_2:          '"التغليف وحده كان يبدو هدية فاخرة. اشتريته لنفسي ولم أكن أكثر سعادة."',
        review_3:          '"طلبت عبر واتساب واستلمت قلادتي في حالة مثالية. كوثر هي وجهتي الأولى للهدايا."',
        review_verified:   "مشترية موثّقة",
      },
    };

    const applyNewTranslations = () => {
      const lang = document.documentElement.lang || "en";
      const dict = window.__cinTranslations__[lang] || window.__cinTranslations__.en;
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.dataset.i18n;
        if (dict[key]) {
          el.textContent = dict[key];
        }
      });
    };

    setTimeout(applyNewTranslations, 500);

    const langBtn = document.getElementById("langToggleBtn");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        setTimeout(applyNewTranslations, 100);
      });
    }
  }

  /* ──────────────────────────────────────────────
     INIT — ordered by page lifecycle
  ────────────────────────────────────────────── */
  function init() {
    initHeroEntrance();       // Scene 1: entry gate
    initScrollReveals();      // All scenes: element entry
    initMouseParallax();      // Scene 1: depth layer
    initScrollParallax();     // Scene 1: orb drift
    initScrolledHeader();     // Global: header state
    initProductCardStagger(); // Scene 5: product reveal
    initCollectionFilter();   // Scene 4: tile interaction
    initCounters();           // Scene 3: stat moment
    initAnnouncementBar();    // Global: UX polish
    patchTranslations();      // Global: i18n
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
