(function () {
  const sectionHTML = `
    <section class="kaw-testimonials" id="testimonials" aria-labelledby="kawTestimonialsTitle">
      <div class="container">
        <div class="kaw-testimonials__head">
          <div class="kaw-testimonials__kicker">Customer Feedback</div>
          <h2 class="kaw-testimonials__title" id="kawTestimonialsTitle">Worn & adored</h2>
          <p class="kaw-testimonials__sub">
            Real words from customers who love the premium finish, elegant feel, and everyday durability of KAWTHAR pieces.
          </p>

          <div class="kaw-testimonials__graphic" aria-hidden="true">
            <span class="line"></span>
            <span class="dot"></span>
            <span class="line"></span>
          </div>
        </div>

        <div class="kaw-testimonials__grid">
          <article class="kaw-testimonial-card">
            <div class="kaw-testimonial-stars">★★★★★</div>
            <p class="kaw-testimonial-text">
              “The bracelet still looks beautiful even after months of use. It feels elegant, light, and easy to wear every day.”
            </p>
            <div class="kaw-testimonial-sep"></div>
            <div class="kaw-testimonial-meta">
              <strong class="kaw-testimonial-name">Nour A.</strong>
              <span class="kaw-testimonial-role">Verified Buyer</span>
            </div>
          </article>

          <article class="kaw-testimonial-card">
            <div class="kaw-testimonial-stars">★★★★★</div>
            <p class="kaw-testimonial-text">
              “The packaging felt thoughtful and premium, and the necklace quality was even better than I expected. I would definitely order again.”
            </p>
            <div class="kaw-testimonial-sep"></div>
            <div class="kaw-testimonial-meta">
              <strong class="kaw-testimonial-name">Mariam K.</strong>
              <span class="kaw-testimonial-role">Verified Buyer</span>
            </div>
          </article>

          <article class="kaw-testimonial-card">
            <div class="kaw-testimonial-stars">★★★★★</div>
            <p class="kaw-testimonial-text">
              “Ordering through WhatsApp was smooth, and my piece arrived in great condition. KAWTHAR feels feminine, soft, and premium.”
            </p>
            <div class="kaw-testimonial-sep"></div>
            <div class="kaw-testimonial-meta">
              <strong class="kaw-testimonial-name">Sara M.</strong>
              <span class="kaw-testimonial-role">Verified Buyer</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  `;

  function findTestimonialsSection() {
    const headings = Array.from(document.querySelectorAll("h1, h2, h3, .section-title, [class*='title']"));

    const heading = headings.find((el) => {
      const text = (el.textContent || "").toLowerCase().trim();
      return text.includes("worn") && text.includes("adored");
    });

    if (!heading) return null;

    const section = heading.closest("section");
    if (section) return section;

    const parentSection = heading.closest("[class*='testimonial'], [id*='testimonial']");
    if (parentSection) return parentSection;

    return null;
  }

  function replaceTestimonials() {
    if (document.querySelector(".kaw-testimonials")) return true;

    const target = findTestimonialsSection();
    if (!target) return false;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = sectionHTML.trim();
    const fresh = wrapper.firstElementChild;

    target.replaceWith(fresh);
    return true;
  }

  function tryReplace() {
    let attempts = 0;

    const timer = setInterval(() => {
      attempts += 1;

      if (replaceTestimonials() || attempts >= 20) {
        clearInterval(timer);
      }
    }, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryReplace);
  } else {
    tryReplace();
  }
})();
