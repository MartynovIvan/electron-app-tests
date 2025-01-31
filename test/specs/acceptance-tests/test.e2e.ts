import { assert } from "chai";
import { browser } from "wdio-electron-service";

import MainPage from "../../utils/DSL/mainPage";
import Modal from "../../utils/DSL/modal";
import MenuBar from "../../utils/DSL/menuBar";

import { WireMock } from "wiremock-captain";
import { GithubStubDriver } from "../../utils/drivers/GithubStubDriver";
import { GithubStubDsl } from "../../utils/DSL/GithubStubDsl";

//Seeing Persisting Query History should run first

describe("Seeing Persisting Query History", async () => {
  let mainPage: MainPage;

  beforeEach(() => {
    mainPage = new MainPage();
  });

  it("should have no saved queries under Query History", async () => {
    await mainPage.toggleAdvancedView();

    const queryHistoryResults = await mainPage.queryHistoryResultsAllElements;

    expect(queryHistoryResults.length).toBe(0);
  });

  it("should have saved queries under Query History", async () => {
    const historyList = await mainPage.queryHistoryResultsAllElements;
    const initialHistoryLength = historyList.length;

    await mainPage.setQueryText(`{"name":"test1"}`);
    await mainPage.clickRunQueryButton();

    await expect(historyList).toBeElementsArrayOfSize(initialHistoryLength + 1);

    const lastQueryHistoryResult = await mainPage.getLastQueryHistoryText();

    await expect(lastQueryHistoryResult).toContain(
      `Query: {"name":"test1"} | Result:`
    );
  });

  it("should use previous saved query and the result", async () => {
    const historyList = await mainPage.queryHistoryResultsAllElements;
    const initialHistoryLength = historyList.length;

    await mainPage.setQueryText(`{"name":"test1"}`);
    await mainPage.clickRunQueryButton();
    await expect(historyList).toBeElementsArrayOfSize(initialHistoryLength + 1);

    await mainPage.setQueryText(`{"name":"test2"}`);
    await mainPage.clickRunQueryButton();
    await expect(historyList).toBeElementsArrayOfSize(initialHistoryLength + 2);

    await mainPage.setQueryText(`{"name":"test3"}`);
    await mainPage.clickRunQueryButton();
    await expect(historyList).toBeElementsArrayOfSize(initialHistoryLength + 3);

    await mainPage.findClickMinusTwoQueriesInHistory();
    const resultText = await mainPage.getQueryText();

    assert.strictEqual(resultText, `{"name":"test1"}`, "Incorrect query text");
  });

  it("should have previous saved queries when changing the Advanced view from off to on", async () => {
    const historyList = await mainPage.queryHistoryResultsAllElements;
    expect(historyList).toBeElementsArrayOfSize({ gte: 1 });

    await mainPage.toggleAdvancedView();
    await mainPage.toggleAdvancedView();

    expect(historyList).toBeElementsArrayOfSize({ gte: 1 });
  });

  it("should have previous saved queries when changing the Advanced view from off to on", async () => {
    await mainPage.clickRandomItemInHistory();

    await browser.reloadSession();
    await mainPage.toggleAdvancedView();

    const historyList = await mainPage.queryHistoryResultsAllElements;
    expect(historyList).toBeElementsArrayOfSize({ gte: 1 });
  });

  it("should continue to save queries when the Advanced view: off into the Query History ", async () => {
    const historyList = await mainPage.queryHistoryResultsAllElements;
    const initialHistoryLength = historyList.length;
    await mainPage.toggleAdvancedView();

    await mainPage.setQueryText(`{"name":"test1"}`);
    await mainPage.clickRunQueryButton();

    await mainPage.toggleAdvancedView();
    await expect(historyList).toBeElementsArrayOfSize(initialHistoryLength + 1);

    const lastQueryHistoryResult = await mainPage.getLastQueryHistoryText();

    await expect(lastQueryHistoryResult).toContain(
      `Query: {"name":"test1"} | Result:`
    );
  });
});

describe("MongoDB Query Execution Test", async () => {
  let mainPage: MainPage;

  beforeEach(() => {
    mainPage = new MainPage();
  });

  it("should execute a simple query and display res-ults", async () => {
    await mainPage.setQueryText("{}");

    expect(await mainPage.getQueryText()).toBe("{}");

    await mainPage.clickRunQueryButton();

    const resultText = await mainPage.getQueryResultText();

    assert.notInclude(
      resultText,
      "Invalid Query",
      'Query result should not contain "Invalid Query"'
    );
    assert.include(resultText, "test1", "Query result should contain field");
    assert.include(resultText, "test2", "Query result should contain field");
    assert.include(resultText, "test3", "Query result should contain field");
  });

  it("should execute a simple unsuccessful query and display error", async () => {
    await mainPage.setQueryText('{"name":"test4}');
    await mainPage.clickRunQueryButton();

    const resultText = await mainPage.getQueryResultText();

    assert.include(
      resultText,
      "Invalid query or server error.",
      'Query result should not contain "Invalid Query"'
    );
  });
});

