/* ============================================
   COMPONENTS/FOOTER.JS - Footer Component Logic
   ============================================ */

class FooterComponent {
  constructor() {
    this.footer = null;
    this.init();
  }

  async init() {
    await this.loadFooter();
    this.setupEventListeners();
  }

  async loadFooter() {
    const footerRoot = document.getElementById("footer-root");
    if (!footerRoot) return;

    try {
      const response = await fetch("/components/footer.html");
      const html = await response.text();
      footerRoot.innerHTML = html;
      this.footer = footerRoot.querySelector(".site-footer");
    } catch (error) {
      console.error("Failed to load footer:", error);
      footerRoot.innerHTML =
        '<p class="component-error">Failed to load footer.</p>';
    }
  }

  setupEventListeners() {
    // Newsletter form submission
    const newsletterForm = document.querySelector(".newsletter-form");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        this.handleNewsletterSubmit(e);
      });
    }

    // Social links
    const socialLinks = this.footer?.querySelectorAll("[data-social]") || [];
    socialLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        // Social links open in new tab
        e.target.setAttribute("target", "_blank");
        e.target.setAttribute("rel", "noopener noreferrer");
      });
    });
  }

  handleNewsletterSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const emailInput = form.querySelector('input[type="email"]');

    if (!emailInput) return;

    const email = emailInput.value.trim();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.showToast(
        "Invalid email",
        "error",
        "Please enter a valid email address.",
      );
      return;
    }

    this.showToast(
      "Subscribed successfully!",
      "success",
      "Thank you for joining our newsletter.",
    );
    form.reset();
  }

  showToast(title, type = "success", desc = "") {
    let toast = document.getElementById("newsletter-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "newsletter-toast";
      toast.className = "toast-notification";
      toast.innerHTML = `
        <div class="toast-icon"></div>
        <div>
          <h4 class="toast-title" style="margin: 0; color: var(--text-primary); font-size: 1rem;"></h4>
          <p class="toast-desc" style="margin: 0; font-size: 0.9rem; color: var(--text-muted);"></p>
        </div>
      `;
      document.body.appendChild(toast);
    }

    const icon = toast.querySelector(".toast-icon");
    const titleEl = toast.querySelector(".toast-title");
    const descEl = toast.querySelector(".toast-desc");

    toast.className = `toast-notification ${type}`;
    titleEl.textContent = title;
    descEl.textContent = desc;
    descEl.style.display = desc ? "block" : "none";
    icon.textContent = type === "success" ? "✓" : "!";

    toast.classList.add("show");

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new FooterComponent();
});
