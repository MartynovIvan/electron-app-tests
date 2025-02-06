import { THEME } from "../const";
import { ThemeStubDriver } from "../drivers/ThemeDrivers";

export class ThemeStubDsl {
  private driver: ThemeStubDriver;

  constructor(driver: ThemeStubDriver) {
    this.driver = driver;
  }

  public async setTheme(theme: THEME) {
    await this.driver.setTheme(theme);
  }

  public async willReturnLightTheme() {
    await this.driver.willReturnLightTheme();
  }

  public async willReturnDarkTheme() {
    await this.driver.willReturnDarkTheme();
  }

  public async willReturnSystemTheme() {}
}
