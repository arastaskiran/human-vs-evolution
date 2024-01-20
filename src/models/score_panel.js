import { BaseView } from "../views/base_view";
import { CrtImage } from "./crt_image";

export class ScorePanel extends BaseView {
    constructor(match, x = 10, y = 10, w = 10, h = 10, radius = 5) {
        super("score_pannel", match.screen);
        this.match = match;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.radius = radius;
        this.center = true;
        this.stroke = "#7cd977";
        this.fill = null;
        this.blink_timer = 2;
        this.dna_picture = new CrtImage(
            match.screen,
            this.config.dna_image,
            10,
            14,
            43,
            30
        );

        this.user_picture = new CrtImage(
            match.screen,
            this.config.user_monkey,
            10,
            14,
            43,
            30
        );
    }

    setX(x) {
        this.x = x;
        return this;
    }

    setY(y) {
        this.y = y;
        return this;
    }

    setWidth(w) {
        this.w = w;
        return this;
    }

    setHeight(h) {
        this.h = h;
        return this;
    }

    setCenter(val) {
        this.center = val;
        return this;
    }

    setStroke(val) {
        this.stroke = val;
        return this;
    }

    setFill(val) {
        this.fill = val;
        return this;
    }

    getX(add = 0) {
        if (this.center) return this.screenWidth() / 2 - this.w / 2 + add;
        return this.x + add;
    }

    getY(add = 0) {
        return this.y + add;
    }

    getAI() {
        return this.screen.ai;
    }

    getAIScore() {
        return this.match.ai_score;
    }

    getMyScore() {
        return this.match.lucy_score;
    }

    amIWin() {
        return this.match.am_i_win;
    }

    getStroke() {
        if (this.blink_timer == 0 || this.blink_timer == null)
            return this.stroke;

        return new Date().getSeconds() % this.blink_timer == 0
            ? this.stroke
            : this.lightColor(this.stroke, 20);
    }

    getFill() {
        return this.fill;
    }

    update() {
        this.__drawWinnerImage();
        this.roundRect(
            this.getX(),
            this.y,
            this.w,
            this.h,
            this.radius,
            this.getStroke(),
            this.getFill()
        );

        //this.roundRect(30, 40, 200, 40, 5, "#7cd977");
    }

    __centerAvatat() {
        var x = this.getX(10);
        if (!this.amIWin()) {
            this.user_picture.setX(this.getX(10)).setY(this.getY(10));
            return;
        }
    }

    __getWinnerPicture() {
        return this.amIWin() ? this.user_picture : this.dna_picture;
    }

    __getWinnerScore() {
        return this.amIWin() ? this.match.lucy_score : this.match.ai_score;
    }

    __drawLegend() {
        var ctx = this.getContext();
        ctx.save();
        var w = 80;
        var h = 10;
        var y = this.getY(-5);
        var x = this.getX() + this.w / 2 - w / 2;
        this.roundRect(
            x,
            y,
            w,
            h,
            this.radius,
            this.getStroke(),
            this.getStroke()
        );
        ctx.font = "11px Arial";
        var text = "WINNER";
        y += 9;
        x = x + w / 2 - ctx.measureText(text).width / 2;

        ctx.fillStyle = "black";
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    __drawWinnerImage() {
        this.__getWinnerPicture()
            .setX(this.getX(10))
            .setY(this.getY(5))
            .update();
        this.__drawLegend();
        this.__drawWinnerInfo();
        this.__drawDuration();
    }

    __drawWinnerInfo() {
        this.__drawLabels();
        this.__drawScores();
    }

    __drawScores() {
        var score = this.__getWinnerScore();

        var ctx = this.getContext();
        ctx.save();
        var y = this.getY(5);
        var x = this.getX(100);
        ctx.font = "9px Arial";
        ctx.fillStyle = this.getStroke();
        [
            score.indivual == null
                ? "Lucy"
                : `${score.indivual.id} (GEN: ${score.indivual.generation})`,
            `${this.fixFloat(score.limit)} m3`,
            `${this.fixFloat(score.spaces)} m3`,
            `$ ${this.fixFloat(score.prices)}`,
        ].forEach((r) => {
            y += 10;
            ctx.fillText(r, x, y);
        });

        ctx.restore();
    }

    __drawDuration() {
        var ctx = this.getContext();
        ctx.save();
       
        var x = this.getX(0);
        var y = this.getY(44);
        var w = 55;
        var text = `${this.__getWinnerScore().duration} ms`;
        ctx.font = "9px Arial";
        ctx.fillStyle = "yellow";
        ctx.fillText(text, x + w / 2 - ctx.measureText(text).width/2, y);
        ctx.restore();
    }

    __drawLabels() {
        var ctx = this.getContext();
        ctx.save();

        var y = this.getY(15);
        var x = this.getX(60);
        var text = "NAME:";
        ctx.font = "9px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(text, x, y);
        y += 10;
        text = "LIMIT:";
        ctx.fillText(text, x, y);
        y += 10;
        text = "SPACE:";
        ctx.fillText(text, x, y);
        y += 10;
        text = "PRICE:";
        ctx.fillText(text, x, y);

        ctx.restore();
    }
}
