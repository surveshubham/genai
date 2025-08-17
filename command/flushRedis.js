import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redisClient = new Redis(process.env.REDIS_URL);

async function flushDB() {
  try {
    await redisClient.flushdb();
    console.log("Redis DB flushed successfully.");
  } catch (error) {
    console.error("Error flushing Redis DB:", error);
  } finally {
    redisClient.disconnect();
  }
}

flushDB();
