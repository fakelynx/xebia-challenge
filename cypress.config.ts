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

function buildDataMap(rows: Record<string, string>[]): Record<string, string> {
  return Object.fromEntries(rows.map((row) => [row.name, row.value]));
}

export default defineConfig({
  e2e: {
    baseUrl: "https://www.imdb.com",
    specPattern: ["cypress/e2e/**/*.cy.ts", "cypress/api/**/*.cy.ts"],
    supportFile: "cypress/support/e2e.ts",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    experimentalModifyObstructiveThirdPartyCode: true,
    setupNodeEvents(on) {
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "chromium") {
          launchOptions.args = (launchOptions.args as string[]).filter(
            (arg) => arg !== "--enable-automation"
          );
          launchOptions.args.push("--disable-blink-features=AutomationControlled");
        }
        return launchOptions;
      });
      on("task", {
        parseData(name: string) {
          const file = path.join(__dirname, "cypress", "data", `${name}.csv`);
          return buildDataMap(parseCsvRows(fs.readFileSync(file, "utf8")));
        },
      });
    },
  },
});
