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
