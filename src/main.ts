import { app, BrowserWindow, globalShortcut, Menu, Tray } from "electron";
import * as path from "path";
const debug = true;

let mainWindow: Electron.BrowserWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: false,
    },
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadURL("https://music.youtube.com/");

  // Open the DevTools.
  if (debug) {
    require("devtron").install();
    mainWindow.webContents.openDevTools({ mode: "undocked"});
  }

  // Emitted when the window is closed.
  mainWindow.on("close", (event) => {
    console.log(event);
    //event.preventDefault();
    mainWindow.hide();
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // mainWindow = null;
  });

  mainWindow.once("ready-to-show", () => {
    console.log("Registering...");
    mainWindow.show();
    const status = globalShortcut.register("MediaPlayPause", () => {
      console.log("Whoop!");
      mainWindow.webContents.executeJavaScript('document.getElementsByClassName("play-pause-button")[0].click()');
    });
    console.log(status);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
