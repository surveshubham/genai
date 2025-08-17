// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true }, // bcrypt hash
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    roles: { type: [String], default: ["user"] }, // for future RBAC
    // add providers[] later for OAuth identities (provider, providerId, etc.)
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
