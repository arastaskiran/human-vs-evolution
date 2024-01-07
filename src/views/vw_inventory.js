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
        this.hb = new HeartBeat(screen, 65, 18, 74, 20, "#ddfac0");
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
        this._loadEvents();
    }

    _loadEvents() {
        this.product_selector.onEquip = (inventory) => {
            this.equip_box.addItem(inventory);
        };
        this.equip_box.onIgnore = (inventory) => {
            this.product_selector.addItem(inventory);
        };
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
        var ctx = this.getContext();
        var text = "FINE";
        var w = 36;
        var h = 7;
        var x = 106 + Math.round(w / 2) - ctx.measureText(text).width / 2;
        var y = 6 + h / 2 + 3;

        ctx.save();
        ctx.font = "8px Arial";
        ctx.fillStyle =
            new Date().getSeconds() % 5 == 0 ? "#bcedbb" : "#07f702";
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    drawSelected() {
        //this.drawTestRect(205, 136, 92, 12, "red"); // Start Game
        //this.drawTestRect(213, 110, 76, 11, "red"); //Equip
        var focused = this.getFocused();
        if (focused == null) return;
        var selected = focused.getSelected();
        this.inventory_viewer.setImage(selected).update();
    }

    getFocused() {
        if (this.product_selector.getSelected() != null)
            return this.product_selector;
        if (this.equip_box.getSelected() != null) return this.equip_box;
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
}
