import type { Locator } from "../types";

export const GNavLocators = {
  hamburgerButton: {
    xpath: "//button[@aria-label='Open Navigation Drawer']",
    role: "button",
    accessibleNames: { ES: "Abrir menú de navegación", EN: "Open Navigation Drawer" },
    textContent: { ES: "Abrir menú de navegación", EN: "Open Navigation Drawer" },
    description: "Hamburger menu toggle",
  },
  searchInput: {
    xpath: "//input[@id='suggestion-search']",
    role: "textbox",
    accessibleNames: { ES: "Buscar en IMDb", EN: "Search IMDb" },
    description: "Search bar input",
  },
  searchSubmitButton: {
    xpath: "//button[@type='submit']",
    role: "button",
    accessibleNames: { ES: "Buscar", EN: "Search" },
    textContent: { ES: "Buscar", EN: "Search" },
    description: "Search submit button",
  },
  navDrawer: {
    xpath: "//div[@data-testid='imdb-nav-drawer']",
    role: "navigation",
    accessibleNames: { ES: "Cajón de navegación", EN: "Navigation drawer" },
    dataTestId: "imdb-nav-drawer",
    description: "Sliding navigation drawer",
  },
} satisfies Record<string, Locator>;

export type GNavLocatorMap = typeof GNavLocators;
