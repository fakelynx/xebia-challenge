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
│   ├── api/              # Part 2: API spec files (*.cy.ts)
│   ├── data/             # Test data CSV files (one per feature)
│   ├── e2e/              # Part 1: UI spec files (*.cy.ts)
│   ├── locators/         # Element locator CSV files (one per page)
│   ├── pages/            # Page Object Model classes
│   │   └── BasePage.ts   # Abstract base — all POMs extend this
│   ├── support/
│   │   ├── commands.ts   # Custom Cypress commands + type declarations
│   │   └── e2e.ts        # Support file loaded before every spec
│   ├── types/
│   │   └── index.ts      # Shared types: Locator, Language, etc.
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
- Element locators live in CSV files under `cypress/locators/` — one file per page.
- Test data lives in CSV files under `cypress/data/` — one file per feature.
- POMs are type-safe: locators and data must satisfy the interfaces defined in `cypress/types/`.

---

### Types (`cypress/types/index.ts`)

```typescript
const Languages = ["ES", "EN"] as const;
type Language = (typeof Languages)[number];

interface Locator {
  xpath: string;
  role: string; // ARIA role (e.g. "button", "textbox")
  accessibleNames: Record<Language, string>;
  dataTestId?: string; // takes priority over accessibleNames when present
  description?: string; // for reporting purposes
  shadowDom?: boolean; // true when the element is inside a Shadow DOM
  iframe?: Locator; // locator of the frame that contains this element
}

type TestData = Record<string, string>;
```

---

### Locator CSV files (`cypress/locators/`)

One CSV per page. Each row defines one element. Parsed into `Record<string, Locator>`.

| Column              | Required | Notes                                     |
| ------------------- | -------- | ----------------------------------------- |
| `name`              | yes      | Key used to reference the locator in code |
| `xpath`             | yes      | Full XPath expression                     |
| `role`              | yes      | ARIA role string                          |
| `accessibleNameES`  | yes      | Accessible name in Spanish                |
| `accessibleNameEN`  | yes      | Accessible name in English                |
| `dataTestId`        | no       | When present, used with highest priority  |
| `description`       | no       | Human-readable label for reports          |
| `shadowDom`         | no       | `true` / `false`                          |
| `iframe`            | no       | Name of another locator row for the frame |

Example — `cypress/locators/login.csv`:

```csv
name,xpath,role,accessibleNameES,accessibleNameEN,data-test-id,description
usernameInput,//input[@name='username'],textbox,Usuario,Username,username-input,Username field
passwordInput,//input[@name='password'],textbox,Contraseña,Password,password-input,Password field
submitButton,//button[@type='submit'],button,Iniciar sesión,Login,,Submit button
```

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

```typescript
// cypress/e2e/login.cy.ts
import { LoginPage } from "../pages/LoginPage";
import { parseLocators, parseData } from "../support/csv";

describe("Login", () => {
  const locators = parseLocators("login");
  const data = parseData("login");
  const page = new LoginPage(locators);

  it("given a user with valid credentials, when they log in, then they are redirected to the dashboard", () => {
    page.visit().login(data.username, data.password).assertOnPage();
    cy.url().should("include", "/dashboard");
  });

  it("given a user with an invalid password, when they attempt to log in, then an error message is shown", () => {
    page.visit().login(data.username, "wrong-password");
    cy.contains(locators.errorMessage.accessibleNames["EN"]).should("be.visible");
  });
});
```

---

### Page Object Model

All POM classes extend `BasePage` from [cypress/pages/BasePage.ts](cypress/pages/BasePage.ts).

- One file per page or significant component
- Constructor receives a typed locator map (`Record<string, Locator>`)
- Methods return `this` for fluent chaining
- POM classes expose actions — assertions stay in the spec file
- `BasePage.locate()` applies the locator priority order:
  1. `data-test-id` → `cy.get('[data-testid="..."]')`
  2. Accessible name in current language → role-based or text selector
  3. XPath → `cy.xpath()`

```typescript
// cypress/pages/LoginPage.ts
import { BasePage } from "./BasePage";
import type { Locator } from "../types";

interface LoginLocators {
  usernameInput: Locator;
  passwordInput: Locator;
  submitButton: Locator;
  errorMessage: Locator;
}

export class LoginPage extends BasePage<LoginLocators> {
  readonly url = "/login";

  login(username: string, password: string): this {
    this.locate("usernameInput").type(username);
    this.locate("passwordInput").type(password);
    this.locate("submitButton").click();
    return this;
  }
}
```

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
