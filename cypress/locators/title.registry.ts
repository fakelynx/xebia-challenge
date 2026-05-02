import type { Locator } from "../types";

export const TitleLocators = {
  sectionNavigation: {
    xpath: "//nav[@data-testid='TitlePage-navigation']",
    role: "navigation",
    accessibleNames: { ES: "Navegación de secciones", EN: "Section navigation" },
    dataTestId: "TitlePage-navigation",
    cssSelector: "nav[data-testid='TitlePage-navigation']",
    description: "Section tab navigation bar",
  },
  photosLink: {
    xpath: "//a[@data-testid='hero-title-block__media-index']",
    role: "link",
    accessibleNames: { ES: "Fotos", EN: "Photos" },
    textContent: { ES: "Fotos", EN: "Photos" },
    dataTestId: "hero-title-block__media-index",
    cssSelector: "a[data-testid='hero-title-block__media-index']",
    description: "Photos section link",
  },
  pageHeading: {
    xpath: "//h1[@data-testid='hero-title-block__title']",
    role: "heading",
    accessibleNames: { ES: "Título", EN: "Title" },
    dataTestId: "hero-title-block__title",
    cssSelector: "h1[data-testid='hero-title-block__title']",
    description: "Main title h1",
  },
  ratingStarButton: {
    xpath: "//div[@data-testid='rating-selector']//button",
    role: "button",
    cssSelector: "div[data-testid='rating-selector'] button",
    description: "Individual star button in rating widget — use locateOverriding with { xpathIndex: n } (1-based) or { cssIndex: n } (0-based)",
  },
} satisfies Record<string, Locator>;

export type TitleLocatorMap = typeof TitleLocators;
