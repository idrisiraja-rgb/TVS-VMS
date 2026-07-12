export type ObservationCategory = "unsafe_act" | "unsafe_condition" | "near_miss" | "good_practice" | "bbs";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type ObservationStatus = "open" | "in_progress" | "closed";

export interface Observation {
  id: string;
  title: string;
  category: ObservationCategory;
  description: string;
  location: string;
  department: string;
  riskLevel: RiskLevel;
  evidenceType?: "photo" | "file";
  evidenceName?: string;
  status: ObservationStatus;
  date: string; // ISO string
  reporter: string;
  suggestedAction?: string;
}

export interface MonthlyReport {
  id: string;
  serviceProvider: string;
  reportingMonth: string; // "YYYY-MM"
  avgWorkforce: number;
  totalManHours: number;
  overtimeHours: number;
  employeesTrained: number;
  totalTrainingHours: number;
  ppeCompliance: number; // 0-100
  inspectionsCount: number;
  toolboxTalksCount: number;
  nearMissesCount: number;
  accidentsCount: number;
  incidentDetails: string;
  safetyKaizen: string;
  violationsIssued: number;
  generalRemarks: string;
  preparedBy: string;
  reviewedBy: string;
  approvedBy: string;
  status: "draft" | "submitted";
  createdAt: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  timeLeft: string;
  progress: number; // 0-100
  iconName: string;
  type: "forklift" | "fire" | "ppe" | "crane" | "trucks";
}

export interface ObserverStats {
  name: string;
  avatarUrl: string;
  department: string;
  observationsCount: number;
  badges: string[];
  rank: number;
}
