import type { SkillResult } from "@/lib/skillEngine";

export type LearningProgram = {
  id: string;
  title: string;
  provider: string;
  duration: string;
  level: string;
  skills: string[];
  description: string;
};

export const learningPrograms: LearningProgram[] = [
  {
    id: "sql-foundations",
    title: "SQL Foundations",
    provider: "CampusLink Academy",
    duration: "2 Weeks",
    level: "Beginner",
    skills: ["SQL", "Database"],
    description:
      "Learn SQL fundamentals, filtering, joins and aggregation.",
  },
  {
    id: "advanced-sql",
    title: "Advanced SQL & Analytics",
    provider: "TechNova Academy",
    duration: "3 Weeks",
    level: "Intermediate",
    skills: ["SQL", "Analytics"],
    description:
      "Master analytical queries, CTEs, window functions and real datasets.",
  },
  {
    id: "power-bi",
    title: "Power BI Fundamentals",
    provider: "InsightLabs",
    duration: "1 Week",
    level: "Beginner",
    skills: ["Power BI", "Data Visualization"],
    description:
      "Create dashboards and communicate data-driven insights.",
  },
  {
    id: "python-analytics",
    title: "Python for Data Analytics",
    provider: "AIWorks",
    duration: "4 Weeks",
    level: "Intermediate",
    skills: ["Python", "Pandas", "NumPy"],
    description:
      "Use Python for data cleaning, analysis and practical analytics.",
  },
  {
    id: "data-visualization",
    title: "Data Visualization with Python",
    provider: "CampusLink Academy",
    duration: "2 Weeks",
    level: "Intermediate",
    skills: [
      "Python",
      "Data Visualization",
      "Pandas",
    ],
    description:
      "Create meaningful visualizations and analytical stories.",
  },
  {
    id: "statistics",
    title: "Statistics for Data Science",
    provider: "HealthTech Research Labs",
    duration: "3 Weeks",
    level: "Intermediate",
    skills: ["Statistics", "Probability"],
    description:
      "Learn statistics needed for analytics and machine learning.",
  },
  {
    id: "react",
    title: "Modern React Development",
    provider: "TechNova Academy",
    duration: "3 Weeks",
    level: "Intermediate",
    skills: ["React", "JavaScript"],
    description:
      "Build modern component-based web applications.",
  },
  {
    id: "ml",
    title: "Machine Learning Foundations",
    provider: "AIWorks",
    duration: "5 Weeks",
    level: "Intermediate",
    skills: [
      "Machine Learning",
      "Python",
      "Statistics",
    ],
    description:
      "Learn supervised learning, evaluation and practical ML workflows.",
  },
];

export function recommendLearningPrograms(
  gaps: SkillResult[],
  programs: LearningProgram[] = learningPrograms
) {
  return programs
    .map((program) => {
      const matchingSkills = program.skills.filter(
        (programSkill) =>
          gaps.some(
            (gap) =>
              gap.name.toLowerCase() ===
              programSkill.toLowerCase()
          )
      );

      return {
        program,
        relevance: matchingSkills.length,
        matchingSkills,
      };
    })
    .filter((item) => item.relevance > 0)
    .sort(
      (a, b) =>
        b.relevance - a.relevance
    );
}
