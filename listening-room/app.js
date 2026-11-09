/* Sacred Cycle Live — client-side only. No backend, no tracking, no payments. */
(function () {
  "use strict";

  /* ---------- Earnings calculator ----------
     Honest per-sale commissions (JVZoo, 50%):
       AI Command Center ..... $98.50
       Golden Years Companion  $53.50
       RN Command Pro ......... $48.50
       ParentWise ............. $48.50
       Sacred Cycles Renewal .. $48.50
       Complete Habit System .. $35.00
     Hand-verified: 10 AICC sales = 10 x 98.50 = $985.00.
     Every figure on this page is an illustration, not a guarantee —
     actual earnings may be $0. */
  var form = document.getElementById("earnings-form");
  var productSelect = document.getElementById("calc-product");
  var salesInput = document.getElementById("calc-sales");
  var result = document.getElementById("calc-result");

  function money(n) {
    return "$" + n.toFixed(2);
  }

  function productName() {
    var text = productSelect.options[productSelect.selectedIndex].text;
    return text.split(" — ")[0];
  }

  function calculate() {
    var rate = parseFloat(productSelect.value);
    var sales = parseInt(salesInput.value, 10);
    if (isNaN(sales) || sales < 0) { sales = 0; }
    var total = rate * sales;
    result.textContent = sales + " " + productName() + " sale" + (sales === 1 ? "" : "s") +
      " = " + money(total) + " in commission. " +
      "Illustration, not a guarantee — actual earnings may be $0.";
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      calculate();
    });
    productSelect.addEventListener("change", calculate);
    salesInput.addEventListener("input", calculate);
  }

  /* ---------- New-episode email alerts ----------
     HELD: no public Kit form URL was found in the workspace, so this form
     does not submit anywhere yet. It tells the visitor honestly instead of
     pretending to sign them up. Owner step: create a Kit form, paste its
     URL/action into the form, and remove this notice. */
  var alertsForm = document.getElementById("episode-alerts-form");
  var alertsStatus = document.getElementById("alerts-status");

  if (alertsForm) {
    alertsForm.addEventListener("submit", function (event) {
      event.preventDefault();
      alertsStatus.textContent =
        "Thank you — email signup is coming soon and is not connected yet, " +
        "so your address was not collected. Please follow the show on Spotify " +
        "above for now, and check back soon.";
    });
  }

  /* ---------- Luna audio segments ----------
     The five ~20-second Luna messages live in audio/ (one per product),
     wired as <audio> players in index.html. The map below is the manifest
     (kept for the coordinator / future widget work); no audio is faked. */
  var expectedAudio = {
    "aicc": "audio/luna-aicc.mp3",
    "golden-years": "audio/luna-golden-years.mp3",
    "rn-command-pro": "audio/luna-rn-command-pro.mp3",
    "parentwise": "audio/luna-parentwise.mp3",
    "sacred-cycles": "audio/luna-sacred-cycles.mp3"
  };
  // Exposed for the coordinator / future widget work; no audio is faked.
  window.SACRED_CYCLE_LIVE_AUDIO = expectedAudio;
})();
