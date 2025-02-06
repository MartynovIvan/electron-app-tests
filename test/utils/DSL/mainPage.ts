import { browser } from "@wdio/globals";
export class MainPage {
  // Selectors

  // Retrieves the button element responsible for running queries.
  get runQueryButton(): Promise<WebdriverIO.Element> {
    return Promise.resolve($('[data-testid="runQueryButton"]'));
  }

  // Retrieves the input field for entering query text
  get queryTextField(): Promise<WebdriverIO.Element> {
    return Promise.resolve($('[data-testid="query"]'));
  }

  // Retrieves the query result container element
  get queryResultContainer(): Promise<WebdriverIO.Element> {
    return Promise.resolve($('[data-testid="queryResult"]'));
  }

  // Retrieves the toggle switch for advanced view
  get advancedViewToggle(): Promise<WebdriverIO.Element> {
    return Promise.resolve($('[data-testid="advancedViewToggle"]'));
  }

  // Retrieves the query history list container
  get queryHistoryResults(): Promise<WebdriverIO.Element> {
    return Promise.resolve($('[data-testid="queryHistory"]'));
  }

  // Retrieves the query history list container
  get queryHistoryResultsAllElements(): Promise<Array<WebdriverIO.Element>> {
    return Promise.resolve($$('[data-testid="queryHistorySingleElement"]'));
  }

  // Retrieves the new version banner
  get newVersionBanner(): Promise<WebdriverIO.Element> {
    return Promise.resolve($('[data-testid="versionBanner"]'));
  }

  //Interactions

  // Simulates a click on the run query button.
  async clickRunQueryButton(): Promise<void> {
    const button = await this.runQueryButton;
    await button?.click();
  }

  // Sets the query text in the query text field.
  async setQueryText(query: string): Promise<void> {
    const inputField = await this.queryTextField;
    await inputField.setValue(query);
  }

  // Retrieves the current query text
  async getQueryText(): Promise<string> {
    const inputField = await this.queryTextField;
    return inputField.getValue();
  }

  // Retrieves the query result as a string
  async getQueryResultText(): Promise<string> {
    const resultContainer = await this.queryResultContainer;
    return resultContainer.getText();
  }

  // Retrieves the toggle value
  async getToggleValue(): Promise<boolean> {
    const toggle = await this.advancedViewToggle;
    return toggle.isSelected();
  }

  // Toggles the advanced view switch.
  async toggleAdvancedView(): Promise<void> {
    const toggle = await this.advancedViewToggle;
    await toggle.click(); // Simulates a user click to toggle the checkbox
  }

  async findClickMinusTwoQueriesInHistory(): Promise<void> {
    const results = await this.queryHistoryResultsAllElements;
    const minusTwoQueriesFromLast = results[results.length - 3];
    await minusTwoQueriesFromLast.click();
  }

  async getLastQueryHistoryText(): Promise<string> {
    const lastElement = $(
      '[data-testid="queryHistorySingleElement"]:last-of-type'
    );
    const lastElementText = await lastElement.getText();
    return lastElementText;
  }

  async clickRandomItemInHistory(): Promise<void> {
    const results = await this.queryHistoryResultsAllElements;
    const randomIndex = Math.floor(Math.random() * results.length);
    const randomElement = results[randomIndex];
    await randomElement.click();
  }

  // Retrieve application's title
  async getApplicationTitle(): Promise<string> {
    return browser.getTitle();
  }

  // Retrieve application's title
  async checkApplicationIsReady(): Promise<boolean | undefined> {
    const status = await browser.status();
    return status.ready;
  }

  async getAppVersion() {
    return browser.electron.execute(async (electron) => {
      return electron.app.getVersion();
    });
  }

  async getAppStubResponse() {
    const response = await fetch(process.env.VITE_VERSION_API as string);
    return response;
  }

  async getRealThemeVersionFromGithub() {
    const response = await fetch(
      "https://api.github.com/repos/vaisakhsasikumar/my-electron-app/releases/latest",
      {
        headers: {
          "Content-Type": "application/json",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN as string}` }
            : {}),
        },
      }
    );
    return response;
  }
}

export default MainPage;
