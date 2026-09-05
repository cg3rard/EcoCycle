const path = require("path");
const fs = require("fs");
const express = require("express");
const session = require("express-session");

const app = express();
const PORT = 8069;
const ACCOUNTS_FILE = path.join(__dirname, "account.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "ecocycle-secret",
    resave: false,
    saveUninitialized: true,
  }),
);

const view = (fileName) => path.join(__dirname, "views", fileName);

function readAccounts() {
  try {
    const data = fs.readFileSync(ACCOUNTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeAccounts(accounts) {
  fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
}

function protectedRoute(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

app.get("/", (req, res) => {
  res.sendFile(view("index.html"));
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect(
      req.session.user.role === "seller"
        ? "/seller-dashboard"
        : "/buyer-dashboard",
    );
  }
  res.sendFile(view("login.html"));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const accounts = readAccounts();
  const user = accounts.find(
    (u) => u.username === username && u.password === password,
  );

  if (user) {
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    return res.redirect(
      user.role === "seller" ? "/seller-dashboard" : "/buyer-dashboard",
    );
  }

  return res.redirect("/login?error=Invalid%20credentials.");
});

app.get("/register", (req, res) => {
  // Static registration page - demo mode (account creation disabled)
  res.sendFile(view("register.html"));
});

// POST /register is disabled - account creation is static only
app.post("/register", (req, res) => {
  return res.redirect(
    "/register?error=Account%20creation%20is%20disabled.%20Demo%20mode%20only.",
  );
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/buyer-dashboard", protectedRoute, (req, res) => {
  res.sendFile(view("buyer-dashboard.html"));
});

app.get("/seller-dashboard", protectedRoute, (req, res) => {
  res.sendFile(view("seller-dashboard.html"));
});

app.get("/product-detail", (req, res) => {
  res.sendFile(view("product-detail.html"));
});

app.get("/products", (req, res) => {
  res.sendFile(view("products.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(view("about.html"));
});

app.get("/order-detail", protectedRoute, (req, res) => {
  res.sendFile(view("order-detail.html"));
});

app.get("/api/current-user", (req, res) => {
  if (req.session.user) {
    return res.json(req.session.user);
  }
  return res.status(401).json({ error: "Not logged in" });
});

app.listen(PORT, () => {
  console.log(`EcoCycle server is running at http://localhost:${PORT}`);
});
