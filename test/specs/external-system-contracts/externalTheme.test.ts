import { browser } from "wdio-electron-service";

describe("External System Contracts Test", () => {
  it("should check that application theme corresponds to the OS theme", async () => {
    // Verify the class on the root element
    const rootClassList = await browser.$("html").getAttribute("class");

    console.log(`Root element class list: ${rootClassList}`);

    await expect(rootClassList).toContain("light-theme");
    await expect(rootClassList).not.toContain("dark-theme");
  });
});
