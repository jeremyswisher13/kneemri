import { moduleRegistry, type ModuleMetadata } from "./index";
import { shoulderModuleRegistry } from "@/content/shoulder/modules";
import { hipModuleRegistry } from "@/content/hip/modules";
import { elbowModuleRegistry } from "@/content/elbow/modules";

/**
 * Full module content (including the heavy `topicContent` markdown), keyed by
 * globally-unique module id. Imported ONLY by the lazy ModulePage so the
 * teaching content stays out of the eager course bundle. The lightweight
 * `module-metas.ts` (used by the registry / listings) is kept in sync by a
 * drift test.
 */
export const moduleContentById: Record<string, ModuleMetadata> = Object.fromEntries(
  [...moduleRegistry, ...shoulderModuleRegistry, ...hipModuleRegistry, ...elbowModuleRegistry].map((m) => [m.id, m]),
);
