import { Scene } from "../scene";
import { BaseView } from "../views/base_view";
import { Inventory } from "./inventory";

export class ProductSelector extends BaseView {
    /**
     *
     * @param {Scene} scene
     */
    constructor(view, items, x, y, width, height) {
        super("product_selector", view.screen);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.view = view;
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
        this.selected_item = null;
        this.selected_item_index = -1;
        this._loadEvents();
        this.__loadProducts(items);
        this.__loadMusic();
    }

    __loadMusic() {
        this.hover_sound = this.__insertSoundObject(
            this.config.mouse_hover_sound
        );
        this.leave_sound = this.__insertSoundObject(
            this.config.mouse_leave_sound
        );
        this.click_sound = this.__insertSoundObject(
            this.config.menu_item_change_sound
        );
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
        document.addEventListener(
            "keyup",
            function (e) {
                self.__checkKeyUp(e);
            },
            true
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
        var self = this;
        this.inventories.forEach((r) => {
            self.__leaveProduct(r);
        });
    }

    _checkFocus(e) {
        if (this._inBounds(e.clientX, e.clientY)) {
            this.focus();
            return;
        }
        this.blur();
    }

    __checkClick(e) {
        if (!this.status || this.is_disable || !this._isViewOnTheStage())
            return;
        this._checkFocus(e);
        if (!this.is_focus) return;
        var self = this;
        this._getFreeProducts().forEach((r) => {
            if (r.checkClick(e)) {
                r.is_selected
                    ? self.__leaveProduct(r)
                    : self.__selectProduct(r);
            } else self.__leaveProduct(r);
        });
    }

    __selectProduct(r) {
        if (this.selected_item != null && r != null) {
            if (this.selected_item.id != r.id) {
                this.__ignoreSelected();
            }
        }
        r.select();
        this.selected_item = r;
        this.selected_item_index = this._getFreeProducts().indexOf(r);
    }

    __leaveProduct(r) {
        if (this.selected_item != null && r != null) {
            if (this.selected_item.id == r.id) {
                this.__ignoreSelected();
                return;
            }
        }

        r.blur();
    }

    __ignoreSelected() {
        if (this.selected_item == null) return;
        this.selected_item.blur();
        this.selected_item = null;
        this.selected_item_index = -1;
    }

    reset() {}

    __checkKeyUp(e) {
        if (
            !this.status ||
            this.is_disable ||
            !this.is_focus ||
            !this._isViewOnTheStage()
        )
            return;
        var selected = this.getSelected();
        if (selected == null) return;
        var products = this._getFreeProducts();
        e = e || window.event;
        switch (e.keyCode) {
            case 37:
                this._pressLeft();
                break;
            case 38:
                this._pressUp();
                break;
            case 39:
                this._pressRight();
                break;
            case 40:
                this._pressDown();
                break;
            case 27:
                this._pressESC();
                break;
            case 13:
                this._pressEnter();
                break;
            case 9:
                this._pressTab();
                break;
            case 46:
                this._pressDelete();
                break;
        }
        console.log("HEY");
    }

    __checkMouseOver(e) {
        if (!this.status || this.is_disable || !this._isViewOnTheStage())
            return;
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
        });
    }

    _drawItems() {
        var row = 0;
        var col = 0;
        var free = this._getFreeProducts();
        for (var i = 0; i < free.length; i++) {
            var p = free[i];
            if (i % 2 == 0 && i > 0) {
                row++;
                col = 0;
            }
            var x =
                this.padding_left +
                this.x +
                col * (p.width + this.padding_left);
            var y =
                this.padding_top + this.y + row * (p.height + this.padding_top);
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

    getInventoryLength() {
        return this._getFreeProducts().length;
    }

    getSelected() {
        return this.selected_item;
    }

    getSelectedIndex() {
        return this.selected_item_index;
    }

    _isViewOnTheStage() {
        return this.screen.current_screen == this.view.name;
    }

    selectIndex(index) {
        var products = this._getFreeProducts();
        if (products.length < 0 || index >= products.length || index < 0)
            return;

        this.__selectProduct(products[index]);
    }

    _pressUp() {
        if (this.getSelectedIndex() < 0) return;
        var curr = this.getSelectedIndex() - 2;
        var len = this.getInventoryLength();

        if (curr < 0) curr = len + curr;
        else if (curr > len) curr = 0;
        this.selectIndex(curr);
    }

    _pressLeft() {
        if (this.getSelectedIndex() < 0) return;
        var curr = this.getSelectedIndex() - 1;
        var len = this.getInventoryLength();
        if (curr < 0) curr = len - 1;
        else if (curr > len) curr = 0;
        this.selectIndex(curr);
    }

    _pressRight() {
        if (this.getSelectedIndex() < 0) return;
        var curr = this.getSelectedIndex() + 1;
        var len = this.getInventoryLength();
        if (curr >= len) curr = 0;
        this.selectIndex(curr);
    }

    _pressDown() {
        if (this.getSelectedIndex() < 0) return;
        var curr = this.getSelectedIndex() + 2;
        var len = this.getInventoryLength();

        if (curr >= len) curr = curr - len;

        this.selectIndex(curr);
    }

    _pressESC() {}

    _pressEnter() {
        console.log(this.getSelectedIndex());
    }

    _pressTab() {}

    _pressDelete() {}
}
