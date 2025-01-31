import { WireMock } from "wiremock-captain";
import { ThemeStubDriver } from "../drivers/ThemeStubDriver";

/**
 * ThemeStubDsl provides high-level methods to control theme mocking in tests.
 */
export class ThemeStubDsl {
  private themeStubDriver: ThemeStubDriver;

  constructor(wireMock: WireMock) {
    this.themeStubDriver = new ThemeStubDriver(wireMock);
  }

  /**
   * Sets the system theme to 'light'.
   */
  async setLightTheme() {
    await this.themeStubDriver.setTheme('light');
  }

  /**
   * Sets the system theme to 'dark'.
   */
  async setDarkTheme() {
    await this.themeStubDriver.setTheme('dark');
  }

  /**
   * Clears any existing theme stubs.
   */
  async clearThemeStubs() {
    await this.themeStubDriver.clearTheme();
  }
}