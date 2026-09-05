/* ============================================
   AUTH.JS - Authentication Logic (Modular)
   ============================================ */

class AuthManager {
  constructor() {
    this.user = null;
    this.init();
  }

  async init() {
    await this.checkAuth();
  }

  async checkAuth() {
    try {
      const response = await fetch("/api/current-user", {
        credentials: "include",
      });
      if (response.ok) {
        this.user = await response.json();
        this.onAuthStatusChanged();
      } else {
        this.user = null;
        this.onAuthStatusChanged();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      this.user = null;
    }
  }

  isLoggedIn() {
    return this.user !== null;
  }

  getUserRole() {
    return this.user?.role || null;
  }

  isSeller() {
    return this.user?.role === "seller";
  }

  isBuyer() {
    return this.user?.role === "buyer";
  }

  onAuthStatusChanged() {
    // Dispatch custom event untuk components yang perlu tahu tentang perubahan auth
    const event = new CustomEvent("authStatusChanged", {
      detail: {
        isLoggedIn: this.isLoggedIn(),
        user: this.user,
        role: this.getUserRole(),
      },
    });
    document.dispatchEvent(event);
  }

  async logout() {
    try {
      await fetch("/logout");
      this.user = null;
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
}

// Singleton instance
const authManager = new AuthManager();
