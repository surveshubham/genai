import express from "express";
import authRoutes from "./auth.routes.js";
import { RedisStore } from "connect-redis";

const router = express.Router();

router.use("/auth", authRoutes);

export default router;