import * as Electron from "electron";
import IWindow from "../IWindow";
import KeyBinder from "./KeyBinder";
export default class MainWindow extends Electron.BrowserWindow implements IWindow{
    private isDebugMode: boolean;
    private window: Electron.BrowserWindow;
    private keyBinder: KeyBinder;

    constructor() {
        const primaryDisplay = Electron.screen.getPrimaryDisplay();

        super({
            height: primaryDisplay.bounds.height * 0.5, 
            width: primaryDisplay.bounds.width * 0.55, 
            show: false,
            webPreferences: {
                nodeIntegration: false,
            },
        });
        this.loadURL("https://music.youtube.com/");
        this.once("ready-to-show", () => this.onceReadyToShow());
    }

    /**
     * Emitted when the web page has been rendered (while not being shown) and window
     * can be displayed without a visual flash.
     */
    private onceReadyToShow(): void {
        if (this.isDebugMode){
            this.webContents.openDevTools({
                mode: "undocked",
            });
        }
        this.show();
    }

    /**
     * Bind to events called from the render thread.
     * This allows injection of javascript into the webview with callbacks
     */
    private bindToRenderThreadEvents(): void {

        // TODO: On Web Request for next track etc (On request of https://music.youtube.com/youtubei/v1/next)
    }

}
