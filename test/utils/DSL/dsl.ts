import { Channels, THEME } from "../const";
import type { AppDriver } from "../types";
import { UIAppDriver } from "../drivers/UI";
import { APIAppDriver } from "../drivers/API";
import { assert } from "chai";

/**
 * AppDrivers manages different drivers based on communication channels.
 */
export class AppDrivers implements AppDriver {
  private drivers = {} as {
    [Channels.UI]: UIAppDriver;
    [Channels.API]: APIAppDriver;
  };

  constructor(channels: Array<Channels>) {
    this.drivers[Channels.UI] = new UIAppDriver();
    this.drivers[Channels.API] = new APIAppDriver();
  }

  get driver() {
    return this.drivers[Channels.UI];
  }

  // @Override
  public async setQuery(query: string) {
    await this.driver.setQuery(query);
  }

  // @Override
  public async clickRunQuery() {
    await this.driver.clickRunQuery();
  }

  // @Override
  public async getQueryResult() {
    return this.driver.getQueryResult();
  }

  public async toggleAdvancedView() {
    await this.driver.toggleAdvancedView();
  }

  public getQueryHistoryResults() {
    return this.driver.getQueryHistoryResults();
  }

  public async getLastQueryFromHistory() {
    return this.driver.getLastQueryFromHistory();
  }

  public async clickRandomItemInHistory() {
    await this.driver.clickRandomItemInHistory();
  }

  public async getQueryHistoryResultsContainer() {
    return this.driver.getQueryHistoryResultsContainer();
  }

  public async getQueryResultContainer() {
    return this.driver.getQueryResultContainer();
  }

  public async getAdvancedViewToggleValue() {
    return this.driver.getAdvancedViewToggleValue();
  }

  public async checkAppMenuExist() {
    return this.driver.checkAppMenuExist();
  }

  public async clickOnMenuItem(menuId: string) {
    await this.driver.clickOnMenuItem(menuId);
  }

  public async checkMenuItems() {
    return this.driver.checkMenuItems();
  }

  public async getModalContainer() {
    return this.driver.getModalContainer();
  }

  public async getLightThemeSwitch() {
    return this.driver.getLightThemeSwitchContainer();
  }
  public async getDarkThemeSwitch() {
    return this.driver.getDarkThemeSwitchContainer();
  }

  public async getSystemThemeSwitch() {
    return this.driver.getSystemThemeSwitchContainer();
  }

  public async getUriInput() {
    return this.driver.getUriInputContainer();
  }

  public async getDatabaseNameInput() {
    return this.driver.getDatabaseNameInputContainer();
  }

  public async getCollectionNameInput() {
    return this.driver.getCollectionNameInputContainer();
  }

  public async getApplySettingsButton() {
    return this.driver.getApplySettingsButtonContainer();
  }

  public async getCancelSettingsButton() {
    return this.driver.getCancelSettingsButtonContainer();
  }

  public async selectApplicationTheme(theme: THEME) {
    await this.driver.selectApplicationTheme(theme);
  }

  public async clickCancelSettings() {
    await this.driver.clickCancelSettings();
  }

  public async clickApplySettings() {
    await this.driver.clickApplySettings();
  }

  public async clickAdvancedViewOnStartCheckbox() {
    await this.driver.clickAdvancedViewOnStartCheckbox();
  }
}

export class AppDsl {
  private driver: AppDrivers;

  constructor(driver: AppDrivers) {
    this.driver = driver;
  }

  public async setQuery(query: string) {
    await this.driver.setQuery(query);
  }

  public async clickRunQuery() {
    await this.driver.clickRunQuery();
  }

  public async getQueryResult() {
    return this.driver.getQueryResult();
  }

  public async toggleAdvancedView() {
    await this.driver.toggleAdvancedView();
  }

  public async getQueryHistoryResults() {
    return this.driver.getQueryHistoryResults();
  }

  public async getQueryHistoryResultsLenght() {
    const history = await this.driver.getQueryHistoryResults();
    return history.length;
  }

  public async getLastQueryFromHistory() {
    return this.driver.getLastQueryFromHistory();
  }

  public async clickRandomItemInHistory() {
    await this.driver.clickRandomItemInHistory();
  }

