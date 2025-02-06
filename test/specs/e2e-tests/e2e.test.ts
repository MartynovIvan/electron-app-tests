import { assert } from "chai";
import { browser } from "wdio-electron-service";

import { AppDsl, AppDrivers } from "../../utils/DSL/dsl";
import { Channels } from "../../utils/const";

describe("MongoDB Query Execution Test", async () => {
  const application = new AppDsl(new AppDrivers([Channels.UI, Channels.API]));

  beforeEach(async () => {
    await browser.reloadSession();
  });

  it("should execute a simple query and display results", async () => {
    await application.setQuery("{}");
    await application.clickRunQuery();
    const queryResult = await application.getQueryResult();

    assert.notInclude(
      queryResult,
      "Invalid query",
      'Query result should not contain "Invalid query"'
    );
    assert.include(queryResult, "test1", "Query result should contain field");
    assert.include(queryResult, "test2", "Query result should contain field");
    assert.include(queryResult, "test3", "Query result should contain field");
  });

  it("should execute a simple unsuccessful query and display error", async () => {
    await application.setQuery('{"name":"test4}');
    await application.clickRunQuery();
    const queryResult = await application.getQueryResult();

    assert.include(
      queryResult,
      "Invalid query or server error.",
      'Query result should not contain "Invalid Query"'
    );
  });
});
