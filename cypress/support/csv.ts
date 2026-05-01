import type { Locator, TestData } from "../types";

export function parseLocators<T extends Record<string, Locator>>(name: string): Cypress.Chainable<T> {
  return cy.task<T>("parseLocators", name);
}

export function parseData(name: string): Cypress.Chainable<TestData> {
  return cy.task<TestData>("parseData", name);
}
