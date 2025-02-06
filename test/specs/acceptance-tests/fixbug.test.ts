import { WireMock } from "wiremock-captain";
import { browser } from "wdio-electron-service";

import { Channels, THEME } from "../../utils/const";
import { AppDrivers, AppDsl } from "../../utils/DSL/dsl";
import { ThemeStubDsl } from "../../utils/DSL/ThemeStubDsl";
import { ThemeStubDriver } from "../../utils/drivers/ThemeDrivers";

describe("Theme Change Acceptance Test", async () => {
  const application = new AppDsl(new AppDrivers([Channels.UI, Channels.API]));

  const themeStub = new ThemeStubDsl(
    new ThemeStubDriver(
      new WireMock(`${process.env.WIREMOCK_HOST}:${process.env.WIREMOCK_PORT}`)
    )
  );

  it("should use the related background colour for Query results and Query History fields", async () => {
    await browser.reloadSession();

    // Given the app has already opened using the light theme
    await themeStub.willReturnLightTheme();

    // And Advanced view is toggled on
    await application.toggleAdvancedView();

    await application.clickOnAppMenu();

    await application.clickOnSettingsMenu();

    await application.selectApplicationTheme(THEME.SYSTEM);

    await application.clickApplySettings();

    await themeStub.willReturnDarkTheme();

    await themeStub.setTheme(THEME.SYSTEM);

    await application.setQuery("{}");

    await application.clickRunQuery();

    // Define the expected dark background color (as provided)
    const expectedDarkBg = "rgba(0,0,0,0)";

    const queryResultElem = await application.getQueryResultContainer();

    const queryHistoryElem =
      await application.getQueryHistoryResultsContainer();

    await application.checkApplicationElementHasExpectedBackgroundColor(
      queryResultElem,
      expectedDarkBg
    );

    await application.checkApplicationElementHasExpectedBackgroundColor(
      queryHistoryElem,
      expectedDarkBg
    );
  });
});
