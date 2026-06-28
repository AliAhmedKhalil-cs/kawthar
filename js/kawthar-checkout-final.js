(function () {
  "use strict";

  if (!/checkout\.html/i.test(location.pathname)) return;

  const IPA = "kawtharabdo@instapay";

  function safeText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function unlockCheckout() {
    document.body.classList.add("kaw-final-ready");

    document.querySelectorAll("#splashScreen,.splash-screen,#goStartup,.go-startup").forEach((el) => {
      el.remove();
    });

    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowY = "auto";

    const page = document.querySelector(".checkout-page");
    if (page) {
      page.style.display = "block";
      page.style.opacity = "1";
      page.style.visibility = "visible";
    }
  }

  function removeDuplicateInjectedPayments() {
    document.querySelectorAll("#onlineGatewayBox,#manualPaymentGateway,#kawSimpleCheckoutPay").forEach((el) => {
      el.remove();
    });
  }

  function simplifyExistingCheckout() {
    safeText("payPanelTitle", "Easy InstaPay payment");
    safeText("ipaHeroTitle", "Easy payment");
    safeText("ipaHeroSub", "Transfer via InstaPay, then confirm on WhatsApp");
    safeText("ipaAddrLabel", "InstaPay address");
    safeText("ipaAddress", IPA);
    safeText("qrLabel", "");
    safeText("qrNote", "");
    safeText("confirmBtnText", "Confirm on WhatsApp");
    safeText("confirmNote", "This opens WhatsApp with your order and payment confirmation request");

    document.querySelectorAll(".ipa-qr-card,.ipa-qr-wrap,#qrCanvas,#stepsGuide,.ipa-steps-guide").forEach((el) => {
      el.style.display = "none";
      el.setAttribute("aria-hidden", "true");
    });

    const copyBtn = document.getElementById("copyIpaBtn");
    if (copyBtn && !copyBtn.dataset.kawFinalCopy) {
      copyBtn.dataset.kawFinalCopy = "1";
      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(IPA);
          copyBtn.setAttribute("aria-label", "InstaPay address copied");
        } catch {}
      });
    }
  }

  function addEmptyCartGuidance() {
    const list = document.getElementById("coCartList");
    if (!list) return;

    setTimeout(() => {
      const hasItem = Boolean(list.querySelector(".co-cart-item"));
      if (hasItem) return;
      if (document.getElementById("kawCheckoutEmptyHelp")) return;

      const help = document.createElement("div");
      help.id = "kawCheckoutEmptyHelp";
      help.className = "kaw-shop-empty-note";
      help.innerHTML = `
        <strong>Your selection is empty</strong>
        <p>Go back to the shop, choose your piece, then return here to confirm the order through InstaPay and WhatsApp.</p>
      `;

      list.appendChild(help);
    }, 1400);
  }

  function run() {
    unlockCheckout();
    removeDuplicateInjectedPayments();
    simplifyExistingCheckout();
    addEmptyCartGuidance();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  setTimeout(run, 400);
  setTimeout(run, 1200);
  setTimeout(unlockCheckout, 2200);

  console.info("KAWTHAR Checkout Finalizer applied.");
})();
