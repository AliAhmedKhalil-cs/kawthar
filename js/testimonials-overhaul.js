(function () {
  const newSectionHTML = `
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

  function isTargetSection(section) {
    if (!section) return false;
    const text = (section.textContent || "").toLowerCase();
    return text.includes("worn & adored") || text.includes("verified buyer");
  }

  function replaceTestimonials() {
    const sections = Array.from(document.querySelectorAll("section, div"));
    const target = sections.find(isTargetSection);

    if (!target) return;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = newSectionHTML;
    const fresh = wrapper.firstElementChild;

    target.replaceWith(fresh);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", replaceTestimonials);
  } else {
    replaceTestimonials();
  }
})();
