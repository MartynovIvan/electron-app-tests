import { GithubStubDriver } from "../drivers/GithubStubDriver";
import type { GithubStubDriverInterface } from "../types";

/**
 * GithubStubDsl should be inside describe (on top of that).
 * The reason is because WebdriverIO launch application before "beforeEach" callback and "it" test suites.
 * So in order to be able to mock API calls, that triggered on app start, we need to configure it before application launch.
 */

export class GithubStubDsl implements GithubStubDriverInterface {
  private driver: GithubStubDriver;

  constructor(driver: GithubStubDriver) {
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
