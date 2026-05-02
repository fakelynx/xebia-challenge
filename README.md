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

Each page has a TypeScript registry file under `cypress/locators/` (e.g., `actor.registry.ts`) that exports a typed map of locators using `satisfies Record<string, Locator>`. POM methods call `this.locate(key)`, which runs up to five parallel strategies — `data-testid`, `aria-label`, `role+text`, XPath, and CSS selector — and uses the first match. No selectors are hardcoded in POM classes.

## Tech Stack

| Tool       | Version | Purpose           |
|------------|---------|-------------------|
| Node.js    | 18.x    | Runtime           |
| TypeScript | latest  | Language          |
| Cypress    | 13.x    | Test runner       |
| ESLint     | 8.x     | Linting           |
| Prettier   | 3.x     | Formatting        |
