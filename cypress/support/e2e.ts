import "./commands";
import "@testing-library/cypress/add-commands";

Cypress.on("window:before:load", (win) => {
  Object.defineProperty(win.navigator, "webdriver", { get: () => undefined });
});
