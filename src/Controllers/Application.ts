import * as Electron from "electron";
import IWindow from "../Windows/IWindow";
import MainWindow from "../Windows/MainWindow";

const APP_ON_READY = "ready";
const APP_ON_ALL_WINDOWS_CLOSED = "window-all-closed";
const APP_ON_CERTIFICATE_ERROR = "certificate-error";

const APP_ON_ACTIVATE = "activate";

export default class Application {
    private app: Electron.App;
    private windows: IWindow[] = [];
    /**
     * Construct an application controller.
     * This will bind to all required 'app' events and perform application specific stuff.
     * @param app The electron app its self. (Only Required for clarity & sensibility)
     */
    constructor(app: Electron.App){
        this.app = app;
        app.on(APP_ON_READY, (launchInfo) => this.onReady(launchInfo));
        app.on(APP_ON_ALL_WINDOWS_CLOSED, () => this.onAllWindowsClosed());
        app.on(APP_ON_ACTIVATE, () => this.onActivate());


        // Error Handling
        app.on(APP_ON_CERTIFICATE_ERROR, (
            event: Electron.Event,
            webContents: Electron.WebContents,
            url: string,
            /**
             * The error code
             */
            error: string,
            certificate: Electron.Certificate,
            callback: (isTrusted: boolean) => void) =>
            this.onCertificateError(event, webContents, url, error, certificate, callback));
    }

    /**
     * Emitted when Electron has finished initializing.
     * On macOS, launchInfo holds the userInfo of the NSUserNotification that was used to open the application,
     * if it was launched from Notification Center. You can call app.isReady() to check if this event has already fired.
     */
    private onReady(launchInfo: any): void {
        if (this.app.isReady()){
            // looks like the app was launched from a notification
            // TODO: Handle update notifications, etc.
        }
        /* TODO: Check if we already have authenticated,
            if so launch right into the app, otherwise lets launch the login screen
        */
        this.windows.push(new MainWindow());
    }

    /**
     * Emitted when the application is activated.
     * Various actions can trigger this event, such as launching the application for the first time,
     * attempting to re-launch the application when it's already running,
     * or clicking on the application's dock or taskbar icon.
     */

    private onActivate(): void {
        console.log("Ready");
    }


    /**
     * If you do not subscribe to this event and all windows are closed, the default behavior is to quit the app;
     * however, if you subscribe, you control whether the app quits or not.
     * If the user pressed Cmd + Q, or the developer called app.quit(),
     * Electron will first try to close all the windows and then emit the will-quit event,
     * and in this case the window-all-closed event would not be emitted.
     */
    private onAllWindowsClosed(): void {
        if (process.platform !== "darwin") {
            this.app.quit();
        }
    }

    private onCertificateError(
        event: Electron.Event,
        webContents: Electron.WebContents,
        url: string,
        error: string,
        certificate: Electron.Certificate,
        callback: ((isTrusted: boolean) => void)): void {
        console.error("Certificate Error!");
    }
}
