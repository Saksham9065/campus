import type { Question } from "@/lib/assessmentQuestions";

export type SkillLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export type SkillStatus =
  | "Strong"
  | "Developing"
  | "Gap";

export type SkillResult = {
  name: string;
  score: number;
  level: SkillLevel;
  status: SkillStatus;
};

export type RoadmapNode = {
  id: string;
  title: string;
  category: string;
  description: string;
  skills: string[];
  status: "completed" | "current" | "upcoming";
  duration: string;
};

export function calculateSkillScore(
  correct: number,
  total: number
): number {
  if (total <= 0) return 0;

  return Math.round((correct / total) * 100);
}

export function getSkillLevel(
  score: number
): SkillLevel {
  if (score >= 80) return "Advanced";
  if (score >= 60) return "Intermediate";

  return "Beginner";
}

export function getSkillStatus(
  score: number
): SkillStatus {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Developing";

  return "Gap";
}

export function generateSkillResults(
  scores: Record<string, number>
): SkillResult[] {
  return Object.entries(scores)
    .map(([name, score]) => ({
      name,
      score,
      level: getSkillLevel(score),
      status: getSkillStatus(score),
    }))
    .sort((a, b) => b.score - a.score);
}

export function calculateReadiness(
  skills: SkillResult[]
): number {
  if (!skills.length) return 0;

  const total = skills.reduce(
    (sum, skill) => sum + skill.score,
    0
  );

  return Math.round(total / skills.length);
}

export function getSkillGaps(
  skills: SkillResult[]
): SkillResult[] {
  return skills
    .filter((skill) => skill.score < 70)
    .sort((a, b) => a.score - b.score);
}

export function getTopSkills(
  skills: SkillResult[]
): SkillResult[] {
  return skills
    .filter((skill) => skill.score >= 70)
    .sort((a, b) => b.score - a.score);
}

/**
 * Generates a personalized roadmap from actual skill scores.
 */
export function generateRoadmap(
  skills: SkillResult[]
): RoadmapNode[] {
  const roadmap: RoadmapNode[] = [];

  const gaps = getSkillGaps(skills);

  if (gaps.length === 0) {
    roadmap.push({
      id: "advanced-project",
      title: "Build an Industry Project",
      category: "Projects",
      description:
        "Apply your existing skills to a realistic industry problem.",
      skills: skills.slice(0, 3).map((skill) => skill.name),
      status: "current",
      duration: "3 Weeks",
    });

    roadmap.push({
      id: "advanced-readiness",
      title: "Placement Readiness",
      category: "Career",
      description:
        "Prepare your portfolio, applications and interview skills.",
      skills: ["Interview", "Portfolio", "Communication"],
      status: "upcoming",
      duration: "2 Weeks",
    });

    return roadmap;
  }

  gaps.forEach((skill, index) => {
    roadmap.push({
      id: `improve-${skill.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`,
      title: `Improve ${skill.name}`,
      category: "Skill Development",
      description: getSkillImprovementDescription(
        skill.name
      ),
      skills: [skill.name],
      status: index === 0 ? "current" : "upcoming",
      duration: getDuration(skill.score),
    });
  });

  roadmap.push({
    id: "industry-project",
    title: "Build an Industry Project",
    category: "Projects",
    description:
      "Combine your improved skills in a practical portfolio project.",
    skills: gaps.slice(0, 3).map((skill) => skill.name),
    status: "upcoming",
    duration: "3 Weeks",
  });

  roadmap.push({
    id: "placement-readiness",
    title: "Placement Readiness",
    category: "Career",
    description:
      "Prepare for applications, interviews and industry recruitment.",
    skills: [
      "Resume",
      "Interview",
      "Communication",
    ],
    status: "upcoming",
    duration: "1 Week",
  });

  return roadmap;
}

function getDuration(score: number): string {
  if (score < 40) return "3 Weeks";
  if (score < 60) return "2 Weeks";

  return "1 Week";
}

