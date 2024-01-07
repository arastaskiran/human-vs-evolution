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
        this.equip_sound=this.__insertSoundObject(
            this.screen.config.enter_selection_sound
        );
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
        this.equip_sound.currentTime = 0;
        this.equip_sound.play();
        this.onEquip(this.getSelected());
        this.removeItem(this.getSelected());
        this.selectIndex(this.selected_item_index);
       


    }

    
}
