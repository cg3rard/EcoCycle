/* ============================================
   MAIN.JS - Application Entry Point
   ============================================ */

/**
 * Main entry point for EcoCycle application
 * Initializes core components and global event listeners
 */

// Initialize modules in order
function initializeApp() {
  console.log("🌱 EcoCycle app initializing...");

  // 1. Initialize Auth Manager first
  if (typeof authManager !== "undefined") {
    console.log("✓ Auth Manager loaded");
  } else {
    console.error("✗ Auth Manager failed to load");
  }

  // 2. Other global initializations can go here
  setupGlobalEventListeners();
  setupConsoleMessages();
}

/**
 * Setup global event listeners
 */
function setupGlobalEventListeners() {
  // Handle form submissions
  document.addEventListener("submit", (e) => {
    if (e.target.classList.contains("newsletter-form")) {
      handleNewsletterSubmit(e);
    }
  });

  // Handle dynamic content loading
  document.addEventListener("click", (e) => {
    // Add dynamic handlers here as needed
  });

  // Listen for window resize (useful for responsive adjustments)
  window.addEventListener(
    "resize",
    debounce(() => {
      // Handle resize logic
    }, 300),
  );
}

/**
 * Newsletter form submission handler
 */
function handleNewsletterSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.querySelector('input[type="email"]').value;

  // Simple validation
  if (!email) {
    return;
  }

  // Here you could send to backend
  alert("Thank you for subscribing! Check your email.");
  form.reset();
}

/**
 * Debounce utility function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Console messages for developers
 */
function setupConsoleMessages() {
  console.log(
    "%c🌱 EcoCycle - Sustainable Shopping Platform",
    "color: #1f5f3a; font-size: 16px; font-weight: bold;",
  );
  console.log(
    "%cBuilt with HTML, CSS, and Vanilla JavaScript",
    "color: #4a4a4a; font-size: 12px;",
  );
  console.log(
    "%cModular Architecture | Separation of Concerns",
    "color: #7a7a7a; font-size: 12px;",
  );
}

/**
 * Utility: Get user authentication status
 */
function getCurrentUser() {
  return authManager?.user || null;
}

/**
 * Utility: Check if user is logged in
 */
function isUserLoggedIn() {
  return authManager?.isLoggedIn() || false;
}

/**
 * Utility: Get user role
 */
function getUserRole() {
  return authManager?.getUserRole() || null;
}

// Initialize app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
