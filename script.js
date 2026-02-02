/**
 * ============================================
 * BABY REGISTRY AUTO-UPDATING SCRIPT
 * ============================================
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Replace "PASTE_YOUR_..." placeholders with actual URLs
 * 2. Update googleSheet.sheetId with your Google Sheet ID
 * 3. Make sure your Google Sheet is public (Anyone with link = Viewer)
 * 4. Upload this file along with index.html to your web host
 * 
 * HOW IT WORKS:
 * - Fetches data from your Google Sheet when page loads
 * - Updates all numbers automatically
 * - Redirects to category-specific PayPal links
 */

const CONFIG = {
  // ==================================================
  // STEP 1: ADD YOUR PAYPAL LINKS
  // ==================================================
  
  // General PayPal link (fallback if no category selected)
  paypalGeneralUrl: "PASTE_YOUR_GENERAL_PAYPAL_LINK_HERE",
  
  // ==================================================
  // STEP 2: ADD YOUR AMAZON LINKS
  // ==================================================
  
  amazonRegistryUrl: "PASTE_YOUR_AMAZON_REGISTRY_LINK_HERE",
  diapersUrl: "PASTE_DIAPERS_LINK_HERE",
  wipesUrl: "PASTE_WIPES_LINK_HERE",
  strollerUrl: "PASTE_STROLLER_LINK_HERE",

  // ==================================================
  // STEP 3: SET YOUR OVERALL GOAL
  // ==================================================
  
  goalAmount: 2000,  // Overall fundraising goal

  // ==================================================
  // STEP 4: ADD YOUR GOOGLE SHEET ID
  // ==================================================
  
  // How to find your Sheet ID:
  // Your Google Sheet URL looks like:
  // https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9/edit
  //                                      ^^^^ THIS PART ^^^^
  // Copy just the ID part (between /d/ and /edit)
  
  googleSheet: {
    sheetId: "PASTE_PUBLIC_SHEET_ID_HERE",  // ← Replace this with your actual Sheet ID
    tabName: "Sheet1"  // ← Change if your tab has a different name
  },

  // ==================================================
  // STEP 5: ADD CATEGORY-SPECIFIC PAYPAL LINKS
  // ==================================================
  
  // Each category can have its own PayPal link
  // Create separate PayPal buttons for each category with the exact item names below
  
  careCategories: {
    housekeeper: { 
      label: "House Keeper Gift Card",  // Must match PayPal item name
      totalCell: "A3",  // Current total from Google Sheet
      goalCell: "B3",   // Goal from Google Sheet
      paypalUrl: "PASTE_HOUSEKEEPER_PAYPAL_LINK_HERE"
    },
    food: { 
      label: "Food Delivery Service", 
      totalCell: "A4", 
      goalCell: "B4",
      paypalUrl: "PASTE_FOOD_PAYPAL_LINK_HERE"
    },
    spa: { 
      label: "Mom Spa Date", 
      totalCell: "A5", 
      goalCell: "B5",
      paypalUrl: "PASTE_SPA_PAYPAL_LINK_HERE"
    },
    massage: { 
      label: "Baby Massage", 
      totalCell: "A6", 
      goalCell: "B6",
      paypalUrl: "PASTE_MASSAGE_PAYPAL_LINK_HERE"
    },
    swim: { 
      label: "Baby Swimming Class", 
      totalCell: "A7", 
      goalCell: "B7",
      paypalUrl: "PASTE_SWIM_PAYPAL_LINK_HERE"
    },
    sitter: { 
      label: "2 Hours Baby Sitter", 
      totalCell: "A8", 
      goalCell: "B8",
      paypalUrl: "PASTE_SITTER_PAYPAL_LINK_HERE"
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

// ============================================
// CATEGORY SELECTION
// ============================================

let selectedCategoryKey = null;

/**
 * Set which category is currently selected
 * @param {string} key - Category key (e.g., "food", "spa")
 */
function setSelectedCategory(key) {
  selectedCategoryKey = key;

  // Update button styles
  document.querySelectorAll(".care-choice").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.key === key);
  });

  // Update selected label
  const labelEl = document.getElementById("selectedLabel");
  if (labelEl) {
    labelEl.textContent = CONFIG.careCategories[key]?.label || "None";
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
  const categoryName = selectedCategoryKey 
    ? CONFIG.careCategories[selectedCategoryKey]?.label 
    : "Baby Enoch";
  
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
  
  // After 2 seconds, redirect to PayPal
  setTimeout(() => {
    let paypalUrl;
    
    // Use category-specific PayPal link if available
    if (selectedCategoryKey && CONFIG.careCategories[selectedCategoryKey]?.paypalUrl) {
      paypalUrl = CONFIG.careCategories[selectedCategoryKey].paypalUrl;
    } else {
      // Fall back to general PayPal link
      paypalUrl = CONFIG.paypalGeneralUrl;
    }
    
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
  // PayPal button click handler
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

  // ==================================================
  // Category selection handlers
  // ==================================================
  
  document.querySelectorAll(".care-choice").forEach(btn => {
    btn.addEventListener("click", () => setSelectedCategory(btn.dataset.key));
  });

  // Set default selection
  setSelectedCategory("food");

  // ==================================================
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
