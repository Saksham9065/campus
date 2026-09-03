export type JobOpportunity = {
  id: string;
  title: string;
  company: string;
  companyId?: string;
  location: string;
  type: "Internship" | "Full-time" | "Part-time";
  mode: "Remote" | "Hybrid" | "On-site";
  description: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  experience?: string;
  stipend?: string;
  salary?: string;
  deadline?: string;
  postedAt?: unknown;
  status?: "open" | "closed";
};

export type JobMatchResult = {
  match: number;
  matchedSkills: string[];
  partialSkills: string[];
  missingSkills: string[];
  recommendation: string;
};

const skillAliases: Record<string, string[]> = {
  python: ["python"],
  pandas: ["pandas"],
  numpy: ["numpy"],
  javascript: [
    "javascript",
    "js",
  ],
  react: [
    "react",
    "reactjs",
  ],
  "node.js": [
    "node.js",
    "nodejs",
    "node",
  ],
  sql: [
    "sql",
    "mysql",
    "postgresql",
    "postgres",
  ],
  "data visualization": [
    "data visualization",
    "power bi",
    "tableau",
  ],
  "power bi": [
    "power bi",
    "powerbi",
  ],
  tableau: ["tableau"],
  statistics: [
    "statistics",
    "statistical analysis",
  ],
  analytics: [
    "analytics",
    "data analytics",
  ],
  excel: [
    "excel",
    "microsoft excel",
  ],
  "machine learning": [
    "machine learning",
    "ml",
  ],
  "ai/ml": [
    "ai/ml",
    "ai ml",
    "artificial intelligence",
    "machine learning",
  ],
  git: [
    "git",
    "github",
  ],
  linux: ["linux"],
  networking: [
    "networking",
    "computer networks",
  ],
  cybersecurity: [
    "cybersecurity",
    "cyber security",
    "information security",
  ],
};

function normalizeSkill(skill: string) {
  return skill
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function skillsEquivalent(
  studentSkill: string,
  requiredSkill: string
) {
  const student = normalizeSkill(studentSkill);
  const required = normalizeSkill(requiredSkill);

  if (student === required) return true;

  const aliases =
    skillAliases[required] || [required];

  return aliases.includes(student);
}

export function calculateJobMatch(
  studentSkills: Record<string, number>,
  requiredSkills: string[],
  preferredSkills: string[] = []
): JobMatchResult {
  if (!requiredSkills.length) {
    return {
      match: 0,
      matchedSkills: [],
      partialSkills: [],
      missingSkills: [],
      recommendation:
        "No required skills were provided for this opportunity.",
    };
  }

  const matchedSkills: string[] = [];
  const partialSkills: string[] = [];
  const missingSkills: string[] = [];

  requiredSkills.forEach((requiredSkill) => {
    const studentEntry = Object.entries(
      studentSkills
    ).find(([studentSkill]) =>
      skillsEquivalent(
        studentSkill,
        requiredSkill
      )
    );

    if (!studentEntry) {
      missingSkills.push(requiredSkill);
      return;
    }

    const score = studentEntry[1];

    if (score >= 70) {
      matchedSkills.push(requiredSkill);
    } else if (score >= 40) {
      partialSkills.push(requiredSkill);
    } else {
      missingSkills.push(requiredSkill);
    }
  });

  const requiredScore =
    matchedSkills.length * 1 +
    partialSkills.length * 0.5;

  const requiredMatch =
    (requiredScore / requiredSkills.length) *
    100;

  const preferredMatched =
    preferredSkills.filter((preferred) =>
      Object.entries(studentSkills).some(
        ([studentSkill, score]) =>
          score >= 70 &&
          skillsEquivalent(
            studentSkill,
            preferred
          )
      )
    ).length;

  const preferredBonus =
    preferredSkills.length > 0
      ? (preferredMatched /
          preferredSkills.length) *
        10
      : 0;

  const match = Math.min(
    100,
    Math.round(
      requiredMatch * 0.9 +
        preferredBonus
    )
  );

  let recommendation =
    "Build the missing skills before applying.";

  if (match >= 90) {
    recommendation =
      "Excellent match. You should strongly consider applying.";
  } else if (match >= 80) {
    recommendation =
      "Strong match. Your profile aligns well with this opportunity.";
  } else if (match >= 70) {
    recommendation =
      "Good match. Apply while improving your remaining skill gaps.";
  } else if (match >= 50) {
    recommendation =
      "Potential match. Strengthen the missing skills to improve your chances.";
  }

  return {
    match,
    matchedSkills,
    partialSkills,
    missingSkills,
    recommendation,
  };
}
