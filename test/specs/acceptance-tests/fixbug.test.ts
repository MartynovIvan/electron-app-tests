import { assert } from "chai";
import { browser } from "wdio-electron-service";

import MainPage from "../../utils/DSL/mainPage";
import Modal from "../../utils/DSL/modal";
import MenuBar from "../../utils/DSL/menuBar";

import { WireMock } from "wiremock-captain";
import { ThemeStubDriver } from "../../utils/drivers/ThemeStubDriver";
import { RealThemeDriver } from "../../utils/drivers/ThemeStubDriver";
import { ThemeStubDsl } from "../../utils/DSL/ThemeStubDsl";

import { AppDsl, AppDrivers } from "../../utils/DSL/dsl";

describe("Theme Change Acceptance Test", async () => {
  let app: AppDrivers;
  let themeStub: ThemeStubDsl;
  const wireMock = new WireMock(`${process.env.WIREMOCK_HOST}:${process.env.WIREMOCK_PORT}`);

  let appMenu: MenuBar;
  let settingsModal: Modal;
  let mainPage: MainPage;

  beforeEach(async () => {
    app = new AppDrivers(wireMock);
    // For this test we use the real driver so we can trigger system theme changes.
    themeStub = new ThemeStubDsl(new RealThemeDriver(wireMock));
    appMenu = new MenuBar("MongoDB Query Executor");
    settingsModal = new Modal();
    mainPage = new MainPage();
  });

  it("should use the related background colour for Query results and Query History fields", async () => {
    // Given the app has already opened using the light theme (handled by test setup)
    await themeStub.willReturnLightTheme();

    // And Advanced view is toggled on
    await mainPage.toggleAdvancedView();

    // Open Settings and set theme to “system”
    const successfulClickOnSettingMenu = await appMenu.doMenuClickById("settings");
    assert.equal(successfulClickOnSettingMenu, true, "Click on Settings");
    await settingsModal.selectTheme("system");
    await settingsModal.clickApplyButton();

    // When the computer appearance is changed from Light to Dark theme
    await themeStub.willReturnDarkTheme();
    await app.themeStubDsl.setTheme("system");

    // Instead of checking the <html> class list, we now verify that the cards have the dark background colour.
    // Define the expected dark background color (derived from #1e1e1e)
    const expectedDarkBg = "rgb(30, 30, 30)";

    // Get the Query Results container element by its test id
    const queryResultElem = await browser.$('[data-testid="queryResult"]');
    // Get the Query History container element by its test id (where the bug was observed)
    const queryHistoryElem = await mainPage.queryHistoryResults;

    // Retrieve the computed background colors
    const queryResultBg = await queryResultElem.getCSSProperty("background-color");
    const queryHistoryBg = await queryHistoryElem.getCSSProperty("background-color");

    // Assert that both elements have the expected dark background color
    assert.equal(
      queryResultBg.value,
      expectedDarkBg,
      "The Query Results container does not have the expected dark background color."
    );
    assert.equal(
      queryHistoryBg.value,
      expectedDarkBg,
      "The Query History container does not have the expected dark background color."
    );
  });
});