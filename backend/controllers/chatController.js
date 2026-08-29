import { GoogleGenAI } from "@google/genai";

import Profile from "../models/profile.model.js";
import Project from "../models/project.model.js";
import Skill from "../models/skills.model.js";
import Education from "../models/education.model.js";
import Certification from "../models/certification.model.js";
import Achievement from "../models/achievement.model.js";

import buildSystemPrompt from "../utils/buildSystemPrompt.js";

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  return new GoogleGenAI({
    apiKey,
    // vertexai: false,
  });
};

export const chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    console.log("[chat] Incoming request:", {
      messageLength: message?.trim()?.length || 0,
      historyLength: history?.length || 0,
      client: req.headers.origin || "unknown",
    });

    // ── 1. Validate message ───────────────────
    if (!message?.trim()) {
      console.log("[chat] Blank message received");
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // ── 2. Fetch portfolio data ────────────────
    const [
      profile,
      projects,
      skillsData,
      education,
      certifications,
      achievements,
    ] = await Promise.all([
      Profile.findOne(),
      Project.find({ isPublished: true }),
      Skill.find().sort({ skillOrder: 1 }),
      Education.find().sort({ order: 1 }),
      Certification.find(),
      Achievement.find(),
    ]);

    // ── 3. Build system prompt ─────────────────
    const systemPrompt = buildSystemPrompt({
      profile,
      projects,
      skills: skillsData,
      education,
      certifications,
      achievements,
    });

    // ── 4. Convert history ─────────────────────
    const chatHistory = history
      .filter(
        (msg) =>
          msg?.content?.trim() &&
          (msg.role === "user" || msg.role === "assistant"),
      )
      .map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [
          {
            text: msg.content,
          },
        ],
      }));

    // ── 5. Create Gemini client ─────────────────
    const ai = getAiClient();
    console.log("[chat] Gemini client created successfully");

    // ── 6. Add current message to history ──────
    const contents = [
      ...chatHistory,
      {
        role: "user",
        parts: [
          {
            text: message.trim(),
          },
        ],
      },
    ];

    // ── 7. SSE headers ─────────────────────────
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL);

    res.flushHeaders();

    // ── 8. Stream Gemini response ──────────────
    console.log("[chat] Calling Gemini generateContentStream with:", {
      model: "gemini-3.5-flash-lite",
      historyLength: chatHistory.length,
      messagePreview: message.trim().slice(0, 120),
    });

    const stream = await ai.models.generateContentStream({
      model: "gemini-3.5-flash-lite",

      contents,

      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 500,
      },
    });

    // ── 9. Send chunks through SSE ─────────────
    for await (const chunk of stream) {
      const text = chunk.text;

      if (text) {
        console.log("[chat] Stream chunk received:", text.slice(0, 120));
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    // ── 10. Signal completion ──────────────────
    console.log("[chat] Streaming complete, sending done flag");
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);

    res.end();
  } catch (error) {
    console.error("[chat] Chat error:", error);

    if (res.headersSent) {
      res.write(
        `data: ${JSON.stringify({
          error: "Something went wrong",
        })}\n\n`,
      );

      res.end();
      return;
    }

    next(error);
  }
};
