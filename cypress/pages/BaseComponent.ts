import type { Locator, Language } from "../types";

const DEFAULT_LANGUAGE: Language = "EN";

interface StrategyResult {
  $els: JQuery<HTMLElement>;
  strategy: string;
}

// ES2020-compatible Promise.any: resolves with first settled value, rejects if all reject.
function promiseAny<T>(promises: Promise<T>[]): Promise<T> {
  if (promises.length === 0) return Promise.reject(new Error("No strategies provided"));
  return new Promise<T>((resolve, reject) => {
    const errors: unknown[] = [];
    for (const p of promises) {
      p.then(resolve).catch((err) => {
        errors.push(err);
        if (errors.length === promises.length) reject(new Error("All strategies failed"));
      });
    }
  });
}

export interface LocateOverrides {
  ariaLabel?: string;
  textContent?: string;
  xpathIndex?: number;
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
        xpath: `(${locator.xpath})[${overrides.xpathIndex}]`,
        role: locator.role,
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
    const strategies = [
      this.strategyByDataTestId(locator),
      this.strategyByAriaLabel(locator),
      this.strategyByRoleAndText(locator),
      this.strategyByXPath(locator),
      this.strategyByCss(locator),
    ].filter((s): s is Promise<StrategyResult> => s !== null);

    if (strategies.length === 0) {
      throw new Error(`[locate] No valid strategies for key "${key}"`);
    }

    return cy.wrap(
      promiseAny(strategies).then(({ $els, strategy }) => {
        Cypress.log({
          name: "locate",
          message: `${key} — ${strategy} (${$els.length} element${$els.length !== 1 ? "s" : ""})`,
          consoleProps: () => ({ key, strategy, count: $els.length }),
        });
        return $els;
      })
    ) as Cypress.Chainable<JQuery<HTMLElement>>;
  }

  // Locates the iframe element, then scopes to its body for .within() usage.
  private pierceIframe(iframeLocator: Locator): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.locateInner("iframe", iframeLocator)
      .its("0.contentDocument.body")
      .should("not.be.empty")
      .then(cy.wrap) as Cypress.Chainable<JQuery<HTMLElement>>;
  }

  // Each strategy uses Cypress.$() (jQuery querying the AUT's DOM) for a synchronous check.
  // All applicable strategies race via promiseAny; the first to find elements wins.
  // The winning $els are returned directly — Cypress.$ elements are valid jQuery subjects.

  private strategyByDataTestId(locator: Locator): Promise<StrategyResult> | null {
    if (!locator.dataTestId) return null;
    const $els = Cypress.$(`[data-testid="${locator.dataTestId}"]`) as JQuery<HTMLElement>;
    return $els.length > 0
      ? Promise.resolve({ $els, strategy: "data-testid" })
      : Promise.reject(new Error("data-testid: no match"));
  }

  private strategyByAriaLabel(locator: Locator): Promise<StrategyResult> | null {
    const name = locator.accessibleNames?.[this.language];
    if (!name) return null;
    const $els = Cypress.$(`[aria-label="${name}"]`) as JQuery<HTMLElement>;
    return $els.length > 0
      ? Promise.resolve({ $els, strategy: "aria-label" })
      : Promise.reject(new Error("aria-label: no match"));
  }

  private strategyByRoleAndText(locator: Locator): Promise<StrategyResult> | null {
    const text = locator.textContent?.[this.language];
    if (!text || !locator.role) return null;
    const $els = Cypress.$(`[role="${locator.role}"]:contains("${text}")`) as JQuery<HTMLElement>;
    return $els.length > 0
      ? Promise.resolve({ $els, strategy: "role+text" })
      : Promise.reject(new Error("role+text: no match"));
  }

  // XPath is evaluated against the AUT's document via Cypress.$('html')[0].ownerDocument,
  // since direct document.evaluate() would target the test runner frame, not the AUT.
  private strategyByXPath(locator: Locator): Promise<StrategyResult> | null {
    if (!locator.xpath) return null;
    try {
      const doc = Cypress.$("html")[0]?.ownerDocument;
      if (!doc) return Promise.reject(new Error("xpath: AUT document not available"));
      const result = doc.evaluate(
        locator.xpath,
        doc,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      const nodes: Element[] = [];
      for (let i = 0; i < result.snapshotLength; i++) {
        const node = result.snapshotItem(i);
        if (node) nodes.push(node as Element);
      }
      const $els = Cypress.$(nodes) as JQuery<HTMLElement>;
      return $els.length > 0
        ? Promise.resolve({ $els, strategy: "xpath" })
        : Promise.reject(new Error("xpath: no match"));
    } catch {
      return Promise.reject(new Error("xpath: evaluation failed"));
    }
  }

  private strategyByCss(locator: Locator): Promise<StrategyResult> | null {
    if (!locator.cssSelector) return null;
    const $els = Cypress.$(locator.cssSelector) as JQuery<HTMLElement>;
    return $els.length > 0
      ? Promise.resolve({ $els, strategy: "css" })
      : Promise.reject(new Error("css: no match"));
  }
}
