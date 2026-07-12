import { Observation, MonthlyReport, TrainingModule, ObserverStats } from "./types";

export const INITIAL_LEADERBOARD: ObserverStats[] = [
  {
    name: "Azimuddin",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRYtZV2HS_rN58yJp0KxYS3Fv8IkTxdfKPW_Mr7p2nhx9P_dipqlLRJiaGrZ-1ziw4CO56HMLx5wD1Jb-t2qLQ0zX0mpCwMwOX3AiJsCPrnttgYYJvB75vWUCqFTba1aV3g5ns4DS-W1ap9aQCyTTqQp3hjtx4zv4Xk_kAC3xYtnN7BjbXGMzYBOlKQuGJBhlr6TuUU_-dGDXqRMUAk0BgtJ21RHm4y56CNBOo9VIT5Lkd8nXuMLg",
    department: "HSE Supervisor",
    observationsCount: 135,
    badges: ["workspace_premium", "military_tech"],
    rank: 1,
  },
  {
    name: "Sarah Connor",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXPhMkCAto3ov6n7Ff1tKbn86RSHp4knYfHI1aW89fNJKoLtMBTIYxG83PQGRmo9M0jeIuF76Czk-pOZ1Pf12rHYnaV5qkdT49x0PV9QGb3Tcr8I5Mqc2f6necOxQTVOB7daHfYbTYzImbvBbi-9MbFn66pP-08_qsWtYewHkJZruM7tztJBHXBZUkOKRtlVVu4nNnWubvvgijtvmqBq9v_gqnlAcVm01jqRiUzcMpdQGQhdEENd0",
    department: "Manufacturing",
    observationsCount: 112,
    badges: ["workspace_premium"],
    rank: 2,
  },
  {
    name: "Marcus Reyes",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCt8jY-sXKzcuFMSti-BJgBdYR8ywtnrLbTeZdU1-tm_HsDRSVSLlRXI6YeVAGPQvTEC1KSPpRktd9hpyqXNcOId46KkH1aX4MCetZL-kulcach7Vhi3GQeJNZErrI-vuC22HQog0TtDB7Jwehetpiaklz3ITfqorszqZhoZ-KEv8IX-2xZfq2i2SAjks6HktD3zt2zwfO2DZ51XwGs1GY4NzJ-WGVSv_Eyks1y0I7zLzEZs3QPoPM",
    department: "Quality Assurance",
    observationsCount: 98,
    badges: [],
    rank: 3,
  },
];

export const INITIAL_TRAINING_MODULES: TrainingModule[] = [
  {
    id: "t1",
    title: "Forklift Safety",
    description: "Essential maneuvers and stability protocols for Class I-V operators.",
    timeLeft: "20m left",
    progress: 80,
    iconName: "forklift",
    type: "forklift",
  },
  {
    id: "t2",
    title: "Fire Prevention",
    description: "Identifying ignition sources and proper emergency evacuation response.",
    timeLeft: "45m left",
    progress: 35,
    iconName: "fire_extinguisher",
    type: "fire",
  },
  {
    id: "t3",
    title: "PPE Proper Use",
    description: "Maintaining and fitting respiratory and impact protection gear.",
    timeLeft: "5m left",
    progress: 92,
    iconName: "child_hat",
    type: "ppe",
  },
  {
    id: "t4",
    title: "Reach Trucks Stacking",
    description: "Stacker maneuvers and vertical reach stability at high heights.",
    timeLeft: "15m left",
    progress: 15,
    iconName: "swap_vert",
    type: "trucks",
  },
];

// Seed enough observations to total exactly Closed=161, InProgress=50, Open=37 (Total=248)
export function getInitialObservations(): Observation[] {
  const list: Observation[] = [];

  // Closed observations (161)
  for (let i = 0; i < 161; i++) {
    list.push({
      id: `obs-closed-${i}`,
      title: i % 2 === 0 ? "Blocked Walkway cleared in Main Warehouse" : "Worker coached on wearing safety harness",
      category: i % 3 === 0 ? "unsafe_condition" : i % 3 === 1 ? "unsafe_act" : "bbs",
      description: "Walkway blocked by misplaced logistics pallets. Cleared immediately during inspection.",
      location: "Main Warehouse A",
      department: "Logistics",
      riskLevel: i % 4 === 0 ? "low" : i % 4 === 1 ? "medium" : "high",
      status: "closed",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i % 30 + 1)).toISOString(),
      reporter: "Azimuddin",
    });
  }

  // In Progress observations (50)
  for (let i = 0; i < 50; i++) {
    list.push({
      id: `obs-prog-${i}`,
      title: i % 2 === 0 ? "Hydraulic fluid leak observed near bay 4" : "Improper manual lifting observed",
      category: i % 2 === 0 ? "unsafe_condition" : "unsafe_act",
      description: "Minor oil slick spotted on the floor near Loading Bay 4. Maintenance notified, drip pan placed.",
      location: "Loading Dock 4",
      department: "Maintenance",
      riskLevel: i % 3 === 0 ? "medium" : "high",
      status: "in_progress",
      date: new Date(Date.now() - 1000 * 60 * 60 * (i + 1)).toISOString(),
      reporter: "Sarah Connor",
    });
  }

  // Open observations (37)
  for (let i = 0; i < 37; i++) {
    list.push({
      id: `obs-open-${i}`,
      title: i % 3 === 0 ? "Unmarked chemistry barrels detected" : i % 3 === 1 ? "Exposed electrical cabling in server room" : "Slippery puddle observed",
      category: i % 3 === 0 ? "unsafe_condition" : i % 3 === 1 ? "unsafe_condition" : "near_miss",
      description: "Water puddle detected on walkway floor due to condensation. Needs caution cone.",
      location: i % 2 === 0 ? "Chemical Storage" : "Office Block",
      department: "Quality Control",
      riskLevel: i % 3 === 0 ? "high" : i % 3 === 1 ? "critical" : "medium",
      status: "open",
      date: new Date(Date.now() - 1000 * 60 * (i * 10 + 5)).toISOString(),
      reporter: "Raja",
    });
  }

  return list;
}

export const INITIAL_MONTHLY_REPORTS: MonthlyReport[] = [
  {
    id: "rep-2024-10",
    serviceProvider: "Advanced Logistics Corp",
    reportingMonth: "2024-10",
    avgWorkforce: 100,
    totalManHours: 20800,
    overtimeHours: 1250,
    employeesTrained: 351,
    totalTrainingHours: 1404,
    ppeCompliance: 100,
    inspectionsCount: 42,
    toolboxTalksCount: 19,
    nearMissesCount: 0,
    accidentsCount: 0,
    incidentDetails: "No safety incidents or accidents reported during this period. PPE compliance maintained at 100% across all shifts.",
    safetyKaizen: "Implemented color-coded walkways in Main Warehouse A to separate pedestrian paths from forklift traffic.",
    violationsIssued: 4,
    generalRemarks: "Excellent overall performance with perfect safety sheet and zero recordable injuries. Keep up the safety focus.",
    preparedBy: "James Wilson (Safety Supervisor)",
    reviewedBy: "Sarah Jenkins",
    approvedBy: "Robert Taylor",
    status: "submitted",
    createdAt: "2024-10-31T17:00:00Z"
  }
];
