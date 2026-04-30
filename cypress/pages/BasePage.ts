/**
 * All Page Object classes extend BasePage.
 * POM classes should expose chainable methods but must NOT contain assertions —
 * keep assertions in the spec file.
 *
 * Usage:
 *   export class LoginPage extends BasePage {
 *     readonly url = "/login";
 *     get usernameInput() { return this.getByTestId("username-input"); }
 *   }
 */
export abstract class BasePage {
  abstract readonly url: string;

  visit(queryString = ""): this {
    cy.visit(`${this.url}${queryString}`);
    return this;
  }

  /** Preferred selector strategy — avoids coupling tests to CSS classes or DOM structure. */
  getByTestId(testId: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`[data-testid="${testId}"]`);
  }

  /** Fallback selector when data-testid attributes are not available. */
  getByLabel(labelText: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy
      .contains("label", labelText)
      .invoke("attr", "for")
      .then((id) => cy.get(`#${id}`));
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
