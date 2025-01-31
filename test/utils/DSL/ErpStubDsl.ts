import { ErpStubDriver } from "../drivers/ErpStubDriver";
import { ErpStubDriverInterface } from "../types";

/**
 * ErpStubDsl should be inside describe (on top of that).
 * The reason is because WebdriverIO launch application before "beforeEach" callback and "it" test suites.
 * So in order to be able to mock API calls, that triggered on app start, we need to configure it before application launch.
 */

export class ErpStubDsl implements ErpStubDriverInterface {
  private driver: ErpStubDriver;

  constructor(driver: ErpStubDriver) {
    this.driver = driver;
  }

  public async getVersion() {
    return this.driver.getVersion();
  }

  public async willReturnHigherVersion() {
    await this.driver.willReturnHigherVersion();
  }

  public async willReturnLowerVersion() {
    await this.driver.willReturnLowerVersion();
  }
}
