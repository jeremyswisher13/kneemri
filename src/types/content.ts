export interface QuizQuestion {
  id: string;
  stem: string;
  image?: { src: string; alt: string; caption: string };
  options: { key: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  domain: string;
  prePostMapping: 'identical' | 'parallel-pre' | 'parallel-post' | 'pre-only' | 'post-only';
  parallelId?: string;
  /** Module this item is blueprinted to (for content-validity traceability). */
  moduleId?: string;
  /** Bloom level the item targets — application/analysis for interpretation skill. */
  cognitiveLevel?: 'apply' | 'analyze';
}

export interface ConfidenceStatement {
  id: string;
  statement: string;
  domain: string;
}

export interface Module {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  searchPatternStep: number | null;
  estimatedMinutes: number;
  sections: ContentSection[];
  keyTakeaways: string[];
}

export interface ContentSection {
  id: string;
  title: string;
  content: string; // markdown
  images: ContentImage[];
  clinicalPearls: string[];
}

export interface ContentImage {
  src: string;
  alt: string;
  caption: string;
  attribution?: { source: string; author: string; license: string; url: string };
}

export interface CaseData {
  id: string;
  title: string;
  difficulty: 'foundational' | 'intermediate' | 'advanced';
  clinicalScenario: string;
  images: CaseImage[];
  searchPatternFindings: SearchPatternFinding[];
  modelReport: { findings: string; impression: string };
  keyDiagnoses: string[];
  teachingPoints: string[];
  tags: string[];
}

export interface CaseImage {
  src: string;
  sequence: string;
  sliceDescription: string;
  alt: string;
  attribution?: { source: string; author: string; license: string; url: string };
}

export interface SearchPatternFinding {
  step: number;
  stepName: string;
  expectedFindings: string[];
  teachingPoints: string[];
}

export interface SearchPatternStep {
  number: number;
  name: string;
  shortName: string;
  description: string;
  checklistItems: string[];
  pearls: string[];
}
