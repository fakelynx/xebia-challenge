import type { Locator } from "../types";

export const ChartsLocators = {
  chartList: {
    xpath: "//ul[@data-testid='chart-layout-main-column']",
    role: "list",
    accessibleNames: { ES: "Lista del ranking", EN: "Chart list" },
    dataTestId: "chart-layout-main-column",
    description: "Ordered chart list container",
  },
  chartItem: {
    xpath: "//li[@data-testid='listDetails']",
    role: "listitem",
    accessibleNames: { ES: "Elemento del ranking", EN: "Chart item" },
    dataTestId: "listDetails",
    description: "Individual chart item row",
  },
  titleLink: {
    xpath: "//a[@data-testid='ipc-lockup-overlay']",
    role: "link",
    accessibleNames: { ES: "Ver título", EN: "View title" },
    description: "Title anchor inside chart item",
  },
  titleListItemTitle: {
    xpath: "//a[@data-testid='titleListItemTitle']",
    role: "link",
    accessibleNames: { ES: "Título del ranking", EN: "Chart title" },
    dataTestId: "titleListItemTitle",
    description: "Clickable title link inside a chart item row",
  },
  sortControl: {
    xpath: "//div[@data-testid='sort-by']",
    role: "combobox",
    accessibleNames: { ES: "Ordenar por", EN: "Sort by" },
    dataTestId: "sort-by",
    description: "Sort dropdown trigger",
  },
  sortOption: {
    xpath: "//li[@role='option']",
    role: "option",
    accessibleNames: { ES: "Opción de orden", EN: "Sort option" },
    description: "Individual sort dropdown option",
  },
} satisfies Record<string, Locator>;

export type ChartsLocatorMap = typeof ChartsLocators;
