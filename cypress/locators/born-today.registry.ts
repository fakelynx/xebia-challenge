import type { Locator } from "../types";

export const BornTodayLocators = {
  filterChipList: {
    xpath: "//div[@class='ipc-chip-list__scroller']",
    role: "list",
    cssSelector: "div.ipc-chip-list__scroller",
    description: "Chip scroller containing active filter chips",
  },
  birthDateStartInput: {
    xpath: "//input[@data-testid='birthDate-start']",
    role: "textbox",
    accessibleNames: { ES: "Introduce la fecha de nacimiento desde", EN: "Enter birth from date" },
    dataTestId: "birthDate-start",
    cssSelector: "input[data-testid='birthDate-start']",
    description: "Birth date range — start input",
  },
  birthDateEndInput: {
    xpath: "//input[@data-testid='birthDate-end']",
    role: "textbox",
    accessibleNames: { ES: "Introduce la fecha de nacimiento hasta", EN: "Enter birth to date" },
    dataTestId: "birthDate-end",
    cssSelector: "input[data-testid='birthDate-end']",
    description: "Birth date range — end input",
  },
  birthDateAccordion: {
    xpath: "//label[@data-testid='accordion-item-birthDateAccordion']",
    role: "button",
    accessibleNames: { ES: "Expand Fecha de nacimiento", EN: "Expand Birth date" },
    dataTestId: "accordion-item-birthDateAccordion",
    cssSelector: "[data-testid='accordion-item-birthDateAccordion']",
    description: "Birth date filter accordion toggle",
  },
  applyButton: {
    xpath: "//button[@data-testid='born-today-apply']",
    role: "button",
    accessibleNames: { ES: "Aplicar", EN: "Apply" },
    textContent: { ES: "Aplicar", EN: "Apply" },
    dataTestId: "born-today-apply",
    cssSelector: "button[data-testid='born-today-apply']",
    description: "Apply date filter button",
  },
  celebrityList: {
    xpath: "//li[contains(@class,'ipc-metadata-list-summary-item')]",
    role: "listitem",
    cssSelector: "li.ipc-metadata-list-summary-item",
    description: "Individual celebrity result item",
  },
} satisfies Record<string, Locator>;

export type BornTodayLocatorMap = typeof BornTodayLocators;
