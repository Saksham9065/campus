import type { SkillResult } from "@/lib/skillEngine";

export type Lesson = {
  id: string;
  title: string;
  description: string;
  duration: string;
};

export type LearningProgram = {
  id: string;
  title: string;
  provider: string;
  duration: string;
  level: string;
  skills: string[];
  description: string;
  lessons: Lesson[];
  career: string;
  domains: string[];
};

export type RecommendationOptions = {
  careerRole?: string;
  domains?: string[];
};

export type RecommendationResult = {
  program: LearningProgram;
  relevance: number;
  matchingSkills: string[];
  careerMatch: boolean;
  matchingDomains: string[];
  score: number;
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
      "Start your data journey with SQL. Learn to write queries, filter records, join tables and summarize datasets using SQL fundamentals. This program is designed for beginners who want to think analytically with data.",
    career: "Data Analyst",
    domains: ["Database Engineering", "Data Engineering"],
    lessons: [
      {
        id: "sql-foundations-intro",
        title: "Introduction to Databases",
        description:
          "Understand relational database concepts, tables, rows, columns and the SQL language basics used to interact with data.",
        duration: "20 min",
      },
      {
        id: "sql-foundations-select",
        title: "SELECT and Filtering",
        description:
          "Write SELECT statements, apply WHERE clauses and use comparison operators to retrieve exactly the data you need.",
        duration: "30 min",
      },
      {
        id: "sql-foundations-aggregation",
        title: "Aggregation and Grouping",
        description:
          "Summarize datasets with COUNT, SUM, AVG, MIN, MAX and GROUP BY to reveal patterns in your data.",
        duration: "35 min",
      },
      {
        id: "sql-foundations-joins",
        title: "Joins and Relationships",
        description:
          "Combine data from multiple tables using INNER, LEFT, RIGHT and FULL OUTER joins to build complete datasets.",
        duration: "45 min",
      },
      {
        id: "sql-foundations-project",
        title: "Capstone: SQL Project",
        description:
          "Build a complete analytical query pipeline on a realistic dataset to practice everything you have learned.",
        duration: "40 min",
      },
    ],
  },
  {
    id: "advanced-sql",
    title: "Advanced SQL & Analytics",
    provider: "TechNova Academy",
    duration: "3 Weeks",
    level: "Intermediate",
    skills: ["SQL", "Analytics"],
    description:
      "Take your SQL skills to the next level. Master CTEs, window functions, analytical queries and performance tuning. Learn to write production-ready queries that solve real business problems.",
    career: "Data Analyst",
    domains: ["Database Engineering", "Data Engineering", "Backend Engineering"],
    lessons: [
      {
        id: "advanced-sql-cte",
        title: "Common Table Expressions",
        description:
          "Write readable, maintainable queries using CTEs for complex logic and recursive data relationships.",
        duration: "40 min",
      },
      {
        id: "advanced-sql-window",
        title: "Window Functions",
        description:
          "Apply ROW_NUMBER, RANK, LAG and aggregate window functions to perform calculations across related rows.",
        duration: "50 min",
      },
      {
        id: "advanced-sql-analytics",
        title: "Analytical Queries",
        description:
          "Perform cohort analysis, running totals and moving averages to uncover trends in business data.",
        duration: "45 min",
      },
      {
        id: "advanced-sql-performance",
        title: "Performance and Indexes",
        description:
          "Optimize query performance using indexes, execution plans and profiling techniques for large datasets.",
        duration: "40 min",
      },
      {
        id: "advanced-sql-project",
        title: "Capstone: Advanced Analytics",
        description:
          "Analyze a business dataset end-to-end with window functions and produce actionable insights.",
        duration: "55 min",
      },
    ],
  },
  {
    id: "power-bi",
    title: "Power BI Fundamentals",
    provider: "InsightLabs",
    duration: "1 Week",
    level: "Beginner",
    skills: ["Power BI", "Data Visualization"],
    description:
      "Turn raw data into compelling business intelligence. Learn Power BI from the ground up, including data modeling, DAX basics, visual design and dashboard publishing for stakeholder-ready insights.",
    career: "Data Analyst",
    domains: ["AI & Data Science", "Data Engineering", "Database Engineering"],
    lessons: [
      {
        id: "power-bi-intro",
        title: "Power BI Overview",
        description:
          "Get started with Power BI by navigating the interface, connecting to data sources and understanding the report building workflow.",
        duration: "25 min",
      },
      {
        id: "power-bi-modeling",
        title: "Data Modeling",
        description:
          "Build relationships between tables, use DAX basics and shape data with Power Query for reliable analytics.",
        duration: "40 min",
      },
      {
        id: "power-bi-visuals",
        title: "Visualizations",
        description:
          "Create and customize charts, cards, tables and slicers to present data clearly and effectively.",
        duration: "35 min",
      },
      {
        id: "power-bi-dashboards",
        title: "Dashboards and Publishing",
        description:
          "Assemble interactive dashboards, publish to the Power BI service and share reports with stakeholders.",
        duration: "30 min",
      },
      {
        id: "power-bi-project",
        title: "Capstone: Interactive Dashboard",
        description:
          "Build a sales dashboard from a multi-table dataset and publish it for interactive exploration.",
        duration: "40 min",
      },
    ],
  },
  {
    id: "python-analytics",
    title: "Python for Data Analytics",
    provider: "AIWorks",
    duration: "4 Weeks",
    level: "Intermediate",
    skills: ["Python", "Pandas", "NumPy"],
    description:
      "Master Python for real-world data analytics. Learn to clean messy data, perform statistical analysis and build reproducible analytical workflows with Pandas and NumPy.",
    career: "Data Analyst",
    domains: ["AI & Data Science", "Data Engineering", "Software Engineering"],
    lessons: [
      {
        id: "python-analytics-python",
        title: "Python Refresher",
        description:
          "Strengthen your Python fundamentals. Review variables, control flow, functions and core data structures needed for data work.",
        duration: "35 min",
      },
      {
        id: "python-analytics-numpy",
        title: "NumPy Foundations",
        description:
          "Learn NumPy arrays, broadcasting rules and vectorized operations to write fast, memory-efficient numerical code.",
        duration: "45 min",
      },
      {
        id: "python-analytics-pandas",
        title: "Pandas Basics",
        description:
          "Load data into DataFrames, inspect structure, filter rows and columns, and transform data for analysis.",
        duration: "55 min",
      },
      {
        id: "python-analytics-cleaning",
        title: "Data Cleaning",
        description:
          "Handle missing values, remove duplicates, fix data types and prepare raw datasets for reliable analysis.",
        duration: "50 min",
      },
      {
        id: "python-analytics-aggregation",
        title: "Aggregation and Analysis",
        description:
          "Group data, compute summary statistics and derive actionable insights from structured datasets.",
        duration: "50 min",
      },
      {
        id: "python-analytics-project",
        title: "Capstone: Analytics Project",
        description:
          "Apply your skills to analyze a real-world dataset end-to-end and produce a structured analytical report.",
        duration: "60 min",
      },
    ],
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
      "Learn to create compelling, insightful visualizations that communicate data stories. From Matplotlib to interactive Plotly dashboards, build the skills to make data understandable and actionable.",
    career: "Data Analyst",
    domains: ["AI & Data Science", "Data Engineering", "Frontend Engineering"],
    lessons: [
      {
        id: "data-viz-matplotlib",
        title: "Matplotlib Basics",
        description:
          "Create and customize foundational plots including line charts, bar charts, scatter plots and histograms to explore data visually.",
        duration: "40 min",
      },
      {
        id: "data-viz-seaborn",
        title: "Seaborn and Styling",
        description:
          "Build statistical plots with Seaborn and apply professional styling to produce publication-ready visuals.",
        duration: "45 min",
      },
      {
        id: "data-viz-storytelling",
        title: "Data Storytelling",
        description:
          "Learn to structure narratives, select the right chart type and annotate insights so your audience understands the data.",
        duration: "35 min",
      },
      {
        id: "data-viz-interactive",
        title: "Interactive Visuals",
        description:
          "Build interactive figures with Plotly to create dashboards that let users explore data dynamically.",
        duration: "40 min",
      },
      {
        id: "data-viz-project",
        title: "Capstone: Visualization Dashboard",
        description:
          "Design a multi-panel analytical dashboard from a dataset and present a clear data story.",
        duration: "50 min",
      },
    ],
  },
  {
    id: "statistics",
    title: "Statistics for Data Science",
    provider: "HealthTech Research Labs",
    duration: "3 Weeks",
    level: "Intermediate",
    skills: ["Statistics", "Probability"],
    description:
      "Build the statistical intuition needed for analytics and machine learning. Learn descriptive statistics, probability, inference and regression to make data-driven decisions with confidence.",
    career: "Data Analyst",
    domains: ["AI & Data Science", "Machine Learning & Deep Learning"],
    lessons: [
      {
        id: "statistics-descriptive",
        title: "Descriptive Statistics",
        description:
          "Master mean, median, mode, variance and standard deviation to summarize and describe datasets effectively.",
        duration: "40 min",
      },
      {
        id: "statistics-probability",
        title: "Probability Fundamentals",
        description:
          "Learn probability distributions, Bayes' theorem and fundamental probability rules to quantify uncertainty.",
        duration: "50 min",
      },
      {
        id: "statistics-inference",
        title: "Statistical Inference",
        description:
          "Apply hypothesis testing, p-values and confidence intervals to draw conclusions from sample data.",
        duration: "55 min",
      },
      {
        id: "statistics-correlation",
        title: "Correlation and Regression",
        description:
          "Understand linear regression, R-squared and model interpretation to quantify relationships between variables.",
        duration: "50 min",
      },
      {
        id: "statistics-project",
        title: "Capstone: A/B Test Analysis",
        description:
          "Design and analyze an A/B test on experiment data to make statistically sound business decisions.",
        duration: "45 min",
      },
    ],
  },
  {
    id: "react",
    title: "Modern React Development",
    provider: "TechNova Academy",
    duration: "3 Weeks",
    level: "Intermediate",
    skills: ["React", "JavaScript"],
    description:
      "Learn to build modern, component-based user interfaces with React. Master components, state management, hooks, routing and responsive styling to create production-ready web apps.",
    career: "Software Developer",
    domains: ["Frontend Engineering", "Full Stack Development", "Software Engineering"],
    lessons: [
      {
        id: "react-fundamentals",
        title: "React Fundamentals",
        description:
          "Understand React components, props, JSX syntax and the rendering pipeline to build reusable UI building blocks.",
        duration: "40 min",
      },
      {
        id: "react-state",
        title: "State and Hooks",
        description:
          "Master useState, useEffect and custom hooks to manage component state, side effects and reusable logic in React applications.",
        duration: "50 min",
      },
      {
        id: "react-router",
        title: "Routing and Navigation",
        description:
          "Implement client-side routing with React Router or Next.js to navigate between pages and manage URL state.",
        duration: "45 min",
      },
      {
        id: "react-styling",
        title: "Styling and Layout",
        description:
          "Style React components using CSS modules, Tailwind and responsive layout patterns that work across devices.",
        duration: "40 min",
      },
      {
        id: "react-project",
        title: "Capstone: Todo Application",
        description:
          "Build a full-featured todo application with add, edit, complete and persist functionality using React and local storage.",
        duration: "55 min",
      },
    ],
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
      "Build a practical foundation in machine learning. Understand supervised learning, model evaluation, preprocessing and feature engineering to develop and deploy real ML solutions.",
    career: "AI/ML Engineer",
    domains: ["AI & Full Stack", "Machine Learning & Deep Learning", "AI & Data Science"],
    lessons: [
      {
        id: "ml-intro",
        title: "ML Overview and Workflow",
        description:
          "Understand the machine learning project lifecycle, from problem framing and train/test split to choosing the right evaluation metrics for your model.",
        duration: "45 min",
      },
      {
        id: "ml-preprocessing",
        title: "Data Preprocessing",
        description:
          "Clean raw data, encode categorical variables, scale features and perform feature engineering to prepare datasets for model training.",
        duration: "55 min",
      },
      {
        id: "ml-supervised",
        title: "Supervised Learning",
        description:
          "Implement linear regression, logistic regression, decision trees and ensemble methods to solve classification and regression problems.",
        duration: "60 min",
      },
      {
        id: "ml-evaluation",
        title: "Model Evaluation",
        description:
          "Use confusion matrices, ROC curves, precision-recall metrics and cross-validation to assess model performance and generalization.",
        duration: "50 min",
      },
      {
        id: "ml-features",
        title: "Feature Importance",
        description:
          "Interpret model predictions, apply regularization techniques and select the most impactful features to improve model quality.",
        duration: "45 min",
      },
      {
        id: "ml-project",
        title: "Capstone: End-to-End ML Project",
        description:
          "Design, train, evaluate and present a complete machine learning pipeline on a real dataset from scratch.",
        duration: "70 min",
      },
    ],
  },
];

