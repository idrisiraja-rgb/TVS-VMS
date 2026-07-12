import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not defined");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for safety observation natural language categorization
  app.post("/api/categorize", async (req, res) => {
    try {
      const { description } = req.body;
      if (!description || typeof description !== "string") {
        return res.status(400).json({ error: "Description must be a non-empty string" });
      }

      // Check if API key is configured
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY" || process.env.GEMINI_API_KEY === "") {
        console.warn("GEMINI_API_KEY is not configured or placeholder. Using rule-based fallback analyzer.");
        
        // Let's build a smart heuristic fallback categorization so that the app works beautifully even if the key is missing!
        const descLower = description.toLowerCase();
        let category = "unsafe_condition";
        let title = "Observed Incident";
        let riskLevel = "medium";
        let suggestedAction = "Inspect and notify supervisor.";

        if (descLower.includes("wearing") || descLower.includes("helmet") || descLower.includes("ppe") || descLower.includes("vest") || descLower.includes("pushed") || descLower.includes("running")) {
          category = "unsafe_act";
          title = "PPE Non-Compliance / Unsafe Work Behavior";
          riskLevel = descLower.includes("severe") || descLower.includes("critical") ? "critical" : "high";
          suggestedAction = "Instruct worker on correct safety protocol and provide proper PPE immediately.";
        } else if (descLower.includes("slip") || descLower.includes("tripped") || descLower.includes("almost") || descLower.includes("near miss")) {
          category = "near_miss";
          title = "Near-Miss Event: Slips, Trips & Near-Falls";
          riskLevel = "high";
          suggestedAction = "Mark area with caution signs, clean any spills, and review walkway conditions.";
        } else if (descLower.includes("good") || descLower.includes("best") || descLower.includes("excellent") || descLower.includes("verified") || descLower.includes("clean") || descLower.includes("properly")) {
          category = "good_practice";
          title = "Good Safety Practice Observed";
          riskLevel = "low";
          suggestedAction = "Acknowledge team safety behavior and log as best practice.";
        } else if (descLower.includes("bbs") || descLower.includes("behavior") || descLower.includes("coaching") || descLower.includes("psychology")) {
          category = "bbs";
          title = "Behavior-Based Safety (BBS) Coaching";
          riskLevel = "low";
          suggestedAction = "Conduct feedback coaching session and file safety dialog.";
        } else if (descLower.includes("puddle") || descLower.includes("leak") || descLower.includes("hazard") || descLower.includes("wire") || descLower.includes("exposed") || descLower.includes("blocked")) {
          category = "unsafe_condition";
          title = "Physical Hazard / Unsafe Site Condition";
          riskLevel = descLower.includes("high") || descLower.includes("fire") ? "high" : "medium";
          suggestedAction = "Report to facility maintenance, secure the hazard zone, and schedule repairs.";
        }

        if (description.length > 5) {
          title = description.slice(0, 45) + (description.length > 45 ? "..." : "");
        }

        return res.json({
          title,
          category,
          description,
          riskLevel,
          suggestedAction,
          isFallback: true
        });
      }

      // Call the real Gemini API
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analyze this spoken/written safety observation in an industrial environment and categorize it precisely. 
Description: "${description}"`,
        config: {
          systemInstruction: `You are an expert industrial safety officer (HSE Specialist). Your job is to analyze descriptions of industrial safety observations, categorize them, evaluate the risk level, suggest immediate actions, and generate a concise descriptive title.
You must categorize the observation into exactly one of the following category strings:
- "unsafe_act" (unprotected work, bypassing safeguards, lack of PPE, running, horseplay)
- "unsafe_condition" (oil spills, blocked fire exits, exposed wires, broken machinery, clutter)
- "near_miss" (close call, almost got hit, slipped but didn't fall, tool dropped near a worker)
- "good_practice" (excellent tool organization, correct PPE utilization, safe behavior praise, prompt intervention)
- "bbs" (behavior-based safety, peer-to-peer coaching feedback on safety behaviors, safety observation dialogue)

Categorize riskLevel into exactly one of: "low", "medium", "high", "critical".

Your response MUST be valid JSON matching the schema precisely. Do not enclose it in markdown codeblocks like \`\`\`json. Return pure raw JSON string.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "A concise, professional safety title summarizing the observation (max 50 characters)."
              },
              category: {
                type: Type.STRING,
                description: "Exactly one of: unsafe_act, unsafe_condition, near_miss, good_practice, bbs"
              },
              description: {
                type: Type.STRING,
                description: "The original safety description, polished slightly for grammar and readability."
              },
              riskLevel: {
                type: Type.STRING,
                description: "Exactly one of: low, medium, high, critical"
              },
              suggestedAction: {
                type: Type.STRING,
                description: "A short, professional recommended immediate action or resolution (max 100 characters)."
              }
            },
            required: ["title", "category", "description", "riskLevel", "suggestedAction"]
          }
        }
      });

      const textOutput = response.text;
      if (!textOutput) {
        throw new Error("Empty response from Gemini API");
      }

      const parsed = JSON.parse(textOutput.trim());
      res.json(parsed);

    } catch (error: any) {
      console.error("Gemini categorization error:", error);
      res.status(500).json({ error: error.message || "Failed to process observation" });
    }
  });

  // Serve static assets or mount Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
