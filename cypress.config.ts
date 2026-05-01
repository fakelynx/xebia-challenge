import { defineConfig } from "cypress";
import * as fs from "fs";
import * as path from "path";

function parseCsvRows(content: string): Record<string, string>[] {
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  });
}

function buildLocatorMap(rows: Record<string, string>[]) {
  const map: Record<string, Record<string, unknown>> = {};

  for (const row of rows) {
    map[row.name] = {
      xpath: row.xpath,
      role: row.role,
      accessibleNames: { ES: row.accessibleNameES, EN: row.accessibleNameEN },
      ...(row["data-test-id"] ? { dataTestId: row["data-test-id"] } : {}),
      ...(row.description ? { description: row.description } : {}),
      ...(row.shadowDom === "true" ? { shadowDom: true } : {}),
    };
  }

  for (const row of rows) {
    if (row.iframe && map[row.iframe]) {
      map[row.name].iframe = map[row.iframe];
    }
  }

  return map;
}

function buildDataMap(rows: Record<string, string>[]): Record<string, string> {
  return Object.fromEntries(rows.map((row) => [row.name, row.value]));
}

export default defineConfig({
  e2e: {
    // Replace with the real application URL before running tests
    baseUrl: "https://your-app-url.example.com",
    specPattern: ["cypress/e2e/**/*.cy.ts", "cypress/api/**/*.cy.ts"],
    supportFile: "cypress/support/e2e.ts",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on) {
      on("task", {
        parseLocators(name: string) {
          const file = path.join(__dirname, "cypress", "locators", `${name}.csv`);
          return buildLocatorMap(parseCsvRows(fs.readFileSync(file, "utf8")));
        },
        parseData(name: string) {
          const file = path.join(__dirname, "cypress", "data", `${name}.csv`);
          return buildDataMap(parseCsvRows(fs.readFileSync(file, "utf8")));
        },
      });
    },
  },
});
