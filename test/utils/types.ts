import { Channels, THEME } from "./const";

export interface AppDriver {
  setQuery: (query: string) => Promise<void>;
  clickRunQuery: () => Promise<void>;
  getQueryResult: () => Promise<string>;

  toggleAdvancedView: () => Promise<void>;
  getQueryHistoryResults: () => Promise<WebdriverIO.Element[]>;
  getLastQueryFromHistory: () => Promise<string>;
  clickRandomItemInHistory: () => Promise<void>;
  getQueryHistoryResultsContainer: () => Promise<WebdriverIO.Element>;
  getAdvancedViewToggleValue: () => Promise<boolean>;

  checkAppMenuExist: () => Promise<boolean>;
  clickOnMenuItem: (menuId: string) => Promise<void>;
  checkMenuItems: () => Promise<boolean>;
  getModalContainer: () => Promise<WebdriverIO.Element>;
}

export interface GithubDriver {
  willReturnHigherVersion: () => Promise<void>;
  shouldHaveHigherVersion: (version: string) => Promise<void>;

  willReturnLowerVersion: () => Promise<void>;
  shouldHaveLowerVersion: (version: string) => Promise<void>;
}

export interface ThemeDriver {
  shouldHaveLightTheme: () => Promise<void>;
  shouldHaveDarkTheme: () => Promise<void>;
}

export type AllChannels = keyof typeof Channels;

export type Theme = keyof typeof THEME;
