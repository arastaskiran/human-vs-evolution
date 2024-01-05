import { Scene } from "../scene";
import { BaseView } from "../views/base_view";
import { Inventory } from "./inventory";

export class ProductSelector extends BaseView {
    /**
     *
     * @param {Scene} scene
     */
    constructor(screen, items, x, y, width, height) {
        super("product_selector", screen);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.is_disable = true;
        this.inventories = [];
        this.selected_item_id_list = [];
        this.selected_items = [];
        this.padding_left = 5;
        this.padding_top = 1;
        this.is_focus = false;
        this.hover_sound = null;
        this.click_sound = null;
        this.leave_sound = null;
        this._loadEvents();
        this.__loadProducts(items)
        this.__loadMusic();
    }

    __loadMusic() {
        this.hover_sound = this.__insertSoundObject(this.config.mouse_hover_sound);
        this.leave_sound = this.__insertSoundObject(this.config.mouse_leave_sound);
        this.click_sound = this.__insertSoundObject(this.config.menu_item_change_sound);
    }

    paddingLeft(padd) {
        this.padding_left = padd;
        return this;
    }

    paddingTop(padd) {
        this.padding_top = padd;
        return this;
    }

    __loadProducts(items) {
        var self = this;
        items.forEach((r) => {
            self.inventories.push(new Inventory(self, r));
        });
    }

    _loadEvents() {
        var self = this;
        this.screen.canvas.addEventListener(
            "click",
            function (e) {
                self.__checkClick(e);
            },
            false
        );
        this.screen.canvas.addEventListener(
            "mousemove",
            function (e) {
                self.__checkMouseOver(e);
            },
            false
        );
    }

    onLoad() {
        this.enable();
        this.blur();
    }

    onClose() {
        this.blur();
    }

    disable() {
        if (this.is_disable) return;
        this.is_disable = true;
    }

    enable() {
        if (!this.is_disable) return;
        this.is_disable = false;
    }

    focus() {
        if (this.is_focus) return;
        this.is_focus = true;
    }
    blur() {
        if (!this.is_focus) return;
        this.is_focus = false;
        this.inventories.forEach(r => {
            r.blur();
        })
    }


    _checkFocus(e) {
        if (this._inBounds(e.clientX, e.clientY)) {
            this.focus();
            return;
        }
        this.blur();
    }

    __checkClick(e) {
        if (!this.status || this.is_disable) return;
        this._checkFocus(e);
        if (!this.is_focus) return;

        this._getFreeProducts().forEach(r => {
            if (r.checkClick(e)) {
                (r.is_selected) ? r.blur() : r.select();
            }
            else r.blur();
        });

    }

    __checkMouseOver(e) {
        if (!this.status || this.is_disable) return;
    }

    update() {
        this._drawItems();
    }

    remove(inventory) {
        this.selected_item_id_list = this.selected_item_id_list.filter((r) => {
            if (r != inventory.id) return r;
        });
        this.selected_items = this.selected_items.filter((r) => {
            if (r.id != inventory.id) return r;
        })
    }

    _drawItems() {
        var row = 0;
        var col = 0;
        var free = this._getFreeProducts();
        for (var i = 0; i < free.length; i++) {
            var p = free[i];
            if ((i) % 2 == 0 && i > 0) {
                row++;
                col = 0;
            }
            var x = this.padding_left + this.x + (col * (p.width + this.padding_left));
            var y = this.padding_top + this.y + (row * (p.height + this.padding_top));
            p.setCoordinate(x, y);
            p.update();
            col++;
        }
    }

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

    _getFreeProducts() {
        var self = this;
        return this.inventories.filter((r) => {
            if (!self.selected_item_id_list.includes(r.id)) return r;
        });
    }
}
