import { NextRequest, NextResponse } from "next/server";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { z } from "zod";

const LogAnalysisSchema = z.object({
  logData: z.string().min(10, "Log data terlalu pendek"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = LogAnalysisSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { logData } = validation.data;

    // System prompt untuk AI
    const systemPrompt = `You are Sentinel AI, an elite Tier-3 SOC (Security Operations Center) Analyst.
Your job is to analyze security logs and provide actionable threat intelligence.

When analyzing logs, you should:
1. Identify the type of log (web server, firewall, authentication, etc.)
2. Detect suspicious patterns (brute force, SQL injection, XSS, port scanning, etc.)
3. Extract Indicators of Compromise (IoCs) like IP addresses, user agents, paths
4. Assess threat level (LOW/MEDIUM/HIGH/CRITICAL)
5. Provide specific remediation recommendations

Format your response in Markdown with clear sections:
## 🎯 Executive Summary
## 🔍 Detected Threats
## 📊 Indicators of Compromise (IoCs)
## ⚠️ Threat Assessment
## 🛡️ Recommended Actions

Be concise but thorough. Use emojis for visual clarity.`;

    // Call Groq AI
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      prompt: `Analyze the following security log data and provide a comprehensive threat intelligence report:\n\n\`\`\`\n${logData}\n\`\`\``,
    });

    return NextResponse.json({
      analysis: text,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Gagal menganalisis log. Coba lagi." },
      { status: 500 }
    );
  }
}