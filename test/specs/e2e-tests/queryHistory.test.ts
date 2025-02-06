import { AppDsl, AppDrivers } from "../../utils/DSL/dsl";
import { Channels } from "../../utils/const";

describe("Seeing Persisting Query History", async () => {
  let application = new AppDsl(new AppDrivers([Channels.UI, Channels.API]));

  it("should have saved queries under Query History", async () => {
    await application.toggleAdvancedView();
    await application.setQuery(`{"name":"test1"}`);
    await application.clickRunQuery();

    const lastQueryHistoryResult = await application.getLastQueryFromHistory();

    await expect(lastQueryHistoryResult).toContain(
      `Query: {"name":"test1"} | Result:`
    );
  });

  it("should use previous saved query and the result", async () => {
    let historyList = await application.getQueryHistoryResults();
    const initialHistoryLength = historyList.length;

    await application.setQuery(`{"name":"test1"}`);
    await application.clickRunQuery();
    historyList = await application.getQueryHistoryResults();

    await expect(historyList).toBeElementsArrayOfSize(initialHistoryLength + 1);

    await application.setQuery(`{"name":"test2"}`);
    await application.clickRunQuery();
    historyList = await application.getQueryHistoryResults();
    await expect(historyList).toBeElementsArrayOfSize(initialHistoryLength + 2);

    await application.setQuery(`{"name":"test3"}`);
    await application.clickRunQuery();
    historyList = await application.getQueryHistoryResults();
    await expect(historyList).toBeElementsArrayOfSize(initialHistoryLength + 3);
  });

  it("should have previous saved queries when changing the Advanced view from off to on", async () => {
    const historyList = application.getQueryHistoryResults();
    expect(historyList).toBeElementsArrayOfSize({ gte: 1 });

    await application.toggleAdvancedView();
    await application.toggleAdvancedView();

    expect(historyList).toBeElementsArrayOfSize({ gte: 1 });
  });

  it("should continue to save queries when the Advanced view: off into the Query History ", async () => {
    await application.toggleAdvancedView();

    await application.setQuery(`{"name":"test1"}`);
    await application.clickRunQuery();

    await application.toggleAdvancedView();

    const lastQueryHistoryResult = await application.getLastQueryFromHistory();

    await expect(lastQueryHistoryResult).toContain(
      `Query: {"name":"test1"} | Result:`
    );
  });
});

describe("Viewing Results in JSON Format", () => {
  const application = new AppDsl(new AppDrivers([Channels.UI, Channels.API]));

  it("should successfully run a find query and have a Query Result in JSON format", async () => {
    await application.setQuery(`{"name":"test1"}`);
    await application.clickRunQuery();

    const resultText = await application.getQueryResult();

    await expect(resultText).toContain(`"name": "test1"`);
  });
});
