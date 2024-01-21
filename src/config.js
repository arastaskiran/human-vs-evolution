export class Config {
    constructor() {
        this.canvas_id = "earth";
        this.width = "100%";
        this.height = "100%";
        this.init = false;
        this.population_size = 20;
        this.mutation_probability = 0.01;
        this.number_of_generations = 1000;

        this.fps = 24;
        this.orient_phone =
            "https://assets.humanvsevolution.com/cargo_game/rotate_device.jpg";
        this.product_list = [
            {
                name: "Refrigerator A",
                space: 0.751,
                price: 999.9,
                image: "https://assets.humanvsevolution.com/cargo_game/refrige.jpeg",
            },
            {
                name: "Cell phone",
                space: 0.00000899,
                price: 2199.12,
                image: "https://assets.humanvsevolution.com/cargo_game/phone.png",
            },
            {
                name: "TV 55",
                space: 0.4,
                price: 4346.99,
                image: "https://assets.humanvsevolution.com/cargo_game/tv.png",
            },
            {
                name: "TV 50",
                space: 0.29,
                price: 3999.9,
                image: "https://assets.humanvsevolution.com/cargo_game/tv.png",
            },
            {
                name: "TV 42",
                space: 0.2,
                price: 2999.9,
                image: "https://assets.humanvsevolution.com/cargo_game/tv.png",
            },
            {
                name: "Notebook A",
                space: 0.0035,
                price: 2499.9,
                image: "https://assets.humanvsevolution.com/cargo_game/notebook.png",
            },
            {
                name: "Ventilator",
                space: 0.496,
                price: 199.9,
                image: "https://assets.humanvsevolution.com/cargo_game/ventilator.gif",
            },
            {
                name: "Microwave A",
                space: 0.0424,
                price: 308.66,
                image: "https://assets.humanvsevolution.com/cargo_game/microwave.webp",
            },
            {
                name: "Microwave B",
                space: 0.0544,
                price: 429.9,
                image: "https://assets.humanvsevolution.com/cargo_game/microwave.webp",
            },
            {
                name: "Microwave C",
                space: 0.0319,
                price: 299.29,
                image: "https://assets.humanvsevolution.com/cargo_game/microwave.webp",
            },
            {
                name: "Refrigerator B",
                space: 0.635,
                price: 849.0,
                image: "https://assets.humanvsevolution.com/cargo_game/refrige.jpeg",
            },
            {
                name: "Refrigerator C",
                space: 0.87,
                price: 1199.89,
                image: "https://assets.humanvsevolution.com/cargo_game/refrige.jpeg",
            },
            {
                name: "Notebook B",
                space: 0.498,
                price: 1999.9,
                image: "https://assets.humanvsevolution.com/cargo_game/notebook.png",
            },
            {
                name: "Notebook C",
                space: 0.527,
                price: 3999.0,
                image: "https://assets.humanvsevolution.com/cargo_game/notebook.png",
            },
        ];
        this.container_image =
            "https://assets.humanvsevolution.com/cargo_game/container.webp";
        this.dna_image =
            "https://assets.humanvsevolution.com/cargo_game/dna_image.jpg";
        this.city_sound =
            "https://assets.humanvsevolution.com/cargo_game/city_sound.wav";
        this.ambicent_crow_sound =
            "https://assets.humanvsevolution.com/cargo_game/ambicent_crow.wav";
        this.drop_sound =
            "https://assets.humanvsevolution.com/cargo_game/drop.wav";
        this.error_sound =
            "https://assets.humanvsevolution.com/cargo_game/error_sound.wav";
        this.key_press_sound =
            "https://assets.humanvsevolution.com/cargo_game/key_press.wav";
        this.modal_open_sound =
            "https://assets.humanvsevolution.com/cargo_game/modalopen.wav";
        this.mouse_click_sound =
            "https://assets.humanvsevolution.com/cargo_game/mouseclick.wav";
        this.mouse_hover_sound =
            "https://assets.humanvsevolution.com/cargo_game/mousehover.wav";
        this.mouse_leave_sound =
            "https://assets.humanvsevolution.com/cargo_game/mouseleave.wav";
        this.rain_sound =
            "https://assets.humanvsevolution.com/cargo_game/rain_sound.mp3";
        this.user_monkey =
            "https://assets.humanvsevolution.com/cargo_game/user_monkey.jpeg";
        this.inventory_box =
            "https://assets.humanvsevolution.com/cargo_game/inventory_box.png";
        this.box = "https://assets.humanvsevolution.com/cargo_game/box.png";
        this.enter_selection_sound =
            "https://assets.humanvsevolution.com/cargo_game/enterselection.wav";
        this.minimaze_sound =
            "https://assets.humanvsevolution.com/cargo_game/minimazesnd.wav";
        this.menu_item_change_sound =
            "https://assets.humanvsevolution.com/cargo_game/menuitemchange.wav";
        this.flawless_victory_sound =
            "https://assets.humanvsevolution.com/cargo_game/flawless-victory.wav";
        this.cash_sound =
            "https://assets.humanvsevolution.com/cargo_game/cash.wav";
        this.soft_hit =
            "https://assets.humanvsevolution.com/cargo_game/soft_hit.wav";
    }

    mapConfig(data) {
        for (var item of Object.getOwnPropertyNames(this)) {
            if (typeof data[item] !== "undefined") {
                this[item] = data[item];
            }
        }
    }
}
