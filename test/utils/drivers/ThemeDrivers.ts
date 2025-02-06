import { assert } from "chai";
import {
  IWireMockRequest,
  IWireMockResponse,
  WireMock,
} from "wiremock-captain";
import { browser } from "@wdio/globals";

import { THEME } from "../const";
import type { ThemeDriver } from "../types";

export class BaseThemeDriver implements ThemeDriver {
  private client: string = "";

  constructor() {}

  public setup(client: string) {
    this.client = client;
  }

  public async shouldHaveLightTheme() {
    const response = await fetch(this.client);
    const data = await response.json();
    assert(data.theme == THEME.LIGHT);
  }

  public async shouldHaveDarkTheme() {
    const response = await fetch(this.client);
    const data = await response.json();
    assert(data.theme == THEME.DARK);
  }
}
export class ThemeStubDriver extends BaseThemeDriver {
  private driver: WireMock;
  private currentTheme = THEME.LIGHT;
  private themeRequest: IWireMockRequest = {
    method: "GET",
    endpoint: "/api/theme",
  };

  constructor(driver: WireMock) {
    super();
    this.driver = driver;
  }

  public async setTheme(theme: THEME) {
    this.currentTheme = theme;
    console.log(`Setting theme to: ${theme}`);
    return Promise.resolve();
  }

  public async willReturnLightTheme() {
    const mockedResponse: IWireMockResponse = {
      status: 200,
      body: { theme: THEME.LIGHT },
    };
    await this.driver.register(this.themeRequest, mockedResponse);
    return Promise.resolve();
  }

  public async willReturnDarkTheme() {
    const mockedResponse: IWireMockResponse = {
      status: 200,
      body: { theme: THEME.DARK },
    };
    await this.driver.register(this.themeRequest, mockedResponse);
    return Promise.resolve();
  }

  public async willReturnSystemTheme() {
    const mockedResponse: IWireMockResponse = {
      status: 200,
      body: { theme: THEME.SYSTEM },
    };
    await this.driver.register(this.themeRequest, mockedResponse);
    return Promise.resolve();
  }
}

export class RealThemeDriver extends BaseThemeDriver {
  private driver: WebdriverIO.Browser = browser;
  private currentTheme = THEME.LIGHT;
  constructor(wireMock: WireMock) {
    super();
  }

  async setTheme(theme: THEME): Promise<void> {
    console.log("SET THEME IN RealThemeDriver", theme);
    this.currentTheme = theme;
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

  async willReturnSystemTheme() {
    return Promise.resolve();
  }
}
