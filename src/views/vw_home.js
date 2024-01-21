import { BaseView } from "./base_view";
import { Button } from "../models/button";
import { HeartBeat } from "../models/heart_beat";

export class HomeScreen extends BaseView {
    constructor(screen) {
        super("home", screen);
        this.base_image = new Image();
        this.play_button = new Button(
            this.screen,
            "Test",
            "#22b324",
            "#f7eeed",
            80,
            50,
            50,
            10
        );
        this._init();

        this.hb = new HeartBeat(screen, 50, 50, 70, 30, "red");
    }

    _init() {
        var self = this;
        this.base_image.src = this.config.container_image;
        this.base_image.onload = function () {
            self.assetLoaded("base_image");
        };
    }

    onLoad() {
        this.play_button.visible();
        this.screen.startUserSession();
    }

    onClose() {
        this.play_button.hide();
    }

    update() {
        this.clearScreen();
        this.getContext().save();
        this.drawBG();
        this.getContext().restore();
        this.play_button.update();
        this.hb.update();
    }

    drawBG() {
        this.base_image.width = this.screenWidth();
        this.base_image.height = this.screenHeight();

        this.getContext().drawImage(
            this.base_image,
            0,
            0,
            this.screenWidth(),
            this.screenHeight()
        );
    }
}
