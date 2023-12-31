export class Config {
    constructor() {
        this.canvas_id = "earth";
        this.width = "100%";
        this.height = "100%";
        this.init = false;
        this.fps = 24;
    }

    mapConfig(data) {
        for (var item of Object.getOwnPropertyNames(this)) {
            if (typeof data[item] !== "undefined") {
                this[item] = data[item];
            }
        }
    }
}
