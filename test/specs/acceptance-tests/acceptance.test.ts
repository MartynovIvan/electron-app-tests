import { assert } from "chai";
import { WireMock } from "wiremock-captain";
import { browser } from "wdio-electron-service";

import { AppDsl, AppDrivers } from "../../utils/DSL/dsl";
import { GithubStubDsl } from "../../utils/DSL/GithubStubDsl";
import { GithubStubDriver } from "../../utils/drivers/GithubDrivers";
import { Channels, THEME } from "../../utils/const";

//Seeing Persisting Query History should run first
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

describe("Advanced View Toggle Test", () => {
  const application = new AppDsl(new AppDrivers([Channels.UI, Channels.API]));

  it("should toggle advanced view and toggle query history", async () => {
    const queryHistorySection =
      await application.getQueryHistoryResultsContainer();

    await expect(queryHistorySection).toBeDisplayed();

    await application.toggleAdvancedView();

    await expect(queryHistorySection).not.toBeDisplayed();
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

describe("Change the Advanced View", async () => {
  const application = new AppDsl(new AppDrivers([Channels.UI, Channels.API]));

  it("should successfully toggle Advanced view: on", async () => {
    await browser.reloadSession();

    let isToggleOff = await application.getAdvancedViewToggleValue();
    await expect(isToggleOff).toBe(false);

    await application.toggleAdvancedView();
    isToggleOff = await application.getAdvancedViewToggleValue();

    expect(isToggleOff).toBe(true);

    const queryHistorySection =
      await application.getQueryHistoryResultsContainer();

    expect(queryHistorySection).toBeDisplayed();
  });

  it("should successfully toggle Advanced view: off", async () => {
    await application.toggleAdvancedView();
    const isToggleOff = await application.getAdvancedViewToggleValue();

    expect(isToggleOff).toBe(false);

    const queryHistorySection =
      await application.getQueryHistoryResultsContainer();

    expect(queryHistorySection).not.toBeDisplayed();
  });
});

describe("Settings", async () => {
  const application = new AppDsl(new AppDrivers([Channels.UI, Channels.API]));

  beforeEach(async () => {
    await browser.reloadSession();
  });

  it("should successfully show the Settings menu", async () => {
    await application.checkAppMenuExist();

    await application.clickOnAppMenu();

    await application.checkMenuItems();
  });

  it("should successfully open the Settings menu", async () => {
    await application.checkAppMenuExist();

    await application.clickOnAppMenu();

    await application.clickOnSettingsMenu();

    await application.checkSettingsMenuVisible();
  });

  it("should show the Settings menu options", async () => {
    await application.clickOnAppMenu();

    await application.clickOnSettingsMenu();

    await application.checkSettingsMenuVisible();

    await application.checkLightThemeSwitchVisible();

    await application.checkDarkThemeSwitchVisible();

    await application.checkSystemThemeSwitchVisible();

    await application.checkUriInputVisible();

    await application.checkDatabaseNameInputVisible();

    await application.checkCollectionNameInputVisible();

    await application.checkApplySettingsButtonVisible();

    await application.checkCancelSettingsButtonVisible();
  });

  it("should show the default options in the Settings menu", async () => {
    await application.clickOnAppMenu();

    await application.clickOnSettingsMenu();

    await application.checkSettingsMenuVisible();

    await application.checkDefaultTheme();

    await application.checkDefaultUri();

    await application.checkDefaultDatabaseName();

    await application.checkDefaultCollectionName();
  });
});

describe("Advanced View Startup Preference", async () => {
  const application = new AppDsl(new AppDrivers([Channels.UI, Channels.API]));

  it("should enable Advanced View on startup", async () => {
    await browser.reloadSession();

    await application.checkAppMenuExist();

    await application.clickOnSettingsMenu();

    await application.checkSettingsMenuVisible();

    await application.clickAdvancedViewOnStartCheckbox();

    await application.clickApplySettings();

    await application.checkSettingsMenuNotVisible();

    await browser.reloadSession();

    const queryHistorySection =
      await application.getQueryHistoryResultsContainer();

    await expect(queryHistorySection).toBeDisplayed();
  });
});

// ========== Maintainable Acceptance Test Start ==========

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

// ========== External Systems but for Acceptance - Theme  ==========
// Theme selection follows DSL but not Four Layer Model due to technical limitations.

describe("Select Theme", async () => {
  const application = new AppDsl(new AppDrivers([Channels.UI, Channels.API]));

  beforeEach(async () => {
    await browser.reloadSession();
  });

  it("should show the default Theme", async () => {
    await application.checkAppMenuExist();

    await application.clickOnAppMenu();

    await application.clickOnSettingsMenu();

    await application.checkDefaultTheme();
  });

  it("should click the Cancel button", async () => {
    await application.checkAppMenuExist();

    await application.clickOnAppMenu();

    await application.clickOnSettingsMenu();

    await application.selectApplicationTheme(THEME.DARK);

    await application.clickCancelSettings();

    await application.checkApplicationHasTheme(THEME.SYSTEM);
  });

  it("should click the Apply button", async () => {
    await application.checkAppMenuExist();

    await application.clickOnAppMenu();

    await application.clickOnSettingsMenu();

    await application.selectApplicationTheme(THEME.DARK);

    await application.clickApplySettings();

    await application.checkApplicationHasTheme(THEME.DARK);
  });
});

// ========== External Systems but for Acceptance - Version ==========
// Uses Four Layer Model.
// Stubbed API is used for educational purposes due to GitHub API limitations (no more than 60 calls per day)

describe("Version", async () => {
  const githubStubDsl = new GithubStubDsl(
    new GithubStubDriver(
      new WireMock(`${process.env.WIREMOCK_HOST}:${process.env.WIREMOCK_PORT}`)
    )
  );

  it("should successfully check version against stub", async () => {
    const appVersion = await githubStubDsl.getVersion();

    await expect(appVersion).toBeDefined();
  });
});

//Maintainable Acceptance Test end
