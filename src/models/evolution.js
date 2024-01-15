import { Individual } from "./individual";
import { Score } from "./score";
export class Evolution {
    constructor(screen, population_size, debug = false) {
        this.screen = screen;
        this.population_size = population_size;
        this.population = [];
        this.generation = 0;
        this.best_solution = null;
        this.list_of_solutions = [];
        this.generations = {};
        this.score = null;
        this.is_done = false;
        this.debug = debug;
        this.started_at = Math.floor(Date.now());
        this.finished_at = null;
    }

    _initilizePopulation(spaces, prices, space_limit) {
        for (var i = 0; i < this.population_size; i++) {
            this.population.push(
                new Individual(this, spaces, prices, space_limit)
            );
        }
        this.best_solution = this.population[0];
    }

    _orderPopulation() {
        this.population = this.population.sort(
            (a, b) => b.score_evalution - a.score_evalution
        );
    }

    _setBestIndividual(individual) {
        this.list_of_solutions.push(individual.score_evalution);
        if (individual.score_evalution > this.best_solution.score_evalution) {
            this.best_solution = individual;
        }
    }

    _sumEvolutions() {
        var sum = 0;
        for (var i = 0; i < this.population.length; i++) {
            sum += this.population[i].score_evalution;
        }
        return sum;
    }

    _selectParent(sum_evaluation) {
        var parent = -1;
        var random_value = Math.random() * sum_evaluation;
        var sum = 0;
        var i = 0;
        while (i < this.population.length && sum < random_value) {
            sum += this.population[i].score_evalution;
            parent += 1;
            i += 1;
        }
        return parent;
    }

    _visualizeGeneration() {
        if (!this.debug) return;
        console.log(this.getBest().toString());
    }

    solve(mutation_probability, number_of_generations, spaces, prices, limit) {
        this._initilizePopulation(spaces, prices, limit);
        this._fitnessPopulation();
        this._orderPopulation();
        this.best_solution = this.getBest();
        this.list_of_solutions.push(this.best_solution.score_evalution);
        this._visualizeGeneration();
        for (var i = 0; i < number_of_generations; i++) {
            this._createNewGeneration(mutation_probability);
        }
        this._visualizeBest();
        this.finished_at = Math.floor(Date.now());
        this.score = new Score(
            this.screen.evolution_limit,
            this.started_at,
            this.finished_at,
            this.best_solution.getProducts()
        );
        this.is_done = true;       
        return this.best_solution;
    }

    _createNewGeneration(mutation_probability) {
        var sum = this._sumEvolutions();
        var new_population = [];
        for (var i = 0; i < this.population_size; i = i + 2) {
            var children = this._sex(
                this._selectParent(sum),
                this._selectParent(sum)
            );
            new_population = new_population.concat([
                children[0].mutation(mutation_probability),
                children[1].mutation(mutation_probability),
            ]);
        }
        this._setNewPopulation(new_population);
        this._fitnessPopulation();
        this._visualizeGeneration();
        this._setBestIndividual(this.getBest());
    }
    _sex(female, male) {
        return this.population[this._sanitPopulationIndex(female)].crossover(
            this.population[this._sanitPopulationIndex(male)]
        );
    }

    getBest() {
        return this.population[0];
    }

    _setNewPopulation(population) {
        this.population = population;
    }

    _fitnessPopulation() {
        for (var i = 0; i < this.population.length; i++) {
            this.population[i].fitness();
        }
    }

    _visualizeBest() {
        if (!this.debug) return;
        console.log("***** BEST SOLUTION *********");
        console.log(this.best_solution.toString());
    }

    _sanitPopulationIndex(index) {
        return index < 0 ? this.population.length - 1 : index;
    }

    register(individual) {
        if (typeof this.generations[individual.generation] === "undefined") {
            this.generations[individual.generation] = [];
        }
        this.generations[individual.generation].push(individual);
    }

    amIWin() {}
}
