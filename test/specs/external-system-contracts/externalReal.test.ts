import { browser } from "wdio-electron-service";

import { RealGithubDriverTest } from "./helpers/GithubHelpers";

// Here we use Nock because GitHub has API limitations and we reach the limit of checking the version quite quckly.
// We understand that in real life this should be a proper API call, not a mock

describe("External System Test Instance Contract Test. Github API", async () => {
  const githubRealTest = new RealGithubDriverTest();

  it("should successfully check version against stub", async () => {
    await githubRealTest.shouldReturnActualVersion();
  });
});
