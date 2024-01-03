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
        this.w = 150;
        this.h = 70;
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

        var ctx = this.getContext();
        ctx.clearRect(0, 0, this.screenWidth(), this.screenHeight());
        ctx.save();

        var x = this.screenWidth() / 2 - this.w / 2;
        ctx.translate((x + this.w / 2), (this.y + this.h / 2));
        ctx.rotate(this.rotation * (Math.PI / 180));
       
        ctx.translate(-(x + this.w / 2), -(this.y + this.h / 2));
        ctx.drawImage(this.phone_image, x, this.y, this.w, this.h);

        ctx.restore();
    }

    _checkDirection() {
        if (this.direction == "right" && this.rotation >= 90) {
            this.direction = "left";
        }
        if (this.direction == "left" && this.rotation <= 0) {
            this.direction = "right";
        }
        this.rotation += this.direction == "right" ? 1 : -1;
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
