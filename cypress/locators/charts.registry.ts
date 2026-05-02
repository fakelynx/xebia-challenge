import type { Locator } from "../types";

export const ChartsLocators = {
  chartList: {
    xpath: "//li[contains(@class,'ipc-metadata-list-summary-item')]",
    role: "listitem",
    cssSelector: "li.ipc-metadata-list-summary-item",
    description: "Individual chart list item",
  },
} satisfies Record<string, Locator>;

export type ChartsLocatorMap = typeof ChartsLocators;
