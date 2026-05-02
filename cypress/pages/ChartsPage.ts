import { BasePage } from "./BasePage";
import type { ChartsLocatorMap } from "../locators/charts.registry";

export abstract class ChartsPage extends BasePage<ChartsLocatorMap> {
  clickTitleByName(name: string): this {
    this.locate("chartList").contains("a", name).click();
    return this;
  }

  // 1-indexed position. Negative values count from the end (e.g. -1 = last, -3 = 3rd from last).
  clickTitleByPosition(position: number): this {
    const index = position > 0 ? position - 1 : position;
    const testId = this.locators.titleListItemTitle.dataTestId!;
    this.locate("chartList").find(`[data-testid="${testId}"]`).eq(index).click();
    return this;
  }

  sortBy(optionLabel: string): this {
    this.locate("sortControl").click();
    this.locateOverriding("sortOption", { textContent: optionLabel }).click();
    return this;
  }
}
