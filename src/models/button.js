import { Scene } from "../scene";
import { BaseView } from "../views/base_view";

export class Button extends BaseView {
    /**
     *
     * @param {Scene} scene
     */
    constructor(scene, text, color, fontcolor, x, y, w, h) {
        super("button", scene);
        this.text = text;
        this.color = color;
        this.fontcolor = fontcolor;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.hover_sound = null;
        this.click_sound = null;
        this.leave_sound = null;
        this.disabled = false;
        this.visibility = false;
        this.hover = false;

        this.__loadMusic();
        var bu = this;
        this.scene.canvas.addEventListener(
            "click",
            function (e) {
                bu.__checkClick(e);
            },
            false
        );
        this.scene.canvas.addEventListener(
            "mousemove",
            function (e) {
                bu.__checkMouseOver(e);
            },
            false
        );
    }

    visible() {
        this.visibility = true;
    }

    disable() {
        this.disabled = true;
    }

    enable() {
        this.disabled = false;
    }

    hide() {
        this.visibility = false;
    }

    update() {
        if (!this.visibility) {
            return;
        }

        var ctx = this.getContext();
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.hover
            ? this.__lightColor(this.color, 30)
            : this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.restore();
        this.__drawButtonText();
    }

    __lightColor(color, percent) {
        var num = parseInt(color.replace("#", ""), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            B = ((num >> 8) & 0x00ff) + amt,
            G = (num & 0x0000ff) + amt;

        return (
            "#" +
            (
                0x1000000 +
                (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
                (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
                (G < 255 ? (G < 1 ? 0 : G) : 255)
            )
                .toString(16)
                .slice(1)
        );
    }

    __drawButtonText() {
        var ctx = this.getContext();
        ctx.save();
        ctx.font = "9px Arial";
        var y = this.y + this.h / 2 + 3;
        var x =
            this.x +
            Math.round(this.w / 2) -
            ctx.measureText(this.text).width / 2;
        ctx.fillStyle = this.fontcolor;
        ctx.fillText(this.text, x, y);
        ctx.restore();
    }

    onClick() {}

    __checkClick(e) {
        if (!this.visibility || this.disabled) return;

        if (this.inBounds(e.clientX, e.clientY)) {
            this.click_sound.currentTime = 0;
            this.click_sound.play();
            this.onClick();
        }
    }

    mouseEnter() {
        this.hover_sound.currentTime = 0;
        this.hover_sound.play();
    }

    mouseLeave() {}

    __checkMouseOver(e) {
        if (!this.visibility || this.disabled) return;
        var state = this.inBounds(e.clientX, e.clientY);
        if (this.hover != state) {
            if (state) {
                this.mouseEnter();
            } else {
                this.mouseLeave();
            }
            this.hover = state;
        }
    }
    inBounds(mouseX, mouseY) {
        var rateX = this.scene.canvas.offsetWidth / this.scene.canvas.width;
        var rateY = this.scene.canvas.offsetHeight / this.scene.canvas.height;
        var offsetX = this.scene.canvas.offsetLeft;
        var offsetY = this.scene.canvas.offsetTop;

        var x = rateX * this.x + offsetX;
        var y = rateY * this.y + offsetY;
        var w = rateX * this.w + offsetX / 2;
        var h = rateY * this.h + offsetY / 2;

        return !(mouseX < x || mouseX > x + w || mouseY < y || mouseY > y + h);
    }

    __loadMusic() {
        this.hover_sound = this.__insertSoundObject(this.config.hover_sound);
        this.leave_sound = this.__insertSoundObject(this.config.mouse_leave);
        this.click_sound = this.__insertSoundObject(this.config.mouse_click);
    }

    __pauseAll() {
        [this.hover_sound, this.leave_sound, this.click_sound].forEach((r) => {
            try {
                if (!r.paused) r.pause();
            } catch (e) {}
        });
    }
}
