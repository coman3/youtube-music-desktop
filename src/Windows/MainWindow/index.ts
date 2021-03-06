import * as Electron from "electron";
import { SUPPORTED_KEYBINDING } from "../../Models/Config/KeybindingConfigItem";
import IWindow from "../IWindow";
import InjectResolver from "./Actions/InjectResolver";
import KeyBinder from "./KeyBinder";
export default class MainWindow extends Electron.BrowserWindow implements IWindow{
    private isDebugMode: boolean;
    private window: Electron.BrowserWindow;
    private keyBinder: KeyBinder;

    /**
     * Construct the main application window and show it once its ready to be displayed (optional)
     * @param showOnLoaded Show the window once the window has loaded fully.
     * @param bindToKeys Enable binding
     */
    constructor(showOnLoaded: boolean = true, bindToKeys = true) {
        const primaryDisplay = Electron.screen.getPrimaryDisplay();
        super({
            height: primaryDisplay.bounds.height * 0.5, 
            width: primaryDisplay.bounds.width * 0.55, 
            show: false,
            webPreferences: {
                // DO NOT allow website to execute node commands
                // this can be fatal to any computer, even though it is coming from a trusted source (IE, Google)
                nodeIntegration: false, 
            },
        });
        this.isDebugMode = true;
        this.loadURL("https://music.youtube.com/");
        this.once("ready-to-show", () => this.onceReadyToShow(showOnLoaded, bindToKeys));
    }

    /**
     * Bind to media and other key commands / shortcuts.
     */
    public async bindToKeys(): Promise<void> {
        this.keyBinder = new KeyBinder(Electron.globalShortcut);
        await this.keyBinder.loadConfig();
        this.keyBinder.KeyBinds[SUPPORTED_KEYBINDING.playPause].on(() => {

            
        });

        await this.keyBinder.bind();
    }

    /**
     * Revoke bind to media and other key commands / shortcuts.
     */
    public async unbindFromKeys(): Promise<void> {
        if (this.keyBinder == null) return; // already unbinded
        await this.keyBinder.unbind();
        await this.keyBinder.saveConfig(); // Save the config (incase it had changed)
        this.keyBinder = null; // Demolish key binder
    }

    /**
     * Emitted when the web page has been rendered (while not being shown) and window
     * can be displayed without a visual flash.
     */
    private async onceReadyToShow(showOnLoaded: boolean, bindToKeys: boolean): Promise<void> {

        // Firstly, Inject interface javascript. 
        this.webContents.executeJavaScript(await InjectResolver());
        this.webContents.executeJavaScript("initInjection()");

        console.log("Injected Interface");
        if (this.isDebugMode){
            this.webContents.openDevTools({
                mode: "undocked",
            });
        }
        if (showOnLoaded) // Requested to show the application once the page has loaded.
            this.show();
        if (bindToKeys) {
            this.bindToKeys();
        }
        this.bindToRenderThreadEvents();
    }   

    /**
     * Bind to events called from the render thread.
     * This allows injection of javascript into the webview with callbacks
     */
    private bindToRenderThreadEvents(): void {

        // TODO: On Web Request for next track etc 
        /* 
            For Example:    On request of https://music.youtube.com/youtubei/v1/next) 
                            update media info in operating system 
        */

       Electron.ipcMain.on("launch-test", (event: Electron.Event, arg: any) => {
            console.log(event, arg);
       });
    }

}
