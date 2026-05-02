# xebia-1 — Cypress Automation Project

## Overview

Automated tests for the Xebia challenge, split into two parts:

- **Part 1 (UI):** End-to-end browser tests using Cypress + Page Object Model
- **Part 2 (API):** API tests using `cy.request()`

Both suites share the same `e2e` Cypress configuration block. No Component Testing is used.

## Tech Stack

| Tool       | Version | Purpose                |
| ---------- | ------- | ---------------------- |
| Node.js    | 18.x    | Runtime                |
| TypeScript | latest  | Language               |
| Cypress    | 13.x    | Test runner (UI + API) |
| ESLint     | 8.x     | Linting                |
| Prettier   | 3.x     | Formatting             |

## Folder Structure

```
xebia-1/
├── cypress/
│   ├── api/                  # Part 2: API spec files (*.cy.ts)
│   ├── data/                 # Test data CSV files (one per feature)
│   ├── e2e/                  # Part 1: UI spec files (*.cy.ts)
│   ├── locators/             # TypeScript locator registries (*.registry.ts, one per page)
│   ├── pages/                # Page Object Model classes
│   │   ├── BaseComponent.ts  # locate() pipeline + strategy methods
│   │   └── BasePage.ts       # Abstract base — all POMs extend this
│   ├── support/
│   │   ├── commands.ts       # Custom Cypress commands + type declarations
│   │   ├── csv.ts            # parseData() helper for test data CSVs
│   │   └── e2e.ts            # Support file loaded before every spec
│   ├── types/
│   │   └── index.ts          # Shared types: Locator, Language, TestData
│   └── tsconfig.json
├── cypress.config.ts
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── package.json
└── CLAUDE.md
```

## Running Tests

Set the real `baseUrl` in `cypress.config.ts` before running.

```bash
npm run cy:open            # Cypress interactive runner
npm run cy:run             # Run all tests headlessly
npm run cy:run:chrome      # Run all tests in Chrome
npm run cy:run:firefox     # Run all tests in Firefox
npm run cy:run:e2e         # Run only UI tests (Part 1)
npm run cy:run:api         # Run only API tests (Part 2)
```

## Linting and Formatting

```bash
npm run lint               # Check for lint errors
npm run lint:fix           # Auto-fix lint errors
npm run format             # Format all files with Prettier
```

## Coding Conventions

### General

- All files in `cypress/` are TypeScript (`.ts`). No `.js` files.
- Never use `cy.wait(<number>)` — use `cy.wait("@alias")` or assertion-based waiting.
- Write test descriptions in a Gherkin-inspired style so they read naturally as scenarios.
- Element locators live in TypeScript registry files under `cypress/locators/` — one per page.
- Test data lives in CSV files under `cypress/data/` — one file per feature.
- POMs are type-safe: locator maps come from the registry file for that page.

---

### Types (`cypress/types/index.ts`)

```typescript
const Languages = ["ES", "EN"] as const;
type Language = (typeof Languages)[number];

interface Locator {
  xpath: string;
  role: string;
  accessibleNames?: Record<Language, string>; // ARIA computed name — used for aria-label strategy
  textContent?: Record<Language, string>;      // Visible text inside the element — used for role+text strategy
  cssSelector?: string;                        // CSS selector — used as last-resort strategy
  dataTestId?: string;
  description?: string;
  shadowDom?: boolean;
  iframe?: Locator;
}

type TestData = Record<string, string>;
```

`accessibleNames` and `textContent` are kept separate because they describe different things: a button may have `aria-label="Close dialog"` with no visible text, or a link may display "Learn more" while its ARIA name is "Learn more about pricing".

---

### Locator registries (`cypress/locators/*.registry.ts`)

One `.registry.ts` file per page. Each file exports a typed constant using `satisfies Record<string, Locator>` — this validates the shape without widening the type, so key names and per-field types are preserved for autocomplete and type-safe `keyof` access in the POM.

```typescript
// cypress/locators/login.registry.ts
import type { Locator } from "../types";

export const LoginLocators = {
  usernameInput: {
    xpath: "//input[@name='username']",
    role: "textbox",
    accessibleNames: { ES: "Usuario", EN: "Username" },
    dataTestId: "username-input",
    description: "Username field",
  },
  passwordInput: {
    xpath: "//input[@name='password']",
    role: "textbox",
    accessibleNames: { ES: "Contraseña", EN: "Password" },
    dataTestId: "password-input",
    description: "Password field",
  },
  submitButton: {
    xpath: "//button[@type='submit']",
    role: "button",
    accessibleNames: { ES: "Iniciar sesión", EN: "Login" },
    textContent: { ES: "Iniciar sesión", EN: "Login" },
    description: "Submit button",
  },
} satisfies Record<string, Locator>;

export type LoginLocatorMap = typeof LoginLocators;
```

Populate only the fields that are available on the element. The more fields provided, the more strategies the `locate()` pipeline can try. Provide `dataTestId` whenever the element has a `data-testid` attribute — it is the most reliable strategy.

---

### Test data CSV files (`cypress/data/`)

One CSV per feature. Two columns: `name` and `value`. Parsed into `Record<string, string>`.

Example — `cypress/data/login.csv`:

```csv
name,value
username,testuser
password,Test@1234
```

---

### Spec Files

- Naming: `feature-name.cy.ts` (kebab-case)
- UI specs: `cypress/e2e/`
- API specs: `cypress/api/`
- One top-level `describe` block per file, named after the feature
- `it()` descriptions follow Gherkin style: _"given [context], when [action], then [outcome]"_
- Import the registry directly — no async setup, no `before()` hook needed for locators

