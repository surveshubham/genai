// src/config/redis.js
import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis error:", err));

await redisClient.connect();

export const redisStore = new RedisStore({
  client: redisClient,
  prefix: "sess:",
});
