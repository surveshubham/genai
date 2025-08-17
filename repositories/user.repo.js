// src/repositories/user.repo.js
import User from "../model/User.js";

const userRepo = {
  findById: (id) => User.findById(id).lean(false),
  findByUsername: (username) => User.findOne({ username }).lean(false),
  create: (doc) => User.create(doc),
};

export default userRepo;
