import { AppDrivers } from "../../utils/DSL/dsl";
import { WireMock } from "wiremock-captain";
import { GithubStubDriver } from "../../utils/drivers/GithubStubDriver";
import { GithubStubDsl } from "../../utils/DSL/GithubStubDsl";

describe("Check version", async () => {
  const githubStubDsl = new GithubStubDsl(
    new GithubStubDriver(
      new WireMock(`${process.env.WIREMOCK_HOST}:${process.env.WIREMOCK_PORT}`)
    )
  );

  beforeEach(async () => {
    await githubStubDsl.willReturnHigherVersion();
  });
  it("should check version is higher", async () => {
    const appVersion = await githubStubDsl.getVersion();
    expect(appVersion).toBe("v100.0.0");
  });

  afterEach(async () => {

  })
});

describe("MongoDB Query Execution Test", async () => {
  let app: AppDrivers;

  beforeEach(() => {
    app = new AppDrivers(
      new WireMock(`${process.env.WIREMOCK_HOST}:${process.env.WIREMOCK_PORT}`)
    );
  });

  it("should execute a simple query and display results", async () => {
    await app.setQuery("{}");
    await app.clickRunQuery();
    const resultText = await app.getQueryResult();

    expect(resultText).toContain("test1");
    expect(resultText).toContain("test2");
    expect(resultText).toContain("test3");
  });

  it("should execute a simple unsuccessful query and display error", async () => {
    await app.setQuery('{"name":"test4}');
    await app.clickRunQuery();
    const resultText = await app.getQueryResult();

    expect(resultText).toContain("Invalid query or server error.");
  });
});