  public async getQueryHistoryResultsContainer() {
    return this.driver.getQueryHistoryResultsContainer();
  }

  public async getQueryResultContainer() {
    return this.driver.getQueryResultContainer();
  }

  public async getAdvancedViewToggleValue() {
    return this.driver.getAdvancedViewToggleValue();
  }

  public async checkAppMenuExist() {
    const appMenuExists = await this.driver.checkAppMenuExist();

    assert.equal(
      appMenuExists,
      true,
      "MongoDB Query Executor menu item exists"
    );
  }

  public async clickOnAppMenu() {
    await this.driver.clickOnMenuItem("appName");
  }

  public async clickOnSettingsMenu() {
    await this.driver.clickOnMenuItem("settings");
  }

  public async checkMenuItems() {
    const hasCorrectSubmenuItems = await this.driver.checkMenuItems();

    assert.equal(
      hasCorrectSubmenuItems,
      true,
      "Has three necessary submenu items"
    );
  }

  public async checkSettingsMenuVisible() {
    const settingsModalContainer = await this.driver.getModalContainer();

    await expect(settingsModalContainer).toBeDisplayed();
  }
  public async checkSettingsMenuNotVisible() {
    const settingsModalContainer = await this.driver.getModalContainer();

    await expect(settingsModalContainer).not.toBeDisplayed();
  }

  public async checkLightThemeSwitchVisible() {
    const lightThemeRadio = await this.driver.getLightThemeSwitch();
    await expect(lightThemeRadio).toBeDisplayed();
  }

  public async checkDarkThemeSwitchVisible() {
    const darkThemeRadio = await this.driver.getDarkThemeSwitch();
    await expect(darkThemeRadio).toBeDisplayed();
  }

  public async checkSystemThemeSwitchVisible() {
    const systemThemeRadio = await this.driver.getSystemThemeSwitch();
    await expect(systemThemeRadio).toBeDisplayed();
  }

  public async checkUriInputVisible() {
    const uriInput = await this.driver.getUriInput();
    await expect(uriInput).toBeDisplayed();
  }

  public async checkDatabaseNameInputVisible() {
    const databaseNameInput = await this.driver.getDatabaseNameInput();
    await expect(databaseNameInput).toBeDisplayed();
  }

  public async checkCollectionNameInputVisible() {
    const collectionNameInput = await this.driver.getCollectionNameInput();
    await expect(collectionNameInput).toBeDisplayed();
  }

  public async checkApplySettingsButtonVisible() {
    const applyButton = await this.driver.getApplySettingsButton();
    await expect(applyButton).toBeDisplayed();
  }

  public async checkCancelSettingsButtonVisible() {
    const cancelButton = await this.driver.getCancelSettingsButton();
    await expect(cancelButton).toBeDisplayed();
  }

  public async checkDefaultTheme() {
    const systemThemeRadio = await this.driver.getSystemThemeSwitch();
    await expect(systemThemeRadio).toBeChecked();
  }

  public async checkDefaultUri() {
    const uriInput = await this.driver.getUriInput();
    await expect(uriInput).toHaveValue("mongodb://localhost:27017");
  }

  public async checkDefaultDatabaseName() {
    const databaseNameInput = await this.driver.getDatabaseNameInput();
    await expect(databaseNameInput).toHaveValue("test");
  }

  public async checkDefaultCollectionName() {
    const collectionNameInput = await this.driver.getCollectionNameInput();
    await expect(collectionNameInput).toHaveValue("test");
  }

  public async selectApplicationTheme(theme: THEME) {
    await this.driver.selectApplicationTheme(theme);
  }

  public async clickApplySettings() {
    await this.driver.clickApplySettings();
  }

  public async clickAdvancedViewOnStartCheckbox() {
    await this.driver.clickAdvancedViewOnStartCheckbox();
  }

  public async clickCancelSettings() {
    await this.driver.clickCancelSettings();
  }

  public async checkApplicationHasTheme(theme: THEME) {
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
  }

  public async checkApplicationElementHasExpectedBackgroundColor(
    element: WebdriverIO.Element,
    backgroundColor: string
  ) {
    const elementBackgroundColor = await element.getCSSProperty(
      "background-color"
    );

    assert.equal(elementBackgroundColor.value, backgroundColor);
  }
}
