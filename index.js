// index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import "./config/db.js";            // Mongo connection
import { redisStore } from "./config/redis.js"; // Redis + connect-redis
import "./config/passport.js";      // Passport Local strategy + serialize/deserialize
import v1Routes from "./routes/api/v1/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Sessions (stored in Redis)
app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,           // set to true behind HTTPS/proxy
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,  // 1 hour
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Health
app.get("/", (_req, res) => res.send("✅ API is running"));

// API v1
app.use("/api/v1", v1Routes);

// --- Utility Functions ---
function extractHtmlFromText(text) {
  const match = text.match(/```html([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

async function saveFile(content, filename, folder = "outputs") {
  const filePath = path.join(__dirname, folder, filename);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf-8");
  return filePath;
}

async function generateAndOpenHtml(prompt, userId, filename = "output.html") {
  const fullPrompt = `
    Create a complete HTML5 page with embedded CSS inside a <style> tag.
    Make it modern, responsive, and visually appealing.
    Avoid inline styles. Keep all styles in the <style> tag in the head.
    Add beautiful fonts, good spacing, and smooth color schemes.
    Also add some subtle animations and freely available images online.
    Request: ${prompt}
  `;

  const previousId = userContextMap.get(userId)?.lastResponseId;

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: fullPrompt,
    ...(previousId ? { previous_response_id: previousId } : {}),
  });

  userContextMap.set(userId, { lastResponseId: response.id });

  const htmlCode = extractHtmlFromText(response.output_text);
  const filePath = await saveFile(htmlCode, filename);
  await open(filePath);
  return filePath;
}

// Chat endpoint (with state)
app.post("/chat", async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message || !userId) {
      return res.status(400).json({ error: "Message and userId are required" });
    }

    const previousId = userContextMap.get(userId)?.lastResponseId;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [{ role: "user", content: message }],
      ...(previousId ? { previous_response_id: previousId } : {}),
    });

    userContextMap.set(userId, { lastResponseId: response.id });

    res.json({ reply: response.output_text });
  } catch (error) {
    console.error("Error in /chat:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Generate Web Page (with conversation context)
app.post("/generate-web", async (req, res) => {
  try {
    const { prompt, userId } = req.body;
    if (!prompt || !userId) {
      return res.status(400).json({ error: "Prompt and userId are required" });
    }

    const filePath = await generateAndOpenHtml(prompt, userId);
    res.json({ success: true, file: filePath });
  } catch (error) {
    console.error("Error in /generate-web:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});





