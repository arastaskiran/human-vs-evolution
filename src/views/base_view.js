import { EvolutionScene } from "../models/evolution_scene";
export class BaseView extends EvolutionScene {
    constructor(name, screen) {
        super();
        this.name = name;
        this.screen = screen;       
        this.config = screen.config;
        this.status = false;
        this.asset_status = [];
    }
    onLoad() {}
    update() {}
    onClose() {}

    getContext() {
        return this.screen.context;
    }

    screenWidth() {
        //return 5;       
        return this.screen.canvas.width;
    }

    screenHeight() {
       
        return this.screen.canvas.height;
    }

    open() {
        if (this.status) return;
        this.status = true;
        this.onLoad();
    }

    close() {
        if (!this.status) return;
        this.status = false;
        this.onClose();
    }

    assetLoaded(name) {
        if (this.asset_status.includes(name)) return;
        this.asset_status.push(name);
    }

    isAssetLoad(name) {
        return this.asset_status.includes(name);
    }
}
