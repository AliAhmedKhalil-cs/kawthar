(function () {
  "use strict";

  const INSTAGRAM_URL = "https://www.instagram.com/kawthareg_/";
  const FACEBOOK_URL = "https://www.facebook.com/groups/1123525308506342/";

  const instagramSvg = `
    <svg class="kaw-social-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Z"/>
    </svg>
  `;

  const facebookSvg = `
    <svg class="kaw-social-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.95c0-.9.25-1.5 1.55-1.5H16.7V4.7c-.3-.04-1.3-.11-2.47-.11-2.44 0-4.11 1.49-4.11 4.22v2.09H7.35V14h2.77v8h3.38Z"/>
    </svg>
  `;

  function socialMarkup(type) {
    if (type === "instagram") {
      return `
        <span class="kaw-social-icon-wrap">${instagramSvg}</span>
        <span class="kaw-social-text-block">
          <span class="kaw-social-label">Instagram</span>
          <span class="kaw-social-sub">@kawthareg_</span>
        </span>
      `;
    }

    return `
      <span class="kaw-social-icon-wrap">${facebookSvg}</span>
      <span class="kaw-social-text-block">
        <span class="kaw-social-label">Facebook</span>
        <span class="kaw-social-sub">KAWTHAR Community</span>
      </span>
    `;
  }

  function detectType(anchor) {
    const href = (anchor.getAttribute("href") || "").toLowerCase();
    const text = (anchor.textContent || "").toLowerCase();

    if (href.includes("instagram.com") || text.includes("instagram") || text.includes("insta")) {
      return "instagram";
    }

    if (href.includes("facebook.com") || text.includes("facebook") || text.includes("facebook")) {
      return "facebook";
    }

    return null;
  }

  function upgradeAnchor(anchor, type) {
    if (!anchor) return;
    if (anchor.dataset.kawSocialEnhanced === "1") return;

    anchor.dataset.kawSocialEnhanced = "1";
    anchor.classList.add("kaw-social-link", type === "instagram" ? "kaw-social-instagram" : "kaw-social-facebook");
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noopener noreferrer");

    if (type === "instagram") {
      anchor.setAttribute("href", INSTAGRAM_URL);
      anchor.setAttribute("aria-label", "Open KAWTHAR Instagram");
    } else {
      anchor.setAttribute("href", FACEBOOK_URL);
      anchor.setAttribute("aria-label", "Open KAWTHAR Facebook group");
    }

    anchor.innerHTML = socialMarkup(type);
  }

  function findSocialAnchors() {
    const anchors = Array.from(document.querySelectorAll('a[href], a'));

    anchors.forEach((a) => {
      const type = detectType(a);
      if (!type) return;
      upgradeAnchor(a, type);
    });
  }

  function run() {
    findSocialAnchors();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  setTimeout(run, 500);
  setTimeout(run, 1500);

  console.info("KAWTHAR social links upgrade loaded.");
})();
