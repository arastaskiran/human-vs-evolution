import { BaseView } from "./base_view";
import { Button } from "../models/button";
import { ProgressBar } from "../models/progress_bar";
import { CrtImage } from "../models/crt_image";

export class WinnerInventory extends BaseView {
    constructor(screen) {
        super("winner_inventory", screen);

        this.cash_sound = null;
        this.hit_sound = null;
        this.progress = new ProgressBar(screen);
        this.scene_timer = 0;
        this.next_time = 40;
        this.product_index = 0;
        this.winner_score = null;
        this.product_image = null;
        this.list_frame_w = 250;
        this.list_frame_x = this.screenWidth() / 2 - this.list_frame_w / 2;
        this.list_frame_y = 60;
        this.list_frame_h = 60;
        this.product_image_padding_left = 10;
        this.product_image_w = 60;
        this.product_image_h = 40;
        this.total_space = 0;
        this.total_price = 0;
        this.current_product = null;

        this._loadAudios();
    }

    _loadAudios() {
        this.cash_sound = this.__insertSoundObject(this.config.cash_sound);
        this.hit_sound = this.__insertSoundObject(this.config.soft_hit);
    }

    onLoad() {
        this.total_space = 0;
        this.total_price = 0;
        this.scene_timer = 0;
        this.product_index=0;
        this.current_product=null; 
        this.winner_score = this.screen.ai.score.amIWin(this.screen.score)
            ? this.screen.score
            : this.screen.ai.score;

        this.product_image = new CrtImage(
            this.screen,
            null,
            this.list_frame_x + this.product_image_padding_left,
            this.list_frame_y +
                this.list_frame_h / 2 -
                this.product_image_h / 2,
            this.product_image_w,
            this.product_image_h
        );
        this.progress
            .setY(35)
            .setMinVal(0)
            .setMaxVal(this.winner_score.limit)
            .setWidth(140)
            .setHeight(10);

        this.setCurrentProduct(
            this.winner_score.getProductIndex(this.product_index)
        );
    }

    onClose() {
        this.scene_timer = 0;   
        this.total_space = 0;
        this.total_price = 0;      
        this.product_index=0;  
        this.current_product=null; 
    }
    update() {        
        this.roundRect(
            this.list_frame_x,
            this.list_frame_y,
            this.list_frame_w,
            this.list_frame_h,
            this.radius,
            "#031cfc",
            null
        );
        this.__drawProductInfo();

        //this.drawTestRect()       
        this.__drawTitle();
        this.__drawProgress();
        this.__drawGrandTotal();
        this.__checkTimer();
    }

    setCurrentProduct(product) {
        this.current_product = product;
        this.product_image.setImage(this.current_product.image);
        this.total_price += product.price;
        this.total_space += product.space;
        this.progress.setValue(this.total_space);
        this.cash_sound.hit_sound = 0;
        this.hit_sound.play();
        this.cash_sound.currentTime = 0;
        this.cash_sound.play();
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

    __drawProgress() {
        this.progress.update();
        this.__drawLimitLeft();
    }
    __checkTimer() {
        this.__increaseTimer();
        if (this.scene_timer % this.next_time == 0) {
            this.product_index += 1;
            var current_product = this.winner_score.getProductIndex(
                this.product_index
            );
            if (current_product == null) {
                this.screen.setView("inventory")
                return;
            }
            this.setCurrentProduct(current_product);           
        }
    }

    __drawGrandTotal() {
        var ctx = this.getContext();
        ctx.save();
        ctx.font = "11px Arial";
        var text = "TOTAL SPACE: ";
        var y = this.list_frame_y + this.list_frame_h + 12;
        var x = this.list_frame_x + 5;
        ctx.fillStyle = "white";
        ctx.fillText(text, x, y);
        var move = ctx.measureText(text).width + 5;
        x += move;
        text = this.total_space + " m3";
        ctx.fillStyle = "#ebeb21";
        ctx.fillText(text, x, y);
        y += 12;
        x -= move;
        ctx.fillStyle = "white";
        text = "TOTAL PRICE: ";
        ctx.fillText(text, x, y);
        move = ctx.measureText(text).width + 5;
        x += move;
        text = "$ " + this.total_price;
        ctx.fillStyle = "#ebeb21";
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    __drawProductInfo() {
        this.product_image.update();
        var x = this.list_frame_x + this.product_image_w + 15;
        var y = this.list_frame_y + 20;
        var ctx = this.getContext();
        ctx.save();
        ctx.font = "11px Arial";
        var text = "NAME: ";
        ctx.fillStyle = "white";
        ctx.fillText(text, x, y);
        var move = ctx.measureText(text).width + 5;
        x += move;
        text = this.current_product.name;
        ctx.fillStyle = "#2cb012";
        ctx.fillText(text, x, y);
        y += 12;
        x -= move;
        ctx.fillStyle = "white";
        text = "PRICE: ";
        ctx.fillText(text, x, y);
        move = ctx.measureText(text).width + 5;
        x += move;
        text = "$ " + this.current_product.price;
        ctx.fillStyle = "#2cb012";
        ctx.fillText(text, x, y);
        y += 12;
        x -= move;
        ctx.fillStyle = "white";
        text = "SPACE: ";
        ctx.fillText(text, x, y);
        move = ctx.measureText(text).width + 5;
        x += move;
        text = this.current_product.space + " m3";
        ctx.fillStyle = "#2cb012";
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    __drawLimitLeft(){

        var ctx = this.getContext();
        ctx.save();
        var x = this.progress.getX()+11;
        var y =this.progress.getY()+17;
        ctx.font = "8px Arial";
        var text = "LEFT: ";
        ctx.fillStyle = "white";
        ctx.fillText(text, x, y);
        var move = ctx.measureText(text).width + 5;
        x += move;
        text = this.winner_score.limit+" / "+(this.winner_score.limit-this.total_space);
        ctx.fillText(text, x, y);
        ctx.restore();

    }

    __increaseTimer() {
        this.scene_timer += 1;
    }
}
