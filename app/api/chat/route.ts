import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { conversation, userProfile, userMessage } = await req.json();

  const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY!,
  });

  const historyStr = conversation.messages
    .slice(-10)
    .map((m: any) =>
      `${m.senderId === "user" ? "User" : conversation.match.nickname}: ${m.text}`
    )
    .join("\n");

  const systemInstruction = `
    You are ${conversation.match.nickname}, a ${conversation.match.age} ${conversation.match.gender}.
    Character: Heart-fluttering, flirty, charming. Brief responses in ${userProfile.language}.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: { parts: [{ text: `History:\n${historyStr}\n\nUser: ${userMessage}\nResponse:` }] },
    config: { systemInstruction },
  });

  return NextResponse.json({
    reply: response.text,
  });
}
