import type { Locator, Language } from "../types";

const DEFAULT_LANGUAGE: Language = "EN";

export abstract class BasePage<T extends Record<string, Locator>> {
  protected language: Language = DEFAULT_LANGUAGE;

  constructor(protected readonly locators: T) {}

  abstract readonly url: string;

  setLanguage(lang: Language): this {
    this.language = lang;
    return this;
  }

  locate(key: keyof T & string): Cypress.Chainable<JQuery<HTMLElement>> {
    const locator = this.locators[key];
    const opts = locator.shadowDom ? { includeShadowDom: true } : {};

    if (locator.dataTestId) {
      return cy.get(`[data-testid="${locator.dataTestId}"]`, opts);
    }

    const name = locator.accessibleNames[this.language];
    return cy.contains(`[role="${locator.role}"]`, name, opts);
  }

  visit(queryString = ""): this {
    cy.visit(`${this.url}${queryString}`);
    return this;
  }

  waitForPageLoad(): this {
    cy.document().its("readyState").should("eq", "complete");
    return this;
  }

  assertOnPage(): this {
    cy.url().should("include", this.url);
    return this;
  }
}
