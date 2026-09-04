import { NextResponse } from "next/server";
import { gemini, GEMINI_MODEL } from "@/lib/ai/gemini";

type GenerateQuestionsRequest = {
  role: string;
  domain: string;
  years: number;
  months: number;
  count: number;
};

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as GenerateQuestionsRequest;

    const {
      role,
      domain,
      years,
      months,
      count,
    } = body;

    const totalExperience =
      years > 0 || months > 0
        ? `${years} year${years !== 1 ? "s" : ""} ${months} month${months !== 1 ? "s" : ""}`
        : "fresher / no prior experience";

    const prompt = `
You are an expert technical assessment designer for CampusLink, an AI-powered skill assessment platform.

Generate exactly ${count} multiple-choice questions for the following assessment profile:

- Career Role: ${role}
- Technology Domain: ${domain}
- Experience Level: ${totalExperience}

RULES:
1. Questions must match the selected career role and domain.
2. Difficulty should match the experience level.
3. For freshers, focus on conceptual and foundational questions.
4. For experienced candidates, include practical and scenario-based questions.
5. Cover the core topics relevant to the role and domain.
6. Each question must have exactly 4 options.
7. Exactly one option must be correct.
8. Return ONLY valid JSON. No explanations, no markdown, no extra text.

OUTPUT FORMAT (strict JSON array):
[
  {
    "id": "q1",
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "skill": "Skill Name"
  }
]

Generate the JSON array now:
`;

    const response = await gemini.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    const text = response.text || "[]";

    let questions: any[] = [];

    try {
      questions = JSON.parse(text);
    } catch {
      const match = text.match(/\[[\s\S]*\]/);

      if (match) {
        questions = JSON.parse(match[0]);
      }
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "No questions generated." },
        { status: 500 }
      );
    }

    const normalized = questions.slice(0, count).map((q, index) => ({
      id: q.id || `generated-${index}`,
      question: String(q.question || ""),
      options: Array.isArray(q.options) ? q.options.slice(0, 4) : [],
      correct: Math.max(0, Math.min(3, Number(q.correct ?? 0))),
      skill: String(q.skill || domain),
    }));

    return NextResponse.json({ questions: normalized });
  } catch (error) {
    console.error("Assessment generation error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to generate questions. Please try again.";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}
