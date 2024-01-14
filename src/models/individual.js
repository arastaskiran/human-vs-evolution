export class Individual {
    constructor(planet, spaces, prices, space_limit, generation = 0) {
        this.planet = planet;
        this.id = this._getID(16);
        this.spaces = spaces;
        this.prices = prices;
        this.space_limit = space_limit;
        this.generation = generation;
        this.chromosome = [];
        this.score_evalution = 0;
        this.birthday = Math.floor(Date.now());
        this.used_space = 0;
        this.wife = null;
        this.mother = null;
        this.father = null;
        this.childs = [];

        this._generateChromosome();
        this.planet.register(this);
    }
    carbon14() {
        return this.planet.started_at - this.birthday;
    }

    setWife(individual) {
        this.wife = individual;
        return this;
    }
    setMother(individual) {
        this.mother = individual;
        return this;
    }
    setFather(individual) {
        this.father = individual;
        return this;
    }
    fitness() {
        var score = 0;
        var sum_spaces = 0;

        for (var i = 0; i < this.chromosome.length; i++) {
            if (this._isGenEQ(i, 1)) {
                score += this.prices[i];
                sum_spaces += this.spaces[i];
            }
        }
        if (sum_spaces > this.space_limit) score = 1;

        this.score_evalution = score;
        this.used_space = sum_spaces;
    }
    setChromosome(chromosome) {
        this.chromosome = chromosome;
        return this;
    }

    crossover(other_individual) {
        this.setWife(other_individual);
        other_individual.setWife(this);
        var cutoff = Math.round(Math.random() * this.chromosome.length);
        var child1 = this._crisprLeft(
            other_individual.chromosome,
            cutoff
        ).concat(this._crisprRight(this.chromosome, cutoff));
        var child2 = this._crisprLeft(this.chromosome, cutoff).concat(
            this._crisprRight(other_individual.chromosome, cutoff)
        );

        return this.__born(child1, child2);
    }

    __born(child1, child2) {
        var childs = this._generateNewPopulation([child1, child2]);
        this.__setChilds(childs);
        this.wife.__setChilds(childs);
        return childs;
    }

    __setChilds(childs) {
        this.childs = childs;
    }

    mutation(rate) {
        for (var i = 0; i < this.chromosome.length; i++) {
            if (Math.random() > rate) continue;
            this.chromosome[i] = this._isGenEQ(i, 1) ? 0 : 1;
        }
        return this;
    }

    _crisprLeft(chromosome, size) {
        return chromosome.slice(0, size);
    }
    _crisprRight(chromosome, size) {
        return chromosome.slice(size, chromosome.length);
    }

    _generateChromosome() {
        for (var i = 0; i < this.spaces.length; i++) {
            this.chromosome.push(Math.random() < 0.5 ? 0 : 1);
        }
    }

    _isGenEQ(index, ref) {
        return this.chromosome[index] == ref;
    }

    _generateNewPopulation(chromosomes) {
        var population = [];
        for (var i = 0; i < chromosomes.length; i++) {
            population.push(
                new Individual(
                    this.planet,
                    this.spaces,
                    this.prices,
                    this.space_limit,
                    this.generation + 1
                )
                    .setMother(this)
                    .setFather(this.wife)
                    .setChromosome(chromosomes[i])
            );
        }
        return population;
    }

    toString() {
        return `Generation:${this.generation} | Total price:${
            this.score_evalution
        } | Space: ${
            this.used_space
        } | Chromosome:${this.chromosome.toString()} `;
    }
    _getID(length) {
        return Math.random()
            .toString(36)
            .substring(2, length + 2);
    }

    getProducts() {
        var products = [];
        for (var i = 0; i < this.chromosome.length; i++) {
            if (this._isGenEQ(i, 1)) {
                products.push(this.planet.screen.product_list[i]);
            }
        }
        return products;
    }
}
