import { Config } from "./config";
import { Events } from "./events/app_events";
import { Product } from "./models/product";
import { Evolution } from "./models/evolution";

export class Scene {
    /**
     *
     * @param {Config} config
     * @param {Events} event_bus
     */
    constructor(config, event_bus) {
        this.canvas_id = "blue-tomb-canvas";
        this.canvas = null;
        this.config = config;
        this.events = event_bus;
        this.test();
    }

    test() {
        var spaces=[];
        var prices=[];
        var names=[];      

        var product_list = [
            new Product("Refrigerator A", 0.751, 999.9),
            new Product("Cell phone", 0.00000899, 2199.12),
            new Product("TV 55", 0.4, 4346.99),
            new Product("TV 50", 0.29, 3999.9),
            new Product("TV 42", 0.2, 2999.9),
            new Product("Notebook A", 0.0035, 2499.9),
            new Product("Ventilator", 0.496, 199.9),
            new Product("Microwave A", 0.0424, 308.66),
            new Product("Microwave B", 0.0544, 429.9),
            new Product("Microwave C", 0.0319, 299.29),
            new Product("Refrigerator B", 0.635, 849.0),
            new Product("Refrigerator C", 0.87, 1199.89),
            new Product("Notebook B", 0.498, 1999.9),
            new Product("Notebook C", 0.527, 3999.0),
        ];
        for (var i = 0; i < product_list.length; i++) {
            product_list[i];
            spaces.push(product_list[i].space);
            prices.push(product_list[i].price);
            names.push(product_list[i].name);
        }
        var limit = 0.5;
        var population_size = 20;
        var mutation_probability = 0.01;
        var number_of_generations = 1000;
        var ga = new Evolution(population_size);
        var result = ga.solve(
            mutation_probability,
            number_of_generations,
            spaces,
            prices,
            limit
        );
    }
}
