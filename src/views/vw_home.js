import { BaseView } from "./base_view";

export class HomeScreen extends BaseView {
    constructor(screen) {
        super("home", screen);
        this.base_image = new Image();
        this._init();
    }

    _init() {
        var self = this;
        this.base_image.src = this.config.container_image;
        this.base_image.onload = function () {
            self.assetLoaded("base_image");
        };
    }

    update() {
        this.getContext().save();
        this.drawBG();
        this.getContext().restore();
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
