import nock from "nock";
import { assert } from "chai";
import {
  IWireMockRequest,
  IWireMockResponse,
  WireMock,
} from "wiremock-captain";
import * as semver from "semver";

import { ErpDriver } from "../types";

class BaseErpDriver implements ErpDriver {
  private client: string = "";

  constructor() {}

  public setup(client: string) {
    this.client = client;
  }

  public async shouldHaveHigherVersion(version: string) {
    const response = await fetch(this.client);
    const data = await response.json();
    assert(semver.clean(data.tag_name) == version);
  }
  public async shouldHaveLowerVersion(version: string) {
    const response = await fetch(this.client);
    const data = await response.json();
    assert(semver.clean(data.tag_name) == version);
  }

  public async willReturnHigherVersion() {}
  public async willReturnLowerVersion() {}
}

export class ErpStubDriver extends BaseErpDriver {
  private driver: WireMock;

  private versionRequest: IWireMockRequest = {
    method: "GET",
    endpoint: "/api/check-version",
  };

  constructor(driver: WireMock) {
    super();
    this.driver = driver;
  }

  public async getVersion() {
    const response = await fetch(
      `${process.env.WIREMOCK_HOST}:${process.env.WIREMOCK_PORT}/api/check-version`
    );

    const data = await response.json();

    return data.tag_name;
  }

  public async willReturnHigherVersion() {
    const mockedResponse: IWireMockResponse = {
      status: 200,
      body: { tag_name: "v100.0.0" },
    };

    await this.driver.register(this.versionRequest, mockedResponse);
  }

  public async willReturnLowerVersion() {
    const mockedResponse: IWireMockResponse = {
      status: 200,
      body: { tag_name: "v0.0.1" },
    };

    await this.driver.register(this.versionRequest, mockedResponse);
  }
}

export class RealErpDriver extends BaseErpDriver {
  constructor() {
    super();
  }

  public async willReturnHigherVersion() {
    nock("https://api.github.com")
      .get("/repos/vaisakhsasikumar/my-electron-app/releases/latest")
      .reply(200, { tag_name: "v100.0.0" });
  }

  public async willReturnLowerVersion() {
    nock("https://api.github.com")
      .get("/repos/vaisakhsasikumar/my-electron-app/releases/latest")
      .reply(200, { tag_name: "v0.0.01" });
  }
}
