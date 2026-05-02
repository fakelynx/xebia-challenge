import type { Locator } from "../types";

export const GNavLocators = {
  hamburgerButton: {
    xpath: "//label[@id='imdbHeader-navDrawerOpen']",
    role: "button",
    cssSelector: "label#imdbHeader-navDrawerOpen",
    description: "Hamburger menu toggle label",
  },
  navDrawer: {
    xpath: "//div[contains(@class,'drawer__panel') and @aria-hidden='false']",
    role: "navigation",
    cssSelector: ".drawer__panel[aria-hidden='false']",
    description: "Open sliding navigation drawer panel",
  },
  movieCharts: {
    xpath: "//a[@role='menuitem'][contains(@href,'/chart/top/')]",
    role: "menuitem",
    accessibleNames: { ES: "Ir a Las 250 mejores películas", EN: "Go to Top 250 movies" },
    cssSelector: "a[role='menuitem'][href*='/chart/top/']",
    description: "Top 250 Movies nav link",
  },
  tvCharts: {
    xpath: "//a[@role='menuitem'][contains(@href,'/chart/toptv')]",
    role: "menuitem",
    accessibleNames: { ES: "Ir a Las 250 mejores series", EN: "Go to Top 250 TV shows" },
    cssSelector: "a[role='menuitem'][href*='/chart/toptv']",
    description: "Top 250 TV Shows nav link",
  },
  bornTodayList: {
    xpath: "//a[@role='menuitem'][contains(@href,'/feature/bornondate/')]",
    role: "menuitem",
    accessibleNames: { ES: "Ir a Personas nacidas hoy", EN: "Go to Born today" },
    cssSelector: "a[role='menuitem'][href*='/feature/bornondate/']",
    description: "Born Today nav link",
  },
  searchInput: {
    xpath: "//input[@data-testid='suggestion-search']",
    role: "textbox",
    accessibleNames: { ES: "Buscar en IMDb", EN: "Search IMDb" },
    dataTestId: "suggestion-search",
    cssSelector: "input[data-testid='suggestion-search']",
    description: "Search bar input",
  },
  searchResult: {
    xpath: "//li[contains(@class,'react-autosuggest__suggestion--first')]",
    role: "option",
    cssSelector: "li.react-autosuggest__suggestion--first",
    description: "First autocomplete suggestion item",
  },
} satisfies Record<string, Locator>;

export type GNavLocatorMap = typeof GNavLocators;
