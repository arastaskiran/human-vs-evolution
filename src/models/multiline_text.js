import { Scene } from "../scene";
import { BaseView } from "../views/base_view";

export class MultiLineText extends BaseView {
    /**
     *
     * @param {Scene} scene
     */
    constructor(scene, text, color, x, y, maxWidth, lineHeight) {
        super("multiline_text", scene);
        this.text = text;
        this.x = x;
        this.y = y;
        this.maxWidth = maxWidth;
        this.lineHeight = lineHeight;
        this.color = color;
        this.visibility = false;
    }

    visible() {
        this.visibility = true;
    }

    hide() {
        this.visibility = false;
    }

    update() {
        if (!this.visibility) {
            return;
        }
        this.drawText();
    }

    setText(text) {
        this.text = text;
    }

    drawText() {
        var ctx = this.getContext();
        ctx.save();
        var x = this.x;
        var y = this.y;
        var words = this.text.split(" ");
        var line = "";
        ctx.fillStyle = this.color;
        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + " ";
            var metrics = ctx.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > this.maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + " ";
                y += this.lineHeight;
            } else {
                line = testLine;
            }
        }

        ctx.fillText(line, x, y);
        ctx.restore();
    }
}
