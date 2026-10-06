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
  const tabs = document.querySelectorAll('[role="tab"]');
  const panels = document.querySelectorAll('[role="tabpanel"]');

  /**
   * Animates progress bars inside a given tab panel
   * @param {HTMLElement} panel
   */
  function animateProgressBars(panel) {
    const progressBars = panel.querySelectorAll(".progress-bar-fill");

    // Reset widths first to allow smooth animation re-triggering
    progressBars.forEach((bar) => {
      bar.style.width = "0%";
    });

    // Trigger width transition in next frame
    requestAnimationFrame(() => {
      setTimeout(() => {
        progressBars.forEach((bar) => {
          const targetWidth = bar.getAttribute("data-percentage") || "0%";
          bar.style.width = targetWidth;
        });
      }, 50);
    });
  }

  /**
   * Handles switching active tabs and showing corresponding content
   * @param {HTMLElement} selectedTab
   */
  function switchTab(selectedTab) {
    const targetPanelId = selectedTab.getAttribute("aria-controls");
    const targetPanel = document.getElementById(targetPanelId);

    // Update tab buttons state
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

    // Hide all panels with fade effect
    panels.forEach((panel) => {
      if (panel === targetPanel) {
        panel.classList.remove("hidden");
        setTimeout(() => {
          panel.classList.add("active");
          animateProgressBars(panel);
        }, 20);
      } else {
        panel.classList.remove("active");
        panel.classList.add("hidden");
      }
    });
  }

  tabs.forEach((tab) => {
    // Click interaction
    tab.addEventListener("click", () => switchTab(tab));

    // Keyboard Accessibility (Left/Right Arrow Keys)
    tab.addEventListener("keydown", (e) => {
      const tabList = Array.from(tabs);
      const currentIndex = tabList.indexOf(tab);

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const nextTab = tabList[(currentIndex + 1) % tabList.length];
        nextTab.focus();
        switchTab(nextTab);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prevTab =
          tabList[(currentIndex - 1 + tabList.length) % tabList.length];
        prevTab.focus();
        switchTab(prevTab);
      }
    });
  });

  // Initial animation run for active panel on page load
  const initialActivePanel = document.querySelector(".tab-panel.active");
  if (initialActivePanel) {
    animateProgressBars(initialActivePanel);
  }
});
