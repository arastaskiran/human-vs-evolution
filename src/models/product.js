export class Product {
    constructor(name, space, price, image) {
        this.id = this._getID(16);
        this.name = name;
        this.space = space;
        this.price = price;
        this.image = new Image();
        this.image.src = image;
        this.image.onload = function () {};
    }

    _getID(length) {
        return Math.random()
            .toString(36)
            .substring(2, length + 2);
    }
}
