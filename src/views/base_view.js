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

    fixFloat(val,dec=2){
        return parseFloat(val).toFixed(dec)
    }

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

    lightColor(color, percent) {
        var num = parseInt(color.replace("#", ""), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            B = ((num >> 8) & 0x00ff) + amt,
            G = (num & 0x0000ff) + amt;

        return (
            "#" +
            (
                0x1000000 +
                (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
                (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
                (G < 255 ? (G < 1 ? 0 : G) : 255)
            )
                .toString(16)
                .slice(1)
        );
    }

    assetLoaded(name) {
        if (this.asset_status.includes(name)) return;
        this.asset_status.push(name);
    }

    isAssetLoad(name) {
        return this.asset_status.includes(name);
    }

    drawTestRect(x, y, w, h, color = "red") {
        var ctx = this.getContext();
        ctx.save();
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
        ctx.restore();
    }

    roundRect(x, y, width, height, radius = 5, stroke = null, fill = null) {
        var ctx = this.getContext();
        if (typeof radius === "number") {
            radius = { tl: radius, tr: radius, br: radius, bl: radius };
        } else {
            radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
        }
        ctx.save();     

        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(
            x + width,
            y + height,
            x + width - radius.br,
            y + height
        );
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (stroke != null) {
            ctx.strokeStyle = stroke;
            ctx.stroke();
        }
        if (fill != null) {
            ctx.fillStyle = fill;
            ctx.fill();
        }
        ctx.restore();
    }

    isCurrentScene() {
        return this.screen.current_screen == this.name;
    }
}
