import type { Locator } from "../types";
import { BaseComponent } from "./BaseComponent";

export abstract class BasePage<T extends Record<string, Locator>> extends BaseComponent<T> {
  abstract readonly url: string;
  abstract readonly pageTitle: string;

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
    cy.get("h1").first().should("contain.text", this.pageTitle);
    return this;
  }
}
