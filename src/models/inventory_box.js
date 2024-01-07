import { ProductSelector } from "./product_selector";
import { Scene } from "../scene";

export class InventoryBox extends ProductSelector {
    /**
     *
     * @param {Scene} scene
     */
    constructor(view, items, x, y, width, height) {
        super("inventory_box", view, items, x, y, width, height);
        this.setInverted();
    }

    onEquip(inventory) {}

    _pressEnter() {
        this.equip();
    }

    _pressTab() {}

    _pressDelete() {}
    _buttonClick() {
        this.equip();
    }

    equip() {
        if (this.selected_item == null) return;
        this.onEquip(this.getSelected());
        this.removeItem(this.getSelected());
        this.selectIndex(this.selected_item_index);
    }
}
