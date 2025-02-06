import { WireMock } from "wiremock-captain";

import {
  ThemeStubDriver,
  RealThemeDriver,
} from "../../../utils/drivers/ThemeStubDriver";
import type { ThemeDriver } from "../../../utils/types";

abstract class BaseThemeDriverTest {
  public themeDriver: ThemeDriver;

  abstract getVersionUrl(): string;
  abstract createThemeDriver(): ThemeDriver;

  abstract setupLightTheme(): Promise<void>;
  abstract setupDarkTheme(): Promise<void>;
  abstract setupSystemTheme(): Promise<void>;

  constructor() {
    this.themeDriver = this.createThemeDriver();
  }

  public async shouldReturnLightTheme() {
    this.setupLightTheme();
    this.themeDriver.shouldHaveLightTheme();
  }

  public async shouldReturnDarkTheme() {
    this.setupDarkTheme();
    this.themeDriver.shouldHaveDarkTheme();
  }
}

export class ThemeStubDriverTest extends BaseThemeDriverTest {
  private driver;
  private baseUrl = `${process.env.WIREMOCK_HOST}:${process.env.WIREMOCK_PORT}`;

  constructor() {
    super();
    const erpStub = new WireMock(this.baseUrl);
    this.driver = new ThemeStubDriver(erpStub);
  }

  public createThemeDriver() {
    const erpStub = new WireMock(this.baseUrl);
    const driver = new ThemeStubDriver(erpStub);

    driver.setup(this.getVersionUrl());

    return driver;
  }

  public getVersionUrl() {
    return `${this.baseUrl}/api/theme`;
  }

  public async setupLightTheme() {
    this.driver.willReturnLightTheme();
  }

  public async setupDarkTheme() {
    this.driver.willReturnDarkTheme();
  }

  public async setupSystemTheme() {
    this.driver.willReturnSystemTheme();
  }
}

export class RealThemeDriverTest extends BaseThemeDriverTest {
  private driver;

  constructor() {
    super();
    this.driver = new RealThemeDriver();
  }

  public createThemeDriver() {
    const driver = new RealThemeDriver();

    driver.setup(this.getVersionUrl());

    return driver;
  }

  public getVersionUrl() {
    return "";
  }

  public async setupLightTheme() {}

  public async setupDarkTheme() {}

  public async setupSystemTheme() {}
}
