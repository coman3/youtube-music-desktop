
import KeybindingConfigItem, { IKeyBindingDictionary } from "../../Models/Config/KeybindingConfigItem";
import { SUPPORTED_KEYBINDING, SUPPORTED_KEYBINDINGS } from "../../Models/Config/KeybindingConfigItem";
import Event from "../../Models/Event";

export default class KeyBinder {
    private keyBinds: IKeyBindingDictionary<Event<void>> = {
        playPause: new Event<void>(),
        nextTrack: new Event<void>(),
        prevTrack: new Event<void>(),
        likeTrack: new Event<void>(),
        dislikeTrack: new Event<void>(),
    };

    private config: KeybindingConfigItem;
    private globalShortcut: Electron.GlobalShortcut;

    constructor(globalShortcut: Electron.GlobalShortcut){
        this.globalShortcut = globalShortcut;
        this.create();
    }
    private async create(): Promise<void> {
        try {
            await this.loadConfig();
            await this.bind();
        } catch (error) {
            console.log("error binding keys");
            // TODO: Present warning to user;
        }
    }

    private async loadConfig(): Promise<void> {
        this.config = await KeybindingConfigItem.load();
    }

    private async bind(): Promise<void> {
        for (const binding of SUPPORTED_KEYBINDINGS) {
            this.globalShortcut.register(this.config.Bindings[binding], () => this.keyBinds[binding].trigger());
        }
    }


    


}

