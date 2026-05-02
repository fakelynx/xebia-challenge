import { BasePage } from "./BasePage";
import type { ChartsLocatorMap } from "../locators/charts.registry";

export abstract class ChartsPage extends BasePage<ChartsLocatorMap> {
  clickTitleByName(name: string): this {
    this.locate("chartList")
      .filter(`:has(h3:contains("${name}"))`)
      .first()
      .find("a")
      .first()
      .click();
    return this;
  }

  clickTitleByPosition(position: number): this {
    this.locate("chartList").eq(position - 1).find("a").first().click();
    return this;
  }
}
