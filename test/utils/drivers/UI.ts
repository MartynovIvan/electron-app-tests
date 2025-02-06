import { browser } from "@wdio/globals";

import { AppDriver } from "../types";
import MainPage from "../DSL/mainPage";
import Modal from "../DSL/modal";
import MenuBar from "../DSL/menuBar";
import { THEME } from "../const";

export class UIAppDriver implements AppDriver {
  private driver: WebdriverIO.Browser = browser;
  private mainPage: MainPage;
  private settingsModal: Modal;
  private menuBar: MenuBar;

  constructor() {
    this.mainPage = new MainPage();
    this.settingsModal = new Modal();
    this.menuBar = new MenuBar("MongoDB Query Executor");
  }

  public async setQuery(query: string) {
    await this.mainPage.setQueryText(query);
  }

  public async clickRunQuery() {
    await this.mainPage.clickRunQueryButton();
  }

  public async getQueryResult() {
    return this.mainPage.getQueryResultText();
  }

  public async toggleAdvancedView() {
    await this.mainPage.toggleAdvancedView();
  }

  public async getQueryHistoryResults() {
    return this.mainPage.queryHistoryResultsAllElements;
  }

  public async getLastQueryFromHistory() {
    return this.mainPage.getLastQueryHistoryText();
  }

  public async clickRandomItemInHistory() {
    await this.mainPage.clickRandomItemInHistory();
  }

  public async getQueryHistoryResultsContainer() {
    return this.mainPage.queryHistoryResults;
  }

  public async getQueryResultContainer() {
    return this.mainPage.queryResultContainer;
  }

  public async getAdvancedViewToggleValue() {
    return this.mainPage.getToggleValue();
  }

  public async clickOnMenuItem(menuId: string) {
    await this.menuBar.doMenuClickById(menuId);
  }
  public async checkAppMenuExist() {
    return this.menuBar.doesAppMenuExist();
  }

  public async checkMenuItems() {
    return this.menuBar.checkMenuItems();
  }

  public async getModalContainer() {
    return this.settingsModal.modal;
  }

  public async getLightThemeSwitchContainer() {
    return this.settingsModal.lightThemeRadio;
  }

  public async getDarkThemeSwitchContainer() {
    return this.settingsModal.darkThemeRadio;
  }

  public async getSystemThemeSwitchContainer() {
    return this.settingsModal.systemThemeRadio;
  }

  public async getUriInputContainer() {
    return this.settingsModal.uriInput;
  }

  public async getDatabaseNameInputContainer() {
    return this.settingsModal.databaseNameInput;
  }

  public async getCollectionNameInputContainer() {
    return this.settingsModal.collectionNameInput;
  }

  public async getApplySettingsButtonContainer() {
    return this.settingsModal.applyButton;
  }

  public async getCancelSettingsButtonContainer() {
    return this.settingsModal.cancelButton;
  }

  public async selectApplicationTheme(theme: THEME) {
    await this.settingsModal.selectTheme(theme);
  }

  public async clickCancelSettings() {
    await this.settingsModal.clickCancelButton();
  }

  public async clickApplySettings() {
    await this.settingsModal.clickApplyButton();
  }

  public async clickAdvancedViewOnStartCheckbox() {
    await this.settingsModal.clickAdvancedViewOnStartCheckbox();
  }
}
