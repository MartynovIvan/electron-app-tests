import { browser } from "wdio-electron-service";

import { GithubStubDriverTest } from "./helpers/GithubHelpers";

//From External Systsems -> Version test uses DSL-Four Layer Model

describe("External System Stub Contract Test. Github API", async () => {
  const githubStubTest = new GithubStubDriverTest();

  it("should successfully check that higher version exist", async () => {
    await githubStubTest.shouldReturnHigherVersionThanCurrent("1.0.0");
  });

  it("should successfully check that lower version exist", async () => {
    await githubStubTest.shouldReturnLowerVersionThanCurrent("1.0.0");
  });
});
