/**
 * EDIT THESE LINKS + SHEET ID
 * - PayPal: single checkout link
 * - Amazon registry link
 * - Diapers/wipes/stroller links
 * - Google Sheet ID (published)
 */

const CONFIG = {
  paypalCheckoutUrl: "PASTE_YOUR_PAYPAL_CHECKOUT_LINK_HERE",
  amazonRegistryUrl: "PASTE_YOUR_AMAZON_REGISTRY_LINK_HERE",

  diapersUrl: "PASTE_DIAPERS_LINK_HERE",
  wipesUrl: "PASTE_WIPES_LINK_HERE",
  strollerUrl: "PASTE_STROLLER_LINK_HERE",

  // Overall tracker goal
  goalAmount: 2000,

  // Google Sheet source (must be published / public)
  googleSheet: {
    sheetId: "PASTE_PUBLIC_SHEET_ID_HERE",
    tabName: "Sheet1"
  },

  // Category mapping to sheet cells (totals in A3..A8, optional goals in B3..B8)
  careCategories: {
    housekeeper: { label: "House Keeper Gift Card", totalCell: "A3", goalCell: "B3" },
    food:        { label: "Food Delivery Service",  totalCell: "A4", goalCell: "B4" },
    spa:         { label: "Mom Spa Date",           totalCell: "A5", goalCell: "B5" },
    massage:     { label: "Baby Massage",           totalCell: "A6", goalCell: "B6" },
    swim:        { label: "Baby Swimming Class",    totalCell: "A7", goalCell: "B7" },
    sitter:      { label: "2 Hours Baby Sitter",    totalCell: "A8", goalCell: "B8" }
  }
};

// ---------- Helpers ----------
function formatUSD(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// ---------- Overall progress bar ----------
function setProgress(total) {
  const goal = CONFIG.goalAmount;

  const trackerText = document.getElementById("trackerText");
  const trackerGoal = document.getElementById("trackerGoal");
  const trackerNote = document.getElementById("trackerNote");
  const progressFill = document.getElementById("progressFill");
  const progressContainer = document.querySelector(".progress");

  const pct = goal > 0 ? (total / goal) * 100 : 0;
  const pctClamped = clamp(pct, 0, 100);

  if (progressFill) progressFill.style.width = `${pctClamped}%`;
  if (progressContainer) progressContainer.setAttribute("aria-valuenow", String(Math.round(pctClamped)));

  if (trackerText) trackerText.textContent = `${formatUSD(total)} has been given so far. Thank you so much. We love you!`;
  if (trackerGoal) trackerGoal.textContent = goal ? `Goal: ${formatUSD(goal)}` : "";
  if (trackerNote) {
    trackerNote.textContent = total >= goal && goal > 0
      ? "We hit the goal. Seriously… thank you."
      : "Thank you so much. We love you!";
  }
}

// ---------- Google Sheet fetch ----------
async function fetchSheetA1toB8() {
  const { sheetId, tabName } = CONFIG.googleSheet;

  // Reads a rectangle A1:B8. We'll map it into {A1:..., B3:...}
  const range = "A1:B8";
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${encodeURIComponent(tabName)}&range=${encodeURIComponent(range)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Could not fetch sheet data");

  const text = await res.text();
  const jsonText = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
  const data = JSON.parse(jsonText);

  const rows = data?.table?.rows || [];
  const out = {};

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r]?.c || [];
    const aVal = row[0]?.v;
    const bVal = row[1]?.v;

    const rowNum = r + 1; // range starts at row 1
    out[`A${rowNum}`] = Number(aVal ?? 0) || 0;
    out[`B${rowNum}`] = Number(bVal ?? 0) || 0;
  }

  return out;
}

// ---------- Category UI ----------
let selectedCategoryKey = null;

function setSelectedCategory(key) {
  selectedCategoryKey = key;

  document.querySelectorAll(".care-choice").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.key === key);
  });

  const labelEl = document.getElementById("selectedLabel");
  if (labelEl) labelEl.textContent = CONFIG.careCategories[key]?.label || "None";
}

function renderCareCounters(values) {
  for (const [key, meta] of Object.entries(CONFIG.careCategories)) {
    const total = values[meta.totalCell] ?? 0;
    const goal = values[meta.goalCell] ?? 0;

    const amtEl = document.getElementById(`amt-${key}`);
    const miniEl = document.getElementById(`mini-${key}`);

    if (amtEl) {
      amtEl.textContent = goal ? `${formatUSD(total)} / ${formatUSD(goal)}` : formatUSD(total);
    }

    if (miniEl) {
      if (goal > 0) {
        const pct = Math.min((total / goal) * 100, 100);
        miniEl.textContent = pct >= 100 ? "Fully supported" : `${Math.round(pct)}% supported`;
      } else {
        miniEl.textContent = "Thank you for supporting";
      }
    }
  }
}

// ---------- Init ----------
async function init() {
  // Wire core links
  const paypalBtn = document.getElementById("paypalBtn");
  const amazonRegistryBtn = document.getElementById("amazonRegistryBtn");
  const diapersLink = document.getElementById("diapersLink");
  const wipesLink = document.getElementById("wipesLink");
  const strollerLink = document.getElementById("strollerLink");

  if (paypalBtn) paypalBtn.href = CONFIG.paypalCheckoutUrl;
  if (amazonRegistryBtn) amazonRegistryBtn.href = CONFIG.amazonRegistryUrl;

  if (diapersLink) diapersLink.href = CONFIG.diapersUrl;
  if (wipesLink) wipesLink.href = CONFIG.wipesUrl;
  if (strollerLink) strollerLink.href = CONFIG.strollerUrl;

  // Guardrails for placeholders
  if (paypalBtn && CONFIG.paypalCheckoutUrl.includes("PASTE_")) {
    paypalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Paste your PayPal link into script.js (CONFIG.paypalCheckoutUrl).");
    });
  }
  if (amazonRegistryBtn && CONFIG.amazonRegistryUrl.includes("PASTE_")) {
    amazonRegistryBtn.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Paste your Amazon registry link into script.js (CONFIG.amazonRegistryUrl).");
    });
  }

  // Category selection click handlers
  document.querySelectorAll(".care-choice").forEach(btn => {
    btn.addEventListener("click", () => setSelectedCategory(btn.dataset.key));
  });

  // Default selection (feel free to change)
  setSelectedCategory("food");

  // Load totals from sheet
  try {
    const values = await fetchSheetA1toB8();

    // Overall total is A1
    setProgress(values.A1 || 0);

    // Category totals A3..A8 and goals B3..B8
    renderCareCounters(values);
  } catch (err) {
    console.error(err);
    setProgress(0);
  }
}

init();
