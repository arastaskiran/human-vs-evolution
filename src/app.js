import { Config } from "./config";
import { Events } from "./events/app_events";
import { Scene } from "./scene";



var config = new Config();
var scene = null;

export const settings = {

    init: (data) => {
        if (config.init) {
            alert("This plugin already init");
            return;
        }
        config.mapConfig(data);
        return settings.events;

    },
    apply: () => {
        scene = new Scene(config, settings.events);
    },
    setFPS: (fps) => {
        if (scene == null) {
            alert("Please run first");
            return;
        }
        scene.setFPS(fps);
    }
}

settings.events = new Events(settings);