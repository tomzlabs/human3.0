
export enum Quadrant {
  MIND = 'Mind',
  BODY = 'Body',
  SPIRIT = 'Spirit',
  VOCATION = 'Vocation'
}

// Added Question interface to fix the import error in constants.ts
export interface Option {
  text: string;
  level: number;
}

export interface Question {
  id: number;
  text: string;
  quadrant: Quadrant;
  options: Option[];
}

export interface AssessmentResult {
  quadrantScores: Record<Quadrant, number>;
  averageLevel: number;
  metatype: string;
  metatypeDescription: string;
  lifestyleArchetype: string;
  lifestyleDescription: string;
  quadrantDetails: Record<Quadrant, {
    phase: string;
    levelDescriptor: string;
    truth: string;
  }>;
  crossQuadrantDynamics: {
    primaryBlock: string;
    unlockOpportunity: string;
    hiddenPattern: string;
  };
  coreProblem: string;
  strategy: {
    shortTerm: { daily: string[]; challenge: string; metric: string };
    midTerm: { shift: string; skill: string; milestone: string };
    longTerm: { goal: string; integration: string };
  };
  glitchAssessment: string;
  theTruth: string;
  immediateAction: string;
}
