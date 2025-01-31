import { expect } from "chai";
import MainPage from "../../utils/DSL/mainPage";
import Modal from "../../utils/DSL/modal";
import MenuBar from "../../utils/DSL/menuBar";
import { WireMock } from "wiremock-captain";
import { ThemeStubDsl } from "../../utils/DSL/ThemeStubDsl";

describe("Feature: Change Appearance Based on System Theme with Advanced View On", () => {
  let mainPage: MainPage;
  let settingsModal: Modal;
  let menuBar: MenuBar;
  let themeStubDsl: ThemeStubDsl;
  let wireMock: WireMock;

  before(async () => {
    mainPage = new MainPage();
    settingsModal = new Modal();
    menuBar = new MenuBar("MongoDB Query Executor");

    // Initialize WireMock instance pointing to the mock server
    wireMock = new WireMock(`${process.env.WIREMOCK_HOST}:${process.env.WIREMOCK_PORT}`);
    themeStubDsl = new ThemeStubDsl(wireMock);
  });

  beforeEach(async () => {
    // Clear existing theme mappings before each test to ensure a clean state
    await themeStubDsl.clearThemeStubs();
  });

  after(async () => {
    // Optionally, reset WireMock after all tests run
    await wireMock.resetMappings();
  });

  /**
   * Scenario: Use the related background colour for Query results and Query History fields
   * Given the app has already opened
   * And use the computer appearance Light first
   * And toggle Advanced view: on
   * And see Query results and Query History fields
   * When the computer appearance is changed from Light to Dark theme
   * Then Query Results and Query History fields should show dark background colour
   */
  it("should display dark backgrounds for Query Results and Query History when system theme changes to Dark", async () => {
    // Arrange: Set system theme to 'light'
    await themeStubDsl.setLightTheme();

    // Act:
    // 1. Open Settings via menu
    await menuBar.doMenuClickById("settings");

    // 2. In Settings, select "System" theme and apply
    await settingsModal.selectTheme("system");
    await settingsModal.clickApplyButton();

    // 3. Ensure Advanced view is toggled on
    let isAdvancedViewOn = await mainPage.getToggleValue();
    if (!isAdvancedViewOn) {
      await mainPage.toggleAdvancedView();
    }

    // 4. Simulate system theme change to 'dark'
    await themeStubDsl.setDarkTheme();

    // 5. Reload the application or trigger theme re-fetch if necessary
    //    This step depends on how the app listens to theme changes. If it listens via WebSockets or another method,
    //    additional steps might be required to simulate the change.
    //    For simplicity, we'll assume reloading the session fetches the new theme.
    await browser.reloadSession();

    // Assert:
    // Check that Query Results background is dark
    const queryResultBgColor = await (await mainPage.queryResultContainer).getCSSProperty("background-color");
    expect(queryResultBgColor.parsed.hex).to.equal("#000000", "Query Results should have dark background");

    // Check that Query History background is dark
    const queryHistoryBgColor = await (await mainPage.queryHistoryResults).getCSSProperty("background-color");
    expect(queryHistoryBgColor.parsed.hex).to.equal("#000000", "Query History should have dark background");
  });
});