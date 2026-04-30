import { defineConfig } from "cypress";

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
  },
});
