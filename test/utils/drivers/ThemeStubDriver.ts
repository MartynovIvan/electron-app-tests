import {
  IWireMockRequest,
  IWireMockResponse,
  WireMock,
} from "wiremock-captain";
import { browser } from "@wdio/globals";

import type { AppDriver } from "../types";

export class BaseThemeDriver implements AppDriver {
  constructor() {}

  public async setQuery(query: string) {}

  public async clickRunQuery() {}

  public async getQueryResult() {
    return Promise.resolve("");
  }
}
export class ThemeStubDriver extends BaseThemeDriver {
  private driver: WireMock;
  private currentTheme: "light" | "dark" | "system" = "light";
  private themeRequest: IWireMockRequest = {
    method: "GET",
    endpoint: "/api/theme",
  };

  constructor(driver: WireMock) {
    super();
    this.driver = driver;
  }

  public async setTheme(theme: "light" | "dark" | "system") {
    this.currentTheme = theme;
    console.log(`Setting theme to: ${theme}`);
    return Promise.resolve();
  }

  public async willReturnLightTheme() {
    const mockedResponse: IWireMockResponse = {
      status: 200,
      body: { theme: "light" },
    };
    await this.driver.register(this.themeRequest, mockedResponse);
    return Promise.resolve();
  }

  public async willReturnDarkTheme() {
    const mockedResponse: IWireMockResponse = {
      status: 200,
      body: { theme: "dark" },
    };
    await this.driver.register(this.themeRequest, mockedResponse);
    return Promise.resolve();
  }
}

export class RealThemeDriver extends BaseThemeDriver {
  private driver: WebdriverIO.Browser = browser;
  private currentTheme: "light" | "dark" | "system" = "light";
  constructor(wireMock: WireMock) {
    super();
  }

  async setTheme(theme: string): Promise<void> {
    console.log("SET THEME IN RealThemeDriver", theme);
    this.currentTheme = theme as "light" | "dark" | "system";
    return this.driver.execute(async (electron, theme) => {
      await electron.app.setSystemTheme(theme);
      return;
    }, theme);
  }

  async willReturnLightTheme() {
    return Promise.resolve();
  }

  async willReturnDarkTheme() {
    return Promise.resolve();
  }
}