```typescript
// cypress/e2e/login.cy.ts
import { LoginPage } from "../pages/LoginPage";
import { LoginLocators } from "../locators/login.registry";
import { parseData } from "../support/csv";

describe("Login", () => {
  const page = new LoginPage(LoginLocators);

  let data: Record<string, string>;
  before(() => { parseData("login").then((d) => { data = d; }); });

  it("given a user with valid credentials, when they log in, then they are redirected to the dashboard", () => {
    page.visit().login(data.username, data.password).assertOnPage();
    cy.url().should("include", "/dashboard");
  });

  it("given a user with an invalid password, when they attempt to log in, then an error message is shown", () => {
    page.visit().login(data.username, "wrong-password");
    cy.contains(LoginLocators.errorMessage.accessibleNames!["EN"]).should("be.visible");
  });
});
```

---

### Page Object Model

All POM classes extend `BasePage` from [cypress/pages/BasePage.ts](cypress/pages/BasePage.ts), which itself extends `BaseComponent` from [cypress/pages/BaseComponent.ts](cypress/pages/BaseComponent.ts).

- One file per page or significant component
- No inline locator interfaces — import the `*LocatorMap` type from the registry file
- Constructor receives the registry export directly (synchronous, no `cy.task`)
- Methods return `this` for fluent chaining
- POM classes expose actions — assertions stay in the spec file

```typescript
// cypress/pages/LoginPage.ts
import { BasePage } from "./BasePage";
import type { LoginLocatorMap } from "../locators/login.registry";

export class LoginPage extends BasePage<LoginLocatorMap> {
  readonly url = "/login";
  readonly pageTitle = "Sign in";

  login(username: string, password: string): this {
    this.locate("usernameInput").type(username);
    this.locate("passwordInput").type(password);
    this.locate("submitButton").click();
    return this;
  }
}
```

#### `locate(key)` — multi-strategy pipeline

Defined in `BaseComponent`, `locate()` runs all applicable strategies against the AUT's DOM in parallel (via `promiseAny`) and uses the first one to find elements. The winning strategy is reported in the Cypress log.

**Strategy priority** (first with available locator data wins):

| # | Strategy | Field used | Selector built |
|---|----------|------------|----------------|
| 1 | `data-testid` | `dataTestId` | `[data-testid="..."]` |
| 2 | `aria-label` | `accessibleNames[language]` | `[aria-label="..."]` |
| 3 | `role + text` | `role` + `textContent[language]` | `[role="..."]:contains("...")` |
| 4 | XPath | `xpath` | evaluated via `document.evaluate()` against the AUT |
| 5 | CSS selector | `cssSelector` | passed directly to `Cypress.$()` |

All strategies use `Cypress.$()` (jQuery querying the AUT's DOM) for the synchronous DOM check. `locate()` returns a `Cypress.Chainable<JQuery<HTMLElement>>` — chain Cypress commands on it normally.

**`locateOverriding(key, overrides)`** — same pipeline, but accepts a `LocateOverrides` object to customise how the element is located at runtime. All fields are optional and independent:

```typescript
interface LocateOverrides {
  ariaLabel?: string;    // overrides accessibleNames[lang] → aria-label strategy
  textContent?: string;  // overrides textContent[lang]    → role+text strategy
  xpathIndex?: number;   // wraps xpath as (xpath)[n], clears all other strategies
  alias?: string;        // registers a Cypress alias via .as() for later re-use
}
```

- **`ariaLabel`** / **`textContent`** — substitute a runtime string into the respective strategy. Both can be set independently on the same call.
- **`xpathIndex`** — selects the nth DOM match of the registry XPath (1-indexed). All other strategies are disabled for that call so only xpath runs.
- **`alias`** — chains `.as(alias)` at the end, making the element available as `cy.get("@alias")` throughout the test.

```typescript
// Override aria-label with a runtime value
this.locateOverriding("accordionToggle", { ariaLabel: sectionName }).click();

// Select the 7th star in a rating widget (xpath-only, positional)
this.locateOverriding("ratingStarButton", { xpathIndex: 7 }).click();

// Locate once, alias for multi-step assertions
this.locateOverriding("ratingStarButton", { xpathIndex: n, alias: "starBtn" });
cy.get("@starBtn").should("be.visible");
cy.get("@starBtn").click();
```

#### Acceptable non-registry selectors in POM methods

Two categories of selector are intentionally kept inline rather than in the registry:

- **ARIA state** (`[aria-expanded="true"]`, `[aria-selected]`) — runtime DOM state, not element identity
- **Generic structural tags** (`"img"` inside a grid, `"a[href*='/name/']"` inside a list) — describe DOM structure when scoped to a `locate()`-resolved parent

---

### API Tests

```typescript
// cypress/api/users.cy.ts
describe("Users API", () => {
  it("given the users endpoint is available, when a GET request is made, then it returns 200 with an array", () => {
    cy.request("GET", "/api/users").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
    });
  });
});
```

---

### Custom Commands

Add to [cypress/support/commands.ts](cypress/support/commands.ts) with inline type declarations:

```typescript
Cypress.Commands.add("login", (username: string, password: string) => {
  cy.request("POST", "/api/login", { username, password }).then((resp) => {
    window.localStorage.setItem("token", resp.body.token);
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
    }
  }
}
```
