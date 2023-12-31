export class BaseView {
    constructor(name, screen) {
        this.name = name;
        this.screen = screen;
        this.status = false;
    }
    onLoad() {}
    update() {}
    onClose() {}

    open() {
        if (this.status) return;
        this.status = true;
        this.onLoad();
    }

    close() {
        if (!this.status) return;
        this.status = false;
        this.onClose();
    }
}
