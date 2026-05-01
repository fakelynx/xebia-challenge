import { BaseComponent } from "./BaseComponent";
import type { GNavLocatorMap } from "../locators/gnav.registry";

export class GNav extends BaseComponent<GNavLocatorMap> {
  readonly url = "";

  openHamburgerMenu(): this {
    this.locate("hamburgerButton").click();
    this.locate("navDrawer").should("be.visible");
    return this;
  }

  getHamburgerMenuItem(name: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.locate("navDrawer").contains("a", name) as unknown as Cypress.Chainable<JQuery<HTMLElement>>;
  }

  search(query: string): this {
    this.locate("searchInput").click().clear().type(query);
    this.locate("searchSubmitButton").click();
    return this;
  }
}
