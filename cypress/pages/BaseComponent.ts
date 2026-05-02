import type { Locator, Language } from "../types";

const DEFAULT_LANGUAGE: Language = "EN";
const STRATEGY1_TIMEOUT = 1000;
const POLL_INTERVAL = 50;

export interface LocateOverrides {
  ariaLabel?: string;
  textContent?: string;
  xpathIndex?: number; // 1-based; maps to cssSelector:eq(n-1)
  cssIndex?: number;   // 0-based; maps to cssSelector:eq(n)
  alias?: string;
}

export abstract class BaseComponent<T extends Record<string, Locator>> {
  protected language: Language = DEFAULT_LANGUAGE;

  constructor(protected readonly locators: T) {}

  setLanguage(lang: Language): this {
    this.language = lang;
    return this;
  }

  locate(key: keyof T & string): Cypress.Chainable<JQuery<HTMLElement>> {
    const locator = this.locators[key];
    if (locator.iframe) {
      return this.pierceIframe(locator.iframe).within(() =>
        this.locateInner(key, { ...locator, iframe: undefined })
      ) as Cypress.Chainable<JQuery<HTMLElement>>;
    }
    return this.locateInner(key, locator);
  }

  locateOverriding(
    key: keyof T & string,
    overrides: LocateOverrides
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    const locator = this.locators[key];
    let overridden: Locator;

    if (overrides.xpathIndex !== undefined) {
      overridden = {
        ...locator,
        cssSelector: `${locator.cssSelector}:eq(${overrides.xpathIndex - 1})`,
        accessibleNames: undefined,
        textContent: undefined,
        dataTestId: undefined,
      };
    } else if (overrides.cssIndex !== undefined) {
      overridden = {
        ...locator,
        cssSelector: `${locator.cssSelector}:eq(${overrides.cssIndex})`,
        accessibleNames: undefined,
        textContent: undefined,
        dataTestId: undefined,
      };
    } else {
      overridden = {
        ...locator,
        ...(overrides.ariaLabel !== undefined && {
          accessibleNames: { ES: overrides.ariaLabel, EN: overrides.ariaLabel },
        }),
        ...(overrides.textContent !== undefined && {
          textContent: { ES: overrides.textContent, EN: overrides.textContent },
        }),
      };
    }

    const chain = this.locateInner(key, overridden);
    return overrides.alias ? chain.as(overrides.alias) : chain;
  }

  private locateInner(key: string, locator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
    const ariaLabel = locator.accessibleNames?.[this.language];
    const text = locator.textContent?.[this.language];
    const hasTestingLib = !!(ariaLabel || text);
    const hasTestId = !!locator.dataTestId;

    // Strategy 1 + fallback to strategy 2
    if (hasTestId && hasTestingLib) {
      return this.tryTestIdThenTestingLib(key, locator, ariaLabel, text);
    }

    // Strategy 1 only — data-testid with full Cypress retry
    if (hasTestId) {
      return cy
        .get(`[data-testid="${locator.dataTestId}"]`, { log: false })
        .then(($el) => {
          Cypress.log({
            name: "locate",
            message: `${key} — data-testid (${$el.length})`,
            consoleProps: () => ({ key, strategy: "data-testid", count: $el.length }),
          });
          return $el;
        }) as Cypress.Chainable<JQuery<HTMLElement>>;
    }

    // Strategy 2 only — testing-library with full Cypress retry
    if (hasTestingLib) {
      return this.runTestingLib(key, locator, ariaLabel, text);
    }

    // CSS-only fallback — cy.get with full Cypress retry
    return cy
      .get(locator.cssSelector, { log: false })
      .then(($el) => {
        Cypress.log({
          name: "locate",
          message: `${key} — css (${$el.length})`,
          consoleProps: () => ({ key, strategy: "css", count: $el.length }),
        });
        return $el;
      }) as Cypress.Chainable<JQuery<HTMLElement>>;
  }

  // Polls for the data-testid selector for STRATEGY1_TIMEOUT ms.
  // If found → returns element; if timeout → falls back to testing-library.
  private tryTestIdThenTestingLib(
    key: string,
    locator: Locator,
    ariaLabel: string | undefined,
    text: string | undefined
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    const testIdSelector = `[data-testid="${locator.dataTestId}"]`;

    const poll = new Cypress.Promise<JQuery<HTMLElement> | null>((resolve) => {
      const start = Date.now();
      const check = () => {
        const $el = Cypress.$(testIdSelector);
        if ($el.length > 0) return resolve($el);
        if (Date.now() - start >= STRATEGY1_TIMEOUT) return resolve(null);
        setTimeout(check, POLL_INTERVAL);
      };
      check();
    });

    return cy
      .wrap(poll, { log: false })
      .then(($elOrNull) => {
        const $el = $elOrNull as JQuery<HTMLElement> | null;
        if ($el) {
          Cypress.log({
            name: "locate",
            message: `${key} — data-testid (${$el.length})`,
            consoleProps: () => ({ key, strategy: "data-testid", count: $el.length }),
          });
          return cy.wrap($el, { log: false });
        }
        return this.runTestingLib(key, locator, ariaLabel, text);
      }) as Cypress.Chainable<JQuery<HTMLElement>>;
  }

  // Delegates to @testing-library/cypress commands, which retry natively.
  private runTestingLib(
    key: string,
    locator: Locator,
    ariaLabel: string | undefined,
    text: string | undefined
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    if (ariaLabel) {
      return cy
        .findByRole(locator.role as Parameters<typeof cy.findByRole>[0], { name: ariaLabel })
        .then(($el) => {
          Cypress.log({
            name: "locate",
            message: `${key} — testing-library/role+name (${$el.length})`,
            consoleProps: () => ({ key, strategy: "testing-library/role+name", count: $el.length }),
          });
          return $el;
        }) as Cypress.Chainable<JQuery<HTMLElement>>;
    }

    return cy
      .findByText(text!)
      .then(($el) => {
        Cypress.log({
          name: "locate",
          message: `${key} — testing-library/text (${$el.length})`,
          consoleProps: () => ({ key, strategy: "testing-library/text", count: $el.length }),
        });
        return $el;
      }) as Cypress.Chainable<JQuery<HTMLElement>>;
  }

  // Locates the iframe element, then scopes to its body for .within() usage.
  private pierceIframe(iframeLocator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.locateInner("iframe", iframeLocator)
      .its("0.contentDocument.body")
      .should("not.be.empty")
      .then(cy.wrap) as Cypress.Chainable<JQuery<HTMLElement>>;
  }
}
