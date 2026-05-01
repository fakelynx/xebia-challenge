import { BasePage } from "./BasePage";
import type { TitlePhotosLocatorMap } from "../locators/title-photos.registry";

export class TitlePhotosPage extends BasePage<TitlePhotosLocatorMap> {
  readonly url = "/mediaindex";
  readonly pageTitle = "Photos";

  clickFilterButton(): this {
    this.locate("filterButton").click();
    return this;
  }

  // Checks chip scroller first; falls back to dropdown option if not found there.
  selectFilterOption(optionName: string): this {
    this.locate("chipScroller").then(($scroller) => {
      const inScroller = $scroller.find(`:contains("${optionName}")`).length > 0;
      if (inScroller) {
        cy.wrap($scroller).contains(optionName).click();
      } else {
        this.locate("filterDropdown").contains(optionName).click();
      }
    });
    return this;
  }

  // 1-indexed position; asserts navigation to mediaviewer after click.
  clickPhotoByPosition(position: number): this {
    this.locate("photoGrid").find("img").eq(position - 1).click();
    cy.url().should("include", "/mediaviewer/");
    return this;
  }
}
