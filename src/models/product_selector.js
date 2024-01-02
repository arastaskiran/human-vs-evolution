import { Scene } from "../scene";
import { BaseView } from "../views/base_view";
import { Inventory } from "./inventory";

export class ProductSelector extends BaseView {
    /**
     *
     * @param {Scene} scene
     */
    constructor(screen, x, y, width, height) {
        super("product_selector", screen);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.is_disable = true;
        this.inventories = [];
    }

    __loadProducts() {
        var self = this;
        this.screen.product_list.forEach((r) => {
            self.inventories.push(new Inventory(self, r));
        });
    }

    update() {
        // var ctx=this.getContext();
        // ctx.save();
        // ctx.fillStyle = "black";
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        // ctx.restore();
    }

    _getFreeProducts() {
        var self = this;
        return this.screen.product_list.filter((r) => {
            if (!self.screen.user_selected.includes(r.id)) return r;
        });
    }
}
