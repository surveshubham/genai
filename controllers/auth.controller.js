// src/controllers/auth.controller.js
import passport from "passport";
import authService from "../services/auth.service.js";

// POST /signup
export const signup = async (req, res) => {
  try {
    const { username, password, email } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "username & password required" });
    }

    const safeUser = await authService.signup({ username, password, email });

    // Optionally auto-login after signup:
    req.login({ id: safeUser.id, username: safeUser.username }, (err) => {
      if (err) return res.status(201).json({ success: true, user: safeUser });
      return res.status(201).json({ success: true, user: safeUser });
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// POST /signin
export const signin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ success: false, message: "Auth error" });
    if (!user) return res.status(401).json({ success: false, message: info?.message || "Invalid credentials" });

    req.login(user, (loginErr) => {
      if (loginErr) return res.status(500).json({ success: false, message: "Login failed" });
      const { _id, username, email, roles } = user;
      return res.json({ success: true, user: { id: _id, username, email, roles } });
    });
  })(req, res, next);
};

// POST /signout
export const signout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ success: false, message: "Logout failed" });
    // Destroy session cookie client-side by maxAge; server side session is removed by store
    req.session?.destroy(() => {});
    return res.json({ success: true, message: "Signed out" });
  });
};

// GET /me
export const me = (req, res) => {
  if (!req.isAuthenticated?.() || !req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  const { _id, username, email, roles } = req.user;
  return res.json({ success: true, user: { id: _id, username, email, roles } });
};
