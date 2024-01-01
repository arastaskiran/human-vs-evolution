import { Scene } from "../scene";
import { BaseView } from "../views/base_view";

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
    }

    update() {}


    _getFreeProducts(){
        var self=this;
        this.screen.product_list.filter((r)=>{


        });
    }
}
