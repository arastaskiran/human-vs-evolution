import { Scene } from "../scene";
import { BaseView } from "../views/base_view";
import { Inventory } from "./inventory";
import { Button } from "./button";

export class ProductSelector extends BaseView {
    /**
     *
     * @param {Scene} scene
     */
    constructor(name, view, items, x, y, width, height) {
        super(name, view.screen);
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
        this.row_limit = 2;
        this.is_focus = false;
        this.hover_sound = null;
        this.click_sound = null;
        this.leave_sound = null;
        this.selected_item = null;
        this.selected_item_index = -1;
        this.is_inverted_list = false;
        this.button = null;
        this._loadEvents();
        this.__loadProducts(items);
        this.__loadMusic();
    }

    useButton(text, background, text_color, click_sound = false) {
        var w = 76;
        var h = 11;
        var x = this.x + (this.width / 2 - w / 2);
        var y = this.y + this.height - h - 1;
        this.button = new Button(
            this.screen,
            text,
            background,
            text_color,
            x,
            y,
            w,
            h
        ).useClickSound(click_sound);

        return this;
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

    isFocused() {
        return this.is_focus;
    }

    paddingLeft(padd) {
        this.padding_left = padd;
        return this;
    }

    paddingTop(padd) {
        this.padding_top = padd;
        return this;
    }

    rowLimit(limit) {
        this.row_limit = limit;
        return this;
    }

    setInverted(status = true) {
        this.is_inverted_list = status;
        return this;
    }

    __loadProducts(items) {
        var self = this;
        items.forEach((r) => {
            self.inventories.push(new Inventory(self, r));
        });
    }

    addItem(inventory) {
        if (inventory == null) return;
        if (this.is_inverted_list) {
            this.selected_items = this.selected_items.filter((r) => {
                if (r.id != inventory.id) return r;
            });
            this.selected_item_id_list = this.selected_item_id_list.filter(
                (r) => {
                    if (r != inventory.id) return r;
                }
            );
            return;
        }
        this._transferInventory(inventory);
    }

    removeItem(inventory) {
        if (inventory == null) return;
        if (this.is_inverted_list) {
            if (this.selected_item_id_list.includes(inventory.id)) return;
            this.selected_item_id_list.push(inventory.id);
            this.selected_items.push(inventory);
            if (this.getInventoryLength() == 0) this.__ignoreSelected();
            return;
        }
        this.inventories = this.inventories.filter((r) => {
            if (r.id != inventory.id) return r;
        });
        if (this.getInventoryLength() == 0) this.__ignoreSelected();
    }

    _transferInventory(inventory) {
        if (this.isInventoryExist(inventory)) return;
        this.inventories.push(inventory.clone());
    }

    isInventoryExist(inventory) {
        return this.inventories.find((r) => r.id === inventory.id) != null;
    }

    _loadEvents() {
        var self = this;
        this.screen.canvas.addEventListener(
            "mouseup",
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
        if (this.button != null) {
            this.button.enable();
        }
    }

    onClose() {
        this.blur();
        if (this.button != null) {
            this.button.disable();
        }
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
        if (this.is_focus) return false;
        this.is_focus = true;
        return true;
    }
    blur() {
        if (!this.is_focus) return;
        this.is_focus = false;
        this.unselectAll();
    }

    unselectAll() {
        var self = this;
        this.inventories.forEach((r) => {
            self.__leaveProduct(r);
        });
        this.selected_item = null;
        this.selected_item_index = -1;
    }

    _checkFocus(e) {
        if (this._inBounds(e.clientX, e.clientY)) {
            return this.focus();
        }
        this.blur();
        return false;
    }

    _buttonClick() {}

    __checkClick(e) {
        if (!this.status || this.is_disable || !this._isViewOnTheStage())
            return;
        if (this.button != null) {
            if (this.button.inBounds(e.clientX, e.clientY)) {
                this._buttonClick();
                return;
            }
        }
        var focus_stat = this._checkFocus(e);
        if (!this.is_focus) return;
        var self = this;
        this._getFreeProducts().forEach((r) => {
            if (r.checkClick(e)) {
                r.is_selected
                    ? self.__leaveProduct(r)
                    : self.__selectProduct(r);
            } else self.__leaveProduct(r);
        });
        if (focus_stat && this.getSelected() == null) this.selectIndex(0);
    }

    __selectProduct(r) {
        if (r == null) {
            console.log("Unexpected");
            return;
        }
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

    reset() {
        this.unselectAll();
        if (this.is_inverted_list) {
            this.selected_items = [];
            this.selected_item_id_list = [];
            return;
        }
        this.inventories = [];
    }

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
    }

    __checkMouseOver(e) {
        if (!this.status || this.is_disable || !this._isViewOnTheStage())
            return;
    }

    update() {
        this._drawItems();
        this._drawButton();
    }

    _drawButton() {
        if (this.button == null) return;
        this.selected_item == null ? this.button.hide() : this.button.visible();

        this.button.update();
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
            if (i % this.row_limit == 0 && i > 0) {
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
        if (!this.is_inverted_list) return this.inventories;
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
        if (products.length < 1) {
            this.__ignoreSelected();
            return;
        }
        if (index >= products.length) {
            this.selectIndex(products.length - 1);
            return;
        }
        if (index < 0) return;

        this.__selectProduct(products[index]);
    }

    _pressUp() {
        if (this.getSelectedIndex() < 0) return;
        var curr = this.getSelectedIndex() - this.row_limit;
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
        var curr = this.getSelectedIndex() + this.row_limit;
        var len = this.getInventoryLength();

        if (curr >= len) curr = curr - len;

        this.selectIndex(curr);
    }

    selectAndFocus() {
        if (this.getInventoryLength() == 0) return false;
        this.focus();
        this.selectIndex(0);
        return true;
    }

    _pressESC() {
        this.blur();
    }

    _pressEnter() {}

    _pressTab() {}

    _pressDelete() {}

    getItems() {
        return this.selected_items;
    }
}
