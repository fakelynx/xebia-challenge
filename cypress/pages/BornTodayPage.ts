import { BasePage } from "./BasePage";
import type { BornTodayLocatorMap } from "../locators/born-today.registry";

export class BornTodayPage extends BasePage<BornTodayLocatorMap> {
  readonly url = "/feature/bornondate/";
  readonly pageTitle = "Born Today";

  removeFilterChip(chipLabel?: string): this {
    const removeLocator = this.locators.filterChipRemove;
    const removeName = removeLocator.accessibleNames?.[this.language] ?? "";
    const chip = chipLabel
      ? this.locateOverriding("filterChip", { textContent: chipLabel })
      : this.locate("filterChip").first();
    chip.contains(`[role="${removeLocator.role}"]`, removeName).click();
    return this;
  }

  // Accepts dates in dd/mm/yyyy format.
  enterDateRange(fromDate: string, toDate: string): this {
    const [fd, fm, fy] = fromDate.split("/");
    const [td, tm, ty] = toDate.split("/");
    this.locate("fromDayInput").clear().type(fd);
    this.locate("fromMonthInput").clear().type(fm);
    this.locate("fromYearInput").clear().type(fy);
    this.locate("toDayInput").clear().type(td);
    this.locate("toMonthInput").clear().type(tm);
    this.locate("toYearInput").clear().type(ty);
    return this;
  }

  removeFilterChips(): this {
    this.locate("filterChipRemove").click();
    return this;
  }

  unfoldAccordion(label: string): this {
    this.locateOverriding("accordionToggle", { textContent: label }).click();
    return this;
  }

  // Calculates a past date offset from today and enters it in both from and to fields.
  enterRelativeDate(options: { years?: number; months?: number; days?: number }): this {
    const d = new Date();
    if (options.years) d.setFullYear(d.getFullYear() - options.years);
    if (options.months) d.setMonth(d.getMonth() - options.months);
    if (options.days) d.setDate(d.getDate() - options.days);
    const pad = (n: number) => String(n).padStart(2, "0");
    const formatted = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    return this.enterDateRange(formatted, formatted);
  }

  // 1-indexed; asserts navigation to a /name/ page after click.
  // Pass { soft: true } to skip rather than fail if fewer results are available.
  clickCelebrityByPosition(
    position: number,
    options?: { soft?: boolean; onSuccess?: () => void }
  ): this {
    if (options?.soft) {
      this.locate("celebrityList").then(($list) => {
        const links = $list.find("a[href*='/name/']");
        if (links.length >= position) {
          cy.wrap(links.eq(position - 1)).click();
          cy.url().should("include", "/name/");
          options.onSuccess?.();
        }
      });
    } else {
      this.locate("celebrityList").find("a[href*='/name/']").eq(position - 1).click();
      cy.url().should("include", "/name/");
    }
    return this;
  }
}
