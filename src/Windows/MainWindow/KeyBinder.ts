
import KeybindingConfigItem, { IKeyBindingDictionary } from "../../Models/Config/KeybindingConfigItem";
import { SUPPORTED_KEYBINDING, SUPPORTED_KEYBINDINGS } from "../../Models/Config/KeybindingConfigItem";
import Event from "../../Models/Event";

export default class KeyBinder {
    public KeyBinds: IKeyBindingDictionary<Event<void>> = {
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
    }

    public async loadConfig(config: KeybindingConfigItem = null): Promise<void> {
        if (config == null)
            this.config = await KeybindingConfigItem.load();
        else 
            this.config = config;
    }

    public async bind(): Promise<void> {
        if (this.config == null) 
            throw Error("Config not loaded.");
        for (const binding of SUPPORTED_KEYBINDINGS) {
            this.globalShortcut.register(this.config.Bindings[binding], () => this.KeyBinds[binding].trigger());
        }
    }

    /**
     * Unbind all key commands
     */
    public async unbind(): Promise<void> {
        this.globalShortcut.unregisterAll();
    }

    /**
     * Save Keybinding Config
     */
    public async saveConfig(): Promise<void> {
        await this.config.save();
    }
    
}

