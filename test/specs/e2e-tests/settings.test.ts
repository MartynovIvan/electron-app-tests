import { browser } from "wdio-electron-service";

import { AppDsl, AppDrivers } from "../../utils/DSL/dsl";
import { Channels } from "../../utils/const";

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
