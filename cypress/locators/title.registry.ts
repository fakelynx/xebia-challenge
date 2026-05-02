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
    xpath: "//div[@data-testid='photos-title']//a[contains(@class,'ipc-title-link-wrapper')]",
    role: "link",
    cssSelector: "[data-testid='photos-title'] a.ipc-title-link-wrapper",
    description: "Photos section title link",
  },
  pageHeading: {
    xpath: "//h1[@data-testid='hero-title-block__title']",
    role: "heading",
    accessibleNames: { ES: "Título", EN: "Title" },
    dataTestId: "hero-title-block__title",
    cssSelector: "h1[data-testid='hero-title-block__title']",
    description: "Main title h1",
  },
  ratingButton: {
    xpath: "//div[@data-testid='hero-rating-bar__user-rating']//button",
    role: "button",
    cssSelector: "div[data-testid='hero-rating-bar__user-rating'] button",
    description: "Rate button that opens the star rating widget",
  },
  ratingStarButton: {
    xpath: "//button[contains(@class,'ipc-starbar__rating__button')]",
    role: "button",
    cssSelector: "button.ipc-starbar__rating__button",
    description: "Individual star button — use locateOverriding({ ariaLabel: 'Rate N' }) (1–10)",
  },
} satisfies Record<string, Locator>;

export type TitleLocatorMap = typeof TitleLocators;
