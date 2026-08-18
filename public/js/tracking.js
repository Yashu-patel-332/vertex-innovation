/* public/js/tracking.js
 * ---------------------------------------------------------------------------
 * CHANGE LOG:
 *  - NEW FILE: Google Ads conversion + engagement tracking.
 *  - CHANGE: phone/whatsapp clicks and contact form submits now fire dedicated
 *    GA4 events `phone_click`, `whatsapp_click`, `contact_form_submit` (for
 *    Google Ads conversion import via GA4 key events) alongside the existing
 *    `engagement` / Ads `conversion` events.
 *  - Reads the tracking config injected by footer.ejs (window.VERTEX_TRACKING).
 *  - Works with BOTH Google Tag Manager (dataLayer.push) and direct gtag.
 *  - Uses placeholders for the conversion labels so the structure is ready;
 *    fill GOOGLE_ADS_PHONE_LABEL / WHATSAPP_LABEL / FORM_LABEL in production.
 * --------------------------------------------------------------------------- */
(function () {
  var cfg =
    window.VERTEX_TRACKING && window.VERTEX_TRACKING.enabled
      ? window.VERTEX_TRACKING
      : null;

  // Push an event to the dataLayer (GTM) and fire gtag (GA4) if present.
  function push(eventName, params) {
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push(Object.assign({ event: eventName }, params || {}));
    }
    if (window.gtag && typeof window.gtag === "function") {
      window.gtag("event", eventName, params || {});
    }
  }

  // Fire a Google Ads conversion to a specific AW-<ID>/<LABEL> destination.
  function conversion(label, details) {
    if (!cfg || !cfg.adsId || !label) return;
    var sendTo = "AW-" + cfg.adsId + "/" + label;
    if (window.gtag && typeof window.gtag === "function") {
      window.gtag("event", "conversion", Object.assign({ send_to: sendTo }, details || {}));
    }
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push(Object.assign({ event: "conversion", send_to: sendTo }, details || {}));
    }
  }

  // Click tracking for any element carrying a data-track attribute.
  document.addEventListener("click", function (e) {
    var el = e.target && e.target.closest ? e.target.closest("[data-track]") : null;
    if (!el) return;
    var track = el.getAttribute("data-track");
    push("engagement", { event_category: "Click", event_label: track });

    if (track === "phone") {
      // CHANGE: dedicated GA4 event for Search Console / Ads import
      push("phone_click", { event_category: "engagement", event_label: "phone" });
      conversion(cfg && cfg.phoneLabel, { event_category: "engagement", event_label: "phone_click" });
    } else if (track === "whatsapp") {
      // CHANGE: dedicated GA4 event
      push("whatsapp_click", { event_category: "engagement", event_label: "whatsapp" });
      conversion(cfg && cfg.whatsappLabel, { event_category: "engagement", event_label: "whatsapp_click" });
    } else if (track === "email") {
      push("email_click", { event_category: "engagement" });
    }
  });

  // Contact form submit conversion (web3forms form on /contact).
  var form = document.getElementById("contactFormWeb3");
  if (form) {
    form.addEventListener("submit", function () {
      push("engagement", { event_category: "Form", event_label: "contact_form_submit" });
      // CHANGE: dedicated GA4 event for Ads import
      push("contact_form_submit", { event_category: "Form", event_label: "contact" });
      conversion(cfg && cfg.formLabel, { event_category: "Form", event_label: "contact" });
    });
  }
})();