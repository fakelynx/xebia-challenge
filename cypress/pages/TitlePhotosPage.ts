import { BasePage } from "./BasePage";
import type { TitlePhotosLocatorMap } from "../locators/title-photos.registry";

export class TitlePhotosPage extends BasePage<TitlePhotosLocatorMap> {
  readonly url = "/mediaindex";
  readonly pageTitle = "Photos";

  clickFilterButton(): this {
    this.locate("filterButton").click();
    return this;
  }

  selectFilterOption(optionName: string): this {
    this.locate("chipList").then(($chips) => {
      const $match = $chips.filter((_i, el) =>
        Cypress.$(el).text().trim().startsWith(optionName)
      );
      if ($match.length > 0) {
        cy.wrap($match.first()).click();
      } else {
        this.locate("filterDropdownSelect")
          .find("option")
          .filter((_i, el) => (el.textContent?.trim() ?? "").startsWith(optionName))
          .then(($opt) => {
            this.locate("filterDropdownSelect").select($opt.first().val() as string);
          });
      }
    });
    return this;
  }

  clickPhotoByPosition(position: number): this {
    this.locate("photoLink").eq(position - 1).click();
    cy.url().should("include", "/mediaviewer/");
    return this;
  }
}
