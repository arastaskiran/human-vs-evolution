import { Scene } from "../scene";
import { BaseView } from "../views/base_view";

export class CrtImage extends BaseView {
    /**
     *
     * @param {Scene} scene
     */
    constructor(
        screen,
        image,
        x,
        y,
        width,
        height,
        color = "rgba(0, 255, 0, 0.2)"
    ) {
        super("crt_image", screen);
        this.image_src = image;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
        this.image = new Image();
        this.point_position = y;
        this.point_counter = 0;       
        this._init();
    }

    setX(x) {
        this.x = x;
        return this;
    }

    setY(y) {
        this.y = y;
        return this;
    }

    _init() {
        if (this.image_src == null) return;
        var self = this;
        this.image.src = this.image_src;
        this.image.onload = function () {
            self.assetLoaded("image");
        };
    }

    update() {
        var ctx = this.getContext();
        ctx.save();

        this.image.width = this.width;
        this.image.height = this.height;

        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

        ctx.restore();
        this._drawEffect(ctx);
    }

    setImage(image) {
        this.image = image;
        return this;
    }

    _drawEffect(ctx) {
        if (this.point_counter + this.y + 1 > this.y + this.height - 2)
            this.point_counter = 0;
        this.point_counter += 0.3;
        var pos = this.point_counter + this.y;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x, pos);
        ctx.lineTo(this.x + this.width, pos);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
    }
}
