export class MenuBar {
  title?: string;

  constructor(title?: string) {
    this.title = title;
  }

  //Retrives app name
  get appName() {
    return this.title;
  }

  //Interactions
  // Simulates a click on the apply button in the settings modal.
  async doesAppMenuExist() {
    return browser.electron.execute(async (electron, title) => {
      return Boolean(
        electron.Menu.getApplicationMenu()?.getMenuItemById("appName")
          ?.label === title &&
          electron.Menu.getApplicationMenu()?.getMenuItemById("appName")
            ?.visible
      );
    }, this.appName);
  }

  async doMenuClickById(id: string) {
    return browser.electron.execute(async (electron, id) => {
      const appMenu = electron.Menu.getApplicationMenu()?.getMenuItemById(id);
      if (appMenu) {
        appMenu.click();
        return true;
      }
      return false;
    }, id);
  }

  async checkMenuItems() {
    return browser.electron.execute(async (electron, title) => {
      return Boolean(
        electron.Menu.getApplicationMenu()?.getMenuItemById("about")?.label ===
          `About ${title}` &&
          electron.Menu.getApplicationMenu()?.getMenuItemById("about")
            ?.visible &&
          electron.Menu.getApplicationMenu()?.getMenuItemById("settings")
            ?.label === "Settings" &&
          electron.Menu.getApplicationMenu()?.getMenuItemById("settings")
            ?.visible &&
          electron.Menu.getApplicationMenu()?.getMenuItemById("quit")?.label ===
            `Quit ${title}` &&
          electron.Menu.getApplicationMenu()?.getMenuItemById("quit")?.visible
      );
    }, this.appName);
  }
}

export default MenuBar;
