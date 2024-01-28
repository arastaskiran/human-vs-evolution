import { BaseView } from "../views/base_view";

export class ProgressBar extends BaseView {
    constructor(screen) {
        super("progress_bar", screen);
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.center = true;
        this.progress = 0;
        this.value = 0;
        this.min_val = 0;
        this.max_val = 100;
        this.use_limit_values = true;
        this.show_progress = true;
        this.limit_padding = 2;
        this.limit_font = "7px Arial";
    }

    setValue(val) {
        this.value = val;
        this.progress = Math.min(
            100,
            Math.max(
                0,
                ((val - this.min_val) / (this.max_val - this.min_val)) * 100
            )
        );
        return this;
    }
    setX(val) {
        this.x = val;
        return this;
    }
    setY(val) {
        this.y = val;
        return this;
    }
    setWidth(val) {
        this.w = val;
        return this;
    }
    setHeight(val) {
        this.h = val;
        return this;
    }
    setCenter(val) {
        this.center = val;
        return this;
    }
    setMinVal(val) {
        this.min_val = val;
        return this;
    }
    setMaxVal(val) {
        this.max_val = val;
        return this;
    }
    setLimitLabels(val) {
        this.use_limit_values = val;
        return this;
    }
    setShowProgress(val) {
        this.show_progress = val;
        return this;
    }

    update() {
        this.__drawBody();
        this.__drawProgressValue();
    }

    getX(add = 0) {
        if (!this.center) return this.x + add;
        return this.screenWidth() / 2 - this.__getTotalWidth() / 2 + add;
    }
    getY(add = 0) {
        return this.y + add;
    }

    __getTotalWidth() {
        if (!this.use_limit_values) return this.w;
        var ctx = this.getContext();
        ctx.font = this.limit_font;
        return (
            ctx.measureText("0%").width +
            ctx.measureText("100%").width +
            this.limit_padding * 2 +
            this.w
        );
    }

    __getLimitPadding() {
        if (!this.use_limit_values) return 0;
        return this.limit_padding;
    }

    __getProgressBeginX(add = 0) {
        if (!this.use_limit_values) return this.getX(add);
        var ctx = this.getContext();
        ctx.font = this.limit_font;
        return (
            this.getX(ctx.measureText("0%").width + this.limit_padding) + add
        );
    }

    __drawBody() {
        var ctx = this.getContext();
        ctx.save();
        ctx.font = this.limit_font;

        var x = this.getX();
        if (this.use_limit_values) {
            ctx.fillStyle = "white";
            var text = "0%";
            var mt = ctx.measureText(text);
            var y_fix = this.h / 2 + mt.fontBoundingBoxAscent / 2;
            ctx.fillText(text, x, this.getY(y_fix));
            x = this.getX(this.__getLimitPadding() + mt.width);
        }

        ctx.strokeStyle = this.__getProgressColor();

        ctx.strokeRect(x, this.getY(), this.w, this.h);
        if (this.use_limit_values) {
            text = "100%";
            mt = ctx.measureText(text);
            y_fix = this.h / 2 + mt.fontBoundingBoxAscent / 2;
            ctx.fillText(
                text,
                x + this.w + this.limit_padding,
                this.getY(y_fix)
            );
        }
        ctx.restore();
    }

    __drawProgressValue() {
        var ctx = this.getContext();
        ctx.save();
        var w = (this.progress * this.w) / 100;

        ctx.fillStyle = this.lightColor(this.__getProgressColor(), 50);
        ctx.fillRect(this.__getProgressBeginX(), this.getY(), w, this.h);

        ctx.fillStyle = this.invertColor(this.__getProgressColor());
        var beginx=this.__getProgressBeginX();
        var text = parseFloat(this.progress).toFixed(2) + "%";
        ctx.font = "11px Arial";
        var mt = ctx.measureText(text);
        var y_fix = this.h / 2 + mt.fontBoundingBoxAscent / 2;
        var x = beginx + this.w / 2 - mt.width / 2;
        ctx.fillText(text, x, this.getY(y_fix-1));

        ctx.restore();
    }

    __getProgressColor() {
        var color = "#fc0b03";
        if (this.progress >= 25 && this.progress < 50) color = "#ed6605";
        else if (this.progress >= 50 && this.progress < 75) color = "#edca05";
        else if (this.progress >= 75) color = "#4aed05";
        return color;
    }
}
