import { Config } from "./config";
import { Events } from "./events/app_events";
import { HomeScreen } from "./views/vw_home";
import { InventoryScreen } from "./views/vw_inventory";
import { BaseScene } from "./base_scane";
import { Match } from "./views/vw_match";
import { WinnerInventory } from "./views/vw_winner_inventory";

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
            inventory: new InventoryScreen(this),
            match: new Match(this),
            winner_inventory: new WinnerInventory(this),
        };
        this.setView("inventory");
        this.setFPS(config.fps);
        this._srartGame();
    }
}
