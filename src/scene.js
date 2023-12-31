import { Config } from "./config";
import { Events } from "./events/app_events";
import { HomeScreen } from "./views/vw_home";
import { BaseScene } from "./base_scane";

export class Scene extends BaseScene {
    /**
     *
     * @param {Config} config
     * @param {Events} event_bus
     */
    constructor(config, event_bus) {
        super(config, event_bus);

        this.screens = {
            home: new HomeScreen(this),
        };
        this.current_screen = "home";
        this.setFPS(config.fps);
        this._srartGame();
    }
}
