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
        this.ignore_sound = this.__insertSoundObject(
            this.screen.config.minimaze_sound
        );
    }

    onIgnore(inventory) {}

    _pressEnter() {}

    _pressTab() {}

    _buttonClick() {
        this._pressDelete();
    }

    _pressDelete() {
        if (this.selected_item == null) return;
        this.ignore_sound.currentTime = 0;
        this.ignore_sound.play();
        this.onIgnore(this.getSelected());
        this.removeItem(this.getSelected());
        this.selectIndex(this.selected_item_index);
    }
}