describe("Advanced View Toggle Test", () => {
  it("should toggle advanced view and toggle query history", async () => {
    await browser.reloadSession();

    const mainPage = new MainPage();

    await mainPage.toggleAdvancedView();

    const queryHistorySection = await mainPage.queryHistoryResults;

    // Assert that the "Query History" section is visible
    await expect(queryHistorySection).toBeDisplayed();

    await mainPage.toggleAdvancedView();
    await expect(queryHistorySection).not.toBeDisplayed();
  });
});

describe("Viewing Results in JSON Format", async () => {
  it("should successfully run a find query and have a Query Result in JSON format", async () => {
    const mainPage = new MainPage();
    await mainPage.setQueryText(`{"name":"test1"}`);
    await mainPage.clickRunQueryButton();

    const resultText = await mainPage.getQueryResultText();

    await expect(resultText).toContain(`"name": "test1"`);
  });
});

describe("Change the Advanced View", async () => {
  let mainPage: MainPage;

  beforeEach(() => {
    mainPage = new MainPage();
  });

  it("should successfully toggle Advanced view: on", async () => {
    await browser.reloadSession();

    let isToggleOff = await mainPage.getToggleValue();
    await expect(isToggleOff).toBe(false);

    await mainPage.toggleAdvancedView();
    isToggleOff = await mainPage.getToggleValue();

    expect(isToggleOff).toBe(true);

    const queryHistorySection = await mainPage.queryHistoryResults;

    expect(queryHistorySection).toBeDisplayed();
  });

  it("should successfully toggle Advanced view: off", async () => {
    await mainPage.toggleAdvancedView();
    const isToggleOff = await mainPage.getToggleValue();

    expect(isToggleOff).toBe(false);

    const queryHistorySection = await mainPage.queryHistoryResults;

    expect(queryHistorySection).not.toBeDisplayed();
  });
});

describe("Settings", async () => {
  let appMenu: MenuBar;

  beforeEach(() => {
    appMenu = new MenuBar("MongoDB Query Executor");
  });

  it("should successfully show the Settings menu", async () => {
    await browser.reloadSession();

    const appMenuExists = await appMenu.doesAppMenuExist();

    assert.equal(
      appMenuExists,
      true,
      "MongoDB Query Executor menu item exists"
    );

    const successfulClickOnAppMenu = await appMenu.doMenuClickById("appName");

    assert.equal(
      successfulClickOnAppMenu,
      true,
      "Click on MongoDB Query Executor"
    );

    const hasCorrectSubmenuItems = await appMenu.checkMenuItems();

    assert.equal(
      hasCorrectSubmenuItems,
      true,
      "Has three necessary submenu items"
    );
  });

  it("should successfully open the Settings menu", async () => {
    await browser.reloadSession();

    const settingsModal = new Modal();

    const appMenuExists = await appMenu.doesAppMenuExist();

    assert.equal(
      appMenuExists,
      true,
      "MongoDB Query Executor menu item exists"
    );

    const successfulClickOnAppMenu = await appMenu.doMenuClickById("appName");

    assert.equal(
      successfulClickOnAppMenu,
      true,
      "Click on MongoDB Query Executor"
    );

    const successfulClickOnSettingMenu = await appMenu.doMenuClickById(
      "settings"
    );

    assert.equal(successfulClickOnSettingMenu, true, "Click on Settings");

    const settingsModalVisible = await settingsModal.modal;

    await expect(settingsModalVisible).toBeDisplayed();
  });

  it("should show the Settings menu options", async () => {
    await browser.reloadSession();

    const settingsModal = new Modal();

    await appMenu.doMenuClickById("settings");
    const settingsModalVisible = await settingsModal.modal;
    await expect(settingsModalVisible).toBeDisplayed();

    const lightThemeRadio = await settingsModal.lightThemeRadio;
    await expect(lightThemeRadio).toBeDisplayed();

    const darkThemeRadio = await settingsModal.darkThemeRadio;
    await expect(darkThemeRadio).toBeDisplayed();

    const systemThemeRadio = await settingsModal.systemThemeRadio;
    await expect(systemThemeRadio).toBeDisplayed();

    const uriInput = await settingsModal.uriInput;
    await expect(uriInput).toBeDisplayed();

    const databaseNameInput = await settingsModal.databaseNameInput;
    await expect(databaseNameInput).toBeDisplayed();

    const collectionNameInput = await settingsModal.collectionNameInput;
    await expect(collectionNameInput).toBeDisplayed();

    const applyButton = await settingsModal.applyButton;
    await expect(applyButton).toBeDisplayed();

    const cancelButton = await settingsModal.cancelButton;
    await expect(cancelButton).toBeDisplayed();
  });

  it("should show the default options in the Settings menu", async () => {
    await browser.reloadSession();

    const settingsModal = new Modal();

    await appMenu.doMenuClickById("settings");
    const settingsModalVisible = await settingsModal.modal;
    await expect(settingsModalVisible).toBeDisplayed();

    const systemThemeRadio = await settingsModal.systemThemeRadio;
    await expect(systemThemeRadio).toBeChecked();

    const uriInput = await settingsModal.uriInput;
    await expect(uriInput).toHaveValue("mongodb://localhost:27017");

    const databaseNameInput = await settingsModal.databaseNameInput;
    await expect(databaseNameInput).toHaveValue("test");

    const collectionNameInput = await settingsModal.databaseNameInput;
    await expect(collectionNameInput).toHaveValue("test");
  });
});

