import { BaseComponent } from "./BaseComponent";
import type { GNavLocatorMap } from "../locators/gnav.registry";

export class GNav extends BaseComponent<GNavLocatorMap> {
  readonly url = "";

  openHamburgerMenu(): this {
    this.locate("hamburgerButton").click();
    this.locate("navDrawer").should("be.visible");
    return this;
  }

  clickHamburgerMenuItem(key: keyof GNavLocatorMap & string): this {
    this.locate(key).click();
    return this;
  }

  search(query: string): this {
    this.locate("searchInput").click().clear().type(query);
    this.locate("searchResult").click();
    return this;
  }
}
