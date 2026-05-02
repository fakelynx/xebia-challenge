import { BasePage } from "./BasePage";
import type { BornTodayLocatorMap } from "../locators/born-today.registry";

export class BornTodayPage extends BasePage<BornTodayLocatorMap> {
  readonly url = "/feature/bornondate/";
  readonly pageTitle = "Born Today";

  removeFilterChips(): this {
    this.locate("filterChipList").find("button").each(($btn) => {
      cy.wrap($btn).click();
    });
    return this;
  }

  enterDateRange(fromDate: string, toDate: string): this {
    this.locate("birthDateStartInput").clear().type(fromDate);
    this.locate("birthDateEndInput").clear().type(toDate);
    return this;
  }

  enterRelativeDate(options: { years?: number; months?: number; days?: number }): this {
    const d = new Date();
    if (options.years) d.setFullYear(d.getFullYear() - options.years);
    if (options.months) d.setMonth(d.getMonth() - options.months);
    if (options.days) d.setDate(d.getDate() - options.days);
    const pad = (n: number) => String(n).padStart(2, "0");
    const formatted = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    return this.enterDateRange(formatted, formatted);
  }

  unfoldAccordion(key: keyof BornTodayLocatorMap & string): this {
    this.locate(key).click();
    return this;
  }

  clickCelebrityByPosition(
    position: number,
    options?: { soft?: boolean; onSuccess?: () => void }
  ): this {
    if (options?.soft) {
      this.locate("celebrityList").then(($items) => {
        if ($items.length >= position) {
          cy.wrap($items.eq(position - 1)).find('[data-testid="nlib-img-container"]').click();
          cy.url().should("include", "/name/");
          options.onSuccess?.();
        }
      });
    } else {
      this.locate("celebrityList").eq(position - 1).find('[data-testid="nlib-img-container"]').click();
      cy.url().should("include", "/name/");
    }
    return this;
  }
}
