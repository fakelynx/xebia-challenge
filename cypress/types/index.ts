export const Languages = ["ES", "EN"] as const;
export type Language = (typeof Languages)[number];

export interface Locator {
  xpath: string;
  role: string;
  accessibleNames: Record<Language, string>;
  dataTestId?: string;
  description?: string;
  shadowDom?: boolean;
  iframe?: Locator;
}

export type TestData = Record<string, string>;
