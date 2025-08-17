// src/services/auth.service.js
import bcrypt from "bcrypt";
import userRepo from "../repositories/user.repo.js";

const SALT_ROUNDS = 12;

const authService = {
  signup: async ({ username, password, email }) => {
    const existing = await userRepo.findByUsername(username);
    if (existing) throw new Error("Username already taken");

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userRepo.create({ username, password: hash, email });
    return { id: user._id, username: user.username, email: user.email };
  },
};

export default authService;
