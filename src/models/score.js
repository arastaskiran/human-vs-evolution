export class Score {
    constructor(limit, started_at, finished_at, products, indivual = null) {
        this.indivual = indivual;
        this.spaces = 0;
        this.prices = 0;
        this.started_at = started_at;
        this.finished_at = finished_at;
        this.duration = finished_at - started_at;
        this.products = [];
        this.limit = limit;
        this.setPoducts(products);
    }

    setPoducts(products) {
        this.products = products;
        products.forEach((r) => {
            this.spaces += r.space;
            this.prices += r.price;
        });
    }

    getLimitDiff() {
        this.limit - this.spaces;
    }

    amIWin(score) {
        return (
            this.getLimitDiff() <= score.getLimitDiff() &&
            this.prices >= score.prices &&
            this.duration <= score.duration
        );
    }
}
