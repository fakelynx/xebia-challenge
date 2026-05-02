import type { Locator } from "../types";

export const TitlePhotosLocators = {
  filterButton: {
    xpath: "//button[@data-testid='image-chip-dropdown-test-id']",
    role: "button",
    accessibleNames: { ES: "Abrir aviso de filtro", EN: "Open filter prompt" },
    dataTestId: "image-chip-dropdown-test-id",
    cssSelector: "button[data-testid='image-chip-dropdown-test-id']",
    description: "Opens the filter chip dropdown",
  },
  chipList: {
    xpath: "//button[starts-with(@data-testid,'filter-menu-chip')]",
    role: "button",
    cssSelector: "button[data-testid^='filter-menu-chip']",
    description: "Selectable filter chip buttons (data-testid prefix: filter-menu-chip)",
  },
  filterDropdownSelect: {
    xpath: "//select[@data-testid='select-dropdown-test-id']",
    role: "combobox",
    dataTestId: "select-dropdown-test-id",
    cssSelector: "select[data-testid='select-dropdown-test-id']",
    description: "Fallback select dropdown for filter options",
  },
  photoLink: {
    xpath: "//a[starts-with(@data-testid,'mosaic-img')]",
    role: "link",
    cssSelector: "a[data-testid^='mosaic-img']",
    description: "Photo grid link (data-testid prefix: mosaic-img)",
  },
} satisfies Record<string, Locator>;

export type TitlePhotosLocatorMap = typeof TitlePhotosLocators;
