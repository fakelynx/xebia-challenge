import { BasePage } from "./BasePage";
import type { ActorLocatorMap } from "../locators/actor.registry";

export class ActorPage extends BasePage<ActorLocatorMap> {
  readonly url = "/name/";
  readonly pageTitle = "";

  clickAccordionItem(sectionName: string): this {
    this.locateOverriding("accordionToggle", { ariaLabel: sectionName }).as("toggle").click();
    cy.get("@toggle").should("have.attr", "aria-expanded", "true");
    return this;
  }

  clickAccordion(key: keyof ActorLocatorMap & string): this {
    this.locate(key).click();
    return this;
  }

  clickNthTaggedItem(key: keyof ActorLocatorMap & string, tag: string, nth: number): this {
    this.locate(key)
      .filter(`:contains("${tag}")`)
      .eq(nth - 1)
      .find("a")
      .click();
    return this;
  }

  clickAccordionElement(linkText: string): this {
    const testId = this.locators.accordionContent.dataTestId!;
    cy.get('[aria-expanded="true"]')
      .closest(`[data-testid="${testId}"]`)
      .contains("a", linkText)
      .click();
    cy.url().should("not.include", "/name/");
    return this;
  }
}
