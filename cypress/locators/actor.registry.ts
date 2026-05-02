import type { Locator } from "../types";

export const ActorLocators = {
  filmographySection: {
    xpath: "//div[@data-testid='nm-flmg-sections']",
    role: "region",
    accessibleNames: { ES: "Filmografía", EN: "Filmography" },
    dataTestId: "nm-flmg-sections",
    cssSelector: "div[data-testid='nm-flmg-sections']",
    description: "Filmography accordion container",
  },
  accordionToggle: {
    xpath: "//button[@data-testid='nm-flmg-accordion-header-button']",
    role: "button",
    accessibleNames: { ES: "Ver sección", EN: "View section" },
    textContent: { ES: "Ver sección", EN: "View section" },
    dataTestId: "nm-flmg-accordion-header-button",
    cssSelector: "button[data-testid='nm-flmg-accordion-header-button']",
    description: "Generic accordion section toggle",
  },
  accordionContent: {
    xpath: "//div[@data-testid='nm-flmg-accordion-item']",
    role: "region",
    accessibleNames: { ES: "Contenido del acordeón", EN: "Accordion content" },
    dataTestId: "nm-flmg-accordion-item",
    cssSelector: "div[data-testid='nm-flmg-accordion-item']",
    description: "Expanded accordion content panel",
  },
} satisfies Record<string, Locator>;

export type ActorLocatorMap = typeof ActorLocators;
