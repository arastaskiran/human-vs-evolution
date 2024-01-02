import { Scene } from "../scene";
import { BaseView } from "../views/base_view";

export class Inventory extends BaseView {
    /**
     *
     * @param {Scene} scene
     */
    constructor(selector, product, x, y, width = 30, height = 13) {
        super(`inventory_${product.id}`, selector.screen);
        this.id = this._getID(16);
        this.selector = selector;
        this.product = product;
        this.hover = false;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.is_selected = false;
        this.product.image.width = width;
        this.product.image.height = height;
    }

    setCoordinate(x, y) {
        this.x = x;
        this.y = y;

    }

    update() {

        var ctx = this.getContext();
        this._drawSelected(ctx);
        ctx.save();
        this.getContext().drawImage(
            this.product.image,
            this.x,
            this.y,
            this.width,
            this.height
        );
        ctx.restore();
      

    }

    _drawSelected(ctx) {
        if (!this.is_selected) return;
        ctx.save();
        ctx.globalAlpha = 0.5
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = (new Date()).getMilliseconds()>500==0?'red':'#ebe834';
        ctx.fillStyle = "red";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1
        ctx.restore();
    }

    blur() {
        if (!this.is_selected) return;
        this.is_selected = false;
    }
    select() {
        if (this.is_selected) return;
        this.is_selected = true;
    }

    _inBounds(mouseX, mouseY) {
        var rateX = this.screen.canvas.offsetWidth / this.screen.canvas.width;
        var rateY = this.screen.canvas.offsetHeight / this.screen.canvas.height;
        var offsetX = this.screen.canvas.offsetLeft;
        var offsetY = this.screen.canvas.offsetTop;

        var x = rateX * this.x + offsetX;
        var y = rateY * this.y + offsetY;
        var w = rateX * this.width + offsetX / 2;
        var h = rateY * this.height + offsetY / 2;


        return !(mouseX < x || mouseX > x + w || mouseY < y || mouseY > y + h);
    }

    checkMouseOver(e) {

        var state = this._inBounds(e.clientX, e.clientY);
        if (this.hover != state) {
            if (state) {
                this.mouseEnter();
            } else {
                this.mouseLeave();
            }
            this.hover = state;
        }
    }

    onClick() { }

    checkClick(e) {

        if (this._inBounds(e.clientX, e.clientY)) {
            this.selector.click_sound.currentTime = 0;
            this.selector.click_sound.play();
            this.onClick();
            return true;
        }
        return false;
    }

    _getID(length) {
        return Math.random()
            .toString(36)
            .substring(2, length + 2);
    }

    getProduct() {
        return this.product;
    }
}
