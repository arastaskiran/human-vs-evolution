import { Scene } from "../scene";
import { BaseView } from "../views/base_view";
import { MultiLineText } from "./multiline_text";

export class InventoryViewer extends BaseView {
    /**
     *
     * @param {Scene} scene
     */
    constructor(screen, x, y, width, height, color = "rgba(0, 255, 0, 0.2)") {
        super("inventory_viewer", screen);
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
        this.image = null;
        this.point_position = y;
        this.point_counter = 0;
        this.space_label_offset = 7;
        this.price_label_offset = 20;
        this.image_height = 20;
        this.inventory = null;
        this.effect_line_width = 1;
        this.effect_step_size = 0.2;
    }

    setImage(inventory) {
        if (inventory == null) {
            this.inventory = null;
            this.image = null;
            return this;
        }
        this.inventory = inventory;
        this.image = inventory.product.image;
        return this;
    }

    update() {
        this._drawEffect(this._drawImage());
    }

    _drawImage() {
        var ctx = this.getContext();
        if (this.image == null) return ctx;

        ctx.save();

        this.image.width = this.width;
        this.image.height = this.height;
        ctx.drawImage(
            this.image,
            this.x,
            this.y,
            this.width,
            this.image_height
        );

        this._drawSpace(ctx);
        this._drawPrice(ctx);
        ctx.restore();
        this._drawDescription(ctx);
        return ctx;
    }

    _drawSpace(ctx) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y + this.space_label_offset, this.width, 6);
        ctx.globalAlpha = 1;
        ctx.font = "5px Arial";
        var text = this.inventory.product.space + "m3";
        var text_size = ctx.measureText(text);
        //console.log(text_size)
        var y =
            this.y + this.space_label_offset + text_size.fontBoundingBoxAscent;
        var x = this.x + Math.round(this.width / 2) - text_size.width / 2;
        ctx.fillStyle = "white";
        ctx.fillText(text, x, y);
    }

    _drawPrice(ctx) {
        ctx.font = "8px Arial";
        var text = "$" + this.inventory.product.price;
        var text_size = ctx.measureText(text);
        var y =
            this.y + this.price_label_offset + text_size.fontBoundingBoxAscent;
        var x = this.x + Math.round(this.width / 2) - text_size.width / 2;
        ctx.fillStyle = "yellow";
        ctx.fillText(text, x, y);
    }

    _drawEffect(ctx) {
        if (this.point_counter + this.y + 1 > this.y + this.height - 2)
            this.point_counter = 0;
        this.point_counter += this.effect_step_size;
        if (this.image == null) return ctx;
        var pos = this.point_counter + this.y;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x, pos);
        ctx.lineTo(this.x + this.width, pos);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.effect_line_width;
        ctx.stroke();
        ctx.restore();
        return ctx;
    }

    _drawDescription(ctx) {
        //(6, 129, 125, 17,"red")
        ctx.save();
        this._drawDescLine(ctx, "Porduct:", this.inventory.product.name, 0);
        this._drawDescLine(
            ctx,
            "Size/Price:",
            this.inventory.product.space +
                " m3 / " +
                "$ " +
                this.inventory.product.price,
            1
        );
       
        ctx.restore();
    }

    _drawDescLine(ctx, key, value, line = 0) {
        var text_size = ctx.measureText(key);
        ctx.font = "9px Arial";
        ctx.fillStyle = "yellow";
        var y = 132 + line * 9 + text_size.fontBoundingBoxAscent / 2;
        ctx.fillText(key, 6, y);
        ctx.fillStyle = "white";
        ctx.fillText(value, 6 + text_size.width, y);
    }
}
