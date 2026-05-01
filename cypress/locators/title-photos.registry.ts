import type { Locator } from "../types";

export const TitlePhotosLocators = {
  filterButton: {
    xpath: "//button[@data-testid='media-index-filter-toggle']",
    role: "button",
    accessibleNames: { ES: "Filtrar", EN: "Filter" },
    textContent: { ES: "Filtrar", EN: "Filter" },
    dataTestId: "media-index-filter-toggle",
    description: "Opens the filter panel",
  },
  chipScroller: {
    xpath: "//div[@data-testid='media-index-filter-chip-list']",
    role: "list",
    accessibleNames: { ES: "Lista de filtros", EN: "Filter chip list" },
    dataTestId: "media-index-filter-chip-list",
    description: "Horizontal chip scroller for filter options",
  },
  filterDropdown: {
    xpath: "//ul[@data-testid='media-index-filter-dropdown']",
    role: "listbox",
    accessibleNames: { ES: "Menú de filtros", EN: "Filter dropdown" },
    dataTestId: "media-index-filter-dropdown",
    description: "Dropdown fallback for filter options",
  },
  photoGrid: {
    xpath: "//div[@data-testid='media-index-grid']",
    role: "grid",
    accessibleNames: { ES: "Galería de fotos", EN: "Photo gallery" },
    dataTestId: "media-index-grid",
    description: "Photo grid container",
  },
} satisfies Record<string, Locator>;

export type TitlePhotosLocatorMap = typeof TitlePhotosLocators;
