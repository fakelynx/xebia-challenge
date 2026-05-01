import type { TestData } from "../types";

export function parseData(name: string): Cypress.Chainable<TestData> {
  return cy.task<TestData>("parseData", name);
}
