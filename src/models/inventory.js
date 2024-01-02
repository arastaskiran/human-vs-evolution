import { Scene } from "../scene";
import { BaseView } from "../views/base_view";

export class Inventory extends BaseView {
    /**
     *
     * @param {Scene} scene
     */
    constructor(selector, product, x, y, width, height) {
        super(`inventory_${produt.id}`, selector.screen);
        this.selector = selector;
        this.product = product;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.is_selected = false;
    }

    update() {}

    _inBounds(mouseX, mouseY) {
        var rateX = this.screen.canvas.offsetWidth / this.screen.canvas.width;
        var rateY = this.screen.canvas.offsetHeight / this.screen.canvas.height;
        var offsetX = this.screen.canvas.offsetLeft;
        var offsetY = this.screen.canvas.offsetTop;

        var x = rateX * this.x + offsetX;
        var y = rateY * this.y + offsetY;
        var w = rateX * this.w + offsetX / 2;
        var h = rateY * this.h + offsetY / 2;

        return !(mouseX < x || mouseX > x + w || mouseY < y || mouseY > y + h);
    }

    checkMouseOver(e) {
        if (!this.visibility || this.disabled) return;
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

    checkClick(e) {
        if (!this.visibility || this.disabled) return false;

        if (this._inBounds(e.clientX, e.clientY)) {
            this.click_sound.currentTime = 0;
            this.click_sound.play();
            this.onClick();
            return true;
        }
        return false;
    }
}
