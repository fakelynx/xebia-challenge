import { BasePage } from "./BasePage";
import type { TitleLocatorMap } from "../locators/title.registry";

export class TitlePage extends BasePage<TitleLocatorMap> {
  readonly url = "/title/";
  readonly pageTitle = "";

  navigateToSection(sectionName: string): this {
    this.locate("sectionNavigation").contains("a", sectionName).click();
    return this;
  }

  navigateToPhotos(): this {
    this.locate("photosLink").click();
    cy.url().should("include", "mediaindex");
    return this;
  }
}
