export type CaseResultDto = {
  hidden: boolean;
  passed: boolean;
  stdin?: string;
  expected?: string;
  actual?: string;
};

export type JudgeOutcomeDto = {
  allPassed: boolean;
  compileFailed: boolean;
  stderr: string;
  results: CaseResultDto[];
  backend: "http" | "local" | null;
};

export type LessonProgressDto = {
  completedSteps: number[];
  completed: boolean;
  xpGained?: number;
};

export type ProjectProgressDto = {
  doneSteps: number[];
  finalPassed: boolean;
  completed: boolean;
  xpGained?: number;
};