export function getProgramById(
  programId: string,
  programs: LearningProgram[] = learningPrograms
): LearningProgram | undefined {
  return programs.find(
    (program) => program.id === programId
  );
}

export function getProgramLessons(
  programId: string,
  programs: LearningProgram[] = learningPrograms
): Lesson[] {
  return getProgramById(programId, programs)?.lessons ?? [];
}

export function recommendLearningPrograms(
  gaps: SkillResult[],
  programs: LearningProgram[] = learningPrograms,
  options?: RecommendationOptions
): RecommendationResult[] {
  const { careerRole, domains = [] } =
    options ?? {};

  const normalizedDomains = domains.map((d) =>
    d.toLowerCase()
  );

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

      const careerMatch =
        !!careerRole &&
        program.career.toLowerCase() ===
          careerRole.toLowerCase();

      const matchingDomains = program.domains.filter(
        (programDomain) =>
          normalizedDomains.includes(
            programDomain.toLowerCase()
          )
      );

      const score =
        matchingSkills.length * 10 +
        (careerMatch ? 50 : 0) +
        matchingDomains.length * 5;

      return {
        program,
        relevance: matchingSkills.length,
        matchingSkills,
        careerMatch,
        matchingDomains,
        score,
      };
    })
    .filter(
      (item) =>
        item.relevance > 0 ||
        item.careerMatch ||
        item.matchingDomains.length > 0
    )
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.relevance - a.relevance
    );
}

export function getRecommendedForCareer(
  careerRole?: string,
  domains: string[] = [],
  programs: LearningProgram[] = learningPrograms
): RecommendationResult[] {
  return recommendLearningPrograms(
    [],
    programs,
    { careerRole, domains }
  );
}
