import { assert } from "chai";
import * as semver from "semver";
import { WireMock } from "wiremock-captain";

import {
  GithubStubDriver,
  RealGithubDriver,
} from "../../../utils/drivers/GithubDrivers";
import type { GithubDriver } from "../../../utils/types";

abstract class BaseGithubDriverTest {
  public githubDriver: GithubDriver;

  abstract getVersionUrl(): string;
  abstract createGithubDriver(): GithubDriver;

  abstract setupHigherVersion(): Promise<void>;
  abstract setupLowerVersion(): Promise<void>;

  constructor() {
    this.githubDriver = this.createGithubDriver();
  }

  public async shouldReturnActualVersion() {
    const response = await fetch(this.getVersionUrl(), {
      headers: {
        "Content-Type": "application/json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN as string}` }
          : {}),
      },
    });

    const data = await response.json();

    assert.exists(semver.clean(data.tag_name));
  }

  public async shouldReturnHigherVersionThanCurrent(currentAppVersion: string) {
    await this.setupHigherVersion();
    const version = await this.githubDriver.getCleanVersion();
    assert.isTrue(
      semver.gt(version, currentAppVersion),
      `Expected version ${version} to be greater than ${currentAppVersion}`
    );
  }

  public async shouldReturnLowerVersionThanCurrent(currentAppVersion: string) {
    await this.setupLowerVersion();
    const version = await this.githubDriver.getCleanVersion();
    assert.isTrue(
      semver.lt(version, currentAppVersion),
      `Expected version ${version} to be less than ${currentAppVersion}`
    );
  }
}

export class GithubStubDriverTest extends BaseGithubDriverTest {
  private driver;
  private baseUrl = `${process.env.WIREMOCK_HOST}:${process.env.WIREMOCK_PORT}`;

  constructor() {
    super();
    const githubStub = new WireMock(this.baseUrl);
    this.driver = new GithubStubDriver(githubStub);
  }

  public createGithubDriver() {
    const githubStub = new WireMock(this.baseUrl);
    const driver = new GithubStubDriver(githubStub);

    driver.setup(this.getVersionUrl());

    return driver;
  }

  public getVersionUrl() {
    return `${this.baseUrl}/api/check-version`;
  }

  public async setupHigherVersion() {
    await this.driver.willReturnHigherVersion();
  }
  public async setupLowerVersion() {
    await this.driver.willReturnLowerVersion();
  }
}

export class RealGithubDriverTest extends BaseGithubDriverTest {
  private driver;

  constructor() {
    super();
    this.driver = new RealGithubDriver();
  }

  public createGithubDriver() {
    const driver = new RealGithubDriver();

    driver.setup(this.getVersionUrl());

    return driver;
  }

  public getVersionUrl() {
    return "https://api.github.com/repos/vaisakhsasikumar/my-electron-app/releases/latest";
  }

  public async setupHigherVersion() {}
  public async setupLowerVersion() {}
}

export { BaseGithubDriverTest };