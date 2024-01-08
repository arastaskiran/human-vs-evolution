import { BaseView } from "./base_view";
import { Button } from "../models/button";
import { HeartBeat } from "../models/heart_beat";
import { CrtImage } from "../models/crt_image";
import { InventoryBox } from "../models/inventory_box";
import { EquipBox } from "../models/equip_box";
import { InventoryViewer } from "../models/inventory_viewer";

export class InventoryScreen extends BaseView {
    constructor(screen) {
        super("inventory", screen);
        this.base_image = new Image();
        this.user_picture = new CrtImage(
            screen,
            this.config.user_monkey,
            10,
            14,
            43,
            30
        );
        this.play_button = new Button(
            this.screen,
            "START",
            "#22b324",
            "#f7eeed",
            205,
            136,
            92,
            12
        );
        this._init();

        this.play_button.hide();
        this.hb = new HeartBeat(screen, 67, 18, 74, 20, "#ddfac0");
        this.product_selector = new InventoryBox(
            this,
            this._getAllProducts(),
            212,
            7,
            77,
            115
        ).useButton("EQUIP", "#060694", "#f5b811");
        this.equip_box = new EquipBox(this, 5, 50, 195, 73).useButton(
            "IGNORE",
            "#E53935",
            "#FFFFFF"
        );
        this.inventory_viewer = new InventoryViewer(screen, 162, 13, 38, 28);
        this.user_actions = [];
        this._loadEvents();
    }

    _loadEvents() {
        var self = this;
        this.product_selector.onEquip = (inventory) => {
            this.equip_box.addItem(inventory);
            this._addAction("equip", inventory);
        };
        this.equip_box.onIgnore = (inventory) => {
            this.product_selector.addItem(inventory);
            this._addAction("ignore", inventory);
        };
        document.addEventListener(
            "keyup",
            function (e) {
                self.__checkKeyUp(e);
            },
            true
        );
    }

    _addAction(action, inventory) {
        this.user_actions.push({
            action: action,
            inventory: inventory.clone(),
            date: new Date(),
        });
    }

    _getAllProducts() {
        return this.screen.product_list;
    }

    _init() {
        var self = this;
        this.base_image.src = this.config.inventory_box;
        this.base_image.onload = function () {
            self.assetLoaded("base_image");
        };
    }

    onLoad() {
        this.product_selector.open();
        this.equip_box.open();
        this.play_button.visible();
        this.hb.setFine();
        this.product_selector.unselectAll();
        this.product_selector.blur();
        this.equip_box.unselectAll();
        this.equip_box.blur();
        this.screen.startUserSession();
    }

    onClose() {
        this.product_selector.close();
        this.equip_box.close();
        this.play_button.hide();
    }

    update() {
        this.clearScreen();
        this.drawBG();
        this.drawHB();
        this.drawUser();

        this.product_selector.update();
        this.equip_box.update();
        this.drawSelected();
        this.drawStartButton();
        this._drawTimeRemain();
    }

    drawBG() {
        var ctx = this.getContext();
        ctx.save();
        this.base_image.width = this.screenWidth();
        this.base_image.height = this.screenHeight();

        ctx.drawImage(
            this.base_image,
            0,
            0,
            this.screenWidth(),
            this.screenHeight()
        );
        ctx.restore();
    }
    drawUser() {
        this.user_picture.update();
        var ctx = this.getContext();
        var text = "LUCY";
        var w = 43;
        var h = 8;
        var x = 10 + Math.round(w / 2) - ctx.measureText(text).width / 2;
        var y = 5 + h / 2 + 3;

        ctx.save();
        ctx.font = "8px Arial";
        ctx.fillStyle =
            new Date().getSeconds() % 5 == 0 ? "#f2f194" : "#f2ef30";
        ctx.fillText(text, x, y);
        ctx.restore();
    }
    drawHB() {
        this.hb.update();
    }

    drawSelected() {
        var focused = this.getFocusAndSelected();
        if (focused == null) return;
        var selected = focused.getSelected();
        this.inventory_viewer.setImage(selected).update();
    }

    getFocusAndSelected() {
        if (this.product_selector.getSelected() != null)
            return this.product_selector;
        if (this.equip_box.getSelected() != null) return this.equip_box;
        return null;
    }

    getFocused() {
        if (this.product_selector.is_focus) return this.product_selector;
        if (this.equip_box.is_focus) return this.equip_box;
        return null;
    }

    drawStartButton() {
        if (this.equip_box.getInventoryLength() == 0) {
            this.play_button.hide();
            this.play_button.update();
            return;
        }
        this.play_button.visible();
        this.play_button.update();
    }

    __checkKeyUp(e) {
        if (!this.isCurrentScene()) return;
        e = e || window.event;
        console.log(e.keyCode);
        switch (e.keyCode) {
            case 9:
                this._pressTab();
                break;
            case 32:
                this._pressSpace();
                break;
        }
    }

    _pressTab() {
        var focused = this.getFocused();
        if (focused == null) {
            if (this._focusInventoryBox()) {
                return;
            }
            this._focusEquipBox();
            return;
        }
        console.log(focused);
        focused.name == "equip_box"
            ? this._focusInventoryBox()
            : this._focusEquipBox();
    }

    _focusInventoryBox() {
        this.equip_box.unselectAll();
        this.equip_box.blur();
        return this.product_selector.selectAndFocus();
    }

    _focusEquipBox() {
        this.product_selector.unselectAll();
        this.product_selector.blur();
        return this.equip_box.selectAndFocus();
    }

    _drawTimeRemain() {
        if (
            this.screen.user_end_date == null ||
            this.screen.user_start_date == null
        )
            return;
        var duration = this.screen.user_end_date - this.screen.user_start_date;
        var remain = this.screen.user_end_date - Math.floor(Date.now() / 1000);
        var percent = remain < 0 ? -1 : (remain * 100) / duration;
        if (percent < 0) {
            //Danger
            this.hb.setDead();
        } else if (percent >= 0 && percent < 25) {
            //Danger
            this.hb.setDanger();
        } else if (percent >= 25 && percent < 50) {
            //Caution
            this.hb.setCaution();
        } else if (percent >= 50) {
            this.hb.setFine();
        }
        var ctx = this.getContext();
        ctx.save();
        var text =
            remain < 1
                ? "00:00"
                : `${String(Math.floor(remain / 60)).padStart(2, "0")}:${String(
                      remain % 60
                  ).padStart(2, "0")}`;

        ctx.font = "8px Arial";

        ctx.fillStyle = this.hb.getPointColor();

        var text_size = ctx.measureText(text);
        //console.log(text_size)
        var y = 30 + text_size.fontBoundingBoxAscent;
        var x = 115 + Math.round(26 / 2) - text_size.width / 2;

        ctx.fillText(text, x, y);

        ctx.restore();

        //this.drawTestRect(115,30,26,8,"red")
    }

    _pressSpace() {}
}
