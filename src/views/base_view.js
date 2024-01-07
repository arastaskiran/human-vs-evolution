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

    clearScreen() {
        var ctx = this.getContext();
        ctx.clearRect(0, 0, this.screenWidth(), this.screenHeight());
        return ctx;
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

    dispose() {}

    assetLoaded(name) {
        if (this.asset_status.includes(name)) return;
        this.asset_status.push(name);
    }

    isAssetLoad(name) {
        return this.asset_status.includes(name);
    }

    drawTestRect(x,y,w,h){
        var ctx=this.getContext();
        ctx.save();
        ctx.fillStyle = "red";
        ctx.fillRect(x,y,w,h);
        ctx.restore();
    }
}