function getSkillImprovementDescription(
  skill: string
): string {
  const descriptions: Record<string, string> = {
    Python:
      "Strengthen Python fundamentals, data structures and practical problem solving.",

    SQL:
      "Practice queries, filtering, joins, aggregation and analytical SQL.",

    Statistics:
      "Build confidence in descriptive statistics, probability and data interpretation.",

    "Data Visualization":
      "Learn how to communicate insights using effective charts and dashboards.",

    "Data Analytics":
      "Improve data cleaning, exploration and analytical decision making.",

    JavaScript:
      "Strengthen modern JavaScript concepts and application development.",

    React:
      "Build component-based interfaces using modern React patterns.",

    "Machine Learning":
      "Learn core ML concepts, model evaluation and practical workflows.",

    NumPy:
      "Strengthen numerical computing and array-based data operations.",

    Pandas:
      "Practice data cleaning, transformation and analysis using Pandas.",

    Git:
      "Improve version control, branching and collaborative development.",
  };

  return (
    descriptions[skill] ||
      `Develop your ${skill} skills through focused learning and practical projects.`
  );
}

export type AssessmentAttempt = {
  total: number;
  attempted: number;
  correct: number;
  wrong: number;
  unattempted: number;
  score: number;
  accuracy: number;
  attemptRate: number;
};

export type QuestionReport = {
  id: string;
  skill: string;
  question: string;
  options: string[];
  selectedIndex: number | undefined;
  correctIndex: number;
  isCorrect: boolean;
  isUnattempted: boolean;
  marks: number;
};

const SKILL_ROLE_MAP: Record<string, string> = {
  "Backend Engineering": "Backend Engineer",
  "Backend Architecture": "Backend Engineer",
  "Backend Operations": "Backend Engineer",
  "Backend Reliability": "Backend Engineer",
  "Backend Security": "Security Engineer",
  "Frontend Engineering": "Frontend Developer",
  "Frontend Performance": "Frontend Developer",
  "Frontend UX": "Frontend Developer",
  "Full Stack Performance": "Full Stack Developer",
  "Full Stack Validation": "Full Stack Developer",
  "Security": "Security Engineer",
  "Database Engineering": "Data Engineer",
  DevOps: "DevOps Engineer",
  "AI System Design": "AI Engineer",
  "AI Engineering": "AI Engineer",
  "AI Evaluation": "AI/ML Specialist",
  "AI & Search": "AI/Research Engineer",
  "AI & Logic": "Data Scientist",
  "AI Fundamentals": "AI Engineer",
  "AI Security": "AI/ML Specialist",
  "Data Structures": "Software Engineer",
  "System Design": "Software Engineer",
};

export function calculateAssessmentScore(
  answers: Record<string, number>,
  questions: Question[]
): AssessmentAttempt {
  const total = questions.length;

  const evaluated = questions.filter(
    (q) => answers[q.id] === q.correct
  );
  const correct = evaluated.length;

  const attempted = questions.filter((q) => {
    const answered =
      answers[q.id] !== undefined && answers[q.id] !== null;

    return answered;
  }).length;

  const wrong = attempted - correct;
  const unattempted = total - attempted;
  const score =
    total <= 0 ? 0 : Math.round((correct / total) * 100);
  const attemptRate =
    total <= 0 ? 0 : Math.round((attempted / total) * 100);

  return {
    total,
    attempted,
    correct,
    wrong,
    unattempted,
    score,
    accuracy: score,
    attemptRate,
  };
}

export function buildQuestionReport(
  answers: Record<string, number>,
  questions: Question[]
): QuestionReport[] {
  return questions.map((q) => {
    const selectedIndex = answers[q.id];
    const answered =
      selectedIndex !== undefined && selectedIndex !== null;
    const isCorrect = answered && selectedIndex === q.correct;

    return {
      id: q.id,
      skill: q.skill,
      question: q.question,
      options: q.options,
      selectedIndex,
      correctIndex: q.correct,
      isCorrect: Boolean(isCorrect),
      isUnattempted: !answered,
      marks: isCorrect ? 1 : 0,
    };
  });
}

export function suggestCareerRole(
  skillResults: SkillResult[],
  preferredRole = "Data Analyst"
): string {
  if (!skillResults.length) return preferredRole;

  for (const skill of skillResults) {
    if (skill.score >= 60 && SKILL_ROLE_MAP[skill.name]) {
      return SKILL_ROLE_MAP[skill.name];
    }
  }

  const top = skillResults[0];

  return SKILL_ROLE_MAP[top.name] ?? preferredRole;
}
