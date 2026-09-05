/* ============================================
   COMPONENTS/NAVBAR.JS - Navbar Component Logic
   ============================================ */

class NavbarComponent {
  constructor() {
    this.navbar = null;
    this.mobileMenuBtn = null;
    this.mainNav = null;
    this.init();
  }

  async init() {
    await this.loadNavbar();
    this.setupEventListeners();
    this.setupAuthListener();
  }

  async loadNavbar() {
    const navbarRoot = document.getElementById("navbar-root");
    if (!navbarRoot) return;

    try {
      const response = await fetch("/components/navbar.html");
      const html = await response.text();
      navbarRoot.innerHTML = html;

      this.navbar = navbarRoot.querySelector(".site-header");
      this.mobileMenuBtn = document.getElementById("mobileMenuBtn");
      this.mainNav = document.getElementById("mainNav");
    } catch (error) {
      console.error("Failed to load navbar:", error);
    }
  }

  setupEventListeners() {
    // Mobile menu toggle
    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.addEventListener("click", () => {
        this.toggleMobileMenu();
      });
    }

    // Close mobile menu on navigation
    if (this.mainNav) {
      this.mainNav.addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
          this.closeMobileMenu();
        }
      });
    }
  }

  setupAuthListener() {
    // Listen for auth status changes
    document.addEventListener("authStatusChanged", (e) => {
      this.updateNavigation(e.detail);
    });

    // Initial update
    if (typeof authManager !== "undefined") {
      this.updateNavigation({
        isLoggedIn: authManager.isLoggedIn(),
        role: authManager.getUserRole(),
      });
    }
  }

  updateNavigation(authData) {
    const dashboardLink = document.getElementById("dashboardLink");
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const signoutBtn = document.getElementById("signoutBtn");

    if (authData.isLoggedIn) {
      // User is logged in - show Dashboard and Sign Out
      if (dashboardLink) {
        dashboardLink.style.display = "inline-flex";
        dashboardLink.href =
          authData.role === "seller" ? "/seller-dashboard" : "/buyer-dashboard";
      }
      if (loginBtn) loginBtn.style.display = "none";
      if (signupBtn) signupBtn.style.display = "none";
      if (signoutBtn) {
        signoutBtn.style.display = "inline-flex";
        // Remove any onclick and add event listener
        signoutBtn.removeAttribute("onclick");
        signoutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          if (typeof authManager !== "undefined") {
            authManager.logout();
          }
        });
      }
    } else {
      // User not logged in - show Login and Sign Up
      if (dashboardLink) dashboardLink.style.display = "none";
      if (signoutBtn) signoutBtn.style.display = "none";
      if (loginBtn) loginBtn.style.display = "inline-flex";
      if (signupBtn) signupBtn.style.display = "inline-flex";
    }

    // Update active link
    this.updateActiveLink();
  }

  updateActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = this.mainNav?.querySelectorAll("[data-nav]") || [];

    navLinks.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");

      if (
        href &&
        (href === currentPath ||
          (href === "/products" && currentPath.startsWith("/product")))
      ) {
        link.classList.add("active");
      }
    });
  }

  toggleMobileMenu() {
    if (!this.mainNav) return;
    const isOpen = this.mainNav.classList.toggle("open");
    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
    }
  }

  closeMobileMenu() {
    if (this.mainNav) {
      this.mainNav.classList.remove("open");
      if (this.mobileMenuBtn) {
        this.mobileMenuBtn.setAttribute("aria-expanded", "false");
      }
    }
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new NavbarComponent();
});
