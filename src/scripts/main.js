import "../css/index.css";

// navMenu Toogler Function
let navMenu = document.getElementById("navLinks");
let toggleBtn = document.getElementById("toggleBtn");
function toggleState() {
  navMenu.classList.toggle("max-lg:translate-x-0");
}
toggleBtn.addEventListener("click", toggleState);
toggleBtn.addEventListener("blur", () =>
  navMenu.classList.remove("max-lg:translate-x-0"),
);

// Certificates Navigation Panel
document.addEventListener("DOMContentLoaded", () => {
  // DOM References
  const tabs = document.querySelectorAll('[role="tab"]');
  const panels = document.querySelectorAll('[role="tabpanel"]');

  /**
   * AUTOMATIC BAR FILL FUNCTION
   * Reads the inner text of `.percent-val` elements in the active panel,
   * parses the integer value (e.g. "85%" -> 85), and sets the progress bar's width style.
   *
   * @param {HTMLElement} panelElement - The panel container containing progress-item elements.
   */
  function updateProgressBarsInPanel(panelElement) {
    // Find all progress items in the panel
    const progressItems = panelElement.querySelectorAll(".progress-item");

    progressItems.forEach((item) => {
      const percentTextEl = item.querySelector(".percent-val");
      const barFillEl = item.querySelector(".progress-bar-fill");

      if (percentTextEl && barFillEl) {
        // Extract text content (e.g. "85%")
        const rawText = percentTextEl.textContent || percentTextEl.innerText;

        // Parse integer from string (extracts numbers even if formatted like "85%", "85 %", etc.)
        const parsedPercentage = parseInt(rawText.replace(/[^0-9]/g, ""), 10);

        // Fallback & clamping between 0% and 100%
        const finalPercentage = isNaN(parsedPercentage)
          ? 0
          : Math.min(100, Math.max(0, parsedPercentage));

        // Set style width and accessibility attributes automatically
        barFillEl.style.width = `${finalPercentage}%`;
        barFillEl.setAttribute("aria-valuenow", finalPercentage);
        barFillEl.setAttribute("aria-valuemin", "0");
        barFillEl.setAttribute("aria-valuemax", "100");
      }
    });
  }

  /**
   * Resets progress bar widths in non-active panels back to 0%
   * so they re-animate smoothly when returning to that tab.
   *
   * @param {HTMLElement} panelElement
   */
  function resetProgressBarsInPanel(panelElement) {
    const barFillEls = panelElement.querySelectorAll(".progress-bar-fill");
    barFillEls.forEach((bar) => {
      bar.style.width = "0%";
    });
  }

  /**
   * TAB SWITCHING LOGIC
   * Manages tab highlight styles, ARIA attributes, panel visibility, and triggers bar animations.
   *
   * @param {HTMLElement} selectedTab
   */
  function switchTab(selectedTab) {
    const targetPanelId = selectedTab.getAttribute("aria-controls");
    const targetPanel = document.getElementById(targetPanelId);

    // Update tab selection styles and ARIA attributes
    tabs.forEach((tab) => {
      const isSelected = tab === selectedTab;
      tab.setAttribute("aria-selected", isSelected ? "true" : "false");
      tab.setAttribute("tabindex", isSelected ? "0" : "-1");

      if (isSelected) {
        tab.className =
          "nav-tab text-sm sm:text-base font-semibold px-14 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 border border-slate-800 bg-white text-slate-900 shadow-sm";
      } else {
        tab.className =
          "nav-tab text-sm sm:text-base font-semibold px-7 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 border border-transparent text-slate-500 hover:text-slate-800";
      }
    });

    // Panel transition logic
    panels.forEach((panel) => {
      if (panel === targetPanel) {
        panel.classList.remove("hidden");

        // Slight delay allows display change to apply before triggering fade & progress width transition
        setTimeout(() => {
          panel.classList.add("active");
          updateProgressBarsInPanel(panel);
        }, 30);
      } else {
        panel.classList.remove("active");
        panel.classList.add("hidden");
        resetProgressBarsInPanel(panel);
      }
    });
  }

  // Attach event listeners for tabs
  tabs.forEach((tab) => {
    // Click handler
    tab.addEventListener("click", () => switchTab(tab));

    // Keyboard Accessibility (Arrow key tab navigation)
    tab.addEventListener("keydown", (e) => {
      const tabList = Array.from(tabs);
      const index = tabList.indexOf(tab);

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const nextTab = tabList[(index + 1) % tabList.length];
        nextTab.focus();
        switchTab(nextTab);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prevTab = tabList[(index - 1 + tabList.length) % tabList.length];
        prevTab.focus();
        switchTab(prevTab);
      }
    });
  });

  // INITIALIZATION: Populate progress bars for the initially active tab on page load
  const initialActivePanel = document.querySelector(".tab-panel.active");
  if (initialActivePanel) {
    // Trigger animation after initial render
    setTimeout(() => {
      updateProgressBarsInPanel(initialActivePanel);
    }, 100);
  }
});
