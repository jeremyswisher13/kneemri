// Regenerates the lightweight eager metadata (src/content/module-metas.ts and
// src/content/case-metas.ts) from the full content registries. The heavy
// registries stay lazy; these projections are what the eager course registry
// uses. Drift tests (module-metas.test.ts / case-metas.test.ts) enforce sync.
//
//   npm run gen:metas
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";

const tmp = mkdtempSync(join(tmpdir(), "metas-"));
const entry = join(tmp, "entry.ts");
writeFileSync(
  entry,
  `import { moduleRegistry } from '@/content/modules';
import { shoulderModuleRegistry } from '@/content/shoulder/modules';
import { hipModuleRegistry } from '@/content/hip/modules';
import { caseRegistry } from '@/content/cases';
import { shoulderCaseRegistry } from '@/content/shoulder/cases';
import { hipCaseRegistry } from '@/content/hip/cases';
import { elbowModuleRegistry } from '@/content/elbow/modules';
import { elbowCaseRegistry } from '@/content/elbow/cases';
const m = (x) => ({ id: x.id, number: x.number, title: x.title, subtitle: x.subtitle, estimatedMinutes: x.estimatedMinutes, topics: x.topics });
const c = (x) => ({ id: x.id, title: x.title, difficulty: x.difficulty, tier: x.tier, residentVisible: x.residentVisible, clinicalScenario: x.clinicalScenario, keyDiagnoses: x.keyDiagnoses, tags: x.tags });
export default { kneeM: moduleRegistry.map(m), shldM: shoulderModuleRegistry.map(m), hipM: hipModuleRegistry.map(m), elbowM: elbowModuleRegistry.map(m), kneeC: caseRegistry.map(c), shldC: shoulderCaseRegistry.map(c), hipC: hipCaseRegistry.map(c), elbowC: elbowCaseRegistry.map(c) };
`,
);
const outDir = join(tmp, "out");
const outFile = join(outDir, "entry.mjs");
await build({
  configFile: false,
  copyPublicDir: false,
  logLevel: "error",
  resolve: { alias: { "@": resolve("src") } },
  build: {
    ssr: entry,
    outDir,
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      output: {
        entryFileNames: "entry.mjs",
        chunkFileNames: "chunk-[name].mjs",
      },
    },
  },
});
const d = (await import(pathToFileURL(outFile).href)).default;
const arr = (x) => JSON.stringify(x, null, 2);

writeFileSync(
  "src/content/module-metas.ts",
  `// AUTO-GENERATED lightweight module metadata (run \`npm run gen:metas\` to refresh).
// The eager course registry uses these so the heavy module teaching content
// (topicContent) is NOT pulled into the initial bundle — only the lazy
// ModulePage imports the full registry. A drift test keeps these in sync.

export interface ModuleMeta {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  topics: string[];
}

export const kneeModuleMetas: ModuleMeta[] = ${arr(d.kneeM)};

export const shoulderModuleMetas: ModuleMeta[] = ${arr(d.shldM)};

export const hipModuleMetas: ModuleMeta[] = ${arr(d.hipM)};

export const elbowModuleMetas: ModuleMeta[] = ${arr(d.elbowM)};
`,
);

writeFileSync(
  "src/content/case-metas.ts",
  `// AUTO-GENERATED lightweight case metadata (run \`npm run gen:metas\` to refresh).
// The eager course registry uses these so the heavy case bodies (modelReport,
// teachingPoints, searchPatternFindings, images) stay OUT of the initial bundle
// — only the lazy CasePage/GlobalSearch import the full registry. A drift test
// (case-metas.test.ts) keeps these in sync.

export interface CaseMeta {
  id: string;
  title: string;
  difficulty: 'foundational' | 'intermediate' | 'advanced';
  tier: 'core' | 'advanced';
  residentVisible: boolean;
  clinicalScenario: string;
  keyDiagnoses: string[];
  tags: string[];
}

export const kneeCaseMetas: CaseMeta[] = ${arr(d.kneeC)};

export const shoulderCaseMetas: CaseMeta[] = ${arr(d.shldC)};

export const hipCaseMetas: CaseMeta[] = ${arr(d.hipC)};

export const elbowCaseMetas: CaseMeta[] = ${arr(d.elbowC)};
`,
);

console.log("Regenerated src/content/module-metas.ts and src/content/case-metas.ts");
