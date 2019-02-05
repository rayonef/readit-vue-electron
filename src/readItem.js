/* eslint-disable import/no-extraneous-dependencies */
import { BrowserWindow } from 'electron';

let bgItemWindow;

export default (url, callback) => {
  // create new offscreen window
  bgItemWindow = new BrowserWindow({
    height: 1000,
    width: 1000,
    show: false,
    webPreferences: { offscreen: true }
  });

  // Load read item
  bgItemWindow.loadURL(url);
  // wait for page to finish loading
  bgItemWindow.webContents.on('did-finish-load', () => {
    // get screenshot
    bgItemWindow.webContents.capturePage(image => {
      const screenshot = image.toDataURL();
      const title = bgItemWindow.getTitle();
      callback({
        title,
        screenshot,
        url
      });

      bgItemWindow.close();
      bgItemWindow = null;
    });
  });
};