describe("Select Theme", async () => {
  let appMenu: MenuBar;
  let settingsModal: Modal;

  beforeEach(() => {
    appMenu = new MenuBar("MongoDB Query Executor");
    settingsModal = new Modal();
  });

  it("should show the default Theme", async () => {
    await browser.reloadSession();

    const appMenuExists = await appMenu.doesAppMenuExist();

    assert.equal(
      appMenuExists,
      true,
      "MongoDB Query Executor menu item exists"
    );

    const successfulClickOnAppMenu = await appMenu.doMenuClickById("appName");

    assert.equal(
      successfulClickOnAppMenu,
      true,
      "Click on MongoDB Query Executor"
    );

    const successfulClickOnSettingMenu = await appMenu.doMenuClickById(
      "settings"
    );

    assert.equal(successfulClickOnSettingMenu, true, "Click on Settings");

    const systemThemeRadio = await settingsModal.systemThemeRadio;
    await expect(systemThemeRadio).toBeChecked();
  });

  it("should click the Cancel button", async () => {
    await browser.reloadSession();

    const successfulClickOnSettingMenu = await appMenu.doMenuClickById(
      "settings"
    );

    assert.equal(successfulClickOnSettingMenu, true, "Click on Settings");

    await settingsModal.selectTheme("dark");

    await settingsModal.clickCancelButton();

    const theme = process.env.WDIO_THEME;

    const rootClassList = await browser.$("html").getAttribute("class");

    if (theme === "dark") {
      assert.include(
        rootClassList,
        "dark-theme",
        "The root element does not have the 'dark-theme' class as expected."
      );
      assert.notInclude(
        rootClassList,
        "light-theme",
        "The root element incorrectly has the 'light-theme' class when it should not."
      );
    } else {
      assert.include(
        rootClassList,
        "light-theme",
        "The root element does not have the 'light-theme' class as expected."
      );
      assert.notInclude(
        rootClassList,
        "dark-theme",
        "The root element incorrectly has the 'dark-theme' class when it should not."
      );
    }
  });

  it("should click the Apply button", async () => {
    await browser.reloadSession();

    const successfulClickOnSettingMenu = await appMenu.doMenuClickById(
      "settings"
    );
    assert.equal(successfulClickOnSettingMenu, true, "Click on Settings");

    await settingsModal.selectTheme("dark");

    await settingsModal.clickApplyButton();

    const rootClassList = await browser.$("html").getAttribute("class");

    assert.include(
      rootClassList,
      "dark-theme",
      "The root element does not have the 'dark-theme' class as expected."
    );
    assert.notInclude(
      rootClassList,
      "light-theme",
      "The root element incorrectly has the 'light-theme' class when it should not."
    );
  });
});

//Maintainable Acceptance Test start

describe("Version", async () => {
  let mainPage: MainPage;

  const githubStubDsl = new GithubStubDsl(
    new GithubStubDriver(
      new WireMock(`${process.env.WIREMOCK_HOST}:${process.env.WIREMOCK_PORT}`)
    )
  );

  beforeEach(() => {
    mainPage = new MainPage();
  });

  it("should successfully check version against stub", async () => {
    const appVersion = await githubStubDsl.getVersion();

    await expect(appVersion).toBeDefined();
  });
});

//Maintainable Acceptance Test end

describe.skip("Advanced View Startup Preference", async () => {
  it("should enable Advanced View on startup", async () => {
    await browser.reloadSession();

    const mainPage = new MainPage();

    const settingsModal = new Modal();

    const appMenu = new MenuBar("MongoDB Query Executor");

    const appMenuExists = await appMenu.doesAppMenuExist();

    assert.equal(
      appMenuExists,
      true,
      "MongoDB Query Executor menu item exists"
    );

    const successfulClickOnAppMenu = await appMenu.doMenuClickById("appName");

    assert.equal(
      successfulClickOnAppMenu,
      true,
      "Click on MongoDB Query Executor"
    );

    const successfulClickOnSettingMenu = await appMenu.doMenuClickById(
      "settings"
    );

    assert.equal(successfulClickOnSettingMenu, true, "Click on Settings");

    const settingsModalVisible = await settingsModal.modal;

    await expect(settingsModalVisible).toBeDisplayed();

    await settingsModal.clickAdvancedViewOnStartCheckbox();
    await settingsModal.clickApplyButton();

    await browser.reloadSession();

    const queryHistoryResults = await mainPage.queryHistoryResults;

    await expect(queryHistoryResults).toBeDisabled();
  });
});
