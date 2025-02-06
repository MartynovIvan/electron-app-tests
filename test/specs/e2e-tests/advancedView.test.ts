import { browser } from "wdio-electron-service";

import { AppDsl, AppDrivers } from "../../utils/DSL/dsl";
import { Channels } from "../../utils/const";

describe("Advanced View Toggle Test", () => {
  const application = new AppDsl(new AppDrivers([Channels.UI, Channels.API]));

  it("should toggle advanced view and toggle query history", async () => {
    const queryHistorySection =
      await application.getQueryHistoryResultsContainer();

    await expect(queryHistorySection).toBeDisplayed();

    await application.toggleAdvancedView();

    await expect(queryHistorySection).not.toBeDisplayed();
  });
});

describe("Change the Advanced View", async () => {
  const application = new AppDsl(new AppDrivers([Channels.UI, Channels.API]));

  it("should successfully toggle Advanced view: on", async () => {
    await browser.reloadSession();

    let isToggleOff = await application.getAdvancedViewToggleValue();
    await expect(isToggleOff).toBe(false);

    await application.toggleAdvancedView();
    isToggleOff = await application.getAdvancedViewToggleValue();

    expect(isToggleOff).toBe(true);

    const queryHistorySection =
      await application.getQueryHistoryResultsContainer();

    expect(queryHistorySection).toBeDisplayed();
  });

  it("should successfully toggle Advanced view: off", async () => {
    await application.toggleAdvancedView();
    const isToggleOff = await application.getAdvancedViewToggleValue();

    expect(isToggleOff).toBe(false);

    const queryHistorySection =
      await application.getQueryHistoryResultsContainer();

    expect(queryHistorySection).not.toBeDisplayed();
  });
});
