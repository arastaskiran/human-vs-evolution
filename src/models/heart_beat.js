import { Scene } from "../scene";
import { BaseView } from "../views/base_view";

export class HeartBeat extends BaseView {
    /**
     *
     * @param {Scene} scene
     */
    constructor(
        screen,
        x,
        y,
        width,
        height,
        point_color = "#ddfac0",
        shadow_color = "rgba(53, 87, 27, 0.5)",
        grid_color = ""
    ) {
        super("heart_beat", screen);
        this.width = width;
        this.height = height;
        this.condition_text = "FINE";
        this.text_blink_timer = 5;
        this.x = x;
        this.y = y;
        this.ball = {
            x: 0,
            y: height / 2,
        };
        this.point_color = point_color;
        this.shadow_color = shadow_color;
        this.grid_color = grid_color;
        this.txt_blink_color1 = "#bcedbb";
        this.txt_blink_color2 = "#07f702";
        this.signal_divider = 1;
        this.point = {
            x: 0,
            y: this.ball.y,
        };
        this.current_point = 0;
        this.points = [
            { y: 0, x: 20 },
            { y: 0, x: 1 },
            { y: 1, x: 1 },
            { y: -10 / 3, x: 2 },
            { y: 10 / 3, x: 2 },
            { y: -4, x: 3 },
            { y: 25 / 3, x: 5 },
            { y: -25 / 3, x: 4 },
            { y: 14 / 3, x: 3 },
            { y: 5 / 3, x: 2 },
            { y: 0, x: 1 },
            { y: 0, x: 20 },
        ];
        this.shadows = [];
    }

    update() {
        this.calculateSeries();
        var ctx = this.getContext();
        ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        this.drawShadows(ctx);
        this.drawPoint(ctx);
        this._drawConditionText(ctx);

        ctx.restore();
    }

    setFine() {
        if (this.condition_text == "FINE") return;
        this.signal_divider = 1;
        this.text_blink_timer = 5;
        this.condition_text = "FINE";
        this.txt_blink_color1 = "#bcedbb";
        this.txt_blink_color2 = "#07f702";
        this.point_color = "#ddfac0";
        this.shadow_color = "rgba(53, 87, 27, 0.5)";
    }

    setCaution() {
        if (this.condition_text == "CAUTION") return;
        this.signal_divider = 2;
        this.text_blink_timer = 2;
        this.condition_text = "CAUTION";
        this.txt_blink_color1 = "#e3b330";
        this.txt_blink_color2 = "#f0da9e";
        this.point_color = "#fae387";
        this.shadow_color = "rgba(242, 208, 70, 0.5)";
    }

    setDanger() {
        if (this.condition_text == "DANGER") return;
        this.signal_divider = 5;
        this.text_blink_timer = 1;
        this.condition_text = "DANGER";
        this.txt_blink_color1 = "#f52525";
        this.txt_blink_color2 = "#f77272";
        this.point_color = "#fc7e6a";
        this.shadow_color = "rgba(247, 89, 64, 0.5)";
    }

    setDead() {
        if (this.condition_text == "DEAD") return;
        this.signal_divider = 30;
        this.text_blink_timer = 70;
        this.condition_text = "DEAD";
        this.txt_blink_color1 = "#f52525";
        this.txt_blink_color2 = "#f77272";
        this.point_color = "#fc7e6a";
        this.shadow_color = "rgba(247, 89, 64, 0.5)";
    }

    isDead() {
        return this.condition_text == "DEAD";
    }

    _drawConditionText(ctx) {
        ctx.font = "8px Arial";
        var text = this.condition_text;
        var w = 36;
        var h = 7;
        var x = 106 + Math.round(w / 2) - ctx.measureText(text).width / 2;
        var y = 6 + h / 2 + 3;

        ctx.fillStyle =
            new Date().getSeconds() % this.text_blink_timer == 0
                ? this.txt_blink_color1
                : this.txt_blink_color2;
        ctx.fillText(text, x, y);
    }

    drawPoint(ctx) {
        ctx.fillStyle = this.point_color;
        ctx.beginPath();
        var x = this.x + this.ball.x;
        var y = this.y + this.ball.y;
        ctx.arc(x, y, 1, 0, 2 * Math.PI, true);
        this.shadows.push({ x: x, y: y });
        ctx.closePath();
        ctx.fill();
    }

    drawShadows(ctx) {
        ctx.fillStyle = this.shadow_color;
        for (var i = 0; i < this.shadows.length; i++) {
            ctx.beginPath();
            ctx.arc(
                this.shadows[i].x,
                this.shadows[i].y,
                1,
                0,
                2 * Math.PI,
                true
            );
            ctx.closePath();
            ctx.fill();
        }
    }

    calculateSeries() {
        var dis = this.dist(
            this.ball.x,
            this.point.x + this.points[this.current_point].x,
            this.ball.y,
            this.point.y +
                this.points[this.current_point].y / this.signal_divider
        );
        if (dis.d > 1) {
            var s = Math.abs(dis.dy) > 13 ? 2 : 1;
            this.ball.x += -(dis.dx / dis.d) * s;
            this.ball.y += -(dis.dy / dis.d) * s;
            return;
        }
        this.ball.x = this.point.x + this.points[this.current_point].x;
        this.ball.y =
            this.point.y +
            this.points[this.current_point].y / this.signal_divider;
        this.point.x += this.points[this.current_point].x;
        this.current_point++;
        if (
            this.current_point >= this.points.length ||
            this.ball.x > this.width
        ) {
            this.reset();
        }
    }

    dist(x1, x2, y1, y2) {
        var dx = x1 - x2,
            dy = y1 - y2;
        return {
            d: Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),
            dx: dx,
            dy: dy,
        };
    }

    reset() {
        this.shadows = [];
        this.current_point = 0;

        this.point.x = this.ball.x = 0;
    }

    getPointColor() {
        return this.point_color;
    }
}
