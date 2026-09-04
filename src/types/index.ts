export type UserRole =
  | "student"
  | "industry"
  | "academia"
  | "institution"
  | "admin";

export type CampusUser = {
  uid: string;
  name: string;
  email: string;
  role: UserRole;

  college?: string;
  degree?: string;
  branch?: string;
  year?: string;

  careerRole?: string;
  careerRoles?: string[];

  skillScores?: Record<string, number>;
  readiness?: number;

  placementScore?: number;
  placementStage?:
    | "Not Assessed"
    | "Foundation"
    | "Skill Building"
    | "Placement Ready"
    | "Interview Ready"
    | "Placed";

  companyName?: string;
  companyWebsite?: string;
  companyDescription?: string;
  industryType?: string;
  companyLocation?: string;

  designation?: string;
  department?: string;
  specialization?: string;
  experience?: number;

  academiaProfile?: {
    institution?: string;
    department?: string;
    designation?: string;
    specialization?: string;
    experience?: number;
    expertise?: string[];
    researchInterests?: string[];
    publications?: number;
    projects?: number;
    profileCompleted?: boolean;
  };

  institutionProfile?: {
    institutionName?: string;
    institutionType?: string;
    city?: string;
    state?: string;
    website?: string;
    placementOfficer?: string;
    departments?: string[];
    profileCompleted?: boolean;
  };

  photoUrl?: string;
  resumeUrl?: string;
  resumeName?: string;

  assessmentDomain?: string[];
  experienceYears?: number;
  experienceMonths?: number;
  preferredQuestionCount?: number;

  createdAt?: unknown;
  updatedAt?: unknown;
};
