import { BaseView } from "./base_view";
import { Button } from "../models/button";
import { ProgressBar } from "../models/progress_bar";

export class WinnerInventory extends BaseView {
    constructor(screen) {
        super("winner_inventory", screen);
        this.play_again_button = null;
        this.inspect_button = null;
        this.cash_sound = null;
        this.hit_sound = null;
        this.progress = new ProgressBar(screen);

        this._loadAudios();
        this.__injectButtons();
    }

    __injectButtons() {
        var y = 115;
        var padding = 10;
        var w = 92;
        var h = 12;
        var total_w = w * 2 + padding;
        var x = this.screenWidth() / 2 - total_w / 2;

        this.play_again_button = new Button(
            this.screen,
            "PLAY AGAIN",
            "#E53935",
            "#f7eeed",
            x,
            y,
            w,
            h
        );
        this.inspect_button = new Button(
            this.screen,
            "INSPECT",
            "#22b324",
            "#f7eeed",
            x + padding + w,
            y,
            w,
            h
        );
        this._loadEvents();
    }

    _loadAudios() {
        this.cash_sound = this.__insertSoundObject(this.config.cash_sound);
        this.hit_sound = this.__insertSoundObject(this.config.soft_hit);
    }

    _loadEvents() {
        var self = this;

        this.inspect_button.onClick = () => {
            self.__inspectGame();
        };

        this.play_again_button.onClick = () => {
            self.__playAgain();
        };

        document.addEventListener(
            "keyup",
            function (e) {
                self.__checkKeyUp(e);
            },
            true
        );
        this.inspect_button.hide();
        this.play_again_button.hide();
    }

    __inspectGame() {}

    __playAgain() {
        this.screen.setView("inventory");
    }

    __checkKeyUp(e) {
        if (!this.isCurrentScene()) return;
        e = e || window.event;
        switch (e.keyCode) {
            case 27:
                this.__playAgain();
                break;
            case 13:
                this.__inspectGame();
                break;
            case 46:
                this.__playAgain();
                break;
        }
    }

    onLoad() {       
        this.play_again_button.visible();
        this.inspect_button.visible();
        this.progress
            .setY(35)
            .setMinVal(0)
            .setMaxVal(100)
            .setValue(0)
            .setWidth(140)
            .setHeight(10);
    }

    onClose() {
        this.play_again_button.hide();
        this.inspect_button.hide();
    }
    update() {
        this.__drawTitle();
        this.__drawButtons();
        this.__drawProgress();
    }

    __drawTitle() {
        var ctx = this.getContext();
        ctx.save();
        ctx.font = "18px Arial";
        var text = "Inventories of Winner";
        var y = 29;
        var x =
            Math.round(this.screenWidth() / 2) -
            ctx.measureText(text).width / 2;
        ctx.fillStyle = "white";
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    __drawButtons() {
        this.play_again_button.update();
        this.inspect_button.update();
    }

    __drawProgress() {
        this.progress.setValue(80).update();        
    }
}
