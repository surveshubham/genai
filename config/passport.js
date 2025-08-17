// src/config/passport.js
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import userRepo from "../repositories/user.repo.js";

// Local username/password
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await userRepo.findByUsername(username);
      if (!user) return done(null, false, { message: "User not found" });

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return done(null, false, { message: "Invalid credentials" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Session serialization
passport.serializeUser((user, done) => {
  done(null, user.id); // store user id in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userRepo.findById(id);
    if (!user) return done(null, false);
    done(null, user); // becomes req.user
  } catch (err) {
    done(err);
  }
});
