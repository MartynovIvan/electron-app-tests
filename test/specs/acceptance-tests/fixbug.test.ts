import { assert } from "chai";
import { browser } from "wdio-electron-service";

import MainPage from "../../utils/DSL/mainPage";
import Modal from "../../utils/DSL/modal";
import MenuBar from "../../utils/DSL/menuBar";

import { WireMock } from "wiremock-captain";
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
    // Use the real theme driver so that system theme can be set.
    themeStub = new ThemeStubDsl(new RealThemeDriver(wireMock));
    appMenu = new MenuBar("MongoDB Query Executor");
    settingsModal = new Modal();
    mainPage = new MainPage();
  });

  it("should use the related background colour for Query results and Query History fields", async () => {
    // Given the app has already opened using the light theme
    await themeStub.willReturnLightTheme();

    // And Advanced view is toggled on
    await mainPage.toggleAdvancedView();

    // Open Settings and set theme to "system"
    const successfulClickOnSettingMenu = await appMenu.doMenuClickById("settings");
    assert.equal(successfulClickOnSettingMenu, true, "Click on Settings");
    await settingsModal.selectTheme("system");
    await settingsModal.clickApplyButton();

    // When the computer appearance is changed from Light to Dark theme
    await themeStub.willReturnDarkTheme();
    await app.themeStubDsl.setTheme("system");

    // Run a dummy query so that the Query Result container is rendered
    const queryInput = await browser.$('[data-testid="query"]');
    await queryInput.setValue("{}");
    const runQueryButton = await browser.$('[data-testid="runQueryButton"]');
    await runQueryButton.click();

    // Wait until the Query Result element appears
    await browser.waitUntil(async () => {
      const elements = await browser.$$( '[data-testid="queryResult"]' );
      return elements.length > 0;
    }, { timeout: 5000, timeoutMsg: 'Expected queryResult to be rendered' } );

    // Define the expected dark background color (derived from #1e1e1e)
    const expectedDarkBg = "rgb(0, 0, 0)";

    // Retrieve the Query Result container element
    const queryResultElem = await browser.$('[data-testid="queryResult"]');
    // Retrieve the Query History container element using the DSL method
    const queryHistoryElem = await mainPage.queryHistoryResults;

    const queryResultBg = await queryResultElem.getCSSProperty("background-color");
    const queryHistoryBg = await queryHistoryElem.getCSSProperty("background-color");

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