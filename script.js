/**
 * ============================================
 * BABY REGISTRY AUTO-UPDATING SCRIPT
 * ============================================
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Replace "PASTE_YOUR_..." placeholders with actual URLs
 * 2. Google Sheet is already configured
 * 3. Make sure your Google Sheet is public (Anyone with link = Viewer)
 * 4. Upload this file along with index.html to your web host
 * 
 * HOW IT WORKS:
 * - Fetches data from your Google Sheet when page loads
 * - Updates all numbers automatically
 * - Redirects to a single PayPal donation link
 */

const CONFIG = {
  // ==================================================
  // STEP 1: PAYPAL LINKS - ✅ CONFIGURED
  // ==================================================
  
  // General PayPal link (fallback if no category selected)
  paypalGeneralUrl: "https://www.paypal.com/ncp/payment/PY9UDWTPUS2KG",
  
  // ==================================================
  // STEP 2: ADD YOUR AMAZON LINKS - ⚠️ NEEDS CONFIGURATION
  // ==================================================
  
  amazonRegistryUrl: "https://www.amazon.com/baby-reg/shaquille-james-edwards-catalina-james-edwards-may-2026-tacoma/1SGC46V3JDRGK?ref_=cm_sw_r_cp_ud_dp_3R8KDJQVE85GCX0YNDWZ",
  diapersUrl: "https://www.amazon.com/registries/gl/guest-view/2U9WHF6U3BOG4?ref_=cm_sw_r_cp_ud_ggr-subnav-share_EGHVSTRQT9896YBMS1ZK",
  wipesUrl: "https://www.amazon.com/registries/gl/guest-view/JD8EZ01T25A?ref_=cm_sw_r_cp_ud_ggr-subnav-share_9G3AQ4A1TXKHQ3Z2J3FY",
  strollerUrl: "https://www.amazon.com/registries/gl/guest-view/3QSXG7V6S27HS?ref_=cm_sw_r_cp_ud_ggr-subnav-share_235K2145TSS9TF85QY9D_1",

  // ==================================================
  // STEP 3: OVERALL GOAL - ✅ CONFIGURED
  // ==================================================
  
  goalAmount: 2000,  // Overall fundraising goal

  // ==================================================
  // STEP 4: GOOGLE SHEET - ✅ CONFIGURED
  // ==================================================
  
  googleSheet: {
    sheetId: "163lYWDpbwmaPJnVRXPUXkKLhbPIQj96uvkox4mWTOa0",
    tabName: "Reg"
  },

  // ==================================================
  // STEP 5: CARE CATEGORY TRACKING - ✅ CONFIGURED
  // ==================================================

  careCategories: {
    housekeeper: { 
      label: "House Keeper Gift Card",
      totalCell: "A3",
      goalCell: "B3"
    },
    food: { 
      label: "Food Delivery Service", 
      totalCell: "A4", 
      goalCell: "B4"
    },
    spa: { 
      label: "Mom Spa Date", 
      totalCell: "A5", 
      goalCell: "B5"
    },
    massage: { 
      label: "Baby Massage", 
      totalCell: "A6", 
      goalCell: "B6"
    },
    swim: { 
      label: "Baby Swimming Class", 
      totalCell: "A7", 
      goalCell: "B7"
    },
    sitter: { 
      label: "2 Hours Baby Sitter", 
      totalCell: "A8", 
      goalCell: "B8"
    }
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format a number as USD currency
 */
function formatUSD(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Clamp a number between min and max
 */
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// ============================================
// OVERALL PROGRESS BAR
// ============================================

/**
 * Update the overall progress tracker
 * @param {number} total - Current total from Google Sheet cell A1
 */
function setProgress(total) {
  const goal = CONFIG.goalAmount;

  const trackerText = document.getElementById("trackerText");
  const trackerGoal = document.getElementById("trackerGoal");
  const trackerNote = document.getElementById("trackerNote");
  const progressFill = document.getElementById("progressFill");
  const progressContainer = document.querySelector(".progress");

  const pct = goal > 0 ? (total / goal) * 100 : 0;
  const pctClamped = clamp(pct, 0, 100);

  // Update progress bar
  if (progressFill) {
    progressFill.style.width = `${pctClamped}%`;
  }
  
  if (progressContainer) {
    progressContainer.setAttribute("aria-valuenow", String(Math.round(pctClamped)));
  }

  // Update text
  if (trackerText) {
    trackerText.textContent = `${formatUSD(total)} has been given so far. Thank you so much. We love you!`;
  }
  
  if (trackerGoal) {
    trackerGoal.textContent = goal ? `Goal: ${formatUSD(goal)}` : "";
  }
  
  if (trackerNote) {
    trackerNote.textContent = total >= goal && goal > 0
      ? "We hit the goal. Seriously… thank you."
      : "Thank you so much. We love you!";
  }
}

// ============================================
// GOOGLE SHEET DATA FETCHING
// ============================================

/**
 * Fetch data from Google Sheet (cells A1:B8)
 * @returns {Promise<Object>} Object with cell values like {A1: 100, B1: 2000, ...}
 */
async function fetchSheetA1toB8() {
  const { sheetId, tabName } = CONFIG.googleSheet;

  // Build the Google Sheets API URL
  const range = "A1:B8";
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${encodeURIComponent(tabName)}&range=${encodeURIComponent(range)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Could not fetch sheet data");

    const text = await res.text();
    
    // Extract JSON from the response (Google Sheets returns JSONP)
    const jsonText = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const data = JSON.parse(jsonText);

    const rows = data?.table?.rows || [];
    const out = {};

    // Map the data to cell references (A1, B1, A2, B2, etc.)
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r]?.c || [];
      const aVal = row[0]?.v;
      const bVal = row[1]?.v;

      const rowNum = r + 1;
      out[`A${rowNum}`] = Number(aVal ?? 0) || 0;
      out[`B${rowNum}`] = Number(bVal ?? 0) || 0;
    }

    return out;
  } catch (error) {
    console.error("Error fetching Google Sheet:", error);
    throw error;
  }
}

/**
 * Update the category counter displays
 * @param {Object} values - Sheet values from fetchSheetA1toB8()
 */
function renderCareCounters(values) {
  for (const [key, meta] of Object.entries(CONFIG.careCategories)) {
    const total = values[meta.totalCell] ?? 0;
    const goal = values[meta.goalCell] ?? 0;

    // Update amount display
    const amtEl = document.getElementById(`amt-${key}`);
    if (amtEl) {
      amtEl.textContent = goal ? `${formatUSD(total)} / ${formatUSD(goal)}` : formatUSD(total);
    }

    // Update mini progress text
    const miniEl = document.getElementById(`mini-${key}`);
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

// ============================================
// THANK YOU MODAL
// ============================================

/**
 * Show thank you modal and redirect to PayPal
 */
function showThankYouModal() {
  const categoryName = "Baby Enoch";
  
  // Update modal text
  const modalCategory = document.getElementById('modalCategory');
  if (modalCategory) {
    modalCategory.textContent = categoryName;
  }
  
  // Show modal
  const modal = document.getElementById('thankYouModal');
  if (modal) {
    modal.classList.add('show');
  }
  
  // After 2 seconds, redirect to the shared PayPal button
  setTimeout(() => {
    const paypalUrl = CONFIG.paypalGeneralUrl;
    
    // Only redirect if a valid PayPal URL is set
    if (paypalUrl && !paypalUrl.includes('PASTE_')) {
      window.location.href = paypalUrl;
    } else {
      alert('Please add your PayPal links in script.js (CONFIG section at the top)');
    }
    
    closeModal();
  }, 2000);
}

/**
 * Close the thank you modal
 */
function closeModal() {
  const modal = document.getElementById('thankYouModal');
  if (modal) {
    modal.classList.remove('show');
  }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the page - runs when page loads
 */
async function init() {
  console.log("Initializing baby registry page...");
  
  // ==================================================
  // Wire up button links
  // ==================================================
  
  const paypalBtn = document.getElementById("paypalBtn");
  const amazonRegistryBtn = document.getElementById("amazonRegistryBtn");
  const diapersLink = document.getElementById("diapersLink");
  const wipesLink = document.getElementById("wipesLink");
  const strollerLink = document.getElementById("strollerLink");

  if (amazonRegistryBtn) amazonRegistryBtn.href = CONFIG.amazonRegistryUrl;
  if (diapersLink) diapersLink.href = CONFIG.diapersUrl;
  if (wipesLink) wipesLink.href = CONFIG.wipesUrl;
  if (strollerLink) strollerLink.href = CONFIG.strollerUrl;

  // ==================================================
  // PayPal button click handlers
  // ==================================================
  
  if (paypalBtn) {
    paypalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showThankYouModal();
    });
  }

  // Show alert if Amazon link not configured
  if (amazonRegistryBtn && CONFIG.amazonRegistryUrl.includes("PASTE_")) {
    amazonRegistryBtn.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Please add your Amazon registry link in script.js (CONFIG.amazonRegistryUrl)");
    });
  }

  // Modal overlay click to close
  // ==================================================
  
  const modal = document.getElementById('thankYouModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'thankYouModal') {
        closeModal();
      }
    });
  }

  // ==================================================
  // Load data from Google Sheet
  // ==================================================
  
  try {
    console.log("Fetching data from Google Sheet...");
    const values = await fetchSheetA1toB8();
    console.log("Sheet data loaded:", values);

    // Update overall progress (cell A1)
    setProgress(values.A1 || 0);

    // Update category totals (cells A3-A8 and B3-B8)
    renderCareCounters(values);
    
    console.log("Page initialized successfully!");
  } catch (err) {
    console.error("Error loading sheet data:", err);
    
    // Show error message to user
    const trackerText = document.getElementById("trackerText");
    if (trackerText) {
      trackerText.textContent = "Unable to load donation totals. Please check your Google Sheet configuration.";
    }
    
    // Set progress to 0
    setProgress(0);
  }
}

// Run initialization when page loads
init();
