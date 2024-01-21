import { Config } from "./config";
import { Events } from "./events/app_events";
import { Product } from "./models/product";
import { Evolution } from "./models/evolution";
import { EvolutionScene } from "./models/evolution_scene";
import { OrientationChange } from "./views/vw_change_orient";
import { Score } from "./models/score";

export class BaseScene extends EvolutionScene {
    /**
     *
     * @param {Config} config
     * @param {Events} event_bus
     */
    constructor(config, event_bus) {
        super();
        this.canvas_id = config.canvas_id;
        this.canvas = null;
        this.context = null;
        this.config = config;
        this.events = event_bus;
        this.game_timer = null;
        this.is_running = false;
        this.update_rate = 1000;
        this.city_sound = null;
        this.first_click = false;
        this.product_list = [];
        this.user_selected = [];
        this.ai = null;
        this._createScene();
        this._loadAudios();
        this._initEvents();
        this.screen_protection = new OrientationChange(this);
        this.user_start_date = null;
        this.user_end_date = null;
        this.user_finish_date = null;
        this.evolution_limit = -1;
        this.score = null;
    }

    startUserSession() {
        this.user_start_date = Math.floor(Date.now() / 1000);
        this.user_end_date =
            this.user_start_date +
            Math.floor(Math.random() * (180 - 60 + 1)) +
            60;

        this.evolution_limit = parseFloat(
            (Math.random() * (4.79920899 - 0.5) + 0.5).toFixed(2)
        );
    }
    endUserSession() {
        this.user_finish_date = Math.floor(Date.now() / 1000);
        this.score = new Score(
            this.evolution_limit,
            this.user_start_date * 1000,
            this.user_finish_date * 1000,
            this.user_selected
        );
    }

    _initEvents() {
        var self = this;
        document.addEventListener("click", (e) => {
            if (!self.first_click) {
                if (self.city_sound != null) {
                    if (self.city_sound.paused) self.city_sound.play();
                }

                self.first_click = true;
            }
        });
    }

    _loadAudios() {
        this.city_sound = this.__insertSoundObject(
            this.config.city_sound,
            true
        );
    }

    _createScene() {
        this.injectCSS(
            `#${this.canvas_id} {
                width:95%;
                height:100%;
                overflow: hidden!important;
                position: fixed;
               
                
            }`
        );
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("id", this.canvas_id);
        this.context = this.canvas.getContext("2d");
        document.getElementById(this.config.canvas_id).appendChild(this.canvas);
        this._loadProducts();
    }

    _loadProducts() {
        var self = this;
        this.config.product_list.forEach((r) => {
            self.product_list.push(
                new Product(r.name, r.space, r.price, r.image)
            );
        });
    }

    _srartGame() {
        if (this.is_running) return;
        this.game_timer = setInterval(this._render, this.update_rate, this);
        this.is_running = true;
    }

    _stopGame() {
        if (!this.is_running) return;
        clearInterval(this._render, this.update_rate, this);
        this.game_timer = null;
        this.is_running = false;
    }

    setFPS(fps) {
        if (fps == 0) {
            alert("fps must greater then 0");
            return;
        }
        this.update_rate = 1000 / fps;
    }

    closed(view) {
        if (view.name == "home") return;
        this.setView("home");
    }

    setView(view_name) {
        if (typeof this.screens[view_name] === "undefined") return;
        if (typeof this.screens[this.current_screen] !== "undefined") {
            this.screens[this.current_screen].close();
        }
        this.clearScreen();
        this.screens[view_name].open();
        this.current_screen = view_name;
    }

    _render(self) {
        if (self._mobileCheck() && self._isPortrait()) {
            self.screen_protection.update();
            return;
        }

        self.clearScreen();
        self._getCurrentScreen().update();
    }

    clearScreen() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    _mobileCheck() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    }

    _isPortrait() {
        return window.matchMedia("(orientation: portrait)").matches;
    }

    _getCurrentScreen() {
        if (typeof this.screens[this.current_screen] === "undefined") {
            this.setView("home");
            return this.screens.home;
        }

        return this.screens[this.current_screen];
    }

    test() {
        var spaces = [];
        var prices = [];
        var names = [];

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
