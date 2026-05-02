# xebia-1 — Cypress Automation for IMDb

Automated test suite for the Xebia challenge. Covers UI end-to-end tests against [IMDb](https://www.imdb.com) and API tests, both running under the same Cypress configuration.

## Prerequisites

- **Node.js 18.x** — required by the Cypress version and the `cross-env ELECTRON_RUN_AS_NODE` workaround in npm scripts
- **npm** — comes with Node.js

## Installation

```bash
npm install
```

## Configuration

Before running UI tests, set the base URL in `cypress.config.ts`:

```typescript
baseUrl: "https://www.imdb.com",
```

## Running Tests

```bash
npm run cy:open          # Open Cypress interactive runner
npm run cy:run           # Run all tests headlessly (Electron)
npm run cy:run:chrome    # Run all tests in Chrome
npm run cy:run:firefox   # Run all tests in Firefox
npm run cy:run:e2e       # Run UI tests only (Part 1)
npm run cy:run:api       # Run API tests only (Part 2)
```

## Linting and Formatting

```bash
npm run lint             # Check for lint errors
npm run lint:fix         # Auto-fix lint errors
npm run format           # Format all files with Prettier
```

## Project Structure

```
cypress/
├── e2e/          # UI spec files (*.cy.ts)
├── api/          # API spec files (*.cy.ts)
├── locators/     # TypeScript locator registries (one per page)
├── pages/        # POM classes — BasePage, BaseComponent, and page-specific classes
├── data/         # Test data CSV files
├── support/      # Custom commands, parseData helper, support entry point
└── types/        # Shared types: Locator, Language, TestData
```

## Locator System

Each page has a TypeScript registry file under `cypress/locators/` (e.g., `actor.registry.ts`) that exports a typed map of locators using `satisfies Record<string, Locator>`. Every registry entry requires a `cssSelector` field — all other fields are optional.

POM methods call `this.locate(key)`, which runs a **two-strategy sequential pipeline**:

1. **CSS / data-testid** — if the locator has `dataTestId`, polls `[data-testid="..."]` for up to 1 second via `cy.get()`.
2. **@testing-library/cypress** — if strategy 1 times out (or is skipped because there is no `dataTestId`), falls back to `cy.findByRole(role, { name })` or `cy.findByText(text)` with the full Cypress default timeout.
3. **CSS-only** — when neither `dataTestId` nor testing-library fields (`accessibleNames`, `textContent`) are present, uses `cy.get(cssSelector)` directly with the full timeout.

No selectors are hardcoded in POM classes.

When element identity depends on a runtime value, use `this.locateOverriding(key, overrides)`. The `LocateOverrides` object supports five independent fields:

- `ariaLabel` — substitutes the testing-library `name` option at runtime
- `textContent` — substitutes the testing-library text query at runtime
- `xpathIndex` — 1-based positional: selects the nth CSS match via `:eq(n-1)`, disables testing-library
- `cssIndex` — 0-based positional: selects the nth CSS match via `:eq(n)`, disables testing-library
- `alias` — registers a Cypress alias via `.as()` for reuse within the test

## Tech Stack

| Tool                     | Version | Purpose                       |
|--------------------------|---------|-------------------------------|
| Node.js                  | 18.x    | Runtime                       |
| TypeScript               | latest  | Language                      |
| Cypress                  | 13.x    | Test runner                   |
| @testing-library/cypress | ^6.x    | Role- and text-based locators |
| ESLint                   | 8.x     | Linting                       |
| Prettier                 | 3.x     | Formatting                    |
