import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { promises as fs } from "fs";
import path from "path";
import open from "open";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = process.cwd();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Store state for previous responses ---
const userContextMap = new Map(); // { userId: { lastResponseId } }

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

  // Save last response ID for the user
  userContextMap.set(userId, { lastResponseId: response.id });

  const htmlCode = extractHtmlFromText(response.output_text);
  const filePath = await saveFile(htmlCode, filename);
  await open(filePath);
  return filePath;
}

// --- Routes ---
app.get("/", (req, res) => {
  res.send("✅ API is running");
});

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

    // Store last response ID
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

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
