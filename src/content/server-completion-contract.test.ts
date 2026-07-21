import { readFileSync } from "node:fs";
import * as ts from "typescript";
import { describe, expect, it } from "vitest";
import { courseRegistry, getPostQuizQuestions, REQUIRED_CORE_CASE_COUNT } from "@/content/courses";
import { normalPlaneIdsFor } from "@/lib/normal-plane-ids";

const functionSourceText = readFileSync(
  new URL("../../functions/index.js", import.meta.url),
  "utf8",
);
const functionSource = ts.createSourceFile(
  "functions/index.js",
  functionSourceText,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.JS,
);

function initializerFor(name: string): ts.Expression {
  for (const statement of functionSource.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name && declaration.initializer) {
        return declaration.initializer;
      }
    }
  }
  throw new Error(`Missing server constant: ${name}`);
}

function stringArray(expression: ts.Expression, label: string): string[] {
  if (!ts.isArrayLiteralExpression(expression)) {
    throw new Error(`${label} is not an array literal`);
  }
  return expression.elements.map((element) => {
    if (!ts.isStringLiteralLike(element)) {
      throw new Error(`${label} contains a non-string entry`);
    }
    return element.text;
  });
}

function serverStringArray(name: string): string[] {
  return stringArray(initializerFor(name), name);
}

function objectProperty(objectName: string, propertyName: string): ts.Expression {
  const object = initializerFor(objectName);
  if (!ts.isObjectLiteralExpression(object)) {
    throw new Error(`${objectName} is not an object literal`);
  }
  for (const property of object.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    const name = property.name;
    const key = ts.isIdentifier(name) || ts.isStringLiteralLike(name) ? name.text : null;
    if (key === propertyName) return property.initializer;
  }
  throw new Error(`Missing ${objectName}.${propertyName}`);
}

/** Resolve a numeric server value, following one level of identifier reference
 *  (e.g. knee's moduleCount is the constant MODULE_COUNT, not a literal). */
function resolveNumber(expression: ts.Expression, label: string): number {
  if (ts.isNumericLiteral(expression)) return Number(expression.text);
  if (ts.isIdentifier(expression)) {
    const referenced = initializerFor(expression.text);
    if (ts.isNumericLiteral(referenced)) return Number(referenced.text);
  }
  throw new Error(`${label} did not resolve to a numeric constant`);
}

describe("server completion contract", () => {
  it("keeps server moduleCount and quizTotal synchronized with client content", () => {
    // The certificate gate (sendCertificate) rejects with failed-precondition if
    // these server constants disagree with the client, so a content edit that
    // adds/removes a module or a post-quiz item without updating functions/index.js
    // would tell a learner "Course complete" and then refuse the certificate.
    const config = initializerFor("COURSE_CONFIG");
    if (!ts.isObjectLiteralExpression(config)) throw new Error("COURSE_CONFIG is not an object literal");

    const subProperty = (courseId: string, prop: string): ts.Expression => {
      const entry = config.properties.find(
        (p) => ts.isPropertyAssignment(p) && ts.isStringLiteralLike(p.name) && p.name.text === courseId,
      );
      if (!entry || !ts.isPropertyAssignment(entry) || !ts.isObjectLiteralExpression(entry.initializer)) {
        throw new Error(`COURSE_CONFIG["${courseId}"] not found`);
      }
      for (const p of entry.initializer.properties) {
        if (
          ts.isPropertyAssignment(p) &&
          (ts.isIdentifier(p.name) || ts.isStringLiteralLike(p.name)) &&
          p.name.text === prop
        ) {
          return p.initializer;
        }
      }
      throw new Error(`COURSE_CONFIG["${courseId}"].${prop} missing`);
    };

    for (const course of courseRegistry) {
      expect(
        resolveNumber(subProperty(course.id, "moduleCount"), `${course.id}.moduleCount`),
        `${course.id} moduleCount vs client modules`,
      ).toBe(course.modules.length);
      expect(
        resolveNumber(subProperty(course.id, "quizTotal"), `${course.id}.quizTotal`),
        `${course.id} quizTotal vs client post-quiz`,
      ).toBe(getPostQuizQuestions(course).length);
    }
  });

  it("keeps the three-case milestone synchronized", () => {
    const initializer = initializerFor("REQUIRED_CORE_CASE_COUNT");
    expect(ts.isNumericLiteral(initializer)).toBe(true);
    expect(Number(initializer.getText(functionSource))).toBe(REQUIRED_CORE_CASE_COUNT);
  });

  it("keeps role-eligible core case ids synchronized with the course registry", () => {
    const byId = new Map(courseRegistry.map((course) => [course.id, course]));
    const expected: Record<string, string[]> = {
      FELLOW_REQUIRED_CASE_IDS: byId.get("knee-mri")!.coreCases.map((item) => item.id),
      RESIDENT_REQUIRED_CASE_IDS: byId.get("knee-mri")!.coreCases
        .filter((item) => item.residentVisible)
        .map((item) => item.id),
      SHOULDER_REQUIRED_CASE_IDS: byId.get("shoulder-mri")!.coreCases.map((item) => item.id),
      HIP_REQUIRED_CASE_IDS: byId.get("hip-mri")!.coreCases.map((item) => item.id),
      ELBOW_FELLOW_REQUIRED_CASE_IDS: byId.get("elbow-mri")!.coreCases.map((item) => item.id),
      ELBOW_RESIDENT_REQUIRED_CASE_IDS: byId.get("elbow-mri")!.coreCases
        .filter((item) => item.residentVisible)
        .map((item) => item.id),
    };

    for (const [constantName, ids] of Object.entries(expected)) {
      expect(serverStringArray(constantName).sort(), constantName).toEqual([...ids].sort());
    }
  });

  it("keeps workstation plane ids synchronized with the client", () => {
    for (const course of courseRegistry) {
      const serverIds = stringArray(
        objectProperty("NORMAL_PLANE_IDS_BY_COURSE", course.id),
        `NORMAL_PLANE_IDS_BY_COURSE.${course.id}`,
      );
      expect(serverIds, course.id).toEqual(normalPlaneIdsFor(course.bodyRegion));
    }
  });
});
