import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public")); // serve frontend

// Chat endpoint
app.post("/chat", async (req, res) => {
  const { message, lang } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Please ask a question." });
  }

  try {
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an AI tutor for rural students. Reply in ${lang === "hi" ? "Hindi" : "English"}. Keep explanations simple with examples.`
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.json({ reply: offlineTutor(message, lang) });
    }

  } catch (error) {
    console.error("AI Error:", error);
    res.json({ reply: offlineTutor(message, lang) });
  }
});

// Offline fallback tutor
function offlineTutor(msg, lang) {
  const hintsEn = {
    "algebra": "Balance both sides of the equation step by step.",
    "triangle": "Sum of angles in a triangle = 180°.",
    "fraction": "Convert fractions to same denominator first."
  };

  const hintsHi = {
    "algebra": "समीकरण के दोनों पक्षों को बराबर रखें।",
    "triangle": "त्रिभुज के कोणों का योग 180° होता है।",
    "fraction": "भिन्नों को पहले समान हर में बदलें।"
  };

  let lower = msg.toLowerCase();
  for (let key in hintsEn) {
    if (lower.includes(key)) {
      return lang === "hi" ? hintsHi[key] : hintsEn[key];
    }
  }
  return lang === "hi"
    ? "क्षमा करें, फिलहाल मैं केवल सरल संकेत दे सकता हूँ।"
    : "Sorry, I can only give basic hints offline.";
}

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
