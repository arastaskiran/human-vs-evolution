import { Scene } from "../scene";
import { BaseView } from "../views/base_view";

export class Button extends BaseView {
    /**
     *
     * @param {Scene} scene
     */
    constructor(screen, text, color, fontcolor, x, y, w, h) {
        super("button", screen);
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
        this.use_click_sound = true;

        this.__loadMusic();
        var self = this;
        this.screen.canvas.addEventListener(
            "mousedown",
            function (e) {
                self.__checkClick(e);
            },
            false
        );
        this.screen.canvas.addEventListener(
            "mousemove",
            function (e) {
                self.__checkMouseOver(e);
            },
            false
        );
    }

    useClickSound(status) {
        this.use_click_sound = status;
        return this;
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
            if (this.use_click_sound) {
                this.click_sound.currentTime = 0;
                this.click_sound.play();
            }

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
        var rateX = this.screen.canvas.offsetWidth / this.screen.canvas.width;
        var rateY = this.screen.canvas.offsetHeight / this.screen.canvas.height;
        var offsetX = this.screen.canvas.offsetLeft;
        var offsetY = this.screen.canvas.offsetTop;

        var x = rateX * this.x + offsetX;
        var y = rateY * this.y + offsetY;
        var w = rateX * this.w + offsetX / 2;
        var h = rateY * this.h + offsetY / 2;

        return !(mouseX < x || mouseX > x + w || mouseY < y || mouseY > y + h);
    }

    __loadMusic() {
        this.hover_sound = this.__insertSoundObject(
            this.config.mouse_hover_sound
        );
        this.leave_sound = this.__insertSoundObject(
            this.config.mouse_leave_sound
        );
        this.click_sound = this.__insertSoundObject(
            this.config.mouse_click_sound
        );
    }

    __pauseAll() {
        [this.hover_sound, this.leave_sound, this.click_sound].forEach((r) => {
            try {
                if (!r.paused) r.pause();
            } catch (e) {}
        });
    }
}
