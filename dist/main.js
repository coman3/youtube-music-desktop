"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var debug = true;
var mainWindow;
function createWindow() {
    // Create the browser window.
    mainWindow = new electron_1.BrowserWindow({
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: false
        },
        width: 800
    });
    // and load the index.html of the app.
    mainWindow.loadURL("https://music.youtube.com/");
    // Open the DevTools.
    if (debug) {
        require("devtron").install();
        mainWindow.webContents.openDevTools({ mode: "undocked" });
    }
    // Emitted when the window is closed.
    mainWindow.on("close", function (event) {
        console.log(event);
        console.log(event.type);
        //event.preventDefault();
        mainWindow.hide();
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        // mainWindow = null;
    });
    mainWindow.once("ready-to-show", function () {
        console.log("Registering...");
        mainWindow.show();
        var status = electron_1.globalShortcut.register("MediaPlayPause", function () {
            console.log("Whoop!");
            mainWindow.webContents.executeJavaScript('document.getElementsByClassName("play-pause-button")[0].click()');
        });
        console.log(status);
    });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on("ready", createWindow);
// Quit when all windows are closed.
electron_1.app.on("window-all-closed", function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("activate", function () {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
//# sourceMappingURL=main.js.map