declare module "@testing-library/cypress/add-commands";

declare namespace Cypress {
  interface Chainable<Subject = any> {
    findByRole(
      role: string,
      options?: { name?: string | RegExp; hidden?: boolean; [key: string]: unknown }
    ): Chainable<JQuery<HTMLElement>>;
    findAllByRole(
      role: string,
      options?: { name?: string | RegExp; hidden?: boolean; [key: string]: unknown }
    ): Chainable<JQuery<HTMLElement>>;
    findByText(
      text: string | RegExp,
      options?: { [key: string]: unknown }
    ): Chainable<JQuery<HTMLElement>>;
    findAllByText(
      text: string | RegExp,
      options?: { [key: string]: unknown }
    ): Chainable<JQuery<HTMLElement>>;
    findByLabelText(
      text: string | RegExp,
      options?: { [key: string]: unknown }
    ): Chainable<JQuery<HTMLElement>>;
    findByPlaceholderText(
      text: string | RegExp,
      options?: { [key: string]: unknown }
    ): Chainable<JQuery<HTMLElement>>;
    findByTestId(
      testId: string | RegExp,
      options?: { [key: string]: unknown }
    ): Chainable<JQuery<HTMLElement>>;
  }
}
