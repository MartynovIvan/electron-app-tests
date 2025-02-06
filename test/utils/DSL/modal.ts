import { THEME } from "../const";

export class SettingsModal {
  // Selectors

  // Retrieves the URI input field in the settings modal.
  get modal(): Promise<WebdriverIO.Element> {
    return Promise.resolve($('[data-testid="settingsModal"]'));
  }

  // Retrieves the URI input field in the settings modal.
  get uriInput(): Promise<WebdriverIO.Element> {
    return Promise.resolve($('[data-testid="URI"]'));
  }

  // Retrieves the database name input field in the settings modal.
  get databaseNameInput(): Promise<WebdriverIO.Element> {
    return Promise.resolve($('[data-testid="databaseName"]'));
  }

  // Retrieves the collection name input field in the settings modal.
  get collectionNameInput(): Promise<WebdriverIO.Element> {
    return Promise.resolve($('[data-testid="collectionName"]'));
  }

  // Retrieves the light theme radio button in the settings modal.
  get lightThemeRadio(): Promise<WebdriverIO.Element> {
    return Promise.resolve($('[data-testid="lightThemeSelector"]'));
  }

  // Retrieves the dark theme radio button in the settings modal.
  get darkThemeRadio(): Promise<WebdriverIO.Element> {
    return Promise.resolve($('[data-testid="darkThemeSelector"]'));
  }

  // Retrieves the system theme radio button in the settings modal.
  get systemThemeRadio(): Promise<WebdriverIO.Element> {
    return Promise.resolve($('[data-testid="systemThemeSelector"]'));
  }

  // Retrieves apply modal button
  get applyButton(): Promise<WebdriverIO.Element> {
    return Promise.resolve($('[data-testid="applySeetingsModalButton"]'));
  }

  // Retrieves cancel modal button
  get cancelButton(): Promise<WebdriverIO.Element> {
    return Promise.resolve($('[data-testid="cancelSeetingsModalButton"]'));
  }

  // Retrieves cancel modal button
  get advancedViewOnStartCheckbox(): Promise<WebdriverIO.Element> {
    return Promise.resolve($('[data-testid="advancedViewOnStartCheckbox"]'));
  }

  // Interactions

  // Updates the URI in the settings modal.
  async setURI(uri: string): Promise<void> {
    const uriInput = await this.uriInput;
    await uriInput.setValue(uri);
  }

  // Updates the database name in the settings modal.
  async setDatabaseName(name: string): Promise<void> {
    const dbNameInput = await this.databaseNameInput;
    await dbNameInput.setValue(name);
  }

  // Updates the collection name in the settings modal.
  async setCollectionName(name: string): Promise<void> {
    const collectionNameInput = await this.collectionNameInput;
    await collectionNameInput.setValue(name);
  }

  // Selects a theme in the settings modal.
  async selectTheme(theme: THEME): Promise<void> {
    const themeSelectorMap = {
      [THEME.LIGHT]: await this.lightThemeRadio,
      [THEME.DARK]: await this.darkThemeRadio,
      [THEME.SYSTEM]: await this.systemThemeRadio,
    };
    const themeInput = themeSelectorMap[theme];
    await themeInput.click();
  }

  // Simulates a click on the apply button in the settings modal.
  async clickApplyButton(): Promise<void> {
    const button = await this.applyButton;
    await button?.click();
  }

  // Simulates a click on the cancel button in the settings modal.
  async clickCancelButton(): Promise<void> {
    const button = await this.cancelButton;
    await button?.click();
  }

  // Simulates a click on advancedViewOnStart checkbox
  async clickAdvancedViewOnStartCheckbox(): Promise<void> {
    const advancedViewOnStartCheckbox = await this.advancedViewOnStartCheckbox;
    await advancedViewOnStartCheckbox?.click();
  }
}

export default SettingsModal;
