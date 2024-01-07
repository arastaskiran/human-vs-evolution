import { ProductSelector } from "./product_selector";
import { Scene } from "../scene";

export class EquipBox extends ProductSelector {
    /**
     *
     * @param {Scene} scene
     */
    constructor(view, x, y, width, height) {
        super("equip_box", view, [], x, y, width, height);
        this.rowLimit(5);
    }

    onIgnore(inventory) {}

    _pressEnter() {}

    _pressTab() {}

    _pressDelete() {
        if (this.selected_item == null) return;
        this.onIgnore(this.getSelected());
        this.removeItem(this.getSelected());
        this.selectIndex(this.selected_item_index);
    }
}
