import { BaseView } from "./base_view";

export class OrientationChange extends BaseView {
    constructor(screen) {
        super("vw_change_orient", screen);
        this.phone_image = new Image();
        this.direction = "right";
        this.step = 1;
        this.rotation = 0;
        this._init();
        this.x = 60;
        this.y = 20;
        this.w = 200;
        this.h = 100;
    }

    _init() {
        var self = this;
        this.phone_image.src = this.config.orient_phone;
        this.phone_image.onload = function () {
            self.assetLoaded("phone_image");
        };
    }

    update() {
        this._checkDirection();

        var ctx = this.clearScreen();
        ctx.save();

        var x = this.screenWidth() / 2 - this.w / 2;
        ctx.drawImage(this.phone_image, x, this.y, this.w, this.h);
        var ix = x + this.w / 2;
        var iy = this.y + this.h / 2;
        this._drawText(ctx, ix, iy);

        ctx.restore();
    }

    _drawText(ctx, x, y) {
        ctx.font = "9px Arial";
        var text = "ROTATE YOUR PHONE";
        ctx.translate(x, y);
        ctx.rotate(this.rotation * (Math.PI / 180));
        ctx.translate(-x, -y);
        ctx.measureText(text).width / 2;
        ctx.fillStyle = "white";
        ctx.fillText(text, x - ctx.measureText(text).width / 2, y);
    }

    _checkDirection() {
        if (this.direction == "right" && this.rotation >= 15) {
            this.direction = "left";
        }
        if (this.direction == "left" && this.rotation <= 0) {
            this.direction = "right";
        }
        this.rotation += this.step * (this.direction == "right" ? 1 : -1);
    }

    drawBG() {
        this.base_image.width = this.screenWidth();
        this.base_image.height = this.screenHeight();

        this.getContext().drawImage(
            this.base_image,
            0,
            0,
            this.screenWidth(),
            this.screenHeight()
        );
    }
}
