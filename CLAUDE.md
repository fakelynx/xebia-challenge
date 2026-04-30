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
| Cypress    | 14.x    | Test runner (UI + API) |
| ESLint     | 8.x     | Linting                |
| Prettier   | 3.x     | Formatting             |

## Folder Structure

```
xebia-1/
├── cypress/
│   ├── api/              # Part 2: API spec files (*.cy.ts)
│   ├── e2e/              # Part 1: UI spec files (*.cy.ts)
│   ├── fixtures/         # Static test data (JSON)
│   ├── pages/            # Page Object Model classes
│   │   └── BasePage.ts   # Abstract base — all POMs extend this
│   ├── support/
│   │   ├── commands.ts   # Custom Cypress commands + type declarations
│   │   └── e2e.ts        # Support file loaded before every spec
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
- Use `data-testid` attributes as the primary selector strategy for UI tests.
- Prefer `cy.fixture()` over hard-coded test data in spec files.
- Never use `cy.wait(<number>)` — use `cy.wait("@alias")` or assertion-based waiting.

### Spec Files

- Naming: `feature-name.cy.ts` (kebab-case)
- UI specs: `cypress/e2e/`
- API specs: `cypress/api/`
- One top-level `describe` block per file, named after the feature under test

### Page Object Model

All POM classes extend `BasePage` from [cypress/pages/BasePage.ts](cypress/pages/BasePage.ts).

- One file per page or significant component
- Methods return `this` for fluent chaining
- POM classes expose actions — assertions stay in the spec file

```typescript
// cypress/pages/LoginPage.ts
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  readonly url = "/login";

  get usernameInput() {
    return this.getByTestId("username-input");
  }
  get passwordInput() {
    return this.getByTestId("password-input");
  }
  get submitButton() {
    return this.getByTestId("submit-btn");
  }

  login(username: string, password: string): this {
    this.usernameInput.type(username);
    this.passwordInput.type(password);
    this.submitButton.click();
    return this;
  }
}

// cypress/e2e/login.cy.ts
import { LoginPage } from "../pages/LoginPage";

describe("Login", () => {
  const page = new LoginPage();

  it("logs in with valid credentials", () => {
    page.visit().login("user", "pass").assertOnPage();
    cy.url().should("include", "/dashboard");
  });
});
```

### API Tests

```typescript
// cypress/api/users.cy.ts
describe("Users API", () => {
  it("GET /api/users returns 200 with an array", () => {
    cy.request("GET", "/api/users").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
    });
  });
});
```

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
