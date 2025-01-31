import { IWireMockRequest, IWireMockResponse, WireMock } from "wiremock-captain";

/**
 * ThemeStubDriver handles mocking of the /api/theme endpoint using WireMock.
 */
export class ThemeStubDriver {
  private wireMock: WireMock;

  constructor(wireMock: WireMock) {
    this.wireMock = wireMock;
  }

  /**
   * Configures WireMock to return the specified theme.
   * @param theme - The theme to return ('light' or 'dark').
   */
  async setTheme(theme: 'light' | 'dark') {
    const themeRequest: IWireMockRequest = {
      method: "GET",
      endpoint: "/api/theme"
    };

    const themeResponse: IWireMockResponse = {
      status: 200,
      body: JSON.stringify({ theme }),
      headers: {
        "Content-Type": "application/json"
      }
    };

    // Register the stubbed response
    await this.wireMock.register(themeRequest, themeResponse);
  }

  /**
   * Clears any existing theme mock by resetting WireMock mappings.
   */
  async clearTheme() {
    await this.wireMock.resetMappings();
  }
}