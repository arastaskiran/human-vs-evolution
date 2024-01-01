import { BaseView } from "./base_view";
import { Button } from "../models/button";
import { HeartBeat } from "../models/heart_beat";
import { CrtImage } from "../models/crt_image";

export class InventoryScreen extends BaseView {
    constructor(screen) {
        super("home", screen);
        this.base_image = new Image();      
        this.user_picture = new CrtImage(screen,this.config.user_monkey,10,14,43,30);
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

        this.play_button.visible();
        this.hb = new HeartBeat(screen, 65, 18, 74, 20, "#ddfac0");
    }

    _init() {
        var self = this;
        this.base_image.src = this.config.inventory_box;
        this.base_image.onload = function () {
            self.assetLoaded("base_image");
        };       
    }

    update() {
        this.getContext().save();
        this.drawBG();
        this.drawHB();
        this.drawUser();
        this.getContext().restore();
        this.play_button.update();
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
    drawUser() {
        this.user_picture.update();
        var ctx = this.getContext();
        var text = "LUCY";    
        var w = 43;
        var h = 8;
        var x =  10 + Math.round(w / 2) - ctx.measureText(text).width / 2;
        var y =  5 + h / 2 + 3;
         

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
        var x = 106 + Math.round(w / 2) - ctx.measureText(text).width / 2;;
        var y = 6 + h / 2 + 3;
       

        ctx.save();
        ctx.font = "8px Arial";
        ctx.fillStyle =
            new Date().getSeconds() % 5 == 0 ? "#bcedbb" : "#07f702";
        ctx.fillText(text, x, y);
        ctx.restore();
    }
}
