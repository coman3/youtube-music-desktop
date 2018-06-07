// tslint:disable:object-literal-sort-keys
// tslint:disable:jsdoc-format

import * as Storage from "electron-json-storage";
import ConfigItem from "./ConfigItem";

export const DEFAULT_STANDARD_KEYBINDING = {
    PLAY_PAUSE: "MediaPlayPause",
    NEXT_TRACK: "MediaNextTrack",
    PREV_TRACK: "MediaPreviousTrack",
    /**
     * Using Shift + Play Pause to like a track so that if the user
     * accidentally does not press shift it will not skip the track.
    */
    LIKE_TRACK: "Shift+MediaPlayPause",
    /**
     * Using CommandOrControl + Next Track so even if the user
     * does not press CommandOrControl it will skip anyway
     */
    DISLIKE_TRACK: "CommandOrControl+MediaNextTrack",
};

export const DEFAULT_LIKE_DISLIKE_KEYBINDING = {
    PLAY_PAUSE: "MediaPlayPause",
    NEXT_TRACK: "",
    PREV_TRACK: "CommandOrControl+MediaPreviousTrack",
    /**
     * Like the song, but keep it playing
    */
    LIKE_TRACK: "MediaPreviousTrack",
    /**
     * Automatically dislike and skip the song
     */
    DISLIKE_TRACK: "MediaNextTrack",
};

export const SUPPORTED_KEYBINDINGS = ["playPause", "nextTrack", "prevTrack", "likeTrack", "dislikeTrack"];
export const SUPPORTED_KEYBINDING = {
    playPause: "playPause",
    nextTrack: "nextTrack",
    prevTrack: "prevTrack",
    likeTrack: "likeTrack",
    dislikeTrack: "dislikeTrack",
};

export const CONFIG_KEYBINDINGS = "CONFIG_KEYBINDINGS";

export interface IKeyBindingDictionary<T> { [key: string]: T; }

export default class KeybindingConfigItem extends ConfigItem {

     /**
     * Load the configuration from storage
     * @param setDefault Set the config to default if not found
     */
    public static async load(setDefault: boolean = true): Promise<KeybindingConfigItem> {
       return new Promise<KeybindingConfigItem>((resolver, rejector) => {
            Storage.get(CONFIG_KEYBINDINGS, (error: Error, data: any) => {
                if (error != null){
                    return rejector(error);
                }

                if (setDefault === true && data.lastUpdated === undefined) 
                    // set default is set to true, and the response was empty (had no last updated field)
                {
                    const defaultData = new KeybindingConfigItem();
                    return resolver(defaultData); 
                }

                /*  
                    Cast data into a KeybindingConfigItem type, 
                    then construct it as new so that we can save and update it.
                */
                return resolver(new KeybindingConfigItem(data as KeybindingConfigItem));
            });
        });
    }
    public Bindings: IKeyBindingDictionary<string> = {
        /**
         * Toggle Playing or Paused
         */
        playPause: DEFAULT_STANDARD_KEYBINDING.PLAY_PAUSE,

        /**
         * Skip to the next track / Skip forward a track
         */
        nextTrack: DEFAULT_STANDARD_KEYBINDING.NEXT_TRACK,

        /**
         * Skip to the previous track / Skip back a track
         */
        prevTrack: DEFAULT_STANDARD_KEYBINDING.PREV_TRACK,

        /**
         * Like this track
         */
        likeTrack: DEFAULT_STANDARD_KEYBINDING.LIKE_TRACK,

        /**
         * Dislike this track
         */
        dislikeTrack: DEFAULT_STANDARD_KEYBINDING.DISLIKE_TRACK,
    };

    

    constructor(objectValue: KeybindingConfigItem = null){
        super();
        if (objectValue != null){
            // Load from previous object
            this.Bindings = objectValue.Bindings;
            this.lastUpdated = objectValue.lastUpdated;
        }
    }


     /**
     * Load the configuration from storage
     * @param setDefault Set the config to default if not found
     */
    public async save(): Promise<void> {
        return new Promise<void>((resolver, rejector) => {
            this.lastUpdated = new Date();
            Storage.set(CONFIG_KEYBINDINGS, this, (error) => {
                if (error != null)
                    return rejector(error);
                return resolver();
            });
         });
     }

}
